import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import {
 Zap,
 ArrowRight,
 Check,
 Loader2,
 Target,
 Info
} from 'lucide-react';
import {
 Tooltip,
 TooltipContent,
 TooltipProvider,
 TooltipTrigger,
} from '@/components/ui/tooltip';

interface CompetencySelectionSectionProps {
 competencies: string[];
 loading?: boolean;
 onComplete: (competency: string) => void;
 disabled?: boolean;
}

export function CompetencySelectionSection({
 competencies,
 loading,
 onComplete,
 disabled
}: CompetencySelectionSectionProps) {
 const [selected, setSelected] = useState<string | null>(null);
 const [customInput, setCustomInput] = useState('');

 const handleContinue = () => {
 if (selected) {
 onComplete(selected);
 }
 };

 const handleCardClick = (competencyName: string) => {
 setSelected(competencyName);
 setCustomInput(''); // clear custom input when card selected
 };

 const handleInputChange = (val: string) => {
 setCustomInput(val);
 setSelected(val.trim() !== '' ? val.trim() : null);
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
 <Zap className="h-5 w-5 text-primary"/>
 </div>
 <div className="flex-1">
 <div className="flex items-center gap-2">
 <h2 className="text-xl font-bold text-slate-900">Step 2: Select Competency</h2>
 <TooltipProvider delayDuration={0}>
 <Tooltip>
 <TooltipTrigger asChild>
 <button className="w-4 h-4 rounded-full bg-white hover:bg-primary/20 flex items-center justify-center transition-colors">
 <Info className="h-3 w-3 text-slate-500 hover:text-primary"/>
 </button>
 </TooltipTrigger>
 <TooltipContent side="right"className="max-w-xs bg-white border-slate-200 text-slate-800">
 <p className="font-semibold mb-1">How these competencies are identified</p>
 <p className="text-xs text-slate-500">These are derived by analyzing the role, the problem described, and how similar roles are evaluated in this industry.</p>
 </TooltipContent>
 </Tooltip>
 </TooltipProvider>
 </div>
 <p className="text-xs text-slate-500 mt-0.5">
 Choose one capability that best addresses the problem.
 </p>
 </div>
 </div>
 </div>

 {loading ? (
 <div className="flex flex-col items-center justify-center py-12 text-slate-500">
 <Loader2 className="h-8 w-8 text-primary animate-spin mb-4"/>
 <p className="text-sm">Analyzing problem and generating competencies...</p>
 </div>
 ) : (
 <>
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
 {competencies.map((competencyName, index) => {
 const isSelected = selected === competencyName;

 return (
 <button
 key={`${competencyName}-${index}`}
 onClick={() => handleCardClick(competencyName)}
 className={cn(
"text-left p-4 rounded-xl border transition-all duration-200 group relative",
"hover:shadow-lg",
 isSelected
 ?"border-primary bg-primary/10 shadow-md shadow-primary/5"
 :"border-slate-200 bg-white hover:bg-blue-50/70"
 )}
 >
 {isSelected && (
 <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-primary flex items-center justify-center animate-scale-in">
 <Check className="h-3 w-3 text-white"/>
 </div>
 )}
 <div className="flex items-center gap-3">
 <div className={cn(
"w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-colors",
 isSelected ?"bg-primary/20":"bg-white group-hover:bg-primary/10"
 )}>
 <Target className={cn(
"h-4.5 w-4.5 transition-colors",
 isSelected ?"text-primary":"text-slate-500 group-hover:text-primary"
 )} />
 </div>
 <div className="min-w-0 flex-1">
 <h3 className="font-semibold text-sm text-slate-800 truncate">{competencyName}</h3>
 </div>
 </div>
 </button>
 );
 })}
 </div>

 {/* Custom Competency Input */}
 <div className="mt-5 pt-4 border-t border-slate-200 space-y-2">
 <label className="block text-xs font-semibold text-slate-700">
 Or Enter Custom Competency
 </label>
 <Input
 placeholder="e.g. Technical Leadership, Cross-team Collaboration..."
 value={customInput}
 onChange={(e) => handleInputChange(e.target.value)}
 className="bg-white border-slate-200 text-slate-900 placeholder:text-slate-500 focus-visible:ring-primary focus-visible:border-primary rounded-xl"
 />
 </div>

 <div className="flex justify-end mt-6">
 <Button
 onClick={handleContinue}
 disabled={!selected}
 className="gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl shadow-lg shadow-blue-500/20 transition-all hover:scale-[1.02]"
 >
 Continue
 <ArrowRight className="h-4 w-4"/>
 </Button>
 </div>
 </>
 )}
 </section>
 );
}
