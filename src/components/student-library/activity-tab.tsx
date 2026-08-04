import React from "react";
import { ActivityLog } from "./types";
import { History, BookOpen, Clock, ShieldCheck, Download, LogIn, LogOut, BookmarkCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ActivityTabProps {
  activities: ActivityLog[];
}

export function ActivityTab({ activities }: ActivityTabProps) {
  const getIcon = (type: ActivityLog["type"]) => {
    switch (type) {
      case "Book Issued":
        return <BookOpen className="h-4 w-4 text-purple-600" />;
      case "Book Returned":
        return <BookOpen className="h-4 w-4 text-emerald-600" />;
      case "Fine Paid":
        return <ShieldCheck className="h-4 w-4 text-rose-600" />;
      case "E-Book Downloaded":
        return <Download className="h-4 w-4 text-indigo-600" />;
      case "Digital Library Login":
        return <LogIn className="h-4 w-4 text-indigo-500" />;
      case "Digital Library Logout":
        return <LogOut className="h-4 w-4 text-indigo-400" />;
      default:
        return <History className="h-4 w-4 text-slate-500" />;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
            <History className="h-5 w-5 text-purple-600" /> Institutional Library Activity Log ({activities.length})
          </h3>
          <p className="text-xs text-slate-500">
            Audit timeline of student loans, returns, e-book views, digital library visits, and fine receipts.
          </p>
        </div>
      </div>

      <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs space-y-4">
        {activities.length > 0 ? (
          <div className="relative border-l-2 border-slate-200 dark:border-slate-800 ml-4 space-y-6 py-2">
            {activities.map((act) => (
              <div key={act.id} className="relative pl-6 space-y-1">
                {/* Timeline node */}
                <div className="absolute -left-[17px] top-0 p-1.5 rounded-full bg-white dark:bg-slate-900 border-2 border-purple-500 shadow-2xs">
                  {getIcon(act.type)}
                </div>

                <div className="flex items-center justify-between gap-2">
                  <Badge variant="outline" className="text-[10px] font-mono border-slate-200">
                    {act.type}
                  </Badge>
                  <span className="text-[11px] font-mono text-slate-400">{act.timestamp}</span>
                </div>

                <h4 className="font-bold text-xs text-slate-900 dark:text-white">{act.title}</h4>
                <p className="text-xs text-slate-500 font-medium">{act.details}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-xs text-slate-500 italic">
            No activity log history recorded yet.
          </div>
        )}
      </div>
    </div>
  );
}
