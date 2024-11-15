import { Module } from '@nestjs/common';
import {
  CreateAccountController,
  CreateAccountService,
} from './proxess.api/_index';

@Module({
  imports: [],
  controllers: [CreateAccountController],
  providers: [CreateAccountService],
})
export class AppModule {}
