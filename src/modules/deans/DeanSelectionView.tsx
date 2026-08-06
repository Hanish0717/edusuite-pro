import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  GraduationCap,
  Users,
  BadgeCheck,
  Building2,
  TrendingUp,
  Wallet,
  FileSpreadsheet,
  Briefcase,
  Search,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  UserCheck,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ALL_DEAN_PORTALS, type DeanCardInfo } from "./deansService";

const ICON_COMPONENTS: Record<string, React.ComponentType<{ className?: string }>> = {
  GraduationCap,
  Users,
  BadgeCheck,
  Building2,
  TrendingUp,
  Wallet,
  FileSpreadsheet,
  Briefcase,
};

export function DeanSelectionView() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Filter Deans based on search query & active tag
  const filteredDeans = ALL_DEAN_PORTALS.filter((dean) => {
    const matchesSearch =
      dean.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dean.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dean.leadPerson.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dean.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesTag = selectedTag ? dean.tags.includes(selectedTag) : true;
    return matchesSearch && matchesTag;
  });

  const allTags = Array.from(
    new Set(ALL_DEAN_PORTALS.flatMap((d) => d.tags)),
  ).slice(0, 8);

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* HERO BANNER & HEADER */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0F1B44] via-[#1A2C68] to-[#0F1B44] p-8 text-white shadow-2xl border border-[#24356B]">
        <div className="absolute right-0 top-0 -mr-16 -mt-16 size-80 rounded-full bg-primary/20 blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Badge className="bg-[#4D78FF]/20 text-[#8EB0FF] border-[#4D78FF]/40 font-mono text-xs px-3 py-1 uppercase tracking-wider">
              Staff Portal Hub • 8 Executive Deans
            </Badge>
            <div className="flex items-center gap-2 text-xs font-mono text-[#8F9CC3]">
              <ShieldCheck className="size-4 text-emerald-400" />
              <span>Role Authorization: Active</span>
            </div>
          </div>

          <div className="max-w-3xl space-y-2">
            <h1 className="font-display text-3xl sm:text-4xl font-black tracking-tight text-white">
              Institutional Dean Cockpit Selection
            </h1>
            <p className="text-sm sm:text-base text-[#B3C3ED] leading-relaxed">
              Select your designated Dean portfolio to open its dedicated workspace, real-time analytics dashboard, left navigation sidebar, and operational widgets.
            </p>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-[#24356B]">
            <div className="bg-[#16234F]/80 backdrop-blur border border-[#24356B] rounded-2xl p-3.5">
              <span className="text-[0.7rem] uppercase font-bold tracking-wider text-[#8F9CC3]">Total Portfolios</span>
              <div className="font-display text-xl font-extrabold text-white mt-0.5">8 Dean Positions</div>
            </div>
            <div className="bg-[#16234F]/80 backdrop-blur border border-[#24356B] rounded-2xl p-3.5">
              <span className="text-[0.7rem] uppercase font-bold tracking-wider text-[#8F9CC3]">NAAC Quality Benchmark</span>
              <div className="font-display text-xl font-extrabold text-emerald-400 mt-0.5">3.78 Grade A++</div>
            </div>
            <div className="bg-[#16234F]/80 backdrop-blur border border-[#24356B] rounded-2xl p-3.5">
              <span className="text-[0.7rem] uppercase font-bold tracking-wider text-[#8F9CC3]">Curriculum Compliance</span>
              <div className="font-display text-xl font-extrabold text-sky-400 mt-0.5">94.8% OBE</div>
            </div>
            <div className="bg-[#16234F]/80 backdrop-blur border border-[#24356B] rounded-2xl p-3.5">
              <span className="text-[0.7rem] uppercase font-bold tracking-wider text-[#8F9CC3]">Placement Rate</span>
              <div className="font-display text-xl font-extrabold text-amber-400 mt-0.5">92.6% TPO</div>
            </div>
          </div>
        </div>
      </div>

      {/* SEARCH AND TAG FILTER BAR */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-card p-4 rounded-2xl border border-border shadow-sm">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search dean by title, lead name (e.g. Anand Kumar), or topic..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-10 text-xs rounded-xl border-border bg-background"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <button
            type="button"
            onClick={() => setSelectedTag(null)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
              selectedTag === null
                ? "bg-primary text-primary-foreground font-bold shadow-xs"
                : "bg-muted/60 text-muted-foreground hover:bg-muted"
            }`}
          >
            All Deans (8)
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium cursor-pointer transition-all ${
                selectedTag === tag
                  ? "bg-primary text-primary-foreground font-bold shadow-xs"
                  : "bg-muted/60 text-muted-foreground hover:bg-muted"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* 8 CLICKABLE DEAN CARDS GRID */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {filteredDeans.map((dean, index) => {
          const Icon = ICON_COMPONENTS[dean.iconName] || GraduationCap;

          return (
            <div
              key={dean.id}
              onClick={() => navigate({ to: dean.route })}
              className="group relative flex flex-col justify-between rounded-3xl border border-border/80 bg-card p-6 shadow-sm hover:shadow-xl hover:border-primary/50 transition-all duration-300 cursor-pointer overflow-hidden transform hover:-translate-y-1"
            >
              {/* Card Accent Glow */}
              <div className="absolute -top-12 -right-12 size-32 rounded-full bg-primary/5 group-hover:bg-primary/10 transition-all blur-2xl pointer-events-none" />

              <div className="space-y-4">
                {/* Header Row */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300 shadow-xs">
                    <Icon className="size-6" />
                  </div>
                  <Badge variant="outline" className="font-mono text-[0.65rem] font-bold">
                    #{index + 1} DEAN
                  </Badge>
                </div>

                {/* Title & Description */}
                <div>
                  <h3 className="font-display text-lg font-extrabold text-foreground group-hover:text-primary transition-colors">
                    {dean.title}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1 font-medium">
                    <UserCheck className="size-3.5 text-primary" />
                    <span>{dean.leadPerson}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2 line-clamp-3 leading-relaxed">
                    {dean.description}
                  </p>
                </div>

                {/* Primary & Secondary Metrics Box */}
                <div className="grid grid-cols-2 gap-2 p-3 rounded-2xl bg-muted/40 border border-border/60 text-xs">
                  <div>
                    <span className="text-[0.65rem] uppercase font-bold text-muted-foreground block truncate">
                      {dean.primaryMetric.label}
                    </span>
                    <span className="font-mono font-extrabold text-foreground text-sm">
                      {dean.primaryMetric.value}
                    </span>
                  </div>
                  <div className="border-l border-border/60 pl-2">
                    <span className="text-[0.65rem] uppercase font-bold text-muted-foreground block truncate">
                      {dean.secondaryMetric.label}
                    </span>
                    <span className="font-mono font-extrabold text-primary text-sm">
                      {dean.secondaryMetric.value}
                    </span>
                  </div>
                </div>

                {/* Tags Badges */}
                <div className="flex flex-wrap gap-1 pt-1">
                  {dean.tags.slice(0, 3).map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="text-[0.625rem] font-mono font-normal bg-secondary/60"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Action Button Footer */}
              <div className="pt-5 mt-4 border-t border-border/60 flex items-center justify-between">
                <span className="text-xs font-bold text-primary group-hover:underline flex items-center gap-1">
                  Open Cockpit
                </span>
                <div className="flex size-8 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                  <ArrowRight className="size-4 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredDeans.length === 0 && (
        <div className="p-12 text-center bg-card rounded-3xl border border-dashed border-border space-y-3">
          <Sparkles className="size-8 text-muted-foreground mx-auto" />
          <h3 className="text-base font-bold">No Dean Cockpit Found</h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            No dean matches your search term "{searchQuery}". Try clearing search filters.
          </p>
          <Button onClick={() => { setSearchQuery(""); setSelectedTag(null); }} variant="outline" size="sm">
            Reset Filters
          </Button>
        </div>
      )}
    </div>
  );
}
