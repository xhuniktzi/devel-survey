import { ApiProperty } from '@nestjs/swagger';

export class LoginAndRegisterDto {
  @ApiProperty({ description: 'Username of the user', example: 'admin' })
  username: string;

  @ApiProperty({ description: 'Password of the user', example: 'password123' })
  password: string;
}
