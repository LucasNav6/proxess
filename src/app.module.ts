import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { CreateAccountController } from './modules/iam/presentation/controllers/createAccount/CreateAccount.controller';
import { CreateAccountService } from './modules/iam/presentation/controllers/createAccount/CreateAccount.service';
import { MasterUserRepository } from './modules/iam/infraestructure/persistence/repository/masterUser.repository';
import { EmailRepository } from './modules/iam/infraestructure/persistence/repository/email.repository';
import { StatusController } from './modules/status/presentation/controllers/checkStatus.controller';
import { EncryptionRepository } from './modules/iam/infraestructure/persistence/repository/encryption.repository';
import { SignInAccountController } from './modules/iam/presentation/controllers/signInAccount/SignInAccount.controller';
import { SignInAccountService } from './modules/iam/presentation/controllers/signInAccount/SignInAccount.service';
import { MasterSessionRepository } from './modules/iam/infraestructure/persistence/repository/masterSession.repository';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '3d' },
    }),
  ],
  controllers: [
    CreateAccountController,
    SignInAccountController,
    StatusController,
  ],
  providers: [
    CreateAccountService,
    SignInAccountService,
    MasterSessionRepository,
    MasterUserRepository,
    EmailRepository,
    EncryptionRepository,
  ],
})
export class AppModule {}
