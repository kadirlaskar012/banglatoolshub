'use server';

import { suggestTools } from '@/ai/flows/tool-suggestion';
import { getToolBySlug, getTools } from '@/lib/data';
import type { Tool } from '@/lib/types';

export async function getToolSuggestions(
  content: string
): Promise<Tool[]> {
  try {
    const suggestionResult = await suggestTools({ content });
    
    // The AI might return slugs or full names. We need to fetch the full tool object.
    const allTools = await getTools();
    const suggestedTools: Tool[] = [];
    
    for (const nameOrSlug of suggestionResult.tools) {
      // Find tool by slug or name (case-insensitive)
      const foundTool = allTools.find(tool => 
        tool.slug.toLowerCase() === nameOrSlug.toLowerCase() || 
        tool.name.toLowerCase() === nameOrSlug.toLowerCase()
      );

      if (foundTool && !suggestedTools.some(t => t.id === foundTool.id)) {
        suggestedTools.push(foundTool);
      }
    }
    
    // The AI might not return anything, or the tools might not exist.
    // In that case, we can suggest some random tools as a fallback.
    if (suggestedTools.length === 0 && allTools.length > 0) {
      // Return up to 3 random tools if no suggestions are found
      const shuffled = allTools.sort(() => 0.5 - Math.random());
      return shuffled.slice(0, 3);
    }

    return suggestedTools.slice(0, 3); // Limit to 3 suggestions

  } catch (error) {
    console.error('AI suggestion failed:', error);
    // As a fallback, return a few random tools
     const allTools = await getTools();
     const shuffled = allTools.sort(() => 0.5 - Math.random());
     return shuffled.slice(0, 3);
  }
}
