import {Injectable} from '@nestjs/common';
import {Collection} from 'mongodb';
import {IProblem, IUser, IUserNew, User} from '@app/types';
import {Database} from '@app/database';

@Injectable()
export class UsersService {
    private problemCollection: Collection<IProblem>;
    private usersCollection: Collection<IUser>;

    constructor() {
        this.problemCollection = Database.collection('problemCollection');
        this.usersCollection = Database.collection('users');
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
}
