import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
  } from '@nestjs/common';
  import { JwtService } from '@nestjs/jwt';
  import { ConfigService } from '@nestjs/config';
  import { Request } from 'express';
  
  @Injectable()
  export class GraphqlAuthGuard implements CanActivate {
    constructor(
      private jwtService: JwtService,
      private configService: ConfigService,
    ) {}
  
    async canActivate(context: ExecutionContext): Promise<boolean> {
      const gqlCtx = context.getArgByIndex(2);
      const request: Request = gqlCtx.req;
      const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImxvbmdsZTE1Iiwic3ViIjo2LCJpYXQiOjE3MTg5NjEyMDQsImV4cCI6MTcxOTU2NjAwNH0.sh7dOpyCyL3J-kRi1yCch7czzm0LCdb2PbRlGEY_3YQ';
  
      if (!token) {
        throw new UnauthorizedException();
      }
      try {
        const payload = await this.jwtService.verifyAsync(token, {
          secret: this.configService.get<string>('ACCESS_TOKEN_SECRET'),
        });
  
        request['user'] = payload;
      } catch (err) {
        throw new UnauthorizedException();
      }
  
      return true;
    }
  
    private extractTokenFromCookie(request: Request): string | undefined {
      return request.cookies?.access_token;
    }
  }