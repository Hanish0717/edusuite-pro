import { Sparkles, AlertTriangle } from "lucide-react";
import { Panel } from "@/components/dashboard/panel";
import { Progress } from "@/components/ui/progress";
import type { ProfileCompletionInfo } from "@/data/faculty-mock-data";

interface ProfileCompletionProps {
  completion: ProfileCompletionInfo;
}

export function ProfileCompletion({ completion }: ProfileCompletionProps) {
  return (
    <Panel
      title="Profile Integrity Progress"
      description="ERP documentation verification score"
      action={
        <span className="flex items-center gap-1 text-[0.65rem] font-bold text-amber-500 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">
          <AlertTriangle className="size-3 shrink-0" /> Pending Action
        </span>
      }
      className="border border-border bg-card rounded-2xl p-5 shadow-card"
    >
      <div className="space-y-4 text-xs">
        {/* Progress Score */}
        <div className="flex items-center justify-between font-bold">
          <span className="text-muted-foreground">Document Integrity</span>
          <span className="text-primary font-black text-sm">{completion.percentage}% Complete</span>
        </div>
        
        <Progress value={completion.percentage} className="h-2 bg-primary/10 [&>div]:bg-brand-gradient" />

        {/* Missing Fields Bulletins */}
        <div className="space-y-2 pt-2">
          <p className="font-extrabold text-muted-foreground uppercase tracking-wider text-[0.6rem]">
            Outstanding documentation requirements:
          </p>
          <div className="space-y-1.5">
            {completion.missingFields.map((field, idx) => (
              <div key={idx} className="flex items-start gap-2 p-2 rounded-xl bg-amber-500/5 border border-amber-500/10 text-amber-700 dark:text-amber-500">
                <Sparkles className="size-3.5 shrink-0 mt-0.5" />
                <span className="font-medium text-[0.7rem] leading-normal">{field}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Panel>
  );
}
