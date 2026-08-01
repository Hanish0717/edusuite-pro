import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface GlobalSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function GlobalSearch({ value, onChange, placeholder = "Global search query..." }: GlobalSearchProps) {
  return (
    <div className="relative w-full max-w-md">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/60" />
      <Input
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-9 h-10 font-semibold text-xs border-border/80 focus-visible:ring-primary/20 shadow-sm rounded-xl"
      />
    </div>
  );
}

export default GlobalSearch;
