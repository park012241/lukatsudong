import {Injectable} from '@nestjs/common';
import {Collection} from 'mongodb';
import {IProblem, IUser, IUserNew, User, UserToken} from '@app/types';
import {Database} from '@app/database';
import {randomBytes} from 'crypto';
import {sign} from 'jsonwebtoken';
import {classToPlain} from 'class-transformer';

@Injectable()
export class UsersService {
    private problemCollection: Collection<IProblem>;
    private usersCollection: Collection<IUser>;

    private readonly tokenSecret: string;

    constructor() {
        this.problemCollection = Database.collection('problemCollection');
        this.usersCollection = Database.collection('users');
        this.tokenSecret = randomBytes(64).toString();
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
                tried: [],
                solved: [],
            },
        }));
    }

    public async getUser(userName: string): Promise<User> {
        return this.usersCollection.find({userName}).toArray().then((arr) => {
            if (arr.length === 0) {
                throw new Error('There is no user with that username');
            }
            return arr.map((i) => {
                return new User(i);
            })[0];
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
        return sign(classToPlain(new UserToken(user)), this.tokenSecret, {
            expiresIn: 360000,
        });
    }
}
