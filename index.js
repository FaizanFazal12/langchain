import { config } from "dotenv";
import { ChatOpenAI } from "@langchain/openai";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { ChatPromptTemplate } from "@langchain/core/prompts";
config();
const chatModel = new ChatOpenAI({});


const prompt = ChatPromptTemplate.fromMessages([
    ["system", "You are a world class technical documentation writer."],
    ["user", "{input}"],
  ]);

const outputParser = new StringOutputParser();

const llmChain = prompt.pipe(chatModel).pipe(outputParser);

let result= await llmChain.invoke({
  input: "create the langsmith image",
});

console.log('result',result)