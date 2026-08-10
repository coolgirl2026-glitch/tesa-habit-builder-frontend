import { useState } from 'react';
import { Target, Calendar, ChevronDown, ChevronRight, Zap, Users } from 'lucide-react';
import type { Program } from '@/types/tesa';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface ProgramViewerProps {
 program: Program;
 roleName?: string;
}

type ProgressionTab = 'green' | 'blue' | 'purple' | 'grey';

export function ProgramViewer({ program, roleName }: ProgramViewerProps) {
 const [contextOpen, setContextOpen] = useState(false);
 const [activeTabs, setActiveTabs] = useState<Record<number, ProgressionTab>>(
 Object.fromEntries(program.selected_habits.map((_, i) => [i, 'green']))
 );

 const setTab = (taskIndex: number, tab: ProgressionTab) => {
 setActiveTabs(prev => ({ ...prev, [taskIndex]: tab }));
 };

 return (
 <div className="py-6 px-8 max-w-3xl mx-auto space-y-6 bg-white border border-slate-200 rounded-2xl shadow-2xl mt-4 animate-fade-in-up">
 {/* Program Snapshot */}
 <div className="border-b border-slate-200 pb-6">
 <h1 className="text-xl font-bold text-slate-900 mb-2">{program.program_name}</h1>
 
 <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-semibold text-slate-500 mb-3">
 <span className="inline-flex items-center gap-1.5 text-primary">
 <Target className="h-3.5 w-3.5"/>
 {program.competency}
 </span>
  <span className="inline-flex items-center gap-1.5">
  <Zap className="h-3.5 w-3.5 text-amber-500"/>
  {program.selected_habits.filter(h => h.selected !== false).length} selected habit sets
  </span>
  {roleName && (
  <span className="inline-flex items-center gap-1.5">
  <Users className="h-3.5 w-3.5 text-blue-400"/>
  {roleName}
  </span>
  )}
  <span className="inline-flex items-center gap-1.5">
  <Calendar className="h-3.5 w-3.5 text-emerald-500"/>
  {format(new Date(program.created_at), 'MMM d, yyyy')}
  </span>
  </div>
  
  <p className="text-xs text-slate-500 leading-relaxed">{program.program_description}</p>
  </div>

  {/* Collapsible Context Section */}
  <Collapsible open={contextOpen} onOpenChange={setContextOpen}>
  <CollapsibleTrigger className="flex items-center gap-2 w-full text-left group">
  <div className="flex items-center gap-2 flex-1">
  {contextOpen ? (
  <ChevronDown className="h-4 w-4 text-slate-500"/>
  ) : (
  <ChevronRight className="h-4 w-4 text-slate-500"/>
  )}
  <span className="text-xs font-bold uppercase tracking-wider text-slate-700">Context parameters</span>
  </div>
  <span className="text-xs text-slate-500 group-hover:text-primary transition-colors">
  {contextOpen ? 'Collapse' : 'Expand details'}
  </span>
  </CollapsibleTrigger>
  
  <CollapsibleContent className="mt-3">
  <div className="space-y-4 pl-6 border-l border-slate-200">
  <div>
  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1">Problem Statement</p>
  <p className="text-xs text-slate-700 leading-relaxed">{program.problem_statement}</p>
  </div>
  <div>
  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1">Expected Outcome</p>
  <p className="text-xs text-slate-700 leading-relaxed">{program.outcome}</p>
  </div>
  <div>
  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1">Target Competency</p>
  <p className="text-xs font-semibold text-slate-800">{program.competency}</p>
  </div>
  </div>
  </CollapsibleContent>
  
  {!contextOpen && (
  <p className="text-xs text-slate-500 mt-2 pl-6 line-clamp-1">
  {program.problem_statement}
  </p>
  )}
  </Collapsible>

  {/* Habits - Elevated Section */}
  <div className="pt-4 border-t border-slate-200">
  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-4">
  Daily Action Sets in This Program
  </p>
  
  <div className="space-y-4">
  {program.selected_habits.map((habit, index) => {
  const currentTab = activeTabs[index] || 'green';
  const isHabitSelected = habit.selected !== false;
  return (
  <div 
  key={index}
  className={cn(
    "flex flex-col gap-3 p-4 rounded-xl bg-white border border-slate-200 transition-all",
    isHabitSelected
      ? "border-l-4 border-l-primary shadow-sm"
      : "border-l-4 border-l-slate-300 opacity-60 bg-slate-50/50"
  )}
  >
  <div className="flex items-start gap-4">
  <span className={cn(
    "flex items-center justify-center w-7 h-7 rounded-lg text-xs font-bold shrink-0 border",
    isHabitSelected
      ? "bg-primary/15 text-primary border-primary/20 animate-pulse-soft"
      : "bg-slate-100 text-slate-400 border-slate-200"
  )}>
  {index + 1}
  </span>
  <div className="flex-1 min-w-0">
  <div className="flex items-center gap-2">
  <span className="font-semibold text-slate-800 text-xs">{habit.taskName}</span>
  {isHabitSelected ? (
    <span className="text-[9px] font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded-full uppercase">Selected</span>
  ) : (
    <span className="text-[9px] font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-full uppercase">Not Selected</span>
  )}
  </div>
  <p className="text-xs text-slate-500 mt-1 leading-relaxed">{habit.taskDescription}</p>
  </div>
  </div>

  {/* Progression Tabs inside Viewer */}
  <div className="ml-11 pt-2.5 border-t border-slate-200 space-y-2">
  <div className="flex gap-1 bg-blue-50 p-0.5 rounded-lg border border-slate-200 w-fit">
  {(['green', 'blue', 'purple', 'grey'] as ProgressionTab[]).map(tab => (
  <button
  key={tab}
  onClick={() => setTab(index, tab)}
  className={cn(
  "px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider rounded transition-all",
  currentTab === tab
  ? tab === 'green' ?"bg-green-500/20 text-green-400 border border-green-500/30"
  : tab === 'blue' ?"bg-blue-500/20 text-blue-400 border border-blue-500/30"
  : tab === 'purple' ?"bg-purple-500/20 text-purple-400 border border-purple-500/30"
  :"bg-blue-100 text-slate-700 border border-slate-300/30"
  :"text-slate-500 hover:text-slate-700 border border-transparent"
  )}
  >
  {tab}
  </button>
  ))}
  </div>

  <div className="bg-blue-50/60 border border-slate-200 rounded-lg p-2.5 text-[11px] text-slate-700 italic leading-relaxed">
  {currentTab === 'green' && habit.green}
  {currentTab === 'blue' && habit.blue}
  {currentTab === 'purple' && habit.purple}
  {currentTab === 'grey' && habit.grey}
  </div>
  </div>
  </div>
  );
  })}
  </div>
 </div>
 </div>
 );
}
