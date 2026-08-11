import * as React from "react";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface TimePickerProps {
  value?: string; // HH:MM AM/PM format
  onChange?: (value: string) => void;
  className?: string;
}

export function TimePicker({ value = "09:00 AM", onChange, className }: TimePickerProps) {
  // Parse value
  const match = value.match(/^(\d{2}):(\d{2})\s(AM|PM)$/);
  const initialHour = match ? match[1] : "09";
  const initialMinute = match ? match[2] : "00";
  const initialPeriod = match ? match[3] : "AM";

  const [hour, setHour] = React.useState(initialHour);
  const [minute, setMinute] = React.useState(initialMinute);
  const [period, setPeriod] = React.useState(initialPeriod);

  React.useEffect(() => {
    if (onChange) {
      onChange(`${hour}:${minute} ${period}`);
    }
  }, [hour, minute, period]);

  const hours = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, "0"));
  const minutes = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, "0"));

  return (
    <div
      className={cn(
        "flex h-10 items-center gap-1.5 rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 w-full max-w-[240px]",
        className,
      )}
    >
      <Clock className="size-4 text-muted-foreground shrink-0" />
      <div className="flex items-center gap-1 w-full justify-between">
        {/* Hour Select */}
        <select
          value={hour}
          onChange={(e) => setHour(e.target.value)}
          className="bg-transparent border-0 p-0 text-center font-medium focus:ring-0 focus:outline-none cursor-pointer w-full text-sm"
        >
          {hours.map((h) => (
            <option key={h} value={h}>
              {h}
            </option>
          ))}
        </select>

        <span className="text-muted-foreground font-semibold">:</span>

        {/* Minute Select */}
        <select
          value={minute}
          onChange={(e) => setMinute(e.target.value)}
          className="bg-transparent border-0 p-0 text-center font-medium focus:ring-0 focus:outline-none cursor-pointer w-full text-sm"
        >
          {minutes.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>

        {/* Period Select */}
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          className="bg-primary/5 text-primary border-0 rounded-md py-0.5 px-1 text-center font-bold focus:ring-0 focus:outline-none cursor-pointer text-xs"
        >
          <option value="AM">AM</option>
          <option value="PM">PM</option>
        </select>
      </div>
    </div>
  );
}
