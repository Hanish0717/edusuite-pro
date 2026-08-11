import React, { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  Bus,
  Search,
  User,
  Plus,
  ArrowLeft,
  CheckCircle2,
  MapPin,
  Phone,
  MessageSquare,
  Sparkles,
  ShieldCheck,
  X,
  Check,
  CreditCard,
  Navigation,
  Lock,
  Users,
  UserCheck,
  ArrowRight,
  Wallet,
  Activity,
  Send,
  DollarSign,
  Printer,
  Bell,
  Info,
  AlertTriangle,
  Edit3,
  Github,
  Linkedin,
  Twitter,
  Globe,
  RefreshCw,
  Download,
  AlertCircle,
  FileText,
  Sliders,
  BarChart3,
  Calendar,
  Clock,
  Zap,
  BellRing,
  PieChart,
  ShieldAlert,
  Filter,
  FileSpreadsheet,
  FileCheck,
  Gauge,
  Fuel,
  Wrench,
  Eye,
  Loader2,
  TrendingUp,
  PhoneCall,
  Flame,
  History,
  Award,
  TrendingDown,
  BrainCircuit,
  CheckSquare,
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

// ============================================================================
// 1. TRANSPORT DASHBOARD OVERVIEW VIEW (For /transport/dashboard)
// ============================================================================
export function TransportDashboardView() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRouteFilter, setSelectedRouteFilter] = useState("All Routes");

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
    <div className="space-y-6 animate-fade-in-soft max-w-7xl mx-auto p-4 md:p-6 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-xs text-slate-400 font-medium mb-1">
            <Link to="/dashboard" className="hover:text-indigo-600 transition-colors">
              Dashboard
            </Link>{" "}
            / <span className="text-slate-900 font-bold">Transport</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            Transport Management Workspace 🚌
          </h1>
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

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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

      <div className="relative overflow-hidden rounded-3xl bg-[#0f172a] text-white p-7 shadow-md border border-slate-800">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="relative flex size-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex size-2.5 rounded-full bg-emerald-500" />
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
              {filteredFleet.map((bus) => (
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
                  <td className="p-4 font-extrabold text-slate-900">{bus.occupancy}</td>
                  <td className="p-4">
                    <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 font-bold text-[0.65rem] px-2.5 py-0.5">
                      {bus.telemetryStatus}
                    </Badge>
                  </td>
                  <td className="p-4 text-right">
                    <Button
                      size="sm"
                      onClick={() => toast.success(`Tracking live pings for ${bus.busNumber}...`)}
                      className="bg-[#4f46e5] hover:bg-[#4338ca] text-white text-xs font-bold rounded-xl h-9 px-3.5 cursor-pointer shadow-2xs"
                    >
                      Track Bus &rarr;
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 2. TRANSPORT VERIFICATION & ROUTE SELECTION VIEW (For /transport/buses)
// ============================================================================
export interface RouteItem {
  id: string;
  name: string;
  regNumber: string;
  path: string;
  driver: string;
  driverPhone?: string;
  price: string;
  isPopular?: boolean;
}

const DEFAULT_ROUTES: RouteItem[] = [
  {
    id: "route-1",
    name: "Route 1",
    regNumber: "TS 09 UB 1001",
    path: "Rajam to Vizianagaram",
    driver: "Satish Kumar",
    driverPhone: "9848011221",
    price: "₹2,200 / Month",
  },
  {
    id: "route-2",
    name: "Route 2",
    regNumber: "TS 09 UB 1002",
    path: "Rajam to Palakonda",
    driver: "Mohammad Rafiq",
    driverPhone: "9848022332",
    price: "₹1,500 / Month",
  },
  {
    id: "route-3",
    name: "Route 3",
    regNumber: "TS 09 UB 1003",
    path: "Rajam to Srikakulam (via Ranasthalam Road, NH16)",
    driver: "Ramesh Yadav",
    driverPhone: "9848033443",
    price: "₹1,800 / Month",
  },
  {
    id: "route-4",
    name: "Route 4",
    regNumber: "TS 09 UB 1004",
    path: "Rajam to Visakhapatnam (Vizag Express)",
    driver: "K. Appala Naidu",
    driverPhone: "9848044554",
    price: "₹3,500 / Month",
  },
];

export function TransportVerificationView() {
  const navigate = useNavigate();

  const [studentName, setStudentName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [verifiedStudent, setVerifiedStudent] = useState<{
    name: string;
    rollNo: string;
    dept: string;
    passStatus: string;
    validTill: string;
  } | null>(null);

  const [selectedRouteId, setSelectedRouteId] = useState<string>("route-2");
  const [routes, setRoutes] = useState<RouteItem[]>(DEFAULT_ROUTES);

  const [studentGpsActive, setStudentGpsActive] = useState(false);
  const [driverBroadcastActive, setDriverBroadcastActive] = useState(false);

  const [isAddRouteOpen, setIsAddRouteOpen] = useState(false);
  const [newRouteData, setNewRouteData] = useState({
    name: "",
    regNumber: "",
    path: "",
    driver: "",
    price: "",
  });

  const handleSelectQuickTag = (name: string, rollNo: string) => {
    setStudentName(name);
    setStudentId(rollNo);
    setVerifiedStudent({
      name,
      rollNo,
      dept: name.includes("Meka") ? "Computer Science (CSE)" : "Electronics (ECE)",
      passStatus: "VERIFIED ACTIVE PASS",
      validTill: "DEC 2026",
    });
    toast.success(`Verified transit pass for ${name} (${rollNo})`);
  };

  const handleVerifyPass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim() && !studentId.trim()) {
      toast.error("Please enter Student Name or Roll Number");
      return;
    }
    const name = studentName.trim() || "Meka Tarun";
    const roll = studentId.trim() || "CSE26001";
    setVerifiedStudent({
      name,
      rollNo: roll,
      dept: "Engineering Department",
      passStatus: "VERIFIED ACTIVE PASS",
      validTill: "DEC 2026",
    });
    toast.success(`Active transit pass verified for ${name}!`);
  };

  const handleAddRouteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRouteData.name || !newRouteData.path) {
      toast.error("Please fill in the route name and path details");
      return;
    }

    const newId = `route-${routes.length + 1}`;
    const newRoute: RouteItem = {
      id: newId,
      name: newRouteData.name,
      regNumber: newRouteData.regNumber || `TS 09 UB 100${routes.length + 1}`,
      path: newRouteData.path,
      driver: newRouteData.driver || "Unassigned Driver",
      price: newRouteData.price ? `₹${newRouteData.price} / Month` : "₹2,000 / Month",
    };

    setRoutes([...routes, newRoute]);
    setSelectedRouteId(newId);
    setIsAddRouteOpen(false);
    setNewRouteData({ name: "", regNumber: "", path: "", driver: "", price: "" });
    toast.success(`Added new route "${newRoute.name}" (${newRoute.path})`);
  };

  const handleEnableGpsButton = () => {
    if (!studentGpsActive || !driverBroadcastActive) {
      setStudentGpsActive(true);
      setDriverBroadcastActive(true);
      toast.success("Activated Student GPS & Driver Broadcast Telemetry!");
    } else {
      toast.success("Launching Live GPS Map Workspace...");
    }
  };

  const isBothGpsActive = studentGpsActive && driverBroadcastActive;

  return (
    <div className="space-y-6 animate-fade-in-soft max-w-7xl mx-auto p-2 sm:p-4 md:p-6 pb-24 relative">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <nav className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mb-1">
            <Link to="/dashboard" className="hover:text-indigo-600 transition-colors">
              Dashboard
            </Link>
            <span>/</span>
            <span className="text-slate-900 font-bold">Transport</span>
          </nav>

          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            Transport Verification & Route Selection 🚌
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-3xl">
            Verify student credentials, select transit line, and activate live GPS before launching the real-time map page.
          </p>
        </div>

        <Button
          variant="outline"
          onClick={() => navigate({ to: "/dashboard" })}
          className="bg-white border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-full h-10 px-5 shadow-2xs shrink-0 cursor-pointer self-start sm:self-auto flex items-center gap-2"
        >
          <ArrowLeft className="size-4" /> Back to Dashboard
        </Button>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs space-y-5">
        <div className="flex items-start gap-3.5">
          <div className="size-9 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 font-black text-sm grid place-items-center shrink-0">
            1
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-extrabold text-slate-900">
              Step 1: Student Pass Verification Portal
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Search student credentials to verify active transit pass and unlock route map.
            </p>
          </div>
        </div>

        <form onSubmit={handleVerifyPass} className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 pt-1">
          <div className="flex flex-col sm:flex-row items-center gap-3 flex-1 min-w-0">
            <div className="relative w-full sm:w-64 md:w-72">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
              <Input
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder="Student Name (e.g. Meka Tarun)"
                className="pl-11 h-12 rounded-full bg-slate-50/90 border-slate-200 text-xs text-slate-800 focus-visible:ring-indigo-500 shadow-2xs"
              />
            </div>

            <div className="relative w-full sm:w-64 md:w-72">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
              <Input
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                placeholder="Student ID / Roll Number (e.g. CSE26001)"
                className="pl-11 h-12 rounded-full bg-slate-50/90 border-slate-200 text-xs text-slate-800 focus-visible:ring-indigo-500 shadow-2xs"
              />
            </div>

            <Button
              type="submit"
              className="bg-[#4f46e5] hover:bg-indigo-700 text-white font-extrabold text-xs rounded-full h-12 px-7 cursor-pointer shadow-md transition-all shrink-0 w-full sm:w-auto"
            >
              Verify Pass
            </Button>
          </div>

          <div className="flex items-center gap-2 self-start lg:self-center shrink-0 pt-2 lg:pt-0">
            <button
              type="button"
              onClick={() => handleSelectQuickTag("Meka Tarun", "22CSE045")}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-full px-4 py-2 transition-all cursor-pointer shadow-2xs"
            >
              Meka Tarun
            </button>
            <button
              type="button"
              onClick={() => handleSelectQuickTag("Yelamanchili Akhil", "22ECE012")}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-full px-4 py-2 transition-all cursor-pointer shadow-2xs"
            >
              Yelamanchili Akhil
            </button>
          </div>
        </form>

        {verifiedStudent && (
          <div className="mt-3 bg-emerald-50/80 border border-emerald-200/90 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fade-in-soft">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-full bg-emerald-500 text-white grid place-items-center shrink-0 font-bold">
                <ShieldCheck className="size-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-sm text-slate-900">
                    {verifiedStudent.name} ({verifiedStudent.rollNo})
                  </span>
                  <Badge className="bg-emerald-600 text-white text-[0.65rem] font-black px-2 py-0.5 rounded-md uppercase">
                    {verifiedStudent.passStatus}
                  </Badge>
                </div>
                <p className="text-xs text-emerald-800 mt-0.5">
                  {verifiedStudent.dept} &bull; Valid Through {verifiedStudent.validTill} &bull; Allocated Route Unlocked
                </p>
              </div>
            </div>

            <Button
              size="sm"
              onClick={() => toast.info("Printing Digital Transport Pass...")}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl h-9 px-4 cursor-pointer shrink-0"
            >
              <CreditCard className="size-3.5 mr-1.5" /> Download Pass PDF
            </Button>
          </div>
        )}
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base sm:text-lg font-extrabold text-slate-900">
              Select Transit Route
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Pick your daily commuting line from GMRIT Campus.
            </p>
          </div>

          <Button
            onClick={() => setIsAddRouteOpen(true)}
            className="bg-[#00a884] hover:bg-[#008f70] text-white font-extrabold text-xs rounded-full h-10 px-5 cursor-pointer shadow-sm flex items-center gap-1.5 transition-all shrink-0 self-start sm:self-auto"
          >
            <Plus className="size-4" /> Add Custom Route
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {routes.map((route) => {
            const isSelected = route.id === selectedRouteId;
            return (
              <div
                key={route.id}
                onClick={() => {
                  setSelectedRouteId(route.id);
                  toast.success(`Selected ${route.name}: ${route.path}`);
                }}
                className={`rounded-2xl p-5 transition-all cursor-pointer space-y-3 relative ${
                  isSelected
                    ? "bg-[#f0f3ff] border-2 border-[#6366f1] shadow-sm"
                    : "bg-[#f8fafc] border border-slate-200/80 hover:border-indigo-300 hover:bg-slate-100/60"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`font-extrabold text-sm ${
                      isSelected ? "text-[#4f46e5]" : "text-slate-900"
                    }`}
                  >
                    {route.name}
                  </span>
                  <span className="text-[11px] font-mono font-semibold text-slate-400 tracking-wider">
                    {route.regNumber}
                  </span>
                </div>

                <h3 className="font-bold text-sm sm:text-base text-slate-900 leading-snug">
                  {route.path}
                </h3>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs font-medium text-slate-500">
                    Driver: {route.driver}
                  </span>
                  <span className="font-extrabold text-xs text-[#00a884]">
                    {route.price}
                  </span>
                </div>

                {isSelected && (
                  <div className="absolute right-3.5 bottom-3.5 size-2 rounded-full bg-[#6366f1] shadow-2xs" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-[#0b132b] rounded-3xl p-5 sm:px-7 border border-slate-800 shadow-xl flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 transition-all">
        <div className="flex flex-wrap items-center gap-3">
          <span className="font-extrabold text-xs sm:text-sm text-slate-200 tracking-wide shrink-0">
            GPS Activation Status:
          </span>

          <button
            type="button"
            onClick={() => {
              const nextState = !studentGpsActive;
              setStudentGpsActive(nextState);
              toast.info(nextState ? "Student GPS Permission Granted" : "Student GPS Disabled");
            }}
            className={`font-semibold text-xs rounded-full px-3.5 py-1.5 transition-all cursor-pointer flex items-center gap-1.5 border ${
              studentGpsActive
                ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40"
                : "bg-slate-800/90 text-slate-400 hover:text-slate-200 border-slate-700/80"
            }`}
          >
            {studentGpsActive ? (
              <>
                <Check className="size-3.5 text-emerald-400" />
                <span>Student GPS Active</span>
              </>
            ) : (
              <>
                <X className="size-3.5 text-slate-400" />
                <span>Student GPS Off</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => {
              const nextState = !driverBroadcastActive;
              setDriverBroadcastActive(nextState);
              toast.info(nextState ? "Driver Broadcast Signal Active" : "Driver Broadcast Disabled");
            }}
            className={`font-semibold text-xs rounded-full px-3.5 py-1.5 transition-all cursor-pointer flex items-center gap-1.5 border ${
              driverBroadcastActive
                ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40"
                : "bg-slate-800/90 text-slate-400 hover:text-slate-200 border-slate-700/80"
            }`}
          >
            {driverBroadcastActive ? (
              <>
                <Check className="size-3.5 text-emerald-400" />
                <span>Driver Broadcast Active</span>
              </>
            ) : (
              <>
                <X className="size-3.5 text-slate-400" />
                <span>Driver Broadcast Off</span>
              </>
            )}
          </button>
        </div>

        <button
          type="button"
          onClick={handleEnableGpsButton}
          className={`font-extrabold text-xs sm:text-sm rounded-full h-12 px-7 cursor-pointer shadow-lg transition-all flex items-center justify-center gap-2 shrink-0 ${
            isBothGpsActive
              ? "bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/20"
              : "bg-gradient-to-r from-[#6366f1] via-[#4f46e5] to-[#4338ca] hover:from-indigo-600 hover:to-indigo-700 text-white shadow-indigo-500/25"
          }`}
        >
          {isBothGpsActive ? (
            <>
              <span>Open Live GPS Map Workspace</span>
              <Navigation className="size-4" />
            </>
          ) : (
            <>
              <Lock className="size-4 text-amber-300" />
              <span>Enable Both GPS Permissions Above to Open Map &rarr;</span>
            </>
          )}
        </button>
      </div>

      <Dialog open={isAddRouteOpen} onOpenChange={setIsAddRouteOpen}>
        <DialogContent className="sm:max-w-md rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <Bus className="size-5 text-emerald-600" /> Add Custom Transit Route
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Create a new campus transport line with assigned driver and monthly fee tariff.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAddRouteSubmit} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Route Name</label>
              <Input
                required
                value={newRouteData.name}
                onChange={(e) => setNewRouteData({ ...newRouteData, name: e.target.value })}
                placeholder="e.g. Route 5"
                className="h-10 text-xs rounded-xl"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Route Path / Coverage</label>
              <Input
                required
                value={newRouteData.path}
                onChange={(e) => setNewRouteData({ ...newRouteData, path: e.target.value })}
                placeholder="e.g. Rajam to Bobbili (via Salur Junction)"
                className="h-10 text-xs rounded-xl"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Bus Vehicle Number</label>
                <Input
                  value={newRouteData.regNumber}
                  onChange={(e) => setNewRouteData({ ...newRouteData, regNumber: e.target.value })}
                  placeholder="e.g. TS 09 UB 1005"
                  className="h-10 text-xs rounded-xl font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Assigned Driver</label>
                <Input
                  value={newRouteData.driver}
                  onChange={(e) => setNewRouteData({ ...newRouteData, driver: e.target.value })}
                  placeholder="e.g. P. Satish"
                  className="h-10 text-xs rounded-xl"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Monthly Fare Amount (₹)</label>
              <Input
                type="number"
                value={newRouteData.price}
                onChange={(e) => setNewRouteData({ ...newRouteData, price: e.target.value })}
                placeholder="e.g. 2000"
                className="h-10 text-xs rounded-xl"
              />
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAddRouteOpen(false)}
                className="rounded-xl text-xs font-semibold"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-[#00a884] hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl cursor-pointer"
              >
                Create Route
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ============================================================================
// 3. TRANSPORT FEES MANAGEMENT & STUDENT ACCOUNTS VIEW (For /transport/fees)
// ============================================================================
export function TransportFeesManagementView() {
  const [passengerSearch, setPassengerSearch] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<{
    name: string;
    rollNo: string;
  } | null>(null);

  const [sourcePlace, setSourcePlace] = useState("Rajam Bypass");
  const [destinationPlace, setDestinationPlace] = useState("College Campus");
  const [distanceKm, setDistanceKm] = useState("15");
  const [timeMins, setTimeMins] = useState("30");
  const [yearlyFee, setYearlyFee] = useState("18000");

  const [ledgerItems, setLedgerItems] = useState([
    {
      id: "ALLOC-01",
      passenger: "Meka Tarun (22CSE045)",
      routeLine: "Route 2: Rajam Bypass to Campus",
      fareAmount: "₹18,000 / Year",
      status: "Paid",
      date: "Aug 01, 2026",
    },
    {
      id: "ALLOC-02",
      passenger: "Yelamanchili Akhil (22ECE012)",
      routeLine: "Route 3: Ranasthalam to Campus",
      fareAmount: "₹9,000 / Sem",
      status: "Paid",
      date: "Aug 03, 2026",
    },
    {
      id: "ALLOC-03",
      passenger: "Student Demo (CS100001)",
      routeLine: "Route 1: Vizianagaram to Campus",
      fareAmount: "₹22,000 / Year",
      status: "Pending",
      date: "Aug 05, 2026",
    },
  ]);

  const handleAllocateAndCollect = () => {
    const student = selectedStudent ? selectedStudent.name : passengerSearch.trim() || "Meka Tarun";
    const newItem = {
      id: `ALLOC-0${ledgerItems.length + 1}`,
      passenger: `${student} (${selectedStudent?.rollNo || "22CSE045"})`,
      routeLine: `${sourcePlace} to ${destinationPlace}`,
      fareAmount: `₹${Number(yearlyFee || 18000).toLocaleString("en-IN")} / Year`,
      status: "Paid",
      date: "Aug 05, 2026",
    };

    setLedgerItems([newItem, ...ledgerItems]);
    toast.success(`Allocated route & collected fee of ₹${yearlyFee} for ${student}!`);
  };

  return (
    <div className="space-y-6 animate-fade-in-soft max-w-7xl mx-auto p-4 md:p-6 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Fees Management & Student Accounts
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Enterprise-grade billing panel with automated late calculators, dynamic route fare allocation, and real-time ledger.
          </p>
        </div>

        <Button
          onClick={handleAllocateAndCollect}
          className="bg-[#4f46e5] hover:bg-indigo-700 text-white font-extrabold text-xs rounded-full h-11 px-6 shadow-md cursor-pointer flex items-center gap-1.5 shrink-0 self-start sm:self-auto"
        >
          <Plus className="size-4" /> Collect Fee
        </Button>
      </div>

      <div className="border-b border-slate-200/80">
        <span className="inline-block font-extrabold text-xs sm:text-sm text-[#2563eb] pb-2.5 border-b-2 border-[#2563eb] cursor-pointer">
          Transport Route Fees Allocation
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-slate-100/90 shadow-2xs space-y-4">
          <div className="flex items-center gap-2">
            <User className="size-4 text-indigo-600" />
            <h2 className="text-sm font-extrabold text-slate-900">
              1. Select Passenger
            </h2>
          </div>

          <div className="space-y-2">
            <label className="text-xs text-slate-500 font-semibold">
              Search Student Roll / Name
            </label>
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
              <Input
                value={passengerSearch}
                onChange={(e) => setPassengerSearch(e.target.value)}
                placeholder="Type student name or roll number..."
                className="pl-10 h-12 rounded-full bg-slate-50/80 border-slate-200 text-xs text-slate-800 focus-visible:ring-indigo-500"
              />
            </div>
          </div>

          <div className="space-y-1.5 pt-1">
            <span className="text-[0.68rem] font-bold text-slate-400 uppercase tracking-wider">Quick Passenger Picks</span>
            <div className="space-y-1">
              {[
                { name: "Meka Tarun", rollNo: "22CSE045" },
                { name: "Yelamanchili Akhil", rollNo: "22ECE012" },
                { name: "Student Demo", rollNo: "CS100001" },
              ].map((p) => (
                <button
                  key={p.rollNo}
                  type="button"
                  onClick={() => {
                    setSelectedStudent(p);
                    setPassengerSearch(`${p.name} (${p.rollNo})`);
                    toast.info(`Selected passenger: ${p.name}`);
                  }}
                  className="w-full text-left bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 p-2.5 rounded-2xl text-xs font-semibold transition-colors flex justify-between items-center"
                >
                  <span>{p.name}</span>
                  <span className="text-[10px] font-mono text-slate-400">{p.rollNo}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-8 bg-white rounded-3xl p-6 border border-slate-100/90 shadow-2xs space-y-6 flex flex-col justify-between">
          <div className="flex items-center gap-2">
            <Navigation className="size-4 text-indigo-600" />
            <h2 className="text-sm font-extrabold text-slate-900">
              2. Route & Fare Allocation Parameters
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#f8fafc] rounded-2xl p-4 border border-slate-200/80 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-[0.68rem] font-extrabold text-[#2563eb] tracking-wider uppercase">
                  STARTING PLACE (SOURCE)
                </span>
                <MapPin className="size-3.5 text-[#2563eb]" />
              </div>
              <Input
                value={sourcePlace}
                onChange={(e) => setSourcePlace(e.target.value)}
                placeholder="e.g. Rajam Bypass"
                className="h-11 rounded-2xl bg-white border-slate-200/80 text-xs font-semibold text-slate-900 px-4"
              />
            </div>

            <div className="bg-[#f8fafc] rounded-2xl p-4 border border-slate-200/80 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-[0.68rem] font-extrabold text-[#2563eb] tracking-wider uppercase">
                  DESTINATION PLACE
                </span>
                <MapPin className="size-3.5 text-[#2563eb]" />
              </div>
              <Input
                value={destinationPlace}
                onChange={(e) => setDestinationPlace(e.target.value)}
                placeholder="College Campus"
                className="h-11 rounded-2xl bg-white border-slate-200/80 text-xs font-semibold text-slate-900 px-4"
              />
            </div>

            <div className="bg-[#f8fafc] rounded-2xl p-4 border border-slate-200/80 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-[0.68rem] font-extrabold text-[#2563eb] tracking-wider uppercase">
                  TRANSIT DISTANCE & TIME
                </span>
                <Activity className="size-3.5 text-[#2563eb]" />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-[0.6rem] text-slate-400 font-medium block mb-1">Distance (km)</span>
                  <Input
                    value={distanceKm}
                    onChange={(e) => setDistanceKm(e.target.value)}
                    className="h-10 rounded-2xl bg-white border-slate-200/80 text-xs font-bold text-center text-slate-900"
                  />
                </div>
                <div>
                  <span className="text-[0.6rem] text-slate-400 font-medium block mb-1">Time (mins)</span>
                  <Input
                    value={timeMins}
                    onChange={(e) => setTimeMins(e.target.value)}
                    className="h-10 rounded-2xl bg-white border-slate-200/80 text-xs font-bold text-center text-slate-900"
                  />
                </div>
              </div>
            </div>

            <div className="bg-[#f8fafc] rounded-2xl p-4 border border-slate-200/80 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-[0.68rem] font-extrabold text-[#2563eb] tracking-wider uppercase">
                  YEARLY TRANSPORT FEE
                </span>
                <DollarSign className="size-3.5 text-[#2563eb]" />
              </div>
              <Input
                value={yearlyFee}
                onChange={(e) => setYearlyFee(e.target.value)}
                className="h-11 rounded-2xl bg-white border-slate-200/80 text-sm font-extrabold text-slate-900 px-4"
              />
              <span className="text-[0.68rem] font-extrabold text-slate-400 block pt-0.5">
                ₹ {Number(yearlyFee || 18000).toLocaleString("en-IN")} / Year
              </span>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <Button
              type="button"
              onClick={handleAllocateAndCollect}
              className="bg-gradient-to-r from-[#818cf8] via-[#6366f1] to-[#4f46e5] hover:from-indigo-500 hover:to-indigo-700 text-white font-extrabold text-xs sm:text-sm rounded-full h-12 px-8 cursor-pointer shadow-lg shadow-indigo-500/25 transition-all"
            >
              Allocate Route & Collect Fee
            </Button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-6 border border-slate-100/90 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="text-base font-extrabold text-slate-900">
            Active Transport Allocations & Billing Ledger
          </h3>

          <Badge className="bg-blue-50 text-[#2563eb] border border-blue-200 font-bold text-xs px-3 py-1 rounded-full">
            Transport Line Active
          </Badge>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead className="bg-slate-50/80 text-slate-400 font-bold uppercase text-[0.65rem] border-b border-slate-100">
              <tr>
                <th className="py-3.5 px-4">PASSENGER / ROLL</th>
                <th className="py-3.5 px-4">ROUTE LINE & COVERAGE</th>
                <th className="py-3.5 px-4">FARE TARIFF</th>
                <th className="py-3.5 px-4">PAYMENT STATUS</th>
                <th className="py-3.5 px-4">DATE</th>
                <th className="py-3.5 px-4 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {ledgerItems.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-4 px-4 font-extrabold text-slate-900">
                    {item.passenger}
                  </td>
                  <td className="py-4 px-4 font-semibold text-slate-700">
                    {item.routeLine}
                  </td>
                  <td className="py-4 px-4 font-extrabold text-[#00a884]">
                    {item.fareAmount}
                  </td>
                  <td className="py-4 px-4">
                    <Badge
                      className={
                        item.status === "Paid"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200 font-bold text-[0.65rem] px-2.5 py-0.5"
                          : "bg-amber-50 text-amber-700 border-amber-200 font-bold text-[0.65rem] px-2.5 py-0.5"
                      }
                    >
                      {item.status}
                    </Badge>
                  </td>
                  <td className="py-4 px-4 text-slate-400 font-medium font-mono">
                    {item.date}
                  </td>
                  <td className="py-4 px-4 text-right">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => toast.success(`Receipt printed for ${item.passenger}`)}
                      className="text-xs font-bold text-indigo-600 hover:text-indigo-700 cursor-pointer"
                    >
                      <Printer className="size-3.5 mr-1" /> Print Receipt
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 4. TRANSPORT NOTIFICATIONS & ALERTS VIEW (For /transport/notifications)
// ============================================================================
export function TransportNotificationsView() {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("All Types");
  const [statusFilter, setStatusFilter] = useState("All Status");

  const [notificationsList, setNotificationsList] = useState<any[]>([]);

  const infoCount = notificationsList.filter((n) => n.type === "Info").length;
  const alertCount = notificationsList.filter((n) => n.type === "Alert").length;
  const completedCount = notificationsList.filter((n) => n.status === "Completed").length;

  const filteredNotifs = notificationsList.filter((n) => {
    const matchesSearch =
      !searchQuery.trim() ||
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = typeFilter === "All Types" || n.type === typeFilter;
    const matchesStatus = statusFilter === "All Status" || n.status === statusFilter;

    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-fade-in-soft max-w-7xl mx-auto p-4 md:p-6 pb-20">
      <div>
        <nav className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mb-1">
          <Link to="/dashboard" className="hover:text-indigo-600 transition-colors">
            Dashboard
          </Link>
          <span>/</span>
          <span className="text-slate-900 font-bold">Notifications</span>
        </nav>

        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Notifications
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Stay on top of every alert across the campus.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-2xs flex items-center gap-4">
          <div className="size-12 rounded-2xl bg-[#00a3ff] text-white grid place-items-center shrink-0 shadow-md shadow-sky-500/20 font-bold">
            <Info className="size-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">{infoCount}</div>
            <div className="text-xs font-semibold text-slate-400">Info this week</div>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-2xs flex items-center gap-4">
          <div className="size-12 rounded-2xl bg-[#9333ea] text-white grid place-items-center shrink-0 shadow-md shadow-purple-500/20 font-bold">
            <AlertTriangle className="size-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">{alertCount}</div>
            <div className="text-xs font-semibold text-slate-400">Alerts this week</div>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-2xs flex items-center gap-4">
          <div className="size-12 rounded-2xl bg-[#4f46e5] text-white grid place-items-center shrink-0 shadow-md shadow-indigo-500/20 font-bold">
            <CheckCircle2 className="size-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">{completedCount}</div>
            <div className="text-xs font-semibold text-slate-400">Completed this week</div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-4 border border-slate-100 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search notifications..."
            className="pl-10 h-12 rounded-full bg-slate-50/80 border-slate-200 text-xs text-slate-800 focus-visible:ring-indigo-500 shadow-2xs"
          />
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="h-12 rounded-full bg-white border border-slate-200 px-4 text-xs font-bold text-slate-700 cursor-pointer shadow-2xs focus-visible:ring-indigo-500"
          >
            <option value="All Types">All Types</option>
            <option value="Info">Info</option>
            <option value="Alert">Alert</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-12 rounded-full bg-white border border-slate-200 px-4 text-xs font-bold text-slate-700 cursor-pointer shadow-2xs focus-visible:ring-indigo-500"
          >
            <option value="All Status">All Status</option>
            <option value="Active">Active</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-2xs space-y-6">
        <h3 className="text-base font-extrabold text-slate-900">
          All Notifications
        </h3>

        {filteredNotifs.length === 0 ? (
          <div className="py-16 text-center space-y-3 flex flex-col items-center justify-center">
            <div className="size-16 rounded-full bg-slate-100 text-slate-300 grid place-items-center">
              <Bell className="size-8 stroke-[1.5]" />
            </div>
            <p className="text-xs text-slate-400 font-medium max-w-sm">
              No notifications yet. They will appear here when events occur.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredNotifs.map((notif) => (
              <div
                key={notif.id}
                className="bg-slate-50/80 rounded-2xl p-4 border border-slate-100 flex items-start justify-between gap-4 hover:bg-indigo-50/30 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-sm text-slate-900">{notif.title}</span>
                    <Badge
                      className={
                        notif.type === "Alert"
                          ? "bg-purple-100 text-purple-700 border-purple-200 text-[0.65rem] font-bold"
                          : "bg-sky-100 text-sky-700 border-sky-200 text-[0.65rem] font-bold"
                      }
                    >
                      {notif.type}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-500">{notif.description}</p>
                </div>

                <span className="text-[0.7rem] text-slate-400 font-medium shrink-0">
                  {notif.timestamp}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// 5. SETTINGS & PROFILE DETAILS VIEW (For /transport/settings and /settings)
// ============================================================================
export function TransportSettingsView() {
  const [profileData, setProfileData] = useState({
    name: "Transport Manager Demo",
    roleCode: "TRANSPORT-MANAGER · COMPUTER SCIENCE",
    email: "transport@college.com",
    phone: "9876543210",
    joinedDate: "19/05/2026",
    employeeId: "#999999",
    bio: "",
  });

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({ ...profileData });

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setProfileData({ ...editFormData });
    setIsEditModalOpen(false);
    toast.success("Updated Settings & Profile Details successfully!");
  };

  return (
    <div className="space-y-6 animate-fade-in-soft max-w-7xl mx-auto p-4 md:p-6 pb-20">
      {/* Top Breadcrumb & Header MATCHING USER PIC 2 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <nav className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mb-1">
            <Link to="/dashboard" className="hover:text-indigo-600 transition-colors">
              Dashboard
            </Link>
            <span>/</span>
            <span className="text-slate-900 font-bold">Settings</span>
          </nav>

          <span className="text-[#4f46e5] font-extrabold text-[0.68rem] tracking-wider uppercase block">
            TRANSPORT MANAGER SETTINGS
          </span>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Manage your campus profile and settings
          </p>

          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
            Settings & Profile Details
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Manage your dynamic system identities, editable profile details, social handles, and preferences.
          </p>
        </div>

        {/* Top Right Edit Button MATCHING USER PIC 2 */}
        <Button
          onClick={() => {
            setEditFormData({ ...profileData });
            setIsEditModalOpen(true);
          }}
          className="bg-[#4f46e5] hover:bg-indigo-700 text-white font-extrabold text-xs rounded-full h-10 px-5 shadow-md flex items-center gap-1.5 cursor-pointer shrink-0 self-start sm:self-auto"
        >
          <Edit3 className="size-4" /> Edit Profile Details
        </Button>
      </div>

      {/* TOP ROW CARDS: PROFILE AVATAR CARD + BIOGRAPHY & MANDATE MATCHING PIC 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* TOP LEFT CARD: PROFILE AVATAR CARD */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-slate-100/90 shadow-2xs text-center flex flex-col items-center justify-center space-y-3 min-h-[220px]">
          {/* Avatar Square */}
          <div className="size-24 rounded-3xl bg-gradient-to-tr from-[#6366f1] via-[#4f46e5] to-[#7c3aed] text-white font-black text-2xl grid place-items-center shadow-lg shadow-indigo-500/20">
            TM
          </div>

          <div>
            <h3 className="text-base font-extrabold text-slate-900 leading-snug">
              {profileData.name}
            </h3>
            <p className="text-[0.65rem] font-bold text-slate-400 tracking-wider uppercase mt-0.5">
              {profileData.roleCode}
            </p>
          </div>
        </div>

        {/* TOP RIGHT CARD: BIOGRAPHY & MANDATE MATCHING PIC 2 */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 border border-slate-100/90 shadow-2xs space-y-3 min-h-[160px] flex flex-col justify-start">
          <h3 className="text-[0.68rem] font-extrabold text-slate-400 tracking-wider uppercase">
            BIOGRAPHY & MANDATE
          </h3>

          <p className="text-xs text-slate-400 font-medium italic pt-2">
            {profileData.bio || "No bio provided yet. Add one to let people know who you are!"}
          </p>
        </div>
      </div>

      {/* BOTTOM ROW CARDS: SOCIAL HANDLES + ACCOUNT METADATA MATCHING PIC 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* BOTTOM LEFT CARD: SOCIAL HANDLES */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-slate-100/90 shadow-2xs space-y-4">
          <h3 className="text-[0.68rem] font-extrabold text-slate-400 tracking-wider uppercase">
            SOCIAL HANDLES
          </h3>

          <div className="space-y-3 text-xs text-slate-400 font-medium">
            <div className="flex items-center gap-2.5">
              <Github className="size-4 text-slate-400 shrink-0" />
              <span className="italic">Not linked</span>
            </div>

            <div className="flex items-center gap-2.5">
              <Linkedin className="size-4 text-slate-400 shrink-0" />
              <span className="italic">Not linked</span>
            </div>

            <div className="flex items-center gap-2.5">
              <Twitter className="size-4 text-slate-400 shrink-0" />
              <span className="italic">Not linked</span>
            </div>

            <div className="flex items-center gap-2.5">
              <Globe className="size-4 text-slate-400 shrink-0" />
              <span className="italic">Not linked</span>
            </div>
          </div>
        </div>

        {/* BOTTOM RIGHT CARD: ACCOUNT METADATA MATCHING PIC 2 */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 border border-slate-100/90 shadow-2xs space-y-4">
          <h3 className="text-[0.68rem] font-extrabold text-slate-400 tracking-wider uppercase">
            ACCOUNT METADATA
          </h3>

          {/* 2X2 METADATA GRID MATCHING PIC 2 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Box 1: EMAIL ADDRESS */}
            <div className="bg-[#f8fafc] rounded-2xl p-4 border border-slate-100/80 space-y-1">
              <span className="text-[0.62rem] font-extrabold text-slate-400 tracking-wider uppercase block">
                EMAIL ADDRESS
              </span>
              <span className="text-xs font-bold text-slate-900 block">
                {profileData.email}
              </span>
            </div>

            {/* Box 2: CONTACT NUMBER */}
            <div className="bg-[#f8fafc] rounded-2xl p-4 border border-slate-100/80 space-y-1">
              <span className="text-[0.62rem] font-extrabold text-slate-400 tracking-wider uppercase block">
                CONTACT NUMBER
              </span>
              <span className="text-xs font-bold text-slate-900 block">
                {profileData.phone}
              </span>
            </div>

            {/* Box 3: JOINED ON */}
            <div className="bg-[#f8fafc] rounded-2xl p-4 border border-slate-100/80 space-y-1">
              <span className="text-[0.62rem] font-extrabold text-slate-400 tracking-wider uppercase block">
                JOINED ON
              </span>
              <span className="text-xs font-bold text-slate-900 block">
                {profileData.joinedDate}
              </span>
            </div>

            {/* Box 4: EMPLOYEE ID */}
            <div className="bg-[#f8fafc] rounded-2xl p-4 border border-slate-100/80 space-y-1">
              <span className="text-[0.62rem] font-extrabold text-slate-400 tracking-wider uppercase block">
                EMPLOYEE ID
              </span>
              <span className="text-xs font-bold text-slate-900 block">
                {profileData.employeeId}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* EDIT PROFILE MODAL */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-md rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <Edit3 className="size-5 text-indigo-600" /> Edit Profile Details
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Update your personal details and campus profile metadata.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleUpdateProfile} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Full Name</label>
              <Input
                value={editFormData.name}
                onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                className="h-10 text-xs rounded-xl"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Email Address</label>
                <Input
                  value={editFormData.email}
                  onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                  className="h-10 text-xs rounded-xl"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Contact Phone</label>
                <Input
                  value={editFormData.phone}
                  onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                  className="h-10 text-xs rounded-xl"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Biography / Mandate</label>
              <Input
                value={editFormData.bio}
                onChange={(e) => setEditFormData({ ...editFormData, bio: e.target.value })}
                placeholder="Write a brief bio..."
                className="h-10 text-xs rounded-xl"
              />
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditModalOpen(false)}
                className="rounded-xl text-xs font-semibold"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-[#4f46e5] hover:bg-indigo-700 text-white font-extrabold text-xs rounded-xl cursor-pointer"
              >
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Backward Compatibility Alias
export function TransportModuleView() {
  return <TransportDashboardView />;
}
