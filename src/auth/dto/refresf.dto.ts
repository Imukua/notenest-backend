import { ApiProperty } from '@nestjs/swagger';

export class refreshTokenDto {
    @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...', description: 'The refresh token' })
    refreshToken: string;
}
