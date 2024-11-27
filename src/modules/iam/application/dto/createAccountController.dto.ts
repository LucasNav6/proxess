import { IsEmail, IsNotEmpty } from '@nestjs/class-validator';
import { IsString, Length } from 'class-validator';

export class createAccountControllerDTO {
  @IsNotEmpty()
  @IsEmail()
  email: string;
}

export class validateCreateAccountControllerDTO {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @Length(6)
  code: string;
}
