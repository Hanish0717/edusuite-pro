import { useState } from "react";
import { Shield, KeyRound, Smartphone, Mail, Phone, Laptop, LogOut, CheckCircle2, AlertTriangle } from "lucide-react";
import type { AccountSecurityState } from "./types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface SecurityCardProps {
  security: AccountSecurityState;
  onUpdateSecurity: (updated: Partial<AccountSecurityState>) => void;
}

export function SecurityCard({ security, onUpdateSecurity }: SecurityCardProps) {
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Please fill in all password fields.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }
    toast.success("Password changed successfully.");
    setShowPasswordModal(false);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const handleMfaToggle = () => {
    const updated = !security.mfaEnabled;
    onUpdateSecurity({ mfaEnabled: updated });
    toast.success(updated ? "Two-Factor Authentication enabled." : "Two-Factor Authentication disabled.");
  };

  const handleLogoutOtherDevices = () => {
    const remainingSessions = security.activeSessions.filter((s) => s.isCurrent);
    onUpdateSecurity({ activeSessions: remainingSessions });
    toast.success("Logged out of all other devices successfully.");
  };

  return (
    <div className="rounded-2xl border border-border/50 bg-card p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap pb-4 border-b border-border/40">
        <div className="flex items-center gap-2">
          <div className="size-9 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
            <Shield className="size-5" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-foreground">Account Security</h3>
            <p className="text-xs text-muted-foreground">Manage credentials, multi-factor authentication, and active sessions.</p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Button
            size="sm"
            variant="outline"
            className="h-8 gap-1.5 text-xs font-bold"
            onClick={() => setShowPasswordModal(!showPasswordModal)}
          >
            <KeyRound className="size-3.5" /> Change Password
          </Button>

          <Button
            size="sm"
            variant={security.mfaEnabled ? "outline" : "default"}
            className="h-8 gap-1.5 text-xs font-bold"
            onClick={handleMfaToggle}
          >
            <Smartphone className="size-3.5" />
            {security.mfaEnabled ? "MFA Enabled" : "Enable MFA"}
          </Button>

          <Button
            size="sm"
            variant="outline"
            className="h-8 gap-1.5 text-xs font-bold text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/20"
            onClick={handleLogoutOtherDevices}
          >
            <LogOut className="size-3.5" /> Logout Other Devices
          </Button>
        </div>
      </div>

      {/* Password Change Sub-form */}
      {showPasswordModal && (
        <form onSubmit={handlePasswordSubmit} className="p-4 rounded-xl bg-muted/30 border border-border/40 space-y-3">
          <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5">
            <KeyRound className="size-4 text-primary" /> Change Password
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Input
              type="password"
              placeholder="Current Password"
              className="h-8 text-xs bg-background"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
            <Input
              type="password"
              placeholder="New Password"
              className="h-8 text-xs bg-background"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <Input
              type="password"
              placeholder="Confirm New Password"
              className="h-8 text-xs bg-background"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <Button type="button" variant="ghost" size="sm" className="h-7 text-xs font-bold" onClick={() => setShowPasswordModal(false)}>
              Cancel
            </Button>
            <Button type="submit" size="sm" className="h-7 text-xs font-bold bg-primary text-primary-foreground">
              Update Password
            </Button>
          </div>
        </form>
      )}

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recovery Info & MFA Status */}
        <div className="space-y-4">
          <h4 className="text-xs font-extrabold uppercase text-muted-foreground tracking-wider">Recovery & MFA Details</h4>
          
          <div className="p-3.5 rounded-xl bg-muted/20 border border-border/30 space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 font-medium text-foreground">
                <Smartphone className="size-4 text-muted-foreground" /> Two-Factor Authentication (2FA)
              </span>
              <Badge variant="outline" className={security.mfaEnabled ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 font-bold" : "bg-amber-500/10 text-amber-600 border-amber-500/20 font-bold"}>
                {security.mfaEnabled ? "Protected (2FA On)" : "Disabled"}
              </Badge>
            </div>

            <div className="flex items-center justify-between border-t border-border/30 pt-2.5">
              <span className="flex items-center gap-2 font-medium text-foreground">
                <Mail className="size-4 text-muted-foreground" /> Recovery Email
              </span>
              <span className="font-mono text-muted-foreground">{security.recoveryEmail}</span>
            </div>

            <div className="flex items-center justify-between border-t border-border/30 pt-2.5">
              <span className="flex items-center gap-2 font-medium text-foreground">
                <Phone className="size-4 text-muted-foreground" /> Recovery Phone
              </span>
              <span className="font-mono text-muted-foreground">{security.recoveryPhone}</span>
            </div>

            <div className="flex items-center justify-between border-t border-border/30 pt-2.5">
              <span className="flex items-center gap-2 font-medium text-foreground">
                <KeyRound className="size-4 text-muted-foreground" /> Last Password Change
              </span>
              <span className="text-muted-foreground">{security.lastPasswordChange}</span>
            </div>
          </div>
        </div>

        {/* Active Sessions */}
        <div className="space-y-4">
          <h4 className="text-xs font-extrabold uppercase text-muted-foreground tracking-wider">Active Sessions & Trusted Devices</h4>

          <div className="space-y-2.5">
            {security.activeSessions.map((session) => (
              <div key={session.id} className="flex items-center justify-between p-3 rounded-xl bg-muted/20 border border-border/30 text-xs">
                <div className="flex items-center gap-2.5">
                  <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <Laptop className="size-4" />
                  </div>
                  <div>
                    <p className="font-bold text-foreground flex items-center gap-1.5">
                      {session.device}
                      {session.isCurrent && (
                        <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-500/20 text-[9px] font-bold px-1.5 py-0">
                          Current Device
                        </Badge>
                      )}
                    </p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">{session.browser} · {session.location}</p>
                  </div>
                </div>
                <span className="text-[10px] text-muted-foreground font-semibold shrink-0">{session.lastActive}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
