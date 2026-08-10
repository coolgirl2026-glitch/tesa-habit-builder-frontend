import { useState, useCallback, useEffect } from 'react';
import type { CompanyProfile, Role, Program, Competency, GeneratedProgram, HabitTask, PreseededCompany, PreseededRole } from '@/types/tesa';
import { toast } from 'sonner';

// Generate unique IDs
const generateId = () => crypto.randomUUID();

// Default user ID for prototype
const DEFAULT_USER_ID = 'demo-user';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api';

// Local storage keys (only for UI selection state)
const STORAGE_KEYS = {
  SELECTED_PROFILE_ID: 'tesa_selected_profile_id',
  SELECTED_ROLE_ID: 'tesa_selected_role_id',
};

// Type for problem chips from API
export interface ProblemChip {
  chipText: string;
  problemStatement: string;
}

// Type for outcome chips from API
export interface OutcomeChip {
  chipText: string;
  outcomeStatement: string;
}

// Type for streaming program state
export interface StreamingProgramState {
  programName: string;
  programDescription: string;
  objectives: string[];
  habitTasks: Array<{
    taskName: string;
    taskDescription: string;
    green: string;
    blue: string;
    purple: string;
    grey: string;
  }>;
}

// Type for streaming chunk data
export interface StreamChunkData {
  content: string;
  section: 'programName' | 'programDescription' | 'programObjectives' | 'habitTasks' | 'unknown';
  taskIndex?: number;
  field?: 'taskName' | 'taskDescription' | 'green' | 'blue' | 'purple' | 'grey';
}

// Type for streaming outcome chips state
export interface StreamingOutcomeChipsState {
  chips: Array<{
    chipText: string;
    outcomeStatement: string;
  }>;
}

// Type for outcome chip streaming chunk data
export interface OutcomeChipStreamData {
  content: string;
  section: 'outcomeChips';
  chipIndex: number;
  field: 'chipText' | 'outcomeStatement';
}

// Helper functions for localStorage UI states
const loadFromStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch {
    return defaultValue;
  }
};

const saveToStorage = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
  }
};

export function useTesa() {
  // Database entities loaded from Express API
  const [companyProfiles, setCompanyProfiles] = useState<CompanyProfile[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [preseededCompanies, setPreseededCompanies] = useState<PreseededCompany[]>([]);
  const [preseededRoles, setPreseededRoles] = useState<PreseededRole[]>([]);
  const [loadingPreseeded, setLoadingPreseeded] = useState(false);

  // UI Selection State persists locally
  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(() =>
    loadFromStorage(STORAGE_KEYS.SELECTED_PROFILE_ID, null)
  );
  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(() =>
    loadFromStorage(STORAGE_KEYS.SELECTED_ROLE_ID, null)
  );

  const [loading, setLoading] = useState(true);

  // Problem chips state (can load on demand or cache locally)
  const [problemChips, setProblemChips] = useState<ProblemChip[]>([]);
  const [loadingProblemChips, setLoadingProblemChips] = useState(false);

  const user = { id: DEFAULT_USER_ID };

  // Fetch initial data from backend API
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [profilesRes, rolesRes, programsRes, preseededRes] = await Promise.all([
        fetch(`${API_BASE_URL}/company-profiles`),
        fetch(`${API_BASE_URL}/roles`),
        fetch(`${API_BASE_URL}/programs`),
        fetch(`${API_BASE_URL}/preseeded-companies`),
      ]);

      if (!profilesRes.ok || !rolesRes.ok || !programsRes.ok || !preseededRes.ok) {
        throw new Error('Failed to fetch data from server');
      }

      const profilesData = await profilesRes.json();
      const rolesData = await rolesRes.json();
      const programsData = await programsRes.json();
      const preseededData = await preseededRes.json();

      setCompanyProfiles(profilesData);
      setRoles(rolesData);
      setPrograms(programsData);
      setPreseededCompanies(preseededData);
    } catch (err) {
      console.error('Error fetching data from backend:', err);
      toast.error('Failed to connect to backend server. Make sure the server is running on port 5001.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Persist UI selection keys to localStorage
  useEffect(() => {
    saveToStorage(STORAGE_KEYS.SELECTED_PROFILE_ID, selectedProfileId);
  }, [selectedProfileId]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.SELECTED_ROLE_ID, selectedRoleId);
  }, [selectedRoleId]);

  // Get active company profile
  const activeProfile = companyProfiles.find(p => p.id === selectedProfileId) || null;

  // Get roles for a specific company
  const getRolesForCompany = useCallback((companyId: string) => {
    return roles.filter(r => r.company_id === companyId);
  }, [roles]);

  // Get roles for the active company
  const activeCompanyRoles = activeProfile ? getRolesForCompany(activeProfile.id) : [];

  // Create company profile with optional initial roles
  const createCompanyProfile = useCallback(async (industry: string, description: string, initialRoles: string[] = []) => {
    const newProfile: CompanyProfile = {
      id: generateId(),
      user_id: DEFAULT_USER_ID,
      company_name: '',
      industry,
      description,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    try {
      const response = await fetch(`${API_BASE_URL}/company-profiles`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProfile),
      });

      if (!response.ok) {
        throw new Error('Failed to create company profile');
      }

      setCompanyProfiles(prev => [...prev, newProfile]);
      setSelectedProfileId(newProfile.id);

      // Create initial roles if any
      const createdRoles: Role[] = [];
      for (const roleName of initialRoles) {
        const newRole: Role = {
          id: generateId(),
          user_id: DEFAULT_USER_ID,
          company_id: newProfile.id,
          role_name: roleName,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        const roleRes = await fetch(`${API_BASE_URL}/roles`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newRole),
        });

        if (roleRes.ok) {
          createdRoles.push(newRole);
        }
      }

      if (createdRoles.length > 0) {
        setRoles(prev => [...createdRoles, ...prev]);
        setSelectedRoleId(createdRoles[0].id);
      }

      toast.success('Company profile created');
      return newProfile;
    } catch (error) {
      console.error(error);
      toast.error('Failed to save company profile');
      return null;
    }
  }, []);

  const updateCompanyProfile = useCallback(async (profileId: string, updates: Partial<CompanyProfile>) => {
    const updatedFields = {
      ...updates,
      updated_at: new Date().toISOString(),
    };

    try {
      const response = await fetch(`${API_BASE_URL}/company-profiles/${profileId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedFields),
      });

      if (!response.ok) {
        throw new Error('Failed to update company profile');
      }

      setCompanyProfiles(prev => prev.map(p =>
        p.id === profileId ? { ...p, ...updatedFields } : p
      ));
    } catch (error) {
      console.error(error);
      toast.error('Failed to update company profile');
    }
  }, []);

  const deleteCompanyProfile = useCallback(async (profileId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/company-profiles/${profileId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete company profile');
      }

      setCompanyProfiles(prev => prev.filter(p => p.id !== profileId));
      if (selectedProfileId === profileId) {
        setSelectedProfileId(null);
      }
      toast.success('Company profile deleted');
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete company profile');
    }
  }, [selectedProfileId]);

  const selectCompanyProfile = useCallback((profileId: string) => {
    setSelectedProfileId(profileId);
  }, []);

  // Add role to a company
  const addRoleToCompany = useCallback(async (companyId: string, roleName: string) => {
    const newRole: Role = {
      id: generateId(),
      user_id: DEFAULT_USER_ID,
      company_id: companyId,
      role_name: roleName,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    try {
      const response = await fetch(`${API_BASE_URL}/roles`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRole),
      });

      if (!response.ok) {
        throw new Error('Failed to create role');
      }

      setRoles(prev => [newRole, ...prev]);
      setSelectedRoleId(newRole.id);
      toast.success('Role added to company');
      return newRole;
    } catch (error) {
      console.error(error);
      toast.error('Failed to add role');
      return null;
    }
  }, []);

  const createRole = useCallback(async (roleName: string) => {
    if (!selectedProfileId) {
      toast.error('Please select a company first');
      return null;
    }
    return addRoleToCompany(selectedProfileId, roleName);
  }, [selectedProfileId, addRoleToCompany]);

  const updateRoleName = useCallback(async (roleId: string, roleName: string) => {
    const updatedAt = new Date().toISOString();
    try {
      const response = await fetch(`${API_BASE_URL}/roles/${roleId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role_name: roleName, updated_at: updatedAt }),
      });

      if (!response.ok) {
        throw new Error('Failed to update role');
      }

      setRoles(prev => prev.map(r =>
        r.id === roleId ? { ...r, role_name: roleName, updated_at: updatedAt } : r
      ));
    } catch (error) {
      console.error(error);
      toast.error('Failed to update role name');
    }
  }, []);

  const deleteRole = useCallback(async (roleId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/roles/${roleId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete role');
      }

      setRoles(prev => prev.filter(r => r.id !== roleId));
      setPrograms(prev => prev.filter(p => p.role_id !== roleId));
      if (selectedRoleId === roleId) {
        setSelectedRoleId(null);
      }
      toast.success('Role deleted');
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete role');
    }
  }, [selectedRoleId]);

  // API call to generate competencies based on problem statement
  const generateCompetencies = useCallback(async (
    problemStatement: string,
    companyIndustry: string,
    companyDescription: string,
    employeeRole: string
  ): Promise<string[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/generate-competency`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          companyIndustry,
          companyDescription,
          employeeRole,
          problemStatement,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate competencies');
      }

      const data = await response.json();

      if (data.status && data.data?.competencies) {
        return data.data.competencies;
      }

      throw new Error('Invalid response format');
    } catch (error) {
      console.error('Error generating competencies:', error);
      toast.error('Failed to generate competencies. Using fallback.');

      return [
        "Deal Execution Discipline",
        "Pipeline Management Rigor",
        "Stakeholder Follow-Through",
        "Portfolio Monitoring Consistency",
        "Process Adherence in Transaction Cycles",
        "Self-Directed Workflow Management"
      ];
    }
  }, []);

  // API call to generate habit program V2 with streaming (SSE) via backend
  const generateHabitProgram = useCallback(async (
    companyIndustry: string,
    companyDescription: string,
    employeeRole: string,
    problemStatement: string,
    competency: string,
    outcome: string,
    onStreamChunk?: (chunkData: StreamChunkData, state: StreamingProgramState) => void
  ): Promise<GeneratedProgram | null> => {
    const streamingState: StreamingProgramState = {
      programName: '',
      programDescription: '',
      objectives: [],
      habitTasks: [],
    };

    try {
      const response = await fetch(`${API_BASE_URL}/generate-habit-program-v2`, {
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

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error('No response body');
      }

      let finalData: GeneratedProgram | null = null;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const text = decoder.decode(value, { stream: true });
        const lines = text.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const jsonStr = line.slice(6);
              const parsed = JSON.parse(jsonStr);

              if (parsed.type === 'chunk' && parsed.content !== undefined) {
                const chunkData: StreamChunkData = {
                  content: parsed.content,
                  section: parsed.section || 'unknown',
                  taskIndex: parsed.taskIndex,
                  field: parsed.field,
                };

                switch (chunkData.section) {
                  case 'programName':
                    streamingState.programName += chunkData.content;
                    break;
                  case 'programDescription':
                    streamingState.programDescription += chunkData.content;
                    break;
                  case 'programObjectives':
                    if (streamingState.objectives.length === 0) {
                      streamingState.objectives.push(chunkData.content);
                    } else {
                      streamingState.objectives[streamingState.objectives.length - 1] += chunkData.content;
                    }
                    break;
                  case 'habitTasks':
                    if (chunkData.taskIndex !== undefined) {
                      while (streamingState.habitTasks.length <= chunkData.taskIndex) {
                        streamingState.habitTasks.push({
                          taskName: '',
                          taskDescription: '',
                          green: '',
                          blue: '',
                          purple: '',
                          grey: ''
                        });
                      }
                      const field = chunkData.field;
                      if (field) {
                        streamingState.habitTasks[chunkData.taskIndex][field as keyof Omit<HabitTask, 'duration'>] += chunkData.content;
                      }
                    }
                    break;
                }

                onStreamChunk?.(chunkData, { ...streamingState });
              } else if (parsed.type === 'done' && parsed.status && parsed.data?.habitProgram) {
                const { habitProgram } = parsed.data;
                finalData = {
                  programName: habitProgram.programName,
                  programDescription: habitProgram.programDescription,
                  objectives: habitProgram.programObjectives || [],
                  habitTasks: habitProgram.habitTasks?.map((task: any) => ({
                    taskName: task.taskName,
                    taskDescription: task.taskDescription,
                    green: task.green,
                    blue: task.blue,
                    purple: task.purple,
                    grey: task.grey,
                  })) || [],
                };
              }
            } catch {
              // Ignore partial JSON parsing errors
            }
          }
        }
      }

      if (finalData) {
        return finalData;
      }

      throw new Error('Invalid response format');
    } catch (error) {
      console.error('Error generating habit program:', error);
      toast.error('Failed to generate habit program. Using fallback.');

      const fallbackHabitTasks: HabitTask[] = [
        {
          taskName: 'Focus Activation',
          taskDescription: 'Start work with clear priority alignment and minimal distraction.',
          green: 'I will take 5 minutes at start of shift to select my top priority task and document it, then log my commitment today.',
          blue: 'I will spend 5 minutes reviewing project goals, setting aside my phone, and listing my main priority to reflect on my focus today.',
          purple: 'I will dedicate 5 minutes organizing my workflow checklist, setting a focus timer, and logging my performance rate today.',
          grey: 'I will spend 5 minutes reading my weekly targets and writing down one priority to rebuild my momentum today.'
        },
        {
          taskName: 'Action Execution',
          taskDescription: 'Execute critical assignments with attention to accuracy and detail.',
          green: 'I will spend 10 minutes performing the core checklist steps for my active file and marking my progress today.',
          blue: 'I will spend 10 minutes cross-checking my file parameters against our quality standard and recording my check today.',
          purple: 'I will spend 10 minutes reviewing my outputs for gaps, finalizing files, and capturing the quality status today.',
          grey: 'I will dedicate 10 minutes completing one pending action item and noting down the output status today.'
        },
        {
          taskName: 'Proactive Alertness',
          taskDescription: 'Recognize potential blocks early and communicate them.',
          green: 'I will spend 5 minutes scanning active workflows for bottlenecks and summarizing any challenges I see today.',
          blue: 'I will spend 5 minutes checking logs for anomalies, noting any warnings, and documenting what I observed today.',
          purple: 'I will dedicate 5 minutes diagnosing system performance warnings, raising early alerts, and logging the prevention step today.',
          grey: 'I will set aside 5 minutes looking over past issues and noting down one warning sign to keep in mind today.'
        },
        {
          taskName: 'Team Coordination',
          taskDescription: 'Align with colleagues on workflow status and handover.',
          green: 'I will spend 5 minutes sharing my task progress status with a teammate and jotting down our alignment today.',
          blue: 'I will take 5 minutes reviewing colleagues\' handovers, clarifying blockers, and documenting our team agreement today.',
          purple: 'I will spend 5 minutes running a brief alignment check with the team, identifying task dependencies, and listing actions today.',
          grey: 'I will take 3 minutes checking project chat updates and writing down my current task status today.'
        },
        {
          taskName: 'Continuous Curation',
          taskDescription: 'Organize files, templates, and documentation for efficiency.',
          green: 'I will spend 5 minutes cleaning my workspace files, archiving finished items, and logging my cleanup today.',
          blue: 'I will spend 5 minutes auditing templates for updates, standardizing folder paths, and recording my update today.',
          purple: 'I will dedicate 5 minutes updating shared playbooks with tips, structuring folders, and noting the curation step today.',
          grey: 'I will take 3 minutes deleting temporary download files and noting down the storage saved today.'
        },
        {
          taskName: 'Quality Verification',
          taskDescription: 'Inspect deliverables against requirements before delivery.',
          green: 'I will take 5 minutes double-checking my task outputs against user criteria and documenting my checks today.',
          blue: 'I will spend 5 minutes verifying file compatibility, testing input borders, and logging the criteria met today.',
          purple: 'I will dedicate 5 minutes running end-to-end user validations, correcting small bugs, and capturing outcomes today.',
          grey: 'I will take 3 minutes checking one recent deliverable for common errors and recording my check today.'
        },
        {
          taskName: 'Reflection Audit',
          taskDescription: 'Assess yesterday\'s challenges and learn for today.',
          green: 'I will spend 5 minutes reading past feedback and noting down one improvement point to practice today.',
          blue: 'I will spend 5 minutes analyzing workflow speed gaps, planning solutions, and documenting my plan today.',
          purple: 'I will dedicate 5 minutes curating lessons from team reviews, writing best practices, and logging the insight today.',
          grey: 'I will take 3 minutes reviewing my last task block and writing one challenge to avoid today.'
        },
        {
          taskName: 'Client Empathy',
          taskDescription: 'Align outputs to match user needs and expectations.',
          green: 'I will spend 5 minutes studying user feedback logs and writing down one customer need to address today.',
          blue: 'I will take 5 minutes reviewing client profile guides, matching project inputs, and recording the approach today.',
          purple: 'I will dedicate 5 minutes validating my outputs with client persona checks and logging my alignment today.',
          grey: 'I will spend 3 minutes reading client survey ratings and noting one key takeaway today.'
        },
        {
          taskName: 'Risk Mitigation',
          taskDescription: 'Ensure safety, security, and policy compliance.',
          green: 'I will spend 5 minutes checking security access keys, closing background apps, and documenting my safety check today.',
          blue: 'I will take 5 minutes auditing file permissions, updating credentials, and logging the compliance status today.',
          purple: 'I will dedicate 5 minutes running complete system security audits, testing compliance, and capturing the result today.',
          grey: 'I will spend 3 minutes checking if database backups are updated and noting the verification status today.'
        },
        {
          taskName: 'Momentum Maintenance',
          taskDescription: 'Wrap up shifts with clean transfers and plan tomorrow.',
          green: 'I will spend 5 minutes drafting my end-of-shift status update and writing down my next priorities today.',
          blue: 'I will take 5 minutes organizing pending tasks, writing notes for the morning, and logging the transfer plan today.',
          purple: 'I will dedicate 5 minutes holding a status handoff session, planning project timelines, and recording actions today.',
          grey: 'I will take 3 minutes closing all tabs and listing one task to start first thing tomorrow.'
        }
      ];

      return {
        programName: `${competency} Development Program`,
        programDescription: `A structured habit program designed to develop ${competency.toLowerCase()} capabilities through daily practice and reflection.`,
        objectives: [
          `Build foundational ${competency.toLowerCase()} skills through consistent daily practice`,
          "Create measurable improvement in task completion and quality",
          "Establish sustainable habits that support long-term professional growth"
        ],
        habitTasks: fallbackHabitTasks
      };
    }
  }, []);

  // API call to fetch problem chips based on company and role
  const fetchProblemChipsFromAPI = useCallback(async (
    roleId: string,
    companyIndustry: string,
    companyDescription: string,
    employeeRole: string
  ): Promise<ProblemChip[]> => {
    try {
      setLoadingProblemChips(true);
      const response = await fetch(`${API_BASE_URL}/generate-problem-chips`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          companyIndustry,
          companyDescription,
          employeeRole,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch problem chips');
      }

      const data = await response.json();

      if (data.status && data.data?.chips) {
        const chips = data.data.chips as ProblemChip[];
        setProblemChips(chips);
        return chips;
      }

      throw new Error('Invalid response format');
    } catch (error) {
      console.error('Error fetching problem chips:', error);
      const fallbackChips: ProblemChip[] = [
        {
          chipText: "They know what to do but lack consistency",
          problemStatement: "They know what to do but lack the consistency, rhythm and discipline"
        },
        {
          chipText: "Follow-ups happen only after escalation",
          problemStatement: "Follow-ups happen only after escalation, not proactively"
        },
        {
          chipText: "Daily targets tracked mentally",
          problemStatement: "Daily targets are tracked mentally instead of documented"
        },
        {
          chipText: "Tasks not completed on time",
          problemStatement: "Tasks started but not completed on time without reminders"
        },
      ];
      setProblemChips(fallbackChips);
      return fallbackChips;
    } finally {
      setLoadingProblemChips(false);
    }
  }, []);

  // Effect to load problem chips when role changes
  useEffect(() => {
    const selectedRole = roles.find(r => r.id === selectedRoleId);
    if (!selectedRole || !selectedRoleId) {
      setProblemChips([]);
      return;
    }

    const company = companyProfiles.find(p => p.id === selectedRole.company_id);
    if (!company) return;

    fetchProblemChipsFromAPI(selectedRoleId, company.industry, company.description, selectedRole.role_name);
  }, [selectedRoleId, roles, companyProfiles, fetchProblemChipsFromAPI]);

  // API call to fetch outcome chips
  const fetchOutcomeChips = useCallback(async (
    companyIndustry: string,
    companyDescription: string,
    employeeRole: string,
    problemStatement: string,
    competency: string
  ): Promise<OutcomeChip[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/generate-outcome-chips`, {
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
  }, []);

  const saveProgram = useCallback(async (programData: Omit<Program, 'id' | 'created_at'>): Promise<void> => {
    const newProgram: Program = {
      ...programData,
      id: generateId(),
      created_at: new Date().toISOString(),
    };

    try {
      const response = await fetch(`${API_BASE_URL}/programs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProgram),
      });

      if (!response.ok) {
        throw new Error('Failed to save program');
      }

      setPrograms(prev => [newProgram, ...prev]);
      toast.success('Program saved successfully');
    } catch (error) {
      console.error(error);
      toast.error('Failed to save program to server');
    }
  }, []);

  const selectPreseededCompany = useCallback(async (companyId: string) => {
    try {
      setLoadingPreseeded(true);
      const res = await fetch(`${API_BASE_URL}/preseeded-companies/${companyId}/roles`);
      if (!res.ok) throw new Error('Failed to fetch preseeded roles');
      const rolesData = await res.json() as PreseededRole[];
      setPreseededRoles(rolesData);

      // Automatically create or set active company profile
      const preseededComp = preseededCompanies.find(c => c.id === companyId);
      if (preseededComp) {
        // Look if we already have a company profile for this preseeded company
        let existingProfile = companyProfiles.find(p => p.industry === preseededComp.industry && p.description === preseededComp.description);
        if (!existingProfile) {
          // Create a new company profile automatically
          existingProfile = await createCompanyProfile(preseededComp.industry, preseededComp.description, []);
        }
        if (existingProfile) {
          setSelectedProfileId(existingProfile.id);

          // Add seeded roles to the database if not present
          const existingRoles = roles.filter(r => r.company_id === existingProfile!.id);
          const rolesToCreate = rolesData.filter(pr => !existingRoles.some(r => r.role_name === pr.role_name));

          const createdRoles: Role[] = [];
          for (const pr of rolesToCreate) {
            const role = await addRoleToCompany(existingProfile!.id, pr.role_name);
            if (role) {
              createdRoles.push(role);
            }
          }

          // Select the first role automatically
          const allCompanyRoles = [...existingRoles, ...createdRoles];
          if (allCompanyRoles.length > 0) {
            setSelectedRoleId(allCompanyRoles[0].id);
          } else {
            setSelectedRoleId(null);
          }
        }
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to load company roles');
    } finally {
      setLoadingPreseeded(false);
    }
  }, [preseededCompanies, companyProfiles, roles, createCompanyProfile, addRoleToCompany]);

  const selectedRole = roles.find(r => r.id === selectedRoleId) || null;
  const rolePrograms = programs.filter(p => p.role_id === selectedRoleId);

  const companyRoles = activeProfile
    ? roles.filter(r => r.company_id === activeProfile.id)
    : [];

  return {
    user,
    loading,
    companyProfiles,
    activeProfile,
    selectedProfileId,
    roles: companyRoles,
    allRoles: roles,
    programs,
    selectedRole,
    selectedRoleId,
    rolePrograms,
    activeCompanyRoles,
    problemChips,
    loadingProblemChips,
    preseededCompanies,
    preseededRoles,
    loadingPreseeded,
    selectPreseededCompany,
    setSelectedRoleId,
    createCompanyProfile,
    updateCompanyProfile,
    deleteCompanyProfile,
    selectCompanyProfile,
    createRole,
    addRoleToCompany,
    updateRoleName,
    deleteRole,
    getRolesForCompany,
    generateCompetencies,
    generateHabitProgram,
    fetchOutcomeChips,
    saveProgram,
  };
}
