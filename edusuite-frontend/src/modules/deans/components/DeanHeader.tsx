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
  ChevronDown,
  LayoutGrid,
  ArrowLeft,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ALL_DEAN_PORTALS } from "../deansService";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  GraduationCap,
  Users,
  BadgeCheck,
  Building2,
  TrendingUp,
  Wallet,
  FileSpreadsheet,
  Briefcase,
};

interface DeanHeaderProps {
  activeDeanId: string;
  title: string;
  subtitle: string;
  badge: string;
}

export function DeanHeader({ activeDeanId, title, subtitle, badge }: DeanHeaderProps) {
  const navigate = useNavigate();
  const currentDean = ALL_DEAN_PORTALS.find((d) => d.id === activeDeanId);

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-4 mb-6">
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Link
            to="/staff"
            className="hover:text-primary transition-colors flex items-center gap-1 font-semibold"
          >
            <ArrowLeft className="size-3.5" /> Dean Selection Hub
          </Link>
          <span>/</span>
          <span className="text-foreground font-medium">{title}</span>
        </div>
        <div className="flex items-center gap-3">
          <h1 className="font-display text-2xl font-extrabold tracking-tight text-foreground">
            {title}
          </h1>
          <Badge className="bg-brand-gradient text-white font-mono text-[0.68rem] px-2.5 py-0.5 shadow-sm">
            {badge}
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground max-w-2xl">{subtitle}</p>
      </div>

      <div className="flex items-center gap-2">
        {/* Quick Dean Switcher Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="h-9 gap-2 border-primary/40 bg-card font-semibold text-xs cursor-pointer hover:bg-primary/5"
            >
              <LayoutGrid className="size-3.5 text-primary" />
              <span>Switch Dean Cockpit</span>
              <ChevronDown className="size-3.5 text-muted-foreground opacity-70" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64 p-1.5 shadow-xl">
            <DropdownMenuLabel className="text-[0.68rem] font-extrabold uppercase tracking-wider text-muted-foreground px-2 py-1">
              8 Dean Cockpits
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="my-1" />
            {ALL_DEAN_PORTALS.map((dean) => {
              const Icon = ICON_MAP[dean.iconName] || GraduationCap;
              const isActive = dean.id === activeDeanId;
              return (
                <DropdownMenuItem
                  key={dean.id}
                  onClick={() => navigate({ to: dean.route })}
                  className={`flex items-center gap-2.5 text-xs font-semibold px-2 py-2 rounded-lg cursor-pointer transition-colors ${
                    isActive
                      ? "bg-primary text-primary-foreground font-bold"
                      : "hover:bg-accent hover:text-accent-foreground"
                  }`}
                >
                  <Icon className={`size-4 ${isActive ? "text-primary-foreground" : "text-primary"}`} />
                  <div className="flex flex-col min-w-0">
                    <span className="truncate">{dean.title}</span>
                    <span
                      className={`text-[0.65rem] truncate font-normal ${
                        isActive ? "text-primary-foreground/80" : "text-muted-foreground"
                      }`}
                    >
                      {dean.leadPerson}
                    </span>
                  </div>
                </DropdownMenuItem>
              );
            })}
            <DropdownMenuSeparator className="my-1" />
            <DropdownMenuItem
              onClick={() => navigate({ to: "/staff" })}
              className="text-xs font-bold text-primary flex items-center justify-center gap-1.5 py-2 cursor-pointer"
            >
              <LayoutGrid className="size-3.5" /> View All 8 Dean Cards
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button
          size="sm"
          variant="secondary"
          onClick={() => navigate({ to: "/staff" })}
          className="h-9 text-xs font-semibold cursor-pointer gap-1.5"
        >
          <LayoutGrid className="size-3.5" /> All Deans
        </Button>
      </div>
    </div>
  );
}
