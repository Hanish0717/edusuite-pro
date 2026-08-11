import React from "react";
import { MapPin, UserPlus, MessageSquare, Briefcase, CheckCircle2, Clock } from "lucide-react";
import { AlumniProfileItem } from "@/types/alumni";
import { GlassCard } from "./GlassCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface ProfileCardProps {
  alumnus: AlumniProfileItem;
  onViewProfile: (alumnus: AlumniProfileItem) => void;
  onConnect: (alumnus: AlumniProfileItem) => void;
  connectionStatus?: "none" | "pending" | "connected";
}

export const ProfileCard: React.FC<ProfileCardProps> = ({
  alumnus,
  onViewProfile,
  onConnect,
  connectionStatus = "none",
}) => {
  return (
    <GlassCard className="p-5 flex flex-col justify-between space-y-4 border border-[#24356B]/30">
      <div className="space-y-3">
        {/* Avatar & Basic Info */}
        <div className="flex items-start gap-3.5">
          <img
            src={alumnus.avatar}
            alt={alumnus.name}
            className="size-14 rounded-2xl object-cover border-2 border-primary/20 shadow-xs"
          />
          <div className="space-y-0.5 min-w-0 flex-1">
            <h3 className="font-extrabold text-base text-foreground truncate">{alumnus.name}</h3>
            <span className="text-[0.72rem] text-muted-foreground font-mono block">
              {alumnus.batch} • {alumnus.dept}
            </span>
            <Badge
              variant="outline"
              className="text-[0.62rem] font-mono bg-blue-500/10 text-blue-600 border-blue-200 dark:border-blue-800"
            >
              {alumnus.mentoringStatus}
            </Badge>
          </div>
        </div>

        {/* Current Designation Box */}
        <div className="p-3 bg-slate-100/70 dark:bg-slate-800/50 rounded-xl space-y-1 text-xs font-mono border border-border/60">
          <p className="font-bold text-foreground font-sans flex items-center gap-1.5 truncate">
            <Briefcase className="size-3.5 text-primary shrink-0" />
            {alumnus.designation}
          </p>
          <p className="text-primary font-bold text-[0.75rem]">{alumnus.company}</p>
          <p className="text-[0.68rem] text-muted-foreground flex items-center gap-1">
            <MapPin className="size-3 text-rose-500 shrink-0" /> {alumnus.location}
          </p>
        </div>

        {/* Skills Tags */}
        <div className="flex flex-wrap gap-1 font-mono text-[0.65rem]">
          {alumnus.skills.slice(0, 3).map((sk) => (
            <Badge key={sk} variant="outline" className="bg-background/80 text-foreground">
              {sk}
            </Badge>
          ))}
          {alumnus.skills.length > 3 && (
            <Badge variant="outline" className="bg-background/40 text-muted-foreground">
              +{alumnus.skills.length - 3}
            </Badge>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pt-2 grid grid-cols-2 gap-2 border-t border-border/50">
        <Button
          size="sm"
          variant="outline"
          onClick={() => onViewProfile(alumnus)}
          className="h-8 text-[0.7rem] rounded-xl font-bold cursor-pointer gap-1"
        >
          <UserPlus className="size-3.5" /> Profile
        </Button>
        <Button
          size="sm"
          onClick={() => onConnect(alumnus)}
          variant={connectionStatus === "connected" ? "outline" : "default"}
          className={`h-8 text-[0.7rem] font-bold rounded-xl cursor-pointer gap-1 ${
            connectionStatus === "connected"
              ? "bg-[#4D78FF]/10 text-[#2563EB] dark:text-[#4D78FF] border-[#2563EB]"
              : connectionStatus === "pending"
              ? "bg-amber-500/10 text-amber-600 border-amber-300"
              : "bg-[#2563EB] hover:bg-[#1D4ED8] text-white"
          }`}
        >
          {connectionStatus === "connected" ? (
            <>
              <CheckCircle2 className="size-3.5 text-[#2563EB]" /> Connected ✓
            </>
          ) : connectionStatus === "pending" ? (
            <>
              <Clock className="size-3.5 text-amber-600" /> Pending...
            </>
          ) : (
            <>
              <MessageSquare className="size-3.5" /> Connect
            </>
          )}
        </Button>
      </div>
    </GlassCard>
  );
};
