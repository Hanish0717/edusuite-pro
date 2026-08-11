import React from "react";
import { IdCardHistoryItem } from "./types";
import { Badge } from "@/components/ui/badge";
import { History, CheckCircle2, ShieldCheck, UserCheck, RefreshCw } from "lucide-react";

interface IdCardHistoryProps {
  history: IdCardHistoryItem[];
}

export function IdCardHistoryTimeline({ history }: IdCardHistoryProps) {
  return (
    <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <History className="h-4 w-4 text-blue-600" /> Identity Pass Lifecycle & Audit Log History
        </h3>
        <span className="text-xs text-slate-500 font-mono">Immutable Campus Audit Log</span>
      </div>

      <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-200 dark:before:bg-slate-800">
        {history.map((item) => (
          <div key={item.id} className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="absolute -left-[23px] top-1 h-3.5 w-3.5 rounded-full bg-blue-600 ring-4 ring-white dark:ring-slate-900" />

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">{item.title}</h4>
                <Badge variant="outline" className="text-[10px] text-blue-600 border-blue-300">
                  {item.statusBadge}
                </Badge>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400">{item.description}</p>
            </div>

            <div className="text-right text-[11px] text-slate-400 font-mono shrink-0">
              <div>{item.date}</div>
              <div className="text-slate-500 font-sans">{item.actor}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
