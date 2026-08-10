import { useState, useRef } from 'react';
import { ProblemStatementSection } from './steps/ProblemStatementSection';
import { CompetencySelectionSection } from './steps/CompetencySelectionSection';
import { OutcomeSection } from './steps/OutcomeSection';
import { GeneratedProgramSection } from './steps/GeneratedProgramSection';
import { HabitSelectionSection } from './steps/HabitSelectionSection';
import { ProgramSavedSection } from './steps/ProgramSavedSection';
import { StepProgressIndicator } from './steps/StepProgressIndicator';
import type { GeneratedProgram } from '@/types/tesa';
import type { ProblemChip, OutcomeChip, StreamChunkData, StreamingProgramState } from '@/hooks/useTesa';
import { Loader2, Target } from 'lucide-react';

type FlowStep = 'problem' | 'competency' | 'outcome' | 'program' | 'habits' | 'saved';

interface Habit {
 title: string;
 description: string;
 duration: number;
}

interface ProgressiveFlowProps {
 onProgramSaved: (program: {
 problemStatement: string;
 competency: string;
 outcome: string;
 programName: string;
 programDescription: string;
 objectives: string[];
 habits: HabitTask[];
 }) => void;
 companyIndustry: string;
 companyDescription: string;
 employeeRole: string;
 onGenerateCompetencies: (
 problemStatement: string,
 companyIndustry: string,
 companyDescription: string,
 employeeRole: string
 ) => Promise<string[]>;
 onGenerateHabitProgram: (
 companyIndustry: string,
 companyDescription: string,
 employeeRole: string,
 problemStatement: string,
 competency: string,
 outcome: string,
 onStreamChunk?: (chunkData: StreamChunkData, state: StreamingProgramState) => void
 ) => Promise<GeneratedProgram | null>;
 problemChips: ProblemChip[];
 loadingProblemChips: boolean;
 onFetchOutcomeChips: (
 companyIndustry: string,
 companyDescription: string,
 employeeRole: string,
 problemStatement: string,
 competency: string
 ) => Promise<OutcomeChip[]>;
}

export function ProgressiveFlow({
 onProgramSaved,
 companyIndustry,
 companyDescription,
 employeeRole,
 onGenerateCompetencies,
 onGenerateHabitProgram,
 problemChips,
 loadingProblemChips,
 onFetchOutcomeChips,
}: ProgressiveFlowProps) {
 const [step, setStep] = useState<FlowStep>('problem');
 const [problemStatement, setProblemStatement] = useState<string | null>(null);
 const [competency, setCompetency] = useState<string | null>(null);
 const [outcome, setOutcome] = useState<string | null>(null);
 const [savedHabits, setSavedHabits] = useState<Habit[]>([]);
 const [competencies, setCompetencies] = useState<string[]>([]);
 const [loadingCompetencies, setLoadingCompetencies] = useState(false);
 const [generatedProgram, setGeneratedProgram] = useState<GeneratedProgram | null>(null);
 const [loadingProgram, setLoadingProgram] = useState(false);
 const [outcomeChips, setOutcomeChips] = useState<OutcomeChip[]>([]);
 const [loadingOutcomeChips, setLoadingOutcomeChips] = useState(false);
 const [streamingState, setStreamingState] = useState<StreamingProgramState | null>(null);

 // Refs for scrolling to sections
 const competencyRef = useRef<HTMLDivElement>(null);
 const outcomeRef = useRef<HTMLDivElement>(null);
 const programRef = useRef<HTMLDivElement>(null);
 const habitsRef = useRef<HTMLDivElement>(null);

 const scrollToRef = (ref: React.RefObject<HTMLDivElement>) => {
 setTimeout(() => {
 ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
 }, 100);
 };

 const handleProblemComplete = async (statement: string) => {
 setProblemStatement(statement);
 setStep('competency');
 setLoadingCompetencies(true);
 scrollToRef(competencyRef);

 try {
 const result = await onGenerateCompetencies(
 statement,
 companyIndustry,
 companyDescription,
 employeeRole
 );
 setCompetencies(result);
 } catch (error) {
 console.error('Failed to generate competencies:', error);
 // Fallback competencies
 setCompetencies([
"Deal Execution Discipline",
"Pipeline Management Rigor",
"Stakeholder Follow-Through",
"Portfolio Monitoring Consistency",
"Process Adherence",
"Self-Directed Workflow Management"
 ]);
 } finally {
 setLoadingCompetencies(false);
 }
 };

 const handleCompetencyComplete = async (selected: string) => {
 setCompetency(selected);
 setStep('outcome');
 setLoadingOutcomeChips(true);
 scrollToRef(outcomeRef);

 try {
 const chips = await onFetchOutcomeChips(
 companyIndustry,
 companyDescription,
 employeeRole,
 problemStatement || '',
 selected
 );
 setOutcomeChips(chips);
 } catch (error) {
 console.error('Failed to fetch outcome chips:', error);
 setOutcomeChips([]);
 } finally {
 setLoadingOutcomeChips(false);
 }
 };

 const handleOutcomeComplete = async (outcomeText: string) => {
 setOutcome(outcomeText);
 setStep('program');
 setLoadingProgram(true);
 setStreamingState(null); // Reset streaming state
 scrollToRef(programRef);

 // Streaming callback to update state as chunks come in
 const handleStreamChunk = (_chunkData: StreamChunkData, state: StreamingProgramState) => {
 setStreamingState({ ...state });
 };

 try {
 const program = await onGenerateHabitProgram(
 companyIndustry,
 companyDescription,
 employeeRole,
 problemStatement || '',
 competency || '',
 outcomeText,
 handleStreamChunk
 );
 setGeneratedProgram(program);
 } catch (error) {
 console.error('Failed to generate habit program:', error);
 
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

 setGeneratedProgram({
 programName: `${competency} Development Program`,
 programDescription: `A structured habit program designed to develop ${competency?.toLowerCase()} capabilities.`,
 objectives: [
 'Build consistent daily practices',
 'Create measurable improvement',
 'Establish sustainable habits'
 ],
 habitTasks: fallbackHabitTasks
 });
 } finally {
 setLoadingProgram(false);
 // Auto-advance to habits after program is generated
 setTimeout(() => {
 setStep('habits');
 scrollToRef(habitsRef);
 }, 300);
 }
 };

  const handleSave = (selectedHabits: HabitTask[]) => {
    setSavedHabits(selectedHabits);
    if (problemStatement && competency && outcome && generatedProgram) {
      const allHabitsWithSelection = generatedProgram.habitTasks.map(task => ({
        ...task,
        selected: selectedHabits.some(sh => sh.taskName === task.taskName)
      }));

      onProgramSaved({
        problemStatement,
        competency,
        outcome,
        programName: generatedProgram.programName,
        programDescription: generatedProgram.programDescription,
        objectives: generatedProgram.objectives,
        habits: allHabitsWithSelection,
      });
    }
    setStep('saved');
  };

 const handleStartNew = () => {
 setStep('problem');
 setProblemStatement(null);
 setCompetency(null);
 setOutcome(null);
 setSavedHabits([]);
 setCompetencies([]);
 setLoadingCompetencies(false);
 setGeneratedProgram(null);
 setLoadingProgram(false);
 setOutcomeChips([]);
 setLoadingOutcomeChips(false);
 setStreamingState(null);
 };

 const isStepComplete = (s: FlowStep): boolean => {
 switch (s) {
 case 'problem': return problemStatement !== null;
 case 'competency': return competency !== null;
 case 'outcome': return outcome !== null;
 case 'program': return outcome !== null;
 case 'habits': return savedHabits.length === 5;
 default: return false;
 }
 };

 const getCompletedSteps = (): FlowStep[] => {
 const completed: FlowStep[] = [];
 if (problemStatement !== null) completed.push('problem');
 if (competency !== null) completed.push('competency');
 if (outcome !== null) completed.push('outcome', 'program');
 if (savedHabits.length === 5) completed.push('habits');
 return completed;
 };

  if (step === 'saved') {
  return (
  <div className="py-5 px-8 max-w-[840px] mx-auto">
  <ProgramSavedSection
  programName={generatedProgram?.programName || 'Habit Program'}
  habitCount={savedHabits.length}
  onStartNew={handleStartNew}
  selectedHabits={savedHabits}
  problemStatement={problemStatement || ''}
  competency={competency || ''}
  outcome={outcome || ''}
  />
  </div>
  );
  }

 return (
 <div className="py-5 px-8 max-w-[840px] mx-auto space-y-4">
 {/* Step Progress Indicator */}
 <StepProgressIndicator
 currentStep={step}
 completedSteps={getCompletedSteps()}
 />

 {/* Section 1: Problem Statement */}
 <ProblemStatementSection
 onComplete={handleProblemComplete}
 disabled={isStepComplete('problem')}
 problemChips={problemChips}
 loadingChips={loadingProblemChips}
 />

 {/* Section 2: Competency Selection - shown after problem complete */}
 {isStepComplete('problem') && (
 <div ref={competencyRef}>
 <CompetencySelectionSection
 competencies={competencies}
 loading={loadingCompetencies}
 onComplete={handleCompetencyComplete}
 disabled={isStepComplete('competency')}
 />
 </div>
 )}

 {/* Section 3: Expected Outcome - shown only after outcome chips are loaded */}
 {isStepComplete('competency') && competency && (
 <div ref={outcomeRef}>
 {loadingOutcomeChips ? (
 // Loading state while fetching outcome suggestions
 <section className="bg-card rounded-lg border border-border p-6 shadow-sm animate-fade-in-up">
 <div className="flex flex-col items-center justify-center py-8">
 <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
 <Loader2 className="h-6 w-6 text-primary animate-spin"/>
 </div>
 <h3 className="text-lg font-semibold text-foreground mb-2">Generating Outcome Suggestions</h3>
 <p className="text-sm text-muted-foreground text-center max-w-md">
 Analyzing the competency"{competency}"to create relevant outcome suggestions...
 </p>
 </div>
 </section>
 ) : (
 <OutcomeSection
 competency={competency}
 onComplete={handleOutcomeComplete}
 disabled={isStepComplete('outcome')}
 outcomeChips={outcomeChips}
 loadingChips={false}
 />
 )}
 </div>
 )}

 {/* Section 4: Generated Program - shown after outcome */}
 {isStepComplete('outcome') && (
 <div ref={programRef}>
 <GeneratedProgramSection
 programName={generatedProgram?.programName || ''}
 programDescription={generatedProgram?.programDescription || ''}
 objectives={generatedProgram?.objectives || []}
 habitTasks={generatedProgram?.habitTasks}
 loading={loadingProgram}
 streamingState={streamingState}
 />
 </div>
 )}

 {/* Section 5: Habit Selection - shown after program displayed */}
 {step === 'habits' && generatedProgram && (
 <div ref={habitsRef}>
 <HabitSelectionSection
 habits={generatedProgram.habitTasks}
 onSave={handleSave}
 />
 </div>
 )}
 </div>
 );
}
