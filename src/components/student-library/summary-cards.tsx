import React from "react";
import { LibrarySummaryMetrics } from "./types";
import { 
  BookOpen, 
  BookmarkCheck, 
  CreditCard, 
  ShieldCheck, 
  FileText, 
  Sparkles 
} from "lucide-react";

interface SummaryCardsProps {
  metrics: LibrarySummaryMetrics;
}

export function SummaryCards({ metrics }: SummaryCardsProps) {
  const cards = [
    {
      title: "Books Issued",
      value: `${metrics.booksIssued} / ${metrics.maxBorrowLimit}`,
      subtitle: `${metrics.maxBorrowLimit - metrics.booksIssued} slots remaining`,
      icon: BookOpen,
      iconBg: "bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400",
      accentBorder: "border-purple-500/20",
    },
    {
      title: "Books Reserved",
      value: `${metrics.booksReserved} Books`,
      subtitle: "Active holds in queue",
      icon: BookmarkCheck,
      iconBg: "bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400",
      accentBorder: "border-blue-500/20",
    },
    {
      title: "Pending Fine Amount",
      value: `₹${metrics.fineAmount.toFixed(2)}`,
      subtitle: metrics.fineAmount > 0 ? "1 overdue item pending" : "No pending fines",
      icon: CreditCard,
      iconBg: metrics.fineAmount > 0 
        ? "bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 animate-pulse" 
        : "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400",
      accentBorder: metrics.fineAmount > 0 ? "border-rose-500/30" : "border-emerald-500/20",
    },
    {
      title: "Borrowing Eligibility",
      value: `${metrics.availableBorrowLimit} Books`,
      subtitle: "Available check-out quota",
      icon: ShieldCheck,
      iconBg: "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400",
      accentBorder: "border-emerald-500/20",
    },
    {
      title: "Digital Resources",
      value: `${metrics.digitalResourcesCount}+`,
      subtitle: "Journals, E-Books & Papers",
      icon: FileText,
      iconBg: "bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400",
      accentBorder: "border-amber-500/20",
    },
    {
      title: "Recently Added",
      value: `${metrics.recentlyAddedBooksCount} New`,
      subtitle: "Added this semester",
      icon: Sparkles,
      iconBg: "bg-cyan-100 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400",
      accentBorder: "border-cyan-500/20",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      {cards.map((card, idx) => (
        <div
          key={idx}
          className={`p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs hover:shadow-md transition-all space-y-2 group relative overflow-hidden ${card.accentBorder}`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider truncate">
              {card.title}
            </span>
            <div className={`p-2 rounded-xl shrink-0 ${card.iconBg}`}>
              <card.icon className="h-4 w-4" />
            </div>
          </div>

          <div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
              {card.value}
            </h3>
            <p className="text-[10px] text-slate-400 font-medium truncate mt-0.5">{card.subtitle}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
