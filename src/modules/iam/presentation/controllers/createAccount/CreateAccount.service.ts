import { createAccountControllerDTO } from '@/modules/iam/application/dto/createAccountController.dto';
import { EmailRepository } from '@/modules/iam/infraestructure/persistence/repository/email.repository';
import { MasterUserRepository } from '@/modules/iam/infraestructure/persistence/repository/masterUser.repository';
import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class CreateAccountService {
  constructor(
    private readonly masterUserRepository: MasterUserRepository,
    private readonly emailRepository: EmailRepository,
  ) {}
  public async createAdminAccountWithoutValidationService(
    query: createAccountControllerDTO,
  ) {
    try {
      const users = await this.masterUserRepository.getByEmail(query.email);
      if (users.length > 0)
        throw new BadRequestException('User already exists');

      const userCreated = await this.masterUserRepository.createInactiveUser(
        query.email,
      );

      await this.emailRepository.sendEmail(
        query.email,
        'Welcome to Proxess',
        'Code: ' + userCreated.CODE,
      );
    } catch (error) {
      throw new Error(error.message);
    }
  }
  public async validateTheAccountCreatedWithCodeService() {}
}
