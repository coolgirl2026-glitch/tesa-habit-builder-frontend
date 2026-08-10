import { Plus, Target } from 'lucide-react';
import type { Program } from '@/types/tesa';
import { cn } from '@/lib/utils';

interface ProgramChipsProps {
 programs: Program[];
 selectedProgramId: string | null;
 creatingNew: boolean;
 onSelectProgram: (programId: string | null) => void;
 onNewProgram: () => void;
}

export function ProgramChips({
 programs,
 selectedProgramId,
 creatingNew,
 onSelectProgram,
 onNewProgram,
}: ProgramChipsProps) {
 return (
 <div className="flex items-center justify-start gap-2 flex-wrap px-8 py-3 bg-white rounded-2xl border border-slate-200">
 {programs.map((program) => (
 <div
 key={program.id}
 className={cn(
"cursor-pointer px-4 py-2 text-xs font-semibold transition-all duration-200 rounded-xl border flex items-center gap-2",
"hover:shadow-md",
 selectedProgramId === program.id && !creatingNew
 ?"border-primary bg-primary/10 text-primary shadow-sm"
 :"border-slate-200 bg-white text-slate-700 hover:bg-white"
 )}
 onClick={() => onSelectProgram(program.id)}
 >
 <Target className="h-3.5 w-3.5"/>
 {program.program_name}
 </div>
 ))}
 <div
 className={cn(
"cursor-pointer px-4 py-2 text-xs font-semibold transition-all duration-200 rounded-xl border flex items-center justify-center gap-1.5",
"hover:shadow-md",
 creatingNew
 ?"border-primary bg-primary/10 text-primary shadow-sm"
 :"border-slate-200 bg-white text-slate-700 hover:bg-white"
 )}
 onClick={onNewProgram}
 >
 <Plus className="h-4 w-4"/>
 <span>New Program</span>
 </div>
 </div>
 );
}
