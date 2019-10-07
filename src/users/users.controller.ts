import {
    Body,
    ClassSerializerInterceptor,
    Controller,
    Get,
    HttpException,
    HttpStatus,
    Param,
    Post,
    Put,
    UseInterceptors,
    ValidationPipe,
} from '@nestjs/common';
import {UsersService} from './users.service';
import {User} from '@app/types';
import {AuthUserDto, GetUserDto, SolveDto, UserDto} from './users.dto';

@Controller('users')
export class UsersController {
    private usersService: UsersService;

    constructor() {
        this.usersService = new UsersService();
    }

    @Get()
    @UseInterceptors(ClassSerializerInterceptor)
    public getUsers(): Promise<User[]> {
        return this.usersService.users;
    }

    @Put()
    public async addUser(@Body(new ValidationPipe()) user: UserDto) {
        try {
            await this.usersService.addUser(Object.assign(user, {
                isAdmin: false,
            }));
            return {msg: 'OK'};
        } catch (e) {
            throw new HttpException({
                status: HttpStatus.BAD_REQUEST,
                error: e.message,
            }, HttpStatus.BAD_REQUEST);
        }
    }

    @Get(':userName')
    @UseInterceptors(ClassSerializerInterceptor)
    public getUserByUserName(@Param() {userName}: GetUserDto) {
        return this.usersService.getUser(userName);
    }

    @Post()
    public async getToken(@Body(new ValidationPipe()) auth: AuthUserDto) {
        try {
            return {
                token: await this.usersService.getToken(auth),
            };
        } catch (e) {
            throw new HttpException({
                status: HttpStatus.BAD_REQUEST,
                error: e.message,
            }, HttpStatus.BAD_REQUEST);
        }
    }

    @Put('solve')
    @UseInterceptors(ClassSerializerInterceptor)
    public async solve(@Body(new ValidationPipe()) {flag, token}: SolveDto) {
        try {
            return await this.usersService.solve(token, flag);
        } catch (e) {
            throw new HttpException({
                status: HttpStatus.BAD_REQUEST,
                error: e.message,
            }, HttpStatus.BAD_REQUEST);
        }
    }
}
