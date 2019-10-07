import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {Collection, ObjectId} from 'mongodb';
import {IProblem, IUser, Problem} from '@app/types';
import {Database} from '@app/database';
import {collectionName, verify} from '@app/config';
import {ProblemAddDto} from './problem.dto';
import {classToClass} from 'class-transformer';

@Injectable()
export class ProblemsService {
    private problemCollection: Collection<IProblem>;
    private userCollection: Collection<IUser>;

    constructor() {
        this.problemCollection = Database.collection(collectionName.problems);
        this.userCollection = Database.collection(collectionName.users);
    }

    public get problems(): Promise<Problem[]> {
        return this.problemCollection.find().toArray().then((arr) => {
            return arr.map((i) => {
                return new Problem(i);
            });
        });
    }

    public async addProblems(p: ProblemAddDto) {
        if (!(await this.userCollection.find({
            _id: verify(p.token).id,
        }).toArray())[0].isAdmin) {
            throw new HttpException({
                status: HttpStatus.FORBIDDEN,
                error: 'Only admin can add problems',
            }, HttpStatus.FORBIDDEN);
        }
        await this.problemCollection.insertOne(classToClass(p));
    }

    public async getProblemById(id: ObjectId): Promise<Problem[]> {
        return this.problemCollection.find({_id: id}).toArray().then((arr) => {
            if (arr.length === 0) {
                throw new Error('There is no problem with that id');
            }
            return arr.map((i) => {
                return new Problem(i);
            });
        });
    }
}
