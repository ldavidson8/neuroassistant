import { getBearerTokenProvider, InteractiveBrowserCredential } from '@azure/identity';
import { AzureOpenAI } from 'openai';

const apiKey = '7698f644-6d20-48fc-a2cf-39ec2116007d';
const endpoint = 'https://mango-bush-0a9e12903.5.azurestaticapps.net/api/v1';
const deployment = 'gpt-4o-mini';

const credential = new InteractiveBrowserCredential({
  additionallyAllowedTenants: ['common'],
  clientId: '7698f644-6d20-48fc-a2cf-39ec2116007d',
  tenantId: '7698f644-6d20-48fc-a2cf-39ec2116007d',
});
const scope = 'https://cognitiveservices.azure.com/.default';
const azureADTokenProvider = getBearerTokenProvider(credential, scope);

const systemPrompt = `You are an helpful assistant for neuro divergent students.
Answer in a polite and helpful manner. You will output the scheduling data as JSON format.

Generate a JSON object that strictly follows this schema:

typescript
Copy
Edit
const timetableEventSchema = z.object({
  topIdx: z.number(),
  slotInDay: z.number(),
  time: z.string(),
  day: z.string(),
  title: z.string(),
  startDateString: z.string(),
  endDateString: z.string(),
});
Ensure the JSON output includes:

topIdx: A numeric index representing the position of the event.

slotInDay: A numeric index representing the event slot within a day.

time: A string representing the event time (e.g., "14:00").

day: A string representing the day of the event (e.g., "Monday").

title: A string representing the event title (e.g., "Mathematics Class").

startDateString: A string in ISO format representing the event's start date (e.g., "2025-04-10T09:00:00Z").

endDateString: A string in ISO format representing the event's end date (e.g., "2025-04-10T10:30:00Z").

Return only the valid JSON object without extra text.

Split the tasks into the user's provided timescales otherwise, provide your own for each task.`;
export async function getChatCompletions(userMessage: string) {
  const client = new AzureOpenAI({
    endpoint,
    apiKey,
    // azureADTokenProvider,
    apiVersion: '2025-04-02',
    dangerouslyAllowBrowser: true,
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
