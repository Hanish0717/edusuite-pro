import { Calendar, Clock, MapPin, Users, BookOpen } from "lucide-react";
import type { ExamItem } from "./types";
import { StatusBadge, TypeBadge } from "./exam-badges";

interface UpcomingExamsProps {
  exams: ExamItem[];
}

export function UpcomingExams({ exams }: UpcomingExamsProps) {
  const upcomingList = exams.filter((e) => e.status === "Upcoming" || e.status === "Ongoing");

  if (upcomingList.length === 0) {
    return (
      <div className="rounded-2xl border border-border/40 bg-card p-6 text-center text-muted-foreground text-sm">
        No upcoming examinations scheduled.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {upcomingList.map((exam) => (
        <div
          key={exam.id}
          className="group relative flex flex-col gap-4 p-5 rounded-2xl border border-border/50 bg-card hover:shadow-lg hover:border-primary/30 hover:-translate-y-0.5 transition-all duration-300"
        >
          {/* Header Row */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-primary/8 flex items-center justify-center shrink-0 group-hover:bg-primary/15 transition-colors">
                <BookOpen className="size-5 text-primary" />
              </div>
              <div className="min-w-0">
                <h3 className="font-bold text-sm text-foreground leading-tight line-clamp-1">{exam.name}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">{exam.subject} · {exam.code}</p>
              </div>
            </div>
            <StatusBadge status={exam.status} />
          </div>

          {/* Body Details */}
          <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-xs text-muted-foreground pt-1 border-t border-border/30">
            <div className="flex items-center gap-1.5">
              <Calendar className="size-3.5 text-muted-foreground/75" />
              <span>{exam.date}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="size-3.5 text-muted-foreground/75" />
              <span>{exam.time}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="size-3.5 text-muted-foreground/75" />
              <span>{exam.duration}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin className="size-3.5 text-muted-foreground/75" />
              <span className="truncate">{exam.venue}</span>
            </div>
            <div className="flex items-center gap-1.5 col-span-2">
              <Users className="size-3.5 text-muted-foreground/75" />
              <span>Section: <strong className="text-foreground">{exam.section}</strong> · Invigilator: <strong className="text-foreground">{exam.supervisor}</strong></span>
            </div>
          </div>

          {/* Footer Badge */}
          <div className="flex items-center justify-between pt-2 border-t border-border/30">
            <TypeBadge type={exam.type} />
            <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Max Marks: {exam.maxMarks}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
