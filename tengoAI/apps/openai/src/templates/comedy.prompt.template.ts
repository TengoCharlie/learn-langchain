import { StringOutputParser } from '@langchain/core/output_parsers';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { ChatOpenAI } from '@langchain/openai';

export async function getComedyChain(input) {
  const model: ChatOpenAI = new ChatOpenAI({
    model: 'gpt-4o-mini',
    temperature: 0.7,
  });
  const parser: StringOutputParser = new StringOutputParser();

  const promptTemplate = ChatPromptTemplate.fromTemplate(
    'You are a commedian. Tell a joke on based on the following: {input}',
  );

  const comedyChain = promptTemplate.pipe(model).pipe(parser);
  return await comedyChain.invoke({ input });
}
