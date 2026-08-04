import { Panel } from "@/components/dashboard/panel";
import { Badge } from "@/components/ui/badge";

interface ProgramOutcomeSectionProps {
  outcomes: string[];
}

export function ProgramOutcomeSection({ outcomes }: ProgramOutcomeSectionProps) {
  return (
    <Panel
      title="Program Outcomes Mapping (PO & PSO)"
      description="Mapped outcomes indicating overall program alignment"
      className="border border-border bg-card rounded-2xl p-5 shadow-card text-xs"
    >
      <div className="flex flex-wrap gap-2 pt-1">
        {outcomes.map((po, idx) => (
          <Badge
            key={idx}
            variant="secondary"
            className="rounded-lg bg-indigo-500/5 text-indigo-600 border border-indigo-500/10 py-1.5 px-3 font-semibold text-[0.68rem]"
          >
            {po}
          </Badge>
        ))}
        {outcomes.length === 0 && (
          <span className="text-xs text-muted-foreground italic">No mappings declared.</span>
        )}
      </div>
    </Panel>
  );
}
