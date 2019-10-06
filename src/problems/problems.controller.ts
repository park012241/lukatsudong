import {Body, ClassSerializerInterceptor, Controller, Get, Header, Param, Put, UseInterceptors, ValidationPipe} from '@nestjs/common';
import {ProblemsService} from './problems.service';
import {Problem, ProblemListElement} from '@app/types';
import {ProblemsDto} from './problems.dto';
import {ObjectId} from 'mongodb';

@Controller('problems')
export class ProblemsController {
    private problemsService: ProblemsService;

    constructor() {
        this.problemsService = new ProblemsService();
    }

    @Get()
    @UseInterceptors(ClassSerializerInterceptor)
    public async getProblems(): Promise<ProblemListElement[]> {
        return (await this.problemsService.problems).map((i) => {
            return new ProblemListElement(i);
        });
    }

    @Put()
    public async addProblem(@Body(new ValidationPipe()) p: Problem) {
        await this.problemsService.addProblems(p);
        return 'OK';
    }

    @Get(':id')
    @UseInterceptors(ClassSerializerInterceptor)
    @Header('Cache-Control', ' no-cache, no-store, must-revalidate')
    public async getProblemById(@Param() {id}: ProblemsDto): Promise<ProblemListElement> {
        return (await this.problemsService.getProblemById(ObjectId.createFromHexString(id))).map((i) => {
            return new ProblemListElement(i);
        })[0];
    }
}
