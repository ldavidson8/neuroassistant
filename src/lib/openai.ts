import { AzureOpenAI } from 'openai';
import { DefaultAzureCredential, getBearerTokenProvider } from '@azure/identity';
import 'dotenv/config';

const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
const apiKey = process.env.AZURE_AI_KEY;
const deployment = 'gpt-4o-mini';

const credential = new DefaultAzureCredential();
const scope = 'https://cognitiveservices.azure.com/.default';
const azureADTokenProvider = getBearerTokenProvider(credential, scope);

const systemPrompt =
  'You are a helpful assistant. Please provide concise and accurate responses to user queries.';
export async function getChatCompletions(userMessage: string) {
  const client = new AzureOpenAI({
    endpoint,
    apiKey,
    azureADTokenProvider,
  });
  const response = await client.chat.completions.create({
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userMessage },
    ],
    model: deployment,
    max_tokens: 4096,
    temperature: 0.7,
  });
  return response;
}
