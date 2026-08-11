import React, { useState } from "react";
import { toast } from "sonner";
import {
  User,
  GraduationCap,
  Briefcase,
  Award,
  Globe,
  MessageSquare,
  Share2,
  CheckCircle2,
  Star,
  MapPin,
  Mail,
  Phone,
} from "lucide-react";
import { AlumniProfileItem, TimelineItem } from "@/types/alumni";
import { PageHeader } from "@/components/alumni/shared/PageHeader";
import { Timeline } from "@/components/alumni/timeline/Timeline";
import { ActivityFeed } from "@/components/alumni/widgets/ActivityFeed";
import { GlassCard } from "@/components/alumni/cards/GlassCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RECENT_ACTIVITIES } from "@/data/alumniData";

interface AlumniProfileViewProps {
  alumnus: AlumniProfileItem;
}

export const AlumniProfileView: React.FC<AlumniProfileViewProps> = ({ alumnus }) => {
  const [isConnected, setIsConnected] = useState(false);

  const handleConnectToggle = () => {
    setIsConnected(!isConnected);
    toast.success(isConnected ? `Removed connection with ${alumnus.name}` : `Connected with ${alumnus.name}!`);
  };

  const eduItems: TimelineItem[] = alumnus.educationTimeline.map((e, idx) => ({
    id: `EDU-${idx}`,
    title: e.degree,
    subtitle: e.institution,
    period: e.year,
    iconType: "education",
  }));

  const workItems: TimelineItem[] = alumnus.workExperience.map((w, idx) => ({
    id: `WRK-${idx}`,
    title: w.role,
    subtitle: w.company,
    period: w.duration,
    iconType: "work",
  }));

  return (
    <div className="space-y-6 font-sans">
      {/* HEADER PROFILE BANNER */}
      <div className="relative overflow-hidden rounded-3xl border border-border bg-card shadow-xl">
        {/* Cover Photo Gradient */}
        <div className="h-44 w-full bg-gradient-to-r from-blue-700 via-indigo-800 to-blue-950 relative">
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <Button
              onClick={() => toast.success("Copied profile URL to clipboard!")}
              variant="outline"
              className="bg-white/10 hover:bg-white/20 text-white border-white/20 h-8 rounded-xl text-xs font-bold gap-1 cursor-pointer backdrop-blur-md"
            >
              <Share2 className="size-3.5" /> Share Profile
            </Button>
          </div>
        </div>

        {/* Profile Content Header */}
        <div className="p-6 pt-0 relative -top-12 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4">
            <img
              src={alumnus.avatar}
              alt={alumnus.name}
              className="size-28 rounded-3xl object-cover border-4 border-card shadow-lg bg-card"
            />
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-extrabold text-foreground">{alumnus.name}</h1>
                <Badge className="bg-blue-600 text-white font-mono text-[0.65rem]">
                  {alumnus.mentoringStatus}
                </Badge>
              </div>
              <p className="text-sm font-bold text-primary font-mono">
                {alumnus.designation} @ {alumnus.company}
              </p>
              <p className="text-xs text-muted-foreground font-mono flex items-center gap-2">
                <span>{alumnus.batch}</span> • <span>{alumnus.dept}</span> •{" "}
                <span className="flex items-center gap-1"><MapPin className="size-3 text-rose-500" /> {alumnus.location}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2 sm:pt-0">
            <Button
              onClick={handleConnectToggle}
              className={`h-9 px-4 font-bold rounded-xl cursor-pointer gap-1.5 ${
                isConnected
                  ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                  : "bg-[#2563EB] hover:bg-[#1D4ED8] text-white"
              }`}
            >
              <MessageSquare className="size-4" /> {isConnected ? "Connected ✓" : "Connect"}
            </Button>
          </div>
        </div>
      </div>

      {/* 2-COLUMN PROFILE CONTENT */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* LEFT COLUMN: TIMELINES & SKILLS */}
        <div className="lg:col-span-2 space-y-6">
          {/* BIO */}
          <GlassCard className="p-5 space-y-2">
            <h3 className="font-extrabold text-sm text-foreground flex items-center gap-2">
              <User className="size-4 text-primary" /> Executive Biography
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed font-sans">{alumnus.bio}</p>
          </GlassCard>

          {/* WORK EXPERIENCE */}
          <GlassCard className="p-5 space-y-3">
            <h3 className="font-extrabold text-sm text-foreground flex items-center gap-2">
              <Briefcase className="size-4 text-purple-600" /> Professional Work History
            </h3>
            <Timeline items={workItems} />
          </GlassCard>

          {/* EDUCATION TIMELINE */}
          <GlassCard className="p-5 space-y-3">
            <h3 className="font-extrabold text-sm text-foreground flex items-center gap-2">
              <GraduationCap className="size-4 text-blue-600" /> Academic Qualifications
            </h3>
            <Timeline items={eduItems} />
          </GlassCard>

          {/* ENDORSED SKILLS */}
          <GlassCard className="p-5 space-y-3">
            <h3 className="font-extrabold text-sm text-foreground flex items-center gap-2">
              <Star className="size-4 text-amber-500 fill-amber-500" /> Endorsed Technical Skills
            </h3>
            <div className="flex flex-wrap gap-2">
              {(alumnus.endorsements || [
                { skill: "Distributed Systems", count: 48 },
                { skill: "Kubernetes", count: 32 },
                { skill: "Go", count: 29 },
                { skill: "Cloud Architecture", count: 24 },
              ]).map((e) => (
                <div key={e.skill} className="flex items-center gap-2 p-2 px-3 rounded-xl bg-card border border-border text-xs font-mono">
                  <span className="font-bold text-foreground">{e.skill}</span>
                  <Badge variant="outline" className="text-[0.62rem] bg-primary/10 text-primary border-primary/20">
                    +{e.count} Endorsements
                  </Badge>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>

        {/* RIGHT COLUMN: ACHIEVEMENTS & CONTACT INFO */}
        <div className="space-y-6">
          {/* CONTACT INFO WIDGET */}
          <GlassCard className="p-5 space-y-3 text-xs font-mono">
            <h3 className="font-extrabold text-sm text-foreground font-sans flex items-center gap-2">
              <Mail className="size-4 text-primary" /> Contact Details
            </h3>
            <div className="space-y-2 text-[0.72rem]">
              <p className="flex items-center gap-2 text-muted-foreground">
                <Mail className="size-3.5 text-blue-600" /> <span className="text-foreground font-bold">{alumnus.email}</span>
              </p>
              <p className="flex items-center gap-2 text-muted-foreground">
                <Phone className="size-3.5 text-emerald-600" /> <span className="text-foreground">{alumnus.phone}</span>
              </p>
              <p className="flex items-center gap-2 text-muted-foreground">
                <Globe className="size-3.5 text-purple-600" /> <span className="text-foreground">{alumnus.connectionsCount || 420} Connections</span>
              </p>
            </div>
          </GlassCard>

          {/* ACHIEVEMENTS */}
          <GlassCard className="p-5 space-y-3">
            <h3 className="font-extrabold text-sm text-foreground flex items-center gap-2">
              <Award className="size-4 text-amber-500" /> Key Honors &amp; Awards
            </h3>
            <div className="space-y-2 text-xs font-sans">
              {alumnus.achievements.map((ach, idx) => (
                <div key={idx} className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-200/50 flex items-center gap-2 text-foreground font-medium text-[0.75rem]">
                  <CheckCircle2 className="size-4 text-amber-600 shrink-0" />
                  <span>{ach}</span>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* ACTIVITY FEED */}
          <ActivityFeed activities={RECENT_ACTIVITIES.slice(0, 3)} />
        </div>
      </div>
    </div>
  );
};
