import { Injectable } from '@nestjs/common';
import { ChatOpenAI } from '@langchain/openai';
// import { HumanMessage, SystemMessage } from '@langchain/core/messages';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { ComedianChain } from './templates/comedy.prompt.template';
@Injectable()
export class OpenaiService {
  constructor(private readonly comdeianChain: ComedianChain) {}
  async getHello(message) {
    const model: ChatOpenAI = new ChatOpenAI({
      model: 'gpt-4o-mini',
      temperature: 0.7,
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

  async comedianJoke(message) {
    const comedyChains = [
      await this.comdeianChain.comedychainFromTemplate(message),
      await this.comdeianChain.comdeychainFromMessage(message),
    ];
    const random = Math.random();
    if (random > 0.5) {
      console.log('Template Comedy');
      return comedyChains[0];
    } else {
      console.log('Message Comedy');
      return comedyChains[1];
    }
  }
}
