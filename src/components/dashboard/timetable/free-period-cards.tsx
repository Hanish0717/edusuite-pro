import { CalendarClock, Sparkles } from "lucide-react";
import { Panel } from "@/components/dashboard/panel";
import type { FreePeriod } from "@/data/faculty-mock-data";

interface FreePeriodCardsProps {
  freePeriods: FreePeriod[];
}

export function FreePeriodCards({ freePeriods }: FreePeriodCardsProps) {
  return (
    <Panel
      title="Free Periods & Slots"
      description="Available open slots for organizing meetings or research"
      className="border border-border bg-card rounded-2xl p-5 shadow-card"
    >
      <div className="space-y-3.5 text-xs">
        <div className="grid grid-cols-2 gap-2.5">
          {freePeriods.map((slot, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2 p-2.5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-emerald-700 dark:text-emerald-400"
            >
              <CalendarClock className="size-4 shrink-0 text-emerald-500" />
              <div className="min-w-0">
                <p className="font-extrabold text-[0.68rem]">{slot.day}</p>
                <p className="text-[0.58rem] opacity-80 font-mono mt-0.5">{slot.timeSlot}</p>
              </div>
            </div>
          ))}
          {freePeriods.length === 0 && (
            <p className="text-xs text-muted-foreground italic text-center py-4 col-span-full">No free slots recorded.</p>
          )}
        </div>
        
        <div className="flex items-center gap-1.5 p-2 rounded-xl bg-muted/40 text-[0.62rem] text-muted-foreground font-medium mt-1 leading-normal">
          <Sparkles className="size-3.5 text-emerald-500 shrink-0" />
          <span>These slots represent your open periods where no classes or duties are scheduled.</span>
        </div>
      </div>
    </Panel>
  );
}
