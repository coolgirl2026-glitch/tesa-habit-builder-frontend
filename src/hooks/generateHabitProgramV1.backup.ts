/**
 * BACKUP: generateHabitProgram V1 Implementation
 * 
 * This is the original non-streaming version that makes a single POST request
 * and waits for the full response.
 * 
 * API Endpoint: https://apicuration.aspirenow.in/v2/generate-habit-program
 * 
 * To restore this version, copy this function back into useTesa.ts
 */

import { toast } from 'sonner';
import type { GeneratedProgram } from '@/types/tesa';

// API call to generate habit program based on outcome (V1 - Non-streaming)
export const generateHabitProgramV1 = async (
  companyIndustry: string,
  companyDescription: string,
  employeeRole: string,
  problemStatement: string,
  competency: string,
  outcome: string
): Promise<GeneratedProgram | null> => {
  try {
    const response = await fetch('https://apicuration.aspirenow.in/v2/generate-habit-program', {
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
        outcome,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate habit program');
    }

    const data = await response.json();

    if (data.status && data.data?.habitProgram) {
      const { habitProgram } = data.data;
      return {
        programName: habitProgram.programName,
        programDescription: habitProgram.programDescription,
        objectives: habitProgram.programObjectives,
        habits: habitProgram.habitTasks.map((task: { taskName: string; taskDescription: string }) => ({
          title: task.taskName,
          description: task.taskDescription,
          duration: 10,
        })),
      };
    }

    throw new Error('Invalid response format');
  } catch (error) {
    console.error('Error generating habit program:', error);
    toast.error('Failed to generate habit program. Using fallback.');

    // Fallback program if API fails
    return {
      programName: `${competency} Development Program`,
      programDescription: `A structured habit program designed to develop ${competency.toLowerCase()} capabilities through daily practice and reflection.`,
      objectives: [
        `Build foundational ${competency.toLowerCase()} skills through consistent daily practice`,
        "Create measurable improvement in task completion and quality",
        "Establish sustainable habits that support long-term professional growth"
      ],
      habits: [
        {
          title: "Morning Priority Review",
          description: "Review and rank your top 3 priorities for the day before starting any work.",
          duration: 10
        },
        {
          title: "Task Breakdown Session",
          description: "Break down each major task into steps of 30 minutes or less.",
          duration: 15
        },
        {
          title: "Progress Documentation",
          description: "Document completed work and key decisions in a running log.",
          duration: 10
        },
        {
          title: "End-of-Day Reflection",
          description: "Review what was accomplished and what needs to carry over to tomorrow.",
          duration: 10
        },
      ]
    };
  }
};
