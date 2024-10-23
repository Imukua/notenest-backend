import { ApiProperty } from '@nestjs/swagger';

export class UpdateUsernameDto {
  @ApiProperty({ example: 'newUsername', description: 'The new username to set for the user' })
  newUsername: string;
}
