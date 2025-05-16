'use server';
/**
 * @fileOverview Generates a fake call scenario with customizable caller ID and a pre-recorded message.
 *
 * - generateFakeCall - A function that generates a fake call scenario.
 * - GenerateFakeCallInput - The input type for the generateFakeCall function.
 * - GenerateFakeCallOutput - The return type for the generateFakeCall function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateFakeCallInputSchema = z.object({
  callerId: z.string().describe('The customizable caller ID for the fake call.'),
  preRecordedMessage: z.string().describe('The pre-recorded message to be played during the fake call.'),
});
export type GenerateFakeCallInput = z.infer<typeof GenerateFakeCallInputSchema>;

const GenerateFakeCallOutputSchema = z.object({
  scenarioDescription: z
    .string()
    .describe('A description of the fake call scenario, including the caller ID and message.'),
});
export type GenerateFakeCallOutput = z.infer<typeof GenerateFakeCallOutputSchema>;

export async function generateFakeCall(input: GenerateFakeCallInput): Promise<GenerateFakeCallOutput> {
  return generateFakeCallFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateFakeCallPrompt',
  input: {schema: GenerateFakeCallInputSchema},
  output: {schema: GenerateFakeCallOutputSchema},
  prompt: `You are an AI assistant designed to create believable fake call scenarios.

  Based on the provided caller ID and pre-recorded message, generate a description of the fake call scenario.

  Caller ID: {{{callerId}}}
  Pre-recorded message: {{{preRecordedMessage}}}

  Create a short but realistic description of the fake call scenario using the provided information.
  The scenario must make sense given the caller ID and pre-recorded message.
  Focus on making the call sound as real as possible so that the user can get out of a threatening situation.
  The description should include who is calling, what they might be calling about, and how the user should respond.
  Be creative!
  `,
});

const generateFakeCallFlow = ai.defineFlow(
  {
    name: 'generateFakeCallFlow',
    inputSchema: GenerateFakeCallInputSchema,
    outputSchema: GenerateFakeCallOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
