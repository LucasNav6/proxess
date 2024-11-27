import { Controller, Post, Query, UseFilters, UsePipes } from '@nestjs/common';
import { CreateAccountService } from './CreateAccount.service';
import { CatchExceptionFilter } from '@/shared/filters/exceptions.filter';
import { DTOValidationPipes } from '@/shared/pipes/validation.pipes';
import {
  createAccountControllerDTO,
  validateCreateAccountControllerDTO,
} from '@/modules/iam/application/dto/createAccountController.dto';

@Controller('iam')
export class CreateAccountController {
  constructor(private readonly service: CreateAccountService) {}

  @Post('createAccount')
  @UseFilters(CatchExceptionFilter)
  @UsePipes(DTOValidationPipes)
  public async createAdminAccountWithoutValidation(
    @Query() query: createAccountControllerDTO,
  ) {
    return await this.service.createAdminAccountWithoutValidationService(query);
  }

  @Post('validateAccount')
  @UseFilters(CatchExceptionFilter)
  @UsePipes(DTOValidationPipes)
  public async validateTheAccountCreatedWithCode(
    @Query() query: validateCreateAccountControllerDTO,
  ) {
    return await this.service.validateTheAccountCreatedWithCodeService(query);
  }
}
