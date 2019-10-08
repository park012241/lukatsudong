import {ForbiddenException, Injectable} from '@nestjs/common';
import {Collection} from 'mongodb';
import {IProblem, IUser, IUserNew, Problem, ProblemListElement, User, UserToken} from '@app/types';
import {Database} from '@app/database';
import {classToPlain} from 'class-transformer';
import {collectionName, masterSecret, sign, verify} from '@app/config';

@Injectable()
export class UsersService {
    private problemCollection: Collection<IProblem>;
    private usersCollection: Collection<IUser>;

    constructor() {
        this.problemCollection = Database.collection(collectionName.problems);
        this.usersCollection = Database.collection(collectionName.users);
    }

    public get users(): Promise<User[]> {
        return this.usersCollection.find().toArray().then((arr: IUser[]) => {
            return arr.map((i) => {
                return new User(i);
            });
        });
    }

    public async addUser(user: IUserNew) {
        await this.usersCollection.insertOne(Object.assign(user, {
            problems: {
                solved: [],
            },
        }));
    }

    public async getUser(userName: string): Promise<User> {
        const arr = await this.usersCollection.find({userName});
        if (await arr.count() === 0) {
            throw new Error('There is no user with that username');
        }
        const user = (await arr.toArray()).map((i) => {
            return new User(i);
        })[0];
        return Object.assign(user, {
            score: await (async () => {
                const problems = Database.collection<IProblem>(collectionName.problems);
                return Promise.all<number>(user.problems.solved.map(async (i) => {
                    return i ? (await problems.find({_id: i}).toArray())[0].score : undefined;
                })).then((arr: (number | undefined)[]) => {
                    return arr.reduce((p, c) => {
                        return p + (c || 0);
                    }, 0);
                });
            })(),
        });
    }

    public async getToken({userName, password}: {
        userName: string;
        password: string;
    }): Promise<string> {
        const user = await this.getUser(userName);
        if (user.password !== password) {
            throw new Error('Auth failed');
        }
        return sign(classToPlain(new UserToken(user.objectId)));
    }

    public async solve(token: string, flag: string): Promise<ProblemListElement> {
        const user: User = await this.usersCollection.find({_id: verify(token).id}).toArray().then((arr) => {
            if (arr.length === 0) {
                throw new Error('Couldn\'t find user');
            }
            return new User(arr[0]);
        });
        const problem: Problem = await this.problemCollection.find({flag}).toArray().then((arr) => {
            if (arr.length === 0) {
                throw new Error('There is no problem with that flag');
            }
            return new Problem(arr[0]);
        });

        await this.usersCollection.updateOne({_id: user.objectId}, {
            $push: {'problems.solved': problem.objectId},
        });

        return new ProblemListElement(problem);
    }

    public async makeAdmin(token: string, secret: string): Promise<void> {
        if (secret !== masterSecret) {
            throw new ForbiddenException('Secret Auth Failed');
        }
        const userId = verify(token).id;
        await this.usersCollection.updateOne({_id: userId}, {$set: {isAdmin: true}});
    }
}
