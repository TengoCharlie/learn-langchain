import { ChatOpenAI } from "@langchain/openai";
import { AIMessageChunk, HumanMessage, SystemMessage } from "@langchain/core/messages";
import { configDotenv } from "dotenv";
import { StringOutputParser } from "@langchain/core/output_parsers";

configDotenv();

const model: ChatOpenAI = new ChatOpenAI({
  model: "gpt-4",
});

const messages: (SystemMessage | HumanMessage)[] = [
    new SystemMessage("Translate the following from English into Italian"),
    new HumanMessage("hi!"),
]

model.invoke(messages).then(async (res: AIMessageChunk) => {
    const parser: StringOutputParser = new StringOutputParser();
    const response: string = await parser.invoke(res);
    console.log("Ginnie : ", response);
});