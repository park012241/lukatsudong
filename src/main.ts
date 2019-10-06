import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {Database} from '@app/database';
import {config} from 'dotenv';

config();

async function bootstrap() {
    Database.connectionURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/lukatsudong';
    await Database.client.connect();
    const app = await NestFactory.create(AppModule);
    await app.listen(process.env.PORT || 3000);
}

bootstrap().then();
