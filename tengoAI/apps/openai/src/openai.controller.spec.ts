import { Test, TestingModule } from '@nestjs/testing';
import { OpenaiController } from './openai.controller';
import { OpenaiService } from './openai.service';

describe('OpenaiController', () => {
  let openaiController: OpenaiController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [OpenaiController],
      providers: [OpenaiService],
    }).compile();

    openaiController = app.get<OpenaiController>(OpenaiController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(openaiController.getHello()).toBe('Hello World!');
    });
  });
});
