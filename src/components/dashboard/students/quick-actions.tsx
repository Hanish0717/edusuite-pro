import { CalendarCheck, FileSpreadsheet, Edit2, MessageSquare, ClipboardList } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { Panel } from "@/components/dashboard/panel";

interface QuickActionsProps {
  studentId: string;
}

export function QuickActions({ studentId }: QuickActionsProps) {
  const handleAction = (label: string) => {
    toast.success(`Opening shortcut: ${label}`, {
      description: `Targeting student: ${studentId}`,
    });
  };

  const actions = [
    { label: "View Attendance", icon: CalendarCheck, route: "/faculty/timetable", color: "bg-blue-500/10 text-blue-600 border-blue-500/20" },
    { label: "View Marks", icon: FileSpreadsheet, route: "/faculty/examinations", color: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" },
    { label: "Submit Feedback", icon: Edit2, color: "bg-violet-500/10 text-violet-600 border-violet-500/20", click: true },
    { label: "Start Counselling", icon: MessageSquare, color: "bg-amber-500/10 text-amber-600 border-amber-500/20", click: true },
  ];

  return (
    <Panel
      title="Student Management Cockpit"
      description="Quick actions and redirections to student records"
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
              to={act.route || "/faculty/students"}
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
