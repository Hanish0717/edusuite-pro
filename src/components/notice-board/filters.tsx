import React from "react";
import { NoticeCategory, NoticePriority } from "./types";
import { Search as SearchIcon, Filter, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

export const CATEGORY_TABS: NoticeCategory[] = [
  "All Notices",
  "Academics",
  "Examinations",
  "Placements",
  "Scholarships",
  "Events",
  "Hostel",
  "Transport",
  "Library",
  "Finance"
];

interface NoticeFiltersProps {
  activeTab: NoticeCategory;
  onTabChange: (tab: NoticeCategory) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  priorityFilter: string;
  onPriorityChange: (p: string) => void;
  departmentFilter: string;
  onDepartmentChange: (d: string) => void;
  unreadOnly: boolean;
  onUnreadOnlyChange: (u: boolean) => void;
  onResetFilters: () => void;
  departments: string[];
}

export const NoticeFilters: React.FC<NoticeFiltersProps> = ({
  activeTab,
  onTabChange,
  searchQuery,
  onSearchChange,
  priorityFilter,
  onPriorityChange,
  departmentFilter,
  onDepartmentChange,
  unreadOnly,
  onUnreadOnlyChange,
  onResetFilters,
  departments,
}) => {
  const hasActiveFilters =
    searchQuery !== "" ||
    priorityFilter !== "ALL" ||
    departmentFilter !== "ALL" ||
    unreadOnly;

  return (
    <div className="space-y-4">
      {/* Search & Filter Bar */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        {/* Search Bar */}
        <div className="relative flex-1">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search notices by title, department, or keyword..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-9 py-2 text-sm rounded-lg border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Dropdown Filters */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Priority Filter */}
          <select
            value={priorityFilter}
            onChange={(e) => onPriorityChange(e.target.value)}
            className="h-9 px-3 py-1 text-xs font-medium rounded-lg border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 cursor-pointer"
          >
            <option value="ALL">All Priorities</option>
            <option value="Urgent">Urgent Priority</option>
            <option value="High">High Priority</option>
            <option value="Normal">Normal Priority</option>
            <option value="Low">Low Priority</option>
          </select>

          {/* Department Filter */}
          <select
            value={departmentFilter}
            onChange={(e) => onDepartmentChange(e.target.value)}
            className="h-9 px-3 py-1 text-xs font-medium rounded-lg border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 cursor-pointer max-w-[160px]"
          >
            <option value="ALL">All Departments</option>
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>

          {/* Unread Only Toggle */}
          <button
            onClick={() => onUnreadOnlyChange(!unreadOnly)}
            className={`h-9 px-3 py-1 text-xs font-medium rounded-lg border transition-all flex items-center gap-1.5 ${
              unreadOnly
                ? "bg-primary/15 text-primary border-primary/40"
                : "bg-card text-muted-foreground border-border hover:border-primary/40"
            }`}
          >
            {unreadOnly && <Check className="h-3.5 w-3.5" />}
            Unread Only
          </button>

          {/* Reset Filters */}
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onResetFilters}
              className="h-9 px-2 text-xs text-red-500 hover:text-red-600 hover:bg-red-500/10"
            >
              Reset
            </Button>
          )}
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-1 border-b border-border overflow-x-auto pb-1 scrollbar-none">
        {CATEGORY_TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => onTabChange(tab)}
            className={`px-4 py-2 text-xs font-semibold rounded-t-lg transition-all whitespace-nowrap border-b-2 -mb-1 ${
              activeTab === tab
                ? "border-primary text-primary bg-primary/5"
                : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
  );
};
