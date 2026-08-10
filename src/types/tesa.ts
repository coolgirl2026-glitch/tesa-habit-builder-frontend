export interface CompanyProfile {
  id: string;
  user_id: string;
  company_name: string;
  industry: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface Role {
  id: string;
  user_id: string;
  company_id: string;
  role_name: string;
  created_at: string;
  updated_at: string;
}

export interface Competency {
  name: string;
  description: string;
}

export interface HabitTask {
  taskName: string;
  taskDescription: string;
  green: string;
  blue: string;
  purple: string;
  grey: string;
  selected?: boolean;
}

export interface Program {
  id: string;
  role_id: string;
  user_id: string;
  problem_statement: string;
  competency: string;
  outcome: string;
  program_name: string;
  program_description: string;
  program_objectives: string[];
  selected_habits: HabitTask[];
  created_at: string;
}

export interface GeneratedProgram {
  programName: string;
  programDescription: string;
  objectives: string[];
  habitTasks: HabitTask[];
}

export interface PreseededCompany {
  id: string;
  name: string;
  industry: string;
  description: string;
}

export interface PreseededRole {
  id: string;
  company_id: string;
  role_name: string;
  role_description: string;
}

export type ProgramStep =
  | 'context'
  | 'problem'
  | 'competency'
  | 'outcome'
  | 'generate'
  | 'select'
  | 'saved';
