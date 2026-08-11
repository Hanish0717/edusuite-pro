import { ToggleLeft, ToggleRight } from "lucide-react";

interface SwitchProps {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export function Switch({ label, description, checked, onChange }: SwitchProps) {
  return (
    <div className="flex items-center justify-between border-b border-border/40 pb-4 last:border-b-0 last:pb-0">
      <div>
        <h4 className="font-bold text-sm text-foreground">{label}</h4>
        {description && <p className="text-xs text-muted-foreground mt-0.5">{description}</p>}
      </div>
      <button
        onClick={() => onChange(!checked)}
        className="cursor-pointer text-primary hover:opacity-80 shrink-0"
      >
        {checked ? (
          <ToggleRight className="size-8 text-primary" />
        ) : (
          <ToggleLeft className="size-8 text-muted-foreground" />
        )}
      </button>
    </div>
  );
}

export default Switch;
