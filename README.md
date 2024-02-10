## LLM Prompter

This Node.js application allows you to prompt Large Language Models (LLMs) using the Hugging Face Inference API. The program takes one or more prompts as command line arguments and retrieves responses from the specified models.

### Installation and Setup

To install the required dependencies run `npm install`

The only additional setup required is to create a top level .env file and set `HF_API_TOKEN` to your huggingface API token.

### Prompts

#### How To Run

To run the program, use the following command:

```bash
node prompts.js parameterName prompt1 prompt2 promptn
```

You can enter 1 to N prompts. The prompts should be named as the CLI arguments and stored in text files within the prompts directory.

#### Prompt Structure

Ensure that the prompts are stored in the prompts directory and named the same as the CLI argument. Responses will be stored in the responses directory with filenames like prompt1.json, prompt2.json, etc.

#### Response Structure

The response files have the following structure:

```json
{
  "model-name": {
    "prompt": "original prompt used",
    "response": "response from the LLM"
  }
}
```

#### Parameters

The huggingface API allows you to set different parameters for interacting with their models. Create a JSON file with your desired parameters in the promptParamaters directory. When executing the program enter the name of the file without `.json` For example, in the case of action selection we only want a short response from the model and we do not want the original input text. See below for how to set those parameters:

```json
{
  "max_new_tokens": 10,
  "return_full_text": false
}
```

To call this you would enter:

```bash
node prompts.js actions prompt1
```

#### Conversations

This works similar to the prompts command above. The only difference is an additional parameter determining the number of turns the conversation should take. This begins with the first response from the LLM. So if you want to have a conversation with 5 LLM generations, run the following command with the appropriate parameter and prompt options:

```bash
node conversation.js conversation 5 conversation_basic
```

### Model Selection

Currently this is hard coded. To change the model you are using update the `models` array located in prompts.js.

### Example

Suppose you want to prompt the LLMs with three prompts:

bash

node prompts.js prompt1 prompt2 prompt3

Ensure that the corresponding text files exist in the prompts directory with the names first-prompt.txt, second-prompt.txt, and third-prompt.txt. The responses will be stored in responses/prompt1.json, responses/prompt2.json, and responses/prompt3.json, respectively.

Adjust the prompt texts and directories according to your specific use case.
