import React from "react";
import { EventItem } from "./types";
import { Calendar, MapPin, Tag } from "lucide-react";

interface EventsWidgetProps {
  events: EventItem[];
}

export const EventsWidget: React.FC<EventsWidgetProps> = ({ events }) => {
  const getTypeBadge = (type: EventItem["type"]) => {
    switch (type) {
      case "Exam":
        return "bg-red-500/10 text-red-600 border-red-500/20";
      case "Placement":
        return "bg-amber-500/10 text-amber-600 border-amber-500/20";
      case "Hackathon":
        return "bg-purple-500/10 text-purple-600 border-purple-500/20";
      case "Workshop":
        return "bg-blue-500/10 text-blue-600 border-blue-500/20";
      case "Holiday":
        return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
      case "Seminar":
      default:
        return "bg-slate-500/10 text-slate-600 border-slate-500/20";
    }
  };

  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-foreground flex items-center gap-2">
          <Calendar className="h-4 w-4 text-primary" /> Upcoming Events
        </h3>
        <span className="text-xs text-muted-foreground font-medium">Campus Calendar</span>
      </div>

      <div className="space-y-3">
        {events.map((event) => (
          <div
            key={event.id}
            className="p-3.5 rounded-xl border border-border/80 bg-muted/20 hover:bg-muted/40 transition-colors flex items-center justify-between gap-3"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${getTypeBadge(event.type)}`}>
                  {event.type}
                </span>
                <span className="text-xs font-semibold text-foreground line-clamp-1">{event.title}</span>
              </div>
              <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {event.location}</span>
              </div>
            </div>

            <div className="text-right shrink-0">
              <span className="text-xs font-bold text-primary font-mono">{event.date}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
