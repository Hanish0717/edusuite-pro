import React from "react";
import {
  Video,
  Award,
  PlayCircle,
  Calendar,
  UserCheck,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { MOCK_HIGHLIGHTS_ITEMS, MOCK_SCHEDULE_TIMELINE } from "./mock-data";
import { WebinarTab } from "./types";
import { toast } from "sonner";

interface WebinarHighlightsProps {
  onTabNavigate: (tab: WebinarTab) => void;
}

export function WebinarHighlights({ onTabNavigate }: WebinarHighlightsProps) {
  const iconMap: Record<string, React.ElementType> = {
    Video: Video,
    Award: Award,
    PlayCircle: PlayCircle,
    Calendar: Calendar,
    UserCheck: UserCheck,
  };

  return (
    <div className="space-y-6">
      {/* 1. WEBINAR HIGHLIGHTS CARD */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xs overflow-hidden">
        {/* Dark Navy Header */}
        <div className="bg-[#091024] text-white p-4">
          <h3 className="text-sm font-extrabold tracking-tight">Webinar Highlights</h3>
        </div>

        {/* List Items */}
        <div className="p-2 divide-y divide-slate-100 dark:divide-slate-800">
          {MOCK_HIGHLIGHTS_ITEMS.map((item) => {
            const IconComp = iconMap[item.icon] || Video;
            return (
              <div
                key={item.id}
                onClick={() => {
                  if (item.id === "hl-2") onTabNavigate("certificates");
                  else if (item.id === "hl-3") onTabNavigate("recordings");
                  else toast.info(`Viewing ${item.title}`);
                }}
                className="flex items-center justify-between p-3 hover:bg-slate-50 dark:hover:bg-slate-800/60 rounded-xl transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 group-hover:bg-[#091024] group-hover:text-white transition-colors">
                    <IconComp className="size-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {item.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                      {item.subtitle}
                    </p>
                  </div>
                </div>
                <ChevronRight className="size-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. UPCOMING SCHEDULE CARD */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-5 shadow-2xs space-y-4">
        <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
          Upcoming Schedule
        </h3>

        {/* Timeline List */}
        <div className="relative pl-4 space-y-5 before:absolute before:left-1.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
          {MOCK_SCHEDULE_TIMELINE.map((item) => (
            <div key={item.id} className="relative space-y-0.5">
              {/* Dot */}
              <div className="absolute -left-[19px] top-1 size-2.5 rounded-full bg-slate-900 dark:bg-white ring-4 ring-white dark:ring-slate-900" />
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block">
                {item.dateLabel}
              </span>
              <h4 className="text-xs font-extrabold text-slate-900 dark:text-white">
                {item.title}
              </h4>
              <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                {item.time}
              </p>
            </div>
          ))}
        </div>

        {/* View Full Calendar Button */}
        <Button
          onClick={() => toast.info("Opening Full Webinar Calendar...")}
          className="w-full h-10 rounded-xl bg-[#091024] hover:bg-[#152248] text-white font-bold text-xs shadow-xs mt-2"
        >
          View Full Calendar
        </Button>
      </div>
    </div>
  );
}
