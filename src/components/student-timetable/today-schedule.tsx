import React from "react";
import { TimetableSlot } from "./types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";
import { 
  Clock, 
  MapPin, 
  User, 
  Video, 
  Eye, 
  CheckCircle2, 
  AlertCircle,
  ExternalLink,
  BookOpen
} from "lucide-react";
import { toast } from "sonner";

interface TodayScheduleProps {
  slots: TimetableSlot[];
  onSelectSlot: (slot: TimetableSlot) => void;
}

export function TodaySchedule({ slots, onSelectSlot }: TodayScheduleProps) {
  const navigate = useNavigate();
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Live Now":
        return "bg-emerald-600 text-white animate-pulse shadow-xs";
      case "Completed":
        return "bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400";
      case "Upcoming":
        return "bg-blue-500/10 text-blue-600 border-blue-500/20";
      default:
        return "bg-slate-100 text-slate-600";
    }
  };

  const handleNavigateClassroom = (room: string, building: string) => {
    toast.success(`Interactive Floor Plan opened for Room ${room} (${building})!`);
  };

  if (slots.length === 0) {
    return (
      <div className="p-12 text-center rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3">
        <BookOpen className="h-12 w-12 text-slate-300 dark:text-slate-700 mx-auto" />
        <h3 className="text-base font-bold text-slate-900 dark:text-white">No Classes Scheduled for Today</h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          You have no active lectures or lab sessions remaining for today. Enjoy your study hour!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
          <Clock className="h-4 w-4 text-purple-600" /> Today's Chronological Timeline ({slots.length} Classes)
        </h3>
        <span className="text-xs font-mono text-slate-500">Monday, August 01, 2026</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {slots.map((slot) => {
          const isLive = slot.status === "Live Now";
          const isCompleted = slot.status === "Completed";

          return (
            <div
              key={slot.id}
              className={`p-5 rounded-2xl border transition-all flex flex-col justify-between space-y-4 group overflow-hidden ${
                isLive
                  ? "border-emerald-500/50 bg-emerald-50/40 dark:bg-emerald-950/30 ring-2 ring-emerald-500/30 shadow-md"
                  : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs hover:shadow-md hover:border-purple-500/30"
              }`}
            >
              {/* TOP ROW */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Badge variant="outline" className="font-mono font-bold text-purple-600 border-purple-200 text-[11px]">
                      {slot.subjectCode}
                    </Badge>
                    <Badge className={`text-[9px] px-2 py-0.5 font-mono ${getClassTypeBadge(slot.classType)}`}>
                      {slot.classType}
                    </Badge>
                  </div>

                  <Badge className={`text-[9px] px-2 py-0.5 font-mono ${getStatusBadge(slot.status)}`}>
                    {isLive ? "● LIVE NOW" : slot.status}
                  </Badge>
                </div>

                {/* SUBJECT TITLE */}
                <h4 className="text-sm font-extrabold text-slate-900 dark:text-white group-hover:text-purple-600 transition-colors leading-snug">
                  {slot.subjectName}
                </h4>

                {/* FACULTY */}
                <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
                  <img
                    src={slot.facultyAvatar}
                    alt={slot.facultyName}
                    className="w-6 h-6 rounded-full object-cover border border-slate-200 shrink-0"
                  />
                  <span className="font-medium truncate">{slot.facultyName}</span>
                </div>
              </div>

              {/* TIME & VENUE DETAILS */}
              <div className="space-y-2 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-1.5 font-mono text-[11px]">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 flex items-center gap-1">
                      <Clock className="h-3 w-3 text-purple-600" /> Time:
                    </span>
                    <strong className="text-slate-900 dark:text-white">
                      {slot.startTime} – {slot.endTime} ({slot.duration})
                    </strong>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-rose-500" /> Venue:
                    </span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      Room {slot.roomNumber} ({slot.building})
                    </span>
                  </div>
                </div>

                {/* ATTENDANCE BADGE */}
                <div className="flex items-center justify-between text-[11px] font-mono px-1">
                  <span className="text-slate-500">Attendance:</span>
                  <Badge
                    variant="outline"
                    className={`text-[9px] px-2 py-0.5 font-bold ${
                      slot.attendanceStatus === "Present"
                        ? "bg-emerald-50 text-emerald-600 border-emerald-300"
                        : "bg-blue-50 text-blue-600 border-blue-300"
                    }`}
                  >
                    {slot.attendanceStatus}
                  </Badge>
                </div>
              </div>

              {/* ACTION BUTTONS */}
              <div className={`grid gap-1.5 pt-2 border-t border-slate-100 dark:border-slate-800 w-full min-w-0 overflow-hidden ${slot.isOnline ? "grid-cols-3" : "grid-cols-2"}`}>
                <Button
                  onClick={() => onSelectSlot(slot)}
                  size="sm"
                  variant="outline"
                  className="h-8 text-[11px] px-2 font-semibold rounded-xl border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 w-full min-w-0 overflow-hidden gap-1.5 cursor-pointer"
                >
                  <Eye className="h-3.5 w-3.5 shrink-0 text-purple-600" />
                  <span className="truncate">Details</span>
                </Button>

                {slot.isOnline && (
                  <a
                    href={slot.onlineJoinUrl || "#"}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full min-w-0 overflow-hidden"
                  >
                    <Button
                      size="sm"
                      className="h-8 text-[11px] px-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold gap-1 w-full min-w-0 overflow-hidden cursor-pointer"
                    >
                      <Video className="h-3.5 w-3.5 shrink-0 animate-pulse" />
                      <span className="truncate">Join</span>
                    </Button>
                  </a>
                )}

                <Button
                  onClick={() => {
                    toast.info(`Navigating to ${slot.subjectName} (${slot.subjectCode}) course on LMS...`);
                    navigate({ to: "/student/lms" as any });
                  }}
                  size="sm"
                  className="h-8 text-[11px] px-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold gap-1.5 w-full min-w-0 overflow-hidden cursor-pointer"
                >
                  <span className="truncate">LMS</span> <ExternalLink className="h-3.5 w-3.5 shrink-0" />
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
