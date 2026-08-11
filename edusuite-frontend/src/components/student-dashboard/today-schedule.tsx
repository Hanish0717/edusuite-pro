import React from "react";
import { ScheduleItem } from "./types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Building, User, Video, Calendar, CheckCircle2 } from "lucide-react";

interface TodayScheduleProps {
  schedule: ScheduleItem[];
  onViewTimetable: () => void;
}

export function TodaySchedule({ schedule, onViewTimetable }: TodayScheduleProps) {
  return (
    <div id="student-timetable-section" className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
            <Clock className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              SECTION 3: TODAY'S TIMETABLE SCHEDULE
            </h3>
            <p className="text-[11px] text-slate-500 font-medium">
              Real-Time Class Tracker & Attendance Log
            </p>
          </div>
        </div>

        <Button
          onClick={onViewTimetable}
          variant="outline"
          size="sm"
          className="h-8 text-xs rounded-xl border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 gap-1.5"
        >
          <Calendar className="h-3.5 w-3.5 text-blue-600" /> View Full Timetable
        </Button>
      </div>

      <div className="space-y-3">
        {schedule.map((item) => {
          const isCurrent = item.status === "Current";
          const isNext = item.status === "Next";
          const isCompleted = item.status === "Completed";

          return (
            <div
              key={item.id}
              className={`p-4 rounded-xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-3 ${
                isCurrent
                  ? "border-blue-600/40 bg-blue-50/40 dark:bg-blue-950/30 ring-1 ring-blue-600/30 shadow-sm"
                  : isNext
                  ? "border-amber-500/30 bg-amber-50/20 dark:bg-amber-950/20"
                  : isCompleted
                  ? "border-slate-200/80 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-800/30 opacity-75"
                  : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
              }`}
            >
              <div className="flex items-center gap-3 min-w-[170px]">
                <div className="text-left space-y-0.5">
                  <div className="flex items-center gap-1 text-xs font-bold font-mono text-slate-900 dark:text-white">
                    <Clock className="h-3.5 w-3.5 text-blue-600" />
                    <span>{item.startTime} - {item.endTime}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono block">
                    1 Hour Lecture
                  </span>
                </div>

                <Badge
                  className={`text-[9px] px-2 py-0.5 font-bold font-mono border ${
                    isCurrent
                      ? "bg-blue-600 text-white border-blue-600 animate-pulse"
                      : isNext
                      ? "bg-amber-500 text-white border-amber-500"
                      : isCompleted
                      ? "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border-slate-300 dark:border-slate-600"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                  }`}
                >
                  {isCurrent ? "● LIVE NOW" : isNext ? "NEXT CLASS" : isCompleted ? "✓ DONE" : "UPCOMING"}
                </Badge>
              </div>

              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-[10px] font-mono font-bold text-blue-600 border-blue-200">
                    {item.subjectCode}
                  </Badge>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    {item.subjectName}
                  </h4>
                </div>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-500">
                  <span className="flex items-center gap-1">
                    <User className="h-3 w-3 text-slate-400" /> {item.faculty}
                  </span>
                  <span className="flex items-center gap-1">
                    <Building className="h-3 w-3 text-slate-400" /> {item.building} (Room {item.room})
                  </span>
                  <span className="flex items-center gap-1 font-mono text-emerald-600 font-semibold">
                    <CheckCircle2 className="h-3 w-3" /> Attendance: {item.attendanceStatus}
                  </span>
                </div>
              </div>

              {item.isOnline && item.joinUrl && (
                <a
                  href={item.joinUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-all"
                >
                  <Video className="h-3.5 w-3.5" /> Join Online
                </a>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
