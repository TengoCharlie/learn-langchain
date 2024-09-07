import { Controller, Get, Query } from '@nestjs/common';
import { OpenaiService } from './openai.service';

@Controller()
export class OpenaiController {
  constructor(private readonly openaiService: OpenaiService) {}

  @Get()
  getHello(@Query('message') message: string) {
    return this.openaiService.getHello(message);
  }
}
