import React, { useState } from "react";
import { EventItem } from "./types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, ChevronRight } from "lucide-react";

interface UpcomingEventsProps {
  events: EventItem[];
  onOpenCalendar: () => void;
  onOpenEventDetails: (event: EventItem) => void;
}

export function UpcomingEvents({ events, onOpenCalendar, onOpenEventDetails }: UpcomingEventsProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const categories = ["All", "Examination", "Assignment", "Hackathon", "Placement", "Workshop", "Holiday"];

  const filteredEvents =
    selectedCategory === "All"
      ? events
      : events.filter((e) => e.category === selectedCategory);

  return (
    <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
            <Calendar className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              SECTION 5: UPCOMING EVENTS, DRIVES & HOLIDAYS
            </h3>
            <p className="text-[11px] text-slate-500 font-medium">
              Examinations, Placement Drives, Workshops & Holidays
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={onOpenCalendar}
            variant="outline"
            size="sm"
            className="h-8 text-xs rounded-xl border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 gap-1.5"
          >
            <Calendar className="h-3.5 w-3.5 text-blue-600" /> View Calendar
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-1">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-2.5 py-1 text-[11px] font-bold rounded-xl transition-all ${
              selectedCategory === cat
                ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filteredEvents.map((evt) => (
          <div
            key={evt.id}
            className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/40 hover:bg-white dark:hover:bg-slate-800 hover:shadow-sm transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
          >
            <div className="flex items-start gap-3">
              <div className="text-center min-w-[54px] p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
                <span className="text-[10px] font-bold text-blue-600 uppercase block font-mono">
                  {evt.date.split(" ")[0]}
                </span>
                <span className="text-sm font-extrabold text-slate-900 dark:text-white font-mono">
                  {evt.date.split(" ")[1]}
                </span>
              </div>

              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                    {evt.title}
                  </h4>

                  <Badge
                    className={`text-[9px] px-2 py-0.5 font-mono ${
                      evt.priority === "High"
                        ? "bg-rose-500/10 text-rose-600 border-rose-500/20"
                        : evt.priority === "Medium"
                        ? "bg-amber-500/10 text-amber-600 border-amber-500/20"
                        : "bg-slate-500/10 text-slate-600 border-slate-500/20"
                    }`}
                  >
                    {evt.priority} Priority
                  </Badge>

                  <Badge variant="outline" className="text-[9px] font-mono text-slate-500">
                    {evt.category}
                  </Badge>
                </div>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-500">
                  <span className="flex items-center gap-1 font-mono">
                    <Clock className="h-3 w-3 text-slate-400" /> {evt.time}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3 text-slate-400" /> {evt.location}
                  </span>
                </div>
              </div>
            </div>

            <Button
              onClick={() => onOpenEventDetails(evt)}
              size="sm"
              variant="outline"
              className="h-8 text-xs rounded-xl border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 gap-1 self-start sm:self-center"
            >
              Details <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
