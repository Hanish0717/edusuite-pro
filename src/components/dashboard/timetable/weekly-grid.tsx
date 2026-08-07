import { Clock, MapPin, Building2, Coffee, BookOpen, FlaskConical, MessageSquare, FolderGit2, Users, CalendarClock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Panel } from "@/components/dashboard/panel";
import type { WeeklySlot, WeeklySlotType } from "@/data/faculty-mock-data";
import { TIME_SLOTS, LUNCH_SLOT } from "@/data/faculty-mock-data";
import { cn } from "@/lib/utils";

interface WeeklyGridProps {
  slots: WeeklySlot[];
  onCardClick?: (slot: WeeklySlot) => void;
}

// ─── Colour config per class type ────────────────────────────────────────────
const TYPE_CONFIG: Record<
  WeeklySlotType,
  {
    bg: string;
    border: string;
    text: string;
    badge: string;
    icon: React.ElementType;
    badgeText: string;
  }
> = {
  Theory: {
    bg: "bg-blue-500/8 hover:bg-blue-500/15",
    border: "border-l-4 border-l-blue-500 border border-blue-500/10",
    text: "text-blue-700 dark:text-blue-300",
    badge: "bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-500/20",
    icon: BookOpen,
    badgeText: "Theory",
  },
  Lab: {
    bg: "bg-emerald-500/8 hover:bg-emerald-500/15",
    border: "border-l-4 border-l-emerald-500 border border-emerald-500/10",
    text: "text-emerald-700 dark:text-emerald-300",
    badge: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/20",
    icon: FlaskConical,
    badgeText: "Lab",
  },
  Tutorial: {
    bg: "bg-violet-500/8 hover:bg-violet-500/15",
    border: "border-l-4 border-l-violet-500 border border-violet-500/10",
    text: "text-violet-700 dark:text-violet-300",
    badge: "bg-violet-500/15 text-violet-700 dark:text-violet-300 border-violet-500/20",
    icon: MessageSquare,
    badgeText: "Tutorial",
  },
  Project: {
    bg: "bg-amber-500/8 hover:bg-amber-500/15",
    border: "border-l-4 border-l-amber-500 border border-amber-500/10",
    text: "text-amber-700 dark:text-amber-300",
    badge: "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/20",
    icon: FolderGit2,
    badgeText: "Project",
  },
  Seminar: {
    bg: "bg-rose-500/8 hover:bg-rose-500/15",
    border: "border-l-4 border-l-rose-500 border border-rose-500/10",
    text: "text-rose-700 dark:text-rose-300",
    badge: "bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/20",
    icon: Users,
    badgeText: "Seminar",
  },
  Mentoring: {
    bg: "bg-teal-500/8 hover:bg-teal-500/15",
    border: "border-l-4 border-l-teal-500 border border-teal-500/10",
    text: "text-teal-700 dark:text-teal-300",
    badge: "bg-teal-500/15 text-teal-700 dark:text-teal-300 border-teal-500/20",
    icon: Users,
    badgeText: "Mentoring",
  },
  "Dept. Meeting": {
    bg: "bg-indigo-500/8 hover:bg-indigo-500/15",
    border: "border-l-4 border-l-indigo-500 border border-indigo-500/10",
    text: "text-indigo-700 dark:text-indigo-300",
    badge: "bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 border-indigo-500/20",
    icon: CalendarClock,
    badgeText: "Dept. Mtg",
  },
};

// ─── Determine current day & detect ongoing slot ─────────────────────────────
function getCurrentDay(): WeeklySlot["day"] | null {
  const dayMap: Record<number, WeeklySlot["day"]> = {
    1: "Monday",
    2: "Tuesday",
    3: "Wednesday",
    4: "Thursday",
    5: "Friday",
    6: "Saturday",
  };
  return dayMap[new Date().getDay()] ?? null;
}

function parseToMins(tStr: string): number {
  const match = tStr.match(/(\d+):(\d+)\s*(AM|PM)?/i);
  if (!match) {
    const parts = tStr.split(":");
    return parseInt(parts[0] || "0") * 60 + parseInt(parts[1] || "0");
  }
  let hrs = parseInt(match[1] || "0");
  const mins = parseInt(match[2] || "0");
  const ampm = match[3];
  if (ampm) {
    if (ampm.toUpperCase() === "PM" && hrs < 12) hrs += 12;
    if (ampm.toUpperCase() === "AM" && hrs === 12) hrs = 0;
  }
  return hrs * 60 + mins;
}

function isSlotOngoing(slot: WeeklySlot): boolean {
  const now = new Date();
  const [startPart, endPart] = slot.timeSlot.split(" - ");
  if (!startPart || !endPart) return false;
  const nowMins = now.getHours() * 60 + now.getMinutes();
  const startMins = parseToMins(startPart);
  const endMins = parseToMins(endPart);
  return nowMins >= startMins && nowMins < endMins;
}

function isLunchOngoing(): boolean {
  const [startPart, endPart] = LUNCH_SLOT.split(" - ");
  const [startH, startM] = (startPart ?? "").split(":").map(Number);
  const [endH, endM] = (endPart ?? "").split(":").map(Number);
  const now = new Date();
  const nowMins = now.getHours() * 60 + now.getMinutes();
  return nowMins >= (startH ?? 0) * 60 + (startM ?? 0) && nowMins < (endH ?? 0) * 60 + (endM ?? 0);
}

function isTimeSlotActive(timeSlot: string): boolean {
  const [start, end] = timeSlot.split(" - ");
  if (!start || !end) return false;
  const now = new Date();
  const nowMins = now.getHours() * 60 + now.getMinutes();
  const startMins = parseToMins(start);
  const endMins = parseToMins(end);
  return nowMins >= startMins && nowMins < endMins;
}

// ─── Class card inside a cell ─────────────────────────────────────────────────
function ClassCard({
  cell,
  ongoing,
  isUpcoming,
  onClick,
}: {
  cell: WeeklySlot;
  ongoing: boolean;
  isUpcoming: boolean;
  onClick?: () => void;
}) {
  const cfg = TYPE_CONFIG[cell.type] ?? TYPE_CONFIG.Theory;
  const Icon = cfg.icon;

  return (
    <div
      onClick={onClick}
      title="Click to view section timetable"
      className={cn(
        "rounded-xl p-2.5 h-full flex flex-col gap-1 transition-all duration-300 cursor-pointer hover:scale-[1.02] hover:shadow-lg hover:border-primary/50 select-none border group relative",
        cfg.bg,
        cfg.border,
        ongoing && "ring-2 ring-offset-1 ring-primary/60 shadow-glow",
        isUpcoming && "ring-2 ring-offset-1 ring-blue-500/40 shadow-glow"
      )}
    >
      {/* Top row: type badge + ongoing / upcoming pill */}
      <div className="flex items-center justify-between gap-1 flex-wrap">
        <Badge
          variant="outline"
          className={cn("px-1.5 py-0 text-[0.52rem] font-bold rounded-lg border", cfg.badge)}
        >
          <Icon className="size-2.5 mr-0.5" />
          {cfg.badgeText}
        </Badge>
        {ongoing && (
          <span className="text-[0.48rem] font-black uppercase tracking-widest bg-primary text-primary-foreground px-1.5 py-0.5 rounded-full animate-pulse">
            LIVE
          </span>
        )}
        {isUpcoming && (
          <span className="text-[0.48rem] font-black uppercase tracking-widest bg-blue-600 text-white px-1.5 py-0.5 rounded-full">
            UPCOMING
          </span>
        )}
      </div>

      {/* Subject name */}
      <h5 className={cn("font-extrabold leading-tight text-[0.68rem] line-clamp-2 group-hover:underline", cfg.text)}>
        {cell.subject}
      </h5>

      {/* Code + Section */}
      <p className="text-[0.55rem] text-muted-foreground font-bold font-mono">
        {cell.code} · Sec {cell.section}
      </p>

      {/* Room + Building */}
      <div className={cn("flex justify-between items-center text-[0.52rem] font-semibold opacity-75 pt-1 border-t mt-auto", cfg.text.replace("text-", "border-").replace("700", "500/20").replace("300", "500/20"))}>
        <span className="flex items-center gap-0.5 truncate max-w-[50%]">
          <MapPin className="size-2.5 shrink-0" />
          {cell.room}
        </span>
        <span className="flex items-center gap-0.5 truncate max-w-[50%] text-primary font-bold">
          Section Viewer &rarr;
        </span>
      </div>
    </div>
  );
}

// ─── Lunch cell ───────────────────────────────────────────────────────────────
function LunchCell({ isCurrentDay, isOngoing }: { isCurrentDay: boolean; isOngoing: boolean }) {
  return (
    <div
      className={cn(
        "rounded-xl h-full flex flex-col items-center justify-center gap-1 border border-dashed transition-all duration-200",
        isOngoing && isCurrentDay
          ? "bg-amber-500/10 border-amber-400/40 ring-2 ring-amber-400/30"
          : "bg-muted/20 border-border/30"
      )}
    >
      <Coffee
        className={cn(
          "size-4",
          isOngoing && isCurrentDay ? "text-amber-500 animate-bounce" : "text-muted-foreground/30"
        )}
      />
      <span
        className={cn(
          "text-[0.52rem] font-black uppercase tracking-widest",
          isOngoing && isCurrentDay ? "text-amber-600" : "text-muted-foreground/30"
        )}
      >
        Lunch
      </span>
    </div>
  );
}

// ─── Free period cell ─────────────────────────────────────────────────────────
function FreePeriodCell({ day, timeSlot }: { day: string; timeSlot: string }) {
  const subtitles = [
    "Research",
    "Student Mentoring",
    "Paper Evaluation",
    "Preparation",
    "Department Work",
  ];
  const hash = (day.length + timeSlot.length) % subtitles.length;
  const subtitle = subtitles[hash] || "Research";

  return (
    <div className="rounded-xl p-2.5 h-full flex flex-col gap-1 border border-dashed border-border/30 bg-muted/5 hover:bg-muted/10 transition-all select-none justify-center">
      <div className="flex items-center gap-1.5">
        <Clock className="size-3 text-muted-foreground/40 shrink-0" />
        <span className="text-[0.55rem] font-extrabold text-muted-foreground/60 uppercase tracking-wider">
          Free Period
        </span>
      </div>
      <p className="text-[0.62rem] font-semibold text-muted-foreground/45">
        {subtitle}
      </p>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export function WeeklyGrid({ slots }: WeeklyGridProps) {
  const days: WeeklySlot["day"][] = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const currentDay = getCurrentDay();
  const lunchOngoing = isLunchOngoing();

  const getSlot = (day: WeeklySlot["day"], timeSlot: string) =>
    slots.find((s) => s.day === day && s.timeSlot === timeSlot);

  // Find the upcoming class on the current day
  const upcomingClass = (() => {
    if (!currentDay) return null;
    const todayClasses = slots.filter((s) => s.day === currentDay);
    const now = new Date();
    const nowMins = now.getHours() * 60 + now.getMinutes();

    const sortedToday = [...todayClasses].sort((a, b) => {
      const [aStart] = a.timeSlot.split(" - ");
      const [bStart] = b.timeSlot.split(" - ");
      return parseToMins(aStart || "") - parseToMins(bStart || "");
    });

    return sortedToday.find((s) => {
      const [start] = s.timeSlot.split(" - ");
      return parseToMins(start || "") > nowMins;
    }) || null;
  })();

  return (
    <Panel
      title="Weekly Timetable Grid"
      description="Live academic schedule with colour-coded classes, labs, tutorials, mentoring & meetings"
      className="border border-border bg-card rounded-2xl p-5 shadow-card"
    >
      {/* Legend strip */}
      <div className="flex flex-wrap items-center gap-2 mb-4 pb-3 border-b border-border/40">
        {(Object.keys(TYPE_CONFIG) as WeeklySlotType[]).map((t) => {
          const cfg = TYPE_CONFIG[t];
          return (
            <span
              key={t}
              className={cn(
                "inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[0.55rem] font-bold border",
                cfg.badge
              )}
            >
              <cfg.icon className="size-2.5" />
              {cfg.badgeText}
            </span>
          );
        })}
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[0.55rem] font-bold border bg-amber-500/10 text-amber-600 border-amber-400/25">
          <Coffee className="size-2.5" /> Lunch
        </span>
        <span className="ml-auto inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[0.55rem] font-black uppercase tracking-wider bg-primary/10 text-primary border border-primary/20">
          <Clock className="size-2.5" /> Today highlighted
        </span>
      </div>

      {/* Timetable scroll container */}
      <div className="overflow-x-auto select-none max-w-full">
        <div className="min-w-[860px]">
          {/* ── Header Row ── */}
          <div
            className="grid gap-1 mb-1"
            style={{ gridTemplateColumns: "90px repeat(6, minmax(110px, 1fr))" }}
          >
            {/* empty corner */}
            <div />
            {days.map((day) => {
              const isToday = day === currentDay;
              return (
                <div
                  key={day}
                  className={cn(
                    "text-center py-2 px-1 rounded-xl text-[0.65rem] font-extrabold tracking-wide transition-colors",
                    isToday
                      ? "bg-primary text-primary-foreground shadow-glow"
                      : "bg-muted/40 text-muted-foreground"
                  )}
                >
                  <span className="block">{day.slice(0, 3).toUpperCase()}</span>
                  {isToday && (
                    <span className="text-[0.45rem] font-black opacity-70 uppercase tracking-widest">
                      TODAY
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* ── Period Rows ── */}
          <div className="space-y-1">
            {TIME_SLOTS.map((timeSlot) => {
              const isLunch = timeSlot === LUNCH_SLOT;
              const [start, end] = timeSlot.split(" - ");
              const isSlotActive = isTimeSlotActive(timeSlot);

              return (
                <div
                  key={timeSlot}
                  className="grid gap-1"
                  style={{ gridTemplateColumns: "90px repeat(6, minmax(110px, 1fr))" }}
                >
                  {/* Time label */}
                  <div
                    className={cn(
                      "flex flex-col items-center justify-center text-center rounded-xl px-1 py-1.5 transition-colors border",
                      isLunch ? "bg-amber-500/10 border-amber-500/20" : isSlotActive ? "bg-primary/10 border-primary/20" : "bg-muted/20 border-transparent"
                    )}
                  >
                    <Clock
                      className={cn(
                        "size-3 mb-0.5",
                        isLunch ? "text-amber-500" : isSlotActive ? "text-primary" : "text-muted-foreground"
                      )}
                    />
                    <span
                      className={cn(
                        "font-mono font-bold leading-tight",
                        isLunch ? "text-amber-600 text-[0.55rem]" : isSlotActive ? "text-primary text-[0.55rem]" : "text-muted-foreground text-[0.52rem]"
                      )}
                    >
                      {start}
                    </span>
                    <span
                      className={cn(
                        "font-mono leading-tight",
                        isLunch ? "text-amber-500/70 text-[0.45rem]" : isSlotActive ? "text-primary/70 text-[0.45rem]" : "text-muted-foreground/50 text-[0.45rem]"
                      )}
                    >
                      {end}
                    </span>
                  </div>

                  {/* Day cells */}
                  {days.map((day) => {
                    const isToday = day === currentDay;
                    const cell = getSlot(day, timeSlot);
                    const ongoing = !!cell && isToday && isSlotOngoing(cell);
                    const isUpcoming = !!cell && isToday && upcomingClass?.timeSlot === cell.timeSlot;

                    return (
                      <div
                        key={day}
                        className={cn(
                          "rounded-xl transition-all duration-200",
                          isLunch ? "h-[48px]" : "h-[96px]",
                          isToday && !isLunch && "ring-1 ring-primary/10"
                        )}
                      >
                        {isLunch ? (
                          <LunchCell
                            isCurrentDay={isToday}
                            isOngoing={lunchOngoing}
                          />
                        ) : cell ? (
                          <ClassCard
                            cell={cell}
                            ongoing={ongoing}
                            isUpcoming={isUpcoming}
                            onClick={() => onCardClick && onCardClick(cell)}
                          />
                        ) : (
                          <FreePeriodCell day={day} timeSlot={timeSlot} />
                        )}

                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Panel>
  );
}
