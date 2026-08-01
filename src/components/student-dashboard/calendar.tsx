import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";

export function StudentMiniCalendarCard() {
  const [currentMonth, setCurrentMonth] = useState("August 2026");

  const daysOfWeek = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  // August 2026 grid setup (Starts on Saturday = index 6)
  const calendarDays = [
    { day: 26, isPadding: true },
    { day: 27, isPadding: true },
    { day: 28, isPadding: true },
    { day: 29, isPadding: true },
    { day: 30, isPadding: true },
    { day: 31, isPadding: true },
    { day: 1, type: "normal" },
    { day: 2, type: "normal" },
    { day: 3, type: "normal" },
    { day: 4, type: "assignment", label: "CS401 Assignment #3 Due" },
    { day: 5, type: "normal" },
    { day: 6, type: "placement", label: "Interview Round 1" },
    { day: 7, type: "normal" },
    { day: 8, type: "exam", label: "End-Sem TOC Exam" },
    { day: 9, type: "normal" },
    { day: 10, type: "exam", label: "End-Sem DS Exam" },
    { day: 11, type: "normal" },
    { day: 12, type: "exam", label: "End-Sem Crypto Exam" },
    { day: 13, type: "normal" },
    { day: 14, type: "normal" },
    { day: 15, type: "holiday", label: "Independence Day Holiday" },
    { day: 16, type: "normal" },
    { day: 17, type: "normal" },
    { day: 18, type: "event", label: "AWS DevOps Workshop" },
    { day: 19, type: "normal" },
    { day: 20, type: "normal" },
    { day: 21, type: "normal" },
    { day: 22, type: "placement", label: "Google Drive" },
    { day: 23, type: "normal" },
    { day: 24, type: "normal" },
    { day: 25, type: "normal" },
    { day: 26, type: "normal" },
    { day: 27, type: "normal" },
    { day: 28, type: "normal" },
    { day: 29, type: "normal" },
    { day: 30, type: "normal" },
    { day: 31, type: "normal" },
  ];

  return (
    <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
      {/* HEADER */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
            <CalendarIcon className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Academic Calendar
            </h3>
            <p className="text-[11px] text-slate-500 font-medium">
              {currentMonth} Schedule
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50">
            <ChevronLeft className="h-3.5 w-3.5 text-slate-600" />
          </button>
          <button className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50">
            <ChevronRight className="h-3.5 w-3.5 text-slate-600" />
          </button>
        </div>
      </div>

      {/* CALENDAR GRID */}
      <div className="space-y-2">
        <div className="grid grid-cols-7 text-center text-[10px] font-bold text-slate-400 uppercase font-mono">
          {daysOfWeek.map((d) => (
            <div key={d} className="py-1">{d}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1 text-center text-xs font-mono">
          {calendarDays.map((item, idx) => {
            if (item.isPadding) {
              return (
                <div key={idx} className="p-1.5 text-slate-300 dark:text-slate-700">
                  {item.day}
                </div>
              );
            }

            const isExam = item.type === "exam";
            const isAssignment = item.type === "assignment";
            const isHoliday = item.type === "holiday";
            const isEvent = item.type === "event" || item.type === "placement";

            return (
              <div
                key={idx}
                title={item.label || `August ${item.day}, 2026`}
                className={`p-1.5 rounded-lg transition-all cursor-pointer font-bold relative group ${
                  isExam
                    ? "bg-rose-500 text-white shadow-xs"
                    : isAssignment
                    ? "bg-amber-500 text-white"
                    : isHoliday
                    ? "bg-emerald-500 text-white"
                    : isEvent
                    ? "bg-blue-600 text-white"
                    : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200"
                }`}
              >
                {item.day}
              </div>
            );
          })}
        </div>
      </div>

      {/* LEGEND */}
      <div className="flex flex-wrap items-center justify-between text-[10px] text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-800">
        <span className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-rose-500" /> Exams
        </span>
        <span className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-amber-500" /> Assignments
        </span>
        <span className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-emerald-500" /> Holidays
        </span>
        <span className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-blue-600" /> Drives/Events
        </span>
      </div>
    </div>
  );
}
