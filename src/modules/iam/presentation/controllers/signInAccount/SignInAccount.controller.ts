import {
  Controller,
  Post,
  Query,
  Req,
  UseFilters,
  UsePipes,
} from '@nestjs/common';
import { CatchExceptionFilter } from '@/shared/filters/exceptions.filter';
import { DTOValidationPipes } from '@/shared/pipes/validation.pipes';
import {
  createAccountControllerDTO,
  validateCreateAccountControllerDTO,
} from '@/modules/iam/application/dto/createAccountController.dto';
import { SignInAccountService } from './SignInAccount.service';

@Controller('iam')
export class SignInAccountController {
  constructor(private readonly service: SignInAccountService) {}

  @Post('openSession')
  @UseFilters(CatchExceptionFilter)
  @UsePipes(DTOValidationPipes)
  public async openSession(
    @Query() query: createAccountControllerDTO,
    @Req() req: Request,
  ) {
    const userAgent = req.headers['user-agent'];
    return await this.service.openSessionWithActivated(query, userAgent);
  }

  @Post('validateSession')
  @UseFilters(CatchExceptionFilter)
  @UsePipes(DTOValidationPipes)
  public async validateTheAccountCreatedWithCode(
    @Query() query: validateCreateAccountControllerDTO,
    @Req() req: Request,
  ) {
    const userAgent = req.headers['user-agent'];
    return await this.service.validateTheAccountWithCodeService(
      query,
      userAgent,
    );
  }
}
