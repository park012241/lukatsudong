import {ObjectId} from 'mongodb';
import {Exclude, Expose, Transform} from 'class-transformer';

export interface IUserNew {
    userName: string;
    nickname: string;
    password: string;
    email: string;
    github?: string;
    facebook?: string;
    twitter?: string;
    isAdmin: boolean;
}

export interface IUser extends IUserNew {
    problems: {
        solved: ObjectId[];
    };
}

export class User implements IUser {
    @Exclude()
    private _id: ObjectId;

    @Expose()
    public get id(): string {
        return this._id.toHexString();
    }

    score: number;
    @Transform(({solved}: {
        solved: ObjectId[];
    }) => {
        return {
            solved: solved.map((i) => i.toHexString()),
        };
    })
    problems: { solved: ObjectId[] };
    email: string;
    facebook?: string;
    github?: string;
    nickname: string;
    @Exclude()
    password: string;
    isAdmin: boolean;
    twitter?: string;
    userName: string;

    constructor(u: Partial<IUser>) {
        Object.assign(this, u);
    }

    @Exclude()
    public get objectId(): ObjectId {
        return this._id;
    }
}

export class UserToken {
    @Transform((objectId: ObjectId) => objectId.toHexString())
    id: ObjectId;

    constructor(id: ObjectId) {
        this.id = id;
    }
}
