import {
  createAccountControllerDTO,
  validateCreateAccountControllerDTO,
} from '@/modules/iam/application/dto/createAccountController.dto';
import { EmailRepository } from '@/modules/iam/infraestructure/persistence/repository/email.repository';
import { EncryptionRepository } from '@/modules/iam/infraestructure/persistence/repository/encryption.repository';
import { MasterSessionRepository } from '@/modules/iam/infraestructure/persistence/repository/masterSession.repository';
import { MasterUserRepository } from '@/modules/iam/infraestructure/persistence/repository/masterUser.repository';
import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class SignInAccountService {
  constructor(
    private readonly masterSessionRepository: MasterSessionRepository,
    private readonly masterUserRepository: MasterUserRepository,
    private readonly emailRepository: EmailRepository,
    private readonly encryptionRepository: EncryptionRepository,
    private jwtService: JwtService,
  ) {}
  public async openSessionWithActivated(
    query: createAccountControllerDTO,
    userAgent: string,
  ) {
    try {
      const users = await this.masterUserRepository.getByEmail(query.email);
      if (users.length === 0) throw new BadRequestException('User not found');

      const sessionCreated =
        await this.masterSessionRepository.createInactiveSession(
          users[0].userUUID,
          userAgent,
        );

      await this.emailRepository.sendEmail(
        query.email,
        'Magic link to Proxess',
        'Code: ' + sessionCreated.ACCESS_CODE,
      );
    } catch (error) {
      throw new Error(error.message);
    }
  }
  public async validateTheAccountWithCodeService(
    query: validateCreateAccountControllerDTO,
    userAgent: string,
  ) {
    const sessions = await this.masterSessionRepository.getInactiveSession(
      query.email,
    );
    if (sessions.length === 0)
      throw new BadRequestException('The user not have an inactive session');

    const validSession = sessions.find((session) => {
      const userAgentSession = session.locationDevice;
      if (userAgent !== userAgentSession) return false;

      try {
        const decryptCode = this.encryptionRepository.decrypt(
          session.accessCode,
        );
        const JSONDecodedCode = JSON.parse(decryptCode) as {
          accessCode: string;
          expiration: string;
        };

        if (JSONDecodedCode.expiration < new Date().toISOString()) return false;
        if (JSONDecodedCode.accessCode !== query.code) return false;

        return true;
      } catch {
        return false;
      }
    });

    if (!validSession) {
      throw new BadRequestException(
        'No valid session found or session expired',
      );
    }

    await this.masterSessionRepository.activeSession(validSession.sessionUUID);

    const { publicServiceKey } =
      await this.masterSessionRepository.assignRSASessionKeys(
        validSession.sessionUUID,
      );

    const accessToken = this.jwtService.sign({
      userUUID: validSession.userUUID,
      sessionUUID: validSession.sessionUUID,
      publicServiceKey: publicServiceKey,
    });

    return {
      message: 'Session active successfully',
      access_token: accessToken,
    };
  }
}
