import React from "react";
import { TimetableSlot, DayOfWeek, TimeSlotKey } from "./types";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Clock, MapPin, User, Utensils, Video, BookOpen } from "lucide-react";

interface WeeklyGridProps {
  slots: TimetableSlot[];
  onSelectSlot: (slot: TimetableSlot) => void;
}

const days: DayOfWeek[] = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const timeSlots: { key: TimeSlotKey | "LUNCH"; label: string; isBreak?: boolean }[] = [
  { key: "09:00–10:00", label: "09:00 AM – 10:00 AM" },
  { key: "10:00–11:00", label: "10:00 AM – 11:00 AM" },
  { key: "11:15–12:15", label: "11:15 AM – 12:15 PM" },
  { key: "12:15–01:15", label: "12:15 PM – 01:15 PM" },
  { key: "LUNCH", label: "01:15 PM – 02:00 PM • Lunch Break & Refreshment", isBreak: true },
  { key: "02:00–03:00", label: "02:00 PM – 03:00 PM" },
  { key: "03:00–04:00", label: "03:00 PM – 04:00 PM" },
  { key: "04:00–05:00", label: "04:00 PM – 05:00 PM" },
];

export function WeeklyGrid({ slots, onSelectSlot }: WeeklyGridProps) {
  const getClassTypeBadge = (type: string) => {
    switch (type) {
      case "Lecture": return "bg-blue-500/10 text-blue-600 border-blue-500/20";
      case "Lab": return "bg-purple-500/10 text-purple-600 border-purple-500/20";
      case "Tutorial": return "bg-amber-500/10 text-amber-600 border-amber-500/20";
      case "Seminar": return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
      case "Online": return "bg-indigo-500/10 text-indigo-600 border-indigo-500/20";
      default: return "bg-slate-500/10 text-slate-600 border-slate-500/20";
    }
  };

  return (
    <TooltipProvider>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-purple-600" /> Weekly Master Matrix Schedule (Mon - Sat)
          </h3>
          <span className="text-xs font-mono text-slate-500">6 Working Days • 40 Sessions</span>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs">
          <table className="w-full border-collapse text-left text-xs min-w-[900px]">
            {/* HEADER ROW - DAYS */}
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/80">
                <th className="p-3 font-mono font-bold text-slate-500 dark:text-slate-400 w-32 border-r border-slate-200 dark:border-slate-800 text-center uppercase tracking-wider text-[11px]">
                  Time Slot
                </th>
                {days.map((day) => (
                  <th
                    key={day}
                    className="p-3 font-mono font-bold text-slate-800 dark:text-slate-200 border-r border-slate-200 dark:border-slate-800 text-center uppercase tracking-wider text-[11px] last:border-r-0"
                  >
                    {day}
                  </th>
                ))}
              </tr>
            </thead>

            {/* TIMETABLE ROWS */}
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {timeSlots.map((slotInfo) => {
                if (slotInfo.isBreak) {
                  return (
                    <tr key="LUNCH" className="bg-amber-500/5 dark:bg-amber-950/20 border-y border-amber-500/20">
                      <td colSpan={7} className="py-2.5 px-4 text-center font-mono text-xs font-bold text-amber-700 dark:text-amber-400">
                        <span className="inline-flex items-center gap-2">
                          <Utensils className="h-4 w-4 text-amber-600" /> {slotInfo.label}
                        </span>
                      </td>
                    </tr>
                  );
                }

                return (
                  <tr key={slotInfo.key} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                    {/* TIME COLUMN */}
                    <td className="p-2.5 font-mono text-[11px] font-bold text-slate-600 dark:text-slate-400 border-r border-slate-200 dark:border-slate-800 text-center bg-slate-50/30 dark:bg-slate-800/40">
                      {slotInfo.key}
                    </td>

                    {/* DAY COLUMNS */}
                    {days.map((day) => {
                      const matchedSlot = slots.find(
                        (s) => s.dayOfWeek === day && s.timeSlotKey === slotInfo.key
                      );

                      if (!matchedSlot) {
                        return (
                          <td
                            key={day}
                            className="p-2 border-r border-slate-200 dark:border-slate-800 text-center text-slate-300 dark:text-slate-700 font-mono text-[10px] last:border-r-0 bg-slate-50/10"
                          >
                            <span className="inline-block py-3 opacity-40">Free Period</span>
                          </td>
                        );
                      }

                      return (
                        <td key={day} className="p-2 border-r border-slate-200 dark:border-slate-800 last:border-r-0">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div
                                onClick={() => onSelectSlot(matchedSlot)}
                                className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs hover:border-purple-500 hover:shadow-md cursor-pointer transition-all space-y-1 group"
                              >
                                <div className="flex items-center justify-between">
                                  <span className="font-mono font-bold text-purple-600 text-[11px]">
                                    {matchedSlot.subjectCode}
                                  </span>
                                  <Badge className={`text-[8px] px-1 py-0 font-mono ${getClassTypeBadge(matchedSlot.classType)}`}>
                                    {matchedSlot.classType}
                                  </Badge>
                                </div>

                                <h5 className="font-extrabold text-[11px] text-slate-900 dark:text-white truncate group-hover:text-purple-600 transition-colors">
                                  {matchedSlot.subjectName}
                                </h5>

                                <p className="text-[10px] text-slate-500 truncate flex items-center gap-1 font-mono">
                                  <User className="h-3 w-3 text-slate-400 shrink-0" /> {matchedSlot.facultyName.split(" ")[1] || matchedSlot.facultyName}
                                </p>

                                <div className="flex items-center justify-between text-[9px] font-mono text-slate-400 pt-0.5 border-t border-slate-100 dark:border-slate-800/80">
                                  <span className="flex items-center gap-0.5 text-rose-600 font-semibold">
                                    <MapPin className="h-2.5 w-2.5" /> R-{matchedSlot.roomNumber}
                                  </span>
                                  {matchedSlot.isOnline && (
                                    <span className="text-indigo-600 font-bold flex items-center gap-0.5">
                                      <Video className="h-2.5 w-2.5 animate-pulse" /> Live
                                    </span>
                                  )}
                                </div>
                              </div>
                            </TooltipTrigger>
                            <TooltipContent className="p-3 max-w-xs rounded-xl bg-slate-900 text-white text-xs space-y-1 shadow-xl">
                              <p className="font-bold text-purple-400">{matchedSlot.subjectCode}: {matchedSlot.subjectName}</p>
                              <p>👨‍🏫 Faculty: {matchedSlot.facultyName}</p>
                              <p>🏫 Venue: Room {matchedSlot.roomNumber} ({matchedSlot.building})</p>
                              <p>⏰ Time: {matchedSlot.startTime} – {matchedSlot.endTime}</p>
                              <p className="text-[10px] text-slate-300 font-mono pt-1">Click to view syllabus & resources</p>
                            </TooltipContent>
                          </Tooltip>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </TooltipProvider>
  );
}
