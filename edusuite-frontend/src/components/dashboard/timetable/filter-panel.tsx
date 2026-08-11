import { useState } from "react";
import { Filter } from "lucide-react";
import { Panel } from "@/components/dashboard/panel";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface FilterPanelProps {
  onFilterChange: (filters: Record<string, string>) => void;
}

export function FilterPanel({ onFilterChange }: FilterPanelProps) {
  const [ay, setAy] = useState("2026-27");
  const [sem, setSem] = useState("5");
  const [week, setWeek] = useState("Week 5 (Active)");

  const handleApply = () => {
    onFilterChange({ ay, sem, week });
  };

  return (
    <Panel
      title="Filter Calendar & Grid"
      description="Refine your schedule matrix for other semesters or weeks"
      className="border border-border bg-card rounded-2xl p-5 shadow-card"
    >
      <div className="space-y-4 text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Academic Year */}
          <div className="space-y-1.5">
            <Label className="text-xs">Academic Year</Label>
            <Select value={ay} onValueChange={setAy}>
              <SelectTrigger className="rounded-xl h-10">
                <SelectValue placeholder="Academic Year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2026-27">2026-27 (Current)</SelectItem>
                <SelectItem value="2025-26">2025-26</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Semester */}
          <div className="space-y-1.5">
            <Label className="text-xs">Semester</Label>
            <Select value={sem} onValueChange={setSem}>
              <SelectTrigger className="rounded-xl h-10">
                <SelectValue placeholder="Semester" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Semester 1</SelectItem>
                <SelectItem value="3">Semester 3</SelectItem>
                <SelectItem value="5">Semester 5 (Current)</SelectItem>
                <SelectItem value="7">Semester 7</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Week */}
          <div className="space-y-1.5">
            <Label className="text-xs">Academic Week</Label>
            <Select value={week} onValueChange={setWeek}>
              <SelectTrigger className="rounded-xl h-10">
                <SelectValue placeholder="Academic Week" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Week 4">Week 4</SelectItem>
                <SelectItem value="Week 5 (Active)">Week 5 (Current)</SelectItem>
                <SelectItem value="Week 6">Week 6</SelectItem>
                <SelectItem value="Week 7">Week 7</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-end gap-2.5 pt-2">
          <Button
            onClick={handleApply}
            className="rounded-xl bg-brand-gradient shadow-glow h-9 px-4 text-xs cursor-pointer flex items-center gap-1.5"
          >
            <Filter className="size-3.5" /> Apply Filters
          </Button>
        </div>
      </div>
    </Panel>
  );
}
