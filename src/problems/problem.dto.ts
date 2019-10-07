import {Problem} from '@app/types';
import {IsInt, IsString} from 'class-validator';

export class ProblemGetDto {
    id: string;
}

export class ProblemAddDto extends Problem {
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
    @IsString()
    public token: string;
}
