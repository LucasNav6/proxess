import { Controller, Post, Query, Headers, UseFilters } from '@nestjs/common';
import { IncomingHttpHeaders } from 'http';
import { CreateAccountService } from './createAccount.service';
import { Exceptions } from '@/proxess.domain/Exceptions/Exceptions';
import { CreateAccountDTO } from '@/proxess.domain/DTO/CreateAccountDto';
import { ValidateAccountWithCodeDTO } from '@/proxess.domain/DTO/validateAccountWithCodeDTO';

@Controller('auth')
export class CreateAccountController {
  constructor(private readonly service: CreateAccountService) {}

  @Post('create-account')
  @UseFilters(Exceptions)
  public async createAccountWithoutValidation(
    @Query() query: CreateAccountDTO,
    @Headers() headers: IncomingHttpHeaders,
  ) {
    const userAgent = headers['user-agent'];
    const response = await this.service.createAccountWithoutValidation(
      query.email,
      userAgent,
    );
    return response;
  }

  @Post('validate-account-with-code')
  @UseFilters(Exceptions)
  public async validateTheAccountCreatedWithCode(
    @Query() headers: ValidateAccountWithCodeDTO,
  ) {
    await this.service.validateTheAccountCreatedWithCode(
      headers.email,
      headers.code,
    );
  }
}
