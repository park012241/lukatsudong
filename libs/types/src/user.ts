import {ObjectId} from 'mongodb';
import {Exclude, Expose} from 'class-transformer';

export interface IUserNew {
    userName: string;
    nickname: string;
    password: string;
    email: string;
    github?: string;
    facebook?: string;
    twitter?: string;
}

export interface IUser extends IUserNew {
    problems: {
        tried: ObjectId[];
        solved: ObjectId[];
    };
}

export class User implements IUser {
    @Exclude()
    _id: ObjectId;
    @Expose()
    public get id(): string {
        return this._id.toHexString();
    }

    email: string;
    facebook?: string;
    github?: string;
    nickname: string;
    @Exclude()
    password: string;
    problems: { tried: ObjectId[]; solved: ObjectId[] };
    twitter?: string;
    userName: string;

    constructor(u: Partial<IUser>) {
        Object.assign(this, u);
    }
}
