import { textGeneration } from '@huggingface/inference';
import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config();

const accessToken = process.env.HF_API_TOKEN;

const models = [
  'meta-llama/Llama-2-70b-chat-hf',
  'HuggingFaceH4/zephyr-7b-beta',
  'codellama/CodeLlama-13b-hf',
  'codellama/CodeLlama-34b-Instruct-hf',
];

const prompts = process.argv.slice(2);

const getInstruction = async (prompt, model, response, promptNumber) => {
  return new Promise(async (resolve, reject) => {
    const cacheClear = Math.random();
    prompt = `${cacheClear}\n${prompt}`;
    try {
      const completion = await textGeneration({
        inputs: prompt,
        parameters: {
          max_new_tokens: 10,
          return_full_text: false,
        },
        model,
        accessToken,
      });
      console.log(
        `${model}\n _____________________________\n ${prompt} \n result: ${completion.generated_text}`
      );
      response[model] = {};
      response[model]['promptNumber'] = {};
      response[model]['promptNumber']['prompt'] = prompt;
      response[model]['promptNumber']['response'] = completion.generated_text;
      resolve(completion.generated_text);
    } catch (e) {
      reject(e);
    }
  });
};

const getResponses = async (prompt, models, response, promptNumber) => {
  await Promise.all(
    models.map(async (model) => {
      await getInstruction(prompt, model, response, promptNumber);
    })
  );
  console.log(response);
};

const processPrompt = async (promptNumber) => {
  return new Promise(async (resolve, reject) => {
    try {
      const currentPrompt = await fs.readFileSync(
        `./prompts/${promptNumber}.txt`,
        'utf-8'
      );
      const response = {};
      await getResponses(currentPrompt, models, response, promptNumber);
      fs.writeFileSync(
        `./responses/${promptNumber}.json`,
        JSON.stringify(response)
      );
      resolve(true);
    } catch (e) {
      reject(e);
    }
  });
};
const usePrompts = async (prompts) => {
  await Promise.all(
    prompts.map(async (prompt) => {
      await processPrompt(prompt);
    })
  );
};

usePrompts(prompts);
