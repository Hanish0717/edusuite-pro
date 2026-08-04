import React from "react";
import { HostelSnapshot } from "./types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Home, Utensils, ChevronRight } from "lucide-react";

interface HostelWidgetProps {
  hostel: HostelSnapshot;
  onNavigate: (route: string) => void;
}

export function HostelWidget({ hostel, onNavigate }: HostelWidgetProps) {
  return (
    <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4 flex flex-col justify-between">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
            <Home className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              SECTION 11: HOSTEL SNAPSHOT
            </h3>
            <p className="text-[11px] text-slate-500 font-medium">
              Accommodation & Today's Mess Menu
            </p>
          </div>
        </div>

        <Badge className="bg-cyan-500/10 text-cyan-600 border-cyan-500/20 text-[10px] font-mono">
          Room {hostel.roomNumber}
        </Badge>
      </div>

      <div className="space-y-3 text-xs">
        <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-1">
          <span className="text-[10px] font-semibold text-slate-400 block font-mono">Hostel Block: {hostel.block}</span>
          <div className="pt-1 space-y-0.5 text-[11px] text-slate-600 dark:text-slate-300">
            <p className="font-bold text-slate-900 dark:text-white flex items-center gap-1">
              <Utensils className="h-3 w-3 text-cyan-600" /> Today's Mess Menu:
            </p>
            <p>• Lunch: {hostel.messMenuToday.lunch}</p>
            <p>• Dinner: {hostel.messMenuToday.dinner}</p>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs p-2 rounded-xl border border-slate-100 dark:border-slate-800">
          <span className="text-slate-500">Gate Pass Clearance:</span>
          <Badge variant="outline" className="text-[10px] font-mono text-slate-600">
            {hostel.gatePassStatus}
          </Badge>
        </div>
      </div>

      <Button
        onClick={() => onNavigate("/student/hostel")}
        className="w-full h-9 text-xs rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white text-white font-semibold gap-1.5 shadow-xs"
      >
        Hostel Module <ChevronRight className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}
