import { GraduationCap, BookOpen, Calendar, Layers, LayoutGrid, CheckSquare } from "lucide-react";
import type { TeachingPreferencesState } from "./types";

interface TeachingPreferencesProps {
  teaching: TeachingPreferencesState;
  onUpdateTeaching: (updated: Partial<TeachingPreferencesState>) => void;
}

export function TeachingPreferences({
  teaching,
  onUpdateTeaching,
}: TeachingPreferencesProps) {
  return (
    <div className="rounded-2xl border border-border/50 bg-card p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2 pb-4 border-b border-border/40">
        <div className="size-9 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400">
          <GraduationCap className="size-5" />
        </div>
        <div>
          <h3 className="text-base font-extrabold text-foreground">Teaching & Academic Preferences</h3>
          <p className="text-xs text-muted-foreground">Configure default section selections, course views, and academic defaults.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Default Semester */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-wide flex items-center gap-1.5">
            <Calendar className="size-3.5" /> Default Semester
          </label>
          <select
            className="w-full h-8 text-xs font-bold rounded-xl border border-border/50 bg-muted/30 text-foreground px-3 cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary"
            value={teaching.defaultSemester}
            onChange={(e) => onUpdateTeaching({ defaultSemester: e.target.value })}
          >
            <option value="Semester 6 (AY 2025-26)">Semester 6 (AY 2025-26)</option>
            <option value="Semester 5 (AY 2025-26)">Semester 5 (AY 2025-26)</option>
            <option value="Semester 4 (AY 2024-25)">Semester 4 (AY 2024-25)</option>
          </select>
        </div>

        {/* Default Department */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-wide flex items-center gap-1.5">
            <BookOpen className="size-3.5" /> Default Department
          </label>
          <select
            className="w-full h-8 text-xs font-bold rounded-xl border border-border/50 bg-muted/30 text-foreground px-3 cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary"
            value={teaching.defaultDepartment}
            onChange={(e) => onUpdateTeaching({ defaultDepartment: e.target.value })}
          >
            <option value="Computer Science and Engineering">Computer Science & Engineering</option>
            <option value="Information Technology">Information Technology</option>
            <option value="Artificial Intelligence">Artificial Intelligence & ML</option>
          </select>
        </div>

        {/* Default Section */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-wide flex items-center gap-1.5">
            <Layers className="size-3.5" /> Default Section
          </label>
          <select
            className="w-full h-8 text-xs font-bold rounded-xl border border-border/50 bg-muted/30 text-foreground px-3 cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary"
            value={teaching.defaultSection}
            onChange={(e) => onUpdateTeaching({ defaultSection: e.target.value })}
          >
            <option value="CSE-A">CSE-A</option>
            <option value="CSE-B">CSE-B</option>
            <option value="CSE-C">CSE-C</option>
          </select>
        </div>

        {/* Preferred Attendance View */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-wide flex items-center gap-1.5">
            <CheckSquare className="size-3.5" /> Preferred Attendance View
          </label>
          <select
            className="w-full h-8 text-xs font-bold rounded-xl border border-border/50 bg-muted/30 text-foreground px-3 cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary"
            value={teaching.preferredAttendanceView}
            onChange={(e) => onUpdateTeaching({ preferredAttendanceView: e.target.value as any })}
          >
            <option value="grid">Student Grid View</option>
            <option value="list">Detailed Table View</option>
            <option value="quick">Quick Mark Bulk Mode</option>
          </select>
        </div>

        {/* Default Timetable View */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-wide flex items-center gap-1.5">
            <LayoutGrid className="size-3.5" /> Default Timetable View
          </label>
          <select
            className="w-full h-8 text-xs font-bold rounded-xl border border-border/50 bg-muted/30 text-foreground px-3 cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary"
            value={teaching.defaultTimetableView}
            onChange={(e) => onUpdateTeaching({ defaultTimetableView: e.target.value as any })}
          >
            <option value="weekly">Weekly Matrix</option>
            <option value="daily">Daily Schedule</option>
            <option value="calendar">Monthly Calendar</option>
          </select>
        </div>

        {/* Default Lesson Plan View */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-wide flex items-center gap-1.5">
            <BookOpen className="size-3.5" /> Default Lesson Plan View
          </label>
          <select
            className="w-full h-8 text-xs font-bold rounded-xl border border-border/50 bg-muted/30 text-foreground px-3 cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary"
            value={teaching.defaultLessonPlanView}
            onChange={(e) => onUpdateTeaching({ defaultLessonPlanView: e.target.value as any })}
          >
            <option value="module">Module-Wise Grouping</option>
            <option value="timeline">Chronological Timeline</option>
          </select>
        </div>
      </div>
    </div>
  );
}
