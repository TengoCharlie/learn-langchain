import { ChatPromptTemplate } from '@langchain/core/prompts';
import { ChatOpenAI } from '@langchain/openai';
import { StructuredOutputParser } from 'langchain/output_parsers';
import { z } from 'zod';

export class RecipeChain {
  private readonly model: ChatOpenAI;
  constructor() {
    this.model = new ChatOpenAI({
      model: 'gpt-4o-mini',
      temperature: 0.7,
    });
  }

  async strcutureOutputRecipe(input) {
    const promptTemplate = ChatPromptTemplate.fromTemplate(`
      You are a five start hotel chef. Give me a detailed recipe for {input}.
      and struture the response into the following format:{format_instruction}
      `);

    const outputParser = StructuredOutputParser.fromZodSchema(
      z.object({
        title: z.string().describe('Title of the recipe'),
        ingredients: z.array(z.string()).describe('List of ingredients'),
        instructions: z
          .array(z.string())
          .describe('List and steps of instructions'),
        description: z.string().describe('Description of the recipe'),
        specialNote: z
          .array(z.string())
          .describe('Special notes about the recipe'),
        origin: z.string().describe('Origin and History of the recipe'),
      }),
    );
    const chefyChain = promptTemplate.pipe(this.model).pipe(outputParser);
    return await chefyChain.invoke({
      input,
      format_instruction: outputParser.getFormatInstructions(),
    });
  }
}
