import { ShieldCheck, UserCheck, Laptop, Clock } from "lucide-react";
import type { FacultySettingsSummaryStats } from "./types";

interface SummaryCardsProps {
  stats: FacultySettingsSummaryStats;
}

export function SummaryCards({ stats }: SummaryCardsProps) {
  const cards = [
    {
      label: "Account Status",
      value: stats.accountStatus,
      icon: UserCheck,
    },
    {
      label: "Security Status",
      value: stats.securityStatus,
      icon: ShieldCheck,
    },
    {
      label: "Active Devices",
      value: `${stats.activeDevicesCount} Sessions`,
      icon: Laptop,
    },
    {
      label: "Last Login",
      value: stats.lastLogin,
      icon: Clock,
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.label}
            className="relative overflow-hidden rounded-2xl border border-blue-500/20 dark:border-blue-500/30 bg-blue-500/8 p-4 flex flex-col gap-2 shadow-sm hover:shadow-md hover:shadow-blue-500/10 hover:border-blue-500/30 transition-all duration-300 hover:-translate-y-0.5 cursor-default"
          >
            <div className="size-8 rounded-xl flex items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600 shadow-sm">
              <Icon className="size-4 text-white" />
            </div>
            <p className="text-xl font-extrabold tabular-nums text-blue-600 dark:text-blue-400">{card.value}</p>
            <p className="text-[0.68rem] font-bold text-muted-foreground uppercase tracking-wide leading-tight">{card.label}</p>
          </div>
        );
      })}
    </div>
  );
}
