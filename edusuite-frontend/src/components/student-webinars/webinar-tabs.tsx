import React from "react";
import { WebinarTab } from "./types";

interface WebinarTabsProps {
  activeTab: WebinarTab;
  onTabChange: (tab: WebinarTab) => void;
}

export function WebinarTabsNav({ activeTab, onTabChange }: WebinarTabsProps) {
  const tabs: { id: WebinarTab; label: string }[] = [
    { id: "upcoming", label: "Upcoming" },
    { id: "live", label: "Live" },
    { id: "registered", label: "Registered" },
    { id: "completed", label: "Completed" },
    { id: "certificates", label: "Certificates" },
    { id: "recordings", label: "Recordings" },
  ];

  return (
    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 mb-6">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
              isActive
                ? "bg-[#091024] text-white shadow-sm"
                : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800"
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
