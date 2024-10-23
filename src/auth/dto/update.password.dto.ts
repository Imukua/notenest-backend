import { ApiProperty } from '@nestjs/swagger';

export class UpdatePasswordDto {
  @ApiProperty({ example: 'oldPassword123', description: 'The current password of the user' })
  currentPassword: string;

  @ApiProperty({ example: 'newPassword456', description: 'The new password to set for the user' })
  newPassword: string;
}
