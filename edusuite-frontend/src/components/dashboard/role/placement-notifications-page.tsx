import { useState } from "react";
import {
  BellRing,
  Send,
  Search,
  CheckCircle2,
  Clock,
  Radio,
  Volume2,
  Users,
  Building,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";

import { Panel } from "@/components/dashboard/panel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

export interface BroadcastNotificationItem {
  id: string;
  title: string;
  targetAudience: string;
  channel: "Email & App Push" | "SMS & WhatsApp" | "Proctor Broadcast";
  sentTime: string;
  deliveredCount: number;
  status: "Delivered" | "Queued";
}

const NOTIFICATIONS_LOGS: BroadcastNotificationItem[] = [
  {
    id: "NOTIF-101",
    title: "Google Cloud Assessment Instructions & Lab Room Allocation",
    targetAudience: "320 Eligible CSE/ECE Candidates",
    channel: "Email & App Push",
    sentTime: "2026-08-01 09:30 AM IST",
    deliveredCount: 320,
    status: "Delivered",
  },
  {
    id: "NOTIF-102",
    title: "Urgent: Interview Schedule Update for Panel B",
    targetAudience: "68 Shortlisted Candidates",
    channel: "SMS & WhatsApp",
    sentTime: "2026-08-01 10:15 AM IST",
    deliveredCount: 68,
    status: "Delivered",
  },
];

export function PlacementNotificationsWorkspace() {
  const [logs, setLogs] = useState<BroadcastNotificationItem[]>(NOTIFICATIONS_LOGS);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDispatchModalOpen, setIsDispatchModalOpen] = useState(false);
  const [broadcastTitle, setBroadcastTitle] = useState("");
  const [broadcastMessage, setBroadcastMessage] = useState("");
  const [targetAudience, setTargetAudience] = useState("All Eligible Students");

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    const newLog: BroadcastNotificationItem = {
      id: `NOTIF-${Date.now().toString().slice(-3)}`,
      title: broadcastTitle || "Institutional Placement Broadcast",
      targetAudience,
      channel: "Email & App Push",
      sentTime: "Just now",
      deliveredCount: 320,
      status: "Delivered",
    };
    setLogs([newLog, ...logs]);
    setIsDispatchModalOpen(false);
    toast.success(`Dispatched broadcast message to ${targetAudience}`);
  };

  return (
    <div className="space-y-6 animate-fade-up">
      {/* HEADER BANNER */}
      <div className="relative overflow-hidden rounded-3xl border border-border/80 bg-card p-6 shadow-sm sm:p-8 backdrop-blur-xl">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between relative z-10">
          <div className="flex items-start gap-4">
            <div className="size-16 rounded-2xl bg-brand-gradient text-white grid place-items-center font-extrabold text-2xl shadow-glow shrink-0">
              <BellRing className="size-8" />
            </div>
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <Badge className="bg-blue-600 text-white font-mono text-[0.7rem]">
                  Institutional Broadcast Dispatcher
                </Badge>
                <Badge variant="outline" className="font-mono text-[0.7rem]">
                  Real-time Multi-Channel Alerts
                </Badge>
              </div>
              <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight">
                Placement Broadcast & Emergency Dispatcher
              </h1>
              <p className="text-xs text-muted-foreground font-mono">
                Dispatch email, SMS, mobile app push, and WhatsApp announcements to students, recruiters, and panel members.
              </p>
            </div>
          </div>

          <Button
            onClick={() => setIsDispatchModalOpen(true)}
            className="bg-brand-gradient shadow-glow font-bold text-xs rounded-xl h-10 px-4 cursor-pointer gap-1.5"
          >
            <Volume2 className="size-4" /> Send Broadcast Announcement
          </Button>
        </div>
      </div>

      {/* SEARCH BAR */}
      <div className="rounded-2xl border border-border/80 bg-card p-4 shadow-xs">
        <div className="relative flex-1 w-full">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search notification logs by title or target audience..."
            className="h-10 border-input bg-background/60 pl-9 text-xs focus-visible:ring-primary rounded-xl"
          />
        </div>
      </div>

      {/* NOTIFICATIONS LOG TABLE */}
      <Panel title="Broadcast Dispatch Logs & Audit Trail">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border bg-muted/30 text-muted-foreground font-mono uppercase text-[0.65rem]">
                <th className="p-3">Announcement Title</th>
                <th className="p-3">Target Audience</th>
                <th className="p-3">Dispatch Channel</th>
                <th className="p-3">Sent Timestamp</th>
                <th className="p-3 text-center">Delivered Recipients</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50 font-medium">
              {logs.map((l) => (
                <tr key={l.id} className="hover:bg-muted/30 transition-colors">
                  <td className="p-3 font-bold text-foreground">{l.title}</td>
                  <td className="p-3 font-mono font-bold text-primary">{l.targetAudience}</td>
                  <td className="p-3 font-mono text-purple-600">{l.channel}</td>
                  <td className="p-3 font-mono">{l.sentTime}</td>
                  <td className="p-3 text-center font-mono font-extrabold text-emerald-600">{l.deliveredCount}</td>
                  <td className="p-3">
                    <Badge className="bg-emerald-500/10 text-emerald-600">{l.status}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      {/* DISPATCH BROADCAST MODAL */}
      <Dialog open={isDispatchModalOpen} onOpenChange={setIsDispatchModalOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle>Send Broadcast Announcement</DialogTitle>
            <DialogDescription>Multi-channel emergency broadcast to students, recruiters, or department heads.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSendBroadcast} className="space-y-3 pt-2 text-xs">
            <div className="space-y-1">
              <label className="font-semibold">Target Audience</label>
              <select value={targetAudience} onChange={(e) => setTargetAudience(e.target.value)} className="w-full h-9 rounded-xl border border-input bg-card px-2.5 text-xs font-semibold">
                <option value="All Eligible Students">All Eligible Students (1,080 Candidates)</option>
                <option value="Shortlisted Candidates">Shortlisted Candidates (84 Candidates)</option>
                <option value="Corporate Recruiters">Corporate Recruiters (14 Companies)</option>
                <option value="Department Placement Coordinators">Department Placement Coordinators</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-semibold">Broadcast Title</label>
              <Input value={broadcastTitle} onChange={(e) => setBroadcastTitle(e.target.value)} placeholder="e.g. Assessment Schedule Released" required className="h-9 text-xs rounded-xl" />
            </div>

            <div className="space-y-1">
              <label className="font-semibold">Announcement Message</label>
              <textarea value={broadcastMessage} onChange={(e) => setBroadcastMessage(e.target.value)} rows={3} required className="w-full rounded-xl border border-input bg-card p-3 text-xs focus-visible:ring-primary" placeholder="Enter broadcast message text..." />
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setIsDispatchModalOpen(false)} className="rounded-xl">Cancel</Button>
              <Button type="submit" className="bg-brand-gradient shadow-glow font-bold rounded-xl cursor-pointer">
                Dispatch Broadcast
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
