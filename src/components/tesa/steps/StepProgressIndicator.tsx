import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

type FlowStep = 'problem' | 'competency' | 'outcome' | 'program' | 'habits' | 'saved';

interface StepProgressIndicatorProps {
  currentStep: FlowStep;
  completedSteps: FlowStep[];
}

const STEPS: { key: FlowStep; label: string }[] = [
  { key: 'problem', label: 'Problem' },
  { key: 'competency', label: 'Competency' },
  { key: 'outcome', label: 'Outcome' },
  { key: 'program', label: 'Program' },
  { key: 'habits', label: 'Habits' },
];

export function StepProgressIndicator({ currentStep, completedSteps }: StepProgressIndicatorProps) {
  const currentIndex = STEPS.findIndex(s => s.key === currentStep);

  return (
    <div className="flex items-center justify-center gap-1 mb-8 bg-white border border-slate-200 p-4 rounded-2xl card-drafted">
      {STEPS.map((step, index) => {
        const isCompleted = completedSteps.includes(step.key);
        const isCurrent = step.key === currentStep;
        const isPast = index < currentIndex;

        return (
          <div key={step.key} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "w-9 h-9 rounded-lg flex items-center justify-center text-xs font-mono-label font-semibold transition-all duration-300 border-2",
                  isCompleted
                    ? "bg-primary border-primary text-white shadow-md shadow-primary/25"
                    : isCurrent
                    ? "bg-white border-primary text-primary"
                    : "bg-blue-50/60 border-slate-200 text-slate-400"
                )}
              >
                {isCompleted ? (
                  <Check className="h-4.5 w-4.5" />
                ) : (
                  String(index + 1).padStart(2, '0')
                )}
              </div>
              <span
                className={cn(
                  "text-[10px] mt-2 font-semibold uppercase tracking-wider transition-colors",
                  isCurrent ? "text-primary" : isCompleted ? "text-slate-700" : "text-slate-400"
                )}
              >
                {step.label}
              </span>
            </div>
            {index < STEPS.length - 1 && (
              <div
                className={cn(
                  "w-12 h-[2px] mx-2 transition-all duration-300 rounded-full",
                  isPast || isCompleted ? "bg-primary" : "bg-slate-200"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
