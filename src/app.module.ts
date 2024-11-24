import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { CreateAccountController } from './modules/iam/presentation/controllers/createAccount/CreateAccount.controller';
import { CreateAccountService } from './modules/iam/presentation/controllers/createAccount/CreateAccount.service';
import { MasterUserRepository } from './modules/iam/infraestructure/persistence/repository/masterUser.repository';
import { EmailRepository } from './modules/iam/infraestructure/persistence/repository/email.repository';
import { StatusController } from './modules/status/presentation/controllers/checkStatus.controller';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '3d' },
    }),
  ],
  controllers: [CreateAccountController, StatusController],
  providers: [CreateAccountService, MasterUserRepository, EmailRepository],
})
export class AppModule {}
