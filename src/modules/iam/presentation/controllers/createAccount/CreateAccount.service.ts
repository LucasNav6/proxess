import {
  createAccountControllerDTO,
  validateCreateAccountControllerDTO,
} from '@/modules/iam/application/dto/createAccountController.dto';
import { EmailRepository } from '@/modules/iam/infraestructure/persistence/repository/email.repository';
import { EncryptionRepository } from '@/modules/iam/infraestructure/persistence/repository/encryption.repository';
import { MasterUserRepository } from '@/modules/iam/infraestructure/persistence/repository/masterUser.repository';
import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class CreateAccountService {
  constructor(
    private readonly masterUserRepository: MasterUserRepository,
    private readonly emailRepository: EmailRepository,
    private readonly encryptionRepository: EncryptionRepository,
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
  public async validateTheAccountCreatedWithCodeService(
    query: validateCreateAccountControllerDTO,
  ) {
    const user = await this.masterUserRepository.getByEmailInactiveUser(
      query.email,
    );
    if (user.length === 0) throw new BadRequestException('User not found');
    if (!user[0].accessCode) throw new BadRequestException('Code not valid');
    const decryptedCode = await this.encryptionRepository.decrypt(
      user[0].accessCode,
    );

    const JSONDecodedCode = JSON.parse(decryptedCode) as {
      accessCode: string;
      expiration: string;
    };

    if (JSONDecodedCode.expiration < new Date().toISOString())
      throw new BadRequestException('Code expired');

    if (JSONDecodedCode.accessCode !== query.code)
      throw new BadRequestException('Code not valid');

    await this.masterUserRepository.activeUser(user[0].userUUID);

    return { message: 'Account active successfully' };
  }
}
