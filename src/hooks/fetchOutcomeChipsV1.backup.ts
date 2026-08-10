/**
 * BACKUP: fetchOutcomeChips V1 Implementation
 * 
 * This is the original non-streaming version that makes a single POST request
 * and waits for the full response.
 * 
 * API Endpoint: https://apicuration.aspirenow.in/v2/generate-outcome-chips
 * 
 * To restore this version, copy this function back into useTesa.ts
 */

import type { OutcomeChip } from '@/hooks/useTesa';

// API call to fetch outcome chips (V1 - Non-streaming)
export const fetchOutcomeChipsV1 = async (
  companyIndustry: string,
  companyDescription: string,
  employeeRole: string,
  problemStatement: string,
  competency: string
): Promise<OutcomeChip[]> => {
  try {
    const response = await fetch('https://apicuration.aspirenow.in/v2/generate-outcome-chips', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        companyIndustry,
        companyDescription,
        employeeRole,
        problemStatement,
        competency,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch outcome chips');
    }

    const data = await response.json();

    if (data.status && data.data?.chips) {
      return data.data.chips as OutcomeChip[];
    }

    throw new Error('Invalid response format');
  } catch (error) {
    console.error('Error fetching outcome chips:', error);
    // Fallback chips if API fails
    return [
      {
        chipText: "Team completes tasks without reminders",
        outcomeStatement: "Team members complete tasks without reminders or follow-ups"
      },
      {
        chipText: "Daily progress tracking becomes automatic",
        outcomeStatement: "Consistent daily progress tracking becomes automatic behavior"
      },
      {
        chipText: "Proactive communication replaces reactive",
        outcomeStatement: "Proactive communication replaces reactive escalation patterns"
      },
      {
        chipText: "Self-accountability visible in actions",
        outcomeStatement: "Self-accountability and ownership visible in daily actions"
      },
    ];
  }
};
