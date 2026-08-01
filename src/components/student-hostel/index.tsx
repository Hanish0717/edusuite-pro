import React, { useState, useMemo } from "react";
import {
  BedDouble,
  Building,
  Key,
  ShieldCheck,
  Utensils,
  CreditCard,
  QrCode,
  AlertTriangle,
  Wrench,
  Users,
  Bell,
  Download,
  Calendar,
  Clock,
  PhoneCall,
  Plus,
  Search,
  CheckCircle2,
  XCircle,
  Clock3,
  FileText,
  Wifi,
  Sparkles,
  Zap,
  Droplets,
  Shirt,
  HeartPulse,
  Send,
  Printer,
  ChevronRight,
  UserCheck,
  Star,
  MapPin,
  HelpCircle,
  ExternalLink,
  X,
  Share2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  mockRoomDetails,
  mockHostelInfo,
  mockWeeklyMessMenu,
  mockGatePasses,
  mockComplaints,
  mockMaintenanceRequests,
  mockFeeReceipts,
  mockVisitors,
  mockHostelNotices,
} from "./mock-data";
import {
  GatePassRecord,
  ComplaintRecord,
  MaintenanceRequest,
  FeeReceipt,
  VisitorRecord,
} from "./types";

export const StudentHostelModule: React.FC = () => {
  // Navigation / Filter state
  const [activeFilter, setActiveFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeMessTab, setActiveMessTab] = useState<"today" | "tomorrow" | "weekly" | "special">("today");
  const [activeGatePassTab, setActiveGatePassTab] = useState<"form" | "active" | "history">("active");
  const [selectedComplaintCategory, setSelectedComplaintCategory] = useState<string>("Electricity");

  // Local state arrays for user interactions
  const [gatePasses, setGatePasses] = useState<GatePassRecord[]>(mockGatePasses);
  const [complaints, setComplaints] = useState<ComplaintRecord[]>(mockComplaints);
  const [maintenanceReqs, setMaintenanceReqs] = useState<MaintenanceRequest[]>(mockMaintenanceRequests);
  const [visitors, setVisitors] = useState<VisitorRecord[]>(mockVisitors);

  // Modal states
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [isGatePassModalOpen, setIsGatePassModalOpen] = useState(false);
  const [isComplaintModalOpen, setIsComplaintModalOpen] = useState(false);
  const [isMessFeedbackModalOpen, setIsMessFeedbackModalOpen] = useState(false);
  const [isRoomDetailsModalOpen, setIsRoomDetailsModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isVisitorModalOpen, setIsVisitorModalOpen] = useState(false);
  const [isWardenContactModalOpen, setIsWardenContactModalOpen] = useState(false);
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);

  // Form states
  const [gatePassForm, setGatePassForm] = useState({
    purpose: "Weekend Home Visit",
    destination: "Home / Local",
    outDate: "2026-08-10",
    outTime: "05:00 PM",
    returnDate: "2026-08-12",
    returnTime: "08:00 PM",
    guardianContact: "+91 98490 12345",
  });

  const [complaintForm, setComplaintForm] = useState({
    category: "Electricity",
    priority: "Medium" as "Low" | "Medium" | "High" | "Urgent",
    description: "",
  });

  const [leaveForm, setLeaveForm] = useState({
    startDate: "2026-08-15",
    endDate: "2026-08-18",
    reason: "Family Function",
    destinationAddress: "12-4-56, MG Road, Vijayawada",
    parentPhone: "+91 98490 12345",
  });

  const [messFeedbackForm, setMessFeedbackForm] = useState({
    mealType: "Lunch",
    rating: 4,
    comments: "",
  });

  // Handlers
  const handleGenerateGatePass = (e: React.FormEvent) => {
    e.preventDefault();
    const newPass: GatePassRecord = {
      id: `gp-${Date.now()}`,
      refId: `GP-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      purpose: gatePassForm.purpose,
      destination: gatePassForm.destination,
      outDate: gatePassForm.outDate,
      outTime: gatePassForm.outTime,
      returnDate: gatePassForm.returnDate,
      returnTime: gatePassForm.returnTime,
      guardianApproval: `Verified via Parent SMS (${gatePassForm.guardianContact})`,
      status: "Approved",
      qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=GP-PASS-${Math.floor(1000 + Math.random() * 9000)}`,
    };
    setGatePasses([newPass, ...gatePasses]);
    setActiveGatePassTab("active");
    setIsGatePassModalOpen(false);
    alert("Gate Pass Request Submitted & Approved Successfully!");
  };

  const handleSubmitComplaint = (e: React.FormEvent) => {
    e.preventDefault();
    if (!complaintForm.description.trim()) {
      alert("Please provide a description of the complaint.");
      return;
    }
    const newCmp: ComplaintRecord = {
      id: `cmp-${Date.now()}`,
      ticketNo: `HST-CMP-${Math.floor(100 + Math.random() * 900)}`,
      category: complaintForm.category,
      priority: complaintForm.priority,
      description: complaintForm.description,
      status: "In Progress",
      assignedStaff: "Hostel Maintenance Supervisor",
      dateRaised: new Date().toISOString().split("T")[0],
    };
    setComplaints([newCmp, ...complaints]);
    setComplaintForm({ category: "Electricity", priority: "Medium", description: "" });
    setIsComplaintModalOpen(false);
    alert("Complaint lodged successfully! Ticket number generated.");
  };

  const handleApplyLeave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLeaveModalOpen(false);
    alert("Hostel Leave Application submitted to Warden Office for approval!");
  };

  const handleMessFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsMessFeedbackModalOpen(false);
    alert("Thank you! Your feedback has been submitted to the Mess Committee.");
  };

  const todayMenu = mockWeeklyMessMenu[0]; // Monday
  const tomorrowMenu = mockWeeklyMessMenu[1]; // Tuesday

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Breadcrumb Navigation */}
      <div className="text-xs text-muted-foreground flex items-center gap-1 font-medium">
        <span>Home</span>
        <span>&gt;</span>
        <span>Student</span>
        <span>&gt;</span>
        <span className="text-foreground font-semibold">Hostel Management</span>
      </div>

      {/* PAGE HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight flex items-center gap-2">
            <BedDouble className="h-7 w-7 text-primary" /> Hostel Management
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage hostel accommodation, room details, mess services, gate passes, complaints and hostel payments.
          </p>
        </div>

        {/* Header Right Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsLeaveModalOpen(true)}
            className="text-xs gap-1.5 border-border hover:border-primary"
          >
            <Calendar className="h-4 w-4 text-purple-600 dark:text-purple-400" /> Apply Hostel Leave
          </Button>

          <Button
            variant="default"
            size="sm"
            onClick={() => setIsGatePassModalOpen(true)}
            className="text-xs gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <QrCode className="h-4 w-4" /> Generate Gate Pass
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => alert("Downloading Official Hostel ID Card (PDF)...")}
            className="text-xs gap-1.5 border-border hover:border-primary"
          >
            <Download className="h-4 w-4 text-blue-600 dark:text-blue-400" /> Download Hostel ID
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsWardenContactModalOpen(true)}
            className="text-xs gap-1.5 border-border hover:border-primary"
          >
            <PhoneCall className="h-4 w-4 text-emerald-600 dark:text-emerald-400" /> Contact Warden
          </Button>
        </div>
      </div>

      {/* SEARCH & FILTERS BAR */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 rounded-xl border border-border bg-card shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search Hostel Services, Rooms, Complaints, Gate Passes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
          />
        </div>

        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
          {["ALL", "Room", "Status", "Complaints", "Gate Pass", "Payments"].map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                activeFilter === filter
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "bg-muted/40 text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* OVERVIEW DASHBOARD KPI CARDS (8 Cards) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        {/* KPI 1: Hostel Block */}
        <div className="p-3.5 rounded-xl border border-border bg-card shadow-xs hover:border-primary/40 transition-all space-y-1">
          <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
            Hostel Block
          </span>
          <p className="text-base font-bold text-foreground line-clamp-1">{mockRoomDetails.block.split(" - ")[1] || "Block A"}</p>
          <span className="text-[10px] text-muted-foreground block">Boys Hostel</span>
        </div>

        {/* KPI 2: Room Number */}
        <div className="p-3.5 rounded-xl border border-border bg-card shadow-xs hover:border-primary/40 transition-all space-y-1">
          <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
            Room Number
          </span>
          <p className="text-base font-bold text-primary">{mockRoomDetails.roomNumber}</p>
          <span className="text-[10px] text-muted-foreground block">3rd Floor</span>
        </div>

        {/* KPI 3: Bed Number */}
        <div className="p-3.5 rounded-xl border border-border bg-card shadow-xs hover:border-primary/40 transition-all space-y-1">
          <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
            Bed Number
          </span>
          <p className="text-base font-bold text-foreground">Bed-2</p>
          <span className="text-[10px] text-muted-foreground block">Window Side</span>
        </div>

        {/* KPI 4: Room Type */}
        <div className="p-3.5 rounded-xl border border-border bg-card shadow-xs hover:border-primary/40 transition-all space-y-1">
          <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
            Room Type
          </span>
          <p className="text-sm font-bold text-foreground line-clamp-1">Triple Sharing</p>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium block">AC Deluxe</span>
        </div>

        {/* KPI 5: Hostel Status */}
        <div className="p-3.5 rounded-xl border border-border bg-card shadow-xs hover:border-emerald-500/40 transition-all space-y-1">
          <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
            Hostel Status
          </span>
          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="h-3 w-3" /> Active
          </span>
          <span className="text-[10px] text-muted-foreground block">Verified Student</span>
        </div>

        {/* KPI 6: Mess Plan */}
        <div className="p-3.5 rounded-xl border border-border bg-card shadow-xs hover:border-primary/40 transition-all space-y-1">
          <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
            Mess Plan
          </span>
          <p className="text-base font-bold text-foreground">Veg</p>
          <span className="text-[10px] text-muted-foreground block">Standard Board</span>
        </div>

        {/* KPI 7: Pending Fee */}
        <div className="p-3.5 rounded-xl border border-border bg-card shadow-xs hover:border-emerald-500/40 transition-all space-y-1">
          <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
            Pending Fee
          </span>
          <p className="text-base font-bold text-emerald-600 dark:text-emerald-400">₹0</p>
          <span className="text-[10px] text-muted-foreground block">All Fees Cleared</span>
        </div>

        {/* KPI 8: Gate Passes */}
        <div className="p-3.5 rounded-xl border border-border bg-card shadow-xs hover:border-purple-500/40 transition-all space-y-1">
          <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
            Gate Passes
          </span>
          <p className="text-base font-bold text-purple-600 dark:text-purple-400">3</p>
          <span className="text-[10px] text-muted-foreground block">This Month</span>
        </div>
      </div>

      {/* ROOM DETAILS & ROOMMATES SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Room Profile Card */}
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <h3 className="text-base font-bold text-foreground flex items-center gap-2">
              <Key className="h-5 w-5 text-primary" /> Room Profile
            </h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsRoomDetailsModalOpen(true)}
              className="text-xs h-7 gap-1"
            >
              View Inventory <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between py-1 border-b border-border/50">
              <span className="text-muted-foreground">Room Number</span>
              <span className="font-bold text-foreground text-sm">{mockRoomDetails.roomNumber}</span>
            </div>

            <div className="flex items-center justify-between py-1 border-b border-border/50">
              <span className="text-muted-foreground">Hostel Block</span>
              <span className="font-semibold text-foreground">{mockRoomDetails.block}</span>
            </div>

            <div className="flex items-center justify-between py-1 border-b border-border/50">
              <span className="text-muted-foreground">Floor</span>
              <span className="font-semibold text-foreground">{mockRoomDetails.floor}</span>
            </div>

            <div className="flex items-center justify-between py-1 border-b border-border/50">
              <span className="text-muted-foreground">Room Type</span>
              <span className="font-semibold text-foreground">{mockRoomDetails.roomType}</span>
            </div>

            <div className="flex items-center justify-between py-1 border-b border-border/50">
              <span className="text-muted-foreground">Capacity & Occupancy</span>
              <span className="font-semibold text-foreground">
                {mockRoomDetails.capacity} Beds ({mockRoomDetails.occupancy} Occupied / 1 Vacant)
              </span>
            </div>

            <div className="flex items-center justify-between py-1 border-b border-border/50">
              <span className="text-muted-foreground">Hostel Resident Since</span>
              <span className="font-semibold text-foreground">{mockRoomDetails.hostelSince}</span>
            </div>

            <div className="flex items-center justify-between py-1">
              <span className="text-muted-foreground">Expected Checkout</span>
              <span className="font-semibold text-foreground">{mockRoomDetails.expectedCheckout}</span>
            </div>
          </div>
        </div>

        {/* Roommate Profile Cards */}
        <div className="lg:col-span-2 rounded-xl border border-border bg-card p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <h3 className="text-base font-bold text-foreground flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" /> Roommate Profiles ({mockRoomDetails.roommates.length})
            </h3>
            <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
              All Verified Inmates
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {mockRoomDetails.roommates.map((rm) => (
              <div
                key={rm.id}
                className="p-4 rounded-xl border border-border/80 bg-muted/20 hover:bg-muted/40 transition-all flex items-start gap-3"
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-sm shrink-0 border border-primary/20">
                  {rm.avatar}
                </div>
                <div className="space-y-1 flex-1 text-xs">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-foreground text-sm">{rm.name}</h4>
                    <span className="text-[10px] font-semibold text-muted-foreground px-1.5 py-0.5 rounded bg-muted">
                      {rm.rollNo}
                    </span>
                  </div>
                  <p className="text-muted-foreground font-medium">{rm.department}</p>
                  <p className="text-muted-foreground">{rm.semester}</p>
                  <p className="text-primary font-semibold pt-1 flex items-center gap-1">
                    <PhoneCall className="h-3 w-3" /> {rm.contact}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* HOSTEL INFORMATION & AMENITIES */}
      <div className="rounded-xl border border-border bg-card p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div>
            <h3 className="text-base font-bold text-foreground flex items-center gap-2">
              <Building className="h-5 w-5 text-primary" /> Hostel Information & Amenities
            </h3>
            <p className="text-xs text-muted-foreground">{mockHostelInfo.name} — Contact details and facilities</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => alert("Opening Official Hostel Rules & Code of Conduct Handbook PDF...")}
            className="text-xs gap-1"
          >
            <FileText className="h-3.5 w-3.5" /> Hostel Rules
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="space-y-2 p-3 rounded-lg bg-muted/30 border border-border/60">
            <p className="font-bold text-foreground flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-primary" /> Address & Location
            </p>
            <p className="text-muted-foreground leading-relaxed">{mockHostelInfo.address}</p>
          </div>

          <div className="space-y-2 p-3 rounded-lg bg-muted/30 border border-border/60">
            <p className="font-bold text-foreground flex items-center gap-1.5">
              <UserCheck className="h-4 w-4 text-primary" /> Warden Desk
            </p>
            <p className="text-muted-foreground">Chief Warden: <span className="font-semibold text-foreground">{mockHostelInfo.wardenName}</span></p>
            <p className="text-muted-foreground">Assistant: <span className="font-semibold text-foreground">{mockHostelInfo.assistantWarden}</span></p>
            <p className="text-muted-foreground">Office Timing: {mockHostelInfo.officeTiming}</p>
          </div>

          <div className="space-y-2 p-3 rounded-lg bg-muted/30 border border-border/60">
            <p className="font-bold text-foreground flex items-center gap-1.5 text-red-600 dark:text-red-400">
              <PhoneCall className="h-4 w-4" /> Emergency Contact
            </p>
            <p className="text-foreground font-bold">{mockHostelInfo.emergencyContact}</p>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setIsEmergencyModalOpen(true)}
              className="w-full text-xs h-7 mt-1 gap-1"
            >
              <AlertTriangle className="h-3.5 w-3.5" /> Trigger Emergency Help
            </Button>
          </div>
        </div>

        {/* Key Amenities */}
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-2">
          <div className="p-3 rounded-lg border border-border bg-card flex items-center gap-2.5">
            <div className="p-2 rounded-md bg-blue-500/10 text-blue-600">
              <Wifi className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-foreground">Wi-Fi Internet</p>
              <p className="text-[10px] text-muted-foreground line-clamp-1">{mockHostelInfo.amenities.wifi}</p>
            </div>
          </div>

          <div className="p-3 rounded-lg border border-border bg-card flex items-center gap-2.5">
            <div className="p-2 rounded-md bg-purple-500/10 text-purple-600">
              <Shirt className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-foreground">Laundry Service</p>
              <p className="text-[10px] text-muted-foreground line-clamp-1">{mockHostelInfo.amenities.laundry}</p>
            </div>
          </div>

          <div className="p-3 rounded-lg border border-border bg-card flex items-center gap-2.5">
            <div className="p-2 rounded-md bg-cyan-500/10 text-cyan-600">
              <Droplets className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-foreground">Water Supply</p>
              <p className="text-[10px] text-muted-foreground line-clamp-1">{mockHostelInfo.amenities.water}</p>
            </div>
          </div>

          <div className="p-3 rounded-lg border border-border bg-card flex items-center gap-2.5">
            <div className="p-2 rounded-md bg-amber-500/10 text-amber-600">
              <Zap className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-foreground">Power Backup</p>
              <p className="text-[10px] text-muted-foreground line-clamp-1">{mockHostelInfo.amenities.powerBackup}</p>
            </div>
          </div>

          <div className="p-3 rounded-lg border border-border bg-card flex items-center gap-2.5">
            <div className="p-2 rounded-md bg-emerald-500/10 text-emerald-600">
              <HeartPulse className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-foreground">Medical Room</p>
              <p className="text-[10px] text-muted-foreground line-clamp-1">{mockHostelInfo.amenities.medicalRoom}</p>
            </div>
          </div>
        </div>
      </div>

      {/* MESS DETAILS SECTION */}
      <div className="rounded-xl border border-border bg-card p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-3">
          <div>
            <h3 className="text-base font-bold text-foreground flex items-center gap-2">
              <Utensils className="h-5 w-5 text-primary" /> Central Mess Services & Timings
            </h3>
            <p className="text-xs text-muted-foreground">Current Plan: <span className="font-semibold text-foreground">Vegetarian Standard (Full Board)</span></p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsMessFeedbackModalOpen(true)}
              className="text-xs gap-1"
            >
              <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" /> Meal Feedback
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => alert("Mess plan change window opens every semester start. Contact Warden desk.")}
              className="text-xs gap-1"
            >
              Change Mess Plan
            </Button>
          </div>
        </div>

        {/* Timings Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-lg bg-muted/20 border border-border/60">
            <span className="text-muted-foreground text-[11px] block">Breakfast</span>
            <p className="font-bold text-foreground mt-0.5">07:30 AM - 09:15 AM</p>
          </div>
          <div className="p-3 rounded-lg bg-muted/20 border border-border/60">
            <span className="text-muted-foreground text-[11px] block">Lunch</span>
            <p className="font-bold text-foreground mt-0.5">12:30 PM - 02:15 PM</p>
          </div>
          <div className="p-3 rounded-lg bg-muted/20 border border-border/60">
            <span className="text-muted-foreground text-[11px] block">Evening Snacks</span>
            <p className="font-bold text-foreground mt-0.5">05:00 PM - 06:15 PM</p>
          </div>
          <div className="p-3 rounded-lg bg-muted/20 border border-border/60">
            <span className="text-muted-foreground text-[11px] block">Dinner</span>
            <p className="font-bold text-foreground mt-0.5">07:45 PM - 09:30 PM</p>
          </div>
        </div>

        {/* Mess Menu Tabs */}
        <div className="flex items-center gap-2 border-b border-border pb-2">
          {[
            { id: "today", label: "Today's Menu (Mon)" },
            { id: "tomorrow", label: "Tomorrow's Menu (Tue)" },
            { id: "weekly", label: "Weekly Schedule" },
            { id: "special", label: "Special Feast" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveMessTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeMessTab === tab.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted/40 text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Menu Tab Content */}
        {activeMessTab === "today" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div className="p-4 rounded-xl border border-border bg-card space-y-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">Breakfast</span>
              <p className="text-sm font-semibold text-foreground leading-relaxed">{todayMenu.breakfast}</p>
            </div>
            <div className="p-4 rounded-xl border border-border bg-card space-y-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Lunch</span>
              <p className="text-sm font-semibold text-foreground leading-relaxed">{todayMenu.lunch}</p>
            </div>
            <div className="p-4 rounded-xl border border-border bg-card space-y-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">Snacks</span>
              <p className="text-sm font-semibold text-foreground leading-relaxed">{todayMenu.snacks}</p>
            </div>
            <div className="p-4 rounded-xl border border-border bg-card space-y-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">Dinner</span>
              <p className="text-sm font-semibold text-foreground leading-relaxed">{todayMenu.dinner}</p>
            </div>
          </div>
        )}

        {activeMessTab === "tomorrow" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div className="p-4 rounded-xl border border-border bg-card space-y-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">Breakfast</span>
              <p className="text-sm font-semibold text-foreground leading-relaxed">{tomorrowMenu.breakfast}</p>
            </div>
            <div className="p-4 rounded-xl border border-border bg-card space-y-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Lunch</span>
              <p className="text-sm font-semibold text-foreground leading-relaxed">{tomorrowMenu.lunch}</p>
            </div>
            <div className="p-4 rounded-xl border border-border bg-card space-y-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">Snacks</span>
              <p className="text-sm font-semibold text-foreground leading-relaxed">{tomorrowMenu.snacks}</p>
            </div>
            <div className="p-4 rounded-xl border border-border bg-card space-y-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">Dinner</span>
              <p className="text-sm font-semibold text-foreground leading-relaxed">{tomorrowMenu.dinner}</p>
            </div>
          </div>
        )}

        {activeMessTab === "weekly" && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-border bg-muted/40 text-muted-foreground font-semibold">
                  <th className="p-3">Day</th>
                  <th className="p-3">Breakfast</th>
                  <th className="p-3">Lunch</th>
                  <th className="p-3">Snacks</th>
                  <th className="p-3">Dinner</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {mockWeeklyMessMenu.map((m) => (
                  <tr key={m.day} className="hover:bg-muted/20">
                    <td className="p-3 font-bold text-foreground">{m.day}</td>
                    <td className="p-3 text-muted-foreground">{m.breakfast}</td>
                    <td className="p-3 text-muted-foreground">{m.lunch}</td>
                    <td className="p-3 text-muted-foreground">{m.snacks}</td>
                    <td className="p-3 text-muted-foreground">{m.dinner}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeMessTab === "special" && (
          <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/[0.04] text-xs space-y-2">
            <h4 className="font-bold text-amber-600 dark:text-amber-400 text-sm flex items-center gap-1.5">
              <Sparkles className="h-4 w-4" /> Upcoming Sunday Feast Special
            </h4>
            <p className="text-foreground leading-relaxed">
              Special Feast Day: Hyderabadi Veg Biryani, Mirchi Ka Salan, Paneer Butter Masala, Butter Naan, and Chocolate Ice Cream Sundae served for all hostel residents during Sunday Lunch & Dinner!
            </p>
          </div>
        )}
      </div>

      {/* HOSTEL FEES & PAYMENT HISTORY */}
      <div className="rounded-xl border border-border bg-card p-5 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-3">
          <div>
            <h3 className="text-base font-bold text-foreground flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-primary" /> Hostel Fee Management & Payment History
            </h3>
            <p className="text-xs text-muted-foreground">Track annual hostel fees, installments, and receipts</p>
          </div>
          <Button
            variant="default"
            size="sm"
            onClick={() => setIsPaymentModalOpen(true)}
            className="text-xs gap-1.5"
          >
            <CreditCard className="h-3.5 w-3.5" /> Pay Hostel Fee
          </Button>
        </div>

        {/* Fee Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
          <div className="p-4 rounded-xl border border-border bg-card space-y-1">
            <span className="text-muted-foreground text-[11px] block">Total Hostel Fee (Annual)</span>
            <p className="text-xl font-bold text-foreground">₹45,000</p>
            <span className="text-[10px] text-muted-foreground block">Room & Mess Combined</span>
          </div>

          <div className="p-4 rounded-xl border border-border bg-card space-y-1">
            <span className="text-muted-foreground text-[11px] block">Paid Amount</span>
            <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">₹45,000</p>
            <span className="text-[10px] text-emerald-600 block font-medium">100% Cleared</span>
          </div>

          <div className="p-4 rounded-xl border border-border bg-card space-y-1">
            <span className="text-muted-foreground text-[11px] block">Pending Amount</span>
            <p className="text-xl font-bold text-foreground">₹0</p>
            <span className="text-[10px] text-muted-foreground block">No Dues Outstanding</span>
          </div>

          <div className="p-4 rounded-xl border border-border bg-card space-y-1">
            <span className="text-muted-foreground text-[11px] block">Next Due Date</span>
            <p className="text-base font-bold text-primary">Cleared</p>
            <span className="text-[10px] text-muted-foreground block">Next term: 15 Jan 2027</span>
          </div>
        </div>

        {/* Payment History Table */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Payment History</h4>
          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-border bg-muted/40 text-muted-foreground font-semibold">
                  <th className="p-3">Receipt Number</th>
                  <th className="p-3">Payment Date</th>
                  <th className="p-3">Term / Description</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {mockFeeReceipts.map((rcp) => (
                  <tr key={rcp.receiptNo} className="hover:bg-muted/20">
                    <td className="p-3 font-mono font-bold text-foreground">{rcp.receiptNo}</td>
                    <td className="p-3 text-muted-foreground">{rcp.date}</td>
                    <td className="p-3 text-foreground font-medium">{rcp.term}</td>
                    <td className="p-3 font-bold text-foreground">{rcp.amount}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                        {rcp.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => alert(`Downloading Fee Receipt ${rcp.receiptNo}...`)}
                        className="text-xs h-7 gap-1"
                      >
                        <Download className="h-3 w-3" /> Download Receipt
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* GATE PASS MANAGEMENT SECTION */}
      <div className="rounded-xl border border-border bg-card p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-3">
          <div>
            <h3 className="text-base font-bold text-foreground flex items-center gap-2">
              <QrCode className="h-5 w-5 text-primary" /> Gate Pass Management
            </h3>
            <p className="text-xs text-muted-foreground">Request, view and present digital QR gate passes for campus entry & exit</p>
          </div>

          <div className="flex items-center gap-2">
            {[
              { id: "active", label: "Active Pass (QR Code)" },
              { id: "form", label: "Generate Gate Pass" },
              { id: "history", label: "Previous Gate Passes" },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveGatePassTab(t.id as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeGatePassTab === t.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted/40 text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab 1: Active Gate Pass with QR Code */}
        {activeGatePassTab === "active" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            {/* Pass QR Badge Card */}
            <div className="p-5 rounded-xl border border-primary/30 bg-primary/[0.02] flex flex-col items-center justify-center text-center space-y-3 shadow-sm">
              <div className="p-3 bg-white rounded-xl shadow-xs border border-border">
                <img
                  src={gatePasses[0]?.qrCodeUrl || "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=GP-PASS-ACTIVE"}
                  alt="Gate Pass QR"
                  className="w-36 h-36 object-contain"
                />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-primary">Pass Reference</span>
                <p className="text-base font-mono font-bold text-foreground">{gatePasses[0]?.refId}</p>
                <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                  Approved & Verified
                </span>
              </div>
            </div>

            {/* Pass Details */}
            <div className="md:col-span-2 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3 p-4 rounded-xl bg-muted/20 border border-border">
                <div>
                  <span className="text-muted-foreground block">Purpose</span>
                  <p className="font-bold text-foreground">{gatePasses[0]?.purpose}</p>
                </div>
                <div>
                  <span className="text-muted-foreground block">Destination</span>
                  <p className="font-bold text-foreground">{gatePasses[0]?.destination}</p>
                </div>
                <div>
                  <span className="text-muted-foreground block">Out Date & Time</span>
                  <p className="font-semibold text-foreground">{gatePasses[0]?.outDate} @ {gatePasses[0]?.outTime}</p>
                </div>
                <div>
                  <span className="text-muted-foreground block">Return Date & Time</span>
                  <p className="font-semibold text-foreground">{gatePasses[0]?.returnDate} @ {gatePasses[0]?.returnTime}</p>
                </div>
                <div className="col-span-2 border-t border-border/60 pt-2">
                  <span className="text-muted-foreground block">Guardian Approval</span>
                  <p className="font-semibold text-emerald-600 dark:text-emerald-400">{gatePasses[0]?.guardianApproval}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => alert(`Printing Gate Pass ${gatePasses[0]?.refId}...`)}
                  className="text-xs gap-1"
                >
                  <Printer className="h-3.5 w-3.5" /> Print Gate Pass
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => alert("Sharing QR Code link to registered phone number...")}
                  className="text-xs gap-1"
                >
                  <Share2 className="h-3.5 w-3.5" /> Send Pass to Phone
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Gate Pass Form */}
        {activeGatePassTab === "form" && (
          <form onSubmit={handleGenerateGatePass} className="space-y-4 text-xs max-w-2xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-semibold text-foreground">Outing Purpose</label>
                <select
                  value={gatePassForm.purpose}
                  onChange={(e) => setGatePassForm({ ...gatePassForm, purpose: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                >
                  <option value="Local Outing">Local Outing (City)</option>
                  <option value="Weekend Home Visit">Weekend Home Visit</option>
                  <option value="Medical Consultation">Medical Consultation</option>
                  <option value="Official Academic Work">Official Academic Work</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-foreground">Destination</label>
                <input
                  type="text"
                  value={gatePassForm.destination}
                  onChange={(e) => setGatePassForm({ ...gatePassForm, destination: e.target.value })}
                  placeholder="e.g. City Mall / Home Town"
                  className="w-full p-2.5 rounded-lg border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-foreground">Out Date</label>
                <input
                  type="date"
                  value={gatePassForm.outDate}
                  onChange={(e) => setGatePassForm({ ...gatePassForm, outDate: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-foreground">Out Time</label>
                <input
                  type="text"
                  value={gatePassForm.outTime}
                  onChange={(e) => setGatePassForm({ ...gatePassForm, outTime: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-foreground">Expected Return Date</label>
                <input
                  type="date"
                  value={gatePassForm.returnDate}
                  onChange={(e) => setGatePassForm({ ...gatePassForm, returnDate: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-foreground">Expected Return Time</label>
                <input
                  type="text"
                  value={gatePassForm.returnTime}
                  onChange={(e) => setGatePassForm({ ...gatePassForm, returnTime: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                  required
                />
              </div>

              <div className="sm:col-span-2 space-y-1">
                <label className="font-semibold text-foreground">Guardian Approval Mobile Number</label>
                <input
                  type="tel"
                  value={gatePassForm.guardianContact}
                  onChange={(e) => setGatePassForm({ ...gatePassForm, guardianContact: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                  required
                />
                <p className="text-[11px] text-muted-foreground">Automated SMS verification code will be sent to guardian mobile number.</p>
              </div>
            </div>

            <Button type="submit" className="text-xs gap-1.5">
              <Send className="h-3.5 w-3.5" /> Submit Gate Pass Request
            </Button>
          </form>
        )}

        {/* Tab 3: Previous Passes */}
        {activeGatePassTab === "history" && (
          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-border bg-muted/40 text-muted-foreground font-semibold">
                  <th className="p-3">Reference ID</th>
                  <th className="p-3">Purpose</th>
                  <th className="p-3">Destination</th>
                  <th className="p-3">Out Schedule</th>
                  <th className="p-3">Return Schedule</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {gatePasses.map((gp) => (
                  <tr key={gp.id} className="hover:bg-muted/20">
                    <td className="p-3 font-mono font-bold text-foreground">{gp.refId}</td>
                    <td className="p-3 font-medium text-foreground">{gp.purpose}</td>
                    <td className="p-3 text-muted-foreground">{gp.destination}</td>
                    <td className="p-3 text-muted-foreground">{gp.outDate} @ {gp.outTime}</td>
                    <td className="p-3 text-muted-foreground">{gp.returnDate} @ {gp.returnTime}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                        {gp.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* HOSTEL COMPLAINTS & ISSUE REDRESSAL */}
      <div className="rounded-xl border border-border bg-card p-5 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-3">
          <div>
            <h3 className="text-base font-bold text-foreground flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-primary" /> Hostel Complaints & Support Desk
            </h3>
            <p className="text-xs text-muted-foreground">Lodge electrical, plumbing, internet or room maintenance issues</p>
          </div>
          <Button
            variant="default"
            size="sm"
            onClick={() => setIsComplaintModalOpen(true)}
            className="text-xs gap-1.5"
          >
            <Plus className="h-3.5 w-3.5" /> Submit Complaint
          </Button>
        </div>

        {/* 8 Category Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {[
            { id: "Electricity", label: "Electricity", icon: Zap, color: "text-amber-500 bg-amber-500/10" },
            { id: "Water", label: "Water", icon: Droplets, color: "text-blue-500 bg-blue-500/10" },
            { id: "Cleaning", label: "Cleaning", icon: Sparkles, color: "text-emerald-500 bg-emerald-500/10" },
            { id: "Furniture", label: "Furniture", icon: BedDouble, color: "text-purple-500 bg-purple-500/10" },
            { id: "Internet", label: "Internet", icon: Wifi, color: "text-cyan-500 bg-cyan-500/10" },
            { id: "Mess", label: "Mess", icon: Utensils, color: "text-orange-500 bg-orange-500/10" },
            { id: "Security", label: "Security", icon: ShieldCheck, color: "text-indigo-500 bg-indigo-500/10" },
            { id: "Other", label: "Other", icon: HelpCircle, color: "text-slate-500 bg-slate-500/10" },
          ].map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedComplaintCategory === cat.id;
            return (
              <div
                key={cat.id}
                onClick={() => {
                  setSelectedComplaintCategory(cat.id);
                  setComplaintForm((prev) => ({ ...prev, category: cat.id }));
                }}
                className={`p-3 rounded-xl border transition-all cursor-pointer flex flex-col items-center justify-center text-center space-y-1.5 ${
                  isSelected
                    ? "border-primary bg-primary/10 shadow-xs"
                    : "border-border bg-card hover:border-primary/40"
                }`}
              >
                <div className={`p-2 rounded-lg ${cat.color}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <span className="text-xs font-semibold text-foreground line-clamp-1">{cat.label}</span>
              </div>
            );
          })}
        </div>

        {/* Complaint History Table */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Complaint & Ticket History</h4>
          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-border bg-muted/40 text-muted-foreground font-semibold">
                  <th className="p-3">Ticket ID</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Priority</th>
                  <th className="p-3">Description</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Assigned Staff</th>
                  <th className="p-3">Date Raised</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {complaints.map((c) => (
                  <tr key={c.id} className="hover:bg-muted/20">
                    <td className="p-3 font-mono font-bold text-foreground">{c.ticketNo}</td>
                    <td className="p-3 font-semibold text-foreground">{c.category}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded font-semibold text-[10px] ${
                        c.priority === "High" ? "bg-red-500/10 text-red-600" : "bg-amber-500/10 text-amber-600"
                      }`}>
                        {c.priority}
                      </span>
                    </td>
                    <td className="p-3 text-muted-foreground max-w-xs line-clamp-1">{c.description}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        c.status === "Resolved"
                          ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                          : "bg-blue-500/10 text-blue-600 border border-blue-500/20"
                      }`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="p-3 text-muted-foreground">{c.assignedStaff}</td>
                    <td className="p-3 text-muted-foreground">{c.dateRaised}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ROOM MAINTENANCE & VISITOR MANAGEMENT (2-Column Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Maintenance Requests */}
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <h3 className="text-base font-bold text-foreground flex items-center gap-2">
              <Wrench className="h-5 w-5 text-primary" /> Room Maintenance
            </h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsComplaintModalOpen(true)}
              className="text-xs gap-1 h-7"
            >
              Raise Request
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="p-2.5 rounded-lg border border-border bg-muted/20 text-center">
              <span className="text-muted-foreground text-[10px] block">Pending</span>
              <span className="font-bold text-foreground text-base">0</span>
            </div>
            <div className="p-2.5 rounded-lg border border-amber-500/30 bg-amber-500/10 text-center">
              <span className="text-amber-600 dark:text-amber-400 text-[10px] font-semibold block">In Progress</span>
              <span className="font-bold text-amber-600 dark:text-amber-400 text-base">1</span>
            </div>
            <div className="p-2.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-center">
              <span className="text-emerald-600 dark:text-emerald-400 text-[10px] font-semibold block">Completed</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400 text-base">4</span>
            </div>
          </div>

          <div className="space-y-2 text-xs">
            {maintenanceReqs.map((mr) => (
              <div key={mr.id} className="p-3 rounded-lg border border-border bg-muted/20 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-foreground">{mr.item}</p>
                  <span className="text-[11px] text-muted-foreground">{mr.reqNo} • {mr.assignedStaff}</span>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                  mr.status === "Completed" ? "bg-emerald-500/10 text-emerald-600" : "bg-amber-500/10 text-amber-600"
                }`}>
                  {mr.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Visitor Management */}
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <h3 className="text-base font-bold text-foreground flex items-center gap-2">
              <UserCheck className="h-5 w-5 text-primary" /> Visitor Management
            </h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsVisitorModalOpen(true)}
              className="text-xs gap-1 h-7"
            >
              Add Visitor
            </Button>
          </div>

          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-border bg-muted/40 text-muted-foreground font-semibold">
                  <th className="p-2.5">Visitor</th>
                  <th className="p-2.5">Relation</th>
                  <th className="p-2.5">Date</th>
                  <th className="p-2.5">In - Out</th>
                  <th className="p-2.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {visitors.map((v) => (
                  <tr key={v.id} className="hover:bg-muted/20">
                    <td className="p-2.5 font-semibold text-foreground">{v.visitorName}</td>
                    <td className="p-2.5 text-muted-foreground">{v.relationship}</td>
                    <td className="p-2.5 text-muted-foreground">{v.date}</td>
                    <td className="p-2.5 text-muted-foreground">{v.inTime} - {v.outTime}</td>
                    <td className="p-2.5">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                        {v.verificationStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* HOSTEL NOTICES & ANNOUNCEMENTS */}
      <div className="rounded-xl border border-border bg-card p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <h3 className="text-base font-bold text-foreground flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" /> Latest Hostel Notices & Circulars
          </h3>
          <Button
            variant="outline"
            size="sm"
            onClick={() => alert("Navigating to all Hostel Notices stream...")}
            className="text-xs gap-1"
          >
            View All Circulars
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {mockHostelNotices.map((hn) => (
            <div key={hn.id} className="p-3.5 rounded-xl border border-border/80 bg-muted/20 space-y-1.5">
              <div className="flex items-center justify-between gap-2">
                <span className="font-semibold px-2 py-0.5 rounded bg-primary/10 text-primary text-[11px]">
                  {hn.category}
                </span>
                <span className="text-muted-foreground text-[11px]">{hn.date}</span>
              </div>
              <h4 className="font-bold text-foreground text-sm">{hn.title}</h4>
              <p className="text-muted-foreground leading-relaxed line-clamp-2">{hn.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* QUICK ACTIONS BOTTOM BAR */}
      <div className="p-4 rounded-xl border border-border bg-card shadow-sm space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Quick Action Shortcuts</h3>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="default"
            size="sm"
            onClick={() => setIsGatePassModalOpen(true)}
            className="text-xs gap-1.5"
          >
            <QrCode className="h-3.5 w-3.5" /> Generate Gate Pass
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsMessFeedbackModalOpen(true)}
            className="text-xs gap-1.5"
          >
            <Utensils className="h-3.5 w-3.5 text-amber-500" /> Mess Feedback
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsComplaintModalOpen(true)}
            className="text-xs gap-1.5"
          >
            <AlertTriangle className="h-3.5 w-3.5 text-red-500" /> Raise Complaint
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsPaymentModalOpen(true)}
            className="text-xs gap-1.5"
          >
            <CreditCard className="h-3.5 w-3.5 text-emerald-500" /> Pay Hostel Fee
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => alert("Downloading latest paid receipt RCP-HST-2026-001...")}
            className="text-xs gap-1.5"
          >
            <Download className="h-3.5 w-3.5 text-blue-500" /> Download Receipt
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsWardenContactModalOpen(true)}
            className="text-xs gap-1.5"
          >
            <PhoneCall className="h-3.5 w-3.5 text-purple-500" /> Contact Warden
          </Button>

          <Button
            variant="destructive"
            size="sm"
            onClick={() => setIsEmergencyModalOpen(true)}
            className="text-xs gap-1.5"
          >
            <AlertTriangle className="h-3.5 w-3.5" /> Emergency Help
          </Button>
        </div>
      </div>

      {/* ================================================== */}
      {/* MODALS SECTION */}
      {/* ================================================== */}

      {/* Modal 1: Apply Hostel Leave */}
      {isLeaveModalOpen && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-card border border-border rounded-2xl shadow-2xl p-6 space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" /> Apply Hostel Leave
              </h3>
              <Button variant="ghost" size="icon" onClick={() => setIsLeaveModalOpen(false)} className="rounded-full h-8 w-8">
                <X className="h-4 w-4" />
              </Button>
            </div>

            <form onSubmit={handleApplyLeave} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-foreground">Leave Start Date</label>
                  <input
                    type="date"
                    value={leaveForm.startDate}
                    onChange={(e) => setLeaveForm({ ...leaveForm, startDate: e.target.value })}
                    className="w-full p-2 rounded-lg border border-border bg-background text-foreground"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-foreground">Leave End Date</label>
                  <input
                    type="date"
                    value={leaveForm.endDate}
                    onChange={(e) => setLeaveForm({ ...leaveForm, endDate: e.target.value })}
                    className="w-full p-2 rounded-lg border border-border bg-background text-foreground"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-foreground">Reason for Leave</label>
                <textarea
                  value={leaveForm.reason}
                  onChange={(e) => setLeaveForm({ ...leaveForm, reason: e.target.value })}
                  rows={2}
                  placeholder="State detailed reason for leaving hostel..."
                  className="w-full p-2 rounded-lg border border-border bg-background text-foreground"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-foreground">Destination Address</label>
                <input
                  type="text"
                  value={leaveForm.destinationAddress}
                  onChange={(e) => setLeaveForm({ ...leaveForm, destinationAddress: e.target.value })}
                  className="w-full p-2 rounded-lg border border-border bg-background text-foreground"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-foreground">Parent / Guardian Contact</label>
                <input
                  type="tel"
                  value={leaveForm.parentPhone}
                  onChange={(e) => setLeaveForm({ ...leaveForm, parentPhone: e.target.value })}
                  className="w-full p-2 rounded-lg border border-border bg-background text-foreground"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setIsLeaveModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" size="sm">
                  Submit Leave Application
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Gate Pass Modal */}
      {isGatePassModalOpen && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-card border border-border rounded-2xl shadow-2xl p-6 space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                <QrCode className="h-5 w-5 text-primary" /> Generate Quick Gate Pass
              </h3>
              <Button variant="ghost" size="icon" onClick={() => setIsGatePassModalOpen(false)} className="rounded-full h-8 w-8">
                <X className="h-4 w-4" />
              </Button>
            </div>

            <form onSubmit={handleGenerateGatePass} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-foreground">Outing Purpose</label>
                <select
                  value={gatePassForm.purpose}
                  onChange={(e) => setGatePassForm({ ...gatePassForm, purpose: e.target.value })}
                  className="w-full p-2 rounded-lg border border-border bg-background text-foreground"
                >
                  <option value="Local Outing">Local Outing (City)</option>
                  <option value="Weekend Home Visit">Weekend Home Visit</option>
                  <option value="Medical Consultation">Medical Consultation</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-foreground">Destination</label>
                <input
                  type="text"
                  value={gatePassForm.destination}
                  onChange={(e) => setGatePassForm({ ...gatePassForm, destination: e.target.value })}
                  className="w-full p-2 rounded-lg border border-border bg-background text-foreground"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-foreground">Out Date</label>
                  <input
                    type="date"
                    value={gatePassForm.outDate}
                    onChange={(e) => setGatePassForm({ ...gatePassForm, outDate: e.target.value })}
                    className="w-full p-2 rounded-lg border border-border bg-background text-foreground"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-foreground">Return Date</label>
                  <input
                    type="date"
                    value={gatePassForm.returnDate}
                    onChange={(e) => setGatePassForm({ ...gatePassForm, returnDate: e.target.value })}
                    className="w-full p-2 rounded-lg border border-border bg-background text-foreground"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setIsGatePassModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" size="sm">
                  Generate Approved Pass
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 3: Submit Complaint Modal */}
      {isComplaintModalOpen && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-card border border-border rounded-2xl shadow-2xl p-6 space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-primary" /> Lodge Hostel Complaint
              </h3>
              <Button variant="ghost" size="icon" onClick={() => setIsComplaintModalOpen(false)} className="rounded-full h-8 w-8">
                <X className="h-4 w-4" />
              </Button>
            </div>

            <form onSubmit={handleSubmitComplaint} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-foreground">Category</label>
                  <select
                    value={complaintForm.category}
                    onChange={(e) => setComplaintForm({ ...complaintForm, category: e.target.value })}
                    className="w-full p-2 rounded-lg border border-border bg-background text-foreground"
                  >
                    <option value="Electricity">Electricity</option>
                    <option value="Water">Water / Plumbing</option>
                    <option value="Cleaning">Housekeeping / Cleaning</option>
                    <option value="Furniture">Furniture</option>
                    <option value="Internet">Internet / Wi-Fi</option>
                    <option value="Mess">Mess Food</option>
                    <option value="Security">Security / Lock</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-foreground">Priority</label>
                  <select
                    value={complaintForm.priority}
                    onChange={(e) => setComplaintForm({ ...complaintForm, priority: e.target.value as any })}
                    className="w-full p-2 rounded-lg border border-border bg-background text-foreground"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-foreground">Complaint Description</label>
                <textarea
                  value={complaintForm.description}
                  onChange={(e) => setComplaintForm({ ...complaintForm, description: e.target.value })}
                  rows={3}
                  placeholder="Describe the issue clearly..."
                  className="w-full p-2 rounded-lg border border-border bg-background text-foreground"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-foreground">Upload Image Proof (Optional)</label>
                <input
                  type="file"
                  accept="image/*"
                  className="w-full text-xs text-muted-foreground file:mr-2 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setIsComplaintModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" size="sm">
                  Lodge Complaint Ticket
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 4: Mess Feedback Modal */}
      {isMessFeedbackModalOpen && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-card border border-border rounded-2xl shadow-2xl p-6 space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                <Utensils className="h-5 w-5 text-amber-500" /> Meal & Mess Feedback
              </h3>
              <Button variant="ghost" size="icon" onClick={() => setIsMessFeedbackModalOpen(false)} className="rounded-full h-8 w-8">
                <X className="h-4 w-4" />
              </Button>
            </div>

            <form onSubmit={handleMessFeedbackSubmit} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-foreground">Meal Type</label>
                <select
                  value={messFeedbackForm.mealType}
                  onChange={(e) => setMessFeedbackForm({ ...messFeedbackForm, mealType: e.target.value })}
                  className="w-full p-2 rounded-lg border border-border bg-background text-foreground"
                >
                  <option value="Breakfast">Breakfast</option>
                  <option value="Lunch">Lunch</option>
                  <option value="Snacks">Evening Snacks</option>
                  <option value="Dinner">Dinner</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-foreground">Overall Rating (1 to 5 Stars)</label>
                <div className="flex items-center gap-2 py-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setMessFeedbackForm({ ...messFeedbackForm, rating: star })}
                      className="p-1 hover:scale-110 transition-transform"
                    >
                      <Star className={`h-6 w-6 ${star <= messFeedbackForm.rating ? "text-amber-500 fill-amber-500" : "text-muted border-muted"}`} />
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-foreground">Comments / Suggestion</label>
                <textarea
                  value={messFeedbackForm.comments}
                  onChange={(e) => setMessFeedbackForm({ ...messFeedbackForm, comments: e.target.value })}
                  rows={3}
                  placeholder="Share details regarding food taste, hygiene, quantity..."
                  className="w-full p-2 rounded-lg border border-border bg-background text-foreground"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setIsMessFeedbackModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" size="sm">
                  Submit Feedback
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 5: Room Details & Inventory Modal */}
      {isRoomDetailsModalOpen && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-card border border-border rounded-2xl shadow-2xl p-6 space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                <Key className="h-5 w-5 text-primary" /> Room A-305 Detailed Inventory
              </h3>
              <Button variant="ghost" size="icon" onClick={() => setIsRoomDetailsModalOpen(false)} className="rounded-full h-8 w-8">
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-3 text-xs">
              <p className="text-muted-foreground">List of physical assets allocated to Room A-305:</p>
              <div className="space-y-2 border border-border rounded-lg p-3 bg-muted/20">
                <div className="flex items-center justify-between">
                  <span>3 Wooden Study Tables & Chairs</span>
                  <span className="text-emerald-600 font-semibold">Good Condition</span>
                </div>
                <div className="flex items-center justify-between border-t border-border/50 pt-1.5">
                  <span>3 Wooden Single Beds & Mattresses</span>
                  <span className="text-emerald-600 font-semibold">Good Condition</span>
                </div>
                <div className="flex items-center justify-between border-t border-border/50 pt-1.5">
                  <span>3 Steel Almirahs with Key Locks</span>
                  <span className="text-emerald-600 font-semibold">Good Condition</span>
                </div>
                <div className="flex items-center justify-between border-t border-border/50 pt-1.5">
                  <span>1.5 Ton Split Air Conditioner</span>
                  <span className="text-emerald-600 font-semibold">Serviced (July 2026)</span>
                </div>
                <div className="flex items-center justify-between border-t border-border/50 pt-1.5">
                  <span>2 Ceiling Fans & LED Tube Lights</span>
                  <span className="text-amber-600 font-semibold">1 Light Replacement Pending</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button size="sm" onClick={() => setIsRoomDetailsModalOpen(false)}>
                Close Window
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 6: Pay Hostel Fee Modal */}
      {isPaymentModalOpen && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-card border border-border rounded-2xl shadow-2xl p-6 space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-emerald-600" /> Pay Hostel Fee Online
              </h3>
              <Button variant="ghost" size="icon" onClick={() => setIsPaymentModalOpen(false)} className="rounded-full h-8 w-8">
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs space-y-1 text-center">
              <p className="font-bold text-emerald-700 dark:text-emerald-300 text-sm">All Outstanding Hostel Dues Are Cleared!</p>
              <p className="text-muted-foreground">Your total paid amount for 2026-27 is ₹45,000.</p>
            </div>

            <div className="flex justify-end pt-2">
              <Button size="sm" onClick={() => setIsPaymentModalOpen(false)}>
                Done
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 7: Add Visitor Modal */}
      {isVisitorModalOpen && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-card border border-border rounded-2xl shadow-2xl p-6 space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                <UserCheck className="h-5 w-5 text-primary" /> Register Hostel Visitor
              </h3>
              <Button variant="ghost" size="icon" onClick={() => setIsVisitorModalOpen(false)} className="rounded-full h-8 w-8">
                <X className="h-4 w-4" />
              </Button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setIsVisitorModalOpen(false);
                alert("Visitor Pass registered! Present ID proof at Hostel Security Gate.");
              }}
              className="space-y-3 text-xs"
            >
              <div className="space-y-1">
                <label className="font-semibold text-foreground">Visitor Full Name</label>
                <input type="text" placeholder="e.g. Suresh Kumar" className="w-full p-2 rounded-lg border border-border bg-background text-foreground" required />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-foreground">Relationship</label>
                <input type="text" placeholder="e.g. Father / Mother / Brother" className="w-full p-2 rounded-lg border border-border bg-background text-foreground" required />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-foreground">Visiting Date</label>
                  <input type="date" defaultValue={new Date().toISOString().split("T")[0]} className="w-full p-2 rounded-lg border border-border bg-background text-foreground" required />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-foreground">Expected In Time</label>
                  <input type="text" defaultValue="04:00 PM" className="w-full p-2 rounded-lg border border-border bg-background text-foreground" required />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setIsVisitorModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" size="sm">
                  Register Visitor Pass
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Warden Contact Modal */}
      {isWardenContactModalOpen && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-card border border-border rounded-2xl shadow-2xl p-6 space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                <PhoneCall className="h-5 w-5 text-emerald-600" /> Hostel Warden Desk Contacts
              </h3>
              <Button variant="ghost" size="icon" onClick={() => setIsWardenContactModalOpen(false)} className="rounded-full h-8 w-8">
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-lg bg-muted/30 border border-border">
                <p className="font-bold text-foreground">Chief Warden: {mockHostelInfo.wardenName}</p>
                <p className="text-muted-foreground">Office: Block A Warden Chamber (Ground Floor)</p>
                <p className="text-primary font-semibold mt-1">Phone: +91 94444 12345</p>
              </div>

              <div className="p-3 rounded-lg bg-muted/30 border border-border">
                <p className="font-bold text-foreground">Assistant Warden: {mockHostelInfo.assistantWarden}</p>
                <p className="text-muted-foreground">Office: Block A Security Control Room</p>
                <p className="text-primary font-semibold mt-1">Phone: +91 94444 67890</p>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button size="sm" onClick={() => setIsWardenContactModalOpen(false)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Emergency Help Alert Modal */}
      {isEmergencyModalOpen && (
        <div className="fixed inset-0 z-50 bg-red-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-card border-2 border-red-500 rounded-2xl shadow-2xl p-6 space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-red-500/30 pb-3">
              <h3 className="text-base font-bold text-red-600 dark:text-red-400 flex items-center gap-2">
                <AlertTriangle className="h-6 w-6 text-red-500 animate-pulse" /> Emergency SOS Alert Triggered
              </h3>
              <Button variant="ghost" size="icon" onClick={() => setIsEmergencyModalOpen(false)} className="rounded-full h-8 w-8">
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="text-xs space-y-2 text-foreground">
              <p className="font-semibold">Hostel Security Control Room & Campus Health Desk have been notified of your location (Room A-305)!</p>
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 space-y-1">
                <p className="font-bold text-red-600 dark:text-red-400">Immediate Phone Hotlines:</p>
                <p className="font-mono">Campus Ambulance: 040-27899999</p>
                <p className="font-mono">Security Gate 1: +91 94444 11111</p>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button variant="destructive" size="sm" onClick={() => setIsEmergencyModalOpen(false)}>
                Dismiss SOS Alert
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentHostelModule;
