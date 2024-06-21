import { Injectable } from '@nestjs/common';
import { PrismaService } from 'shared/providers';
import { ConfigService } from '@nestjs/config';
import { BadRequestException } from '@nestjs/common';
@Injectable()
export class ChatroomService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly configService: ConfigService,
      ) {}

    async sendMessage(
        chatroomId: number,
        message: string,
        userId: number,
        imagePath: string,
    ) {
        return await this.prisma.message.create({
          data: {
            content: message,
            imageUrl: imagePath,
            chatroomId,
            userId,
            },
          include: {
            chatroom: {
              include: {
                users: true, 
              },
            },
            user: true, 
          },
        });
      }

    
      async createChatroom(name: string, sub: number) {
        const existingChatroom = await this.prisma.chatroom.findFirst({
          where: {
            name,
          },
        });
        if (existingChatroom) {
          throw new BadRequestException({ name: 'Chatroom already exists' });
        }
        return this.prisma.chatroom.create({
          data: {
            name,
            users: {
              connect: {
                id: sub,
              },
            },
          },
        });
      }

      async addUsersToChatroom(chatroomId: number, userIds: number[]){
        const existingChatroom = await this.prisma.chatroom.findUnique({
          where: {
            id: chatroomId,
          },
        });
        if (!existingChatroom) {
          throw new BadRequestException({ chatroomId: 'Chatroom does not exist' });
        }
        return await this.prisma.chatroom.update({
          where: {
            id: chatroomId,
          },
          data: {
            users: {
              connect: userIds.map((id) => ({ id: id })),
            },
          },
          include: {
            users: true, // Eager loading users
          },
        });
      }

      async getChatroomsForUser(userId: number) {
        return this.prisma.chatroom.findMany({
          where: {
            users: {
              some: {
                id: userId,
              },
            },
          },
          include: {
            users: {
              orderBy: {
                createdAt: 'desc',
              },
            }, // Eager loading users
    
            messages: {
              take: 1,
              orderBy: {
                createdAt: 'desc',
              },
            },
          },
        });
      } 

      async getMessagesForChatroom(chatroomId: number) {
        return await this.prisma.message.findMany({
          where: {
            chatroomId: chatroomId,
          },
          include: {
            chatroom: {
              include: {
                users: {
                  orderBy: {
                    createdAt: 'asc',
                  },
                }, // Eager loading users
              },
            }, // Eager loading Chatroom
            user: true, // Eager loading User
          },
        });
      }
    
      async deleteChatroom(chatroomId: number) {
        return this.prisma.chatroom.delete({
          where: {
            id: chatroomId,
          },
        });
      }
    
}
