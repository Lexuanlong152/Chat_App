import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GraphqlAuthGuard } from 'auth/graphql-auth.guard';
import { Request } from 'express';
import { UserService } from './user.service';
import { User } from './user.type';

@Resolver()
export class UserResolver {
    constructor(private readonly userService: UserService){
    }

    @UseGuards(GraphqlAuthGuard)
    @Mutation(() => User)
    async updateProfile(
      @Args('fullname') fullname: string,
      @Args('avatarUrl') avatarUrl: string,
      @Context() context: {req: Request}
    
    ) {
      console.log('context',context.req.user)
      return this.userService.updateProfile(context.req.user.sub, fullname, avatarUrl );
    }
  
    @UseGuards(GraphqlAuthGuard)
    @Query(() => [User])
    async searchUsers(
      @Args('fullname') fullname: string,
      @Context() context: { req: Request },
    ) {
     
      return this.userService.searchUsers(fullname);
    }
  
    @UseGuards(GraphqlAuthGuard)
    @Query(() => [User])
    getUsersOfChatroom(
      @Args('chatroomId') chatroomId: number) {
      return this.userService.getUsersOfChatroom(chatroomId);
    }

}
