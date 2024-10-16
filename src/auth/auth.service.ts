import { Injectable } from '@nestjs/common';
import { Auth } from './auth';
import { AuthPayloadDto } from './dto/auth.dto';

const fakeUsers = [ 
    {
        id: 1,
        username: 'admin',
        passwordHash: 'admin'
    },
    {
        id: 2,
        username: 'user',
        passwordHash: 'user'
    }
];
@Injectable()
export class AuthService {
    validateUser({username, passwordHash}: AuthPayloadDto) {
        const user = fakeUsers.find(user => user.username === username && user.passwordHash === passwordHash);
        if (!user) return null;


    }
}
