import {randomBytes} from 'crypto';
import {UserToken} from '@app/types';
import {ObjectId} from 'bson';
import {sign as s, verify as v} from 'jsonwebtoken';

export const collectionName = {
    problems: 'problems',
    users: 'users',
};

export const tokenSecret = process.env.JWT_SECRET ? Buffer.from(process.env.JWT_SECRET) : randomBytes(64);

export function sign(payload: object) {
    return s(payload, tokenSecret, {
        expiresIn: 360000,
    });
}

export function verify(token: string): UserToken {
    return new UserToken(ObjectId.createFromHexString((v(token, tokenSecret) as {
        id: string,
    }).id));
}
