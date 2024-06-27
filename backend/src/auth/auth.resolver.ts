import { BadRequestException, UseFilters } from '@nestjs/common';
import { Args, Context, Mutation, Resolver, Query } from '@nestjs/graphql';
import { RegisterDto, LoginDto } from './auth.dto';
import { AuthService } from './auth.service';
import { RegisterResponse, LoginResponse } from './type';
import { Request, Response } from 'express';
import { GraphQLErrorFilter } from 'filters/custom-exception.filter';

@UseFilters(GraphQLErrorFilter)
@Resolver()
export class AuthResolver {
    constructor(private readonly authService: AuthService) {}
    @Mutation(() => RegisterResponse)
    async register(
      @Args('registerInput') registerDto: RegisterDto,
      @Context() context: { res: Response },
    ) {
    
      if (registerDto.password !== registerDto.confirmPassword) {
        throw new BadRequestException({
          confirmPassword: 'Password and confirm password are not the same.',
        });
      }
      const { user } = await this.authService.register(registerDto, context.res);

      return { user };
    }

    @Mutation(() => LoginResponse)
    async login(
      @Args('loginInput') loginDto: LoginDto,
      @Context() context: { res: Response },
    ) {
      console.log(loginDto)
      console.log(context.res);
      return this.authService.login(loginDto, context.res);
    }

    @Mutation(() => String)
    async logout(@Context() context: { res: Response }) {
      return this.authService.logout(context.res);
    }

    @Mutation(() => String)
    async refreshToken(@Context() context: { req: Request; res: Response }) {
      try {
        return this.authService.refreshToken(context.req, context.res);
      } catch (error) {
        throw new BadRequestException('Refresh token failed', error);
      }
    }

    @Query(() => String)
    async hello() {
      return 'hello';
    }
}