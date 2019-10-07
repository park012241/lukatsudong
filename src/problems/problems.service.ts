import {Injectable} from '@nestjs/common';
import {Collection, ObjectId} from 'mongodb';
import {IProblem, Problem} from '@app/types';
import {Database} from '@app/database';

@Injectable()
export class ProblemsService {
    private collection: Collection<IProblem>;

    constructor() {
        this.collection = Database.collection('problems');
    }

    public get problems(): Promise<Problem[]> {
        return this.collection.find().toArray().then((arr) => {
            return arr.map((i) => {
                return new Problem(i);
            });
        });
    }

    public async addProblems(p: Problem) {
        await this.collection.insertOne(p);
    }

    public async getProblemById(id: ObjectId): Promise<Problem[]> {
        return this.collection.find({_id: id}).toArray().then((arr) => {
            if (arr.length === 0) {
                throw new Error('There is no problem with that id');
            }
            return arr.map((i) => {
                return new Problem(i);
            });
        });
    }
}
