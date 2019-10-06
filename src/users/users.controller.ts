import {Body, ClassSerializerInterceptor, Controller, Get, Param, Put, UseInterceptors, ValidationPipe} from '@nestjs/common';
import {UsersService} from './users.service';
import {User} from '@app/types';
import {getUserDto, UserDto} from './users.dto';

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
    public getUserByUserName(@Param() {userName}: getUserDto) {
        return this.usersService.getUser(userName);
    }
}
