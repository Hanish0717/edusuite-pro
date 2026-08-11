import React from "react";
import { AnnouncementItem } from "./types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Megaphone, ChevronRight, Bell, Calendar, UserCheck } from "lucide-react";

interface StudentAnnouncementsProps {
  announcements: AnnouncementItem[];
  onOpenAnnouncement: (announcement: AnnouncementItem) => void;
}

export function StudentAnnouncementsCard({
  announcements,
  onOpenAnnouncement,
}: StudentAnnouncementsProps) {
  return (
    <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
      {/* HEADER */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
            <Megaphone className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Official Campus Circulars & Announcements
            </h3>
            <p className="text-[11px] text-slate-500 font-medium">
              Verified Bulletins from Administration & Departments
            </p>
          </div>
        </div>

        <Badge className="bg-purple-500/10 text-purple-600 border-purple-500/20 text-[10px] font-mono">
          {announcements.filter((a) => a.unread).length} Unread Circulars
        </Badge>
      </div>

      {/* ANNOUNCEMENT LIST */}
      <div className="space-y-3">
        {announcements.map((ann) => (
          <div
            key={ann.id}
            onClick={() => onOpenAnnouncement(ann)}
            className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/40 hover:bg-white dark:hover:bg-slate-800 hover:border-purple-500/30 transition-all cursor-pointer space-y-1.5 group"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                {ann.unread && (
                  <span className="h-2 w-2 rounded-full bg-purple-600 animate-ping" title="Unread Notice" />
                )}
                <Badge
                  className={`text-[9px] px-2 py-0.5 font-mono ${
                    ann.category === "Circular"
                      ? "bg-blue-500/10 text-blue-600 border-blue-500/20"
                      : ann.category === "Exam"
                      ? "bg-rose-500/10 text-rose-600 border-rose-500/20"
                      : ann.category === "Scholarship"
                      ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                      : "bg-purple-500/10 text-purple-600 border-purple-500/20"
                  }`}
                >
                  {ann.category}
                </Badge>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-purple-600 transition-colors">
                  {ann.title}
                </h4>
              </div>

              <span className="text-[10px] font-mono text-slate-400 whitespace-nowrap">
                {ann.date}
              </span>
            </div>

            <p className="text-[11px] text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
              {ann.content}
            </p>

            <div className="flex items-center justify-between pt-1 text-[10px] text-slate-400">
              <span>Issued by: <strong className="text-slate-700 dark:text-slate-300">{ann.author}</strong></span>
              <span className="text-purple-600 font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                Read Notice <ChevronRight className="h-3 w-3" />
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
