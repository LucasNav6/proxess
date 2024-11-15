import { IsEmail, IsNotEmpty } from '@nestjs/class-validator';

export class CreateAccountDTO {
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
