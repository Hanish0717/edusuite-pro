import React from "react";
import { NotificationItem, ExamScheduleItem } from "./types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Download, 
  Printer, 
  BookOpen, 
  CheckCircle2, 
  Users, 
  Award, 
  Bell, 
  Calendar, 
  FileText, 
  ExternalLink,
  ChevronRight
} from "lucide-react";
import { toast } from "sonner";

interface QuickActionsProps {
  notifications: NotificationItem[];
  upcomingExams: ExamScheduleItem[];
  onNavigateToTab?: (tab: string) => void;
  onNavigateToRoute?: (route: string) => void;
}

export function QuickActionsSidebar({
  notifications,
  upcomingExams,
  onNavigateToTab,
  onNavigateToRoute,
}: QuickActionsProps) {
  const handleDownloadPdf = () => {
    toast.success("Downloading Official Timetable PDF...");
  };

  const handlePrint = () => {
    toast.info("Preparing printer preview for Timetable...");
    window.print();
  };

  return (
    <div className="space-y-4">
      {/* QUICK ACTIONS CARD */}
      <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs space-y-3">
        <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
          <BookOpen className="h-4 w-4 text-purple-600" /> Quick Actions
        </h4>

        <div className="grid grid-cols-2 gap-2">
          <Button
            onClick={handleDownloadPdf}
            size="sm"
            variant="outline"
            className="h-8 text-[11px] rounded-xl border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 gap-1.5 justify-start px-2 font-semibold"
          >
            <Download className="h-3.5 w-3.5 text-blue-600 shrink-0" />
            <span className="truncate">Download PDF</span>
          </Button>

          <Button
            onClick={handlePrint}
            size="sm"
            variant="outline"
            className="h-8 text-[11px] rounded-xl border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 gap-1.5 justify-start px-2 font-semibold"
          >
            <Printer className="h-3.5 w-3.5 text-slate-600 shrink-0" />
            <span className="truncate">Print Timetable</span>
          </Button>

          <Button
            onClick={() => {
              if (onNavigateToRoute) onNavigateToRoute("/student/lms");
              else toast.info("Opening LMS Module...");
            }}
            size="sm"
            variant="outline"
            className="h-8 text-[11px] rounded-xl border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 gap-1.5 justify-start px-2 font-semibold"
          >
            <BookOpen className="h-3.5 w-3.5 text-purple-600 shrink-0" />
            <span className="truncate">Open LMS</span>
          </Button>

          <Button
            onClick={() => {
              if (onNavigateToRoute) onNavigateToRoute("/student/attendance");
              else toast.info("Opening Attendance Module...");
            }}
            size="sm"
            variant="outline"
            className="h-8 text-[11px] rounded-xl border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 gap-1.5 justify-start px-2 font-semibold"
          >
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
            <span className="truncate">Attendance</span>
          </Button>

          <Button
            onClick={() => {
              if (onNavigateToTab) onNavigateToTab("Faculty Schedule");
            }}
            size="sm"
            variant="outline"
            className="h-8 text-[11px] rounded-xl border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 gap-1.5 justify-start px-2 font-semibold"
          >
            <Users className="h-3.5 w-3.5 text-amber-500 shrink-0" />
            <span className="truncate">Faculty Directory</span>
          </Button>

          <Button
            onClick={() => {
              if (onNavigateToTab) onNavigateToTab("Exam Timetable");
            }}
            size="sm"
            variant="outline"
            className="h-8 text-[11px] rounded-xl border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 gap-1.5 justify-start px-2 font-semibold"
          >
            <Award className="h-3.5 w-3.5 text-rose-500 shrink-0" />
            <span className="truncate">Exam Schedule</span>
          </Button>
        </div>
      </div>

      {/* TODAY'S NOTIFICATIONS */}
      <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
            <Bell className="h-4 w-4 text-amber-500 animate-bounce" /> Today's Alerts
          </h4>
          <span className="text-[10px] font-mono text-purple-600 font-bold">Real-time</span>
        </div>

        <div className="space-y-2">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-1 text-xs"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 dark:text-white text-[11px] leading-tight">
                  {notif.title}
                </span>
                <span className="text-[9px] font-mono text-slate-400 shrink-0">{notif.time}</span>
              </div>
              <p className="text-[10px] text-slate-500 leading-snug">{notif.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* UPCOMING EXAMS WIDGET */}
      <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
            <Award className="h-4 w-4 text-rose-500" /> Next Examination
          </h4>
          <button
            onClick={() => onNavigateToTab && onNavigateToTab("Exam Timetable")}
            className="text-[10px] font-mono text-purple-600 hover:underline flex items-center gap-0.5"
          >
            View All <ChevronRight className="h-3 w-3" />
          </button>
        </div>

        {upcomingExams[0] && (
          <div className="p-3 rounded-xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 space-y-1.5 text-xs">
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="font-mono font-bold text-rose-600 border-rose-300 text-[10px]">
                {upcomingExams[0].subjectCode}
              </Badge>
              <span className="text-[10px] font-mono text-slate-500">{upcomingExams[0].date}</span>
            </div>
            <h5 className="font-extrabold text-slate-900 dark:text-white text-xs">
              {upcomingExams[0].subjectName}
            </h5>
            <p className="text-[10px] text-slate-500 font-mono">
              Venue: {upcomingExams[0].venue} • Seat #{upcomingExams[0].seatNumber}
            </p>
          </div>
        )}
      </div>

      {/* UPCOMING HOLIDAYS */}
      <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs space-y-2">
        <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
          <Calendar className="h-4 w-4 text-emerald-600" /> Upcoming Holiday
        </h4>
        <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/40 text-xs space-y-0.5">
          <strong className="text-emerald-700 dark:text-emerald-300 font-bold block text-xs">
            August 15, 2026 • Independence Day
          </strong>
          <p className="text-[10px] text-slate-500">Official Institution Holiday. All classes suspended.</p>
        </div>
      </div>
    </div>
  );
}
