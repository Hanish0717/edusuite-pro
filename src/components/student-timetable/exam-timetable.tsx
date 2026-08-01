import React from "react";
import { ExamScheduleItem } from "./types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Calendar, Clock, MapPin, Download, Eye, Award } from "lucide-react";
import { toast } from "sonner";

interface ExamTimetableProps {
  exams: ExamScheduleItem[];
}

export function ExamTimetable({ exams }: ExamTimetableProps) {
  const handleDownloadHallTicket = (examName: string, subjectCode: string) => {
    toast.success(`Official Hall Ticket PDF generated & downloaded for ${subjectCode} (${examName})!`);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
          <Award className="h-4 w-4 text-rose-500" /> Mid-Term & End-Semester Exam Schedule ({exams.length})
        </h3>
        <span className="text-xs font-mono text-slate-500">Controller of Examinations Portal</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {exams.map((exam) => (
          <div
            key={exam.id}
            className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs hover:shadow-md hover:border-rose-500/30 transition-all flex flex-col justify-between space-y-4 group overflow-hidden"
          >
            {/* TOP HEADER */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="font-mono font-bold text-rose-600 border-rose-200 text-[11px]">
                  {exam.subjectCode}
                </Badge>

                <Badge
                  className={`text-[9px] px-2 py-0.5 font-mono ${
                    exam.hallTicketStatus === "Issued"
                      ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                      : "bg-amber-500/10 text-amber-600 border-amber-500/20"
                  }`}
                >
                  Hall Ticket: {exam.hallTicketStatus}
                </Badge>
              </div>

              <span className="text-[11px] font-mono text-slate-400 block">{exam.examName}</span>

              <h4 className="text-sm font-extrabold text-slate-900 dark:text-white group-hover:text-rose-600 transition-colors leading-snug">
                {exam.subjectName}
              </h4>
            </div>

            {/* VENUE & SEAT METRICS */}
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-1.5 font-mono text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5 text-rose-500" /> Exam Date:
                </span>
                <strong className="text-slate-900 dark:text-white">{exam.date}</strong>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400 flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5 text-purple-600" /> Time Slot:
                </span>
                <span className="text-purple-600 font-bold">{exam.time} ({exam.duration})</span>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-slate-200 dark:border-slate-700/60">
                <span className="text-slate-400 flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 text-blue-500" /> Exam Venue:
                </span>
                <span className="text-slate-800 dark:text-slate-200 font-bold">{exam.venue}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400">Assigned Seat:</span>
                <Badge variant="outline" className="font-mono text-xs font-bold text-slate-900 bg-amber-50 dark:bg-amber-950/40 border-amber-300">
                  Seat #{exam.seatNumber}
                </Badge>
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 w-full min-w-0 overflow-hidden">
              <Button
                onClick={() => toast.info(`Viewing examination instructions & syllabus for ${exam.subjectCode}...`)}
                size="sm"
                variant="outline"
                className="h-8 text-xs rounded-xl border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 gap-1 w-full min-w-0 overflow-hidden font-semibold"
              >
                <Eye className="h-3.5 w-3.5 text-slate-600 shrink-0" />
                <span className="truncate">View Details</span>
              </Button>

              <Button
                onClick={() => handleDownloadHallTicket(exam.examName, exam.subjectCode)}
                size="sm"
                className="h-8 text-xs rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold gap-1 w-full min-w-0 overflow-hidden"
              >
                <Download className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">Download Ticket</span>
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
