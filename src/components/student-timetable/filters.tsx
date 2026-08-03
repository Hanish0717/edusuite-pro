import React from "react";
import { FilterState } from "./types";
import { Search, Filter, RefreshCw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface FiltersProps {
  filters: FilterState;
  onFilterChange: (updated: Partial<FilterState>) => void;
  onReset: () => void;
}

export function Filters({ filters, onFilterChange, onReset }: FiltersProps) {
  return (
    <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs space-y-3">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* SEARCH INPUT */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search Subject Code, Faculty, Room, or Building..."
            value={filters.searchQuery}
            onChange={(e) => onFilterChange({ searchQuery: e.target.value })}
            className="pl-9 h-9 text-xs rounded-xl border-slate-200 dark:border-slate-800"
          />
        </div>

        {/* SELECT FILTERS ROW */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* ACADEMIC YEAR */}
          <select
            value={filters.academicYear}
            onChange={(e) => onFilterChange({ academicYear: e.target.value })}
            className="h-9 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 font-medium focus:outline-none focus:ring-1 focus:ring-purple-500"
          >
            <option value="2025-2026">AY 2025 – 2026</option>
            <option value="2024-2025">AY 2024 – 2025</option>
          </select>

          {/* SEMESTER */}
          <select
            value={filters.semester}
            onChange={(e) => onFilterChange({ semester: e.target.value })}
            className="h-9 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 font-medium focus:outline-none focus:ring-1 focus:ring-purple-500"
          >
            <option value="Semester 6">Semester 6 (B.Tech)</option>
            <option value="Semester 5">Semester 5</option>
            <option value="Semester 7">Semester 7</option>
          </select>

          {/* WEEK */}
          <select
            value={filters.week}
            onChange={(e) => onFilterChange({ week: e.target.value })}
            className="h-9 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 font-medium focus:outline-none focus:ring-1 focus:ring-purple-500"
          >
            <option value="Current Week (Week 12)">Week 12 (Aug 1 - Aug 6)</option>
            <option value="Next Week (Week 13)">Week 13 (Aug 8 - Aug 13)</option>
          </select>

          {/* CLASS TYPE */}
          <select
            value={filters.classType}
            onChange={(e) => onFilterChange({ classType: e.target.value })}
            className="h-9 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 font-medium focus:outline-none focus:ring-1 focus:ring-purple-500"
          >
            <option value="All">All Class Types</option>
            <option value="Lecture">Lecture</option>
            <option value="Lab">Lab</option>
            <option value="Tutorial">Tutorial</option>
            <option value="Seminar">Seminar</option>
            <option value="Online">Online</option>
            <option value="Elective">Elective</option>
          </select>

          {/* RESET BUTTON */}
          <Button
            onClick={onReset}
            size="sm"
            variant="outline"
            className="h-9 px-3 rounded-xl border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 gap-1.5"
            title="Reset all filters"
          >
            <RefreshCw className="h-3.5 w-3.5" /> Reset
          </Button>
        </div>
      </div>
    </div>
  );
}
