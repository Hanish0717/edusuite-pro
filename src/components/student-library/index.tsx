import React, { useState, useEffect, useMemo } from "react";
import {
  loadLibraryState,
  saveLibraryState,
  calculateOverdueFine,
  StorageSchema,
} from "./library-store";
import { LibraryMetrics } from "./types";

import { CatalogTab } from "./catalog-tab";
import { BorrowedTab } from "./borrowed-tab";
import { ReservationTab } from "./reservation-tab";
import { DigitalLibraryTab } from "./digital-resources-tab";
import { FineTab } from "./fine-tab";
import { ActivityTab } from "./activity-tab";
import { LibraryRightSidebar } from "./sidebar";
import { NotificationsDrawer } from "./notifications-drawer";

import {
  BookOpen,
  Search,
  History,
  BookmarkCheck,
  CreditCard,
  Home,
  ChevronRight,
  Bell,
  ArrowRight,
  Globe,
  Monitor,
} from "lucide-react";
import { Tabs, TabsContent } from "@/components/ui/tabs";

export function StudentLibraryModule() {
  const [activeTab, setActiveTab] = useState("catalog");
  const [store, setStore] = useState<StorageSchema>(loadLibraryState);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  // Unblock body overflow
  useEffect(() => {
    document.body.style.overflow = "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  // Sync to localStorage & listen for storage events (Live updates from Librarian actions)
  useEffect(() => {
    saveLibraryState(store);
  }, [store]);

  useEffect(() => {
    const handleStorageChange = () => {
      setStore(loadLibraryState());
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Compute Metrics automatically
  const metrics: LibraryMetrics = useMemo(() => {
    const currentlyBorrowed = store.borrowed.filter((b) => b.status !== "Returned").length;
    const totalBorrowed = store.borrowed.length;

    const overdueCount = store.borrowed.filter((b) => {
      const { lateDays } = calculateOverdueFine(b.dueDate, "2026-08-04");
      return b.status !== "Returned" && lateDays > 0;
    }).length;

    const pendingFine = store.borrowed.reduce((sum, b) => {
      if (b.status === "Returned" || b.finePaid) return sum;
      const { fineAmount } = calculateOverdueFine(b.dueDate, "2026-08-04");
      return sum + fineAmount;
    }, 0);

    const pendingFinesTable = store.fines.reduce((sum, f) => (f.status === "Pending" ? sum + f.fineAmount : sum), 0);

    return {
      totalBorrowed,
      currentlyBorrowed,
      overdueCount,
      recentReturns: 3,
      pendingFine: Math.max(pendingFine, pendingFinesTable),
      reservedCount: store.reservations.length,
      wishlistCount: store.wishlist.length,
      digitalVisitsCount: store.digitalVisits ? store.digitalVisits.length : 0,
    };
  }, [store]);

  const unreadNotifsCount = store.notifications.filter((n) => !n.read).length;

  // Card Navigation Items Definition - Includes Digital Library Usage History
  const navCards = [
    {
      id: "catalog",
      title: "Book Availability",
      count: `${store.books.length}`,
      unit: "titles",
      subtitle: "Search Portal",
      icon: Search,
      color: "purple",
      activeBg: "border-purple-600 bg-purple-50/60 dark:bg-purple-950/40 ring-2 ring-purple-500/20",
      activeIconBg: "bg-purple-600 text-white",
      inactiveIconBg: "bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400",
    },
    {
      id: "borrowed",
      title: "My Issued Books",
      count: `${metrics.currentlyBorrowed}`,
      unit: "active",
      subtitle: "Personal Tracker",
      icon: BookOpen,
      color: "purple",
      activeBg: "border-purple-600 bg-purple-50/60 dark:bg-purple-950/40 ring-2 ring-purple-500/20",
      activeIconBg: "bg-purple-600 text-white",
      inactiveIconBg: "bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400",
    },
    {
      id: "reservations",
      title: "Holds",
      count: `${metrics.reservedCount}`,
      unit: "reserved",
      subtitle: "Queue Status",
      icon: BookmarkCheck,
      color: "blue",
      activeBg: "border-blue-600 bg-blue-50/60 dark:bg-blue-950/40 ring-2 ring-blue-500/20",
      activeIconBg: "bg-blue-600 text-white",
      inactiveIconBg: "bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400",
    },
    {
      id: "digital",
      title: "Digital Library",
      count: `${metrics.digitalVisitsCount}`,
      unit: "visits",
      subtitle: "Usage History",
      icon: Globe,
      color: "blue",
      activeBg: "border-blue-600 bg-blue-50/60 dark:bg-blue-950/40 ring-2 ring-blue-500/20",
      activeIconBg: "bg-blue-600 text-white",
      inactiveIconBg: "bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400",
    },
    {
      id: "fines",
      title: "Fine Ledger",
      count: metrics.pendingFine > 0 ? `₹${metrics.pendingFine}` : "₹0",
      unit: metrics.pendingFine > 0 ? "due" : "clear",
      subtitle: "Overdue Dues",
      icon: CreditCard,
      color: metrics.pendingFine > 0 ? "rose" : "emerald",
      activeBg: metrics.pendingFine > 0
        ? "border-rose-600 bg-rose-50/60 dark:bg-rose-950/40 ring-2 ring-rose-500/20"
        : "border-emerald-600 bg-emerald-50/60 dark:bg-emerald-950/40 ring-2 ring-emerald-500/20",
      activeIconBg: metrics.pendingFine > 0 ? "bg-rose-600 text-white" : "bg-emerald-600 text-white",
      inactiveIconBg: metrics.pendingFine > 0
        ? "bg-rose-50 dark:bg-rose-950/50 text-rose-600"
        : "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600",
    },
    {
      id: "activity",
      title: "Activity Log",
      count: `${store.activities.length}`,
      unit: "records",
      subtitle: "System History",
      icon: History,
      color: "slate",
      activeBg: "border-slate-800 dark:border-slate-300 bg-slate-100/80 dark:bg-slate-800/80 ring-2 ring-slate-400/20",
      activeIconBg: "bg-slate-900 text-white dark:bg-white dark:text-slate-900",
      inactiveIconBg: "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300",
    },
  ];

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-[1600px] mx-auto min-h-screen">
      {/* PAGE HEADER */}
      <div className="space-y-4">
        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
          <Home className="h-3.5 w-3.5" />
          <span>Student</span>
          <ChevronRight className="h-3 w-3 text-slate-400" />
          <span className="font-bold text-slate-900 dark:text-slate-100">Library</span>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-4 border-slate-200 dark:border-slate-800">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
              Library (OPAC)
            </h1>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Read-only catalogue search portal, issued-book tracker, and lab usage history.
            </p>
          </div>

          <div className="flex items-center">
            {/* NOTIFICATIONS BUTTON */}
            <button
              onClick={() => setNotificationsOpen(true)}
              className="relative p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 h-9 w-9 flex items-center justify-center transition-colors"
              title="Library Notifications"
            >
              <Bell className="h-4 w-4" />
              {unreadNotifsCount > 0 && (
                <span className="absolute -top-1 -right-1 size-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center animate-pulse">
                  {unreadNotifsCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* CARD NAVIGATION GRID - 6 CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {navCards.map((card) => {
          const Icon = card.icon;
          const isActive = activeTab === card.id;

          return (
            <button
              key={card.id}
              onClick={() => setActiveTab(card.id)}
              className={`p-4 rounded-2xl border transition-all text-left flex flex-col justify-between cursor-pointer group shadow-2xs ${
                isActive
                  ? `${card.activeBg} shadow-sm`
                  : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-purple-300 dark:hover:border-purple-700 hover:shadow-xs"
              }`}
            >
              <div className="flex items-center justify-between">
                <span
                  className={`text-[10px] sm:text-xs font-bold uppercase tracking-wider ${
                    isActive ? "text-slate-900 dark:text-white font-extrabold" : "text-slate-500"
                  }`}
                >
                  {card.title}
                </span>
                <div
                  className={`p-2 rounded-xl transition-transform group-hover:scale-105 ${
                    isActive ? card.activeIconBg : card.inactiveIconBg
                  }`}
                >
                  <Icon className="h-4 w-4" />
                </div>
              </div>

              <div className="mt-3 space-y-0.5">
                <div className="flex items-baseline gap-1">
                  <span
                    className={`text-xl sm:text-2xl font-black font-mono tracking-tight ${
                      isActive ? "text-slate-900 dark:text-white" : "text-slate-800 dark:text-slate-100"
                    }`}
                  >
                    {card.count}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">{card.unit}</span>
                </div>
                <div className="flex items-center justify-between text-[10px] font-semibold">
                  <span className={isActive ? "text-purple-700 dark:text-purple-300 font-bold" : "text-slate-400"}>
                    {card.subtitle}
                  </span>
                  <ArrowRight
                    className={`h-3 w-3 transition-transform ${
                      isActive
                        ? "text-purple-600 dark:text-purple-400 translate-x-0.5"
                        : "text-slate-300 opacity-0 group-hover:opacity-100"
                    }`}
                  />
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* MAIN DATA CONTENT AREA */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* LEFT MAIN MODULE AREA (3 COLS) */}
        <div className="lg:col-span-3 space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsContent value="catalog">
              <CatalogTab books={store.books} />
            </TabsContent>

            <TabsContent value="borrowed">
              <BorrowedTab borrowedBooks={store.borrowed} />
            </TabsContent>

            <TabsContent value="reservations">
              <ReservationTab
                reservations={store.reservations}
                onCancelReservation={(id) => {
                  setStore((prev) => ({
                    ...prev,
                    reservations: prev.reservations.filter((r) => r.id !== id),
                  }));
                }}
              />
            </TabsContent>

            <TabsContent value="digital">
              <DigitalLibraryTab visits={store.digitalVisits || []} />
            </TabsContent>

            <TabsContent value="fines">
              <FineTab fines={store.fines} />
            </TabsContent>

            <TabsContent value="activity">
              <ActivityTab activities={store.activities} />
            </TabsContent>
          </Tabs>
        </div>

        {/* RIGHT SIDEBAR (1 COL) */}
        <div className="lg:col-span-1">
          <LibraryRightSidebar
            onOpenLibraryCard={() => {}}
            onSelectQuickAction={(action) => setActiveTab(action)}
          />
        </div>
      </div>

      {/* NOTIFICATIONS DRAWER */}
      <NotificationsDrawer
        open={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
        notifications={store.notifications}
        onMarkRead={(id) => {
          setStore((prev) => ({
            ...prev,
            notifications: prev.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
          }));
        }}
      />
    </div>
  );
}
