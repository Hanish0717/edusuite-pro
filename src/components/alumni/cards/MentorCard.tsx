import React from "react";
import { Star, Award, Calendar, CheckCircle2 } from "lucide-react";
import { MentorItem } from "@/types/alumni";
import { GlassCard } from "./GlassCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface MentorCardProps {
  mentor: MentorItem;
  onBookSlot: (mentor: MentorItem) => void;
}

export const MentorCard: React.FC<MentorCardProps> = ({ mentor, onBookSlot }) => {
  return (
    <GlassCard className="p-5 flex flex-col justify-between space-y-4 border border-[#24356B]/30">
      <div className="space-y-3">
        <div className="flex items-start gap-3.5">
          <img
            src={mentor.avatar}
            alt={mentor.name}
            className="size-14 rounded-2xl object-cover border-2 border-[#4D78FF]/30 shadow-xs"
          />
          <div className="space-y-1 min-w-0 flex-1">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-base text-foreground truncate">{mentor.name}</h3>
              <div className="flex items-center gap-1 text-[#2563EB] dark:text-[#4D78FF] font-bold font-mono text-xs">
                <Star className="size-3.5 fill-[#2563EB] text-[#2563EB] dark:fill-[#4D78FF] dark:text-[#4D78FF]" />
                <span>{mentor.rating}</span>
              </div>
            </div>
            <p className="text-xs font-mono text-[#2563EB] dark:text-[#4D78FF] font-bold">{mentor.designation}</p>
            <p className="text-[0.72rem] text-muted-foreground">{mentor.company}</p>
          </div>
        </div>

        <div className="p-3 bg-[#4D78FF]/5 dark:bg-[#1A285D]/30 rounded-xl border border-[#24356B]/40 space-y-1.5 text-xs">
          <p className="font-bold text-foreground font-sans flex items-center gap-1.5">
            <Award className="size-3.5 text-[#2563EB] shrink-0" />
            {mentor.domain}
          </p>
          <div className="flex items-center justify-between text-[0.68rem] text-muted-foreground font-mono">
            <span>Completed: <strong className="text-foreground">{mentor.sessionsCompleted} sessions</strong></span>
            <span>Exp: <strong className="text-foreground">{mentor.expYears} yrs</strong></span>
          </div>
        </div>

        {/* Available slots */}
        <div className="space-y-1">
          <span className="text-[0.65rem] font-bold text-muted-foreground uppercase font-mono block">
            Next Slots Available:
          </span>
          <div className="flex flex-wrap gap-1 font-mono text-[0.65rem]">
            {mentor.availableSlots.map((slot) => (
              <Badge key={slot} variant="outline" className="bg-[#4D78FF]/10 text-[#2563EB] dark:text-[#4D78FF] border-[#24356B]/40">
                <Calendar className="size-3 mr-1" /> {slot}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      <Button
        onClick={() => onBookSlot(mentor)}
        className="w-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold h-9 rounded-xl cursor-pointer gap-1.5 shadow-2xs mt-2"
      >
        <CheckCircle2 className="size-4" /> Book 1-on-1 Session
      </Button>
    </GlassCard>
  );
};
