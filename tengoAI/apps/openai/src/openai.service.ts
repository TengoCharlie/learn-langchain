import { Injectable } from '@nestjs/common';
import { ChatOpenAI } from '@langchain/openai';
import { HumanMessage, SystemMessage } from '@langchain/core/messages';
import { configDotenv } from 'dotenv';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { ChatPromptTemplate } from '@langchain/core/prompts';

configDotenv();

@Injectable()
export class OpenaiService {
  async getHello(message) {
    const model: ChatOpenAI = new ChatOpenAI({
      model: 'gpt-4o-mini',
    });
    const parser: StringOutputParser = new StringOutputParser();

    // const messages: (SystemMessage | HumanMessage)[] = [
    //     new SystemMessage("Behave Like A Friend, Keep all the response small. Am developing the AI model"),
    //     new HumanMessage("hi!"),
    // ]

    const promptTemplate = ChatPromptTemplate.fromMessages([
      [
        'system',
        'Behave Like A Friend, Keep all the response small. Am developing the AI model with language {language}.',
      ],
      ['user', '{text}'],
    ]);

    const chain = promptTemplate.pipe(model).pipe(parser);

    return await chain.invoke({
      text: message,
      language: 'English',
    });
  }
}
