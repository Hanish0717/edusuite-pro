import React, { useEffect, useState } from "react";
import {
  Bus,
  Plus,
  Search,
  RefreshCw,
  Download,
  Filter,
  Eye,
  Edit,
  Trash2,
  MapPin,
  Users,
  CheckCircle2,
  AlertCircle,
  FileText,
  Navigation,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

import {
  fetchBusRoutes,
  fetchTransportPasses,
  createBusRoute,
  issueTransportPass,
  INITIAL_ROUTES,
  INITIAL_PASSES,
  type BusRoute,
  type TransportPass,
} from "./TransportService";

export function TransportModuleView() {
  const [routes, setRoutes] = useState<BusRoute[]>(INITIAL_ROUTES);
  const [passes, setPasses] = useState<TransportPass[]>(INITIAL_PASSES);
  const [activeTab, setActiveTab] = useState<"routes" | "passes">("routes");

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  // Dialog States
  const [isAddRouteOpen, setIsAddRouteOpen] = useState(false);
  const [isIssuePassOpen, setIsIssuePassOpen] = useState(false);

  // Forms
  const [routeForm, setRouteForm] = useState<Partial<BusRoute>>({
    routeNo: "Route 4",
    routeName: "Uppal Ring Road ──> Campus",
    busRegNo: "TS-09-UB-5544",
    driverName: "B. Mohan Rao",
    driverPhone: "+91 9848077788",
    capacity: 50,
  });

  const [passForm, setPassForm] = useState<Partial<TransportPass>>({
    rollNo: "23ME014",
    studentName: "Vikram Aditya",
    department: "ME",
    routeNo: "Route 1",
    pickupStop: "Begumpet",
    annualFee: 32000,
  });

  const loadData = async () => {
    setLoading(true);
    const [rt, ps] = await Promise.all([fetchBusRoutes(), fetchTransportPasses()]);
    setRoutes(rt);
    setPasses(ps);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredRoutes = routes.filter((r) => {
    return (
      r.routeNo.toLowerCase().includes(search.toLowerCase()) ||
      r.routeName.toLowerCase().includes(search.toLowerCase()) ||
      r.busRegNo.toLowerCase().includes(search.toLowerCase()) ||
      r.driverName.toLowerCase().includes(search.toLowerCase())
    );
  });

  const handleAddRouteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!routeForm.routeName || !routeForm.busRegNo) return toast.error("Enter route name and bus registration no");
    const created = await createBusRoute(routeForm);
    setRoutes((prev) => [created, ...prev]);
    setIsAddRouteOpen(false);
    toast.success(`Bus Route ${created.routeNo} created!`);
  };

  const handleIssuePassSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passForm.rollNo || !passForm.studentName) return toast.error("Enter student roll number and name");
    const created = await issueTransportPass(passForm);
    setPasses((prev) => [created, ...prev]);
    setIsIssuePassOpen(false);
    toast.success(`Transport Pass issued to ${created.studentName} (${created.rollNo})!`);
  };

  const handleExportCSV = () => {
    const headers = ["Route ID", "Route No", "Route Name", "Bus Reg No", "Driver Name", "Driver Phone", "Capacity", "Pass Holders", "Status"];
    const rows = filteredRoutes.map((r) => [r.id, r.routeNo, `"${r.routeName}"`, r.busRegNo, `"${r.driverName}"`, r.driverPhone, r.capacity, r.passHoldersCount, r.status]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Transport_Routes_Report_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Exported bus routes to CSV!");
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-primary/10 text-primary border border-primary/20 shrink-0">
            <Bus className="size-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-bold font-display tracking-tight text-foreground">
                Campus Transport & Fleet Management
              </h1>
              <Badge variant="outline" className="font-mono text-xs text-primary border-primary/30">
                Campus Services Core
              </Badge>
            </div>
            <p className="text-xs md:text-sm text-muted-foreground mt-0.5">
              Bus routes, fleet inventory, driver assignments, and student transport passes.
            </p>
          </div>
        </div>

        {/* Action Buttons - Top Right Corner */}
        <div className="flex items-center gap-2.5 shrink-0 self-start sm:self-auto">
          <Button variant="outline" size="sm" onClick={loadData} disabled={loading} className="h-9 gap-2 text-xs font-medium">
            <RefreshCw className={`size-3.5 ${loading ? "animate-spin" : ""}`} /> Refresh
          </Button>
          <Button variant="outline" size="sm" onClick={handleExportCSV} className="h-9 gap-2 text-xs font-medium">
            <Download className="size-3.5" /> Export Routes
          </Button>
          <Button size="sm" onClick={() => setIsIssuePassOpen(true)} variant="outline" className="h-9 border-primary/30 text-primary gap-2 text-xs font-semibold">
            <FileText className="size-4" /> Issue Transport Pass
          </Button>
          <Button size="sm" onClick={() => setIsAddRouteOpen(true)} className="h-9 bg-brand-gradient text-white gap-2 text-xs font-semibold shadow-glow">
            <Plus className="size-4" /> Add Bus Route
          </Button>
        </div>
      </div>

      {/* KPI Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground uppercase">
            <span>Fleet Buses</span>
            <Bus className="size-4 text-primary" />
          </div>
          <p className="text-2xl font-bold font-mono text-primary">24 Buses Active</p>
          <p className="text-[0.68rem] text-muted-foreground">GPS tracking enabled</p>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground uppercase">
            <span>Active Bus Routes</span>
            <Navigation className="size-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-bold font-mono text-emerald-600">{routes.length} Routes</p>
          <p className="text-[0.68rem] text-emerald-600 font-medium">Greater Hyderabad Region</p>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground uppercase">
            <span>Transport Pass Holders</span>
            <Users className="size-4 text-blue-500" />
          </div>
          <p className="text-2xl font-bold font-mono text-blue-600">1,120 Scholars</p>
          <p className="text-[0.68rem] text-muted-foreground">Students & Staff</p>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground uppercase">
            <span>Driver Compliance</span>
            <CheckCircle2 className="size-4 text-purple-500" />
          </div>
          <p className="text-2xl font-bold font-mono text-purple-600">100% Verified</p>
          <p className="text-[0.68rem] text-purple-600 font-medium">RTO Commercial Licenses</p>
        </div>
      </div>

      {/* SUBPARTS TAB SWITCHER */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-muted/60 border border-border/80">
        <button onClick={() => setActiveTab("routes")} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === "routes" ? "bg-card text-primary shadow-sm" : "text-muted-foreground"}`}>
          1. Bus Routes & Fleet Inventory ({routes.length})
        </button>
        <button onClick={() => setActiveTab("passes")} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === "passes" ? "bg-card text-primary shadow-sm" : "text-muted-foreground"}`}>
          2. Transport Pass Allocation ({passes.length})
        </button>
      </div>

      {/* TAB 1: ROUTES */}
      {activeTab === "routes" && (
        <div className="rounded-2xl border border-border/80 bg-card p-5 space-y-4 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/40 border-b border-border text-muted-foreground font-semibold uppercase tracking-wider text-[0.68rem]">
                <tr>
                  <th className="py-3 px-3">Route No</th>
                  <th className="py-3 px-3">Route Name & Destination</th>
                  <th className="py-3 px-3">Bus Reg No</th>
                  <th className="py-3 px-3">Driver Name & Phone</th>
                  <th className="py-3 px-3">Capacity</th>
                  <th className="py-3 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filteredRoutes.map((r) => (
                  <tr key={r.id} className="hover:bg-muted/20 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-primary">{r.routeNo}</td>
                    <td className="py-3 px-3 font-semibold text-foreground">{r.routeName}</td>
                    <td className="py-3 px-3 font-mono">{r.busRegNo}</td>
                    <td className="py-3 px-3 font-medium text-foreground">{r.driverName} ({r.driverPhone})</td>
                    <td className="py-3 px-3 font-mono font-bold text-foreground">{r.passHoldersCount} / {r.capacity} Seats</td>
                    <td className="py-3 px-3"><Badge className="bg-emerald-500/10 text-emerald-600">{r.status}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: PASSES */}
      {activeTab === "passes" && (
        <div className="rounded-2xl border border-border/80 bg-card p-5 space-y-4 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/40 border-b border-border text-muted-foreground font-semibold uppercase tracking-wider text-[0.68rem]">
                <tr>
                  <th className="py-3 px-3">Pass ID</th>
                  <th className="py-3 px-3">Student Name</th>
                  <th className="py-3 px-3">Department</th>
                  <th className="py-3 px-3">Route & Pickup Stop</th>
                  <th className="py-3 px-3">Annual Fee</th>
                  <th className="py-3 px-3">Payment Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {passes.map((p) => (
                  <tr key={p.id} className="hover:bg-muted/20 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-foreground">{p.passId}</td>
                    <td className="py-3 px-3 font-semibold text-foreground">{p.studentName} ({p.rollNo})</td>
                    <td className="py-3 px-3">{p.department}</td>
                    <td className="py-3 px-3 font-mono text-primary font-bold">{p.routeNo} &middot; {p.pickupStop}</td>
                    <td className="py-3 px-3 font-mono font-bold text-foreground">₹{p.annualFee.toLocaleString()}</td>
                    <td className="py-3 px-3"><Badge className="bg-emerald-500/10 text-emerald-600">{p.paymentStatus}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* DIALOG 1: ADD ROUTE */}
      <Dialog open={isAddRouteOpen} onOpenChange={setIsAddRouteOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle className="text-lg font-bold">Add Bus Route</DialogTitle></DialogHeader>
          <form onSubmit={handleAddRouteSubmit} className="space-y-3 pt-2">
            <div className="space-y-1"><Label className="text-xs font-semibold">Route Name *</Label><Input required placeholder="Uppal Ring Road ──> Campus" value={routeForm.routeName || ""} onChange={(e) => setRouteForm({ ...routeForm, routeName: e.target.value })} className="h-9 text-xs" /></div>
            <div className="space-y-1"><Label className="text-xs font-semibold">Bus Reg No *</Label><Input required placeholder="TS-09-UB-5544" value={routeForm.busRegNo || ""} onChange={(e) => setRouteForm({ ...routeForm, busRegNo: e.target.value })} className="h-9 text-xs font-mono uppercase" /></div>
            <DialogFooter className="pt-2"><Button type="button" variant="outline" onClick={() => setIsAddRouteOpen(false)} className="text-xs">Cancel</Button><Button type="submit" className="bg-brand-gradient text-white text-xs font-semibold">Save Route</Button></DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* DIALOG 2: ISSUE PASS */}
      <Dialog open={isIssuePassOpen} onOpenChange={setIsIssuePassOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle className="text-lg font-bold">Issue Transport Pass</DialogTitle></DialogHeader>
          <form onSubmit={handleIssuePassSubmit} className="space-y-3 pt-2">
            <div className="space-y-1"><Label className="text-xs font-semibold">Student Roll No *</Label><Input required placeholder="23ME014" value={passForm.rollNo || ""} onChange={(e) => setPassForm({ ...passForm, rollNo: e.target.value })} className="h-9 text-xs font-mono uppercase" /></div>
            <div className="space-y-1"><Label className="text-xs font-semibold">Student Name *</Label><Input required placeholder="Vikram Aditya" value={passForm.studentName || ""} onChange={(e) => setPassForm({ ...passForm, studentName: e.target.value })} className="h-9 text-xs" /></div>
            <DialogFooter className="pt-2"><Button type="button" variant="outline" onClick={() => setIsIssuePassOpen(false)} className="text-xs">Cancel</Button><Button type="submit" className="bg-brand-gradient text-white text-xs font-semibold">Issue Pass</Button></DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
