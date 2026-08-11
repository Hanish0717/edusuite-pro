import React from "react";
import { StudentProfileData } from "../types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bus, MapPin, Phone, Navigation, Clock, ShieldCheck, Radio } from "lucide-react";

interface TransportTabProps {
  student: StudentProfileData;
}

export function TransportTab({ student }: TransportTabProps) {
  const t = student.transport;
  const loc = t.currentBusLocation;

  return (
    <div className="space-y-6">
      
      {/* METRICS & DRIVER CARD */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-2">
          <div className="flex items-center gap-2">
            <Bus className="h-5 w-5 text-blue-600" />
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">Bus & Route Allotment</h4>
          </div>
          <div className="text-base font-bold text-slate-900 dark:text-white">{t.busNumber}</div>
          <p className="text-xs text-slate-500 font-medium">{t.routeName}</p>
          <Badge className="bg-blue-500/10 text-blue-600 text-[10px]">{t.passValidity}</Badge>
        </div>

        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-2">
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-emerald-600" />
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">Designated Stops</h4>
          </div>
          <div className="text-xs space-y-1">
            <div><span className="text-slate-400">Pickup:</span> <strong className="text-slate-900 dark:text-white">{t.pickupPoint}</strong></div>
            <div><span className="text-slate-400">Drop:</span> <strong className="text-slate-900 dark:text-white">{t.dropPoint}</strong></div>
            <div><span className="text-slate-400">Pickup Time:</span> <strong className="text-blue-600 font-mono">{t.pickupTime}</strong></div>
          </div>
        </div>

        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-2">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-purple-600" />
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">Assigned Bus Driver</h4>
          </div>
          <div className="text-sm font-bold text-slate-900 dark:text-white">{t.driverName}</div>
          <p className="font-mono text-blue-600 text-xs font-bold">{t.driverPhone}</p>
          <p className="text-[10px] text-slate-400">Emergency Transport Control Room</p>
        </div>

      </div>

      {/* LIVE TRACKING SIMULATOR */}
      {loc && (
        <div className="p-5 rounded-2xl border border-blue-200 dark:border-blue-900/40 bg-blue-50/40 dark:bg-blue-950/20 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Radio className="h-5 w-5 text-blue-600 animate-pulse" />
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">GPS Bus Live Telemetry & Tracking</h4>
            </div>
            <Badge className="bg-blue-600 text-white font-mono text-[10px]">LIVE GPS ACTIVE</Badge>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
            <div>
              <span className="text-slate-400 block text-[10px]">Speed</span>
              <strong className="text-slate-800 dark:text-slate-200 font-mono">{loc.speed}</strong>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Next Destination</span>
              <strong className="text-blue-600 truncate block">{loc.nextStop}</strong>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Estimated Arrival</span>
              <strong className="text-emerald-600 font-mono">{loc.etaMinutes} Minutes</strong>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Signal Status</span>
              <strong className="text-emerald-600">Optimal (4G IoT)</strong>
            </div>
          </div>
        </div>
      )}

      {/* ROUTE STOPS PROGRESSION */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm space-y-4">
        <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Navigation className="h-4 w-4 text-blue-600" /> Route Stops Timeline
        </h4>

        <div className="space-y-2">
          {t.routeStops.map((stop, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
              <div className="flex items-center gap-3">
                <div className={`h-3 w-3 rounded-full ${stop.passed ? "bg-emerald-500 ring-4 ring-emerald-100 dark:ring-emerald-950" : "bg-slate-300"}`} />
                <span className="text-xs font-bold text-slate-900 dark:text-white">{stop.stopName}</span>
              </div>
              <span className="font-mono text-xs text-slate-500 font-semibold">{stop.time}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
