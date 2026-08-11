import React from "react";
import { Filter, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FilterPanelProps {
  batchFilter: string;
  setBatchFilter: (val: string) => void;
  deptFilter: string;
  setDeptFilter: (val: string) => void;
  employmentFilter: string;
  setEmploymentFilter: (val: string) => void;
  countryFilter: string;
  setCountryFilter: (val: string) => void;
  onReset: () => void;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  batchFilter,
  setBatchFilter,
  deptFilter,
  setDeptFilter,
  employmentFilter,
  setEmploymentFilter,
  countryFilter,
  setCountryFilter,
  onReset,
}) => {
  return (
    <div className="p-4 rounded-2xl border border-border bg-card/80 backdrop-blur-md shadow-2xs space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-extrabold text-foreground flex items-center gap-1.5 font-sans">
          <Filter className="size-3.5 text-primary" /> Advanced Filters
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={onReset}
          className="h-7 text-[0.68rem] text-muted-foreground hover:text-foreground cursor-pointer gap-1"
        >
          <RotateCcw className="size-3" /> Reset
        </Button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4 text-xs font-mono">
        <div>
          <label className="text-[0.65rem] text-muted-foreground block mb-1 font-sans font-bold">
            Graduation Batch
          </label>
          <select
            value={batchFilter}
            onChange={(e) => setBatchFilter(e.target.value)}
            className="w-full h-9 rounded-xl border border-input bg-background px-3 text-xs cursor-pointer font-mono"
          >
            <option value="All">All Batches</option>
            <option value="Batch of 2022">Batch of 2022</option>
            <option value="Batch of 2021">Batch of 2021</option>
            <option value="Batch of 2020">Batch of 2020</option>
            <option value="Batch of 2019">Batch of 2019</option>
            <option value="Batch of 2018">Batch of 2018</option>
            <option value="Batch of 2017">Batch of 2017</option>
          </select>
        </div>

        <div>
          <label className="text-[0.65rem] text-muted-foreground block mb-1 font-sans font-bold">
            Academic Department
          </label>
          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="w-full h-9 rounded-xl border border-input bg-background px-3 text-xs cursor-pointer font-mono"
          >
            <option value="All">All Departments</option>
            <option value="Computer Science">Computer Science (CSE)</option>
            <option value="Electronics">Electronics &amp; Comm (ECE)</option>
            <option value="Mechanical">Mechanical Engineering (ME)</option>
            <option value="Information Technology">Information Tech (IT)</option>
          </select>
        </div>

        <div>
          <label className="text-[0.65rem] text-muted-foreground block mb-1 font-sans font-bold">
            Employment Status
          </label>
          <select
            value={employmentFilter}
            onChange={(e) => setEmploymentFilter(e.target.value)}
            className="w-full h-9 rounded-xl border border-input bg-background px-3 text-xs cursor-pointer font-mono"
          >
            <option value="All">All Statuses</option>
            <option value="Employed">Employed</option>
            <option value="Entrepreneur">Entrepreneur / Founder</option>
            <option value="Higher Studies">Higher Studies</option>
            <option value="Research Fellow">Research Fellow</option>
          </select>
        </div>

        <div>
          <label className="text-[0.65rem] text-muted-foreground block mb-1 font-sans font-bold">
            Country / Region
          </label>
          <select
            value={countryFilter}
            onChange={(e) => setCountryFilter(e.target.value)}
            className="w-full h-9 rounded-xl border border-input bg-background px-3 text-xs cursor-pointer font-mono"
          >
            <option value="All">All Countries</option>
            <option value="India">India</option>
            <option value="USA">United States</option>
            <option value="UK">United Kingdom</option>
          </select>
        </div>
      </div>
    </div>
  );
};
