import { useState, useEffect } from 'react';
import { ProgramChips } from './ProgramChips';
import { ProgressiveFlow } from './ProgressiveFlow';
import { ProgramViewer } from './ProgramViewer';
import type { Role, Program, CompanyProfile, GeneratedProgram, HabitTask } from '@/types/tesa';
import type { ProblemChip, OutcomeChip, StreamChunkData, StreamingProgramState } from '@/hooks/useTesa';
import { Sparkles, Users } from 'lucide-react';

interface MainContentProps {
 selectedRole: Role | null;
 rolePrograms: Program[];
 onSaveProgram: (program: Omit<Program, 'id' | 'created_at'>) => void;
 activeProfile: CompanyProfile | null;
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
 selectedProgramId: string | null;
 setSelectedProgramId: (id: string | null) => void;
 creatingNew: boolean;
 setCreatingNew: (creating: boolean) => void;
}

export function MainContent({
 selectedRole,
 rolePrograms,
 onSaveProgram,
 activeProfile,
 onGenerateCompetencies,
 onGenerateHabitProgram,
 problemChips,
 loadingProblemChips,
 onFetchOutcomeChips,
 selectedProgramId,
 setSelectedProgramId,
 creatingNew,
 setCreatingNew,
}: MainContentProps) {
 const [flowKey, setFlowKey] = useState(0);

  const selectedProgram = rolePrograms.find(p => p.id === selectedProgramId);

  useEffect(() => {
    // Reset flow and select "creating new" program when role changes
    setFlowKey(prev => prev + 1);
    setSelectedProgramId(null);
    setCreatingNew(true);
  }, [selectedRole?.id, setSelectedProgramId, setCreatingNew]);

 const handleNewProgram = () => {
 setSelectedProgramId(null);
 setCreatingNew(true);
 setFlowKey(prev => prev + 1);
 };

 const handleSelectProgram = (programId: string | null) => {
 setSelectedProgramId(programId);
 setCreatingNew(false);
 };

 const handleProgramSaved = (data: {
 problemStatement: string;
 competency: string;
 outcome: string;
 programName: string;
 programDescription: string;
 objectives: string[];
 habits: HabitTask[];
 }) => {
 if (!selectedRole) return;

 onSaveProgram({
 role_id: selectedRole.id,
 user_id: selectedRole.user_id,
 problem_statement: data.problemStatement,
 competency: data.competency,
 outcome: data.outcome,
 program_name: data.programName,
 program_description: data.programDescription,
 program_objectives: data.objectives,
 selected_habits: data.habits,
 });
 };

 if (!selectedRole) {
 return (
 <div className="flex-1 flex flex-col bg-transparent">
 <header className="h-auto py-5 border-b border-slate-200 px-8 bg-white rounded-2xl">
 <div className="flex flex-col">
 <h1 className="text-xl font-bold text-slate-900">TESA</h1>
 <span className="text-xs text-slate-500 mt-1">Transforming everyday actions into consistent performance</span>
 </div>
 </header>
 <div className="flex-1 flex items-center justify-center px-8 py-20">
 <div className="text-center max-w-md animate-fade-in-up">
 <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-6">
 <Users className="h-8 w-8 text-primary"/>
 </div>
 <h2 className="text-2xl font-bold text-slate-800 mb-3">Welcome to TESA</h2>
 <p className="text-sm text-slate-500 mb-6 leading-relaxed">
 Select or search for a company context at the top, then choose or create a role on the left panel to begin.
 </p>
 <div className="flex items-center justify-center gap-2 text-xs font-semibold text-primary bg-primary/10 rounded-xl px-4 py-3 border border-primary/20">
 <Sparkles className="h-4 w-4 text-primary"/>
 <span>Transform everyday actions into lasting habits</span>
 </div>
 </div>
 </div>
 </div>
 );
 }

 return (
 <div className="flex-1 flex flex-col overflow-hidden bg-transparent space-y-6">
 <header className="h-auto py-5 border-b border-slate-200 px-8 bg-white rounded-2xl shrink-0">
 <div className="flex flex-col">
 <h1 className="text-xl font-bold text-slate-900">TESA</h1>
 <span className="text-xs text-slate-500 mt-1">Transforming everyday actions into consistent performance</span>
 </div>
 </header>

 <ProgramChips
 programs={rolePrograms}
 selectedProgramId={selectedProgramId}
 creatingNew={creatingNew}
 onSelectProgram={handleSelectProgram}
 onNewProgram={handleNewProgram}
 />

 <div className="flex-1 overflow-auto">
 {selectedProgram && !creatingNew ? (
 <ProgramViewer program={selectedProgram} roleName={selectedRole.role_name} />
 ) : (
 <ProgressiveFlow
 key={flowKey}
 onProgramSaved={handleProgramSaved}
 companyIndustry={activeProfile?.industry || ''}
 companyDescription={activeProfile?.description || ''}
 employeeRole={selectedRole.role_name}
 onGenerateCompetencies={onGenerateCompetencies}
 onGenerateHabitProgram={onGenerateHabitProgram}
 problemChips={problemChips}
 loadingProblemChips={loadingProblemChips}
 onFetchOutcomeChips={onFetchOutcomeChips}
 />
 )}
 </div>
 </div>
 );
}
