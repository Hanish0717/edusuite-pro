import { Clock, MapPin, User, BookOpen, AlertTriangle, CheckCircle2, ChevronRight } from "lucide-react";
import type { TimetableEntry, DayOfWeek, TimetableConflict } from "@/services/master-timetable-service";
import { Badge } from "@/components/ui/badge";

interface WeeklyGridMasterProps {
  entries: TimetableEntry[];
  conflicts?: TimetableConflict[];
  onSelectSlot?: (entry: TimetableEntry) => void;
  onEditSlot?: (entry: TimetableEntry) => void;
  readOnly?: boolean;
}

const DAYS: DayOfWeek[] = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const PERIODS = [
  { period: 1, time: "09:00 - 10:00" },
  { period: 2, time: "10:15 - 11:15" },
  { period: 3, time: "11:30 - 12:30" },
  { period: 4, time: "01:30 - 02:30" },
  { period: 5, time: "02:30 - 03:30" },
  { period: 6, time: "03:30 - 04:30" },
];

export function ConflictBadge({ conflicts }: { conflicts: TimetableConflict[] }) {
  if (conflicts.length === 0) return null;
  return (
    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-bold animate-pulse">
      <AlertTriangle className="size-3.5 shrink-0" />
      <span>{conflicts.length} Timetable Conflicts Detected</span>
    </div>
  );
}

export function PeriodCell({
  entry,
  hasConflict,
  onClick,
  readOnly = false,
}: {
  entry?: TimetableEntry;
  hasConflict?: boolean;
  onClick?: () => void;
  readOnly?: boolean;
}) {
  if (!entry) {
    return (
      <div className="min-h-[90px] p-2 rounded-xl border border-dashed border-border/40 bg-muted/10 flex flex-col justify-center items-center text-center">
        <span className="text-[10px] font-semibold text-muted-foreground/60">Free Period</span>
      </div>
    );
  }

  const isLab = entry.lectureType === "Lab" || entry.room.toLowerCase().includes("lab");

  return (
    <div
      onClick={onClick}
      className={`min-h-[90px] p-3 rounded-xl border transition-all duration-200 flex flex-col justify-between cursor-pointer ${
        hasConflict
          ? "border-rose-500/50 bg-rose-500/10 shadow-sm"
          : isLab
          ? "border-emerald-500/20 bg-emerald-500/8 hover:border-emerald-500/40 hover:shadow-md"
          : "border-blue-500/20 bg-blue-500/8 hover:border-blue-500/40 hover:shadow-md"
      }`}
    >
      <div className="space-y-1">
        <div className="flex items-start justify-between gap-1">
          <Badge
            variant="outline"
            className={`text-[9px] font-bold px-1.5 py-0 ${
              isLab
                ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/25"
                : "bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-500/25"
            }`}
          >
            {entry.subjectCode} · {entry.lectureType}
          </Badge>

          {entry.section && (
            <span className="text-[10px] font-extrabold text-foreground bg-background/80 px-1.5 py-0.5 rounded border border-border/40">
              {entry.section}
            </span>
          )}
        </div>

        <h5 className="font-extrabold text-xs text-foreground leading-snug line-clamp-2 mt-1">
          {entry.subjectName}
        </h5>

        <div className="text-[10px] text-muted-foreground space-y-0.5 font-medium">
          <p className="flex items-center gap-1">
            <User className="size-3 shrink-0" />
            <span className="truncate">{entry.facultyName}</span>
          </p>
          <p className="flex items-center gap-1">
            <MapPin className="size-3 shrink-0" />
            <span>{entry.room}</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export function WeeklyGrid({
  entries,
  conflicts = [],
  onSelectSlot,
  onEditSlot,
  readOnly = false,
}: WeeklyGridMasterProps) {
  // Map conflict ids for fast lookup
  const conflictedEntryIds = new Set(
    conflicts.flatMap((c) => c.entries.map((e) => e.id))
  );

  return (
    <div className="space-y-3">
      <ConflictBadge conflicts={conflicts} />

      {/* Desktop & Tablet Table View */}
      <div className="hidden md:block overflow-x-auto rounded-2xl border border-border/50 bg-card shadow-sm">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="bg-muted/40 border-b border-border/50">
              <th className="p-3 text-xs font-black text-muted-foreground uppercase tracking-wider w-24">
                Period / Time
              </th>
              {DAYS.map((day) => (
                <th key={day} className="p-3 text-xs font-black text-foreground uppercase tracking-wider">
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border/30">
            {PERIODS.map((p) => (
              <tr key={p.period} className="hover:bg-muted/10 transition-colors">
                <td className="p-3 text-xs font-bold text-muted-foreground bg-muted/20 align-top">
                  <div className="font-black text-foreground">Period {p.period}</div>
                  <div className="text-[10px] text-muted-foreground font-mono mt-0.5">{p.time}</div>
                </td>

                {DAYS.map((day) => {
                  const entry = entries.find(
                    (e) => e.day === day && e.period === p.period
                  );
                  const hasConflict = entry ? conflictedEntryIds.has(entry.id) : false;

                  return (
                    <td key={day} className="p-2 align-top w-1/6">
                      <PeriodCell
                        entry={entry}
                        hasConflict={hasConflict}
                        onClick={() => entry && onSelectSlot && onSelectSlot(entry)}
                        readOnly={readOnly}
                      />
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card Layout */}
      <div className="block md:hidden space-y-4">
        {DAYS.map((day) => {
          const dayEntries = entries.filter((e) => e.day === day).sort((a, b) => a.period - b.period);
          if (dayEntries.length === 0) return null;

          return (
            <div key={day} className="rounded-2xl border border-border/50 bg-card p-4 space-y-3">
              <h4 className="text-xs font-black text-foreground uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="size-3.5 text-primary" /> {day}
              </h4>
              <div className="space-y-2">
                {dayEntries.map((entry) => (
                  <PeriodCell
                    key={entry.id}
                    entry={entry}
                    hasConflict={conflictedEntryIds.has(entry.id)}
                    onClick={() => onSelectSlot && onSelectSlot(entry)}
                    readOnly={readOnly}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function FacultyWeeklyGrid(props: WeeklyGridMasterProps) {
  return <WeeklyGrid {...props} />;
}

export function SectionWeeklyGrid(props: WeeklyGridMasterProps) {
  return <WeeklyGrid {...props} />;
}

export function RoomWeeklyGrid(props: WeeklyGridMasterProps) {
  return <WeeklyGrid {...props} />;
}

export function LabWeeklyGrid(props: WeeklyGridMasterProps) {
  return <WeeklyGrid {...props} />;
}
