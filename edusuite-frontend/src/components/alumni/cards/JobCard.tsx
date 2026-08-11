import React from "react";
import { Briefcase, MapPin, DollarSign, ArrowUpRight, Users, Clock } from "lucide-react";
import { AlumniJobItem } from "@/types/alumni";
import { GlassCard } from "./GlassCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface JobCardProps {
  job: AlumniJobItem;
  onRequestReferral: (job: AlumniJobItem) => void;
}

export const JobCard: React.FC<JobCardProps> = ({ job, onRequestReferral }) => {
  return (
    <GlassCard className="p-5 flex flex-col justify-between space-y-4">
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <Badge
              variant="outline"
              className="text-[0.65rem] font-mono mb-1.5 bg-blue-500/10 text-blue-600 border-blue-200"
            >
              {job.jobType}
            </Badge>
            <h3 className="font-extrabold text-base text-foreground leading-snug">{job.title}</h3>
            <p className="text-xs font-bold text-primary">{job.company}</p>
          </div>
          <span className="size-9 rounded-xl bg-slate-100 dark:bg-slate-800 text-primary grid place-items-center font-bold shrink-0">
            <Briefcase className="size-4" />
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs font-mono p-3 bg-slate-100/70 dark:bg-slate-800/40 rounded-xl border border-border/50">
          <div className="flex items-center gap-1.5">
            <DollarSign className="size-3.5 text-emerald-600 shrink-0" />
            <span className="font-bold text-emerald-600 text-[0.72rem]">{job.ctcRange}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin className="size-3.5 text-rose-500 shrink-0" />
            <span className="text-muted-foreground text-[0.72rem] truncate">{job.location}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="size-3.5 text-amber-500 shrink-0" />
            <span className="text-muted-foreground text-[0.72rem]">{job.expRequired}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Users className="size-3.5 text-indigo-500 shrink-0" />
            <span className="text-muted-foreground text-[0.72rem]">{job.applicationsCount} Applicants</span>
          </div>
        </div>

        {/* Posted by alumni info */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground pt-1">
          {job.postedByAvatar ? (
            <img src={job.postedByAvatar} alt={job.postedBy} className="size-6 rounded-full object-cover" />
          ) : (
            <span className="size-6 rounded-full bg-primary/20 text-primary font-bold text-[0.65rem] grid place-items-center">
              {job.postedBy[0]}
            </span>
          )}
          <span className="truncate">
            Posted by <strong className="text-foreground">{job.postedBy}</strong> ({job.postedByBatch})
          </span>
        </div>

        {/* Skills */}
        <div className="flex flex-wrap gap-1 font-mono text-[0.65rem]">
          {job.skills.map((sk) => (
            <Badge key={sk} variant="outline" className="bg-background/80">
              {sk}
            </Badge>
          ))}
        </div>
      </div>

      <Button
        onClick={() => onRequestReferral(job)}
        className="w-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold h-9 rounded-xl cursor-pointer gap-1.5 shadow-2xs mt-2"
      >
        Request Referral <ArrowUpRight className="size-4" />
      </Button>
    </GlassCard>
  );
};
