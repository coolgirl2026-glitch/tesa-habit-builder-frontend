import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { CheckSquare, Save } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { HabitTask } from '@/types/tesa';

interface HabitSelectionSectionProps {
 habits: HabitTask[];
 onSave: (habits: HabitTask[]) => void;
 disabled?: boolean;
}

type ProgressionTab = 'green' | 'blue' | 'purple' | 'grey';

export function HabitSelectionSection({ habits, onSave, disabled }: HabitSelectionSectionProps) {
 const [selected, setSelected] = useState<HabitTask[]>([]);
 // Store the active tab index/state for each of the 10 habit sets
 const [activeTabs, setActiveTabs] = useState<Record<number, ProgressionTab>>(
 Object.fromEntries(habits.map((_, i) => [i, 'green']))
 );

 const toggleHabit = (habit: HabitTask) => {
 const isSelected = selected.some(h => h.taskName === habit.taskName);
 if (isSelected) {
 setSelected(selected.filter(h => h.taskName !== habit.taskName));
 } else if (selected.length < 5) {
 setSelected([...selected, habit]);
 }
 };

 const setTab = (taskIndex: number, tab: ProgressionTab) => {
 setActiveTabs(prev => ({ ...prev, [taskIndex]: tab }));
 };

 const isValid = selected.length === 5;
 const progressPercent = (selected.length / 5) * 100;

 return (
 <section
 className={cn(
"bg-white border border-slate-200 rounded-2xl p-6 shadow-2xl transition-all duration-300",
 disabled ?"opacity-60 pointer-events-none":"animate-fade-in-up"
 )}
 >
 <div className="mb-4">
 <div className="flex items-center gap-3 mb-1">
 <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
 <CheckSquare className="h-5 w-5 text-primary"/>
 </div>
 <div>
 <h2 className="text-xl font-bold text-slate-900">Step 5: Select 5 Habit Sets</h2>
 <p className="text-xs text-slate-500 mt-0.5">
 Select exactly 5 core workplace behaviors to build your learning program.
 </p>
 </div>
 </div>
 </div>

 {/* Progress Bar */}
 <div className="mb-5 px-1 bg-white p-4 rounded-xl border border-slate-200">
 <div className="flex items-center justify-between mb-2">
 <span className="text-xs font-semibold text-slate-800">
 Selected Habit Sets: {selected.length} / 5
 </span>
 {selected.length < 5 && (
 <span className="text-[11px] text-primary font-medium">
 Choose {5 - selected.length} more sets to complete program
 </span>
 )}
 </div>
 <div className="h-2 bg-white rounded-full overflow-hidden">
 <div
 className={cn(
"h-full transition-all duration-300 rounded-full bg-primary"
 )}
 style={{ width: `${progressPercent}%` }}
 />
 </div>
 </div>

 <div className="space-y-4 max-h-[450px] overflow-y-auto pr-1">
 {habits.map((habit, index) => {
 const isChecked = selected.some(h => h.taskName === habit.taskName);
 const isDisabled = !isChecked && selected.length >= 5;
 const currentTab = activeTabs[index] || 'green';

 return (
 <div
 key={`${habit.taskName}-${index}`}
 className={cn(
"w-full text-left p-4 rounded-xl border transition-all duration-200 flex flex-col gap-3 group",
"hover:shadow-lg",
 isChecked
 ?"border-primary bg-primary/10 shadow-md shadow-primary/5"
 :"border-slate-200 bg-white hover:bg-blue-50/70",
 isDisabled &&"opacity-40"
 )}
 >
 <div className="flex items-start gap-3 w-full cursor-pointer"onClick={() => !isDisabled && toggleHabit(habit)}>
 <div className={cn(
"mt-1 transition-transform duration-200 shrink-0",
 isChecked &&"scale-110"
 )}>
 <Checkbox
 checked={isChecked}
 className="pointer-events-none border-blue-200 data-[state=checked]:bg-primary"
 />
 </div>
 <div className="flex-1">
 <div className="flex items-center gap-2 mb-1">
 <span className="inline-flex items-center justify-center w-5 h-5 rounded bg-white border border-slate-200 text-primary text-[10px] font-bold shrink-0">
 {index + 1}
 </span>
 <h4 className="font-semibold text-sm text-slate-800">{habit.taskName}</h4>
 </div>
 <p className="text-xs text-slate-500 leading-relaxed ml-7">{habit.taskDescription}</p>
 </div>
 </div>

 {/* Tab Selector & Content for Progression Framework */}
 <div className="ml-7 pt-3 border-t border-slate-200 space-y-2.5">
 <div className="flex gap-1 bg-blue-50 p-0.5 rounded-lg border border-slate-200 w-fit">
 {(['green', 'blue', 'purple', 'grey'] as ProgressionTab[]).map(tab => (
 <button
 key={tab}
 onClick={() => setTab(index, tab)}
 className={cn(
"px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider rounded-md transition-all",
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

 <div className="flex justify-end mt-6">
 <Button
 onClick={() => onSave(selected)}
 disabled={!isValid}
 className="gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl shadow-lg shadow-blue-500/20 transition-all hover:scale-[1.02]"
 >
 <Save className="h-4 w-4"/>
 Save Program
 </Button>
 </div>
 </section>
 );
}
