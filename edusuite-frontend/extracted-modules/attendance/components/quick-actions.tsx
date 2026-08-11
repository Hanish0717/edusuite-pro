import { CalendarCheck, FileSpreadsheet, BarChart3, Clock, MailOpen, ClipboardList } from "lucide-react";
import { toast } from "sonner";
import { Panel } from "@/components/dashboard/panel";

export function QuickActions() {
  const handleAction = (label: string) => {
    toast.success(`Triggered Quick Action: ${label}`, {
      description: "Opening relevant ERP window.",
    });
  };

  const actions = [
    { label: "Take Attendance", icon: ClipboardList, color: "bg-blue-500/10 text-blue-600 border-blue-500/20" },
    { label: "View Register", icon: CalendarCheck, color: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" },
    { label: "Attendance Analytics", icon: BarChart3, color: "bg-indigo-500/10 text-indigo-600 border-indigo-500/20" },
    { label: "Export Reports", icon: FileSpreadsheet, color: "bg-violet-500/10 text-violet-600 border-violet-500/20" },
    { label: "Student Leave Requests", icon: MailOpen, color: "bg-amber-500/10 text-amber-600 border-amber-500/20" },
    { label: "Attendance History", icon: Clock, color: "bg-teal-500/10 text-teal-600 border-teal-500/20" },
  ];

  return (
    <Panel
      title="Attendance Quick Actions Cockpit"
      description="Quick forms and links to adjust student attendance registers"
      className="border border-border bg-card rounded-2xl p-5 shadow-card text-xs"
    >
      <div className="grid grid-cols-2 gap-3">
        {actions.map((act, idx) => (
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
        ))}
      </div>
    </Panel>
  );
}
