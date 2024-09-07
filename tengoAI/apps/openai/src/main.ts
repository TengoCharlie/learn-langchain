/* eslint-disable @typescript-eslint/no-unused-vars */
import { NestFactory } from '@nestjs/core';
import { OpenaiModule } from './openai.module';
import { OpenaiController } from './openai.controller';

async function bootstrapServer() {
  const app = await NestFactory.create(OpenaiModule);
  await app.listen(3000);
}

async function bootstrapHandler() {
  const app = await NestFactory.createApplicationContext(OpenaiModule);
  const openaiController = app.get(OpenaiController);
  const response = await openaiController.getComedy('dancing in the rain');
  console.log(response);
  await app.close();
}
bootstrapServer();
// bootstrapHandler();
