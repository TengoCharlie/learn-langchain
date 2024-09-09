import { Controller, Get, Query } from '@nestjs/common';
import { OpenaiService } from './openai.service';

@Controller()
export class OpenaiController {
  constructor(private readonly openaiService: OpenaiService) {}

  @Get()
  getHello(@Query('message') message: string) {
    return this.openaiService.getHello(message);
  }

  @Get('/comedy')
  getComedy(@Query('message') message: string) {
    return this.openaiService.comedianJoke(message);
  }

  @Get('/recipe')
  getRecipe(@Query('cuisine') cuisine: string) {
    return this.openaiService.strutureOutputRecipe(cuisine);
  }

  @Get('/browsing')
  getBrowsing(@Query('question') question: string) {
    return this.openaiService.getResponseFromDatabseOrInternet(question);
  }
}
