import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import { ProblemsModule } from './problems/problems.module';
import { UsersModule } from './users/users.module';

@Module({
    imports: [ProblemsModule, UsersModule],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {
}
