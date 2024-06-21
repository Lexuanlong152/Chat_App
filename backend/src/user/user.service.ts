import { Injectable } from '@nestjs/common';
import { PrismaService } from 'shared/providers';
import * as fs from 'fs';
import { join } from 'path';
@Injectable()
export class UserService {
    constructor (private readonly prisma: PrismaService){}

    async updateProfile(userId: number, fullname: string, avatarUrl: string) {
      if (avatarUrl) {
      
        const updatedUser = await this.prisma.user.update({
          where: { id: userId },
          data: {
            fullname,
            avatarUrl,
          },
        });
        return updatedUser;
      }
      return await this.prisma.user.update({
        where: { id: userId },
        data: {
          fullname,
        },
      });
    }
    async searchUsers(fullname: string) {
        // make sure that users are found that contain part of the fullname
        // and exclude the current user
        return this.prisma.user.findMany({
          where: {
            fullname: {
              contains: fullname,
            }
          },
        });
      }
    
      async getUsersOfChatroom(chatroomId: number) {
        return this.prisma.user.findMany({
          where: {
            chatrooms: {
              some: {
                id: chatroomId,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        });
      }
    
      async getUser(userId: number) {
        return this.prisma.user.findUnique({
          where: {
            id: userId,
          },
        });
      }
}
