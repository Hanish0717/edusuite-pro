import React, { useState } from "react";
import { CalendarDayItem } from "./types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  X,
} from "lucide-react";

interface AttendanceCalendarProps {
  days: CalendarDayItem[];
}

export function AttendanceCalendar({ days }: AttendanceCalendarProps) {
  const [selectedDay, setSelectedDay] = useState<CalendarDayItem | null>(null);
  const [currentMonth] = useState("January 2025");

  const getStatusColor = (status: CalendarDayItem["status"]) => {
    switch (status) {
      case "Present":
        return "bg-emerald-500 text-white hover:bg-emerald-600";
      case "Absent":
        return "bg-red-500 text-white hover:bg-red-600";
      case "Leave":
        return "bg-amber-500 text-white hover:bg-amber-600";
      case "Holiday":
        return "bg-blue-500 text-white hover:bg-blue-600";
      case "Exam":
        return "bg-purple-600 text-white hover:bg-purple-700";
      default:
        return "bg-slate-100 dark:bg-slate-800 text-slate-600";
    }
  };

  return (
    <div className="space-y-6">

      {/* HEADER & LEGEND STRIP */}
      <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <CalendarIcon className="h-4 w-4 text-blue-600" /> Monthly Attendance Calendar
          </h3>
          <p className="text-xs text-slate-500">Visual attendance grid & daily period log for {currentMonth}</p>
        </div>

        {/* COLOR CODING LEGEND */}
        <div className="flex items-center gap-3 text-xs flex-wrap font-medium">
          <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-emerald-500"></span> Present</div>
          <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-red-500"></span> Absent</div>
          <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-amber-500"></span> Leave</div>
          <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-blue-500"></span> Holiday</div>
          <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-purple-600"></span> Exam</div>
        </div>
      </div>

      {/* CALENDAR GRID */}
      <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <h4 className="text-sm font-extrabold text-slate-900 dark:text-white font-display">{currentMonth}</h4>
          <div className="flex items-center gap-1">
            <Button variant="outline" size="sm" className="h-7 w-7 p-0 rounded-lg"><ChevronLeft className="h-4 w-4" /></Button>
            <Button variant="outline" size="sm" className="h-7 w-7 p-0 rounded-lg"><ChevronRight className="h-4 w-4" /></Button>
          </div>
        </div>

        {/* DAY NAMES HEADER */}
        <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-slate-400">
          <span>Sun</span>
          <span>Mon</span>
          <span>Tue</span>
          <span>Wed</span>
          <span>Thu</span>
          <span>Fri</span>
          <span>Sat</span>
        </div>

        {/* DAYS TILES */}
        <div className="grid grid-cols-7 gap-2">
          {days.map((day) => (
            <button
              key={day.date}
              onClick={() => setSelectedDay(day)}
              className={`p-2.5 rounded-xl border text-center flex flex-col items-center justify-between h-16 transition-all hover:scale-105 ${getStatusColor(day.status)}`}
            >
              <span className="text-xs font-extrabold">{day.dayNumber}</span>
              <span className="text-[9px] font-mono opacity-90 truncate max-w-full">
                {day.title ? day.title : day.status}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* DAILY ATTENDANCE POPUP MODAL */}
      {selectedDay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in zoom-in-95 duration-200">
            
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/40">
              <div>
                <span className="text-[10px] text-blue-600 font-mono font-bold uppercase block">{selectedDay.dayName} &middot; {selectedDay.date}</span>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Daily Attendance Details</h3>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setSelectedDay(null)} className="rounded-xl">
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="p-5 space-y-3 max-h-[60vh] overflow-y-auto">
              {selectedDay.title && (
                <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-800 dark:text-blue-300 text-xs font-bold">
                  {selectedDay.title}
                </div>
              )}

              {selectedDay.periods.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-400">No scheduled periods on this day.</div>
              ) : (
                selectedDay.periods.map((p) => (
                  <div key={p.id} className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-1 text-xs">
                    <div className="flex items-center justify-between font-mono font-bold">
                      <span className="text-blue-600">{p.period} ({p.timing})</span>
                      <Badge className={p.status === "Present" ? "bg-emerald-500/10 text-emerald-600" : "bg-red-500/10 text-red-600"}>
                        {p.status}
                      </Badge>
                    </div>
                    <div className="font-bold text-slate-900 dark:text-white">{p.subjectCode} - {p.subjectName}</div>
                    <p className="text-[11px] text-slate-500">Faculty: {p.facultyName} &middot; Room: {p.room}</p>
                  </div>
                ))
              )}
            </div>

            <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex justify-end">
              <Button onClick={() => setSelectedDay(null)} size="sm" className="rounded-xl bg-blue-600 text-white text-xs font-bold">
                Close Popup
              </Button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
