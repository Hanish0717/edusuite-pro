import {
  Select as BaseSelect,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  className?: string;
}

export function Select({
  label,
  value,
  onChange,
  options,
  placeholder = "Select option...",
  className,
}: SelectProps) {
  return (
    <div className="w-full space-y-1">
      {label && (
        <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
          {label}
        </label>
      )}
      <BaseSelect value={value} onValueChange={onChange}>
        <SelectTrigger className="h-9 text-xs font-semibold">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((opt) => (
            <SelectItem key={opt.value} className="text-xs font-semibold" value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </BaseSelect>
    </div>
  );
}

export default Select;
