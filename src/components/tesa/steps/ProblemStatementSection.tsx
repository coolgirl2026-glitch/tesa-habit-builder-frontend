import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Lightbulb, Sparkles, Loader2 } from 'lucide-react';
import type { ProblemChip } from '@/hooks/useTesa';
import { cn } from '@/lib/utils';

interface ProblemStatementSectionProps {
 onComplete: (problemStatement: string) => void;
 disabled?: boolean;
 problemChips?: ProblemChip[];
 loadingChips?: boolean;
}

// Static fallback suggestions
const FALLBACK_CHIPS: ProblemChip[] = [
 {
 chipText:"They know what to do but lack consistency",
 problemStatement:"They know what to do but lack the consistency, rhythm and discipline"
 },
 {
 chipText:"Follow-ups happen only after escalation",
 problemStatement:"Follow-ups happen only after escalation, not proactively"
 },
 {
 chipText:"Daily targets tracked mentally",
 problemStatement:"Daily targets are tracked mentally instead of documented"
 },
 {
 chipText:"Tasks not completed on time",
 problemStatement:"Tasks started but not completed on time without reminders"
 },
];

export function ProblemStatementSection({ onComplete, disabled, problemChips = [], loadingChips = false }: ProblemStatementSectionProps) {
 const [problemStatement, setProblemStatement] = useState('');

 const isValid = problemStatement.trim().length > 0;

 // Use API chips if available, otherwise fallback
 const chips = problemChips.length > 0 ? problemChips.slice(0, 4) : FALLBACK_CHIPS;

 const handleContinue = () => {
 if (isValid) {
 onComplete(problemStatement.trim());
 }
 };

 const handleSuggestionClick = (chip: ProblemChip) => {
 setProblemStatement(chip.problemStatement);
 };

 return (
 <section
 className={cn(
"bg-white border border-slate-200 rounded-2xl p-6 shadow-2xl transition-all duration-300",
 disabled ?"opacity-60 pointer-events-none":"animate-fade-in-up"
 )}
 >
 <div className="mb-6">
 <div className="flex items-center gap-3 mb-1">
 <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
 <Lightbulb className="h-5 w-5 text-primary"/>
 </div>
 <div>
 <h2 className="text-xl font-bold text-slate-900">Step 1: Problem Statement</h2>
 <p className="text-xs text-slate-500 mt-0.5">
 Describe the observable behavior that needs to change for this role.
 </p>
 </div>
 </div>
 </div>

 <div className="space-y-5">
 <div>
 <label className="block text-sm font-semibold text-slate-700 mb-2">
 What behavior needs to change?
 </label>
 <Textarea
 placeholder="Describe the problem or select one of the suggestions below..."
 value={problemStatement}
 onChange={(e) => setProblemStatement(e.target.value)}
 className="min-h-[120px] resize-none bg-white border-slate-200 text-slate-900 placeholder:text-slate-500 focus-visible:ring-primary focus-visible:border-primary rounded-xl"
 />
 </div>

 {/* Suggestion Chips - Below textarea */}
 {!problemStatement && (
 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
 {loadingChips ? (
 <div className="col-span-full flex items-center justify-center py-6 text-slate-500">
 <Loader2 className="h-5 w-5 animate-spin mr-2"/>
 <span className="text-sm">Loading suggestions...</span>
 </div>
 ) : (
 chips.map((chip, index) => (
 <button
 key={index}
 onClick={() => handleSuggestionClick(chip)}
 className="text-left text-xs px-4 py-4 rounded-xl border border-slate-200 bg-white hover:bg-blue-50/70 hover:border-primary/40 transition-all duration-200 text-slate-500 hover:text-slate-900 min-h-[90px] flex items-start leading-relaxed"
 >
 <span className="line-clamp-4">{chip.chipText}</span>
 </button>
 ))
 )}
 </div>
 )}
 </div>

 <div className="flex justify-end mt-6">
 <Button
 onClick={handleContinue}
 disabled={!isValid}
 className="gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl shadow-lg shadow-blue-500/20 transition-all hover:scale-[1.02]"
 >
 <Sparkles className="h-4 w-4"/>
 Identify Relevant Competencies
 </Button>
 </div>
 </section>
 );
}
