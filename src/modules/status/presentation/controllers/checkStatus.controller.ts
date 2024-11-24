import { Controller, Get, UseFilters } from '@nestjs/common';
import { CatchExceptionFilter } from '@/shared/filters/exceptions.filter';

@Controller('status')
export class CreateAccountController {
  constructor() {}

  @Get('check')
  @UseFilters(CatchExceptionFilter)
  public async createAdminAccountWithoutValidation() {
    return {
      status: 'ok',
    };
  }
}
