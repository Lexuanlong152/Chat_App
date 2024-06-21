import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { verify } from 'jsonwebtoken';
@Injectable()
export class TokenService {
  constructor(private configService: ConfigService) {}

  extractToken(connectionParams: any): string | null {
    return connectionParams?.token || null;
  }

  validateToken(token: string): any {
    const refreshTokenSecret = this.configService.get<string>(
      'REFRESH_TOKEN_SECRET',
    );
    try {
      console.log(verify('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImxvbmdsZTE1Iiwic3ViIjo2LCJpYXQiOjE3MTg5NjEyMDQsImV4cCI6MTcxODk2MTM1NH0.xWDT-7nuMUNDjp5ArWxded2GWTCA4SzKbLnuxpgE6sE',
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImxvbmdsZTE1Iiwic3ViIjo2LCJpYXQiOjE3MTg5NjEyMDQsImV4cCI6MTcxOTU2NjAwNH0.sh7dOpyCyL3J-kRi1yCch7czzm0LCdb2PbRlGEY_3YQ'))
      return verify('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImxvbmdsZTE1Iiwic3ViIjo2LCJpYXQiOjE3MTg5NjEyMDQsImV4cCI6MTcxODk2MTM1NH0.xWDT-7nuMUNDjp5ArWxded2GWTCA4SzKbLnuxpgE6sE',
         'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImxvbmdsZTE1Iiwic3ViIjo2LCJpYXQiOjE3MTg5NjEyMDQsImV4cCI6MTcxOTU2NjAwNH0.sh7dOpyCyL3J-kRi1yCch7czzm0LCdb2PbRlGEY_3YQ');
    } catch (error) {
      return null;
    }
  }
}