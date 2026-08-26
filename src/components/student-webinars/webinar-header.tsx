import React from "react";
import { Search, SlidersHorizontal, Download, Video, Home, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface WebinarHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function WebinarHeader({
  searchQuery,
  onSearchChange,
}: WebinarHeaderProps) {
  return (
    <div className="space-y-4 mb-6">
      {/* Top Breadcrumb Row */}
      <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
        <Home className="size-3.5" />
        <span>Home</span>
        <ChevronRight className="size-3 text-slate-400" />
        <span className="font-bold text-slate-900 dark:text-slate-100">Webinars</span>
      </div>

      {/* Main Title Card Box */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
        {/* Left Title & Icon */}
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center size-12 rounded-xl bg-[#091024] text-white shadow-md shrink-0">
            <Video className="size-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Student Webinars
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
              Discover, register and attend live webinars, workshops, expert talks and career events.
            </p>
          </div>
        </div>

        {/* Right Search Input Box */}
        <div className="w-full md:w-72 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
          <Input
            type="text"
            placeholder="Search webinars..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 rounded-xl text-xs h-10 focus-visible:ring-1 focus-visible:ring-slate-400"
          />
        </div>
      </div>
    </div>
  );
}
