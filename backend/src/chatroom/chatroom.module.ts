import { Module } from '@nestjs/common';
import { ChatroomService } from './chatroom.service';
import { ChatroomResolver } from './chatroom.resolver';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'shared/providers/index';
import { UserService } from 'user/user.service';

@Module({
 
  providers: [ChatroomService, ChatroomResolver, JwtService, PrismaService, UserService],
  exports: [ChatroomService]
})
export class ChatroomModule {}
