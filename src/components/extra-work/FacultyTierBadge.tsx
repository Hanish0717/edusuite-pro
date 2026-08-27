import React, { useState } from "react";
import { Shield, Trophy, Medal, Crown, Gem, Sparkles, Star, Info, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export type TierLevel = "BRONZE" | "SILVER" | "GOLD" | "PLATINUM" | "DIAMOND";

export interface TierConfig {
  level: TierLevel;
  name: string;
  minPoints: number;
  maxPoints: number | string;
  icon: React.ElementType;
  colorName: string;
  badgeBgClass: string;
  badgeTextClass: string;
  borderClass: string;
  glowClass: string;
  gradientClass: string;
  iconColorClass: string;
  ribbonColorClass: string;
  sparkleColor: string;
  description: string;
}

export const TIER_CONFIGS: Record<TierLevel, TierConfig> = {
  BRONZE: {
    level: "BRONZE",
    name: "Bronze Extra Contributor",
    minPoints: 0,
    maxPoints: 499,
    icon: Shield,
    colorName: "Bronze",
    badgeBgClass: "bg-amber-950/20 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border-amber-600/40",
    badgeTextClass: "text-amber-700 dark:text-amber-400",
    borderClass: "border-amber-600 dark:border-amber-500",
    glowClass: "shadow-[0_0_20px_rgba(217,119,6,0.4)]",
    gradientClass: "from-amber-700 via-amber-600 to-amber-800",
    iconColorClass: "text-amber-100",
    ribbonColorClass: "bg-amber-800 text-amber-100",
    sparkleColor: "text-amber-400",
    description: "Foundational extra contributor actively participating in department events & mentoring.",
  },
  SILVER: {
    level: "SILVER",
    name: "Silver Extra Contributor",
    minPoints: 500,
    maxPoints: 999,
    icon: Medal,
    colorName: "Silver",
    badgeBgClass: "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-600",
    badgeTextClass: "text-slate-700 dark:text-slate-300",
    borderClass: "border-slate-300 dark:border-slate-400",
    glowClass: "shadow-[0_0_20px_rgba(203,213,225,0.45)]",
    gradientClass: "from-slate-300 via-zinc-200 to-slate-500",
    iconColorClass: "text-slate-800 dark:text-slate-100",
    ribbonColorClass: "bg-slate-600 text-slate-100",
    sparkleColor: "text-slate-300",
    description: "Consistent contributor showing strong leadership in institutional initiatives.",
  },
  GOLD: {
    level: "GOLD",
    name: "Gold Extra Contributor",
    minPoints: 1000,
    maxPoints: 1999,
    icon: Trophy,
    colorName: "Gold",
    badgeBgClass: "bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-yellow-400/60",
    badgeTextClass: "text-yellow-600 dark:text-yellow-400",
    borderClass: "border-yellow-400 dark:border-yellow-500",
    glowClass: "shadow-[0_0_25px_rgba(250,204,21,0.55)]",
    gradientClass: "from-yellow-400 via-amber-300 to-yellow-600",
    iconColorClass: "text-yellow-950 dark:text-yellow-900",
    ribbonColorClass: "bg-yellow-600 text-yellow-50",
    sparkleColor: "text-yellow-300",
    description: "High-impact academic leader spearheading research grants, NAAC/NIRF & patents.",
  },
  PLATINUM: {
    level: "PLATINUM",
    name: "Platinum Extra Contributor",
    minPoints: 2000,
    maxPoints: 3499,
    icon: Crown,
    colorName: "Platinum",
    badgeBgClass: "bg-cyan-50 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-300 border-cyan-400/60",
    badgeTextClass: "text-cyan-600 dark:text-cyan-300",
    borderClass: "border-cyan-300 dark:border-cyan-400",
    glowClass: "shadow-[0_0_25px_rgba(103,232,249,0.55)]",
    gradientClass: "from-cyan-300 via-teal-200 to-blue-500",
    iconColorClass: "text-cyan-950 dark:text-cyan-900",
    ribbonColorClass: "bg-cyan-700 text-cyan-50",
    sparkleColor: "text-cyan-200",
    description: "Elite faculty driving institution-wide transformation & strategic partnerships.",
  },
  DIAMOND: {
    level: "DIAMOND",
    name: "Diamond Extra Contributor",
    minPoints: 3500,
    maxPoints: "Max Tier",
    icon: Gem,
    colorName: "Diamond",
    badgeBgClass: "bg-indigo-50 dark:bg-purple-950/60 text-indigo-700 dark:text-purple-300 border-indigo-400/60",
    badgeTextClass: "text-indigo-600 dark:text-indigo-300",
    borderClass: "border-indigo-300 dark:border-indigo-400",
    glowClass: "shadow-[0_0_30px_rgba(168,85,247,0.6)]",
    gradientClass: "from-blue-400 via-indigo-400 to-violet-600",
    iconColorClass: "text-white",
    ribbonColorClass: "bg-purple-700 text-purple-50",
    sparkleColor: "text-indigo-200",
    description: "Pinnacle of academic excellence with extraordinary institutional & national impact.",
  },
};

interface FacultyTierBadgeProps {
  level: TierLevel;
  totalWWP?: number;
  size?: "sm" | "md" | "lg" | "xl";
  showClickableRoadmap?: boolean;
  className?: string;
}

export function FacultyTierBadge({
  level = "BRONZE",
  totalWWP = 370,
  size = "md",
  showClickableRoadmap = true,
  className = "",
}: FacultyTierBadgeProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const config = TIER_CONFIGS[level] || TIER_CONFIGS.BRONZE;
  const IconComponent = config.icon;

  // Size specific styling configurations
  const sizeStyles = {
    sm: {
      container: "size-8",
      icon: "size-4",
      sparkle: "size-2",
      badgePill: "text-[10px] px-2 py-0.5",
    },
    md: {
      container: "size-11 sm:size-12",
      icon: "size-5 sm:size-6",
      sparkle: "size-3",
      badgePill: "text-xs px-2.5 py-1",
    },
    lg: {
      container: "size-14 sm:size-16",
      icon: "size-7 sm:size-8",
      sparkle: "size-4",
      badgePill: "text-sm px-3 py-1",
    },
    xl: {
      container: "size-20 sm:size-24",
      icon: "size-10 sm:size-12",
      sparkle: "size-5",
      badgePill: "text-base px-4 py-1.5",
    },
  }[size];

  return (
    <>
      <div
        onClick={() => showClickableRoadmap && setIsModalOpen(true)}
        className={`group relative inline-flex items-center gap-3 ${
          showClickableRoadmap ? "cursor-pointer" : ""
        } ${className}`}
        title={`Click to view ${config.name} progression roadmap`}
      >
        {/* ANIMATED BADGE EMBLEM WRAPPER */}
        <div className="relative flex items-center justify-center">
          {/* AMBIENT PULSING GLOW AURA */}
          <div
            className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${config.gradientClass} blur-md opacity-70 animate-badge-glow ${config.glowClass}`}
          />

          {/* MAIN 3D SHIELD BADGE CONTAINER */}
          <div
            className={`relative ${sizeStyles.container} rounded-2xl bg-gradient-to-br ${config.gradientClass} border-2 ${config.borderClass} ${config.glowClass} flex items-center justify-center overflow-hidden transition-all duration-300 transform group-hover:scale-105 animate-badge-float shadow-lg`}
          >
            {/* LIGHT SHIMMERY PASS OVERLAY */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-badge-shimmer" />

            {/* TOP SPARKLE ICON */}
            <Sparkles
              className={`absolute top-0.5 right-0.5 ${sizeStyles.sparkle} ${config.sparkleColor} animate-badge-sparkle`}
            />

            {/* TIER EMBLEM ICON */}
            <IconComponent
              className={`relative z-10 ${sizeStyles.icon} ${config.iconColorClass} drop-shadow-md transition-transform duration-300 group-hover:rotate-6`}
            />

            {/* BOTTOM RIBBON SHINE STRIP */}
            <div className="absolute bottom-0 inset-x-0 h-1.5 bg-white/30 backdrop-blur-xs" />
          </div>
        </div>

        {/* BADGE LABEL & TIER TEXT */}
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <Badge
              variant="outline"
              className={`font-extrabold uppercase tracking-wider font-mono ${config.badgeBgClass} ${sizeStyles.badgePill} transition-all duration-300 group-hover:brightness-110 shadow-2xs rounded-lg`}
            >
              <Star className="size-3 fill-current mr-1 animate-pulse" />
              {config.colorName} BADGE
            </Badge>
          </div>
        </div>
      </div>

      {/* TIER ROADMAP DIALOG (BRONZE -> SILVER -> GOLD -> PLATINUM -> DIAMOND) */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white max-w-xl rounded-2xl p-6">
          <DialogHeader>
            <div className="flex items-center gap-2 text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
              <Info className="size-4" />
              <span>Faculty Merit Badge System Roadmap</span>
            </div>
            <DialogTitle className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">
              Tier Progression & Color Evolution
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500 dark:text-slate-400">
              Complete tasks to automatically advance your badge color from Bronze to Diamond!
            </DialogDescription>
          </DialogHeader>

          {/* ALL 5 TIERS SHOWCASE ROADMAP */}
          <div className="space-y-3 my-3">
            {(Object.keys(TIER_CONFIGS) as TierLevel[]).map((tKey) => {
              const itemConfig = TIER_CONFIGS[tKey];
              const ItemIcon = itemConfig.icon;
              const isCurrent = tKey === level;

              return (
                <div
                  key={tKey}
                  className={`flex items-center justify-between p-3 rounded-2xl border transition-all ${
                    isCurrent
                      ? `bg-slate-50 dark:bg-slate-800/80 ${itemConfig.borderClass} ${itemConfig.glowClass} ring-2 ring-blue-500/20`
                      : "bg-slate-50/50 dark:bg-slate-950/40 border-slate-200/60 dark:border-slate-800 opacity-80"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {/* MINI EMBLEM */}
                    <div
                      className={`size-10 rounded-xl bg-gradient-to-br ${itemConfig.gradientClass} border ${itemConfig.borderClass} flex items-center justify-center shadow-xs shrink-0`}
                    >
                      <ItemIcon className={`size-5 ${itemConfig.iconColorClass}`} />
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                          {itemConfig.name}
                        </h4>
                        {isCurrent && (
                          <Badge className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                            <CheckCircle2 className="size-3" /> Active Tier
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        {itemConfig.description}
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="font-mono text-xs font-bold text-slate-900 dark:text-white block">
                      {itemConfig.minPoints}{" "}
                      {typeof itemConfig.maxPoints === "number"
                        ? `- ${itemConfig.maxPoints}`
                        : "+"}{" "}
                      WWP
                    </span>
                    <span
                      className={`text-[10px] font-semibold ${itemConfig.badgeTextClass}`}
                    >
                      {itemConfig.colorName} Theme
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-3 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 rounded-xl text-xs text-blue-900 dark:text-blue-200 flex items-center justify-between">
            <span>
              Current Verified WWP: <strong>{totalWWP} WWP</strong>
            </span>
            <Button
              size="sm"
              onClick={() => setIsModalOpen(false)}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs rounded-xl h-7 px-3"
            >
              Close Roadmap
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
