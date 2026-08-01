import React, { useEffect, useState } from "react";
import { CalendarDays, Plus, MapPin, Users, Clock, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { fetchCampusEvents, type CampusEvent } from "./CampusEventsService";

export function CampusEventsModuleView() {
  const [events, setEvents] = useState<CampusEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCampusEvents()
      .then(setEvents)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <h1 className="text-2xl font-bold font-display flex items-center gap-2">
            <CalendarDays className="size-6 text-primary" /> Campus Events & Activities Module
          </h1>
          <p className="text-sm text-muted-foreground">
            Schedule technical symposiums, cultural fests, workshops, venue bookings, and RSVP tracking.
          </p>
        </div>
        <Button className="bg-brand-gradient text-white gap-2 font-semibold shadow-glow">
          <Plus className="size-4" /> Create New Campus Event
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-card border border-border space-y-1">
          <span className="text-xs text-muted-foreground font-semibold uppercase">Total Scheduled Events</span>
          <p className="text-2xl font-bold font-mono text-primary">{events.length} Events</p>
        </div>
        <div className="p-4 rounded-2xl bg-card border border-border space-y-1">
          <span className="text-xs text-muted-foreground font-semibold uppercase">Live Events Today</span>
          <p className="text-2xl font-bold font-mono text-emerald-600">
            {events.filter((e) => e.status === "Live Now").length} Event Active
          </p>
        </div>
        <div className="p-4 rounded-2xl bg-card border border-border space-y-1">
          <span className="text-xs text-muted-foreground font-semibold uppercase">Total Expected RSVPs</span>
          <p className="text-2xl font-bold font-mono text-purple-600">
            {events.reduce((sum, e) => sum + e.attendeesCount, 0)} Attendees
          </p>
        </div>
      </div>

      {loading ? (
        <p className="text-sm text-muted-foreground">Loading campus events...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {events.map((evt) => (
            <div
              key={evt.id}
              className="p-5 rounded-2xl border border-border/80 bg-card hover:border-primary/50 transition-all shadow-sm space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="font-mono text-[0.65rem]">
                    {evt.category}
                  </Badge>
                  <Badge
                    className={
                      evt.status === "Live Now"
                        ? "bg-red-500/10 text-red-600 border-red-500/20 animate-pulse"
                        : "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                    }
                  >
                    {evt.status === "Live Now" && <Sparkles className="size-3 mr-1 inline" />}
                    {evt.status}
                  </Badge>
                </div>

                <h3 className="font-bold text-base text-foreground leading-snug">{evt.title}</h3>
              </div>

              <div className="space-y-2 pt-3 border-t border-border/50 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Clock className="size-3.5 text-primary" /> {evt.date} at {evt.time}
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="size-3.5 text-primary" /> Venue: <span className="font-medium text-foreground">{evt.location}</span>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <span>Organizer: <span className="font-semibold text-foreground">{evt.organizer}</span></span>
                  <span className="font-mono font-bold text-emerald-600">{evt.attendeesCount} RSVPs</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
