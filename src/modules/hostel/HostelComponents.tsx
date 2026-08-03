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
  XCircle,
  Clock,
  UserCheck,
  UserX,
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
  ShieldAlert,
  MessageSquare,
  ClipboardList,
  Send,
  Check,
  Receipt,
  CalendarDays,
  Phone,
  UserPlus,
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
  const [activeTab, setActiveTab] = useState<"rooms" | "residents" | "passes">("rooms");

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

  const loadData = async () => {
    setLoading(true);
    const [rm, res, ps] = await Promise.all([
      fetchHostelRooms(),
      fetchHostelResidents(),
      fetchGatePasses(),
    ]);
    setRooms(rm);
    setResidents(res);
    setPasses(ps);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
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
    if (!roomForm.roomNo) return toast.error("Enter room number");
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
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-muted/60 border border-border/80">
        <button onClick={() => setActiveTab("rooms")} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === "rooms" ? "bg-card text-primary shadow-sm" : "text-muted-foreground"}`}>
          1. Room Allocation & Blocks ({rooms.length})
        </button>
        <button onClick={() => setActiveTab("residents")} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === "residents" ? "bg-card text-primary shadow-sm" : "text-muted-foreground"}`}>
          2. Resident Roster ({residents.length})
        </button>
        <button onClick={() => setActiveTab("passes")} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === "passes" ? "bg-card text-primary shadow-sm" : "text-muted-foreground"}`}>
          3. Gate Passes & Complaints ({passes.length})
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

export function HostelAttendanceView() {
  const [residents, setResidents] = useState<ResidentStudent[]>(INITIAL_RESIDENTS);
  const [search, setSearch] = useState("");
  const [selectedBlock, setSelectedBlock] = useState<string>("All Blocks");
  const [selectedRoom, setSelectedRoom] = useState<string>("All Rooms");
  const [attendanceDate, setAttendanceDate] = useState<string>("2026-08-03");

  const [attendanceState, setAttendanceState] = useState<Record<string, "Present" | "Absent" | "On Leave">>({
    "1": "Present",
    "2": "Present",
  });

  const handleMarkAttendance = (id: string, status: "Present" | "Absent" | "On Leave", name: string) => {
    setAttendanceState((prev) => ({ ...prev, [id]: status }));
    toast.success(`Marked ${name} as ${status}`);
  };

  const filteredResidents = residents.filter((r) => {
    const matchesSearch =
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.rollNo.toLowerCase().includes(search.toLowerCase());
    const matchesBlock = selectedBlock === "All Blocks" || r.block === selectedBlock;
    const matchesRoom = selectedRoom === "All Rooms" || r.roomNo === selectedRoom;
    return matchesSearch && matchesBlock && matchesRoom;
  });

  const totalCount = filteredResidents.length;
  const presentCount = filteredResidents.filter((r) => (attendanceState[r.id] || "Present") === "Present").length;
  const absentCount = filteredResidents.filter((r) => attendanceState[r.id] === "Absent").length;
  const leaveCount = filteredResidents.filter((r) => attendanceState[r.id] === "On Leave").length;
  const rate = totalCount > 0 ? Math.round((presentCount / totalCount) * 100) : 100;

  return (
    <div className="p-4 md:p-6 space-y-5 max-w-7xl mx-auto">
      {/* Breadcrumb Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
          <span>Dashboard</span>
          <span>/</span>
          <span>Hostel</span>
          <span>/</span>
          <span className="font-bold text-foreground">Attendance</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold font-display tracking-tight text-foreground">
          Hostel Daily Attendance
        </h1>
        <p className="text-xs md:text-sm text-muted-foreground">
          Mark and monitor student presence in the hostel blocks.
        </p>
      </div>

      {/* 5 Summary KPI Cards - Exact Image 1 Style */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-2xs flex items-center gap-3">
          <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-purple-500/10 text-purple-600">
            <Users className="size-5" />
          </div>
          <div>
            <p className="text-xl font-bold font-mono text-foreground">{totalCount}</p>
            <p className="text-[0.7rem] font-medium text-muted-foreground">Total Residents</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-2xs flex items-center gap-3">
          <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-emerald-500/10 text-emerald-600">
            <CheckCircle2 className="size-5" />
          </div>
          <div>
            <p className="text-xl font-bold font-mono text-emerald-600">{presentCount}</p>
            <p className="text-[0.7rem] font-medium text-muted-foreground">Present Today</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-2xs flex items-center gap-3">
          <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-rose-500/10 text-rose-600">
            <XCircle className="size-5" />
          </div>
          <div>
            <p className="text-xl font-bold font-mono text-rose-600">{absentCount}</p>
            <p className="text-[0.7rem] font-medium text-muted-foreground">Absent Today</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-2xs flex items-center gap-3">
          <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-amber-500/10 text-amber-600">
            <Clock className="size-5" />
          </div>
          <div>
            <p className="text-xl font-bold font-mono text-amber-600">{leaveCount}</p>
            <p className="text-[0.7rem] font-medium text-muted-foreground">On Leave</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-2xs flex items-center gap-3 col-span-2 md:col-span-1">
          <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-indigo-500/10 text-indigo-600">
            <RefreshCw className="size-5" />
          </div>
          <div>
            <p className="text-xl font-bold font-mono text-indigo-600">{rate}%</p>
            <p className="text-[0.7rem] font-medium text-muted-foreground">Attendance Rate</p>
          </div>
        </div>
      </div>

      {/* Filter Control Bar */}
      <div className="p-3 rounded-2xl bg-card border border-border/80 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative">
            <Input
              type="date"
              value={attendanceDate}
              onChange={(e) => setAttendanceDate(e.target.value)}
              className="h-9 w-36 rounded-xl text-xs font-mono bg-background"
            />
          </div>

          <Select value={selectedBlock} onValueChange={setSelectedBlock}>
            <SelectTrigger className="h-9 w-40 rounded-xl text-xs bg-background">
              <Filter className="size-3.5 mr-1.5 opacity-60" />
              <SelectValue placeholder="All Blocks" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All Blocks">All Blocks</SelectItem>
              <SelectItem value="Block A (Boys)">Block A (Boys)</SelectItem>
              <SelectItem value="Block B (Girls)">Block B (Girls)</SelectItem>
              <SelectItem value="Block C (PG Scholars)">Block C (PG Scholars)</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedRoom} onValueChange={setSelectedRoom}>
            <SelectTrigger className="h-9 w-36 rounded-xl text-xs bg-background">
              <Filter className="size-3.5 mr-1.5 opacity-60" />
              <SelectValue placeholder="All Rooms" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All Rooms">All Rooms</SelectItem>
              <SelectItem value="A-201">A-201</SelectItem>
              <SelectItem value="A-202">A-202</SelectItem>
              <SelectItem value="B-105">B-105</SelectItem>
              <SelectItem value="B-106">B-106</SelectItem>
              <SelectItem value="C-301">C-301</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by student name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-9 w-full rounded-full pl-8 text-xs bg-background"
          />
        </div>
      </div>

      {/* Main Content Register Table or Empty State (Exact Image 1) */}
      <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-2xs min-h-[320px] flex flex-col justify-center">
        {filteredResidents.length === 0 ? (
          <div className="text-center py-12 space-y-2">
            <div className="grid size-14 place-items-center rounded-full bg-muted/60 text-muted-foreground mx-auto">
              <Users className="size-7" />
            </div>
            <p className="text-sm font-medium text-muted-foreground">
              No residents found matching active filters.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/40 border-b border-border text-muted-foreground font-semibold uppercase tracking-wider text-[0.68rem]">
                <tr>
                  <th className="py-3 px-3">Roll No</th>
                  <th className="py-3 px-3">Resident Student</th>
                  <th className="py-3 px-3">Department</th>
                  <th className="py-3 px-3">Block & Room</th>
                  <th className="py-3 px-3">Attendance Status</th>
                  <th className="py-3 px-3 text-right pr-4">Quick Mark Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filteredResidents.map((res) => {
                  const currentStatus = attendanceState[res.id] || "Present";
                  return (
                    <tr key={res.id} className="hover:bg-muted/20 transition-colors">
                      <td className="py-3.5 px-3 font-mono font-bold text-foreground">{res.rollNo}</td>
                      <td className="py-3.5 px-3">
                        <div className="font-bold text-foreground">{res.name}</div>
                        <div className="text-[0.68rem] text-muted-foreground font-mono">{res.emergencyContact}</div>
                      </td>
                      <td className="py-3.5 px-3">{res.department}</td>
                      <td className="py-3.5 px-3 font-mono font-semibold text-primary">
                        {res.block} ({res.roomNo})
                      </td>
                      <td className="py-3.5 px-3">
                        <Badge
                          className={
                            currentStatus === "Present"
                              ? "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20"
                              : currentStatus === "Absent"
                              ? "bg-rose-500/10 text-rose-600 hover:bg-rose-500/20"
                              : "bg-amber-500/10 text-amber-600 hover:bg-amber-500/20"
                          }
                        >
                          {currentStatus}
                        </Badge>
                      </td>
                      <td className="py-3.5 px-3 text-right pr-4">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            size="sm"
                            variant={currentStatus === "Present" ? "default" : "outline"}
                            onClick={() => handleMarkAttendance(res.id, "Present", res.name)}
                            className={`h-7 px-2 text-[0.68rem] rounded-lg gap-1 ${
                              currentStatus === "Present" ? "bg-emerald-600 text-white" : ""
                            }`}
                          >
                            <UserCheck className="size-3" /> Present
                          </Button>
                          <Button
                            size="sm"
                            variant={currentStatus === "Absent" ? "destructive" : "outline"}
                            onClick={() => handleMarkAttendance(res.id, "Absent", res.name)}
                            className="h-7 px-2 text-[0.68rem] rounded-lg gap-1"
                          >
                            <UserX className="size-3" /> Absent
                          </Button>
                          <Button
                            size="sm"
                            variant={currentStatus === "On Leave" ? "secondary" : "outline"}
                            onClick={() => handleMarkAttendance(res.id, "On Leave", res.name)}
                            className="h-7 px-2 text-[0.68rem] rounded-lg gap-1"
                          >
                            <Clock className="size-3" /> Leave
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

/* ========================================================================== */
/* 2. VISITORS VIEW                                                            */
/* ========================================================================== */
export function HostelVisitorsView() {
  const [visitors, setVisitors] = useState([
    { id: "VIS-901", visitorName: "Ramesh Sharma", studentName: "Rohan Sharma", rollNo: "22CS101", relation: "Father", roomNo: "A-201", block: "Block A", inTime: "10:15 AM", outTime: "--", status: "Active" },
    { id: "VIS-902", visitorName: "Sunita Verma", studentName: "Ananya Verma", rollNo: "22EC014", relation: "Mother", roomNo: "B-105", block: "Block B", inTime: "11:30 AM", outTime: "01:45 PM", status: "Checked Out" },
    { id: "VIS-903", visitorName: "Vikram Malhotra", studentName: "Kabir Malhotra", rollNo: "22ME088", relation: "Brother", roomNo: "A-202", block: "Block A", inTime: "09:00 AM", outTime: "--", status: "Overstay" },
  ]);

  const [search, setSearch] = useState("");
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [form, setForm] = useState({ visitorName: "", studentName: "", rollNo: "", relation: "Father", roomNo: "A-201" });

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.visitorName || !form.studentName) return toast.error("Please fill visitor & student name");
    const newVis = {
      id: `VIS-${Math.floor(100 + Math.random() * 900)}`,
      visitorName: form.visitorName,
      studentName: form.studentName,
      rollNo: form.rollNo || "22CS101",
      relation: form.relation,
      roomNo: form.roomNo,
      block: form.roomNo.startsWith("B") ? "Block B" : "Block A",
      inTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      outTime: "--",
      status: "Active",
    };
    setVisitors([newVis, ...visitors]);
    setIsRegisterOpen(false);
    toast.success(`Registered visitor entry for ${form.visitorName}!`);
  };

  const handleCheckout = (id: string, name: string) => {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setVisitors(prev => prev.map(v => v.id === id ? { ...v, status: "Checked Out", outTime: timeStr } : v));
    toast.success(`Checked out ${name} at ${timeStr}`);
  };

  const filtered = visitors.filter(v => v.visitorName.toLowerCase().includes(search.toLowerCase()) || v.studentName.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="p-4 md:p-6 space-y-5 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
            <span>Dashboard</span><span>/</span><span>Hostel</span><span>/</span><span className="font-bold text-foreground">Visitors</span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground mt-1">Hostel Visitor Register</h1>
          <p className="text-xs text-muted-foreground">Track visitor check-ins, parent passes, and identity verification logs.</p>
        </div>
        <Button onClick={() => setIsRegisterOpen(true)} className="bg-brand-gradient text-white gap-2 text-xs font-semibold shadow-glow h-9">
          <UserPlus className="size-4" /> Register Visitor
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-2xs space-y-1">
          <p className="text-xs font-semibold text-muted-foreground uppercase">Total Today</p>
          <p className="text-2xl font-bold font-mono text-foreground">{visitors.length}</p>
        </div>
        <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-2xs space-y-1">
          <p className="text-xs font-semibold text-muted-foreground uppercase">Currently Inside</p>
          <p className="text-2xl font-bold font-mono text-emerald-600">{visitors.filter(v => v.status === "Active").length}</p>
        </div>
        <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-2xs space-y-1">
          <p className="text-xs font-semibold text-muted-foreground uppercase">Checked Out</p>
          <p className="text-2xl font-bold font-mono text-blue-600">{visitors.filter(v => v.status === "Checked Out").length}</p>
        </div>
        <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-2xs space-y-1">
          <p className="text-xs font-semibold text-muted-foreground uppercase">Overstay Alerts</p>
          <p className="text-2xl font-bold font-mono text-rose-600">{visitors.filter(v => v.status === "Overstay").length}</p>
        </div>
      </div>

      <div className="rounded-2xl border border-border/80 bg-card p-5 space-y-4 shadow-2xs">
        <div className="flex items-center justify-between gap-3">
          <h3 className="font-bold text-sm text-foreground">Visitor Log Ledger</h3>
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search visitor or student..." value={search} onChange={e => setSearch(e.target.value)} className="h-8 pl-8 text-xs rounded-full bg-background" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted/40 border-b border-border text-muted-foreground font-semibold uppercase tracking-wider text-[0.68rem]">
              <tr>
                <th className="py-3 px-3">Pass ID</th>
                <th className="py-3 px-3">Visitor Name</th>
                <th className="py-3 px-3">Student Name</th>
                <th className="py-3 px-3">Relation</th>
                <th className="py-3 px-3">Room & Block</th>
                <th className="py-3 px-3">Check In</th>
                <th className="py-3 px-3">Check Out</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right pr-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filtered.map(v => (
                <tr key={v.id} className="hover:bg-muted/20 transition-colors">
                  <td className="py-3 px-3 font-mono font-bold text-foreground">{v.id}</td>
                  <td className="py-3 px-3 font-bold text-foreground">{v.visitorName}</td>
                  <td className="py-3 px-3 font-semibold text-primary">{v.studentName} ({v.rollNo})</td>
                  <td className="py-3 px-3">{v.relation}</td>
                  <td className="py-3 px-3 font-mono">{v.block} - {v.roomNo}</td>
                  <td className="py-3 px-3 font-mono text-muted-foreground">{v.inTime}</td>
                  <td className="py-3 px-3 font-mono text-muted-foreground">{v.outTime}</td>
                  <td className="py-3 px-3">
                    <Badge className={v.status === "Active" ? "bg-emerald-500/10 text-emerald-600" : v.status === "Overstay" ? "bg-rose-500/10 text-rose-600" : "bg-muted text-muted-foreground"}>
                      {v.status}
                    </Badge>
                  </td>
                  <td className="py-3 px-3 text-right pr-4">
                    {v.status !== "Checked Out" && (
                      <Button size="sm" onClick={() => handleCheckout(v.id, v.visitorName)} className="h-7 text-[0.68rem] bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg">
                        Check Out
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={isRegisterOpen} onOpenChange={setIsRegisterOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle className="text-base font-bold">Register Visitor Check-In</DialogTitle></DialogHeader>
          <form onSubmit={handleRegister} className="space-y-3 pt-2">
            <div className="space-y-1"><Label className="text-xs font-semibold">Visitor Name *</Label><Input required placeholder="e.g. Ramesh Sharma" value={form.visitorName} onChange={e => setForm({ ...form, visitorName: e.target.value })} className="h-9 text-xs" /></div>
            <div className="space-y-1"><Label className="text-xs font-semibold">Hostel Inmate / Student Name *</Label><Input required placeholder="e.g. Rohan Sharma" value={form.studentName} onChange={e => setForm({ ...form, studentName: e.target.value })} className="h-9 text-xs" /></div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1"><Label className="text-xs font-semibold">Roll No</Label><Input placeholder="22CS101" value={form.rollNo} onChange={e => setForm({ ...form, rollNo: e.target.value })} className="h-9 text-xs font-mono" /></div>
              <div className="space-y-1"><Label className="text-xs font-semibold">Room No</Label><Input placeholder="A-201" value={form.roomNo} onChange={e => setForm({ ...form, roomNo: e.target.value })} className="h-9 text-xs font-mono" /></div>
            </div>
            <DialogFooter className="pt-2"><Button type="button" variant="outline" onClick={() => setIsRegisterOpen(false)} className="text-xs">Cancel</Button><Button type="submit" className="bg-brand-gradient text-white text-xs font-semibold">Register Entry</Button></DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* ========================================================================== */
/* 3. COMPLAINTS VIEW                                                          */
/* ========================================================================== */
export function HostelComplaintsView() {
  const [complaints, setComplaints] = useState([
    { id: "TKT-401", studentName: "Meka Tarun", roomNo: "A-201", block: "Block A", category: "Plumbing", description: "Leaking tap in bathroom 201", priority: "High", date: "2026-08-02", status: "Open" },
    { id: "TKT-402", studentName: "Ananya Verma", roomNo: "B-105", block: "Block B", category: "Electrical", description: "Ceiling fan speed regulator broken", priority: "Medium", date: "2026-08-01", status: "In Progress" },
    { id: "TKT-403", studentName: "Siddharth Rao", roomNo: "C-301", block: "Block C", category: "Wi-Fi / Internet", description: "No signal in room C-301 corridor", priority: "Low", date: "2026-07-30", status: "Resolved" },
  ]);

  const [isNewOpen, setIsNewOpen] = useState(false);
  const [form, setForm] = useState({ studentName: "", roomNo: "A-201", category: "Plumbing", description: "", priority: "Medium" });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.description) return toast.error("Please enter complaint description");
    const tkt = {
      id: `TKT-${Math.floor(400 + Math.random() * 500)}`,
      studentName: form.studentName || "Inmate Scholar",
      roomNo: form.roomNo,
      block: form.roomNo.startsWith("B") ? "Block B" : "Block A",
      category: form.category,
      description: form.description,
      priority: form.priority,
      date: new Date().toISOString().split("T")[0],
      status: "Open",
    };
    setComplaints([tkt, ...complaints]);
    setIsNewOpen(false);
    toast.success(`Complaint ${tkt.id} submitted to maintenance desk!`);
  };

  const handleResolve = (id: string) => {
    setComplaints(prev => prev.map(c => c.id === id ? { ...c, status: "Resolved" } : c));
    toast.success(`Ticket ${id} marked as resolved!`);
  };

  return (
    <div className="p-4 md:p-6 space-y-5 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
            <span>Dashboard</span><span>/</span><span>Hostel</span><span>/</span><span className="font-bold text-foreground">Complaints</span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground mt-1">Complaints & Maintenance Desk</h1>
          <p className="text-xs text-muted-foreground">Manage student maintenance tickets, plumbing/electrical requests, and grievance desk.</p>
        </div>
        <Button onClick={() => setIsNewOpen(true)} className="bg-brand-gradient text-white gap-2 text-xs font-semibold shadow-glow h-9">
          <Plus className="size-4" /> Lodge Complaint
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-2xs space-y-1">
          <p className="text-xs font-semibold text-muted-foreground uppercase">Open Tickets</p>
          <p className="text-2xl font-bold font-mono text-rose-600">{complaints.filter(c => c.status === "Open").length}</p>
        </div>
        <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-2xs space-y-1">
          <p className="text-xs font-semibold text-muted-foreground uppercase">In Progress</p>
          <p className="text-2xl font-bold font-mono text-amber-600">{complaints.filter(c => c.status === "In Progress").length}</p>
        </div>
        <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-2xs space-y-1">
          <p className="text-xs font-semibold text-muted-foreground uppercase">Resolved</p>
          <p className="text-2xl font-bold font-mono text-emerald-600">{complaints.filter(c => c.status === "Resolved").length}</p>
        </div>
        <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-2xs space-y-1">
          <p className="text-xs font-semibold text-muted-foreground uppercase">Avg Resolution Time</p>
          <p className="text-2xl font-bold font-mono text-indigo-600">4.2 Hrs</p>
        </div>
      </div>

      <div className="rounded-2xl border border-border/80 bg-card p-5 space-y-4 shadow-2xs">
        <h3 className="font-bold text-sm text-foreground">Maintenance Requests Ledger</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted/40 border-b border-border text-muted-foreground font-semibold uppercase tracking-wider text-[0.68rem]">
              <tr>
                <th className="py-3 px-3">Ticket ID</th>
                <th className="py-3 px-3">Student Name</th>
                <th className="py-3 px-3">Room & Block</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3">Issue Description</th>
                <th className="py-3 px-3">Priority</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right pr-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {complaints.map(c => (
                <tr key={c.id} className="hover:bg-muted/20 transition-colors">
                  <td className="py-3 px-3 font-mono font-bold text-foreground">{c.id}</td>
                  <td className="py-3 px-3 font-bold text-foreground">{c.studentName}</td>
                  <td className="py-3 px-3 font-mono font-semibold text-primary">{c.block} ({c.roomNo})</td>
                  <td className="py-3 px-3 font-medium">{c.category}</td>
                  <td className="py-3 px-3 max-w-xs truncate text-muted-foreground">{c.description}</td>
                  <td className="py-3 px-3">
                    <Badge className={c.priority === "High" ? "bg-rose-500/10 text-rose-600" : c.priority === "Medium" ? "bg-amber-500/10 text-amber-600" : "bg-muted text-muted-foreground"}>
                      {c.priority}
                    </Badge>
                  </td>
                  <td className="py-3 px-3">
                    <Badge className={c.status === "Open" ? "bg-rose-500/10 text-rose-600" : c.status === "In Progress" ? "bg-amber-500/10 text-amber-600" : "bg-emerald-500/10 text-emerald-600"}>
                      {c.status}
                    </Badge>
                  </td>
                  <td className="py-3 px-3 text-right pr-4">
                    {c.status !== "Resolved" && (
                      <Button size="sm" onClick={() => handleResolve(c.id)} className="h-7 text-[0.68rem] bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg gap-1">
                        <Check className="size-3" /> Mark Resolved
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={isNewOpen} onOpenChange={setIsNewOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle className="text-base font-bold">Lodge Maintenance Complaint</DialogTitle></DialogHeader>
          <form onSubmit={handleCreate} className="space-y-3 pt-2">
            <div className="space-y-1"><Label className="text-xs font-semibold">Student Name *</Label><Input required placeholder="Meka Tarun" value={form.studentName} onChange={e => setForm({ ...form, studentName: e.target.value })} className="h-9 text-xs" /></div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1"><Label className="text-xs font-semibold">Room No</Label><Input placeholder="A-201" value={form.roomNo} onChange={e => setForm({ ...form, roomNo: e.target.value })} className="h-9 text-xs font-mono" /></div>
              <div className="space-y-1"><Label className="text-xs font-semibold">Category</Label>
                <Select value={form.category} onValueChange={val => setForm({ ...form, category: val })}>
                  <SelectTrigger className="h-9 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Plumbing">Plumbing</SelectItem>
                    <SelectItem value="Electrical">Electrical</SelectItem>
                    <SelectItem value="Wi-Fi / Internet">Wi-Fi / Internet</SelectItem>
                    <SelectItem value="Furniture">Furniture</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1"><Label className="text-xs font-semibold">Issue Description *</Label><Input required placeholder="Brief detail of issue..." value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="h-9 text-xs" /></div>
            <DialogFooter className="pt-2"><Button type="button" variant="outline" onClick={() => setIsNewOpen(false)} className="text-xs">Cancel</Button><Button type="submit" className="bg-brand-gradient text-white text-xs font-semibold">Submit Complaint</Button></DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* ========================================================================== */
/* 4. MESS MENUS VIEW                                                         */
/* ========================================================================== */
export function HostelMessMenusView() {
  const [selectedDay, setSelectedDay] = useState("Monday");

  const weeklyMenus: Record<string, { breakfast: string; lunch: string; snacks: string; dinner: string }> = {
    Monday: { breakfast: "Idli, Sambar, Coconut Chutney, Bread & Jam, Tea/Coffee", lunch: "Steamed Rice, Dal Tadka, Paneer Butter Masala, Chapati, Curd, Salad", snacks: "Vegetable Samosa, Mint Chutney, Tea/Coffee", dinner: "Veg Biryani, Mirchi Ka Salan, Phulka, Raitha, Gulab Jamun" },
    Tuesday: { breakfast: "Masala Dosa, Potato Masala, Sambar, Chutney, Tea/Coffee", lunch: "Jeera Rice, Chana Masala, Mixed Veg Curry, Roti, Butter Milk", snacks: "Banana Chips, Milk / Tea", dinner: "Kadai Paneer / Egg Curry, Steamed Rice, Chapati, Kheer" },
    Wednesday: { breakfast: "Puri Bhaji, Sprouted Moong Salad, Tea/Coffee", lunch: "Lemon Rice, Tomato Pappu, Aloo Gobi Fry, Curd Rice, Papad", snacks: "Pav Bhaji, Hot Tea", dinner: "Butter Naan, Malai Kofta / Chicken Curry, Jeera Rice, Ice Cream" },
    Thursday: { breakfast: "Upma, Kesari Bath, Peanut Chutney, Tea/Coffee", lunch: "Plain Rice, Palak Dal, Bhindi Fry, Sambar, Curd, Salad", snacks: "Corn Flakes / Biscuits, Tea", dinner: "Veg Pulao, Paneer Tikka Masala, Phulka, Moong Dal Halwa" },
    Friday: { breakfast: "Poha, Sev, Fried Green Chilies, Tea/Coffee", lunch: "Rajma Chawal, Chapati, Mix Veg Poriyal, Rasam, Curd", snacks: "Pakora, Green Chutney, Tea", dinner: "Special South Indian Thali / Chicken Biryani, Rasgulla" },
    Saturday: { breakfast: "Aloo Paratha, Curd, Pickle, Butter, Tea/Coffee", lunch: "Veg Fried Rice, Manchurian Gravy, Veg Noodles, Soup", snacks: "French Fries, Ketchup, Coffee", dinner: "Paneer Lababdar, Chapati, Steamed Rice, Dal Makhani, Jalebi" },
    Sunday: { breakfast: "Masala Utappam, Sambar, Coconut & Tomato Chutney", lunch: "Special Dum Biryani (Veg/Non-Veg), Raitha, Salan, Ice Cream", snacks: "Cake Slice, Hot Chocolate / Milk", dinner: "Phulka, Mushroom Masala, Curd Rice, Fruit Salad" },
  };

  const menu = weeklyMenus[selectedDay] || weeklyMenus["Monday"];

  return (
    <div className="p-4 md:p-6 space-y-5 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
            <span>Dashboard</span><span>/</span><span>Hostel</span><span>/</span><span className="font-bold text-foreground">Mess Menus</span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground mt-1">Mess Timetable & Food Menus</h1>
          <p className="text-xs text-muted-foreground">Weekly nutrition schedule, meal timings, special diet requests, and food ratings.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-2xs space-y-1">
          <p className="text-xs font-semibold text-muted-foreground uppercase">Daily Meals Served</p>
          <p className="text-2xl font-bold font-mono text-foreground">3,174</p>
        </div>
        <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-2xs space-y-1">
          <p className="text-xs font-semibold text-muted-foreground uppercase">Food Rating</p>
          <p className="text-2xl font-bold font-mono text-amber-500">4.8 ★</p>
        </div>
        <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-2xs space-y-1">
          <p className="text-xs font-semibold text-muted-foreground uppercase">Special Diets Active</p>
          <p className="text-2xl font-bold font-mono text-indigo-600">14</p>
        </div>
        <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-2xs space-y-1">
          <p className="text-xs font-semibold text-muted-foreground uppercase">Veg / Non-Veg Ratio</p>
          <p className="text-2xl font-bold font-mono text-emerald-600">70 / 30</p>
        </div>
      </div>

      <div className="flex items-center gap-1.5 overflow-x-auto p-1.5 rounded-2xl bg-muted/60 border border-border/80">
        {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map(day => (
          <button key={day} onClick={() => setSelectedDay(day)} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${selectedDay === day ? "bg-card text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>
            {day}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-5 rounded-2xl border border-border/80 bg-card space-y-2 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-600 uppercase flex items-center gap-2">
              <Utensils className="size-4" /> Breakfast (07:30 AM - 09:00 AM)
            </span>
            <Badge variant="outline" className="text-[0.65rem] font-mono">Veg</Badge>
          </div>
          <p className="text-sm font-semibold text-foreground leading-relaxed">{menu.breakfast}</p>
        </div>

        <div className="p-5 rounded-2xl border border-border/80 bg-card space-y-2 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-600 uppercase flex items-center gap-2">
              <Utensils className="size-4" /> Lunch (12:30 PM - 02:00 PM)
            </span>
            <Badge variant="outline" className="text-[0.65rem] font-mono">Veg & Salad</Badge>
          </div>
          <p className="text-sm font-semibold text-foreground leading-relaxed">{menu.lunch}</p>
        </div>

        <div className="p-5 rounded-2xl border border-border/80 bg-card space-y-2 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-indigo-600 uppercase flex items-center gap-2">
              <Utensils className="size-4" /> Evening Snacks (05:00 PM - 06:00 PM)
            </span>
            <Badge variant="outline" className="text-[0.65rem] font-mono">Tea/Coffee</Badge>
          </div>
          <p className="text-sm font-semibold text-foreground leading-relaxed">{menu.snacks}</p>
        </div>

        <div className="p-5 rounded-2xl border border-border/80 bg-card space-y-2 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[0.65rem] font-mono uppercase text-purple-600 font-bold flex items-center gap-2">
              <Utensils className="size-4" /> Dinner (07:30 PM - 09:00 PM)
            </span>
            <Badge variant="outline" className="text-[0.65rem] font-mono">Special Dessert</Badge>
          </div>
          <p className="text-sm font-semibold text-foreground leading-relaxed">{menu.dinner}</p>
        </div>
      </div>
    </div>
  );
}

/* ========================================================================== */
/* 5. MESS FEES VIEW                                                          */
/* ========================================================================== */
export function HostelMessFeesView() {
  const [ledger, setLedger] = useState([
    { rollNo: "22CS101", studentName: "Meka Tarun", roomNo: "A-201", month: "August 2026", tariff: 3500, rebateDays: 4, rebateAmount: 466, netPayable: 3034, status: "Paid" },
    { rollNo: "22EC014", studentName: "Ananya Verma", roomNo: "B-105", month: "August 2026", tariff: 3500, rebateDays: 0, rebateAmount: 0, netPayable: 3500, status: "Pending" },
    { rollNo: "22ME088", studentName: "Kabir Malhotra", roomNo: "A-202", month: "August 2026", tariff: 3500, rebateDays: 2, rebateAmount: 233, netPayable: 3267, status: "Paid" },
  ]);

  const [isRebateOpen, setIsRebateOpen] = useState(false);
  const [rebateForm, setRebateForm] = useState({ rollNo: "22CS101", days: 3, reason: "Academic Outstation Duty" });

  const handleApplyRebate = (e: React.FormEvent) => {
    e.preventDefault();
    const rebateVal = Math.round((Number(rebateForm.days) * 3500) / 30);
    setLedger(prev => prev.map(item => item.rollNo === rebateForm.rollNo ? {
      ...item,
      rebateDays: item.rebateDays + Number(rebateForm.days),
      rebateAmount: item.rebateAmount + rebateVal,
      netPayable: Math.max(0, item.netPayable - rebateVal)
    } : item));
    setIsRebateOpen(false);
    toast.success(`Applied ${rebateForm.days} days mess rebate credit (₹${rebateVal})!`);
  };

  const handlePay = (rollNo: string, name: string) => {
    setLedger(prev => prev.map(l => l.rollNo === rollNo ? { ...l, status: "Paid" } : l));
    toast.success(`Collected mess fee payment for ${name}`);
  };

  return (
    <div className="p-4 md:p-6 space-y-5 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
            <span>Dashboard</span><span>/</span><span>Hostel</span><span>/</span><span className="font-bold text-foreground">Mess Fees</span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground mt-1">Hostel Mess Fee Billing & Rebates</h1>
          <p className="text-xs text-muted-foreground">Monthly mess billing, absence rebate credits, and payment clearance ledger.</p>
        </div>
        <Button onClick={() => setIsRebateOpen(true)} className="bg-brand-gradient text-white gap-2 text-xs font-semibold shadow-glow h-9">
          <Plus className="size-4" /> Apply Mess Rebate
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-2xs space-y-1">
          <p className="text-xs font-semibold text-muted-foreground uppercase">Monthly Tariff</p>
          <p className="text-2xl font-bold font-mono text-foreground">₹ 3,500</p>
        </div>
        <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-2xs space-y-1">
          <p className="text-xs font-semibold text-muted-foreground uppercase">Total Mess Dues</p>
          <p className="text-2xl font-bold font-mono text-rose-600">₹ 1.8L</p>
        </div>
        <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-2xs space-y-1">
          <p className="text-xs font-semibold text-muted-foreground uppercase">Approved Rebate Days</p>
          <p className="text-2xl font-bold font-mono text-indigo-600">32 Days</p>
        </div>
        <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-2xs space-y-1">
          <p className="text-xs font-semibold text-muted-foreground uppercase">Cleared Inmates</p>
          <p className="text-2xl font-bold font-mono text-emerald-600">982</p>
        </div>
      </div>

      <div className="rounded-2xl border border-border/80 bg-card p-5 space-y-4 shadow-2xs">
        <h3 className="font-bold text-sm text-foreground">Monthly Mess Tariff Ledger (August 2026)</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted/40 border-b border-border text-muted-foreground font-semibold uppercase tracking-wider text-[0.68rem]">
              <tr>
                <th className="py-3 px-3">Roll No</th>
                <th className="py-3 px-3">Student Name</th>
                <th className="py-3 px-3">Room</th>
                <th className="py-3 px-3">Monthly Tariff</th>
                <th className="py-3 px-3">Rebate Days</th>
                <th className="py-3 px-3">Rebate Credit</th>
                <th className="py-3 px-3">Net Payable</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right pr-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {ledger.map(l => (
                <tr key={l.rollNo} className="hover:bg-muted/20 transition-colors">
                  <td className="py-3 px-3 font-mono font-bold text-foreground">{l.rollNo}</td>
                  <td className="py-3 px-3 font-bold text-foreground">{l.studentName}</td>
                  <td className="py-3 px-3 font-mono text-primary font-semibold">{l.roomNo}</td>
                  <td className="py-3 px-3 font-mono">₹{l.tariff}</td>
                  <td className="py-3 px-3 font-mono font-bold text-indigo-600">{l.rebateDays} Days</td>
                  <td className="py-3 px-3 font-mono text-emerald-600">- ₹{l.rebateAmount}</td>
                  <td className="py-3 px-3 font-mono font-bold text-foreground">₹{l.netPayable}</td>
                  <td className="py-3 px-3">
                    <Badge className={l.status === "Paid" ? "bg-emerald-500/10 text-emerald-600" : "bg-rose-500/10 text-rose-600"}>
                      {l.status}
                    </Badge>
                  </td>
                  <td className="py-3 px-3 text-right pr-4">
                    {l.status === "Pending" && (
                      <Button size="sm" onClick={() => handlePay(l.rollNo, l.studentName)} className="h-7 text-[0.68rem] bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg">
                        Collect Fee
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={isRebateOpen} onOpenChange={setIsRebateOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle className="text-base font-bold">Apply Mess Absence Rebate</DialogTitle></DialogHeader>
          <form onSubmit={handleApplyRebate} className="space-y-3 pt-2">
            <div className="space-y-1"><Label className="text-xs font-semibold">Select Student Roll No *</Label>
              <Select value={rebateForm.rollNo} onValueChange={val => setRebateForm({ ...rebateForm, rollNo: val })}>
                <SelectTrigger className="h-9 text-xs font-mono"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="22CS101">22CS101 (Meka Tarun)</SelectItem>
                  <SelectItem value="22EC014">22EC014 (Ananya Verma)</SelectItem>
                  <SelectItem value="22ME088">22ME088 (Kabir Malhotra)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1"><Label className="text-xs font-semibold">Absence Days *</Label><Input type="number" min="1" max="15" value={rebateForm.days} onChange={e => setRebateForm({ ...rebateForm, days: Number(e.target.value) })} className="h-9 text-xs font-mono" /></div>
            <div className="space-y-1"><Label className="text-xs font-semibold">Rebate Reason *</Label><Input placeholder="Academic Outstation Duty / Medical Leave" value={rebateForm.reason} onChange={e => setRebateForm({ ...rebateForm, reason: e.target.value })} className="h-9 text-xs" /></div>
            <DialogFooter className="pt-2"><Button type="button" variant="outline" onClick={() => setIsRebateOpen(false)} className="text-xs">Cancel</Button><Button type="submit" className="bg-brand-gradient text-white text-xs font-semibold">Apply Credit</Button></DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* ========================================================================== */
/* 6. RESIDENTS VIEW                                                          */
/* ========================================================================== */
export function HostelResidentsView() {
  const [residents, setResidents] = useState<ResidentStudent[]>(INITIAL_RESIDENTS);
  const [search, setSearch] = useState("");

  const filtered = residents.filter(r => r.name.toLowerCase().includes(search.toLowerCase()) || r.rollNo.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="p-4 md:p-6 space-y-5 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
            <span>Dashboard</span><span>/</span><span>Hostel</span><span>/</span><span className="font-bold text-foreground">Residents</span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground mt-1">Hostel Resident Scholars Roster</h1>
          <p className="text-xs text-muted-foreground">Complete directory of active hostel scholars, room allotments, and emergency contacts.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-2xs space-y-1">
          <p className="text-xs font-semibold text-muted-foreground uppercase">Total Inmates</p>
          <p className="text-2xl font-bold font-mono text-foreground">850</p>
        </div>
        <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-2xs space-y-1">
          <p className="text-xs font-semibold text-muted-foreground uppercase">Boys Hostel</p>
          <p className="text-2xl font-bold font-mono text-indigo-600">480</p>
        </div>
        <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-2xs space-y-1">
          <p className="text-xs font-semibold text-muted-foreground uppercase">Girls Hostel</p>
          <p className="text-2xl font-bold font-mono text-purple-600">320</p>
        </div>
        <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-2xs space-y-1">
          <p className="text-xs font-semibold text-muted-foreground uppercase">PG Scholars</p>
          <p className="text-2xl font-bold font-mono text-emerald-600">50</p>
        </div>
      </div>

      <div className="rounded-2xl border border-border/80 bg-card p-5 space-y-4 shadow-2xs">
        <div className="flex items-center justify-between gap-3">
          <h3 className="font-bold text-sm text-foreground">Active Resident Scholars</h3>
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search by name or roll..." value={search} onChange={e => setSearch(e.target.value)} className="h-8 pl-8 text-xs rounded-full bg-background" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted/40 border-b border-border text-muted-foreground font-semibold uppercase tracking-wider text-[0.68rem]">
              <tr>
                <th className="py-3 px-3">Roll No</th>
                <th className="py-3 px-3">Resident Name</th>
                <th className="py-3 px-3">Department</th>
                <th className="py-3 px-3">Block & Room</th>
                <th className="py-3 px-3">Hostel Fee Status</th>
                <th className="py-3 px-3">Emergency Contact</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filtered.map((res) => (
                <tr key={res.id} className="hover:bg-muted/20 transition-colors">
                  <td className="py-3 px-3 font-mono font-bold text-foreground">{res.rollNo}</td>
                  <td className="py-3 px-3 font-semibold text-foreground">{res.name}</td>
                  <td className="py-3 px-3">{res.department}</td>
                  <td className="py-3 px-3 font-mono text-primary font-bold">{res.block} ({res.roomNo})</td>
                  <td className="py-3 px-3"><Badge className="bg-emerald-500/10 text-emerald-600">{res.feeStatus}</Badge></td>
                  <td className="py-3 px-3 font-mono text-muted-foreground">{res.emergencyContact}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ========================================================================== */
/* 7. FEES VIEW                                                               */
/* ========================================================================== */
export function HostelFeesView() {
  const [records, setRecords] = useState([
    { rollNo: "22CS101", studentName: "Meka Tarun", roomNo: "A-201", block: "Block A", totalFee: 95000, paid: 95000, balance: 0, status: "Fully Paid" },
    { rollNo: "22EC014", studentName: "Ananya Verma", roomNo: "B-105", block: "Block B", totalFee: 95000, paid: 50000, balance: 45000, status: "Partially Paid" },
    { rollNo: "22ME088", studentName: "Kabir Malhotra", roomNo: "A-202", block: "Block A", totalFee: 75000, paid: 75000, balance: 0, status: "Fully Paid" },
  ]);

  const handlePayBalance = (rollNo: string, name: string) => {
    setRecords(prev => prev.map(r => r.rollNo === rollNo ? { ...r, paid: r.totalFee, balance: 0, status: "Fully Paid" } : r));
    toast.success(`Recorded full fee clearance for ${name}!`);
  };

  return (
    <div className="p-4 md:p-6 space-y-5 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
            <span>Dashboard</span><span>/</span><span>Hostel</span><span>/</span><span className="font-bold text-foreground">Fees</span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground mt-1">Hostel Annual Fee Collection Ledger</h1>
          <p className="text-xs text-muted-foreground">Annual room tariff collection, installment tracking, and balance dues ledger.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-2xs space-y-1">
          <p className="text-xs font-semibold text-muted-foreground uppercase">Total Collection</p>
          <p className="text-2xl font-bold font-mono text-emerald-600">₹ 48.5L</p>
        </div>
        <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-2xs space-y-1">
          <p className="text-xs font-semibold text-muted-foreground uppercase">Pending Dues</p>
          <p className="text-2xl font-bold font-mono text-rose-600">₹ 6.2L</p>
        </div>
        <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-2xs space-y-1">
          <p className="text-xs font-semibold text-muted-foreground uppercase">Clearance Rate</p>
          <p className="text-2xl font-bold font-mono text-indigo-600">88.6%</p>
        </div>
        <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-2xs space-y-1">
          <p className="text-xs font-semibold text-muted-foreground uppercase">Defaulters Count</p>
          <p className="text-2xl font-bold font-mono text-amber-600">14 Inmates</p>
        </div>
      </div>

      <div className="rounded-2xl border border-border/80 bg-card p-5 space-y-4 shadow-2xs">
        <h3 className="font-bold text-sm text-foreground">Annual Fee Allocation Roster</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted/40 border-b border-border text-muted-foreground font-semibold uppercase tracking-wider text-[0.68rem]">
              <tr>
                <th className="py-3 px-3">Roll No</th>
                <th className="py-3 px-3">Student Name</th>
                <th className="py-3 px-3">Block & Room</th>
                <th className="py-3 px-3">Annual Tariff</th>
                <th className="py-3 px-3">Amount Paid</th>
                <th className="py-3 px-3">Balance Dues</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right pr-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {records.map(r => (
                <tr key={r.rollNo} className="hover:bg-muted/20 transition-colors">
                  <td className="py-3 px-3 font-mono font-bold text-foreground">{r.rollNo}</td>
                  <td className="py-3 px-3 font-bold text-foreground">{r.studentName}</td>
                  <td className="py-3 px-3 font-mono text-primary font-semibold">{r.block} ({r.roomNo})</td>
                  <td className="py-3 px-3 font-mono font-bold">₹{r.totalFee.toLocaleString()}</td>
                  <td className="py-3 px-3 font-mono text-emerald-600 font-bold">₹{r.paid.toLocaleString()}</td>
                  <td className="py-3 px-3 font-mono text-rose-600 font-bold">₹{r.balance.toLocaleString()}</td>
                  <td className="py-3 px-3">
                    <Badge className={r.status === "Fully Paid" ? "bg-emerald-500/10 text-emerald-600" : "bg-amber-500/10 text-amber-600"}>
                      {r.status}
                    </Badge>
                  </td>
                  <td className="py-3 px-3 text-right pr-4">
                    {r.balance > 0 && (
                      <Button size="sm" onClick={() => handlePayBalance(r.rollNo, r.studentName)} className="h-7 text-[0.68rem] bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg">
                        Record Payment
                      </Button>
                    )}
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

/* ========================================================================== */
/* 8. NOTIFICATIONS VIEW                                                     */
/* ========================================================================== */
export function HostelNotificationsView() {
  const [circulars, setCirculars] = useState([
    { id: "CIR-101", title: "Night Curfew Timing Strict Enforcement", audience: "All Hostel Inmates", date: "2026-08-01", priority: "High", content: "All resident scholars must check into their respective blocks by 09:30 PM sharp." },
    { id: "CIR-102", title: "Mess Special Sunday Dinner Schedule", audience: "All Hostel Inmates", date: "2026-07-28", priority: "Normal", content: "Special Dum Biryani will be served this Sunday between 07:30 PM to 09:30 PM." },
  ]);

  const [isPostOpen, setIsPostOpen] = useState(false);
  const [form, setForm] = useState({ title: "", audience: "All Hostel Inmates", content: "" });

  const handlePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.content) return toast.error("Please enter notice title & content");
    const cir = {
      id: `CIR-${Math.floor(100 + Math.random() * 900)}`,
      title: form.title,
      audience: form.audience,
      date: new Date().toISOString().split("T")[0],
      priority: "Normal",
      content: form.content,
    };
    setCirculars([cir, ...circulars]);
    setIsPostOpen(false);
    toast.success("Broadcasted warden circular to all inmates!");
  };

  return (
    <div className="p-4 md:p-6 space-y-5 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
            <span>Dashboard</span><span>/</span><span>Hostel</span><span>/</span><span className="font-bold text-foreground">Notifications</span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground mt-1">Hostel Notices & Broadcast Center</h1>
          <p className="text-xs text-muted-foreground">Emergency alerts, warden circulars, and SMS broadcast logs.</p>
        </div>
        <Button onClick={() => setIsPostOpen(true)} className="bg-brand-gradient text-white gap-2 text-xs font-semibold shadow-glow h-9">
          <Send className="size-4" /> Post Warden Notice
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {circulars.map(c => (
          <div key={c.id} className="p-5 rounded-2xl border border-border/80 bg-card space-y-2 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-primary">{c.id}</span>
              <Badge variant="outline" className="text-[0.65rem]">{c.date}</Badge>
            </div>
            <h3 className="font-bold text-base text-foreground">{c.title}</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">{c.content}</p>
            <div className="pt-2 flex items-center justify-between text-[0.7rem] text-muted-foreground border-t border-border/40">
              <span>Audience: <b>{c.audience}</b></span>
              <Badge className="bg-purple-500/10 text-purple-600">Active Notice</Badge>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={isPostOpen} onOpenChange={setIsPostOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle className="text-base font-bold">Post Warden Circular</DialogTitle></DialogHeader>
          <form onSubmit={handlePost} className="space-y-3 pt-2">
            <div className="space-y-1"><Label className="text-xs font-semibold">Notice Title *</Label><Input required placeholder="e.g. Mess Maintenance Notice" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="h-9 text-xs" /></div>
            <div className="space-y-1"><Label className="text-xs font-semibold">Audience</Label>
              <Select value={form.audience} onValueChange={val => setForm({ ...form, audience: val })}>
                <SelectTrigger className="h-9 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="All Hostel Inmates">All Hostel Inmates</SelectItem>
                  <SelectItem value="Block A (Boys)">Block A (Boys)</SelectItem>
                  <SelectItem value="Block B (Girls)">Block B (Girls)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1"><Label className="text-xs font-semibold">Notice Content *</Label><Input required placeholder="Detailed message..." value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} className="h-9 text-xs" /></div>
            <DialogFooter className="pt-2"><Button type="button" variant="outline" onClick={() => setIsPostOpen(false)} className="text-xs">Cancel</Button><Button type="submit" className="bg-brand-gradient text-white text-xs font-semibold">Post Notice</Button></DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* ========================================================================== */
/* 9. SETTINGS VIEW                                                         */
/* ========================================================================== */
export function HostelSettingsView() {
  const [curfewTime, setCurfewTime] = useState("09:30 PM");

  const handleSave = () => {
    toast.success("Hostel curfew & operational settings saved!");
  };

  return (
    <div className="p-4 md:p-6 space-y-5 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
            <span>Dashboard</span><span>/</span><span>Hostel</span><span>/</span><span className="font-bold text-foreground">Settings</span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground mt-1">Hostel System Settings</h1>
          <p className="text-xs text-muted-foreground">Configure warden profiles, gate curfew rules, mess operational hours, and room policies.</p>
        </div>
        <Button onClick={handleSave} className="bg-brand-gradient text-white gap-2 text-xs font-semibold shadow-glow h-9">
          Save Settings
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-5 rounded-2xl border border-border/80 bg-card space-y-3 shadow-2xs">
          <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
            <Clock className="size-4 text-primary" /> Curfew & Gate Timings
          </h3>
          <div className="space-y-2 pt-1">
            <div className="space-y-1">
              <Label className="text-xs font-semibold">Weekday Night Curfew</Label>
              <Input value={curfewTime} onChange={e => setCurfewTime(e.target.value)} className="h-9 text-xs font-mono" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-semibold">Weekend Night Curfew</Label>
              <Input defaultValue="10:30 PM" className="h-9 text-xs font-mono" />
            </div>
          </div>
        </div>

        <div className="p-5 rounded-2xl border border-border/80 bg-card space-y-3 shadow-2xs">
          <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
            <Utensils className="size-4 text-emerald-600" /> Mess Timings Configuration
          </h3>
          <div className="space-y-2 pt-1 text-xs text-muted-foreground">
            <div className="flex justify-between py-1 border-b border-border/40"><span>Breakfast:</span><span className="font-mono font-bold text-foreground">07:30 AM - 09:00 AM</span></div>
            <div className="flex justify-between py-1 border-b border-border/40"><span>Lunch:</span><span className="font-mono font-bold text-foreground">12:30 PM - 02:00 PM</span></div>
            <div className="flex justify-between py-1 border-b border-border/40"><span>Evening Snacks:</span><span className="font-mono font-bold text-foreground">05:00 PM - 06:00 PM</span></div>
            <div className="flex justify-between py-1 border-b border-border/40"><span>Dinner:</span><span className="font-mono font-bold text-foreground">07:30 PM - 09:00 PM</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}

