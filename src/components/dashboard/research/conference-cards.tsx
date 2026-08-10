import { Calendar, MapPin, UserCheck, CheckCircle2, Bookmark } from "lucide-react";
import type { ConferenceEventItem } from "./types";
import { Badge } from "@/components/ui/badge";

interface ConferenceCardsProps {
  conferences: ConferenceEventItem[];
}

export function ConferenceCards({ conferences }: ConferenceCardsProps) {
  const getRoleBadgeClass = (role: string) => {
    switch (role) {
      case "Presenter":
        return "bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 border-indigo-500/20";
      case "Keynote Speaker":
        return "bg-purple-500/15 text-purple-700 dark:text-purple-300 border-purple-500/20";
      case "Session Chair":
        return "bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-500/20";
      default:
        return "bg-slate-500/15 text-slate-700 dark:text-slate-300 border-slate-500/20";
    }
  };

  const getCertBadgeClass = (status: string) => {
    return status === "Received"
      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/25"
      : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/25";
  };

  if (conferences.length === 0) {
    return (
      <div className="rounded-2xl border border-border/40 bg-card p-6 text-center text-muted-foreground text-sm">
        No conferences or workshop items recorded.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {conferences.map((conf) => (
        <div
          key={conf.id}
          className="flex flex-col justify-between p-5 rounded-2xl border border-border/50 bg-card hover:shadow-md transition-all duration-200"
        >
          <div className="space-y-3">
            {/* Header tags */}
            <div className="flex items-start justify-between gap-3">
              <Badge variant="outline" className={getRoleBadgeClass(conf.role)}>
                {conf.role}
              </Badge>
              <Badge variant="outline" className={getCertBadgeClass(conf.certificateStatus)}>
                Certificate: {conf.certificateStatus}
              </Badge>
            </div>

            {/* Event Name */}
            <div>
              <h4 className="font-bold text-sm text-foreground leading-snug line-clamp-2">
                {conf.eventName}
              </h4>
              <p className="text-xs text-muted-foreground mt-1.5 font-medium">
                Organizer: {conf.organizer}
              </p>
            </div>

            {/* Details panel */}
            <div className="grid grid-cols-2 gap-2 pt-3 border-t border-border/30 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Calendar className="size-3.5 text-muted-foreground/75" />
                <span>Date: <strong className="text-foreground">{conf.date}</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="size-3.5 text-muted-foreground/75" />
                <span className="truncate">Venue: <strong className="text-foreground">{conf.location}</strong></span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
