import { CalendarCheck, FileText, ClipboardList, BookOpen, Edit2, PlusCircle, Printer } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { Panel } from "@/components/dashboard/panel";

interface QuickActionsProps {
  planId: string;
}

export function QuickActions({ planId }: QuickActionsProps) {
  const handleAction = (label: string) => {
    toast.success(`Opening dialog: ${label}`, {
      description: `Targeting lesson plan: ${planId}`,
    });
  };

  const actions = [
    { label: "Edit Lesson Plan", icon: Edit2, color: "bg-blue-500/10 text-blue-600 border-blue-500/20", click: true },
    { label: "Add Weekly Plan", icon: PlusCircle, color: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20", click: true },
    { label: "View Study Materials", icon: FileText, route: "/faculty/materials", color: "bg-violet-500/10 text-violet-600 border-violet-500/20" },
    { label: "Create Assignment", icon: ClipboardList, route: "/faculty/assignments", color: "bg-amber-500/10 text-amber-600 border-amber-500/20" },
    { label: "View Attendance", icon: CalendarCheck, route: "/faculty/timetable", color: "bg-indigo-500/10 text-indigo-600 border-indigo-500/20" },
    { label: "Print Lesson Plan", icon: Printer, color: "bg-teal-500/10 text-teal-600 border-teal-500/20", click: true },
  ];

  return (
    <Panel
      title="Syllabus Management Cockpit"
      description="Quick forms and links to adjust this lesson plan"
      className="border border-border bg-card rounded-2xl p-5 shadow-card text-xs"
    >
      <div className="grid grid-cols-2 gap-3">
        {actions.map((act, idx) => (
          act.click ? (
            <div
              key={idx}
              onClick={() => handleAction(act.label)}
              className="flex flex-col items-center justify-center p-4 rounded-2xl border text-center transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-sm cursor-pointer bg-muted/20 hover:bg-muted/30"
            >
              <span className={`grid size-9 place-items-center rounded-xl border mb-2 ${act.color}`}>
                <act.icon className="size-4.5" />
              </span>
              <span className="font-bold leading-normal truncate w-full text-[0.7rem]">{act.label}</span>
            </div>
          ) : (
            <Link
              key={idx}
              to={act.route || "/faculty/lesson-plan"}
              onClick={() => handleAction(act.label)}
              className="flex flex-col items-center justify-center p-4 rounded-2xl border text-center transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-sm cursor-pointer bg-muted/20 hover:bg-muted/30"
            >
              <span className={`grid size-9 place-items-center rounded-xl border mb-2 ${act.color}`}>
                <act.icon className="size-4.5" />
              </span>
              <span className="font-bold leading-normal truncate w-full text-[0.7rem]">{act.label}</span>
            </Link>
          )
        ))}
      </div>
    </Panel>
  );
}
