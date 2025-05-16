'use server';

import { generateFakeCall, type GenerateFakeCallInput, type GenerateFakeCallOutput } from '@/ai/flows/generate-fake-call';

export async function handleGenerateFakeCall(input: GenerateFakeCallInput): Promise<{ success: boolean; data?: GenerateFakeCallOutput; error?: string }> {
  try {
    // Validate input here if necessary, though Genkit flow might do it too
    if (!input.callerId || !input.preRecordedMessage) {
      return { success: false, error: "Caller ID and message are required." };
    }

    const result = await generateFakeCall(input);
    if (!result || !result.scenarioDescription) {
        return { success: false, error: "Failed to generate scenario description from AI." };
    }
    return { success: true, data: result };
  } catch (error)
  {
    console.error("[ACTION_ERROR] Generating fake call:", error);
    let errorMessage = "An unknown error occurred while generating the fake call.";
    if (error instanceof Error) {
        errorMessage = error.message;
    }
    return { success: false, error: errorMessage };
  }
}
