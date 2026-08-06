import React from "react";
import { Building2, MapPin, DollarSign, ArrowUpRight } from "lucide-react";
import { GlassCard } from "./GlassCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export interface CompanyItem {
  id: string;
  name: string;
  logo?: string;
  industry: string;
  location: string;
  openRolesCount: number;
  salaryRange: string;
  verifiedPartner?: boolean;
}

interface CompanyCardProps {
  company: CompanyItem;
  onViewOpenings: (company: CompanyItem) => void;
}

export const CompanyCard: React.FC<CompanyCardProps> = ({ company, onViewOpenings }) => {
  return (
    <GlassCard className="p-5 flex flex-col justify-between space-y-4 border border-[#24356B]/30">
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="size-12 rounded-2xl bg-[#4D78FF]/10 text-[#2563EB] dark:text-[#4D78FF] grid place-items-center font-bold text-lg border border-[#24356B]/40">
              {company.logo ? (
                <img src={company.logo} alt={company.name} className="size-full rounded-2xl object-cover" />
              ) : (
                <Building2 className="size-6" />
              )}
            </span>
            <div>
              <h3 className="font-extrabold text-base text-foreground font-sans truncate">{company.name}</h3>
              <span className="text-[0.68rem] text-muted-foreground font-mono block">{company.industry}</span>
            </div>
          </div>

          <Badge variant="outline" className="text-[0.65rem] font-mono bg-[#4D78FF]/10 text-[#2563EB] dark:text-[#4D78FF] border-[#24356B]/40">
            {company.openRolesCount} Openings
          </Badge>
        </div>

        <div className="p-3 bg-[#4D78FF]/5 dark:bg-[#1A285D]/30 rounded-xl space-y-1 text-xs font-mono border border-[#24356B]/30">
          <div className="flex items-center gap-1.5 text-[#2563EB] dark:text-[#4D78FF] font-bold">
            <DollarSign className="size-3.5 shrink-0" />
            <span>{company.salaryRange}</span>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground text-[0.68rem]">
            <MapPin className="size-3 text-[#4D78FF] shrink-0" />
            <span>{company.location}</span>
          </div>
        </div>
      </div>

      <Button
        onClick={() => onViewOpenings(company)}
        className="w-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold h-9 rounded-xl cursor-pointer gap-1.5 shadow-2xs mt-2"
      >
        View Hiring Openings <ArrowUpRight className="size-4" />
      </Button>
    </GlassCard>
  );
};
