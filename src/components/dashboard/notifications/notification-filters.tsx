import { Search, Filter, ChevronDown, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { NotificationPriority } from "./types";

export type FilterCategoryTab =
  | "All"
  | "Unread"
  | "Assignments"
  | "Attendance"
  | "Examinations"
  | "Leave"
  | "Research"
  | "Students"
  | "System"
  | "Announcements"
  | "Timetable";

interface NotificationFiltersProps {
  activeTab: FilterCategoryTab;
  onTabChange: (tab: FilterCategoryTab) => void;
  search: string;
  onSearchChange: (value: string) => void;
  priorityFilter: string;
  onPriorityFilterChange: (value: string) => void;
  readFilter: string;
  onReadFilterChange: (value: string) => void;
  onResetFilters: () => void;
  totalFilteredCount: number;
}

export function NotificationFilters({
  activeTab,
  onTabChange,
  search,
  onSearchChange,
  priorityFilter,
  onPriorityFilterChange,
  readFilter,
  onReadFilterChange,
  onResetFilters,
  totalFilteredCount,
}: NotificationFiltersProps) {
  const tabs: FilterCategoryTab[] = [
    "All",
    "Unread",
    "Assignments",
    "Attendance",
    "Examinations",
    "Leave",
    "Research",
    "Students",
    "System",
    "Announcements",
    "Timetable",
  ];

  const hasActiveFilters = search !== "" || priorityFilter !== "ALL" || readFilter !== "ALL";

  return (
    <div className="space-y-3">
      {/* ── Category Filter Tabs ─────────────────────────────────── */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none border-b border-border/40">
        {tabs.map((tab) => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => onTabChange(tab)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
              }`}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {/* ── Search & Filter Controls ────────────────────────────── */}
      <div className="rounded-2xl border border-border/50 bg-card p-3 flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="Search notifications by title, student, subject..."
            className="pl-9 h-8 text-xs bg-muted/20 border-border/40"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          {search && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="size-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="size-3.5 text-muted-foreground shrink-0" />

          {/* Priority Select */}
          <div className="relative">
            <select
              className="appearance-none h-8 pl-2.5 pr-7 text-xs rounded-xl border border-border/50 bg-muted/30 text-foreground font-bold cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary"
              value={priorityFilter}
              onChange={(e) => onPriorityFilterChange(e.target.value)}
            >
              <option value="ALL">All Priorities</option>
              <option value="High">High Priority</option>
              <option value="Medium">Medium Priority</option>
              <option value="Low">Low Priority</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 size-3 text-muted-foreground" />
          </div>

          {/* Read / Unread Select */}
          <div className="relative">
            <select
              className="appearance-none h-8 pl-2.5 pr-7 text-xs rounded-xl border border-border/50 bg-muted/30 text-foreground font-bold cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary"
              value={readFilter}
              onChange={(e) => onReadFilterChange(e.target.value)}
            >
              <option value="ALL">All Read Status</option>
              <option value="UNREAD">Unread Only</option>
              <option value="READ">Read Only</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 size-3 text-muted-foreground" />
          </div>

          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 text-xs font-bold text-muted-foreground hover:text-foreground"
              onClick={onResetFilters}
            >
              Reset Filters
            </Button>
          )}

          <span className="text-xs font-bold text-muted-foreground ml-1">
            {totalFilteredCount} {totalFilteredCount === 1 ? "Notification" : "Notifications"}
          </span>
        </div>
      </div>
    </div>
  );
}
