import React from "react";
import { Building2, GraduationCap, Users, MapPin, Calendar, Award, UserCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { SectionInfo } from "@/services/section-timetable-service";

interface SectionHeaderProps {
  sectionInfo: SectionInfo;
}

export function SectionHeader({ sectionInfo }: SectionHeaderProps) {
  return (
    <div className="p-4 rounded-2xl bg-muted/30 border border-border/70 space-y-3 text-xs">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/50 pb-2.5">
        <div className="flex items-center gap-2.5">
          <span className="p-2 rounded-xl bg-primary text-primary-foreground font-display font-black text-sm">
            {sectionInfo.sectionName}
          </span>
          <div>
            <h3 className="font-display font-extrabold text-sm text-foreground">
              {sectionInfo.department}
            </h3>
            <p className="text-[0.68rem] text-muted-foreground font-mono">
              Academic Section Timetable & Master Schedule
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          <Badge variant="outline" className="font-mono text-xs border-primary/30 text-primary bg-primary/5">
            {sectionInfo.semester}
          </Badge>
          <Badge variant="secondary" className="font-mono text-xs">
            Regulation {sectionInfo.regulation}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-[0.68rem] font-mono text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <Users className="size-3.5 text-primary shrink-0" />
          <span>Strength: <strong className="text-foreground font-sans">{sectionInfo.strength} Students</strong></span>
        </div>
        <div className="flex items-center gap-1.5">
          <UserCheck className="size-3.5 text-primary shrink-0" />
          <span>Advisor: <strong className="text-foreground font-sans">{sectionInfo.classAdvisor}</strong></span>
        </div>
        <div className="flex items-center gap-1.5">
          <MapPin className="size-3.5 text-primary shrink-0" />
          <span>Room: <strong className="text-foreground font-sans">{sectionInfo.room}</strong></span>
        </div>
        <div className="flex items-center gap-1.5">
          <Calendar className="size-3.5 text-primary shrink-0" />
          <span>AY: <strong className="text-foreground font-sans">{sectionInfo.academicYear}</strong></span>
        </div>
      </div>
    </div>
  );
}
