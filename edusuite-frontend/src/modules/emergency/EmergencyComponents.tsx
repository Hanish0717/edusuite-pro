import React, { useEffect, useState } from "react";
import {
  Siren,
  AlertTriangle,
  Radio,
  Send,
  BellRing,
  ShieldAlert,
  Users,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Download,
  Search,
  Sparkles,
  MessageSquare,
  Smartphone,
  Mail,
  Volume2,
  Lock,
  CloudRain,
  Flame,
  FileText,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

import {
  fetchEmergencyAlerts,
  sendEmergencyAlertBroadcast,
  INITIAL_EMERGENCY_ALERTS,
  PRESET_TEMPLATES,
  type EmergencyAlertBroadcast,
  type EmergencyPresetTemplate,
} from "./EmergencyService";

export function EmergencyModuleView() {
  const [alerts, setAlerts] = useState<EmergencyAlertBroadcast[]>(INITIAL_EMERGENCY_ALERTS);
  const [loading, setLoading] = useState(false);

  // Form State
  const [title, setTitle] = useState("");
  const [severity, setSeverity] = useState<EmergencyAlertBroadcast["severity"]>("WEATHER / CAMPUS CLOSURE");
  const [targetAudience, setTargetAudience] = useState<EmergencyAlertBroadcast["targetAudience"]>("All Students & Faculty");
  const [messageBody, setMessageBody] = useState("");
  const [channels, setChannels] = useState<string[]>(["SMS Blast", "Instant App Push", "Digital Siren"]);
  const [submitting, setSubmitting] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  const loadAlerts = async () => {
    setLoading(true);
    const data = await fetchEmergencyAlerts();
    setAlerts(data);
    setLoading(false);
  };

  useEffect(() => {
    loadAlerts();
  }, []);

  const handleSelectPreset = (template: EmergencyPresetTemplate) => {
    setTitle(template.title);
    setSeverity(template.severity);
    setTargetAudience(template.defaultTarget);
    setMessageBody(template.templateText);
    toast.info(`Loaded preset template: ${template.title}`);
  };

  const handleChannelToggle = (channelName: string) => {
    setChannels((prev) =>
      prev.includes(channelName) ? prev.filter((c) => c !== channelName) : [...prev, channelName]
    );
  };

  const handleDispatchAlert = async () => {
    if (!title || !messageBody) {
      toast.error("Please provide both an Alert Title and Message Body.");
      return;
    }
    setSubmitting(true);
    const result = await sendEmergencyAlertBroadcast({
      title,
      severity,
      targetAudience,
      messageBody,
      channels,
    });
    setAlerts((prev) => [result, ...prev]);
    setSubmitting(false);
    setIsConfirmModalOpen(false);
    setTitle("");
    setMessageBody("");
    toast.success(`🚨 EMERGENCY BROADCAST DISPATCHED SUCCESSFULLY! (${result.deliveredCount} recipients notified)`);
  };

  const handleExportCSV = () => {
    const headers = ["Alert Code", "Title", "Severity", "Target Audience", "Channels", "Sender", "Delivered", "Failed", "Timestamp"];
    const rows = alerts.map((a) => [a.alertCode, `"${a.title}"`, a.severity, `"${a.targetAudience}"`, `"${a.channels.join("; ")}"`, `"${a.senderName}"`, a.deliveredCount, a.failedCount, a.timestamp]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Emergency_Broadcast_Logs_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`Exported ${alerts.length} emergency logs to CSV!`);
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-600 border border-rose-500/20 shrink-0">
            <Siren className="size-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-bold font-display tracking-tight text-foreground">
                Emergency Instant Notification & Campus Broadcast System
              </h1>
              <Badge className="bg-rose-600 text-white font-mono text-xs shadow-glow">
                🚨 Command Center Mode
              </Badge>
            </div>
            <p className="text-xs md:text-sm text-muted-foreground mt-0.5">
              Send instant SMS, Push Notifications, & Siren Overlays to all Faculty and Students for campus emergencies.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 self-start sm:self-auto">
          <Button variant="outline" size="sm" onClick={loadAlerts} disabled={loading} className="h-9 gap-2 text-xs font-medium">
            <RefreshCw className={`size-3.5 ${loading ? "animate-spin" : ""}`} /> Refresh
          </Button>
          <Button variant="outline" size="sm" onClick={handleExportCSV} className="h-9 gap-2 text-xs font-medium">
            <Download className="size-3.5" /> Export Logs
          </Button>
        </div>
      </div>

      {/* QUICK PRESET TEMPLATE LOADER */}
      <div className="p-4 rounded-2xl border border-border/80 bg-card space-y-3 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="size-3.5 text-amber-500" /> Quick Pre-set Emergency Templates
          </h2>
          <span className="text-[0.68rem] text-muted-foreground">Click template to populate dispatch form</span>
        </div>

        <div className="grid md:grid-cols-3 gap-3">
          {PRESET_TEMPLATES.map((tmpl) => (
            <button
              key={tmpl.id}
              onClick={() => handleSelectPreset(tmpl)}
              className="p-3 rounded-xl border border-border/70 bg-muted/20 hover:bg-muted/50 hover:border-primary/40 text-left transition-all space-y-1.5 group"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-foreground group-hover:text-primary">{tmpl.title}</span>
                <Badge variant="outline" className="text-[0.65rem] font-mono">{tmpl.severity.split(" ")[0]}</Badge>
              </div>
              <p className="text-[0.72rem] text-muted-foreground line-clamp-2">{tmpl.templateText}</p>
            </button>
          ))}
        </div>
      </div>

      {/* DISPATCH EMERGENCY BROADCAST FORM */}
      <div className="rounded-2xl border border-rose-500/30 bg-card p-5 md:p-6 space-y-5 shadow-sm">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <h2 className="text-base font-bold text-foreground flex items-center gap-2">
            <Radio className="size-5 text-rose-600 animate-pulse" /> Dispatch New Campus Emergency Broadcast
          </h2>
          <Badge className="bg-rose-500/10 text-rose-600 border-rose-300 font-mono text-xs">
            LIVE BROADCAST READY
          </Badge>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Alert Title / Headline *</Label>
            <Input
              placeholder="e.g. Heavy Rainfall Alert — Immediate Campus Suspension"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="h-10 text-xs rounded-xl"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Alert Severity Level *</Label>
            <Select value={severity} onValueChange={(val: any) => setSeverity(val)}>
              <SelectTrigger className="h-10 text-xs rounded-xl"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="CRITICAL EMERGENCY" className="text-xs font-bold text-rose-600">🚨 CRITICAL EMERGENCY</SelectItem>
                <SelectItem value="WEATHER / CAMPUS CLOSURE" className="text-xs font-bold text-amber-600">⚠️ WEATHER / CAMPUS CLOSURE</SelectItem>
                <SelectItem value="SECURITY LOCKDOWN" className="text-xs font-bold text-purple-600">🔒 SECURITY LOCKDOWN</SelectItem>
                <SelectItem value="URGENT ACADEMIC NOTICE" className="text-xs font-bold text-blue-600">📢 URGENT ACADEMIC NOTICE</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Target Audience *</Label>
            <Select value={targetAudience} onValueChange={(val: any) => setTargetAudience(val)}>
              <SelectTrigger className="h-10 text-xs rounded-xl"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="All Students & Faculty" className="text-xs font-semibold">👥 All Students & Faculty (Entire Campus)</SelectItem>
                <SelectItem value="All Students Only" className="text-xs font-semibold">🎓 All Enrolled Students Only</SelectItem>
                <SelectItem value="All Faculty & Staff Only" className="text-xs font-semibold">👨‍🏫 All Faculty & Staff Members Only</SelectItem>
                <SelectItem value="Campus Security & Response Team" className="text-xs font-semibold">🛡️ Campus Security & Response Cell</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Broadcast Channels</Label>
            <div className="flex flex-wrap items-center gap-3 pt-1">
              {["SMS Blast", "Instant App Push", "Digital Siren", "Priority Email"].map((ch) => (
                <label key={ch} className="flex items-center gap-1.5 text-xs font-semibold cursor-pointer">
                  <Checkbox checked={channels.includes(ch)} onCheckedChange={() => handleChannelToggle(ch)} />
                  <span>{ch}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label className="text-xs font-semibold">Emergency Broadcast Message Body *</Label>
            <span className="text-[0.68rem] text-muted-foreground font-mono">{messageBody.length} / 500 chars</span>
          </div>
          <Textarea
            rows={4}
            placeholder="Write clear, concise instructions for students and faculty regarding the emergency..."
            value={messageBody}
            onChange={(e) => setMessageBody(e.target.value)}
            className="text-xs rounded-xl min-h-[100px]"
          />
        </div>

        <div className="flex justify-end border-t border-border pt-4">
          <Button
            size="lg"
            onClick={() => setIsConfirmModalOpen(true)}
            disabled={!title || !messageBody}
            className="bg-rose-600 hover:bg-rose-700 text-white gap-2 text-xs font-bold h-11 px-6 rounded-xl shadow-glow"
          >
            <Send className="size-4" /> DISPATCH EMERGENCY BROADCAST NOW
          </Button>
        </div>
      </div>

      {/* EMERGENCY BROADCAST LOGS TABLE */}
      <div className="rounded-2xl border border-border/80 bg-card p-5 space-y-4 shadow-sm">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <h2 className="text-base font-bold text-foreground flex items-center gap-2">
            <BellRing className="size-4 text-primary" /> Emergency Broadcast History & Delivery Logs
          </h2>
          <span className="text-xs font-mono text-muted-foreground">{alerts.length} Broadcast Records</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted/40 border-b border-border text-muted-foreground font-semibold uppercase tracking-wider text-[0.68rem]">
              <tr>
                <th className="py-3 px-3">Alert Code</th>
                <th className="py-3 px-3">Headline Title</th>
                <th className="py-3 px-3">Severity Level</th>
                <th className="py-3 px-3">Target Recipients</th>
                <th className="py-3 px-3">Channels Used</th>
                <th className="py-3 px-3">Delivered / Failed</th>
                <th className="py-3 px-3">Broadcast Timestamp</th>
                <th className="py-3 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {alerts.map((a) => (
                <tr key={a.id} className="hover:bg-muted/20 transition-colors">
                  <td className="py-3 px-3 font-mono font-bold text-foreground">{a.alertCode}</td>
                  <td className="py-3 px-3 font-bold text-foreground">{a.title}</td>
                  <td className="py-3 px-3">
                    {a.severity === "CRITICAL EMERGENCY" && <Badge className="bg-rose-600 text-white font-bold text-[0.65rem]">🚨 CRITICAL</Badge>}
                    {a.severity === "WEATHER / CAMPUS CLOSURE" && <Badge className="bg-amber-500/10 text-amber-600 font-bold text-[0.65rem]">⚠️ WEATHER</Badge>}
                    {a.severity === "SECURITY LOCKDOWN" && <Badge className="bg-purple-500/10 text-purple-600 font-bold text-[0.65rem]">🔒 LOCKDOWN</Badge>}
                    {a.severity === "URGENT ACADEMIC NOTICE" && <Badge className="bg-blue-500/10 text-blue-600 font-bold text-[0.65rem]">📢 ACADEMIC</Badge>}
                  </td>
                  <td className="py-3 px-3 font-semibold">{a.targetAudience}</td>
                  <td className="py-3 px-3 text-muted-foreground font-mono text-[0.7rem]">{a.channels.join(", ")}</td>
                  <td className="py-3 px-3 font-mono">
                    <span className="text-emerald-600 font-bold">{a.deliveredCount}</span> / <span className="text-rose-600">{a.failedCount}</span>
                  </td>
                  <td className="py-3 px-3 font-mono text-muted-foreground">{a.timestamp}</td>
                  <td className="py-3 px-3">
                    <Badge className="bg-emerald-500/10 text-emerald-600 font-bold">✅ {a.status}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CONFIRM DISPATCH MODAL */}
      <Dialog open={isConfirmModalOpen} onOpenChange={setIsConfirmModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-rose-600 flex items-center gap-2">
              <Siren className="size-5" /> Confirm Emergency Broadcast Dispatch
            </DialogTitle>
            <DialogDescription className="text-xs">
              Are you sure you want to broadcast this emergency alert instantly across SMS, Mobile App Push, and Campus sirens?
            </DialogDescription>
          </DialogHeader>

          <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 text-xs space-y-1 text-rose-900 dark:text-rose-200">
            <p><strong className="font-bold">Title:</strong> {title}</p>
            <p><strong className="font-bold">Target:</strong> {targetAudience}</p>
            <p><strong className="font-bold">Message:</strong> {messageBody}</p>
          </div>

          <DialogFooter className="pt-2">
            <Button variant="outline" onClick={() => setIsConfirmModalOpen(false)} className="text-xs">Cancel</Button>
            <Button
              onClick={handleDispatchAlert}
              disabled={submitting}
              className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs"
            >
              {submitting ? <RefreshCw className="size-3.5 animate-spin mr-1" /> : null} Confirm & Send Alert Now
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
