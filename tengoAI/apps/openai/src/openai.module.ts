import { Module } from '@nestjs/common';
import { OpenaiController } from './openai.controller';
import { OpenaiService } from './openai.service';
import { ConfigModule } from '@nestjs/config';
import * as path from 'path';
import { ComedianChain } from './templates/comedy.prompt.template';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: path.resolve(__dirname, '..', '..', '..', '.env'),
    }),
  ],
  controllers: [OpenaiController],
  providers: [OpenaiService, ComedianChain],
})
export class OpenaiModule {}
