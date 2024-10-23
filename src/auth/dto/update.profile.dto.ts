import { ApiProperty } from '@nestjs/swagger';

export class UpdateProfileDto {
  @ApiProperty({ example: 'updatedUsername', description: 'The updated username for the user' })
  username: string;

  @ApiProperty({ example: 'updatedPassword123', description: 'The updated password for the user' })
  password: string;
}
