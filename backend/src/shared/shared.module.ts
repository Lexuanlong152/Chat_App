import { Global, Module } from '@nestjs/common';
import { PrismaService } from './providers';

@Global()
@Module({
  providers: [PrismaService],
  exports:  [PrismaService]
})

export class SharedModule {}