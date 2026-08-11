import { useState } from "react";
import { Bell, Mail, Smartphone, Save } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import type { NotificationSettingsState, NotificationCategory } from "./types";

interface NotificationSettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  settings: NotificationSettingsState;
  onSaveSettings: (newSettings: NotificationSettingsState) => void;
}

export function NotificationSettingsModal({
  open,
  onOpenChange,
  settings: initialSettings,
  onSaveSettings,
}: NotificationSettingsModalProps) {
  const [localSettings, setLocalSettings] = useState<NotificationSettingsState>(initialSettings);

  const categoriesList: NotificationCategory[] = [
    "Assignments",
    "Attendance",
    "Examinations",
    "Leave",
    "Research",
    "Students",
    "System",
    "Announcements",
    "Timetable",
  ];

  const handleSave = () => {
    onSaveSettings(localSettings);
    toast.success("Notification preferences saved successfully.");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-2xl p-6 space-y-4">
        <DialogHeader>
          <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-1">
            <Bell className="size-5" />
          </div>
          <DialogTitle className="text-lg font-bold">Notification Preferences</DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Customize how and when you receive faculty alerts and updates.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          {/* General Delivery Channels */}
          <div className="space-y-3 p-3 rounded-xl bg-muted/40 border border-border/40">
            <h4 className="text-xs font-bold text-foreground uppercase tracking-wide">Delivery Channels</h4>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Mail className="size-4 text-muted-foreground" />
                <Label htmlFor="email-alerts" className="text-xs font-medium cursor-pointer">
                  Email Digests & Instant Alerts
                </Label>
              </div>
              <Switch
                id="email-alerts"
                checked={localSettings.emailAlerts}
                onCheckedChange={(val) => setLocalSettings((prev) => ({ ...prev, emailAlerts: val }))}
              />
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-border/30">
              <div className="flex items-center gap-2">
                <Smartphone className="size-4 text-muted-foreground" />
                <Label htmlFor="push-alerts" className="text-xs font-medium cursor-pointer">
                  Browser & Mobile Push Notifications
                </Label>
              </div>
              <Switch
                id="push-alerts"
                checked={localSettings.pushNotifications}
                onCheckedChange={(val) => setLocalSettings((prev) => ({ ...prev, pushNotifications: val }))}
              />
            </div>
          </div>

          {/* Category-level toggles */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-foreground uppercase tracking-wide">Category Subscriptions</h4>
            <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
              {categoriesList.map((cat) => (
                <div key={cat} className="flex items-center justify-between p-2 rounded-lg bg-muted/20 border border-border/30">
                  <span className="text-xs font-medium text-foreground">{cat}</span>
                  <Switch
                    checked={localSettings.categories[cat] ?? true}
                    onCheckedChange={(val) =>
                      setLocalSettings((prev) => ({
                        ...prev,
                        categories: {
                          ...prev.categories,
                          [cat]: val,
                        },
                      }))
                    }
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter className="pt-3 gap-2">
          <Button variant="outline" size="sm" onClick={() => onOpenChange(false)} className="h-8 text-xs font-bold">
            Cancel
          </Button>
          <Button size="sm" onClick={handleSave} className="h-8 text-xs font-bold bg-brand-gradient text-white gap-1.5 shadow-glow">
            <Save className="size-3.5" /> Save Preferences
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
