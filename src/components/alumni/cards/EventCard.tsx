import React from "react";
import { Calendar, MapPin, Users, Ticket } from "lucide-react";
import { AlumniEventItem } from "@/types/alumni";
import { GlassCard } from "./GlassCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface EventCardProps {
  event: AlumniEventItem;
  onRegister: (event: AlumniEventItem) => void;
}

export const EventCard: React.FC<EventCardProps> = ({ event, onRegister }) => {
  return (
    <GlassCard className="p-0 overflow-hidden flex flex-col justify-between border border-[#24356B]/30">
      <div className="relative h-36 w-full overflow-hidden">
        <img
          src={event.bannerImage}
          alt={event.title}
          className="size-full object-cover transition-transform duration-500 hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F1B44] via-[#0F1B44]/40 to-transparent" />
        <Badge className="absolute top-3 left-3 bg-[#2563EB] text-white font-mono text-[0.65rem]">
          {event.category}
        </Badge>
        {event.isRegistered && (
          <Badge className="absolute top-3 right-3 bg-[#4D78FF] text-white font-mono text-[0.65rem]">
            Ticket Confirmed ✓
          </Badge>
        )}
      </div>

      <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
        <div className="space-y-2">
          <h3 className="font-extrabold text-base text-foreground leading-snug">{event.title}</h3>
          <p className="text-xs text-muted-foreground line-clamp-2">{event.description}</p>

          <div className="space-y-1.5 pt-1 text-xs font-mono">
            <p className="flex items-center gap-2 text-[#2563EB] dark:text-[#4D78FF] font-bold">
              <Calendar className="size-3.5" /> {event.date} • {event.time}
            </p>
            <p className="flex items-center gap-2 text-muted-foreground truncate">
              <MapPin className="size-3.5 text-[#4D78FF] shrink-0" /> {event.venue}
            </p>
            <p className="flex items-center gap-2 text-muted-foreground">
              <Users className="size-3.5 text-[#2563EB] shrink-0" />
              <span>
                <strong className="text-foreground">{event.registeredCount}</strong> / {event.maxCapacity} Registered
              </span>
            </p>
          </div>
        </div>

        <Button
          onClick={() => onRegister(event)}
          variant={event.isRegistered ? "outline" : "default"}
          className={`w-full font-bold h-9 rounded-xl cursor-pointer gap-1.5 mt-2 ${
            event.isRegistered
              ? "border-[#2563EB] text-[#2563EB] hover:bg-[#4D78FF]/10"
              : "bg-[#2563EB] hover:bg-[#1D4ED8] text-white"
          }`}
        >
          <Ticket className="size-4" /> {event.isRegistered ? "View Ticket Certificate" : "Register Event Ticket"}
        </Button>
      </div>
    </GlassCard>
  );
};
