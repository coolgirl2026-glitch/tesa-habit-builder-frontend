import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Target, Sparkles, Loader2 } from 'lucide-react';
import type { OutcomeChip } from '@/hooks/useTesa';
import { cn } from '@/lib/utils';

interface OutcomeSectionProps {
 competency: string;
 onComplete: (outcome: string) => void;
 disabled?: boolean;
 outcomeChips?: OutcomeChip[];
 loadingChips?: boolean;
}

// Static fallback suggestions
const FALLBACK_CHIPS: OutcomeChip[] = [
 {
 chipText:"Team completes tasks without reminders",
 outcomeStatement:"Team members complete tasks without reminders or follow-ups"
 },
 {
 chipText:"Daily progress tracking becomes automatic",
 outcomeStatement:"Consistent daily progress tracking becomes automatic behavior"
 },
 {
 chipText:"Proactive communication replaces reactive",
 outcomeStatement:"Proactive communication replaces reactive escalation patterns"
 },
 {
 chipText:"Self-accountability visible in actions",
 outcomeStatement:"Self-accountability and ownership visible in daily actions"
 },
];

export function OutcomeSection({ competency, onComplete, disabled, outcomeChips = [], loadingChips = false }: OutcomeSectionProps) {
 const [outcome, setOutcome] = useState('');

 // Use API chips if available, otherwise fallback
 const chips = outcomeChips.length > 0 ? outcomeChips.slice(0, 4) : FALLBACK_CHIPS;

 const handleSuggestionClick = (chip: OutcomeChip) => {
 setOutcome(chip.outcomeStatement);
 };

 const isValid = outcome.trim() !== '';

 const handleSubmit = () => {
 if (isValid) {
 onComplete(outcome);
 }
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
 <Target className="h-5 w-5 text-primary"/>
 </div>
 <div>
 <h2 className="text-xl font-bold text-slate-900">Step 3: Expected Outcome</h2>
 <p className="text-xs text-slate-500 mt-0.5">
 Describe the visible change you want after building this habit.
 </p>
 </div>
 </div>
 <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-primary text-xs font-semibold">
 <span>Target Competency:</span> <span className="text-slate-800">{competency}</span>
 </div>
 </div>

 <div className="space-y-5">
 <div>
 <label className="block text-sm font-semibold text-slate-700 mb-2">
 What visible change should be seen after this habit program?
 </label>
 <Textarea
 placeholder="Describe the outcome or select one of the suggestions below..."
 value={outcome}
 onChange={(e) => setOutcome(e.target.value)}
 className="min-h-[100px] resize-none bg-white border-slate-200 text-slate-900 placeholder:text-slate-500 focus-visible:ring-primary focus-visible:border-primary rounded-xl"
 />
 </div>

 {/* Suggestion Chips - Below textarea */}
 {!outcome && (
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
 onClick={handleSubmit}
 disabled={!isValid}
 className="gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl shadow-lg shadow-blue-500/20 transition-all hover:scale-[1.02]"
 >
 <Sparkles className="h-4 w-4"/>
 Generate Habit Program
 </Button>
 </div>
 </section>
 );
}
