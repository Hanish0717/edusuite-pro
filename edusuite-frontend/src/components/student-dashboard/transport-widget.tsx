import React from "react";
import { TransportSnapshot } from "./types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bus, MapPin, Phone, ChevronRight } from "lucide-react";

interface TransportWidgetProps {
  transport: TransportSnapshot;
  onNavigate: (route: string) => void;
}

export function TransportWidget({ transport, onNavigate }: TransportWidgetProps) {
  return (
    <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4 flex flex-col justify-between">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
            <Bus className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              SECTION 12: TRANSPORT & SHUTTLE GPS
            </h3>
            <p className="text-[11px] text-slate-500 font-medium">
              Live Campus Transport Tracker
            </p>
          </div>
        </div>

        <Badge className="bg-indigo-500/10 text-indigo-600 border-indigo-500/20 text-[10px] font-mono">
          ETA {transport.eta}
        </Badge>
      </div>

      <div className="space-y-3 text-xs">
        <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-1">
          <span className="text-[10px] font-semibold text-slate-400 block">{transport.busNumber}</span>
          <span className="text-xs font-bold text-slate-900 dark:text-white block">
            {transport.todaysRoute}
          </span>
          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
            <span>Driver: {transport.driverName}</span>
            <span className="font-mono text-indigo-600 flex items-center gap-1 font-semibold">
              <Phone className="h-3 w-3" /> {transport.driverPhone}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 p-2 rounded-xl border border-slate-100 dark:border-slate-800 text-xs">
          <MapPin className="h-4 w-4 text-rose-500 animate-bounce shrink-0" />
          <div>
            <span className="text-[10px] text-slate-400 block">Current Bus Location</span>
            <strong className="text-xs font-bold text-slate-900 dark:text-white">
              {transport.currentLocation}
            </strong>
          </div>
        </div>
      </div>

      <Button
        onClick={() => onNavigate("/student/transport")}
        className="w-full h-9 text-xs rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold gap-1.5 shadow-xs"
      >
        Track Bus Live <ChevronRight className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}
