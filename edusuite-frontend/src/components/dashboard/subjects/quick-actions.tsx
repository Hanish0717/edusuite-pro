import { CalendarCheck, FileText, ClipboardList, BookOpen, GraduationCap, Users } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { Panel } from "@/components/dashboard/panel";

interface QuickActionsProps {
  subjectId: string;
}

export function QuickActions({ subjectId }: QuickActionsProps) {
  const handleAction = (label: string) => {
    toast.success(`Redirecting to ${label} page...`, {
      description: `Targeting context subject configuration: ${subjectId}`,
    });
  };

  const actions = [
    { label: "View Attendance", icon: CalendarCheck, route: "/faculty/timetable", color: "bg-blue-500/10 text-blue-600 border-blue-500/20" },
    { label: "Upload Study Materials", icon: FileText, route: "/faculty/materials", color: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" },
    { label: "Create Assignment", icon: ClipboardList, route: "/faculty/assignments", color: "bg-violet-500/10 text-violet-600 border-violet-500/20" },
    { label: "Create Quiz / Quiz list", icon: GraduationCap, route: "/faculty/assessments", color: "bg-amber-500/10 text-amber-600 border-amber-500/20" },
    { label: "View Lesson Plan", icon: BookOpen, route: "/faculty/subjects", color: "bg-indigo-500/10 text-indigo-600 border-indigo-500/20" },
    { label: "View Enrolled Students", icon: Users, route: "/faculty/students", color: "bg-teal-500/10 text-teal-600 border-teal-500/20" },
  ];

  return (
    <Panel
      title="Quick Syllabus Actions Cockpit"
      description="Quick links to launch operational forms for this course"
      className="border border-border bg-card rounded-2xl p-5 shadow-card text-xs"
    >
      <div className="grid grid-cols-2 gap-3">
        {actions.map((act, idx) => (
          <Link
            key={idx}
            to={act.route}
            onClick={() => handleAction(act.label)}
            className="flex flex-col items-center justify-center p-4 rounded-2xl border text-center transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-sm cursor-pointer bg-muted/20"
          >
            <span className={`grid size-9 place-items-center rounded-xl border mb-2 ${act.color}`}>
              <act.icon className="size-4.5" />
            </span>
            <span className="font-bold leading-normal truncate w-full text-[0.7rem]">{act.label}</span>
          </Link>
        ))}
      </div>
    </Panel>
  );
}
