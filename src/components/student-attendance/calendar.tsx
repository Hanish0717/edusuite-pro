import React, { useState } from "react";
import { CalendarDayRecord } from "./types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  User,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Award,
} from "lucide-react";

interface CalendarProps {
  days: CalendarDayRecord[];
}

export function AttendanceCalendar({ days }: CalendarProps) {
  const [selectedDay, setSelectedDay] = useState<CalendarDayRecord | null>(days[17] || days[0]);
  const [currentMonth] = useState("January 2025");

  const getStatusColor = (status: CalendarDayRecord["status"]) => {
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
          <p className="text-xs text-slate-500">Visual attendance map & period breakdown for {currentMonth}</p>
        </div>

        {/* COLOR CODING LEGEND */}
        <div className="flex items-center gap-3 text-xs flex-wrap font-medium">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-500"></span> Present
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-500"></span> Absent
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-amber-500"></span> Leave
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-blue-500"></span> Holiday
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-purple-600"></span> Exam
          </div>
        </div>
      </div>

      {/* MAIN GRID: CALENDAR + DAY DETAILS PANEL */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* MONTHLY CALENDAR GRID (2 SPANS) */}
        <div className="lg:col-span-2 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
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
            {days.map((day) => {
              const isSelected = selectedDay?.date === day.date;
              return (
                <button
                  key={day.date}
                  onClick={() => setSelectedDay(day)}
                  className={`p-2.5 rounded-xl border text-center flex flex-col items-center justify-between h-16 transition-all ${
                    isSelected
                      ? "ring-2 ring-blue-600 shadow-md scale-105"
                      : "hover:border-slate-300 dark:hover:border-slate-700"
                  } ${getStatusColor(day.status)}`}
                >
                  <span className="text-xs font-extrabold">{day.dayNumber}</span>
                  <span className="text-[9px] font-mono opacity-90 truncate max-w-full">
                    {day.title ? day.title : day.status}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* SELECTED DATE DETAILS PANEL (1 SPAN) */}
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
          {selectedDay ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div>
                  <span className="text-[10px] text-blue-600 font-mono font-bold uppercase block">
                    {selectedDay.dayName} &middot; {selectedDay.date}
                  </span>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">Day Attendance Breakdown</h4>
                </div>
                <Badge className={getStatusColor(selectedDay.status)}>
                  {selectedDay.status}
                </Badge>
              </div>

              {selectedDay.title && (
                <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/60 text-xs text-blue-800 dark:text-blue-300 font-medium">
                  Event: <strong>{selectedDay.title}</strong>
                </div>
              )}

              {selectedDay.periods.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl space-y-1">
                  <CalendarIcon className="h-6 w-6 mx-auto text-slate-300" />
                  <p>No academic periods scheduled on this day.</p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {selectedDay.periods.map((p, i) => (
                    <div key={i} className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-mono font-bold text-blue-600">{p.period} ({p.timeSlot})</span>
                        <Badge className={p.status === "Present" ? "bg-emerald-500/10 text-emerald-600" : "bg-red-500/10 text-red-600"}>
                          {p.status}
                        </Badge>
                      </div>
                      <div className="font-bold text-xs text-slate-900 dark:text-white">{p.subjectCode} - {p.subjectName}</div>
                      <p className="text-[11px] text-slate-500">Faculty: {p.facultyName} &middot; Room: {p.room}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="p-8 text-center text-xs text-slate-400">Click a date in the calendar to view details</div>
          )}
        </div>

      </div>

    </div>
  );
}
