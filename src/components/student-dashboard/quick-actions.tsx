import React from "react";
import {
  FileText,
  CreditCard,
  Ticket,
  Award,
  BookPlus,
  BookOpen,
  QrCode,
  FileCheck2,
  Zap,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface QuickActionsProps {
  onNavigate: (url: string) => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({ onNavigate }) => {
  const actions = [
    { title: "Apply Leave", icon: FileText, url: "/grievance", color: "text-blue-500 bg-blue-500/10 border-blue-500/20" },
    { title: "Pay Fees", icon: CreditCard, url: "/student/finance", color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20" },
    { title: "Download Hall Ticket", icon: Ticket, url: "/student/examinations", color: "text-amber-500 bg-amber-500/10 border-amber-500/20" },
    { title: "View Results", icon: Award, url: "/student/examinations", color: "text-purple-500 bg-purple-500/10 border-purple-500/20" },
    { title: "Register Courses", icon: BookPlus, url: "/student/lms", color: "text-indigo-500 bg-indigo-500/10 border-indigo-500/20" },
    { title: "Open LMS", icon: BookOpen, url: "/student/lms", color: "text-cyan-500 bg-cyan-500/10 border-cyan-500/20" },
    { title: "Digital ID", icon: QrCode, url: "/student/profile", color: "text-rose-500 bg-rose-500/10 border-rose-500/20" },
    { title: "Bonafide Certificate", icon: FileCheck2, url: "/grievance", color: "text-teal-500 bg-teal-500/10 border-teal-500/20" },
  ];

  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-foreground flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" /> Quick Student Services
        </h3>
        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-primary/10 text-primary">
          8 Services
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {actions.map((act, idx) => {
          const Icon = act.icon;
          return (
            <button
              key={idx}
              onClick={() => onNavigate(act.url)}
              className="group p-3 rounded-xl border border-border/80 bg-card hover:bg-muted/40 hover:border-primary/40 transition-all flex flex-col items-center text-center space-y-2 cursor-pointer"
            >
              <div className={`p-2.5 rounded-xl border ${act.color} transition-transform group-hover:scale-110`}>
                <Icon className="h-5 w-5" />
              </div>
              <span className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                {act.title}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
