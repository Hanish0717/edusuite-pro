import { MessageSquare, Mail, Phone, Bell } from "lucide-react";
import { toast } from "sonner";
import { Panel } from "@/components/dashboard/panel";
import { Button } from "@/components/ui/button";

interface CommunicationPanelProps {
  studentEmail: string;
  parentMobile: string;
}

export function CommunicationPanel({ studentEmail, parentMobile }: CommunicationPanelProps) {
  const handleAction = (type: string, target: string) => {
    toast.success(`Communication Dispatched: ${type}`, {
      description: `Sent to: ${target}`,
    });
  };

  const commActions = [
    { label: "Send Message", icon: MessageSquare, target: "Student ERP Roster", color: "bg-blue-500/10 text-blue-600 border-blue-500/20" },
    { label: "Send Announcement", icon: Bell, target: "Student Noticeboard", color: "bg-violet-500/10 text-violet-600 border-violet-500/20" },
    { label: "Email Student", icon: Mail, target: studentEmail, color: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" },
    { label: "Contact Parent", icon: Phone, target: parentMobile, color: "bg-amber-500/10 text-amber-600 border-amber-500/20" },
  ];

  return (
    <Panel
      title="Communication Panel"
      description="Quick channels to get in touch with the student or their parents"
      className="border border-border bg-card rounded-2xl p-5 shadow-card text-xs"
    >
      <div className="grid grid-cols-2 gap-3">
        {commActions.map((act, idx) => (
          <div
            key={idx}
            onClick={() => handleAction(act.label, act.target)}
            className="flex flex-col items-center justify-center p-3.5 rounded-2xl border text-center transition-all duration-300 cursor-pointer bg-muted/20 hover:bg-muted/40"
          >
            <span className={`grid size-8 place-items-center rounded-lg border mb-2 ${act.color}`}>
              <act.icon className="size-4" />
            </span>
            <span className="font-bold leading-normal truncate w-full text-[0.68rem]">{act.label}</span>
          </div>
        ))}
      </div>
    </Panel>
  );
}
