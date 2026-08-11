import React, { useState, useMemo } from "react";
import { toast } from "sonner";
import {
  Building2,
  Cpu,
  Plus,
  Search,
  RefreshCw,
  Download,
  CalendarCheck,
  Clock,
  Wrench,
  CheckCircle2,
  AlertTriangle,
  Users,
  Eye,
  Edit,
  Trash2,
  Layers,
  ChevronRight,
  Filter,
  X,
  BarChart3,
  Sparkles,
  Printer,
  ShieldCheck,
  FileSpreadsheet,
  Zap,
  Bell,
  CheckCircle,
  AlertCircle,
  Grid,
  MapPin,
  SlidersHorizontal,
  HardDrive
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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

import { KpiCard } from "@/components/dashboard/kpi-card";
import { DonutChart, GroupedBarChart, ChartLegend } from "@/components/dashboard/charts";

import {
  MOCK_CLASSROOMS,
  MOCK_LABORATORIES,
  MOCK_EQUIPMENT,
  MOCK_MAINTENANCE_TICKETS,
  MOCK_RESOURCE_NOTIFICATIONS,
  ROOM_UTILIZATION_CHART,
  LAB_UTILIZATION_CHART,
  BUILDING_USAGE_CHART,
  type Classroom,
  type Laboratory,
  type Equipment,
  type MaintenanceTicket,
  type RoomType,
  type RoomStatus,
  type LabType,
} from "@/data/resource-management-mock";

const ROOM_TYPES_LIST: RoomType[] = [
  "Lecture Hall",
  "Smart Classroom",
  "Seminar Hall",
  "Conference Room",
  "Tutorial Room",
];

const LAB_TYPES_LIST: LabType[] = [
  "Computer Lab",
  "Electronics Lab",
  "Mechanical Lab",
  "Civil Lab",
  "Physics Lab",
  "Chemistry Lab",
  "AI & ML Lab",
  "IoT Lab",
  "Robotics Lab",
  "Research Lab",
];

function statusBadgeClass(status: RoomStatus) {
  switch (status) {
    case "Available":
      return "text-emerald-600 border-emerald-200 bg-emerald-50";
    case "Occupied":
      return "text-primary border-primary/20 bg-primary/5";
    case "Reserved":
      return "text-amber-500 border-amber-200 bg-amber-50";
    case "Maintenance":
      return "text-destructive border-destructive/20 bg-destructive/5";
    case "Inactive":
    default:
      return "text-muted-foreground border-border bg-muted/20";
  }
}

export function ResourceManagementModuleView() {
  // ── States ──────────────────────────────────────────────────
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [classrooms, setClassrooms] = useState<Classroom[]>(MOCK_CLASSROOMS);
  const [laboratories, setLaboratories] = useState<Laboratory[]>(MOCK_LABORATORIES);
  const [equipmentList] = useState<Equipment[]>(MOCK_EQUIPMENT);
  const [tickets, setTickets] = useState<MaintenanceTicket[]>(MOCK_MAINTENANCE_TICKETS);

  // Tab State
  const [activeTab, setActiveTab] = useState<
    "classrooms" | "laboratories" | "allocation" | "schedule" | "maintenance" | "equipment" | "analytics" | "reports"
  >("classrooms");

  // Selection & Details Modal State
  const [selectedRoom, setSelectedRoom] = useState<Classroom | Laboratory | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // Add Resource Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addResourceType, setAddResourceType] = useState<"classroom" | "laboratory">("classroom");
  const [newRoomForm, setNewRoomForm] = useState({
    nameOrNumber: "",
    building: "Academic Block A",
    floor: "1st Floor",
    capacity: 60,
    type: "Lecture Hall",
    department: "CSE",
  });

  // Allocation Form State
  const [allocForm, setAllocForm] = useState({
    academicYear: "2026-27",
    department: "CSE",
    program: "B.Tech",
    semester: "Semester VI",
    section: "CSE-A",
    faculty: "Dr. K. Sai Teja",
    subject: "CS501 - Computer Networks",
    date: "2026-08-10",
    timeSlot: "09:00 AM - 11:00 AM",
    resourceId: "CLR-101",
  });

  // Filters State
  const [searchQuery, setSearchQuery] = useState("");
  const [buildingFilter, setBuildingFilter] = useState("all");
  const [deptFilter, setDeptFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("capacity");

  const handleResetFilters = () => {
    setSearchQuery("");
    setBuildingFilter("all");
    setDeptFilter("all");
    setStatusFilter("all");
    setSortBy("capacity");
    toast.success("Filters reset successfully.");
  };

  const triggerReload = () => {
    setLoading(true);
    setError(null);
    setTimeout(() => setLoading(false), 600);
  };

  // ── Filter Computations ─────────────────────────────────────
  const filteredClassrooms = useMemo(() => {
    return classrooms
      .filter((c) => {
        const matchesSearch =
          c.roomNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.building.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesBuilding = buildingFilter === "all" || c.building.includes(buildingFilter);
        const matchesStatus = statusFilter === "all" || c.status === statusFilter;
        return matchesSearch && matchesBuilding && matchesStatus;
      })
      .sort((a, b) => {
        if (sortBy === "capacity") return b.capacity - a.capacity;
        if (sortBy === "roomNumber") return a.roomNumber.localeCompare(b.roomNumber);
        return 0;
      });
  }, [classrooms, searchQuery, buildingFilter, statusFilter, sortBy]);

  const filteredLabs = useMemo(() => {
    return laboratories
      .filter((l) => {
        const matchesSearch =
          l.labName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          l.building.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesDept = deptFilter === "all" || l.department === deptFilter;
        const matchesStatus = statusFilter === "all" || l.status === statusFilter;
        return matchesSearch && matchesDept && matchesStatus;
      })
      .sort((a, b) => (sortBy === "capacity" ? b.capacity - a.capacity : a.labName.localeCompare(b.labName)));
  }, [laboratories, searchQuery, deptFilter, statusFilter, sortBy]);

  // ── Metrics Computation ─────────────────────────────────────
  const metrics = useMemo(() => {
    const totalClassrooms = classrooms.length;
    const totalLabs = laboratories.length;
    const roomsAllocated = classrooms.filter((c) => c.status === "Occupied" || c.status === "Reserved").length;
    const labsAllocated = laboratories.filter((l) => l.status === "Occupied" || l.status === "Reserved").length;
    const availRooms = classrooms.filter((c) => c.status === "Available").length;
    const availLabs = laboratories.filter((l) => l.status === "Available").length;
    const maintenancePending = tickets.filter((t) => t.status !== "Completed").length;
    const avgUtilization = 84;

    return { totalClassrooms, totalLabs, roomsAllocated, labsAllocated, availRooms, availLabs, maintenancePending, avgUtilization };
  }, [classrooms, laboratories, tickets]);

  // ── Handlers ────────────────────────────────────────────────
  const handleAddResource = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoomForm.nameOrNumber.trim()) {
      toast.error("Please enter room number / lab name.");
      return;
    }

    if (addResourceType === "classroom") {
      const newClr: Classroom = {
        id: `CLR-${Date.now().toString().slice(-3)}`,
        roomNumber: newRoomForm.nameOrNumber,
        building: newRoomForm.building,
        floor: newRoomForm.floor,
        capacity: Number(newRoomForm.capacity),
        roomType: newRoomForm.type as RoomType,
        status: "Available",
        todaySchedule: [],
        maintenanceStatus: "Normal",
        facilities: ["Interactive Screen", "AC", "Wi-Fi"],
      };
      setClassrooms((prev) => [newClr, ...prev]);
      toast.success(`Added new classroom: ${newClr.roomNumber}`);
    } else {
      const newLab: Laboratory = {
        id: `LAB-${Date.now().toString().slice(-3)}`,
        labName: newRoomForm.nameOrNumber,
        department: newRoomForm.department,
        building: newRoomForm.building,
        floor: newRoomForm.floor,
        capacity: Number(newRoomForm.capacity),
        equipmentCount: 30,
        labType: "AI & ML Lab",
        status: "Available",
        todaySchedule: [],
        maintenanceStatus: "Normal",
        facilities: ["High-speed LAN", "Central UPS", "AC"],
      };
      setLaboratories((prev) => [newLab, ...prev]);
      toast.success(`Added new laboratory: ${newLab.labName}`);
    }
    setIsAddModalOpen(false);
  };

  const handleAllocateResource = (e: React.FormEvent) => {
    e.preventDefault();
    // Validation check: check if target room is occupied
    const targetRoom = classrooms.find((c) => c.id === allocForm.resourceId);
    if (targetRoom && targetRoom.status === "Occupied") {
      toast.error(`Allocation conflict! ${targetRoom.roomNumber} is already occupied during this time slot.`);
      return;
    }

    toast.success(`Successfully allocated ${allocForm.resourceId} to ${allocForm.subject} (${allocForm.timeSlot})!`);
  };

  if (loading) {
    return (
      <div className="space-y-6 max-w-7xl mx-auto p-4 md:p-6">
        <div className="h-16 w-1/3 bg-muted/40 animate-pulse rounded-md" />
        <div className="grid gap-4 grid-cols-2 md:grid-cols-4 lg:grid-cols-8">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-24 bg-muted/40 animate-pulse rounded-xl" />
          ))}
        </div>
        <div className="h-96 bg-muted/40 animate-pulse rounded-xl border border-border" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-xl mx-auto my-12 p-8 border rounded-2xl bg-card text-center space-y-4 shadow-sm">
        <AlertTriangle className="size-10 text-destructive mx-auto" />
        <h3 className="text-base font-bold text-foreground">Failed to load resource data</h3>
        <p className="text-xs text-muted-foreground">{error}</p>
        <Button onClick={triggerReload} className="bg-brand-gradient text-white font-semibold">
          <RefreshCw className="size-3.5 mr-1.5" /> Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 md:p-6 text-xs leading-normal">
      
      {/* ── 1. PAGE HEADER ─────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b pb-5 border-border">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-primary/10 text-primary border border-primary/20 shrink-0 mt-0.5">
            <Building2 className="size-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-bold font-display tracking-tight text-foreground">
                Classroom & Laboratory Resource Management
              </h1>
              <Badge variant="outline" className="font-mono text-xs text-primary border-primary/30">
                Academic Management Portal
              </Badge>
            </div>
            <nav className="flex items-center gap-1.5 text-[10px] text-muted-foreground mt-1">
              <span>Academic Management</span>
              <ChevronRight className="size-3" />
              <span className="text-foreground font-semibold">Resources & Allocation</span>
            </nav>
            <p className="text-xs md:text-sm text-muted-foreground mt-0.5">
              Manage classrooms, laboratories, resource allocation, utilization, maintenance, and availability across the institution.
            </p>
          </div>
        </div>

        {/* Header Action Controls */}
        <div className="flex items-center gap-2 flex-wrap shrink-0">
          <Button variant="outline" size="sm" onClick={triggerReload} className="h-9 gap-1.5 font-semibold text-xs">
            <RefreshCw className="size-3.5" /> Refresh
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => { setAddResourceType("classroom"); setIsAddModalOpen(true); }}
            className="h-9 gap-1.5 font-semibold text-xs border-border"
          >
            <Plus className="size-3.5" /> Add Classroom
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => { setAddResourceType("laboratory"); setIsAddModalOpen(true); }}
            className="h-9 gap-1.5 font-semibold text-xs border-primary/30 text-primary hover:bg-primary/5"
          >
            <Cpu className="size-3.5" /> Add Laboratory
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => toast.success("Resource utilization report generated in Excel format!")}
            className="h-9 gap-1.5 font-semibold text-xs border-emerald-300 text-emerald-600 hover:bg-emerald-50"
          >
            <FileSpreadsheet className="size-3.5" /> Export Report
          </Button>
          <Button
            onClick={() => setActiveTab("allocation")}
            className="h-9 bg-brand-gradient text-white gap-1.5 font-semibold text-xs shadow-glow hover:opacity-95 cursor-pointer"
          >
            <CalendarCheck className="size-3.5" /> Allocate Resources
          </Button>
        </div>
      </div>

      {/* ── 2. SUMMARY DASHBOARD KPI CARDS ─────────────────── */}
      <div className="grid gap-4 grid-cols-2 md:grid-cols-4 lg:grid-cols-8">
        <KpiCard label="Total Classrooms" value={String(metrics.totalClassrooms)} icon={Building2} tone="primary" />
        <KpiCard label="Total Laboratories" value={String(metrics.totalLabs)} icon={Cpu} tone="info" />
        <KpiCard label="Rooms Allocated Today" value={String(metrics.roomsAllocated)} icon={CalendarCheck} tone="primary" />
        <KpiCard label="Labs Allocated Today" value={String(metrics.labsAllocated)} icon={CheckCircle2} tone="info" />
        <KpiCard label="Available Rooms" value={String(metrics.availRooms)} icon={CheckCircle} tone="success" />
        <KpiCard label="Available Labs" value={String(metrics.availLabs)} icon={CheckCircle2} tone="success" />
        <KpiCard label="Pending Maintenance" value={String(metrics.maintenancePending)} icon={Wrench} tone="warning" />
        <KpiCard label="Avg Utilization %" value={`${metrics.avgUtilization}%`} icon={BarChart3} tone="success" delta="+4% peak" trend="up" />
      </div>

      {/* ── 3. MAIN TAB NAVIGATION ─────────────────────────── */}
      <div className="flex items-center justify-between border-b pb-1 flex-wrap gap-3">
        <div className="flex rounded-xl bg-muted/40 p-1 border font-semibold overflow-x-auto">
          {[
            { id: "classrooms", label: "Classroom Directory", icon: Building2 },
            { id: "laboratories", label: "Laboratories Directory", icon: Cpu },
            { id: "allocation", label: "Resource Allocation", icon: CalendarCheck },
            { id: "schedule", label: "Weekly Schedule", icon: Clock },
            { id: "maintenance", label: `Maintenance (${metrics.maintenancePending})`, icon: Wrench },
            { id: "equipment", label: "Lab Equipment", icon: HardDrive },
            { id: "analytics", label: "Analytics", icon: BarChart3 },
            { id: "reports", label: "Reports", icon: Printer },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <tab.icon className="size-3.5" />
              {tab.label}
            </button>
          ))}
        </div>

        <Button
          size="sm"
          onClick={() => { setAddResourceType("classroom"); setIsAddModalOpen(true); }}
          className="h-8 text-[11px] font-bold bg-brand-gradient text-white gap-1 shadow-sm"
        >
          <Plus className="size-3.5" /> Add Resource
        </Button>
      </div>

      {/* ── 4. SEARCH & FILTERS TOOLBAR ───────────────────── */}
      <div className="flex items-center justify-between border rounded-2xl bg-card p-3 shadow-sm flex-wrap gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
            <Input
              placeholder="Search room number, building..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 h-8 text-xs w-[180px]"
            />
          </div>

          <Select value={buildingFilter} onValueChange={setBuildingFilter}>
            <SelectTrigger className="h-8 text-xs w-[130px]">
              <SelectValue placeholder="Building" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Buildings</SelectItem>
              <SelectItem value="Block A">Block A</SelectItem>
              <SelectItem value="Block B">Block B</SelectItem>
              <SelectItem value="Tech Block C">Tech Block C</SelectItem>
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-8 text-xs w-[110px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="Available">Available</SelectItem>
              <SelectItem value="Occupied">Occupied</SelectItem>
              <SelectItem value="Reserved">Reserved</SelectItem>
              <SelectItem value="Maintenance">Maintenance</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="ghost" size="sm" onClick={handleResetFilters} className="h-8 px-2 font-semibold text-xs">
            <X className="size-3 mr-1" /> Reset
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className="font-mono text-[9px] text-primary border-primary/20">
            {activeTab === "laboratories" ? filteredLabs.length : filteredClassrooms.length} Listed
          </Badge>
        </div>
      </div>

      {/* ── 5. TAB PANELS ─────────────────────────────────── */}

      {/* TAB 1: Classrooms Table */}
      {activeTab === "classrooms" && (
        <div className="border rounded-2xl bg-card p-5 shadow-sm space-y-4">
          <h3 className="text-base font-bold font-display text-foreground border-b pb-2 flex items-center gap-2">
            <Building2 className="size-5 text-primary" /> Master Institutional Classrooms Directory
          </h3>

          <div className="overflow-x-auto border rounded-xl">
            <table className="w-full text-left text-[11px] font-medium text-foreground">
              <thead className="bg-muted/30">
                <tr className="text-muted-foreground font-semibold border-b">
                  <th className="py-2.5 px-3">Room Number</th>
                  <th className="py-2.5 px-3">Building & Floor</th>
                  <th className="py-2.5 px-3 text-center">Seating Capacity</th>
                  <th className="py-2.5 px-3">Room Type</th>
                  <th className="py-2.5 px-3">Current Status</th>
                  <th className="py-2.5 px-3">Today's Schedule</th>
                  <th className="py-2.5 px-3 text-center">Maintenance Status</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredClassrooms.map((c) => (
                  <tr key={c.id} className="border-b border-border/40 hover:bg-muted/5">
                    <td className="py-3 px-3 font-mono font-bold text-primary">{c.roomNumber}</td>
                    <td className="py-3 px-3">
                      <p className="font-bold text-foreground">{c.building}</p>
                      <span className="text-[9px] text-muted-foreground font-mono">{c.floor}</span>
                    </td>
                    <td className="py-3 px-3 text-center font-mono font-bold">{c.capacity} Seats</td>
                    <td className="py-3 px-3 font-semibold">{c.roomType}</td>
                    <td className="py-3 px-3">
                      <Badge variant="outline" className={`text-[9px] uppercase ${statusBadgeClass(c.status)}`}>
                        {c.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-3">
                      {c.todaySchedule.length ? (
                        <p className="text-[10px] font-mono text-muted-foreground">{c.todaySchedule[0]}</p>
                      ) : (
                        <span className="text-[10px] text-emerald-600 font-semibold">Free all day</span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <Badge variant="outline" className={`text-[8px] ${c.maintenanceStatus === "Normal" ? "text-emerald-600 border-emerald-200 bg-emerald-50" : "text-destructive border-destructive/20 bg-destructive/5"}`}>
                        {c.maintenanceStatus}
                      </Badge>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="sm" onClick={() => { setSelectedRoom(c); setIsDetailsOpen(true); }} className="h-7 text-primary hover:bg-primary/5 cursor-pointer font-semibold">
                          <Eye className="size-3.5 mr-1" /> View
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => setActiveTab("allocation")} className="h-7 text-emerald-600 hover:bg-emerald-50 cursor-pointer font-semibold">
                          Allocate
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: Laboratories Table */}
      {activeTab === "laboratories" && (
        <div className="border rounded-2xl bg-card p-5 shadow-sm space-y-4">
          <h3 className="text-base font-bold font-display text-foreground border-b pb-2 flex items-center gap-2">
            <Cpu className="size-5 text-primary" /> Master Institutional Laboratories Directory
          </h3>

          <div className="overflow-x-auto border rounded-xl">
            <table className="w-full text-left text-[11px] font-medium text-foreground">
              <thead className="bg-muted/30">
                <tr className="text-muted-foreground font-semibold border-b">
                  <th className="py-2.5 px-3">Lab Name</th>
                  <th className="py-2.5 px-3">Department</th>
                  <th className="py-2.5 px-3">Building & Floor</th>
                  <th className="py-2.5 px-3 text-center">Capacity</th>
                  <th className="py-2.5 px-3 text-center">Equipment Count</th>
                  <th className="py-2.5 px-3">Today's Schedule</th>
                  <th className="py-2.5 px-3">Availability</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredLabs.map((l) => (
                  <tr key={l.id} className="border-b border-border/40 hover:bg-muted/5">
                    <td className="py-3 px-3 font-bold text-foreground">{l.labName}</td>
                    <td className="py-3 px-3 font-semibold">{l.department}</td>
                    <td className="py-3 px-3">
                      <p className="font-bold">{l.building}</p>
                      <span className="text-[9px] text-muted-foreground font-mono">{l.floor}</span>
                    </td>
                    <td className="py-3 px-3 text-center font-mono font-bold">{l.capacity} Stations</td>
                    <td className="py-3 px-3 text-center font-mono font-bold text-primary">{l.equipmentCount} Units</td>
                    <td className="py-3 px-3">
                      {l.todaySchedule.length ? (
                        <p className="text-[10px] font-mono text-muted-foreground">{l.todaySchedule[0]}</p>
                      ) : (
                        <span className="text-[10px] text-emerald-600 font-semibold">Free all day</span>
                      )}
                    </td>
                    <td className="py-3 px-3">
                      <Badge variant="outline" className={`text-[9px] uppercase ${statusBadgeClass(l.status)}`}>
                        {l.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <Button variant="ghost" size="sm" onClick={() => { setSelectedRoom(l); setIsDetailsOpen(true); }} className="h-7 text-primary hover:bg-primary/5 cursor-pointer font-semibold">
                        <Eye className="size-3.5 mr-1" /> View Details
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: Resource Allocation Form Workspace */}
      {activeTab === "allocation" && (
        <div className="border rounded-2xl bg-card p-5 shadow-sm space-y-4">
          <h3 className="text-base font-bold font-display text-foreground border-b pb-2 flex items-center gap-2">
            <CalendarCheck className="size-5 text-primary" /> Dedicated Resource Allocation Workspace
          </h3>

          <form onSubmit={handleAllocateResource} className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="space-y-1">
              <Label htmlFor="al-dept">Department</Label>
              <Select value={allocForm.department} onValueChange={(v) => setAllocForm((p) => ({ ...p, department: v }))}>
                <SelectTrigger id="al-dept"><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="CSE">CSE</SelectItem>
                  <SelectItem value="ECE">ECE</SelectItem>
                  <SelectItem value="ME">ME</SelectItem>
                  <SelectItem value="AI&DS">AI&DS</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label htmlFor="al-sem">Semester & Section</Label>
              <Input id="al-sem" value={`${allocForm.semester} (${allocForm.section})`} onChange={(e) => setAllocForm((p) => ({ ...p, semester: e.target.value }))} />
            </div>

            <div className="space-y-1">
              <Label htmlFor="al-fac">Instructor / Faculty</Label>
              <Input id="al-fac" value={allocForm.faculty} onChange={(e) => setAllocForm((p) => ({ ...p, faculty: e.target.value }))} />
            </div>

            <div className="space-y-1">
              <Label htmlFor="al-sub">Subject Name</Label>
              <Input id="al-sub" value={allocForm.subject} onChange={(e) => setAllocForm((p) => ({ ...p, subject: e.target.value }))} />
            </div>

            <div className="space-y-1">
              <Label htmlFor="al-date">Allocation Date</Label>
              <Input id="al-date" type="date" value={allocForm.date} onChange={(e) => setAllocForm((p) => ({ ...p, date: e.target.value }))} />
            </div>

            <div className="space-y-1">
              <Label htmlFor="al-time">Time Slot</Label>
              <Input id="al-time" value={allocForm.timeSlot} onChange={(e) => setAllocForm((p) => ({ ...p, timeSlot: e.target.value }))} />
            </div>

            <div className="space-y-1 col-span-3">
              <Label htmlFor="al-res">Select Target Classroom / Laboratory</Label>
              <Select value={allocForm.resourceId} onValueChange={(v) => setAllocForm((p) => ({ ...p, resourceId: v }))}>
                <SelectTrigger id="al-res"><SelectValue placeholder="Select resource" /></SelectTrigger>
                <SelectContent>
                  {classrooms.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.roomNumber} ({c.roomType}) - Capacity: {c.capacity} Seats &middot; Status: {c.status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="col-span-3 pt-2 flex justify-end">
              <Button type="submit" className="bg-brand-gradient text-white font-semibold shadow-glow">
                Confirm Resource Allocation
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 4: Weekly Timetable Schedule */}
      {activeTab === "schedule" && (
        <div className="border rounded-2xl bg-card p-5 shadow-sm space-y-4">
          <h3 className="text-base font-bold font-display text-foreground border-b pb-2 flex items-center gap-2">
            <Clock className="size-5 text-primary" /> Weekly Resource Schedule & Slot Occupancy Grid
          </h3>

          <div className="grid grid-cols-6 gap-2 text-center text-[10px] font-bold">
            {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map((day) => (
              <div key={day} className="p-3 border rounded-xl bg-muted/10 space-y-2">
                <span className="font-mono text-primary uppercase">{day}</span>
                <div className="p-2 border rounded-lg bg-card text-left space-y-1 text-[9px]">
                  <span className="font-bold text-foreground block">LH-101 (CS501)</span>
                  <span className="text-muted-foreground block font-mono">09:00 - 11:00 AM</span>
                </div>
                <div className="p-2 border rounded-lg bg-card text-left space-y-1 text-[9px]">
                  <span className="font-bold text-foreground block">AI Lab (Tech Block C)</span>
                  <span className="text-muted-foreground block font-mono">02:00 - 05:00 PM</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: Maintenance Management */}
      {activeTab === "maintenance" && (
        <div className="border rounded-2xl bg-card p-5 shadow-sm space-y-4">
          <h3 className="text-base font-bold font-display text-foreground border-b pb-2 flex items-center gap-2">
            <Wrench className="size-5 text-warning" /> Resource Maintenance & Repair Requests Ticket Ledger
          </h3>

          <div className="overflow-x-auto border rounded-xl">
            <table className="w-full text-left text-[11px] font-medium text-foreground">
              <thead className="bg-muted/30">
                <tr className="text-muted-foreground font-semibold border-b">
                  <th className="py-2.5 px-3">Ticket ID</th>
                  <th className="py-2.5 px-3">Target Resource</th>
                  <th className="py-2.5 px-3">Reported Issue</th>
                  <th className="py-2.5 px-3">Reported By</th>
                  <th className="py-2.5 px-3">Priority</th>
                  <th className="py-2.5 px-3">Assigned Technician</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {tickets.map((t) => (
                  <tr key={t.id} className="border-b border-border/40 hover:bg-muted/5">
                    <td className="py-3 px-3 font-mono font-bold">{t.id}</td>
                    <td className="py-3 px-3 font-bold text-foreground">{t.resource}</td>
                    <td className="py-3 px-3 text-muted-foreground">{t.issue}</td>
                    <td className="py-3 px-3">{t.reportedBy}</td>
                    <td className="py-3 px-3">
                      <Badge variant="outline" className={`text-[9px] ${t.priority === "Critical" ? "text-destructive border-destructive/20 bg-destructive/5" : "text-amber-500 border-amber-200 bg-amber-50"}`}>
                        {t.priority}
                      </Badge>
                    </td>
                    <td className="py-3 px-3 font-mono">{t.assignedTechnician}</td>
                    <td className="py-3 px-3">
                      <Badge variant="outline" className={`text-[9px] uppercase ${t.status === "Completed" ? "text-emerald-600 border-emerald-200 bg-emerald-50" : "text-amber-500 border-amber-200 bg-amber-50"}`}>
                        {t.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-3 text-right">
                      {t.status !== "Completed" && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setTickets((prev) => prev.map((item) => (item.id === t.id ? ({ ...item, status: "Completed" as const } as MaintenanceTicket) : item)));
                            toast.success(`Marked ticket ${t.id} as completed!`);
                          }}
                          className="h-7 text-emerald-600 hover:bg-emerald-50 font-semibold"
                        >
                          Mark Done
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

      {/* TAB 6: Lab Equipment */}
      {activeTab === "equipment" && (
        <div className="border rounded-2xl bg-card p-5 shadow-sm space-y-4">
          <h3 className="text-base font-bold font-display text-foreground border-b pb-2 flex items-center gap-2">
            <HardDrive className="size-5 text-primary" /> Laboratory Equipment & Inspection Health Ledger
          </h3>

          <div className="overflow-x-auto border rounded-xl">
            <table className="w-full text-left text-[11px] font-medium text-foreground">
              <thead className="bg-muted/30">
                <tr className="text-muted-foreground font-semibold border-b">
                  <th className="py-2.5 px-3">Equipment ID</th>
                  <th className="py-2.5 px-3">Equipment Name</th>
                  <th className="py-2.5 px-3">Laboratory & Dept</th>
                  <th className="py-2.5 px-3 text-center">Total Quantity</th>
                  <th className="py-2.5 px-3 text-center">Working</th>
                  <th className="py-2.5 px-3 text-center">Under Repair</th>
                  <th className="py-2.5 px-3 font-mono">Next Inspection</th>
                </tr>
              </thead>
              <tbody>
                {equipmentList.map((eq) => (
                  <tr key={eq.id} className="border-b border-border/40 hover:bg-muted/5">
                    <td className="py-3 px-3 font-mono font-bold">{eq.id}</td>
                    <td className="py-3 px-3 font-bold text-foreground">{eq.equipmentName}</td>
                    <td className="py-3 px-3">{eq.laboratory} ({eq.department})</td>
                    <td className="py-3 px-3 text-center font-mono font-bold">{eq.quantity} Units</td>
                    <td className="py-3 px-3 text-center font-mono font-bold text-emerald-600">{eq.working}</td>
                    <td className="py-3 px-3 text-center font-mono font-bold text-destructive">{eq.repair}</td>
                    <td className="py-3 px-3 font-mono">{eq.nextInspection}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 7: Analytics */}
      {activeTab === "analytics" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="border rounded-2xl bg-card p-5 shadow-sm space-y-2 col-span-2">
            <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Classroom Utilization %</h4>
            <GroupedBarChart
              data={ROOM_UTILIZATION_CHART as any}
              xKey="name"
              series={[{ key: "Utilization", label: "Utilization %" }]}
              height={200}
            />
          </div>

          <div className="border rounded-2xl bg-card p-5 shadow-sm space-y-2 col-span-1">
            <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Building Occupancy Share</h4>
            <DonutChart data={BUILDING_USAGE_CHART} height={180} centerLabel="Buildings" />
            <ChartLegend items={BUILDING_USAGE_CHART} />
          </div>
        </div>
      )}

      {/* TAB 8: Reports */}
      {activeTab === "reports" && (
        <div className="border rounded-2xl bg-card p-5 shadow-sm space-y-4">
          <h3 className="text-base font-bold font-display text-foreground border-b pb-2 flex items-center gap-2">
            <Printer className="size-5 text-primary" /> Resource Utilization Reports
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[
              "Room Utilization Report",
              "Laboratory Utilization Report",
              "Maintenance Audit Report",
              "Equipment Health Report",
              "Department Resource Report",
              "Availability Ledger Report",
            ].map((rep) => (
              <div key={rep} className="p-3.5 border rounded-xl flex items-center justify-between bg-muted/10">
                <span className="font-semibold text-xs text-foreground">{rep}</span>
                <Button size="sm" variant="outline" onClick={() => toast.success(`Exporting ${rep}...`)} className="h-7 text-[10px]">
                  <Download className="size-3 mr-1" /> PDF
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── 6. ADD RESOURCE MODAL ─────────────────────────── */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="max-w-md text-xs leading-normal">
          <DialogHeader>
            <DialogTitle className="text-base font-bold font-display">
              Add New {addResourceType === "classroom" ? "Classroom" : "Laboratory"}
            </DialogTitle>
            <DialogDescription>Specify building location, capacity, and seating configurations.</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAddResource} className="space-y-3.5 pt-2">
            <div className="space-y-1">
              <Label htmlFor="res-name">{addResourceType === "classroom" ? "Room Number*" : "Lab Name*"}</Label>
              <Input id="res-name" value={newRoomForm.nameOrNumber} onChange={(e) => setNewRoomForm((p) => ({ ...p, nameOrNumber: e.target.value }))} required />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="res-bldg">Building</Label>
                <Input id="res-bldg" value={newRoomForm.building} onChange={(e) => setNewRoomForm((p) => ({ ...p, building: e.target.value }))} />
              </div>

              <div className="space-y-1">
                <Label htmlFor="res-cap">Capacity</Label>
                <Input id="res-cap" type="number" value={newRoomForm.capacity} onChange={(e) => setNewRoomForm((p) => ({ ...p, capacity: Number(e.target.value) }))} />
              </div>
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
              <Button type="submit" className="bg-brand-gradient text-white font-semibold">Save Resource</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ── 7. RESOURCE DETAILS DIALOG ────────────────────── */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-md text-xs leading-normal">
          {selectedRoom && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-2">
                  <Badge className="bg-primary/10 text-primary border-primary/25 font-mono">{selectedRoom.id}</Badge>
                  <Badge variant="outline" className={`text-[9px] uppercase ${statusBadgeClass(selectedRoom.status)}`}>
                    {selectedRoom.status}
                  </Badge>
                </div>
                <DialogTitle className="text-base font-bold font-display mt-1">
                  {"roomNumber" in selectedRoom ? selectedRoom.roomNumber : selectedRoom.labName}
                </DialogTitle>
                <DialogDescription>{selectedRoom.building} &middot; {selectedRoom.floor}</DialogDescription>
              </DialogHeader>

              <div className="space-y-3 pt-2">
                <div className="grid grid-cols-2 gap-3 border rounded-xl p-3 bg-muted/20">
                  <div>
                    <span className="text-[10px] text-muted-foreground">Seating Capacity</span>
                    <p className="font-bold font-mono text-foreground mt-0.5">{selectedRoom.capacity} Seats/Stations</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground">Maintenance</span>
                    <p className="font-bold text-emerald-600 font-mono mt-0.5">{selectedRoom.maintenanceStatus}</p>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] text-muted-foreground font-bold uppercase">Available Facilities</span>
                  <div className="flex flex-wrap gap-1 pt-0.5">
                    {selectedRoom.facilities.map((f) => (
                      <Badge key={f} variant="outline" className="text-[8px] font-mono">{f}</Badge>
                    ))}
                  </div>
                </div>
              </div>

              <DialogFooter className="pt-2">
                <Button variant="outline" onClick={() => setIsDetailsOpen(false)}>Close</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

    </div>
  );
}
