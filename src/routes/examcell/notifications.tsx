import { createFileRoute } from "@tanstack/react-router";
import { Panel } from "@/components/dashboard/panel";
import { Badge } from "@/components/ui/badge";
import { Bell, Info } from "lucide-react";

export const Route = createFileRoute("/examcell/notifications")({
  head: () => ({
    meta: [{ title: "Exam Cell Notifications — EduSuite Pro" }],
  }),
  component: NotificationsPage,
});

function NotificationsPage() {
  const list = [
    { id: "1", text: "Exam schedule for B.Tech CSE Sem 5 has been published.", date: "Today, 10:30 AM", type: "System" },
    { id: "2", text: "Marks correction request submitted by Dr. K. Jyothi is pending approval.", date: "Yesterday", type: "Approval" },
    { id: "3", text: "Notification emails successfully dispatched to 142 students in AIML.", date: "2 days ago", type: "Dispatch" }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-4">
        <div>
          <h2 className="font-display text-2xl font-extrabold tracking-tight">
            Notifications
          </h2>
          <p className="text-sm text-muted-foreground">
            System logs, alerts, and dispatch activities for the Examination portal.
          </p>
        </div>
      </div>

      <Panel title="Recent Notifications Logs" icon={Bell}>
        <div className="space-y-3">
          {list.map(item => (
            <div key={item.id} className="p-4 rounded-xl border border-border bg-card flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full mr-2">
                  {item.type}
                </span>
                <span className="text-xs text-muted-foreground">{item.date}</span>
                <h4 className="font-display text-sm font-bold mt-1">{item.text}</h4>
              </div>
              <Badge variant="secondary" className="text-[10px]">Logged</Badge>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}
