import React, { useState } from "react";
import {
  Bus,
  Users,
  Navigation,
  UserCheck,
  MapPin,
  Phone,
  Search,
  ArrowRight,
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function TransportDashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRouteFilter, setSelectedRouteFilter] = useState("All Routes");

  // Live fleet dataset matching 2pic
  const fleetData = [
    {
      id: "BUS-01",
      routeLine: "Route 1",
      routeDetail: "Rajam to Vizianagaram",
      busNumber: "TS-09-UB-1001",
      driverName: "Satish Kumar",
      driverPhone: "9848011221",
      currentArea: "Garividi / Cheepurupalli Junction",
      occupancy: "48 / 50",
      telemetryStatus: "BROADCASTING LIVE",
    },
    {
      id: "BUS-02",
      routeLine: "Route 2",
      routeDetail: "Rajam to Palakonda",
      busNumber: "TS-09-UB-1002",
      driverName: "Mohammad Rafiq",
      driverPhone: "9848022332",
      currentArea: "Palakonda RTC Bus Complex",
      occupancy: "42 / 50",
      telemetryStatus: "BROADCASTING LIVE",
    },
    {
      id: "BUS-03",
      routeLine: "Route 3",
      routeDetail: "Rajam to Srikakulam (via Ranasthalam Road, NH16)",
      busNumber: "TS-09-UB-1003",
      driverName: "Ramesh Yadav",
      driverPhone: "9848033443",
      currentArea: "Ranasthalam Junction, NH16",
      occupancy: "46 / 50",
      telemetryStatus: "BROADCASTING LIVE",
    },
    {
      id: "BUS-04",
      routeLine: "Route 4",
      routeDetail: "Rajam to Visakhapatnam (Vizag Express)",
      busNumber: "TS-09-UB-1004",
      driverName: "K. Appala Naidu",
      driverPhone: "9848044554",
      currentArea: "Anakapalle Toll Plaza",
      occupancy: "38 / 50",
      telemetryStatus: "BROADCASTING LIVE",
    },
  ];

  const filteredFleet = fleetData.filter((bus) => {
    const matchesSearch =
      !searchQuery.trim() ||
      bus.routeLine.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bus.busNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bus.driverName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bus.currentArea.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRoute =
      selectedRouteFilter === "All Routes" || bus.routeLine === selectedRouteFilter;

    return matchesSearch && matchesRoute;
  });

  return (
    <div className="space-y-6 animate-fade-in-soft max-w-7xl mx-auto p-4 md:p-6">
      {/* Header Section matching 2pic */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-xs text-slate-400 font-medium mb-1">Dashboard</div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            Transport Management Workspace 🚌
          </h2>
          <p className="text-xs md:text-sm text-slate-500 mt-0.5">
            Real-time campus fleet overview, student pass verification, route analytics, and live GPS map tracking.
          </p>
        </div>

        <Button
          onClick={() => toast.success("Opening Live GPS Tracking Map Workspace...")}
          className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-extrabold text-xs rounded-2xl h-11 px-5 shadow-sm shrink-0 cursor-pointer flex items-center gap-2"
        >
          <Navigation className="size-4" /> Launch Live GPS Tracking Map &rarr;
        </Button>
      </div>

      {/* Top 4 KPI Summary Cards matching 2pic */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Card 1 */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-2xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[0.72rem] font-semibold text-slate-400 block">Active Fleet Buses</span>
            <div className="text-2xl font-black text-slate-900">14 Buses</div>
            <span className="text-[0.68rem] font-medium text-slate-400 block">12 On Route &bull; 2 Standby</span>
          </div>
          <div className="size-11 rounded-2xl bg-blue-50 text-[#2563eb] grid place-items-center shrink-0">
            <Bus className="size-5" />
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-2xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[0.72rem] font-semibold text-slate-400 block">Verified Student Commuters</span>
            <div className="text-2xl font-black text-slate-900">1,248</div>
            <span className="text-[0.68rem] font-medium text-slate-400 block">Active Pass Credentials</span>
          </div>
          <div className="size-11 rounded-2xl bg-blue-50 text-[#2563eb] grid place-items-center shrink-0">
            <Users className="size-5" />
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-2xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[0.72rem] font-semibold text-slate-400 block">Transit Lines / Routes</span>
            <div className="text-2xl font-black text-slate-900">4 Lines</div>
            <span className="text-[0.68rem] font-medium text-slate-400 block truncate max-w-[140px]">Vizag, Palakonda, Srikakulam, Vizianagaram</span>
          </div>
          <div className="size-11 rounded-2xl bg-blue-50 text-[#2563eb] grid place-items-center shrink-0">
            <Navigation className="size-5" />
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-2xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[0.72rem] font-semibold text-slate-400 block">On-Duty Driver Fleet</span>
            <div className="text-2xl font-black text-slate-900">14 Drivers</div>
            <span className="text-[0.68rem] font-medium text-slate-400 block">100% GPS Telemetry Enabled</span>
          </div>
          <div className="size-11 rounded-2xl bg-blue-50 text-[#2563eb] grid place-items-center shrink-0">
            <UserCheck className="size-5" />
          </div>
        </div>
      </div>

      {/* Sequential Real-Time GPS Transport Tracking Dark Banner Card matching 2pic */}
      <div className="relative overflow-hidden rounded-3xl bg-[#0f172a] text-white p-7 shadow-md border border-slate-800">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="relative flex size-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex size-2.5 rounded-full bg-emerald-500"></span>
              </span>
              <span className="font-mono text-[0.7rem] font-bold text-emerald-400 tracking-wider uppercase">
                100% Dynamic Telemetry Engine
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-black tracking-tight leading-snug">
              Sequential Real-Time GPS Transport Tracking
            </h3>

            <p className="text-xs text-slate-300 leading-relaxed">
              Verify student transit pass credentials, select commuting lines, activate mobile GPS, and track driver fleet pings live along turn-by-turn road geometry.
            </p>
          </div>

          <Button
            onClick={() => toast.success("Connecting to Live GPS Telemetry Stream...")}
            className="bg-[#10b981] hover:bg-[#059669] text-slate-950 font-extrabold text-xs rounded-2xl h-12 px-6 shadow-lg shadow-emerald-500/20 shrink-0 cursor-pointer transition-all flex items-center gap-2"
          >
            Open Live Tracking Map Workspace <ArrowRight className="size-4" />
          </Button>
        </div>
      </div>

      {/* Active Campus Fleet Status & Roster Table Card matching 2pic */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
              🚌 Active Campus Fleet Status & Roster
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Live operational status, driver contact info, and capacity metrics across all transit lines.
            </p>
          </div>

          <button
            type="button"
            onClick={() => toast.info("Opening full map telemetry workspace")}
            className="text-xs font-bold text-[#2563eb] hover:underline flex items-center gap-1 cursor-pointer shrink-0"
          >
            View Full Map & Telemetry &rarr;
          </button>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search bus, route, or driver..."
              className="pl-9 h-10 rounded-xl bg-slate-50 border-slate-200 text-xs focus-visible:ring-[#2563eb]"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto flex-wrap">
            <span className="text-xs font-semibold text-slate-400 shrink-0">Filter:</span>
            {["All Routes", "Route 1", "Route 2", "Route 3", "Route 4"].map((route) => (
              <button
                key={route}
                type="button"
                onClick={() => setSelectedRouteFilter(route)}
                className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  selectedRouteFilter === route
                    ? "bg-[#2563eb] text-white font-bold shadow-2xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {route}
              </button>
            ))}
          </div>
        </div>

        {/* Table matching 2pic */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[0.68rem]">
              <tr>
                <th className="p-4">Route Line</th>
                <th className="p-4">Bus Number</th>
                <th className="p-4">Assigned Driver</th>
                <th className="p-4">Current Live Area</th>
                <th className="p-4">Occupancy</th>
                <th className="p-4">Telemetry Status</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredFleet.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400 font-medium">
                    No matching transit fleet routes found.
                  </td>
                </tr>
              ) : (
                filteredFleet.map((bus) => (
                  <tr key={bus.id} className="hover:bg-slate-50/70 transition-all">
                    <td className="p-4">
                      <div className="font-extrabold text-slate-900">{bus.routeLine}</div>
                      <div className="text-[0.7rem] text-slate-500">{bus.routeDetail}</div>
                    </td>

                    <td className="p-4 font-extrabold text-[#2563eb] font-mono">
                      {bus.busNumber}
                    </td>

                    <td className="p-4">
                      <div className="font-bold text-slate-900">{bus.driverName}</div>
                      <div className="text-[0.7rem] text-slate-500 flex items-center gap-1">
                        <Phone className="size-3 text-slate-400" /> {bus.driverPhone}
                      </div>
                    </td>

                    <td className="p-4">
                      <div className="flex items-center gap-1.5 text-slate-800 font-semibold">
                        <MapPin className="size-3.5 text-rose-500 shrink-0" />
                        <span>{bus.currentArea}</span>
                      </div>
                    </td>

                    <td className="p-4 font-extrabold text-slate-900">
                      {bus.occupancy}
                    </td>

                    <td className="p-4">
                      <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 font-bold text-[0.65rem] px-2.5 py-0.5">
                        {bus.telemetryStatus}
                      </Badge>
                    </td>

                    <td className="p-4 text-right">
                      <Button
                        size="sm"
                        onClick={() => toast.success(`Tracking live pings for ${bus.busNumber} (${bus.routeLine})...`)}
                        className="bg-[#4f46e5] hover:bg-[#4338ca] text-white text-xs font-bold rounded-xl h-9 px-3.5 cursor-pointer shadow-2xs"
                      >
                        Track Bus &rarr;
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
