import { Module } from '@nestjs/common';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../shared/providers/index';
@Module({
  providers: [AuthResolver, AuthService, PrismaService,JwtService]
})
export class AuthModule {}
