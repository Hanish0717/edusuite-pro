import { useState, useMemo } from "react";
import { toast } from "sonner";
import { useNavigate } from "@tanstack/react-router";
import type { NotificationItem, NotificationSettingsState, NotificationSummaryStats } from "./types";
import { MOCK_NOTIFICATIONS, DEFAULT_NOTIFICATION_SETTINGS } from "./mock-notifications";
import { NotificationHeader } from "./notification-header";
import { SummaryCards } from "./summary-cards";
import { NotificationFilters, type FilterCategoryTab } from "./notification-filters";
import { NotificationCard } from "./notification-card";
import { NotificationSettingsModal } from "./notification-settings-modal";
import { EmptyState } from "./empty-state";

interface NotificationsModuleProps {
  department?: string;
}

export function NotificationsModule({ department }: NotificationsModuleProps) {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<NotificationItem[]>(MOCK_NOTIFICATIONS);
  const [settings, setSettings] = useState<NotificationSettingsState>(DEFAULT_NOTIFICATION_SETTINGS);

  const [activeTab, setActiveTab] = useState<FilterCategoryTab>("All");
  const [search, setSearch] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("ALL");
  const [readFilter, setReadFilter] = useState("ALL");

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  // Department-aware filtering
  const departmentFilteredNotifications = useMemo(() => {
    if (!department) return notifications;
    return notifications.filter((n) => !n.department || n.department === department || department === "Computer Science and Engineering");
  }, [notifications, department]);

  // Compute summary stats dynamically
  const stats: NotificationSummaryStats = useMemo(() => {
    return {
      unreadCount: departmentFilteredNotifications.filter((n) => !n.isRead).length,
      highPriorityCount: departmentFilteredNotifications.filter((n) => n.priority === "High").length,
      todayCount: departmentFilteredNotifications.filter((n) => n.time.includes("Today") || n.time.includes("Ago") || n.time.includes("Minutes")).length,
      actionRequiredCount: departmentFilteredNotifications.filter((n) => n.isActionRequired && !n.isRead).length,
    };
  }, [departmentFilteredNotifications]);

  // Filtered notifications list based on search, tabs, priority, read status
  const filteredNotifications = useMemo(() => {
    return departmentFilteredNotifications.filter((n) => {
      // Tab filter
      if (activeTab === "Unread" && n.isRead) return false;
      if (
        activeTab !== "All" &&
        activeTab !== "Unread" &&
        n.category.toLowerCase() !== activeTab.toLowerCase()
      ) {
        return false;
      }

      // Priority filter
      if (priorityFilter !== "ALL" && n.priority !== priorityFilter) return false;

      // Read filter
      if (readFilter === "UNREAD" && n.isRead) return false;
      if (readFilter === "READ" && !n.isRead) return false;

      // Search filter
      if (search.trim() !== "") {
        const query = search.toLowerCase();
        const matchesTitle = n.title.toLowerCase().includes(query);
        const matchesCategory = n.category.toLowerCase().includes(query);
        const matchesStudent = n.studentName?.toLowerCase().includes(query);
        const matchesSubject = n.subject?.toLowerCase().includes(query);
        const matchesDate = n.date.toLowerCase().includes(query) || n.time.toLowerCase().includes(query);

        return matchesTitle || matchesCategory || matchesStudent || matchesSubject || matchesDate;
      }

      return true;
    });
  }, [departmentFilteredNotifications, activeTab, priorityFilter, readFilter, search]);

  // Actions
  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    toast.success("All notifications marked as read.");
  };

  const handleToggleRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => {
        if (n.id === id) {
          const updated = !n.isRead;
          toast.success(updated ? "Marked as read." : "Marked as unread.");
          return { ...n, isRead: updated };
        }
        return n;
      })
    );
  };

  const handleDelete = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    toast.success("Notification removed.");
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    toast.info("Fetching updated notification feed...");
    setTimeout(() => {
      setIsRefreshing(false);
      toast.success("Notifications feed synchronized.");
    }, 700);
  };

  const handleResetFilters = () => {
    setActiveTab("All");
    setSearch("");
    setPriorityFilter("ALL");
    setReadFilter("ALL");
  };

  const handleActionClick = (notification: NotificationItem) => {
    // Mark as read automatically when action button is clicked
    if (!notification.isRead) {
      setNotifications((prev) =>
        prev.map((n) => (n.id === notification.id ? { ...n, isRead: true } : n))
      );
    }

    if (notification.action?.href) {
      navigate({ to: notification.action.href });
    } else {
      toast.info(`Opening ${notification.title}`, {
        description: notification.description,
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <NotificationHeader
        unreadCount={stats.unreadCount}
        onMarkAllAsRead={handleMarkAllAsRead}
        onRefresh={handleRefresh}
        onOpenSettings={() => setSettingsOpen(true)}
        isRefreshing={isRefreshing}
      />

      {/* Summary KPI Cards */}
      <SummaryCards stats={stats} />

      {/* Filters & Tabs */}
      <NotificationFilters
        activeTab={activeTab}
        onTabChange={setActiveTab}
        search={search}
        onSearchChange={setSearch}
        priorityFilter={priorityFilter}
        onPriorityFilterChange={setPriorityFilter}
        readFilter={readFilter}
        onReadFilterChange={setReadFilter}
        onResetFilters={handleResetFilters}
        totalFilteredCount={filteredNotifications.length}
      />

      {/* Notification List */}
      {filteredNotifications.length === 0 ? (
        <EmptyState onRefresh={handleRefresh} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredNotifications.map((notif) => (
            <NotificationCard
              key={notif.id}
              notification={notif}
              onMarkAsReadToggle={handleToggleRead}
              onDelete={handleDelete}
              onActionClick={handleActionClick}
            />
          ))}
        </div>
      )}

      {/* Settings Modal */}
      <NotificationSettingsModal
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
        settings={settings}
        onSaveSettings={setSettings}
      />
    </div>
  );
}
