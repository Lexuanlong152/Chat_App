import { Module } from '@nestjs/common';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'shared/providers';

@Module({
  providers: [UserResolver, UserService, JwtService, PrismaService],
  exports:[UserService]
})
export class UserModule {}
