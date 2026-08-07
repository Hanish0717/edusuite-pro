import React from "react";
import { Search, Filter, RefreshCw, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SearchFilterBarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedUnit: string;
  onUnitChange: (u: string) => void;
  selectedStatus: string;
  onStatusChange: (s: string) => void;
  timeFilter: string;
  onTimeFilterChange: (t: string) => void;
  totalUnits: number;
  onReset: () => void;
}

export function SearchFilterBar({
  searchQuery,
  onSearchChange,
  selectedUnit,
  onUnitChange,
  selectedStatus,
  onStatusChange,
  timeFilter,
  onTimeFilterChange,
  totalUnits,
  onReset,
}: SearchFilterBarProps) {
  const isFiltered = searchQuery !== "" || selectedUnit !== "ALL" || selectedStatus !== "ALL" || timeFilter !== "ALL";

  return (
    <div className="p-3.5 rounded-2xl bg-card border border-border/80 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
      {/* Search Input */}
      <div className="relative w-full md:w-80">
        <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
        <Input
          placeholder="Search topic, unit, hour, status..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9 h-9 text-xs rounded-xl bg-muted/20 border-border/70 focus-visible:ring-primary/20"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange("")}
            className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground cursor-pointer"
          >
            <X className="size-4" />
          </button>
        )}
      </div>

      {/* Filter Selects */}
      <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
        {/* Unit Filter */}
        <Select value={selectedUnit} onValueChange={onUnitChange}>
          <SelectTrigger className="h-9 text-xs rounded-xl border-border/70 min-w-[120px]">
            <SelectValue placeholder="All Units" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Units</SelectItem>
            {Array.from({ length: totalUnits }, (_, i) => i + 1).map((u) => (
              <SelectItem key={u} value={String(u)}>
                Unit {u}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Status Filter */}
        <Select value={selectedStatus} onValueChange={onStatusChange}>
          <SelectTrigger className="h-9 text-xs rounded-xl border-border/70 min-w-[130px]">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Statuses</SelectItem>
            <SelectItem value="Completed">Completed</SelectItem>
            <SelectItem value="In Progress">In Progress</SelectItem>
            <SelectItem value="Upcoming">Pending / Upcoming</SelectItem>
          </SelectContent>
        </Select>

        {/* Time Filter */}
        <Select value={timeFilter} onValueChange={onTimeFilterChange}>
          <SelectTrigger className="h-9 text-xs rounded-xl border-border/70 min-w-[140px]">
            <SelectValue placeholder="All Time" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Time</SelectItem>
            <SelectItem value="WEEK">Current Week</SelectItem>
            <SelectItem value="MONTH">Current Month</SelectItem>
          </SelectContent>
        </Select>

        {isFiltered && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="h-9 px-2 text-xs text-muted-foreground hover:text-foreground cursor-pointer"
          >
            <RefreshCw className="size-3.5 mr-1" /> Reset
          </Button>
        )}
      </div>
    </div>
  );
}
