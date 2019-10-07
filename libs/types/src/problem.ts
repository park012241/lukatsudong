import {Exclude, Expose} from 'class-transformer';
import {IsInt, IsString} from 'class-validator';
import {ObjectId} from 'mongodb';

export interface IProblem {
    title: string;
    description: string;
    score: number;
    binary: string;
    flag: string;
}

export class Problem implements IProblem {
    public _id: ObjectId;

    public get objectId(): ObjectId {
        return this._id;
    }

    @IsString()
    public title: string;
    @IsString()
    public description: string;
    @IsInt()
    public score: number;
    @IsString()
    public binary: string;
    @IsString()
    public flag: string;

    constructor(p: Partial<IProblem>) {
        Object.assign(this, p);
    }
}

export class ProblemListElement implements IProblem {
    @Exclude()
    private _id: ObjectId;

    @Expose()
    get id(): string {
        return this._id.toHexString();
    }

    binary: string;
    description: string;
    @Exclude()
    flag: string;
    score: number;
    title: string;

    constructor(p: Partial<Problem>) {
        Object.assign(this, p);
    }
}
