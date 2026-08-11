import { Lock, Eye, Mail, Phone, Clock, Share2 } from "lucide-react";
import type { PrivacySettingsState } from "./types";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface PrivacySettingsProps {
  privacy: PrivacySettingsState;
  onUpdatePrivacy: (updated: Partial<PrivacySettingsState>) => void;
}

export function PrivacySettings({
  privacy,
  onUpdatePrivacy,
}: PrivacySettingsProps) {
  return (
    <div className="rounded-2xl border border-border/50 bg-card p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2 pb-4 border-b border-border/40">
        <div className="size-9 rounded-xl bg-teal-500/10 flex items-center justify-center text-teal-600 dark:text-teal-400">
          <Lock className="size-5" />
        </div>
        <div>
          <h3 className="text-base font-extrabold text-foreground">Privacy & Visibility</h3>
          <p className="text-xs text-muted-foreground">Manage profile visibility to students, colleagues, and external visitors.</p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Profile Visibility */}
        <div className="space-y-2">
          <label className="text-xs font-extrabold uppercase text-muted-foreground tracking-wider flex items-center gap-1.5">
            <Eye className="size-3.5" /> Profile Visibility Scope
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {[
              { id: "public", label: "Public (All Users)", desc: "Visible across portal" },
              { id: "internal", label: "Internal (Department)", desc: "Visible to CS faculty & students" },
              { id: "private", label: "Private (Restricted)", desc: "Visible only to Admins" },
            ].map((v) => {
              const isSelected = privacy.profileVisibility === v.id;
              return (
                <button
                  key={v.id}
                  onClick={() => onUpdatePrivacy({ profileVisibility: v.id as any })}
                  className={`flex flex-col text-left p-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                    isSelected
                      ? "border-primary bg-primary/10 text-primary shadow-sm"
                      : "border-border/40 bg-muted/20 text-muted-foreground hover:text-foreground hover:bg-muted/40"
                  }`}
                >
                  <span className="text-foreground font-extrabold">{v.label}</span>
                  <span className="text-[10px] font-normal text-muted-foreground mt-0.5">{v.desc}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Toggles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <div className="flex items-center justify-between p-3 rounded-xl bg-muted/20 border border-border/30">
            <div className="flex items-center gap-2">
              <Mail className="size-4 text-muted-foreground" />
              <Label htmlFor="hide-email" className="text-xs font-semibold cursor-pointer">Hide Email Address on Public Roster</Label>
            </div>
            <Switch
              id="hide-email"
              checked={privacy.hideEmail}
              onCheckedChange={(val) => onUpdatePrivacy({ hideEmail: val })}
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-muted/20 border border-border/30">
            <div className="flex items-center gap-2">
              <Phone className="size-4 text-muted-foreground" />
              <Label htmlFor="hide-phone" className="text-xs font-semibold cursor-pointer">Hide Personal Phone Number</Label>
            </div>
            <Switch
              id="hide-phone"
              checked={privacy.hidePhone}
              onCheckedChange={(val) => onUpdatePrivacy({ hidePhone: val })}
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-muted/20 border border-border/30">
            <div className="flex items-center gap-2">
              <Clock className="size-4 text-muted-foreground" />
              <Label htmlFor="show-office-hours" className="text-xs font-semibold cursor-pointer">Show Office Hours to Students</Label>
            </div>
            <Switch
              id="show-office-hours"
              checked={privacy.showOfficeHours}
              onCheckedChange={(val) => onUpdatePrivacy({ showOfficeHours: val })}
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-muted/20 border border-border/30">
            <div className="flex items-center gap-2">
              <Share2 className="size-4 text-muted-foreground" />
              <Label htmlFor="profile-sharing" className="text-xs font-semibold cursor-pointer">Allow Academic Profile Exporting</Label>
            </div>
            <Switch
              id="profile-sharing"
              checked={privacy.profileSharing}
              onCheckedChange={(val) => onUpdatePrivacy({ profileSharing: val })}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
