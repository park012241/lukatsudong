import {Body, ClassSerializerInterceptor, Controller, Get, Param, Post, Put, UseInterceptors, ValidationPipe} from '@nestjs/common';
import {UsersService} from './users.service';
import {User} from '@app/types';
import {AuthUserDto, GetUserDto, UserDto} from './users.dto';

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
            await this.usersService.addUser(user);
            return {msg: 'OK'};
        } catch (e) {
            return {statusCode: 400, msg: e.message};
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
            return {
                statusCode: 403,
                msg: e.message,
            };
        }
    }
}
