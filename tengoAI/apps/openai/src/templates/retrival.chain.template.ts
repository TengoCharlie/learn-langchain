import { Document } from '@langchain/core/documents';
import { CheerioWebBaseLoader } from '@langchain/community/document_loaders/web/cheerio';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { ChatOpenAI, OpenAIEmbeddings } from '@langchain/openai';
import { StructuredOutputParser } from 'langchain/output_parsers';
import { createStuffDocumentsChain } from 'langchain/chains/combine_documents';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { MemoryVectorStore } from 'langchain/vectorstores/memory';
import { createRetrievalChain } from 'langchain/chains/retrieval';
import { z } from 'zod';

export class RetrivalChian {
  private readonly model: ChatOpenAI;
  constructor() {
    this.model = new ChatOpenAI({
      model: 'gpt-4o-mini',
      temperature: 0.7,
    });
  }

  async strcutureOutputRecipe(input) {
    const promptTemplate = ChatPromptTemplate.fromTemplate(`
      You are a five start hotel chef.
      pick ingredient only from kitchen: {context}.
      Give me a detailed recipe only and only for {input}.
      and struture the response into the following format:{format_instruction}.
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

    const documentA = new Document({
      pageContent: 'flour, milk, egg, sugar, salt',
      metadata: { source: 'kitchen' },
    });

    const chain = await createStuffDocumentsChain({
      llm: this.model,
      prompt: promptTemplate,
      outputParser: outputParser,
    });
    return await chain.invoke({
      input,
      format_instruction: outputParser.getFormatInstructions(),
      context: [documentA],
    });
  }

  async strcutureOutputSolution(input) {
    const promptTemplate = ChatPromptTemplate.fromTemplate(`
      Give me the infromation Obut the Following: {input},
      As Per the Infromations Are: {context}.
      Struture the response into the following format:{format_instruction}.
      `);

    const outputParser = StructuredOutputParser.fromZodSchema(
      z.object({
        title: z.string().describe('Title of the recipe'),
        description: z.string().describe('Description of the recipe'),
        specialNote: z
          .array(z.string())
          .describe('Special notes about the recipe'),
        origin: z.string().describe('Origin and History of the recipe'),
      }),
    );

    const loader = new CheerioWebBaseLoader('jgchgc');

    const documents = await loader.load();

    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 200,
      chunkOverlap: 20,
    });
    const docs = await splitter.splitDocuments(documents);

    const chain = await createStuffDocumentsChain({
      llm: this.model,
      prompt: promptTemplate,
      outputParser: outputParser,
    });

    const embeddings = new OpenAIEmbeddings();
    const vectorstores = await MemoryVectorStore.fromDocuments(
      docs,
      embeddings,
    );

    const retriver = vectorstores.asRetriever({
      k: 3,
      // searchType: 'similarity',
    });

    const retrievalChain = await createRetrievalChain({
      retriever: retriver,
      combineDocsChain: chain,
    });

    return await retrievalChain.invoke({
      input,
      format_instruction: outputParser.getFormatInstructions(),
    });
  }
}
