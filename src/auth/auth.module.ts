import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { AuthService } from './auth.service';
import { UsersController } from '../users/users.controller';

@Module({
  imports: [UsersModule],
  controllers: [UsersController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
