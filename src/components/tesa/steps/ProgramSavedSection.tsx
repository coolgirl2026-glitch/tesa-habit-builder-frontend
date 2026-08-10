import { CheckCircle2, Sparkles, PartyPopper, Download, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { HabitTask } from '@/types/tesa';

interface ProgramSavedSectionProps {
  programName: string;
  habitCount: number;
  onStartNew: () => void;
  selectedHabits?: HabitTask[];
  problemStatement?: string;
  competency?: string;
  outcome?: string;
}

export function ProgramSavedSection({
  programName,
  habitCount,
  onStartNew,
  selectedHabits = [],
  problemStatement = '',
  competency = '',
  outcome = '',
}: ProgramSavedSectionProps) {

  const handleExportText = () => {
    let content = `==================================================\n`;
    content += `TESA HABIT PROGRAM: ${programName}\n`;
    content += `==================================================\n\n`;
    content += `Target Competency: ${competency}\n`;
    content += `Problem Statement: ${problemStatement}\n`;
    content += `Expected Outcome: ${outcome}\n\n`;
    content += `--------------------------------------------------\n`;
    content += `SELECTED HABITS (${selectedHabits.length} sets)\n`;
    content += `--------------------------------------------------\n\n`;

    selectedHabits.forEach((habit, idx) => {
      content += `${idx + 1}. ${habit.taskName}\n`;
      content += `   Description: ${habit.taskDescription}\n`;
      content += `   🟢 Green (Beginner): ${habit.green}\n`;
      content += `   🔵 Blue (Intermediate): ${habit.blue}\n`;
      content += `   🟣 Purple (Advanced): ${habit.purple}\n`;
      content += `   ⚫ Grey (Recovery): ${habit.grey}\n\n`;
    });

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${programName.replace(/\s+/g, '_')}_habits.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleExportPDF = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const habitsHTML = selectedHabits.map((habit, idx) => `
      <div class="habit-card">
        <div class="habit-header">
          <span class="habit-number">${idx + 1}</span>
          <span class="habit-title">${habit.taskName}</span>
        </div>
        <p class="habit-desc">${habit.taskDescription}</p>
        <div class="progression-grid">
          <div class="progression-col green">
            <strong>GREEN (BEGINNER)</strong>
            <p>${habit.green}</p>
          </div>
          <div class="progression-col blue">
            <strong>BLUE (INTERMEDIATE)</strong>
            <p>${habit.blue}</p>
          </div>
          <div class="progression-col purple">
            <strong>PURPLE (ADVANCED)</strong>
            <p>${habit.purple}</p>
          </div>
          <div class="progression-col grey">
            <strong>GREY (RECOVERY)</strong>
            <p>${habit.grey}</p>
          </div>
        </div>
      </div>
    `).join('');

    const htmlContent = `
      <html>
      <head>
        <title>TESA - ${programName}</title>
        <style>
          body {
            font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            color: #1e293b;
            padding: 40px;
            margin: 0;
            line-height: 1.5;
          }
          h1 {
            color: #0f172a;
            font-size: 24px;
            margin-bottom: 8px;
            border-bottom: 2px solid #3b82f6;
            padding-bottom: 12px;
          }
          .meta-section {
            background-color: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            padding: 20px;
            margin-bottom: 30px;
          }
          .meta-item {
            margin-bottom: 12px;
          }
          .meta-item strong {
            font-size: 11px;
            color: #64748b;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            display: block;
          }
          .meta-item p {
            margin: 4px 0 0 0;
            font-size: 14px;
            color: #334155;
          }
          .habit-card {
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            padding: 20px;
            margin-bottom: 20px;
            page-break-inside: avoid;
          }
          .habit-header {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 8px;
          }
          .habit-number {
            background-color: #eff6ff;
            color: #3b82f6;
            font-weight: bold;
            font-size: 14px;
            width: 28px;
            height: 28px;
            border-radius: 6px;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 1px solid #bfdbfe;
          }
          .habit-title {
            font-weight: bold;
            font-size: 16px;
            color: #0f172a;
          }
          .habit-desc {
            font-size: 13px;
            color: #64748b;
            margin: 0 0 16px 0;
            padding-left: 38px;
          }
          .progression-grid {
            display: grid;
            grid-template-cols: repeat(4, 1fr);
            gap: 12px;
            border-t: 1px solid #f1f5f9;
            padding-top: 16px;
            margin-left: 38px;
          }
          .progression-col {
            font-size: 11px;
          }
          .progression-col strong {
            display: block;
            margin-bottom: 4px;
            font-size: 10px;
            letter-spacing: 0.05em;
          }
          .progression-col p {
            margin: 0;
            color: #475569;
          }
          .green strong { color: #16a34a; }
          .blue strong { color: #2563eb; }
          .purple strong { color: #7c3aed; }
          .grey strong { color: #64748b; }
          @media print {
            body { padding: 20px; }
            h1 { font-size: 20px; }
          }
        </style>
      </head>
      <body>
        <h1>TESA Habit Builder Program</h1>
        <div class="meta-section">
          <div class="meta-item">
            <strong>Program Name</strong>
            <p>${programName}</p>
          </div>
          <div class="meta-item">
            <strong>Target Competency</strong>
            <p>${competency}</p>
          </div>
          <div class="meta-item">
            <strong>Problem Statement</strong>
            <p>${problemStatement}</p>
          </div>
          <div class="meta-item">
            <strong>Expected Outcome</strong>
            <p>${outcome}</p>
          </div>
        </div>
        
        <h2 style="font-size: 16px; text-transform: uppercase; color: #475569; letter-spacing: 0.05em; margin-bottom: 16px;">Daily Action Sets</h2>
        ${habitsHTML}
        
        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
            }, 300);
          }
        </script>
      </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  return (
    <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xl transition-all duration-300">
      {/* Celebration background pattern */}
      <div className="relative overflow-hidden rounded-xl bg-white border border-slate-200 p-8">
        {/* Decorative elements */}
        <div className="absolute top-4 left-8 opacity-20 animate-pulse">
          <Sparkles className="h-6 w-6 text-primary" />
        </div>
        <div className="absolute top-8 right-12 opacity-20">
          <PartyPopper className="h-5 w-5 text-primary" />
        </div>
        <div className="absolute bottom-6 left-16 opacity-15">
          <Sparkles className="h-4 w-4 text-primary" />
        </div>
        <div className="absolute bottom-10 right-8 opacity-15">
          <Sparkles className="h-5 w-5 text-primary" />
        </div>

        <div className="text-center relative z-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary to-blue-600 mb-6 shadow-lg shadow-primary/20">
            <CheckCircle2 className="h-10 w-10 text-white" />
          </div>

          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            Program Saved! 🎉
          </h2>
          <p className="text-sm text-slate-500 mb-1">
            Great work! Your habit program is ready.
          </p>
          <p className="text-lg font-bold text-slate-800 mb-1">
            {programName}
          </p>
          <p className="text-xs text-slate-500">
            {habitCount} habits included
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center items-center">
            <Button
              onClick={handleExportPDF}
              className="gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl shadow-lg shadow-blue-500/20 w-full sm:w-auto"
            >
              <Download className="h-4 w-4" />
              Export to PDF
            </Button>

            <Button
              onClick={handleExportText}
              variant="outline"
              className="gap-2 border-slate-200 hover:bg-slate-50 text-slate-800 rounded-xl w-full sm:w-auto"
            >
              <FileText className="h-4 w-4 text-primary" />
              Export to Text
            </Button>

            <Button
              onClick={onStartNew}
              variant="ghost"
              className="gap-2 hover:bg-slate-50 text-slate-500 rounded-xl w-full sm:w-auto"
            >
              <Sparkles className="h-4 w-4 text-primary" />
              Create Another
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
