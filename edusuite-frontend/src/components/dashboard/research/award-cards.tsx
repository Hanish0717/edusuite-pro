import { Trophy, Calendar, Award } from "lucide-react";
import type { AwardItem } from "./types";

interface AwardCardsProps {
  awards: AwardItem[];
}

export function AwardCards({ awards }: AwardCardsProps) {
  if (awards.length === 0) {
    return (
      <div className="rounded-2xl border border-border/40 bg-card p-6 text-center text-muted-foreground text-sm">
        No awards or achievements recorded.
      </div>
    );
  }

  return (
    <div className="relative pl-6 border-l-2 border-border/40 ml-3 space-y-6">
      {awards.map((aw) => (
        <div key={aw.id} className="relative group">
          {/* Bullet timeline icon */}
          <div className="absolute -left-[35px] top-1.5 size-7 rounded-full bg-amber-500/10 border-2 border-amber-500 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Trophy className="size-3.5 text-amber-600 dark:text-amber-400" />
          </div>

          {/* Card body */}
          <div className="flex flex-col gap-2 p-5 rounded-2xl border border-border/50 bg-card hover:shadow-md transition-all duration-200">
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div>
                <h4 className="font-bold text-sm text-foreground leading-snug">{aw.name}</h4>
                <p className="text-xs text-muted-foreground font-semibold mt-0.5">{aw.organization}</p>
              </div>
              <span className="text-[11px] font-bold text-muted-foreground flex items-center gap-1 bg-muted px-2.5 py-1 rounded-lg">
                <Calendar className="size-3.5" /> {aw.date}
              </span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed mt-1">
              {aw.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
