import { Settings, Save, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SettingsHeaderProps {
  onSaveChanges: () => void;
  onResetSettings: () => void;
  isDirty?: boolean;
}

export function SettingsHeader({
  onSaveChanges,
  onResetSettings,
  isDirty = false,
}: SettingsHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-4 flex-wrap">
      <div className="flex items-center gap-3">
        <div className="size-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/25">
          <Settings className="size-6 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-extrabold text-foreground leading-tight">
            Settings
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manage your account, security, preferences and personalization.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <Button
          variant="outline"
          size="sm"
          className="h-8 gap-1.5 text-xs font-bold"
          onClick={onResetSettings}
        >
          <RotateCcw className="size-3.5" /> Reset Settings
        </Button>

        <Button
          size="sm"
          className="h-8 gap-1.5 text-xs font-bold bg-brand-gradient text-white shadow-glow"
          onClick={onSaveChanges}
        >
          <Save className="size-3.5" /> Save Changes
        </Button>
      </div>
    </div>
  );
}
