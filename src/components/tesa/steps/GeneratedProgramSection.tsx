import { useState } from 'react';
import { Target, CheckCircle2, Sparkles, Loader2, ListChecks, Copy, Check } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import type { StreamingProgramState } from '@/hooks/useTesa';
import type { HabitTask } from '@/types/tesa';

interface GeneratedProgramSectionProps {
 programName: string;
 programDescription: string;
 objectives: string[];
 habitTasks?: HabitTask[];
 loading?: boolean;
 streamingState?: StreamingProgramState | null;
}

export function GeneratedProgramSection({
 programName,
 programDescription,
 objectives,
 habitTasks,
 loading,
 streamingState,
}: GeneratedProgramSectionProps) {
 const [copied, setCopied] = useState(false);

 const showStreaming = loading && streamingState;
 const hasContent = streamingState && (
 streamingState.programName ||
 streamingState.programDescription ||
 streamingState.habitTasks.length > 0
 );

 const cleanText = (text: string) => {
 return text
 .replace(/^Program Name:\s*/i, '')
 .replace(/^Program Description:\s*/i, '')
 .replace(/^Task Name:\s*/i, '')
 .replace(/^Task Description:\s*/i, '')
 .trim();
 };

 const handleCopyProgram = async () => {
 const tasksToUse = habitTasks || [];
 
 let copyText = `Program Name: ${programName}\n\n`;
 copyText += `Program Description: ${programDescription}\n\n`;
 
 if (tasksToUse.length > 0) {
 copyText += `Habit Tasks Framework:\n`;
 copyText += `${'─'.repeat(40)}\n\n`;
 
 tasksToUse.forEach((task, index) => {
 copyText += `${index + 1}. ${task.taskName}\n`;
 copyText += ` Description: ${task.taskDescription}\n`;
 copyText += ` Green: ${task.green}\n`;
 copyText += ` Blue: ${task.blue}\n`;
 copyText += ` Purple: ${task.purple}\n`;
 copyText += ` Grey: ${task.grey}\n\n`;
 });
 }

 try {
 await navigator.clipboard.writeText(copyText);
 setCopied(true);
 setTimeout(() => setCopied(false), 2000);
 } catch (err) {
 console.error('Failed to copy:', err);
 }
 };

 const canCopy = !loading && programName && programDescription;

 return (
 <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xl transition-all duration-300">
 <div className="mb-4">
 <div className="flex items-center justify-between">
 <div className="flex items-center gap-3 mb-1">
 <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
 <Sparkles className="h-5 w-5 text-primary"/>
 </div>
 <div>
 <h2 className="text-xl font-bold text-slate-900">Step 4: Generated Program</h2>
 <p className="text-xs text-slate-500 mt-0.5">
 {loading ? 'Personalized program is being drafted in real-time...' : 'Review the curated 10 workplace habit sets.'}
 </p>
 </div>
 </div>
 {canCopy && (
 <Button
 variant="outline"
 size="sm"
 onClick={handleCopyProgram}
 className="gap-2 border-slate-200 hover:bg-white text-slate-800"
 >
 {copied ? (
 <>
 <Check className="h-4 w-4 text-green-500"/>
 <span className="text-green-500 text-xs">Copied!</span>
 </>
 ) : (
 <>
 <Copy className="h-4 w-4 text-slate-500"/>
 <span className="text-xs">Copy Program</span>
 </>
 )}
 </Button>
 )}
 </div>
 </div>

 {showStreaming && hasContent ? (
 <ScrollArea className="h-[450px] mt-4">
 <div className="space-y-4">
 <div className="bg-white rounded-xl p-5 border border-slate-200">
 <div className="flex items-start gap-3">
 <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20">
 <Target className="h-5 w-5 text-primary"/>
 </div>
 <div className="flex-1 min-w-0">
 <div className="flex items-center gap-2">
 <h3 className="text-sm font-semibold text-slate-800">
 {cleanText(streamingState.programName) || (
 <span className="text-slate-500 italic">Formulating program name...</span>
 )}
 </h3>
 {streamingState.programName && !streamingState.programDescription && (
 <span className="inline-block w-2 h-4 bg-primary animate-pulse"/>
 )}
 </div>
 {(streamingState.programDescription || streamingState.programName) && (
 <p className="text-xs text-slate-500 mt-1 leading-relaxed">
 {cleanText(streamingState.programDescription)}
 {streamingState.programDescription && streamingState.habitTasks.length === 0 && (
 <span className="inline-block w-2 h-4 bg-primary animate-pulse ml-0.5"/>
 )}
 </p>
 )}
 </div>
 </div>
 </div>

 {streamingState.habitTasks.length > 0 && (
 <div className="bg-white rounded-xl p-5 border border-slate-200 space-y-4">
 <div className="flex items-center gap-2">
 <ListChecks className="h-4.5 w-4.5 text-primary"/>
 <h4 className="text-xs font-semibold text-slate-800">Habit Sets Generating</h4>
 <span className="text-[10px] text-slate-500 font-mono">
 ({streamingState.habitTasks.length} / 10 total)
 </span>
 </div>
 <div className="space-y-3">
 {streamingState.habitTasks.map((task, index) => {
 const hasTaskName = cleanText(task.taskName).length > 0;
 return (
 <div key={index} className="p-3.5 rounded-xl border border-slate-200 bg-blue-50">
 <div className="flex items-start gap-3">
 <span className="inline-flex items-center justify-center w-5 h-5 rounded bg-white text-primary text-[10px] font-bold shrink-0 border border-slate-200">
 {index + 1}
 </span>
 <div className="flex-1 min-w-0">
 <h5 className="font-semibold text-slate-800 text-xs">
 {hasTaskName ? cleanText(task.taskName) : <span className="text-slate-500 italic">Drafting habit set...</span>}
 </h5>
 {hasTaskName && task.taskDescription && (
 <p className="text-[11px] text-slate-500 mt-1">{cleanText(task.taskDescription)}</p>
 )}
 </div>
 </div>
 </div>
 );
 })}
 </div>
 </div>
 )}
 </div>
 </ScrollArea>
 ) : loading ? (
 <div className="flex flex-col items-center justify-center py-12 text-slate-500">
 <Loader2 className="h-8 w-8 text-primary animate-spin mb-4"/>
 <p className="text-sm">Assembling blueprint parameters...</p>
 </div>
 ) : (
 <div className="space-y-5 mt-4">
 <div className="bg-white rounded-xl p-5 border border-slate-200">
 <div className="flex items-start gap-3">
 <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20">
 <Target className="h-5 w-5 text-primary"/>
 </div>
 <div>
 <h3 className="text-sm font-bold text-slate-800">{programName}</h3>
 <p className="text-xs text-slate-500 mt-1 leading-relaxed">{programDescription}</p>
 </div>
 </div>
 </div>

 {habitTasks && habitTasks.length > 0 && (
 <div className="bg-white rounded-xl p-5 border border-slate-200 space-y-4">
 <div className="flex items-center gap-2">
 <ListChecks className="h-4.5 w-4.5 text-primary"/>
 <h4 className="text-xs font-semibold text-slate-800">10 Generated Workplace Habit Sets</h4>
 </div>
 
 <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
 {habitTasks.map((task, index) => (
 <div key={index} className="p-3.5 rounded-xl border border-slate-200 bg-blue-50 space-y-2">
 <div className="flex items-start gap-2.5">
 <span className="inline-flex items-center justify-center w-5 h-5 rounded bg-white text-primary text-[10px] font-bold shrink-0 border border-slate-200">
 {index + 1}
 </span>
 <div>
 <h5 className="font-semibold text-slate-800 text-xs">{task.taskName}</h5>
 <p className="text-[11px] text-slate-500 mt-0.5">{task.taskDescription}</p>
 </div>
 </div>
 
 <div className="grid grid-cols-4 gap-2 pt-2 border-t border-slate-200 text-[9px] text-slate-500">
 <div>
 <span className="block font-bold text-[8px] text-green-400 uppercase">Green (Beginner)</span>
 <p className="mt-0.5">{task.green}</p>
 </div>
 <div>
 <span className="block font-bold text-[8px] text-blue-400 uppercase">Blue (Intermediate)</span>
 <p className="mt-0.5">{task.blue}</p>
 </div>
 <div>
 <span className="block font-bold text-[8px] text-purple-400 uppercase">Purple (Advanced)</span>
 <p className="mt-0.5">{task.purple}</p>
 </div>
 <div>
 <span className="block font-bold text-[8px] text-slate-500 uppercase">Grey (Recovery)</span>
 <p className="mt-0.5">{task.grey}</p>
 </div>
 </div>
 </div>
 ))}
 </div>
 </div>
 )}
 </div>
 )}
 </section>
 );
}
