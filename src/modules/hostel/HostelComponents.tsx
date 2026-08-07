import React, { useEffect, useState } from "react";
import {
  Building,
  Plus,
  Search,
  RefreshCw,
  Download,
  Filter,
  Eye,
  Edit,
  Trash2,
  Users,
  Bed,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  FileText,
  KeyRound,
  Calendar,
  Sparkles,
  Utensils,
  CreditCard,
  Wallet,
  Bell,
  Settings,
  MessageSquare,
  ClipboardList,
  Send,
  Check,
  Receipt,
  CalendarDays,
  Phone,
  UserPlus,
  Loader2,
  TrendingUp,
  PhoneCall,
  Flame,
  Lock,
  Printer,
  X,
  XCircle,
  FileDown,
} from "lucide-react";
import { toast } from "sonner";
import {
  getWardenMessSummary,
  exportMessReportCSV,
  exportMessReportPDF,
  getAllStoredConfirmations,
  MealType,
} from "@/components/student-hostel/meal-service";

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
  fetchHostelRooms,
  fetchHostelResidents,
  fetchGatePasses,
  createHostelRoom,
  updateGatePassStatus,
  INITIAL_ROOMS,
  INITIAL_RESIDENTS,
  INITIAL_PASSES,
  type HostelRoom,
  type ResidentStudent,
  type GatePassRequest,
} from "./HostelService";

const BLOCKS = ["All Blocks", "Block A (Boys)", "Block B (Girls)", "Block C (PG Scholars)"] as const;

export function HostelModuleView() {
  const [rooms, setRooms] = useState<HostelRoom[]>(INITIAL_ROOMS);
  const [residents, setResidents] = useState<ResidentStudent[]>(INITIAL_RESIDENTS);
  const [passes, setPasses] = useState<GatePassRequest[]>(INITIAL_PASSES);
  const [activeTab, setActiveTab] = useState<"rooms" | "residents" | "passes" | "mess">("rooms");

  const todayStr = new Date().toISOString().split("T")[0];
  const [messSummary, setMessSummary] = useState(() => getWardenMessSummary(todayStr));

  const reloadMessSummary = () => {
    setMessSummary(getWardenMessSummary(todayStr));
  };

  useEffect(() => {
    reloadMessSummary();
    const handleUpdate = () => reloadMessSummary();
    if (typeof window !== "undefined") {
      window.addEventListener("meal-confirmations-updated", handleUpdate);
      window.addEventListener("storage", handleUpdate);
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("meal-confirmations-updated", handleUpdate);
        window.removeEventListener("storage", handleUpdate);
      }
    };
  }, [todayStr]);

  const [search, setSearch] = useState("");
  const [selectedBlock, setSelectedBlock] = useState<string>("All Blocks");
  const [loading, setLoading] = useState(false);

  // Dialog State
  const [isAddRoomOpen, setIsAddRoomOpen] = useState(false);
  const [roomForm, setRoomForm] = useState<Partial<HostelRoom>>({
    roomNo: "A-301",
    block: "Block A (Boys)",
    type: "2-Sharing AC",
    capacity: 2,
    occupancy: 0,
    annualFee: 95000,
    status: "Available",
  });

  const loadData = async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    const [rm, res, ps] = await Promise.all([
      fetchHostelRooms(),
      fetchHostelResidents(),
      fetchGatePasses(),
    ]);
    setRooms(rm);
    setResidents(res);
    setPasses(ps);
    if (!isSilent) setLoading(false);
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(() => {
      loadData(true);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const filteredRooms = rooms.filter((r) => {
    const matchesSearch =
      r.roomNo.toLowerCase().includes(search.toLowerCase()) ||
      r.type.toLowerCase().includes(search.toLowerCase());
    const matchesBlock = selectedBlock === "All Blocks" || r.block === selectedBlock;
    return matchesSearch && matchesBlock;
  });

  const handleAddRoomSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomForm.roomNo) {
      toast.error("Enter room number");
      return;
    }
    const created = await createHostelRoom(roomForm);
    setRooms((prev) => [created, ...prev]);
    setIsAddRoomOpen(false);
    toast.success(`Hostel room ${created.roomNo} created in ${created.block}!`);
  };

  const handleApprovePass = async (id: string, name: string) => {
    await updateGatePassStatus(id, "Approved");
    setPasses((prev) => prev.map((p) => (p.id === id ? { ...p, status: "Approved" } : p)));
    toast.success(`Gate Pass ${id} approved for ${name}!`);
  };

  const handleExportCSV = () => {
    const headers = ["Room ID", "Room No", "Block", "Type", "Capacity", "Occupancy", "Annual Fee (INR)", "Status"];
    const rows = filteredRooms.map((r) => [r.id, r.roomNo, `"${r.block}"`, `"${r.type}"`, r.capacity, r.occupancy, r.annualFee, r.status]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Hostel_Rooms_Report_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Exported hostel room ledger to CSV!");
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-primary/10 text-primary border border-primary/20 shrink-0">
            <Building className="size-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-bold font-display tracking-tight text-foreground">
                Hostel & Resident Welfare Management
              </h1>
              <Badge variant="outline" className="font-mono text-xs text-primary border-primary/30">
                Campus Services Core
              </Badge>
            </div>
            <p className="text-xs md:text-sm text-muted-foreground mt-0.5">
              Hostel blocks, room allocations, resident roster, and gate pass approvals.
            </p>
          </div>
        </div>

        {/* Action Buttons - Top Right Corner */}
        <div className="flex items-center gap-2.5 shrink-0 self-start sm:self-auto">
          <Button variant="outline" size="sm" onClick={loadData} disabled={loading} className="h-9 gap-2 text-xs font-medium">
            <RefreshCw className={`size-3.5 ${loading ? "animate-spin" : ""}`} /> Refresh
          </Button>
          <Button variant="outline" size="sm" onClick={handleExportCSV} className="h-9 gap-2 text-xs font-medium">
            <Download className="size-3.5" /> Export Ledger
          </Button>
          <Button size="sm" onClick={() => setIsAddRoomOpen(true)} className="h-9 bg-brand-gradient text-white gap-2 text-xs font-semibold shadow-glow">
            <Plus className="size-4" /> Add Room / Slot
          </Button>
        </div>
      </div>

      {/* KPI Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground uppercase">
            <span>Total Rooms</span>
            <Building className="size-4 text-primary" />
          </div>
          <p className="text-2xl font-bold font-mono text-primary">{rooms.length} Rooms</p>
          <p className="text-[0.68rem] text-muted-foreground">Blocks A, B & C</p>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground uppercase">
            <span>Resident Students</span>
            <Users className="size-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-bold font-mono text-emerald-600">850 Residents</p>
          <p className="text-[0.68rem] text-emerald-600 font-medium">Active hostel scholars</p>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground uppercase">
            <span>Available Slots</span>
            <Bed className="size-4 text-blue-500" />
          </div>
          <p className="text-2xl font-bold font-mono text-blue-600">45 Vacant Beds</p>
          <p className="text-[0.68rem] text-muted-foreground">Ready for allocation</p>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground uppercase">
            <span>Pending Gate Passes</span>
            <KeyRound className="size-4 text-amber-500" />
          </div>
          <p className="text-2xl font-bold font-mono text-amber-600">{passes.filter((p) => p.status === "Pending").length} Passes</p>
          <p className="text-[0.68rem] text-muted-foreground">Requires warden approval</p>
        </div>
      </div>

      {/* SUBPARTS TAB SWITCHER */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-muted/60 border border-border/80 flex-wrap">
        <button onClick={() => setActiveTab("rooms")} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === "rooms" ? "bg-card text-primary shadow-sm" : "text-muted-foreground"}`}>
          1. Room Allocation & Blocks ({rooms.length})
        </button>
        <button onClick={() => setActiveTab("residents")} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === "residents" ? "bg-card text-primary shadow-sm" : "text-muted-foreground"}`}>
          2. Resident Roster ({residents.length})
        </button>
        <button onClick={() => setActiveTab("passes")} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === "passes" ? "bg-card text-primary shadow-sm" : "text-muted-foreground"}`}>
          3. Gate Passes & Complaints ({passes.length})
        </button>
        <button onClick={() => setActiveTab("mess")} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${activeTab === "mess" ? "bg-card text-primary shadow-sm" : "text-muted-foreground"}`}>
          <Utensils className="size-3.5 text-amber-500" /> 4. Mess Preparation Dashboard
        </button>
      </div>

      {/* TAB 1: ROOMS */}
      {activeTab === "rooms" && (
        <div className="rounded-2xl border border-border/80 bg-card p-5 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <h3 className="font-bold text-base text-foreground flex items-center gap-2">
              <Building className="size-4 text-primary" /> Hostel Room Inventory
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/40 border-b border-border text-muted-foreground font-semibold uppercase tracking-wider text-[0.68rem]">
                <tr>
                  <th className="py-3 px-3">Room No</th>
                  <th className="py-3 px-3">Block</th>
                  <th className="py-3 px-3">Room Type</th>
                  <th className="py-3 px-3">Capacity</th>
                  <th className="py-3 px-3">Annual Fee</th>
                  <th className="py-3 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filteredRooms.map((r) => (
                  <tr key={r.id} className="hover:bg-muted/20 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-foreground">{r.roomNo}</td>
                    <td className="py-3 px-3 font-medium text-foreground">{r.block}</td>
                    <td className="py-3 px-3">{r.type}</td>
                    <td className="py-3 px-3 font-mono font-bold text-primary">{r.occupancy} / {r.capacity} Occupied</td>
                    <td className="py-3 px-3 font-mono font-bold text-foreground">₹{r.annualFee.toLocaleString()}</td>
                    <td className="py-3 px-3">
                      <Badge className={r.status === "Available" ? "bg-emerald-500/10 text-emerald-600" : r.status === "Full" ? "bg-blue-500/10 text-blue-600" : "bg-amber-500/10 text-amber-600"}>
                        {r.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: RESIDENTS */}
      {activeTab === "residents" && (
        <div className="rounded-2xl border border-border/80 bg-card p-5 space-y-4 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/40 border-b border-border text-muted-foreground font-semibold uppercase tracking-wider text-[0.68rem]">
                <tr>
                  <th className="py-3 px-3">Roll No</th>
                  <th className="py-3 px-3">Resident Name</th>
                  <th className="py-3 px-3">Department</th>
                  <th className="py-3 px-3">Room & Block</th>
                  <th className="py-3 px-3">Fee Status</th>
                  <th className="py-3 px-3">Emergency Contact</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {residents.map((res) => (
                  <tr key={res.id} className="hover:bg-muted/20 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-foreground">{res.rollNo}</td>
                    <td className="py-3 px-3 font-semibold text-foreground">{res.name}</td>
                    <td className="py-3 px-3">{res.department}</td>
                    <td className="py-3 px-3 font-mono text-primary font-bold">{res.roomNo} ({res.block})</td>
                    <td className="py-3 px-3"><Badge className="bg-emerald-500/10 text-emerald-600">{res.feeStatus}</Badge></td>
                    <td className="py-3 px-3 font-mono text-muted-foreground">{res.emergencyContact}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: PASSES */}
      {activeTab === "passes" && (
        <div className="rounded-2xl border border-border/80 bg-card p-5 space-y-4 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/40 border-b border-border text-muted-foreground font-semibold uppercase tracking-wider text-[0.68rem]">
                <tr>
                  <th className="py-3 px-3">Pass ID</th>
                  <th className="py-3 px-3">Student Name</th>
                  <th className="py-3 px-3">Room</th>
                  <th className="py-3 px-3">Pass Type & Reason</th>
                  <th className="py-3 px-3">Dates</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right pr-4">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {passes.map((p) => (
                  <tr key={p.id} className="hover:bg-muted/20 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-foreground">{p.id}</td>
                    <td className="py-3 px-3 font-semibold text-foreground">{p.studentName} ({p.rollNo})</td>
                    <td className="py-3 px-3 font-mono">{p.roomNo}</td>
                    <td className="py-3 px-3">
                      <div className="font-bold text-primary">{p.passType}</div>
                      <div className="text-[0.68rem] text-muted-foreground">{p.reason}</div>
                    </td>
                    <td className="py-3 px-3 font-mono text-muted-foreground">{p.fromDate} to {p.toDate}</td>
                    <td className="py-3 px-3"><Badge className={p.status === "Approved" ? "bg-emerald-500/10 text-emerald-600" : "bg-amber-500/10 text-amber-600"}>{p.status}</Badge></td>
                    <td className="py-3 px-3 text-right pr-4">
                      {p.status === "Pending" && (
                        <Button size="sm" onClick={() => handleApprovePass(p.id, p.studentName)} className="h-7 text-xs bg-brand-gradient text-white gap-1">
                          <CheckCircle2 className="size-3" /> Approve Pass
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: MESS PREPARATION DASHBOARD */}
      {activeTab === "mess" && (
        <div className="rounded-2xl border border-border/80 bg-card p-5 space-y-6 shadow-sm">
          {/* Dashboard Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-600 border border-amber-500/20">
                <Utensils className="size-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-base text-foreground">
                    Warden Mess Preparation & Food Forecasting Dashboard
                  </h3>
                  <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[10px] font-mono">
                    LIVE SYNC
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Real-time food counts automatically calculated from student meal confirmations.
                </p>
              </div>
            </div>

            {/* Export Reports Buttons */}
            <div className="flex items-center gap-2 flex-wrap">
              <Button
                variant="outline"
                size="sm"
                onClick={() => exportMessReportCSV(todayStr, "daily")}
                className="h-8 text-xs font-medium gap-1.5"
              >
                <Download className="size-3.5 text-emerald-600" /> Daily CSV
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => exportMessReportPDF(todayStr, "daily")}
                className="h-8 text-xs font-medium gap-1.5"
              >
                <FileDown className="size-3.5 text-red-500" /> Daily PDF
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => exportMessReportPDF(todayStr, "weekly")}
                className="h-8 text-xs font-medium gap-1.5"
              >
                <FileDown className="size-3.5 text-blue-500" /> Weekly Report
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => exportMessReportPDF(todayStr, "monthly")}
                className="h-8 text-xs font-medium gap-1.5"
              >
                <FileDown className="size-3.5 text-purple-500" /> Monthly Report
              </Button>
            </div>
          </div>

          {/* Meal Forecasting Cards (Breakfast, Lunch, Snacks, Dinner) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {(["Breakfast", "Lunch", "Snacks", "Dinner"] as MealType[]).map((meal) => {
              const stat = messSummary.mealStats[meal];
              return (
                <div
                  key={meal}
                  className="p-4 rounded-xl border border-border/80 bg-muted/20 hover:bg-muted/40 transition-all space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs uppercase tracking-wider text-foreground">
                      {meal}
                    </span>
                    <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/20 text-[10px]">
                      {stat.percentage}% Opted
                    </Badge>
                  </div>

                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between text-muted-foreground">
                      <span>Total Hostel Students:</span>
                      <strong className="text-foreground font-mono">{messSummary.totalStudents}</strong>
                    </div>

                    <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-bold">
                      <span className="flex items-center gap-1">
                        <CheckCircle2 className="size-3.5" /> Will Eat:
                      </span>
                      <span className="font-mono">{stat.willEat}</span>
                    </div>

                    <div className="flex justify-between text-amber-600 dark:text-amber-400 font-bold">
                      <span className="flex items-center gap-1">
                        <XCircle className="size-3.5" /> Will Skip:
                      </span>
                      <span className="font-mono">{stat.willSkip}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-border/60 flex items-center justify-between">
                    <span className="text-[11px] font-bold text-muted-foreground">Expected Food Prep:</span>
                    <span className="text-base font-extrabold text-primary font-mono">
                      {stat.expected} Meals
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Student Submissions Audit Table */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-sm text-foreground flex items-center gap-2">
                <Utensils className="size-4 text-emerald-600" /> Today's Student Submission Logs
              </h4>
              <Badge variant="outline" className="text-[10px] font-mono">
                {getAllStoredConfirmations().filter((r) => r.date === todayStr).length} Submissions Today
              </Badge>
            </div>

            <div className="overflow-x-auto border border-border/60 rounded-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-muted/40 text-muted-foreground uppercase text-[10px] font-mono tracking-wider">
                  <tr>
                    <th className="py-2.5 px-3">Student Name</th>
                    <th className="py-2.5 px-3">Student ID</th>
                    <th className="py-2.5 px-3">Block / Room</th>
                    <th className="py-2.5 px-3">Meal Type</th>
                    <th className="py-2.5 px-3">Date</th>
                    <th className="py-2.5 px-3">Selection</th>
                    <th className="py-2.5 px-3 text-right pr-4">Submission Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60 font-medium">
                  {getAllStoredConfirmations()
                    .filter((r) => r.date === todayStr)
                    .map((log, idx) => (
                      <tr key={`${log.studentId}-${log.mealType}-${idx}`} className="hover:bg-muted/20">
                        <td className="py-2.5 px-3 font-bold text-foreground">{log.studentName}</td>
                        <td className="py-2.5 px-3 font-mono text-muted-foreground">{log.studentId}</td>
                        <td className="py-2.5 px-3 font-mono">{log.block || "Block A"} - {log.roomNo || "A-302"}</td>
                        <td className="py-2.5 px-3 font-bold text-primary">{log.mealType}</td>
                        <td className="py-2.5 px-3 font-mono text-muted-foreground">{log.date}</td>
                        <td className="py-2.5 px-3">
                          <Badge className={log.status === "Will Eat" ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 font-bold" : "bg-rose-500/10 text-rose-600 border-rose-500/20 font-bold"}>
                            {log.status === "Will Eat" ? "✅ Will Eat" : "❌ Will Skip"}
                          </Badge>
                        </td>
                        <td className="py-2.5 px-3 text-right pr-4 font-mono text-muted-foreground">{log.submittedAt}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* DIALOG: ADD ROOM */}
      <Dialog open={isAddRoomOpen} onOpenChange={setIsAddRoomOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle className="text-lg font-bold">Add Hostel Room / Slot</DialogTitle></DialogHeader>
          <form onSubmit={handleAddRoomSubmit} className="space-y-3 pt-2">
            <div className="space-y-1"><Label className="text-xs font-semibold">Room No *</Label><Input required placeholder="A-301" value={roomForm.roomNo || ""} onChange={(e) => setRoomForm({ ...roomForm, roomNo: e.target.value })} className="h-9 text-xs font-mono uppercase" /></div>
            <div className="space-y-1"><Label className="text-xs font-semibold">Annual Fee (INR)</Label><Input type="number" value={roomForm.annualFee ?? 95000} onChange={(e) => setRoomForm({ ...roomForm, annualFee: Number(e.target.value) })} className="h-9 text-xs font-mono" /></div>
            <DialogFooter className="pt-2"><Button type="button" variant="outline" onClick={() => setIsAddRoomOpen(false)} className="text-xs">Cancel</Button><Button type="submit" className="bg-brand-gradient text-white text-xs font-semibold">Save Room</Button></DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export const HostelRoomsView = HostelModuleView;
export const HostelFeesView = HostelModuleView;
export const HostelGuestBillingView = HostelModuleView;
export const HostelLogHistoryView = HostelModuleView;
export const HostelMaintenanceView = HostelModuleView;
export const HostelSettingsView = HostelModuleView;
export const HostelVisitorsView = HostelModuleView;
export const HostelDeviceManagementView = HostelModuleView;
export const HostelAttendanceView = HostelModuleView;
export const HostelLeavesSuspensionView = HostelModuleView;
export const HostelMessFeesView = HostelModuleView;
export const HostelOutingLogHistoryView = HostelModuleView;
export const HostelUserManagementView = HostelModuleView;
export const HostelBlocksView = HostelModuleView;
export const HostelComplaintsView = HostelModuleView;
export const HostelOutingApprovalsView = HostelModuleView;
export const HostelNotificationsView = HostelModuleView;
export const HostelMessMenusView = HostelModuleView;
export const HostelMessManagementView = HostelModuleView;
export const HostelResidentsView = HostelModuleView;
