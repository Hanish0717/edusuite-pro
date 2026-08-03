import { History, Calendar, User } from "lucide-react";
import { Panel } from "@/components/dashboard/panel";
import type { VersionItem } from "@/data/faculty-mock-data";

interface VersionHistoryProps {
  versions: VersionItem[];
}

export function VersionHistory({ versions }: VersionHistoryProps) {
  return (
    <Panel
      title="Revision History logs"
      description="List of updated document models, version controls and edits description summaries"
      className="border border-border bg-card rounded-2xl p-5 shadow-card text-xs"
    >
      <div className="space-y-3.5">
        {versions.map((ver, idx) => (
          <div
            key={idx}
            className="flex items-start justify-between p-3 rounded-2xl border bg-muted/20 hover:bg-muted/30 transition-colors gap-3"
          >
            <div className="space-y-1 min-w-0 flex-1">
              <div className="flex items-center gap-2 text-[0.62rem] text-muted-foreground font-semibold">
                <span className="flex items-center gap-0.5"><User className="size-3 text-primary/60" /> {ver.updatedBy}</span>
                <span>&middot;</span>
                <span className="flex items-center gap-0.5"><Calendar className="size-3 text-primary/60" /> {ver.updatedDate}</span>
              </div>
              <p className="font-extrabold text-[0.72rem] text-foreground leading-snug">{ver.changeSummary}</p>
            </div>
            <span className="grid shrink-0 place-items-center bg-primary/5 text-primary border border-primary/10 py-0.5 px-2 rounded-lg font-mono text-[0.6rem] font-bold">
              {ver.versionNum}
            </span>
          </div>
        ))}
      </div>
    </Panel>
  );
}
