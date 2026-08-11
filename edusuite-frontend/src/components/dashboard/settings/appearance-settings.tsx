import { Palette, Sun, Moon, Monitor, Type, Globe, Clock, Layout } from "lucide-react";
import type { AppearanceSettingsState } from "./types";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface AppearanceSettingsProps {
  appearance: AppearanceSettingsState;
  onUpdateAppearance: (updated: Partial<AppearanceSettingsState>) => void;
}

export function AppearanceSettings({
  appearance,
  onUpdateAppearance,
}: AppearanceSettingsProps) {
  return (
    <div className="rounded-2xl border border-border/50 bg-card p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2 pb-4 border-b border-border/40">
        <div className="size-9 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-600 dark:text-purple-400">
          <Palette className="size-5" />
        </div>
        <div>
          <h3 className="text-base font-extrabold text-foreground">Appearance & Interface</h3>
          <p className="text-xs text-muted-foreground">Personalize color theme, font density, language, and regional settings.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Theme Selector */}
        <div className="space-y-3">
          <label className="text-xs font-extrabold uppercase text-muted-foreground tracking-wider flex items-center gap-1.5">
            <Sun className="size-3.5" /> Color Theme
          </label>
          <div className="grid grid-cols-3 gap-2.5">
            {[
              { id: "light", label: "Light", icon: Sun },
              { id: "dark", label: "Dark", icon: Moon },
              { id: "system", label: "System", icon: Monitor },
            ].map((t) => {
              const Icon = t.icon;
              const isSelected = appearance.theme === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => onUpdateAppearance({ theme: t.id as any })}
                  className={`flex flex-col items-center gap-2 p-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                    isSelected
                      ? "border-primary bg-primary/10 text-primary shadow-sm"
                      : "border-border/40 bg-muted/20 text-muted-foreground hover:text-foreground hover:bg-muted/40"
                  }`}
                >
                  <Icon className="size-4" />
                  <span>{t.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Font Size & Density */}
        <div className="space-y-3">
          <label className="text-xs font-extrabold uppercase text-muted-foreground tracking-wider flex items-center gap-1.5">
            <Type className="size-3.5" /> Text Size & Spacing
          </label>
          <div className="grid grid-cols-3 gap-2.5">
            {[
              { id: "compact", label: "Compact" },
              { id: "normal", label: "Normal" },
              { id: "large", label: "Large" },
            ].map((f) => {
              const isSelected = appearance.fontSize === f.id;
              return (
                <button
                  key={f.id}
                  onClick={() => onUpdateAppearance({ fontSize: f.id as any })}
                  className={`p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                    isSelected
                      ? "border-primary bg-primary/10 text-primary shadow-sm"
                      : "border-border/40 bg-muted/20 text-muted-foreground hover:text-foreground hover:bg-muted/40"
                  }`}
                >
                  {f.label}
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-muted/20 border border-border/30 mt-3">
            <div className="flex items-center gap-2">
              <Layout className="size-4 text-muted-foreground" />
              <Label htmlFor="compact-mode" className="text-xs font-semibold cursor-pointer">Enable High-Density Compact Mode</Label>
            </div>
            <Switch
              id="compact-mode"
              checked={appearance.compactMode}
              onCheckedChange={(val) => onUpdateAppearance({ compactMode: val })}
            />
          </div>
        </div>

        {/* Language */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-wide flex items-center gap-1.5">
            <Globe className="size-3.5" /> Language
          </label>
          <select
            className="w-full h-8 text-xs font-bold rounded-xl border border-border/50 bg-muted/30 text-foreground px-3 cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary"
            value={appearance.language}
            onChange={(e) => onUpdateAppearance({ language: e.target.value })}
          >
            <option value="English (US)">English (US)</option>
            <option value="English (UK)">English (UK)</option>
            <option value="Hindi">Hindi (हिंदी)</option>
          </select>
        </div>

        {/* Timezone */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-wide flex items-center gap-1.5">
            <Clock className="size-3.5" /> Timezone
          </label>
          <select
            className="w-full h-8 text-xs font-bold rounded-xl border border-border/50 bg-muted/30 text-foreground px-3 cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary"
            value={appearance.timezone}
            onChange={(e) => onUpdateAppearance({ timezone: e.target.value })}
          >
            <option value="Asia/Kolkata (IST +5:30)">Asia/Kolkata (IST +5:30)</option>
            <option value="UTC">UTC (Coordinated Universal Time)</option>
            <option value="America/New_York (EST)">America/New_York (EST)</option>
          </select>
        </div>
      </div>
    </div>
  );
}
