import { StringOutputParser } from '@langchain/core/output_parsers';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { ChatOpenAI } from '@langchain/openai';
import { StructuredOutputParser } from 'langchain/output_parsers';

export class ComedianChain {
  private readonly model: ChatOpenAI;
  private readonly parser: StringOutputParser;
  constructor() {
    this.model = new ChatOpenAI({
      model: 'gpt-4o-mini',
      temperature: 0.7,
    });
    this.parser = new StringOutputParser();
  }

  async comedychainFromTemplate(input) {
    const promptTemplate = ChatPromptTemplate.fromTemplate(
      'You are a commedian. Tell a joke on based on the following: {input}',
    );

    const comedyChain = promptTemplate.pipe(this.model).pipe(this.parser);
    return await comedyChain.invoke({ input });
  }

  async comdeychainFromMessage(input) {
    const promptTemplate = ChatPromptTemplate.fromMessages([
      ['system', 'Behave Like a standup comedian, with crowd work and humor '],
      ['user', input],
    ]);
    const comedyChain = promptTemplate.pipe(this.model).pipe(this.parser);
    return await comedyChain.invoke({ input });
  }

  async strutureOutputJoke(input) {
    const promptTemplate = ChatPromptTemplate.fromTemplate(`
      Behave Like a standup comedian, with crowd work and humor.
      and Extract the joke topic from {input} and
       give the name of author of joke as per the instruction: {format_instruction}
      `);

    const outputParser = StructuredOutputParser.fromNamesAndDescriptions({
      topic: 'Topic of the joke',
      author: 'Name of the author of the joke',
      joke: 'The Joke or the response of the joke',
    });
    const comedyChain = promptTemplate.pipe(this.model).pipe(outputParser);
    return await comedyChain.invoke({
      input,
      format_instruction: outputParser.getFormatInstructions(),
    });
  }
}
