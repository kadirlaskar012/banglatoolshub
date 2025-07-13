'use server';

import { suggestTools } from '@/ai/flows/tool-suggestion';

export async function getToolSuggestions(
  content: string
): Promise<string[]> {
  try {
    const result = await suggestTools({ content });
    // The model might return slugs or full names. We return as is.
    return result.tools;
  } catch (error) {
    console.error('AI suggestion failed:', error);
    // Return an empty array or handle the error as appropriate
    return [];
  }
}
