import React, { useState } from "react";
import { StudentProfileData } from "../types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Settings, Shield, Bell, Lock, Smartphone, Globe, Eye, LogOut, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

interface SettingsTabProps {
  student: StudentProfileData;
  onUpdateSettings: (settings: any) => void;
}

export function SettingsTab({ student, onUpdateSettings }: SettingsTabProps) {
  const [s, setS] = useState(student.settings);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleToggle2FA = (checked: boolean) => {
    setS({ ...s, twoFactorEnabled: checked });
    toast.success(checked ? "2FA Authentication enabled via SMS!" : "2FA Authentication disabled.");
  };

  const handleToggleEmailNotif = (checked: boolean) => {
    setS({ ...s, emailNotifications: checked });
    toast.success("Notification preferences saved.");
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!oldPassword || !newPassword) {
      toast.error("Please fill in current and new password.");
      return;
    }
    toast.success("Password changed successfully!");
    setOldPassword("");
    setNewPassword("");
  };

  return (
    <div className="space-y-6">
      
      {/* 1. SECURITY & 2FA */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm space-y-4">
        <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Shield className="h-4 w-4 text-blue-600" /> Account Security & Two-Factor Authentication (2FA)
        </h4>

        <div className="flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
          <div>
            <div className="text-xs font-bold text-slate-900 dark:text-white">Two-Factor Authentication (SMS & OTP)</div>
            <p className="text-[11px] text-slate-500">Require 6-digit OTP verification when logging into student portal</p>
          </div>
          <Switch checked={s.twoFactorEnabled} onCheckedChange={handleToggle2FA} />
        </div>

        {/* Change Password */}
        <form onSubmit={handleChangePassword} className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 space-y-3">
          <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Lock className="h-3.5 w-3.5 text-blue-600" /> Change Account Password
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              type="password"
              placeholder="Current Password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className="rounded-xl text-xs"
            />
            <Input
              type="password"
              placeholder="New Password (min 8 chars)"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="rounded-xl text-xs"
            />
          </div>
          <Button type="submit" size="sm" className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs">
            Update Password
          </Button>
        </form>
      </div>

      {/* 2. NOTIFICATIONS & PREFERENCES */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm space-y-4">
        <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Bell className="h-4 w-4 text-purple-600" /> Notifications & Alerts
        </h4>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white">Email Digest & Exam Notices</div>
              <p className="text-[11px] text-slate-500">Receive exam hall tickets and timetable alerts on email</p>
            </div>
            <Switch checked={s.emailNotifications} onCheckedChange={handleToggleEmailNotif} />
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white">SMS Attendance Shortage Warnings</div>
              <p className="text-[11px] text-slate-500">Instant SMS if attendance drops below 75% threshold</p>
            </div>
            <Switch checked={s.smsAlerts} onCheckedChange={(val) => setS({ ...s, smsAlerts: val })} />
          </div>
        </div>
      </div>

      {/* 3. ACTIVE SESSIONS */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Smartphone className="h-4 w-4 text-emerald-600" /> Active ERP Portal Sessions
          </h4>
          <Button size="sm" variant="outline" className="rounded-xl text-xs gap-1 border-rose-200 text-rose-600 hover:bg-rose-50" onClick={() => toast.success("All other active sessions logged out!")}>
            <LogOut className="h-3.5 w-3.5" /> Log Out All Other Devices
          </Button>
        </div>

        <div className="space-y-2">
          {s.activeSessions.map((session, idx) => (
            <div key={idx} className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <div>
                <strong className="text-slate-900 dark:text-white block">{session.device}</strong>
                <span className="text-[11px] text-slate-400">IP: {session.ip} &middot; {session.location}</span>
              </div>
              <div className="text-right">
                {session.current ? (
                  <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[10px]">CURRENT SESSION</Badge>
                ) : (
                  <span className="text-slate-400 text-[11px]">{session.lastActive}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
