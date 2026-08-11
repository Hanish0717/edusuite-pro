import React from "react";
import {
  CalendarCheck,
  Award,
  IndianRupee,
  GraduationCap,
  Library,
  Bus,
  Home,
  User,
  Settings,
  Compass,
} from "lucide-react";

interface ShortcutsProps {
  onNavigate: (route: string) => void;
}

export function Shortcuts({ onNavigate }: ShortcutsProps) {
  const shortcuts = [
    { id: "attendance", label: "Attendance", icon: CalendarCheck, route: "/student/attendance", color: "text-emerald-600 bg-emerald-500/10" },
    { id: "examinations", label: "Examinations", icon: Award, route: "/student/examinations", color: "text-blue-600 bg-blue-500/10" },
    { id: "finance", label: "Finance", icon: IndianRupee, route: "/student/finance", color: "text-emerald-600 bg-emerald-500/10" },
    { id: "lms", label: "LMS", icon: GraduationCap, route: "/student/lms", color: "text-purple-600 bg-purple-500/10" },
    { id: "library", label: "Library", icon: Library, route: "/student/library", color: "text-amber-600 bg-amber-500/10" },
    { id: "transport", label: "Transport", icon: Bus, route: "/student/transport", color: "text-indigo-600 bg-indigo-500/10" },
    { id: "hostel", label: "Hostel", icon: Home, route: "/student/hostel", color: "text-cyan-600 bg-cyan-500/10" },
    { id: "profile", label: "My Profile", icon: User, route: "/student/profile", color: "text-rose-600 bg-rose-500/10" },
    { id: "settings", label: "Settings", icon: Settings, route: "/settings", color: "text-slate-600 bg-slate-500/10" },
  ];

  return (
    <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
          <Compass className="h-3.5 w-3.5 text-blue-600" /> SECTION 20: MODULE SHORTCUTS NAVIGATOR
        </h3>
        <span className="text-[11px] text-slate-400 font-mono">9 Core Modules</span>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-9 gap-2">
        {shortcuts.map((sc) => {
          const IconComp = sc.icon;
          return (
            <button
              key={sc.id}
              onClick={() => onNavigate(sc.route)}
              className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-white dark:hover:bg-slate-800 hover:border-blue-500/30 hover:shadow-xs transition-all flex flex-col items-center justify-center gap-2 group text-center"
            >
              <div className={`p-2 rounded-xl ${sc.color} group-hover:scale-110 transition-transform`}>
                <IconComp className="h-4 w-4" />
              </div>
              <span className="text-[11px] font-bold text-slate-700 dark:text-slate-200 leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400">
                {sc.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
