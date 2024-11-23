import { IsEmail, IsNotEmpty } from '@nestjs/class-validator';

export class createAccountControllerDTO {
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
