import { EmailApplication } from '@/proxess.application/email/email.application';
import { UserTenant } from '@/proxess.application/user/userTenant';
import { UserTenantDataBase } from '@/proxess.application/user/userTenantDataBase';
import { CREATION_ACCOUNT_TEMPLATE } from '@/proxess.domain/contracts/templates';
import {
  BadGatewayException,
  BadRequestException,
  Injectable,
} from '@nestjs/common';

@Injectable()
export class CreateAccountService {
  userTenantApplication = new UserTenant();
  emailApplication = new EmailApplication();
  userDataBase = new UserTenantDataBase();
  async createAccountWithoutValidation(
    email: string,
    userAgent?: string,
  ): Promise<{ email: string } | BadGatewayException | BadRequestException> {
    //1. Valid the user input data to process the request
    const isUserTenantExists =
      await this.userTenantApplication.validateUserExist(email);

    //If the user already exists return an error
    if (isUserTenantExists)
      throw new BadRequestException('User already exists');

    //2. Create the user in the database
    const user =
      await this.userTenantApplication.createAccountWithoutValidation(email);

    //3. Send a magic link with the sign-in link
    const CreationAccountTemplate = await this.emailApplication.getPugTemplate(
      CREATION_ACCOUNT_TEMPLATE,
      {
        NAME: email.split('@')[0],
        EMAIL: email,
        SIGNIN_LINK: process.env.PROXESS_LINK,
        LOCATION: userAgent.split('(')[0],
        CODE: user.tempCode,
      },
    );

    await this.emailApplication.sendEmail({
      emailTo: email,
      subject: 'Active your account',
      template: CreationAccountTemplate,
    });

    return {
      email: email,
    };
  }

  async validateTheAccountCreatedWithCode(
    email: string,
    code: string,
  ): Promise<void | BadGatewayException | BadRequestException> {
    if (!code) throw new Error('Code is required');
    if (!email) throw new Error('Email is required');
    if (typeof code !== 'string') throw new Error('Code must be a string');
    //1. Valid the user input data to process the request
    const user =
      await this.userDataBase.getUserTenantDataByEmailInactive(email);
    if (!user) throw new Error('User not found');

    //2. Process the request
    const isValidCode =
      await this.userTenantApplication.validateTheAccountCreatedWithCode(
        email,
        code,
      );
    if (!isValidCode) throw new Error('Invalid code');
  }
}
