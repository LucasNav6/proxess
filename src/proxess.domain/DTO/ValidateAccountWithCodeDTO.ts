import { IsEmail, IsNotEmpty, IsString, Length } from '@nestjs/class-validator';

export class ValidateAccountWithCodeDTO {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @Length(8, 8)
  code: string;
}
