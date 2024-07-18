import { config } from 'dotenv';
import { ChatOpenAI } from '@langchain/openai';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import inquirer from 'inquirer';

// Load environment variables
config();

// Initialize the OpenAI model with your API key
const chatModel = new ChatOpenAI({
  apiKey: process.env.OPENAI_API_KEY,

});

// Define the initial system message
const systemMessage = "You are a world class technical documentation writer.";

// Initialize the output parser
const outputParser = new StringOutputParser();

// Create a function to get user input and maintain conversation history
async function askQuestion() {
  let conversationHistory = [
    { role: 'system', content: systemMessage }
  ];

  while (true) {
    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'userInput',
        message: 'Please enter your question (or type "exit" to quit):',
      },
    ]);

    if (answers.userInput.toLowerCase() === 'exit') {
      break;
    }

    // Append the user input to the conversation history
    conversationHistory.push({ role: 'user', content: answers.userInput });

    // Create a prompt template with the updated conversation history
    const prompt = ChatPromptTemplate.fromMessages(
      conversationHistory.map(msg => [msg.role, msg.content])
    );

    // Create the LLM chain
    const llmChain = prompt.pipe(chatModel).pipe(outputParser);

    // Invoke the LLM chain
    const result = await llmChain.invoke({
      input: answers.userInput,
    });

    // Append the model response to the conversation history
    conversationHistory.push({ role: 'assistant', content: result });

    console.log('Assistant:', result);
  }
}

// Run the function to ask a question
askQuestion();
