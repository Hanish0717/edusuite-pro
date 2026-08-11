import React from "react";
import { TransportSnapshot } from "./types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bus, MapPin, Phone, Clock, ChevronRight } from "lucide-react";

interface TransportCardProps {
  transport: TransportSnapshot;
  onNavigate: (route: string) => void;
}

export function StudentTransportCard({ transport, onNavigate }: TransportCardProps) {
  return (
    <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4 flex flex-col justify-between">
      {/* HEADER */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
            <Bus className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Campus Transport & Fleet GPS
            </h3>
            <p className="text-[11px] text-slate-500 font-medium">
              Live Shuttle Tracking & Route
            </p>
          </div>
        </div>

        <Badge className="bg-indigo-500/10 text-indigo-600 border-indigo-500/20 text-[10px] font-mono">
          ETA {transport.eta}
        </Badge>
      </div>

      {/* METRICS DISPLAY */}
      <div className="space-y-3">
        <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-1">
          <span className="text-[10px] font-semibold text-slate-400 block">{transport.busNumber}</span>
          <span className="text-xs font-bold text-slate-900 dark:text-white block">
            {transport.route}
          </span>
          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
            <span>Driver: {transport.driverName}</span>
            <span className="font-mono text-indigo-600 flex items-center gap-1">
              <Phone className="h-3 w-3" /> {transport.driverPhone}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 p-2 rounded-xl border border-slate-100 dark:border-slate-800 text-xs">
          <MapPin className="h-4 w-4 text-rose-500 animate-bounce" />
          <div>
            <span className="text-[10px] text-slate-400 block">Current Bus Location</span>
            <strong className="text-xs font-bold text-slate-900 dark:text-white">
              {transport.currentLocation}
            </strong>
          </div>
        </div>
      </div>

      {/* FOOTER ACTION */}
      <Button
        onClick={() => onNavigate("/student/transport")}
        className="w-full h-9 text-xs rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold gap-1.5 shadow-xs"
      >
        Track Live Bus GPS <ChevronRight className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}
