import {IsEmail, IsOptional, IsString} from 'class-validator';
import {IUserNew} from '@app/types';

export class UserDto implements IUserNew {
    @IsEmail()
    email: string;
    @IsString()
    nickname: string;
    @IsString()
    password: string;
    @IsOptional()
    @IsString()
    github?: string;
    @IsOptional()
    @IsString()
    facebook?: string;
    @IsOptional()
    @IsString()
    twitter?: string;
    @IsString()
    userName: string;
}

export class getUserDto {
    @IsString()
    userName: string;
}

