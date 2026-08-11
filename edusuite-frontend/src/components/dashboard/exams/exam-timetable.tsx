import { Calendar, Clock, MapPin, User, FileText } from "lucide-react";
import type { ExamItem } from "./types";
import { StatusBadge, TypeBadge } from "./exam-badges";

interface ExamTimetableProps {
  exams: ExamItem[];
}

export function ExamTimetable({ exams }: ExamTimetableProps) {
  if (exams.length === 0) {
    return (
      <div className="rounded-2xl border border-border/40 bg-card p-6 text-center text-muted-foreground text-sm">
        No timetable records found.
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border/50 bg-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/40 bg-muted/20 text-xs font-bold text-muted-foreground uppercase tracking-wider">
              <th className="px-5 py-4 text-left">Exam Details</th>
              <th className="px-5 py-4 text-left">Schedule</th>
              <th className="px-5 py-4 text-left">Section</th>
              <th className="px-5 py-4 text-left">Type</th>
              <th className="px-5 py-4 text-left">Venue</th>
              <th className="px-5 py-4 text-left">Supervisor</th>
              <th className="px-5 py-4 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/30">
            {exams.map((exam) => (
              <tr key={exam.id} className="hover:bg-muted/10 transition-colors">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="size-8 rounded-lg bg-indigo-500/10 flex items-center justify-center shrink-0">
                      <FileText className="size-4 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div>
                      <p className="font-bold text-foreground leading-snug">{exam.name}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{exam.subject} · {exam.code}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <div className="flex flex-col gap-1 text-xs text-foreground font-medium">
                    <span className="flex items-center gap-1.5"><Calendar className="size-3.5 text-muted-foreground" /> {exam.date}</span>
                    <span className="flex items-center gap-1.5"><Clock className="size-3.5 text-muted-foreground" /> {exam.time} ({exam.duration})</span>
                  </div>
                </td>
                <td className="px-5 py-4 font-semibold text-foreground">{exam.section}</td>
                <td className="px-5 py-4"><TypeBadge type={exam.type} /></td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <MapPin className="size-3.5" />
                    <span>{exam.venue}</span>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-1.5 text-xs text-foreground">
                    <User className="size-3.5 text-muted-foreground" />
                    <span>{exam.supervisor}</span>
                  </div>
                </td>
                <td className="px-5 py-4 text-right"><StatusBadge status={exam.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
