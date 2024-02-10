import { textGeneration } from '@huggingface/inference';
import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config();

const accessToken = process.env.HF_API_TOKEN;

// const models = [
//   'meta-llama/Llama-2-70b-chat-hf',
//   'HuggingFaceH4/zephyr-7b-beta',
//   'codellama/CodeLlama-13b-hf',
//   'codellama/CodeLlama-34b-Instruct-hf',
// ];

const models = ['meta-llama/Llama-2-70b-chat-hf'];
const parameterPath = process.argv[2];
const turns = parseInt(process.argv[3]);
const prompts = process.argv.slice(4);

const parameters = JSON.parse(
  fs.readFileSync(`promptParameters/${parameterPath}.json`, 'utf-8')
);

const getInstruction = async (prompt, turns, model, response, promptNumber) => {
  return new Promise(async (resolve, reject) => {
    response[model] = {};
    response[model]['prompt'] = prompt;
    let conversation = [];
    try {
      let completedTurns = 0;
      while (completedTurns < turns) {
        const newPrompt = prompt + '\n' + conversation.join('\n');
        const completion = await textGeneration({
          inputs: newPrompt,
          parameters,
          model,
          accessToken,
        });
        console.log(
          `${model}\n _____________________________\n ${completion.generated_text}`
        );
        conversation.push(completion.generated_text);
        ++completedTurns;
      }
      response[model]['response'] = conversation;
      resolve(conversation);
    } catch (e) {
      reject(e);
    }
  });
};

const getResponses = async (prompt, turns, models, response, promptNumber) => {
  await Promise.all(
    models.map(async (model) => {
      await getInstruction(prompt, turns, model, response, promptNumber);
    })
  );
  console.log(models);
};

const processPrompt = async (promptNumber, turns) => {
  return new Promise(async (resolve, reject) => {
    try {
      const currentPrompt = await fs.readFileSync(
        `./prompts/${promptNumber}.txt`,
        'utf-8'
      );
      const response = {};
      await getResponses(currentPrompt, turns, models, response, promptNumber);
      fs.writeFileSync(
        `./responses/${promptNumber}.json`,
        JSON.stringify(response, null, 2)
      );
      resolve(true);
    } catch (e) {
      reject(e);
    }
  });
};
const usePrompts = async (prompts, turns) => {
  await Promise.all(
    prompts.map(async (prompt) => {
      await processPrompt(prompt, turns);
    })
  );
};

usePrompts(prompts, turns);
