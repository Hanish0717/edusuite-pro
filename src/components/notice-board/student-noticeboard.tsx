import React, { useState, useMemo } from "react";
import { NoticeItem, NoticeCategory } from "./types";
import { generateMockNotices, SIDEBAR_DEADLINES, SIDEBAR_HOLIDAYS } from "./mock-data";
import { NoticeFilters } from "./filters";
import { NoticeCards } from "./notice-cards";
import { NoticeDetailDrawer } from "./notice-detail-drawer";
import { NoticeSidebar } from "./sidebar";
import {
  Bell,
  MailWarning,
  AlertOctagon,
  CalendarCheck,
  Inbox,
  Sparkles,
  RefreshCw
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const StudentNoticeBoard: React.FC = () => {
  const [notices, setNotices] = useState<NoticeItem[]>(() => generateMockNotices());
  const [activeTab, setActiveTab] = useState<NoticeCategory>("All Notices");
  const [searchQuery, setSearchQuery] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("ALL");
  const [departmentFilter, setDepartmentFilter] = useState("ALL");
  const [unreadOnly, setUnreadOnly] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedNotice, setSelectedNotice] = useState<NoticeItem | null>(null);

  // Extract unique departments for filter dropdown
  const departments = useMemo(() => {
    const set = new Set<string>();
    notices.forEach((n) => set.add(n.department));
    return Array.from(set).sort();
  }, [notices]);

  // Calculate KPI Counts
  const totalNoticesCount = notices.length;
  const unreadNoticesCount = notices.filter((n) => !n.read).length;
  const importantNoticesCount = notices.filter(
    (n) => n.priority === "Urgent" || n.priority === "High"
  ).length;
  const upcomingEventsCount = notices.filter(
    (n) => n.category === "Events"
  ).length;

  // Filter Notices
  const filteredNotices = useMemo(() => {
    return notices.filter((notice) => {
      // 1. Tab / Category Filter
      if (activeTab !== "All Notices" && notice.category !== activeTab) {
        return false;
      }

      // 2. Search Query
      if (searchQuery.trim() !== "") {
        const q = searchQuery.toLowerCase();
        const matchesTitle = notice.title.toLowerCase().includes(q);
        const matchesDept = notice.department.toLowerCase().includes(q);
        const matchesDesc = notice.shortDescription.toLowerCase().includes(q);
        if (!matchesTitle && !matchesDept && !matchesDesc) {
          return false;
        }
      }

      // 3. Priority Filter
      if (priorityFilter !== "ALL" && notice.priority !== priorityFilter) {
        return false;
      }

      // 4. Department Filter
      if (departmentFilter !== "ALL" && notice.department !== departmentFilter) {
        return false;
      }

      // 5. Unread Filter
      if (unreadOnly && notice.read) {
        return false;
      }

      return true;
    });
  }, [notices, activeTab, searchQuery, priorityFilter, departmentFilter, unreadOnly]);

  // Handlers
  const handleViewNotice = (notice: NoticeItem) => {
    // Mark as read when viewing
    if (!notice.read) {
      setNotices((prev) =>
        prev.map((n) => (n.id === notice.id ? { ...n, read: true } : n))
      );
    }
    setSelectedNotice({ ...notice, read: true });
  };

  const handleToggleBookmark = (id: string) => {
    setNotices((prev) =>
      prev.map((n) => (n.id === id ? { ...n, bookmarked: !n.bookmarked } : n))
    );
    if (selectedNotice && selectedNotice.id === id) {
      setSelectedNotice((prev) => (prev ? { ...prev, bookmarked: !prev.bookmarked } : null));
    }
  };

  const handleToggleRead = (id: string) => {
    setNotices((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: !n.read } : n))
    );
  };

  const handleResetFilters = () => {
    setActiveTab("All Notices");
    setSearchQuery("");
    setPriorityFilter("ALL");
    setDepartmentFilter("ALL");
    setUnreadOnly(false);
  };

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 600);
  };

  const pinnedNotices = useMemo(() => {
    return notices.filter((n) => n.pinned);
  }, [notices]);

  const recentNotices = useMemo(() => {
    return notices.slice(0, 5);
  }, [notices]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Module Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight flex items-center gap-2">
            <Bell className="h-6 w-6 text-primary" /> Digital Notice Board
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            College announcements, department notices, examination updates and important circulars.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          className="gap-2 self-start sm:self-auto text-xs"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} /> Refresh Notices
        </Button>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Total Notices */}
        <div className="group relative overflow-hidden rounded-xl border border-border bg-card p-5 shadow-sm transition-all hover:shadow-md hover:border-primary/40">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Total Notices
            </span>
            <div className="p-2.5 rounded-xl bg-primary/10 text-primary transition-transform group-hover:scale-110">
              <Bell className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-foreground">{totalNoticesCount}</span>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              Active Stream
            </span>
          </div>
        </div>

        {/* KPI 2: Unread Notices */}
        <div className="group relative overflow-hidden rounded-xl border border-border bg-card p-5 shadow-sm transition-all hover:shadow-md hover:border-blue-500/40">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Unread Notices
            </span>
            <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 transition-transform group-hover:scale-110">
              <MailWarning className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-foreground">{unreadNoticesCount}</span>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
              Requires Action
            </span>
          </div>
        </div>

        {/* KPI 3: Important Notices */}
        <div className="group relative overflow-hidden rounded-xl border border-border bg-card p-5 shadow-sm transition-all hover:shadow-md hover:border-amber-500/40">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Important Notices
            </span>
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 transition-transform group-hover:scale-110">
              <AlertOctagon className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-foreground">{importantNoticesCount}</span>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
              High Priority
            </span>
          </div>
        </div>

        {/* KPI 4: Upcoming Events */}
        <div className="group relative overflow-hidden rounded-xl border border-border bg-card p-5 shadow-sm transition-all hover:shadow-md hover:border-purple-500/40">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Upcoming Events
            </span>
            <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 transition-transform group-hover:scale-110">
              <CalendarCheck className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-foreground">{upcomingEventsCount}</span>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
              Campus Life
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: Left Notice Feed + Right Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Filters + Notice Cards */}
        <div className="lg:col-span-2 space-y-5">
          {/* Category Tabs & Search/Filters */}
          <NoticeFilters
            activeTab={activeTab}
            onTabChange={setActiveTab}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            priorityFilter={priorityFilter}
            onPriorityChange={setPriorityFilter}
            departmentFilter={departmentFilter}
            onDepartmentChange={setDepartmentFilter}
            unreadOnly={unreadOnly}
            onUnreadOnlyChange={setUnreadOnly}
            onResetFilters={handleResetFilters}
            departments={departments}
          />

          {/* Loading Skeleton State */}
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4].map((n) => (
                <div
                  key={n}
                  className="rounded-xl border border-border bg-card p-5 space-y-3 animate-pulse"
                >
                  <div className="flex items-center justify-between">
                    <div className="h-4 w-24 bg-muted rounded" />
                    <div className="h-4 w-16 bg-muted rounded" />
                  </div>
                  <div className="h-5 w-3/4 bg-muted rounded" />
                  <div className="h-4 w-full bg-muted rounded" />
                  <div className="h-4 w-2/3 bg-muted rounded" />
                </div>
              ))}
            </div>
          ) : filteredNotices.length === 0 ? (
            /* Empty State */
            <div className="rounded-xl border border-dashed border-border bg-card p-12 text-center flex flex-col items-center justify-center space-y-3">
              <div className="p-4 rounded-full bg-muted/50 text-muted-foreground">
                <Inbox className="h-8 w-8" />
              </div>
              <h3 className="text-base font-semibold text-foreground">No notices available.</h3>
              <p className="text-xs text-muted-foreground max-w-sm">
                No announcements or notices match your selected filters. Try searching for a different keyword or resetting filters.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={handleResetFilters}
                className="mt-2 text-xs"
              >
                Reset All Filters
              </Button>
            </div>
          ) : (
            /* Notice Cards List */
            <NoticeCards
              notices={filteredNotices}
              onViewNotice={handleViewNotice}
              onToggleBookmark={handleToggleBookmark}
              onToggleRead={handleToggleRead}
            />
          )}
        </div>

        {/* Right 1 Column: Sidebar Widgets */}
        <div className="space-y-6">
          <NoticeSidebar
            pinnedNotices={pinnedNotices}
            recentNotices={recentNotices}
            deadlines={SIDEBAR_DEADLINES}
            holidays={SIDEBAR_HOLIDAYS}
            onSelectNotice={handleViewNotice}
          />
        </div>
      </div>

      {/* Notice Detail Drawer Modal */}
      <NoticeDetailDrawer
        notice={selectedNotice}
        onClose={() => setSelectedNotice(null)}
        onToggleBookmark={handleToggleBookmark}
      />
    </div>
  );
};
