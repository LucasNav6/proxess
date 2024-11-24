import { Controller, Get, UseFilters } from '@nestjs/common';
import { CatchExceptionFilter } from '@/shared/filters/exceptions.filter';

@Controller('status')
export class StatusController {
  constructor() {}

  @Get('check')
  @UseFilters(CatchExceptionFilter)
  public async checkStatus() {
    return {
      status: 'ok',
    };
  }
}
