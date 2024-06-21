import { Args, Mutation, Resolver, Subscription , Context, Query} from '@nestjs/graphql';
import { ChatroomService } from './chatroom.service';
import { UserService } from '../user/user.service';
import { PubSub } from 'graphql-subscriptions';
import { Message, Chatroom } from './chatroom.type';
import { User } from 'user/user.type';
import { Request } from 'express';
import { GraphqlAuthGuard } from 'auth/graphql-auth.guard';
import { UseGuards } from '@nestjs/common';

@Resolver()
export class ChatroomResolver {
    public pubSub: PubSub;
    constructor(
        private readonly chatroomService: ChatroomService,
        private readonly userService: UserService,
      ) {
        this.pubSub = new PubSub();
      }

      @Subscription((returns)=> Message,{
        nullable:  true,
        resolve: value=> {
          console.log( value.newMessage)
          return value.newMessage
        }
      })
      newMessage(@Args('chatroomId')chatroomId: number){
        return this.pubSub.asyncIterator(`newMessage.${chatroomId}`);
      }


      @Subscription((returns)=>User, {
        nullable: true,
        resolve: value=>value.user,
        filter: (payload,variables)=>{
          console.log('payload1', variables, payload.typingUserId);
          return variables.userId !== payload.typingUserId;
        }, 
      })
      userStartedTyping(
        @Args('chatroomId') chatroomId: number,
        @Args('userId') userId: number,
      ) {
        return this.pubSub.asyncIterator(`userStartedTyping.${chatroomId}`);
      }


      @Subscription(() => User, {
        nullable: true,
        resolve: (value) => value.user,
        filter: (payload, variables) => {
          return variables.userId !== payload.typingUserId;
        },
      })
      userStoppedTyping(
        @Args('chatroomId') chatroomId: number,
        @Args('userId') userId: number,
      ) {
        return this.pubSub.asyncIterator(`userStoppedTyping.${chatroomId}`);
      }
      

    @UseGuards(GraphqlAuthGuard)
    @Mutation(()=>User)
    async userStartedTypingMutation(
      @Args('chatroomId') chatroomId: number,
      @Context() context: { req: Request },
    ) {
      const user = await this.userService.getUser(1);
      await this.pubSub.publish(`userStartedTyping.${chatroomId}`, {
        user,
        typingUserId: user.id,
      });
      return user;
    }

    @UseGuards(GraphqlAuthGuard)
    @Mutation(()=>User)
    async userStoppedTypingMutation(
      @Args('chatroomId') chatroomId: number,
      @Context() context: { req: Request },
    ) {
      const user = await this.userService.getUser(1);
      await this.pubSub.publish(`userStoppedTyping.${chatroomId}`, {
        user,
        typingUserId: user.id,
      });
      return user;
    }


    @Mutation(() => Message)
    async sendMessage(
      @Args('chatroomId') chatroomId: number,
      @Args('content') content: string,
      @Context() context: { req: Request },
      @Args('imageUrl') imageUrl : string
     
    ) {
      const newMessage = await this.chatroomService.sendMessage(
        chatroomId,
        content,
        context.req.user.sub,
        imageUrl,
      );
      await this.pubSub
        .publish(`newMessage.${chatroomId}`, { newMessage })
        .then((res) => {
          console.log('published', res);
        })
        .catch((err) => {
          console.log('err', err);
        });
  
      return newMessage;
    }

    @UseGuards(GraphqlAuthGuard)
    @Mutation(() => Chatroom)
    async createChatroom(
      @Args('name') name: string,
      @Context() context: { req: Request },
    ) {
      return this.chatroomService.createChatroom(name, context.req.user.sub);
    }
    
    @Mutation(() => Chatroom)
    async addUsersToChatroom(
      @Args('chatroomId') chatroomId: number,
      @Args('userIds', { type: () => [Number] }) userIds: number[],
    ) {
      return this.chatroomService.addUsersToChatroom(chatroomId, userIds);
    }

    @UseGuards(GraphqlAuthGuard)
    @Query(() => [Chatroom])
    async getChatroomsForUser( @Context() context: { req: Request },) {
      return this.chatroomService.getChatroomsForUser(context.req.user.sub);
    }
  
    @Query(() => [Message])
    async getMessagesForChatroom(@Args('chatroomId') chatroomId: number) {
      return this.chatroomService.getMessagesForChatroom(chatroomId);
    }
    @Mutation(() => String)
    async deleteChatroom(@Args('chatroomId') chatroomId: number) {
      await this.chatroomService.deleteChatroom(chatroomId);
      return 'Chatroom deleted successfully';
    }
  }


