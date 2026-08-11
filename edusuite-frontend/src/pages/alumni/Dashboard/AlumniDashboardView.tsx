import React from "react";
import {
  Globe,
  Users,
  Award,
  Heart,
  Briefcase,
  Calendar,
  Sparkles,
  ArrowUpRight,
  UserPlus,
} from "lucide-react";
import { useRole } from "@/context/role-context";
import { StatCard } from "@/components/alumni/cards/StatCard";
import { GlassCard } from "@/components/alumni/cards/GlassCard";
import { PageHeader } from "@/components/alumni/shared/PageHeader";
import { IndustryDonutChart, AlumniGrowthAreaChart } from "@/components/alumni/charts/AlumniCharts";
import { ActivityFeed } from "@/components/alumni/widgets/ActivityFeed";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RECENT_ACTIVITIES } from "@/data/alumniData";

interface AlumniDashboardViewProps {
  onNavigateTab: (tab: string) => void;
  onOpenRegisterModal: () => void;
  onOpenJobModal: () => void;
  onOpenMessagingCenter?: () => void;
}

export const AlumniDashboardView: React.FC<AlumniDashboardViewProps> = ({
  onNavigateTab,
  onOpenRegisterModal,
  onOpenJobModal,
  onOpenMessagingCenter,
}) => {
  const { role, externalPersona } = useRole();
  const isAlumniUser = role === "external-user" || externalPersona === "alumni";

  return (
    <div className="space-y-6">
      {/* PAGE HEADER */}
      <PageHeader
        title="Enterprise Alumni Network Portal"
        subtitle="Global Alumni Directory, Career Referrals Exchange, 1-on-1 Mentorship & Endowment Management System."
        badgeText="Executive Alumni Dashboard"
        onOpenMessagingCenter={onOpenMessagingCenter}
        actions={
          <>
            <Button
              onClick={onOpenRegisterModal}
              className="bg-white/20 hover:bg-white/30 text-white font-bold text-xs rounded-xl h-9 px-3.5 cursor-pointer backdrop-blur-md border border-white/20 gap-1.5"
            >
              {isAlumniUser ? (
                <>
                  <UserPlus className="size-3.5" /> Invite Batchmate
                </>
              ) : (
                "+ Register Alumni"
              )}
            </Button>
            <Button
              onClick={onOpenJobModal}
              className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-xs rounded-xl h-9 px-3.5 cursor-pointer shadow-md"
            >
              + Share Referral
            </Button>
          </>
        }
      />

      {/* KPI METRIC CARDS - UNIFIED BLUE THEME */}
      <div className="grid gap-3.5 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-8">
        <StatCard title="Total Alumni" value="5,420" change="+8.4%" icon={Globe} />
        <StatCard title="Employed" value="4,890" change="90.2%" icon={Briefcase} />
        <StatCard title="Higher Studies" value="380" change="7.0%" icon={Award} />
        <StatCard title="Entrepreneurs" value="150" change="2.8%" icon={Sparkles} />
        <StatCard title="Active Mentors" value="480" change="+12%" icon={Users} />
        <StatCard title="Donations" value="₹4.2 Cr" change="+18%" icon={Heart} />
        <StatCard title="Job Referrals" value="180" change="138 Placed" icon={Briefcase} />
        <StatCard title="Upcoming Events" value="15" change="1.2k Tickets" icon={Calendar} />
      </div>

      {/* CHARTS GRID */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <AlumniGrowthAreaChart />
        </div>
        <div>
          <IndustryDonutChart />
        </div>
      </div>

      {/* FEATURE TILES & LIVE ACTIVITY FEED */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 grid gap-4 sm:grid-cols-2">
          {/* Tile 1: Directory */}
          <GlassCard className="p-5 flex flex-col justify-between space-y-3">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="size-10 rounded-2xl bg-[#4D78FF]/10 text-[#2563EB] dark:text-[#4D78FF] grid place-items-center font-bold">
                  <Globe className="size-5" />
                </span>
                <Badge variant="outline" className="text-[0.65rem] font-mono bg-[#4D78FF]/10 text-[#2563EB] border-[#24356B]/30">
                  5,420 Profiles
                </Badge>
              </div>
              <h3 className="font-extrabold text-base text-foreground font-sans">Global Alumni Directory</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Connect with alumni across Google, Microsoft, Tesla, and Stanford AI Lab with multi-attribute filtering.
              </p>
            </div>
            <Button
              onClick={() => onNavigateTab("directory")}
              className="w-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold h-9 rounded-xl cursor-pointer gap-1.5 shadow-2xs mt-2"
            >
              Open Alumni Directory <ArrowUpRight className="size-4" />
            </Button>
          </GlassCard>

          {/* Tile 2: Career */}
          <GlassCard className="p-5 flex flex-col justify-between space-y-3">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="size-10 rounded-2xl bg-[#4D78FF]/10 text-[#2563EB] dark:text-[#4D78FF] grid place-items-center font-bold">
                  <Briefcase className="size-5" />
                </span>
                <Badge variant="outline" className="text-[0.65rem] font-mono bg-[#4D78FF]/10 text-[#2563EB] border-[#24356B]/30">
                  180 Openings
                </Badge>
              </div>
              <h3 className="font-extrabold text-base text-foreground font-sans">Career Services &amp; Referrals</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Explore referral openings posted directly by senior alumni architects with instant application tracking.
              </p>
            </div>
            <Button
              onClick={() => onNavigateTab("career")}
              className="w-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold h-9 rounded-xl cursor-pointer gap-1.5 shadow-2xs mt-2"
            >
              Explore Job Referrals <ArrowUpRight className="size-4" />
            </Button>
          </GlassCard>

          {/* Tile 3: Mentorship */}
          <GlassCard className="p-5 flex flex-col justify-between space-y-3">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="size-10 rounded-2xl bg-[#4D78FF]/10 text-[#2563EB] dark:text-[#4D78FF] grid place-items-center font-bold">
                  <Award className="size-5" />
                </span>
                <Badge variant="outline" className="text-[0.65rem] font-mono bg-[#4D78FF]/10 text-[#2563EB] border-[#24356B]/30">
                  480 Active Mentors
                </Badge>
              </div>
              <h3 className="font-extrabold text-base text-foreground font-sans">1-on-1 Student Mentorship</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Book private 30-minute career counseling and mock technical interviews with industry senior architects.
              </p>
            </div>
            <Button
              onClick={() => onNavigateTab("mentorship")}
              className="w-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold h-9 rounded-xl cursor-pointer gap-1.5 shadow-2xs mt-2"
            >
              Book Mentorship Session <ArrowUpRight className="size-4" />
            </Button>
          </GlassCard>

          {/* Tile 4: Donations */}
          <GlassCard className="p-5 flex flex-col justify-between space-y-3">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="size-10 rounded-2xl bg-[#4D78FF]/10 text-[#2563EB] dark:text-[#4D78FF] grid place-items-center font-bold">
                  <Heart className="size-5 fill-[#2563EB] text-[#2563EB]" />
                </span>
                <Badge variant="outline" className="text-[0.65rem] font-mono bg-[#4D78FF]/10 text-[#2563EB] border-[#24356B]/30">
                  ₹4.2 Cr Fund
                </Badge>
              </div>
              <h3 className="font-extrabold text-base text-foreground font-sans">Endowment &amp; Giving</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Contribute to merit scholarships, AI research labs, and campus infrastructure with Section 80G tax benefits.
              </p>
            </div>
            <Button
              onClick={() => onNavigateTab("donations")}
              className="w-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold h-9 rounded-xl cursor-pointer gap-1.5 shadow-2xs mt-2"
            >
              Make Endowment Contribution <Heart className="size-4 fill-white" />
            </Button>
          </GlassCard>
        </div>

        {/* Live Activity Feed */}
        <div>
          <ActivityFeed activities={RECENT_ACTIVITIES} />
        </div>
      </div>
    </div>
  );
};
