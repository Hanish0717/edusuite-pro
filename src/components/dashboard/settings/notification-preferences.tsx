import { Bell, Mail, Smartphone, BookOpen, ClipboardCheck, FlaskConical, GraduationCap, MessageSquare, UserCheck, Megaphone } from "lucide-react";
import type { NotificationPreferencesState } from "./types";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface NotificationPreferencesProps {
  notifications: NotificationPreferencesState;
  onUpdateNotifications: (updated: Partial<NotificationPreferencesState>) => void;
}

export function NotificationPreferences({
  notifications,
  onUpdateNotifications,
}: NotificationPreferencesProps) {
  const items: { key: keyof NotificationPreferencesState; label: string; icon: any }[] = [
    { key: "assignmentNotifications", label: "Assignment Submissions & Deadlines", icon: BookOpen },
    { key: "attendanceAlerts", label: "Attendance Deficiency Alerts", icon: ClipboardCheck },
    { key: "researchUpdates", label: "Research Publications & Grant Updates", icon: FlaskConical },
    { key: "examNotifications", label: "Examination Schedules & Marks Entry", icon: GraduationCap },
    { key: "studentMessages", label: "Student Direct Messages & Queries", icon: MessageSquare },
    { key: "leaveRequests", label: "Student Leave Requests & Approvals", icon: UserCheck },
    { key: "announcements", label: "Institutional & Department Announcements", icon: Megaphone },
  ];

  return (
    <div className="rounded-2xl border border-border/50 bg-card p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2 pb-4 border-b border-border/40">
        <div className="size-9 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600 dark:text-amber-400">
          <Bell className="size-5" />
        </div>
        <div>
          <h3 className="text-base font-extrabold text-foreground">Notification Preferences</h3>
          <p className="text-xs text-muted-foreground">Control delivery channels and notification triggers for daily faculty workflow.</p>
        </div>
      </div>

      {/* Global Channel Toggles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex items-center justify-between p-4 rounded-xl bg-muted/20 border border-border/40">
          <div className="flex items-center gap-3">
            <div className="size-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-600">
              <Mail className="size-4" />
            </div>
            <div>
              <Label htmlFor="toggle-email" className="text-xs font-bold text-foreground cursor-pointer">Email Notifications</Label>
              <p className="text-[11px] text-muted-foreground">Receive daily digests and priority alerts via email</p>
            </div>
          </div>
          <Switch
            id="toggle-email"
            checked={notifications.emailNotifications}
            onCheckedChange={(val) => onUpdateNotifications({ emailNotifications: val })}
          />
        </div>

        <div className="flex items-center justify-between p-4 rounded-xl bg-muted/20 border border-border/40">
          <div className="flex items-center gap-3">
            <div className="size-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-600">
              <Smartphone className="size-4" />
            </div>
            <div>
              <Label htmlFor="toggle-push" className="text-xs font-bold text-foreground cursor-pointer">Push Notifications</Label>
              <p className="text-[11px] text-muted-foreground">Instant browser and mobile app push alerts</p>
            </div>
          </div>
          <Switch
            id="toggle-push"
            checked={notifications.pushNotifications}
            onCheckedChange={(val) => onUpdateNotifications({ pushNotifications: val })}
          />
        </div>
      </div>

      {/* Event Category Toggles */}
      <div className="space-y-3 pt-2">
        <h4 className="text-xs font-extrabold uppercase text-muted-foreground tracking-wider">Module Event Subscriptions</h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.key} className="flex items-center justify-between p-3 rounded-xl bg-muted/20 border border-border/30">
                <div className="flex items-center gap-2.5">
                  <Icon className="size-4 text-muted-foreground shrink-0" />
                  <span className="text-xs font-semibold text-foreground">{item.label}</span>
                </div>
                <Switch
                  checked={notifications[item.key]}
                  onCheckedChange={(val) => onUpdateNotifications({ [item.key]: val })}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
