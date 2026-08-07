import React, { useEffect, useState } from "react";
import {
  Bus,
  Search,
  RefreshCw,
  Download,
  Users,
  CheckCircle2,
  AlertCircle,
  FileText,
  Navigation,
  Sparkles,
  Settings,
  BarChart3,
  Shield,
  Activity,
  Fuel,
  Wrench,
  Clock,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  UserCheck,
  Gauge,
  Radio,
  Calendar,
  ChevronRight,
  ChevronLeft,
  CreditCard,
  MapPin,
  Globe,
  Bell,
  ClipboardList,
  UserCog,
  SlidersHorizontal,
  Phone,
  Route,
  Zap,
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
  INITIAL_ROUTES,
  INITIAL_PASSES,
  type BusRoute,
  type TransportPass,
} from "./TransportService";

// ─── Extended mock data for governance views ───────────────────────────────

const FLEET_HEALTH_DATA = [
  {
    id: "VH-001", regNo: "TS-09-UB-4589", model: "Tata Starbus Ultra", year: 2021,
    healthScore: 94, insurance: "2027-03-15", permit: "2026-10-22",
    pollution: "2026-12-01", fitness: "2027-01-10", roadTax: "2027-03-31",
    maintenance: "2026-09-10", gpsStatus: "Online", emergencyKit: "OK",
    fireExtinguisher: "OK", lastServiced: "2026-07-15", status: "Active",
  },
  {
    id: "VH-002", regNo: "TS-09-UB-7812", model: "Ashok Leyland Lynx", year: 2020,
    healthScore: 87, insurance: "2026-08-30", permit: "2026-09-15",
    pollution: "2026-08-20", fitness: "2026-10-05", roadTax: "2026-08-30",
    maintenance: "2026-08-20", gpsStatus: "Online", emergencyKit: "OK",
    fireExtinguisher: "Renewal Due", lastServiced: "2026-06-28", status: "Active",
  },
  {
    id: "VH-003", regNo: "TS-09-UB-2109", model: "Volvo B8R", year: 2022,
    healthScore: 98, insurance: "2027-06-20", permit: "2027-02-18",
    pollution: "2027-01-25", fitness: "2027-03-12", roadTax: "2027-06-20",
    maintenance: "2026-11-01", gpsStatus: "Online", emergencyKit: "OK",
    fireExtinguisher: "OK", lastServiced: "2026-07-30", status: "Active",
  },
  {
    id: "VH-004", regNo: "TS-09-UB-3341", model: "Tata Starbus", year: 2019,
    healthScore: 71, insurance: "2026-09-05", permit: "2026-08-12",
    pollution: "2026-08-01", fitness: "2026-09-20", roadTax: "2026-09-05",
    maintenance: "2026-08-05", gpsStatus: "Offline", emergencyKit: "Missing",
    fireExtinguisher: "OK", lastServiced: "2026-05-10", status: "Maintenance",
  },
];

const TRANSPORT_ALERTS = [
  { id: 1, type: "warning", icon: "wrench", title: "Maintenance Due", detail: "TS-09-UB-3341 — Service overdue by 12 days", time: "2h ago" },
  { id: 2, type: "danger",  icon: "shield", title: "Insurance Expiring", detail: "TS-09-UB-7812 — Insurance expires in 26 days", time: "Today" },
  { id: 3, type: "danger",  icon: "shield", title: "Permit Expiring",    detail: "TS-09-UB-3341 — Permit expires Aug 12, 2026", time: "Today" },
  { id: 4, type: "danger",  icon: "radio",  title: "GPS Offline",        detail: "TS-09-UB-3341 — GPS signal lost since 06:40 AM", time: "6h ago" },
  { id: 5, type: "warning", icon: "fuel",   title: "High Fuel Consumption", detail: "Route 2 — 18% above monthly average", time: "Yesterday" },
  { id: 6, type: "info",    icon: "clock",  title: "Route Delay",        detail: "Route 1 — Morning trip delayed by 14 min", time: "Today" },
];

const RECENT_ACTIVITIES = [
  { id: 1, date: "2026-08-04", user: "Transport Manager", action: "Fleet Inspection Completed — All 3 active buses cleared" },
  { id: 2, date: "2026-08-03", user: "Transport Manager", action: "Vehicle Serviced — TS-09-UB-4589 engine oil & filters changed" },
  { id: 3, date: "2026-08-02", user: "System",            action: "GPS Activated — New GPS unit installed on TS-09-UB-7812" },
  { id: 4, date: "2026-08-01", user: "Transport Manager", action: "Permit Renewed — TS-09-UB-2109 permit renewed till Feb 2027" },
  { id: 5, date: "2026-07-30", user: "Transport Manager", action: "Maintenance Completed — TS-09-UB-2109 brake system overhauled" },
  { id: 6, date: "2026-07-28", user: "Transport Manager", action: "Fuel Audit Completed — Q2 fuel consumption ₹3.84 L total" },
];

const STAFF_SUMMARY = [
  { role: "Transport Manager",   name: "Mr. P. Kishore Kumar",  status: "On Duty",  contact: "+91 9848055566" },
  { role: "Fleet Supervisor",    name: "Mr. D. Srinivasa Rao",  status: "On Duty",  contact: "+91 9848011122" },
  { role: "Fleet Supervisor",    name: "Mrs. T. Padmavathi",    status: "On Leave",  contact: "+91 9848033344" },
  { role: "Driver",              name: "M. Ramakrishna",        status: "On Duty",  contact: "+91 9848012345" },
  { role: "Driver",              name: "S. Venkatesh",          status: "On Duty",  contact: "+91 9848098765" },
  { role: "Driver",              name: "K. Nageswara Rao",      status: "On Duty",  contact: "+91 9848033344" },
  { role: "Mechanic",            name: "B. Raju",               status: "On Duty",  contact: "+91 9848077788" },
  { role: "Support Staff",       name: "G. Lakshmi",            status: "On Duty",  contact: "+91 9848099900" },
];

// ─── Dynamic Transport Configuration Panels ───────────────────────────────

type FieldType = "text" | "number" | "select" | "toggle" | "textarea" | "time";

interface ConfigField {
  key: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  options?: string[];
  defaultValue?: string;
  description?: string;
}

interface ConfigPanel {
  id: string;
  label: string;
  icon: React.ElementType;
  description: string;
  fields: ConfigField[];
}

const TRANSPORT_CONFIG_PANELS: ConfigPanel[] = [
  {
    id: "fee-structure",
    label: "Transport Fee Structure",
    icon: CreditCard,
    description: "Set annual transport fee slabs by distance zone and student category.",
    fields: [
      { key: "zone1Fee", label: "Zone 1 Fee (0–10 km)", type: "number", placeholder: "28000", defaultValue: "28000", description: "Annual fee in ₹" },
      { key: "zone2Fee", label: "Zone 2 Fee (10–20 km)", type: "number", placeholder: "32000", defaultValue: "32000" },
      { key: "zone3Fee", label: "Zone 3 Fee (>20 km)", type: "number", placeholder: "36000", defaultValue: "36000" },
      { key: "staffDiscount", label: "Staff Discount (%)", type: "number", placeholder: "20", defaultValue: "20" },
      { key: "scStDiscount", label: "SC/ST Student Concession (%)", type: "number", placeholder: "50", defaultValue: "50" },
      { key: "lateFee", label: "Late Payment Fine (₹/month)", type: "number", placeholder: "500", defaultValue: "500" },
      { key: "paymentMode", label: "Accepted Payment Modes", type: "select", options: ["Online Only", "Online + Challan", "All Modes"], defaultValue: "Online + Challan" },
    ],
  },
  {
    id: "route-categories",
    label: "Route Categories",
    icon: Route,
    description: "Define route types and categorisation rules for the fleet.",
    fields: [
      { key: "primaryRoutes", label: "Primary Route Count", type: "number", placeholder: "3", defaultValue: "3" },
      { key: "feederRoutes", label: "Feeder/Shuttle Routes", type: "number", placeholder: "0", defaultValue: "0" },
      { key: "staffRoutes", label: "Staff-Only Routes", type: "number", placeholder: "1", defaultValue: "1" },
      { key: "categoryNaming", label: "Route Naming Convention", type: "select", options: ["Route 1, Route 2…", "North/South/East/West", "Zone A/B/C"], defaultValue: "Route 1, Route 2…" },
      { key: "maxStops", label: "Maximum Stops per Route", type: "number", placeholder: "10", defaultValue: "10" },
    ],
  },
  {
    id: "transport-policies",
    label: "Transport Policies",
    icon: ClipboardList,
    description: "Institutional transport governance policies and conduct rules.",
    fields: [
      { key: "passValidity", label: "Transport Pass Validity", type: "select", options: ["Annual", "Semester", "Monthly"], defaultValue: "Annual" },
      { key: "cancellationPolicy", label: "Pass Cancellation Notice (days)", type: "number", placeholder: "15", defaultValue: "15" },
      { key: "transferPolicy", label: "Route Transfer Policy", type: "select", options: ["Allowed Once/Year", "Allowed Anytime", "Not Allowed"], defaultValue: "Allowed Once/Year" },
      { key: "conductPolicy", label: "Student Conduct Policy", type: "textarea", placeholder: "Students must board only at designated stops…", defaultValue: "Students must board only at designated stops and carry valid transport passes at all times." },
      { key: "lostPassFee", label: "Lost Pass Replacement Fee (₹)", type: "number", placeholder: "200", defaultValue: "200" },
    ],
  },
  {
    id: "student-eligibility",
    label: "Student Eligibility Rules",
    icon: UserCog,
    description: "Define which students qualify for institutional transport.",
    fields: [
      { key: "minDistance", label: "Minimum Distance from Campus (km)", type: "number", placeholder: "5", defaultValue: "5" },
      { key: "maxDistance", label: "Maximum Distance Served (km)", type: "number", placeholder: "40", defaultValue: "40" },
      { key: "eligibleYears", label: "Eligible Student Years", type: "select", options: ["All Years", "Year 1 Only", "Year 1 & 2", "Year 2 onwards"], defaultValue: "All Years" },
      { key: "hostelerEligible", label: "Hostel Residents Eligible", type: "toggle", defaultValue: "false" },
      { key: "maxPassPerStudent", label: "Max Passes per Student", type: "number", placeholder: "1", defaultValue: "1" },
    ],
  },
  {
    id: "staff-transport",
    label: "Staff Transport Policy",
    icon: UserCheck,
    description: "Transport entitlements and rules for teaching and non-teaching staff.",
    fields: [
      { key: "staffPassType", label: "Staff Pass Type", type: "select", options: ["Subsidised", "Free", "Full Pay"], defaultValue: "Subsidised" },
      { key: "staffSubsidy", label: "Staff Fee Subsidy (%)", type: "number", placeholder: "20", defaultValue: "20" },
      { key: "staffDedicatedSeats", label: "Reserved Seats per Bus", type: "number", placeholder: "4", defaultValue: "4" },
      { key: "staffPriority", label: "Staff Boarding Priority", type: "toggle", defaultValue: "true" },
      { key: "staffRouteChange", label: "Route Change Requests", type: "select", options: ["HR Approval Required", "Self-Service", "Transport Manager Approval"], defaultValue: "HR Approval Required" },
    ],
  },
  {
    id: "gps-config",
    label: "GPS Configuration",
    icon: Globe,
    description: "Fleet GPS tracking system settings and alert thresholds.",
    fields: [
      { key: "gpsProvider", label: "GPS Provider", type: "select", options: ["iTrack", "MapMyIndia", "Trimble", "Vamosys"], defaultValue: "Vamosys" },
      { key: "updateInterval", label: "Location Update Interval (sec)", type: "number", placeholder: "30", defaultValue: "30" },
      { key: "offlineAlert", label: "Alert if GPS Offline for (min)", type: "number", placeholder: "10", defaultValue: "10" },
      { key: "geofenceRadius", label: "Campus Geofence Radius (m)", type: "number", placeholder: "200", defaultValue: "200" },
      { key: "parentTracking", label: "Enable Parent Live Tracking", type: "toggle", defaultValue: "true" },
      { key: "gpsRetention", label: "Location Data Retention (days)", type: "number", placeholder: "90", defaultValue: "90" },
    ],
  },
  {
    id: "fuel-standards",
    label: "Fuel Consumption Standards",
    icon: Fuel,
    description: "Set fuel efficiency benchmarks and alert thresholds for fleet vehicles.",
    fields: [
      { key: "stdEfficiency", label: "Standard Efficiency (km/l)", type: "number", placeholder: "12", defaultValue: "12" },
      { key: "alertThreshold", label: "Alert if Below (km/l)", type: "number", placeholder: "9", defaultValue: "9" },
      { key: "fuelType", label: "Fleet Fuel Type", type: "select", options: ["Diesel", "CNG", "Electric", "Hybrid"], defaultValue: "Diesel" },
      { key: "monthlyBudget", label: "Monthly Fuel Budget (₹)", type: "number", placeholder: "130000", defaultValue: "130000" },
      { key: "fuelAuditFreq", label: "Fuel Audit Frequency", type: "select", options: ["Weekly", "Monthly", "Quarterly"], defaultValue: "Monthly" },
    ],
  },
  {
    id: "vehicle-inspection",
    label: "Vehicle Inspection Schedule",
    icon: Wrench,
    description: "Set maintenance and safety inspection intervals for the fleet.",
    fields: [
      { key: "serviceInterval", label: "Routine Service Interval (km)", type: "number", placeholder: "10000", defaultValue: "10000" },
      { key: "preTrip", label: "Pre-Trip Inspection", type: "toggle", defaultValue: "true" },
      { key: "annualFitness", label: "Annual Fitness Check Month", type: "select", options: ["January", "April", "July", "October"], defaultValue: "January" },
      { key: "tirePressure", label: "Tyre Pressure Check Frequency", type: "select", options: ["Daily", "Weekly", "Before Each Trip"], defaultValue: "Weekly" },
      { key: "safetyKitCheck", label: "Emergency Kit Inspection Frequency", type: "select", options: ["Monthly", "Quarterly", "Semi-Annual"], defaultValue: "Monthly" },
      { key: "inspectionAuthority", label: "Inspection Authority", type: "select", options: ["Internal", "RTO", "Third-Party Agency"], defaultValue: "RTO" },
    ],
  },
  {
    id: "driver-compliance",
    label: "Driver Compliance Rules",
    icon: Shield,
    description: "Driver eligibility, conduct, and license compliance standards.",
    fields: [
      { key: "minLicenseClass", label: "Minimum License Class", type: "select", options: ["LMV", "HMV", "HPMV/Transport"], defaultValue: "HPMV/Transport" },
      { key: "minExperience", label: "Minimum Driving Experience (years)", type: "number", placeholder: "3", defaultValue: "3" },
      { key: "backgroundCheck", label: "Police Background Verification", type: "toggle", defaultValue: "true" },
      { key: "medicalFitness", label: "Annual Medical Fitness Certificate", type: "toggle", defaultValue: "true" },
      { key: "speedLimit", label: "Campus Zone Speed Limit (km/h)", type: "number", placeholder: "20", defaultValue: "20" },
      { key: "licenseRenewalAlert", label: "License Renewal Alert (days before)", type: "number", placeholder: "60", defaultValue: "60" },
    ],
  },
  {
    id: "transport-timings",
    label: "Transport Timings",
    icon: Clock,
    description: "Set morning and evening bus departure and arrival time schedules.",
    fields: [
      { key: "morningDeparture", label: "Morning Campus Arrival Time", type: "time", defaultValue: "08:00" },
      { key: "morningReturn", label: "Evening Campus Departure Time", type: "time", defaultValue: "17:30" },
      { key: "saturdayService", label: "Saturday Service", type: "select", options: ["Full Service", "Half Service", "No Service"], defaultValue: "Half Service" },
      { key: "sundayService", label: "Sunday Service", type: "toggle", defaultValue: "false" },
      { key: "bufferTime", label: "Stop Wait Time (minutes)", type: "number", placeholder: "3", defaultValue: "3" },
      { key: "latePickup", label: "Late Exam Special Pickup", type: "toggle", defaultValue: "true" },
    ],
  },
  {
    id: "emergency-contacts",
    label: "Emergency Contacts",
    icon: Phone,
    description: "Configure emergency contact numbers displayed to students and staff.",
    fields: [
      { key: "transportManager", label: "Transport Manager", type: "text", placeholder: "+91 9848055566", defaultValue: "+91 9848055566" },
      { key: "fleetSupervisor", label: "Fleet Supervisor", type: "text", placeholder: "+91 9848011122", defaultValue: "+91 9848011122" },
      { key: "emergencyHotline", label: "24h Emergency Hotline", type: "text", placeholder: "+91 1800-XXX-XXXX", defaultValue: "+91 1800-100-2345" },
      { key: "policeContact", label: "Local Police Station", type: "text", placeholder: "+91 040-XXXXXXXX", defaultValue: "+91 040-27852345" },
      { key: "ambulance", label: "Nearest Ambulance", type: "text", placeholder: "108", defaultValue: "108" },
      { key: "gpsControlRoom", label: "GPS Control Room", type: "text", placeholder: "+91 XXXXXXXXXX", defaultValue: "+91 9848099900" },
    ],
  },
  {
    id: "notification-rules",
    label: "Notification Rules",
    icon: Bell,
    description: "Configure automated notifications sent to students, staff and parents.",
    fields: [
      { key: "departureSMS", label: "Departure Alert (SMS)", type: "toggle", defaultValue: "true" },
      { key: "arrivalPush", label: "Campus Arrival Push Notification", type: "toggle", defaultValue: "true" },
      { key: "delayAlert", label: "Delay Alert Threshold (minutes)", type: "number", placeholder: "10", defaultValue: "10" },
      { key: "breakdownAlert", label: "Breakdown Instant Alert", type: "toggle", defaultValue: "true" },
      { key: "feeDueAlert", label: "Fee Due Reminder (days before)", type: "number", placeholder: "15", defaultValue: "15" },
      { key: "channel", label: "Primary Notification Channel", type: "select", options: ["SMS + App", "App Only", "Email + App", "SMS + Email + App"], defaultValue: "SMS + App" },
    ],
  },
  {
    id: "holiday-schedule",
    label: "Holiday Transport Schedule",
    icon: Calendar,
    description: "Configure transport operations during holidays, exams, and special events.",
    fields: [
      { key: "examService", label: "Exam Period Service", type: "select", options: ["Full Service", "Exam Timing Only", "No Service"], defaultValue: "Exam Timing Only" },
      { key: "festivalService", label: "Festival Holiday Service", type: "toggle", defaultValue: "false" },
      { key: "noticePeriod", label: "Schedule Change Notice (days)", type: "number", placeholder: "3", defaultValue: "3" },
      { key: "specialTrips", label: "Allow Special Trip Requests", type: "toggle", defaultValue: "true" },
      { key: "holidayCalendar", label: "Holiday Calendar Source", type: "select", options: ["Academic Calendar", "Govt. Calendar", "Manual Entry"], defaultValue: "Academic Calendar" },
    ],
  },
];

const REPORT_ITEMS = [
  "Monthly Fleet Report", "Fuel Usage Report", "Maintenance Report",
  "Vehicle Utilization", "Driver Performance", "Route Performance", "GPS Summary",
];

export function TransportModuleView() {
  const [routes, setRoutes] = useState<BusRoute[]>(INITIAL_ROUTES);
  const [passes, setPasses] = useState<TransportPass[]>(INITIAL_PASSES);
  const [activeTab, setActiveTab] = useState<"routes" | "passes" | "health">("routes");

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  // Filter states
  const [filterDept, setFilterDept]     = useState("all");
  const [filterYear, setFilterYear]     = useState("all");
  const [filterRoute, setFilterRoute]   = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  // Modal states
  const [isConfigOpen, setIsConfigOpen]   = useState(false);
  const [isReportOpen, setIsReportOpen]   = useState(false);
  const [activePanel, setActivePanel]     = useState<ConfigPanel | null>(null);
  const [configData, setConfigData]       = useState<Record<string, string>>(() => {
    const defaults: Record<string, string> = {};
    TRANSPORT_CONFIG_PANELS.forEach(panel => {
      panel.fields.forEach(field => {
        defaults[`${panel.id}__${field.key}`] = field.defaultValue ?? "";
      });
    });
    return defaults;
  });

  const loadData = async () => {
    setLoading(true);
    const [rt, ps] = await Promise.all([fetchBusRoutes(), fetchTransportPasses()]);
    setRoutes(rt);
    setPasses(ps);
    setLoading(false);
  };

  useEffect(() => { loadData(); }, []);

  // ── Derived KPI values ───────────────────────────────────────────────────
  const totalVehicles        = routes.length + 1; // +1 for maintenance bus
  const vehiclesInService    = routes.filter(r => r.status === "Active").length;
  const vehiclesMaintenance  = FLEET_HEALTH_DATA.filter(v => v.status === "Maintenance").length;
  const totalPassHolders     = routes.reduce((s, r) => s + r.passHoldersCount, 0);
  const totalCapacity        = routes.reduce((s, r) => s + r.capacity, 0);
  const avgOccupancy         = totalCapacity > 0 ? ((totalPassHolders / totalCapacity) * 100).toFixed(1) : "0";
  const gpsOnline            = FLEET_HEALTH_DATA.filter(v => v.gpsStatus === "Online").length;
  const maintenanceDue       = FLEET_HEALTH_DATA.filter(v => v.status === "Maintenance").length;

  // ── Pass monitoring derived ───────────────────────────────────────────────
  const passStudents  = passes.filter(p => p.rollNo.match(/^[0-9]{2}/)).length;
  const passFaculty   = passes.length - passStudents;
  const passPaid      = passes.filter(p => p.paymentStatus === "Paid").length;
  const passPending   = passes.filter(p => p.paymentStatus === "Pending" || p.paymentStatus === "Partial").length;
  const passRevenue   = passes.reduce((s, p) => s + p.annualFee, 0);

  // ── Fleet route table rows ────────────────────────────────────────────────
  const fleetRows = routes.map((r, idx) => {
    const hd = FLEET_HEALTH_DATA[idx] || FLEET_HEALTH_DATA[0];
    const occ = r.capacity > 0 ? ((r.passHoldersCount / r.capacity) * 100).toFixed(0) : "0";
    return { ...r, healthScore: hd.healthScore, gpsStatus: hd.gpsStatus, maintenanceDue: hd.maintenance, fuelEff: "11.4 km/l", distance: `${28 + idx * 6} km`, occupancy: occ, inspectionStatus: hd.healthScore >= 90 ? "Passed" : "Pending" };
  });

  const filteredRoutes = fleetRows.filter(r =>
    r.routeNo.toLowerCase().includes(search.toLowerCase()) ||
    r.routeName.toLowerCase().includes(search.toLowerCase()) ||
    r.busRegNo.toLowerCase().includes(search.toLowerCase()) ||
    r.driverName.toLowerCase().includes(search.toLowerCase())
  );

  const filteredPasses = passes.filter(p => {
    const matchDept   = filterDept === "all"   || p.department === filterDept;
    const matchRoute  = filterRoute === "all"  || p.routeNo === filterRoute;
    const matchStatus = filterStatus === "all" || p.paymentStatus === filterStatus;
    return matchDept && matchRoute && matchStatus;
  });

  // ── Export CSV (routes) ──────────────────────────────────────────────────
  const handleExportCSV = () => {
    const headers = ["Route No", "Route Name", "Bus Reg No", "Driver", "Capacity", "Occupancy%", "GPS", "Health", "Status"];
    const rows = filteredRoutes.map(r => [r.routeNo, `"${r.routeName}"`, r.busRegNo, `"${r.driverName}"`, r.capacity, r.occupancy, r.gpsStatus, r.healthScore, r.status]);
    const csv = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csv));
    link.setAttribute("download", `Fleet_Overview_Report_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Fleet Overview exported to CSV!");
  };

  // ─── UI helpers ───────────────────────────────────────────────────────────
  const alertTypeColor = (t: string) =>
    t === "danger" ? "text-red-500 bg-red-500/10 border-red-500/20"
    : t === "warning" ? "text-amber-500 bg-amber-500/10 border-amber-500/20"
    : "text-blue-500 bg-blue-500/10 border-blue-500/20";

  const healthBadge = (score: number) =>
    score >= 90 ? <Badge className="bg-emerald-500/10 text-emerald-600 text-[0.65rem]">Grade A+</Badge>
    : score >= 75 ? <Badge className="bg-amber-500/10 text-amber-600 text-[0.65rem]">Grade B</Badge>
    : <Badge className="bg-red-500/10 text-red-600 text-[0.65rem]">Grade C</Badge>;

  const docBadge = (expiry: string) => {
    const days = Math.ceil((new Date(expiry).getTime() - Date.now()) / 86400000);
    if (days < 0)  return <Badge className="bg-red-500/10 text-red-600 text-[0.65rem]">Expired</Badge>;
    if (days < 30) return <Badge className="bg-amber-500/10 text-amber-600 text-[0.65rem]">Expiring {days}d</Badge>;
    return <Badge className="bg-emerald-500/10 text-emerald-600 text-[0.65rem]">Valid</Badge>;
  };

  const staffStatus = (s: string) =>
    s === "On Duty" ? <Badge className="bg-emerald-500/10 text-emerald-600 text-[0.65rem]">On Duty</Badge>
    : <Badge className="bg-amber-500/10 text-amber-600 text-[0.65rem]">On Leave</Badge>;

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-primary/10 text-primary border border-primary/20 shrink-0">
            <Bus className="size-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-bold font-display tracking-tight text-foreground">
                Campus Transport &amp; Fleet Management
              </h1>
              <Badge variant="outline" className="font-mono text-xs text-primary border-primary/30">
                Campus Services Core
              </Badge>
            </div>
            <p className="text-xs md:text-sm text-muted-foreground mt-0.5">
              Fleet governance, route analytics, compliance monitoring and transport intelligence.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 shrink-0 self-start sm:self-auto flex-wrap">
          <Button variant="outline" size="sm" onClick={loadData} disabled={loading} className="h-9 gap-2 text-xs font-medium">
            <RefreshCw className={`size-3.5 ${loading ? "animate-spin" : ""}`} /> Refresh
          </Button>
          <Button variant="outline" size="sm" onClick={handleExportCSV} className="h-9 gap-2 text-xs font-medium">
            <Download className="size-3.5" /> Export Routes
          </Button>
          <Button size="sm" variant="outline" onClick={() => setIsReportOpen(true)} className="h-9 border-primary/30 text-primary gap-2 text-xs font-semibold">
            <BarChart3 className="size-4" /> Fleet Reports
          </Button>
          <Button size="sm" onClick={() => setIsConfigOpen(true)} className="h-9 bg-brand-gradient text-white gap-2 text-xs font-semibold shadow-glow">
            <Settings className="size-4" /> Transport Configuration
          </Button>
        </div>
      </div>

      {/* ── KPI Row 1 — Existing ──────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground uppercase">
            <span>Fleet Buses</span>
            <Bus className="size-4 text-primary" />
          </div>
          <p className="text-2xl font-bold font-mono text-primary">{vehiclesInService} Active</p>
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
          <p className="text-2xl font-bold font-mono text-blue-600">{totalPassHolders.toLocaleString()} Scholars</p>
          <p className="text-[0.68rem] text-muted-foreground">Students &amp; Staff</p>
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

      {/* ── KPI Row 2 — New Governance Row ───────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        {[
          { label: "In Service",        value: vehiclesInService,       unit: "Buses",  color: "text-emerald-600", icon: <Bus className="size-4 text-emerald-500" /> },
          { label: "Under Maintenance", value: vehiclesMaintenance,     unit: "Buses",  color: "text-amber-600",   icon: <Wrench className="size-4 text-amber-500" /> },
          { label: "Avg Occupancy",     value: `${avgOccupancy}%`,      unit: "",       color: "text-blue-600",    icon: <Gauge className="size-4 text-blue-500" /> },
          { label: "Fuel Consumed",     value: "₹3.84L",                unit: "",       color: "text-orange-600",  icon: <Fuel className="size-4 text-orange-500" /> },
          { label: "Trips Today",       value: 6,                       unit: "Trips",  color: "text-primary",     icon: <Activity className="size-4 text-primary" /> },
          { label: "Drivers On Duty",   value: 3,                       unit: "Drivers",color: "text-teal-600",    icon: <UserCheck className="size-4 text-teal-500" /> },
          { label: "GPS Active",        value: gpsOnline,               unit: "Vehs",   color: "text-violet-600",  icon: <Radio className="size-4 text-violet-500" /> },
          { label: "Transport Revenue", value: `₹${(passRevenue/100000).toFixed(2)}L`, unit: "", color: "text-rose-600", icon: <TrendingUp className="size-4 text-rose-500" /> },
        ].map((k, i) => (
          <div key={i} className="p-3 rounded-xl bg-card border border-border/70 shadow-sm space-y-1">
            <div className="flex items-center justify-between">{k.icon}<span className="text-[0.6rem] font-semibold text-muted-foreground uppercase leading-tight text-right">{k.label}</span></div>
            <p className={`text-lg font-bold font-mono ${k.color}`}>{k.value}</p>
            {k.unit && <p className="text-[0.6rem] text-muted-foreground">{k.unit}</p>}
          </div>
        ))}
      </div>

      {/* ── Transport Alerts ─────────────────────────────────────────────── */}
      <div className="rounded-2xl border border-border/80 bg-card p-4 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-foreground flex items-center gap-2"><AlertTriangle className="size-4 text-amber-500" /> Transport Alerts</h2>
          <Badge variant="outline" className="text-[0.65rem] font-mono">{TRANSPORT_ALERTS.filter(a => a.type === "danger").length} Critical</Badge>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {TRANSPORT_ALERTS.map(alert => (
            <div key={alert.id} className={`flex items-start gap-2 p-2.5 rounded-xl border text-xs ${alertTypeColor(alert.type)}`}>
              <AlertCircle className="size-3.5 mt-0.5 shrink-0" />
              <div>
                <p className="font-bold">{alert.title}</p>
                <p className="opacity-80 text-[0.65rem]">{alert.detail}</p>
                <p className="opacity-60 text-[0.6rem] mt-0.5">{alert.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Tab Switcher ─────────────────────────────────────────────────── */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-muted/60 border border-border/80 flex-wrap">
        {[
          { key: "routes", label: `1. Fleet Overview & Route Analytics (${routes.length})` },
          { key: "passes", label: `2. Transport Pass Monitoring (${passes.length})` },
          { key: "health", label: "3. Fleet Health & Compliance" },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as typeof activeTab)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === tab.key ? "bg-card text-primary shadow-sm" : "text-muted-foreground"}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          TAB 1: FLEET OVERVIEW & ROUTE ANALYTICS
      ══════════════════════════════════════════════════════════════════════ */}
      {activeTab === "routes" && (
        <div className="space-y-4">
          {/* Fleet Summary Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { label: "Fleet Size",        value: totalVehicles,              color: "text-primary" },
              { label: "Routes Active",     value: routes.length,              color: "text-emerald-600" },
              { label: "Drivers",           value: STAFF_SUMMARY.filter(s => s.role === "Driver").length, color: "text-blue-600" },
              { label: "GPS Online",        value: gpsOnline,                  color: "text-violet-600" },
              { label: "Maintenance Due",   value: maintenanceDue,             color: "text-amber-600" },
              { label: "Avg Occupancy",     value: `${avgOccupancy}%`,         color: "text-teal-600" },
            ].map((c, i) => (
              <div key={i} className="p-3 rounded-xl bg-card border border-border/70 shadow-sm text-center space-y-1">
                <p className={`text-xl font-bold font-mono ${c.color}`}>{c.value}</p>
                <p className="text-[0.65rem] text-muted-foreground font-semibold uppercase">{c.label}</p>
              </div>
            ))}
          </div>

          {/* Search bar */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
              <Input placeholder="Search routes, buses, drivers…" value={search} onChange={e => setSearch(e.target.value)} className="pl-9 h-9 text-xs" />
            </div>
          </div>

          {/* Fleet Table */}
          <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-muted/40 border-b border-border text-muted-foreground font-semibold uppercase tracking-wider text-[0.68rem]">
                  <tr>
                    <th className="py-3 px-3">Route</th>
                    <th className="py-3 px-3">Vehicle</th>
                    <th className="py-3 px-3">Driver</th>
                    <th className="py-3 px-3">Capacity</th>
                    <th className="py-3 px-3">Occupancy %</th>
                    <th className="py-3 px-3">Distance</th>
                    <th className="py-3 px-3">Fuel Efficiency</th>
                    <th className="py-3 px-3">GPS Status</th>
                    <th className="py-3 px-3">Vehicle Health</th>
                    <th className="py-3 px-3">Maintenance Due</th>
                    <th className="py-3 px-3">Inspection</th>
                    <th className="py-3 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {filteredRoutes.map(r => (
                    <tr key={r.id} className="hover:bg-muted/20 transition-colors">
                      <td className="py-3 px-3">
                        <p className="font-mono font-bold text-primary">{r.routeNo}</p>
                        <p className="text-[0.65rem] text-muted-foreground leading-tight">{r.routeName}</p>
                      </td>
                      <td className="py-3 px-3 font-mono text-foreground font-semibold">{r.busRegNo}</td>
                      <td className="py-3 px-3 font-medium text-foreground">{r.driverName}</td>
                      <td className="py-3 px-3 font-mono font-bold">{r.capacity} Seats</td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 rounded-full bg-muted overflow-hidden">
                            <div className="h-full rounded-full bg-emerald-500" style={{ width: `${r.occupancy}%` }} />
                          </div>
                          <span className="font-mono font-bold text-foreground">{r.occupancy}%</span>
                        </div>
                      </td>
                      <td className="py-3 px-3 font-mono text-muted-foreground">{r.distance}</td>
                      <td className="py-3 px-3 font-mono text-foreground">{r.fuelEff}</td>
                      <td className="py-3 px-3">
                        <Badge className={r.gpsStatus === "Online" ? "bg-emerald-500/10 text-emerald-600 text-[0.65rem]" : "bg-red-500/10 text-red-600 text-[0.65rem]"}>
                          {r.gpsStatus}
                        </Badge>
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-1">
                          <span className="font-mono font-bold text-foreground">{r.healthScore}/100</span>
                          {healthBadge(r.healthScore)}
                        </div>
                      </td>
                      <td className="py-3 px-3 font-mono text-muted-foreground text-[0.65rem]">{r.maintenanceDue}</td>
                      <td className="py-3 px-3">
                        <Badge className={r.inspectionStatus === "Passed" ? "bg-emerald-500/10 text-emerald-600 text-[0.65rem]" : "bg-amber-500/10 text-amber-600 text-[0.65rem]"}>
                          {r.inspectionStatus}
                        </Badge>
                      </td>
                      <td className="py-3 px-3">
                        <Badge className="bg-emerald-500/10 text-emerald-600 text-[0.65rem]">{r.status}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Transport Analytics */}
          <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-foreground flex items-center gap-2"><BarChart3 className="size-4 text-primary" /> Transport Analytics</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { title: "Route Utilization",       value: `${avgOccupancy}%`,   sub: "Average across all routes",    trend: "up",   color: "text-emerald-600" },
                { title: "Peak Route",              value: "Route 2",            sub: "LB Nagar — 100% occupied",     trend: "up",   color: "text-blue-600" },
                { title: "Low Usage Route",         value: "Route 3",            sub: "84% occupancy this month",     trend: "down", color: "text-amber-600" },
                { title: "Monthly Fuel Cost",       value: "₹1.28 Lakh",        sub: "Aug 2026 estimate",            trend: "up",   color: "text-orange-600" },
                { title: "Monthly Maintenance",     value: "₹0.42 Lakh",        sub: "Aug 2026 estimate",            trend: "down", color: "text-teal-600" },
                { title: "Transport Revenue",       value: `₹${(passRevenue / 100000).toFixed(2)} L`, sub: "Active pass collections", trend: "up", color: "text-rose-600" },
                { title: "Student Usage",           value: `${passStudents} Students`, sub: "Active pass holders",   trend: "up",   color: "text-primary" },
                { title: "Faculty Usage",           value: `${passFaculty} Faculty`,   sub: "Active pass holders",   trend: "neutral", color: "text-violet-600" },
                { title: "Trips Completed",         value: "6 Today",            sub: "3 AM + 3 PM trips",            trend: "up",   color: "text-emerald-600" },
                { title: "Vehicle Downtime",        value: "1 Bus",              sub: "TS-09-UB-3341 — Maintenance",  trend: "down", color: "text-amber-600" },
                { title: "Avg Occupancy",           value: `${avgOccupancy}%`,   sub: "Fleet-wide average",           trend: "up",   color: "text-blue-600" },
                { title: "GPS Coverage",            value: `${gpsOnline}/${totalVehicles} Vehs`, sub: "Online GPS units", trend: gpsOnline === totalVehicles ? "up" : "down", color: "text-violet-600" },
              ].map((a, i) => (
                <div key={i} className="flex items-start justify-between p-3 rounded-xl border border-border/60 bg-muted/20">
                  <div>
                    <p className="text-[0.68rem] text-muted-foreground font-semibold uppercase">{a.title}</p>
                    <p className={`text-base font-bold font-mono ${a.color}`}>{a.value}</p>
                    <p className="text-[0.62rem] text-muted-foreground">{a.sub}</p>
                  </div>
                  {a.trend === "up"   && <TrendingUp   className="size-4 text-emerald-500 mt-1 shrink-0" />}
                  {a.trend === "down" && <TrendingDown  className="size-4 text-amber-500 mt-1 shrink-0" />}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          TAB 2: TRANSPORT PASS MONITORING
      ══════════════════════════════════════════════════════════════════════ */}
      {activeTab === "passes" && (
        <div className="space-y-4">
          {/* Pass Analytics Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {[
              { label: "Total Pass Holders", value: passes.length,   color: "text-primary" },
              { label: "Students",           value: passStudents,    color: "text-blue-600" },
              { label: "Faculty",            value: passFaculty,     color: "text-violet-600" },
              { label: "Expired Passes",     value: 0,               color: "text-red-600" },
              { label: "Renewal Due",        value: 2,               color: "text-amber-600" },
              { label: "Blocked Passes",     value: 0,               color: "text-red-600" },
              { label: "Pending Renewals",   value: passPending,     color: "text-orange-600" },
              { label: "Pass Revenue",       value: `₹${(passRevenue / 100000).toFixed(1)}L`, color: "text-emerald-600" },
            ].map((c, i) => (
              <div key={i} className="p-3 rounded-xl bg-card border border-border/70 shadow-sm text-center space-y-1">
                <p className={`text-xl font-bold font-mono ${c.color}`}>{c.value}</p>
                <p className="text-[0.6rem] text-muted-foreground font-semibold uppercase leading-tight">{c.label}</p>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2 flex-wrap">
            <Search className="size-3.5 text-muted-foreground" />
            <Select value={filterDept} onValueChange={setFilterDept}>
              <SelectTrigger className="h-8 text-xs w-32"><SelectValue placeholder="Department" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Depts</SelectItem>
                <SelectItem value="CSE">CSE</SelectItem>
                <SelectItem value="ECE">ECE</SelectItem>
                <SelectItem value="ME">ME</SelectItem>
                <SelectItem value="CE">CE</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterYear} onValueChange={setFilterYear}>
              <SelectTrigger className="h-8 text-xs w-28"><SelectValue placeholder="Year" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Years</SelectItem>
                <SelectItem value="1">Year 1</SelectItem>
                <SelectItem value="2">Year 2</SelectItem>
                <SelectItem value="3">Year 3</SelectItem>
                <SelectItem value="4">Year 4</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterRoute} onValueChange={setFilterRoute}>
              <SelectTrigger className="h-8 text-xs w-32"><SelectValue placeholder="Route" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Routes</SelectItem>
                {routes.map(r => <SelectItem key={r.id} value={r.routeNo}>{r.routeNo}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="h-8 text-xs w-32"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Paid">Paid</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Partial">Partial</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Pass Table */}
          <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-muted/40 border-b border-border text-muted-foreground font-semibold uppercase tracking-wider text-[0.68rem]">
                  <tr>
                    <th className="py-3 px-3">Pass ID</th>
                    <th className="py-3 px-3">Student Name</th>
                    <th className="py-3 px-3">Department</th>
                    <th className="py-3 px-3">Route &amp; Pickup Stop</th>
                    <th className="py-3 px-3">Annual Fee</th>
                    <th className="py-3 px-3">Payment Status</th>
                    <th className="py-3 px-3">Pass Type</th>
                    <th className="py-3 px-3">Validity</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {filteredPasses.map(p => (
                    <tr key={p.id} className="hover:bg-muted/20 transition-colors">
                      <td className="py-3 px-3 font-mono font-bold text-foreground">{p.passId}</td>
                      <td className="py-3 px-3 font-semibold text-foreground">{p.studentName} <span className="text-muted-foreground font-normal">({p.rollNo})</span></td>
                      <td className="py-3 px-3">{p.department}</td>
                      <td className="py-3 px-3 font-mono text-primary font-bold">{p.routeNo} · {p.pickupStop}</td>
                      <td className="py-3 px-3 font-mono font-bold text-foreground">₹{p.annualFee.toLocaleString()}</td>
                      <td className="py-3 px-3">
                        <Badge className={p.paymentStatus === "Paid" ? "bg-emerald-500/10 text-emerald-600 text-[0.65rem]" : "bg-amber-500/10 text-amber-600 text-[0.65rem]"}>
                          {p.paymentStatus}
                        </Badge>
                      </td>
                      <td className="py-3 px-3"><Badge variant="outline" className="text-[0.65rem]">Student</Badge></td>
                      <td className="py-3 px-3 font-mono text-muted-foreground text-[0.65rem]">AY 2026-27</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          TAB 3: FLEET HEALTH & COMPLIANCE
      ══════════════════════════════════════════════════════════════════════ */}
      {activeTab === "health" && (
        <div className="space-y-4">
          {/* Fleet Health Summary */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Avg Health Score",  value: `${Math.round(FLEET_HEALTH_DATA.reduce((s, v) => s + v.healthScore, 0) / FLEET_HEALTH_DATA.length)}/100`, color: "text-emerald-600" },
              { label: "GPS Online",        value: `${FLEET_HEALTH_DATA.filter(v => v.gpsStatus === "Online").length}/${FLEET_HEALTH_DATA.length}`,           color: "text-violet-600" },
              { label: "Compliance Issues", value: FLEET_HEALTH_DATA.filter(v => v.fireExtinguisher !== "OK" || v.emergencyKit !== "OK").length,               color: "text-amber-600" },
              { label: "Docs Expiring <30d",value: FLEET_HEALTH_DATA.filter(v => Math.ceil((new Date(v.insurance).getTime() - Date.now()) / 86400000) < 30).length, color: "text-red-600" },
            ].map((c, i) => (
              <div key={i} className="p-4 rounded-xl bg-card border border-border/70 shadow-sm space-y-1 text-center">
                <p className={`text-2xl font-bold font-mono ${c.color}`}>{c.value}</p>
                <p className="text-[0.65rem] text-muted-foreground font-semibold uppercase">{c.label}</p>
              </div>
            ))}
          </div>

          {/* Fleet Health Table */}
          <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-sm">
            <h2 className="text-sm font-bold text-foreground flex items-center gap-2 mb-4"><Shield className="size-4 text-primary" /> Vehicle Compliance Registry</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-muted/40 border-b border-border text-muted-foreground font-semibold uppercase tracking-wider text-[0.68rem]">
                  <tr>
                    <th className="py-3 px-3">Vehicle</th>
                    <th className="py-3 px-3">Model</th>
                    <th className="py-3 px-3">Health Score</th>
                    <th className="py-3 px-3">Insurance</th>
                    <th className="py-3 px-3">Permit</th>
                    <th className="py-3 px-3">Pollution Cert</th>
                    <th className="py-3 px-3">Fitness Cert</th>
                    <th className="py-3 px-3">Road Tax</th>
                    <th className="py-3 px-3">Maintenance</th>
                    <th className="py-3 px-3">GPS</th>
                    <th className="py-3 px-3">Emergency Kit</th>
                    <th className="py-3 px-3">Fire Ext.</th>
                    <th className="py-3 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {FLEET_HEALTH_DATA.map(v => (
                    <tr key={v.id} className="hover:bg-muted/20 transition-colors">
                      <td className="py-3 px-3 font-mono font-bold text-primary">{v.regNo}</td>
                      <td className="py-3 px-3 text-foreground font-medium">{v.model} <span className="text-muted-foreground">({v.year})</span></td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono font-bold text-foreground">{v.healthScore}</span>
                          {healthBadge(v.healthScore)}
                        </div>
                      </td>
                      <td className="py-3 px-3">{docBadge(v.insurance)} <span className="text-[0.6rem] text-muted-foreground ml-1">{v.insurance}</span></td>
                      <td className="py-3 px-3">{docBadge(v.permit)} <span className="text-[0.6rem] text-muted-foreground ml-1">{v.permit}</span></td>
                      <td className="py-3 px-3">{docBadge(v.pollution)}</td>
                      <td className="py-3 px-3">{docBadge(v.fitness)}</td>
                      <td className="py-3 px-3">{docBadge(v.roadTax)}</td>
                      <td className="py-3 px-3 font-mono text-muted-foreground text-[0.65rem]">{v.maintenance}</td>
                      <td className="py-3 px-3">
                        <Badge className={v.gpsStatus === "Online" ? "bg-emerald-500/10 text-emerald-600 text-[0.65rem]" : "bg-red-500/10 text-red-600 text-[0.65rem]"}>
                          {v.gpsStatus}
                        </Badge>
                      </td>
                      <td className="py-3 px-3">
                        <Badge className={v.emergencyKit === "OK" ? "bg-emerald-500/10 text-emerald-600 text-[0.65rem]" : "bg-red-500/10 text-red-600 text-[0.65rem]"}>
                          {v.emergencyKit}
                        </Badge>
                      </td>
                      <td className="py-3 px-3">
                        <Badge className={v.fireExtinguisher === "OK" ? "bg-emerald-500/10 text-emerald-600 text-[0.65rem]" : "bg-amber-500/10 text-amber-600 text-[0.65rem]"}>
                          {v.fireExtinguisher}
                        </Badge>
                      </td>
                      <td className="py-3 px-3">
                        <Badge className={v.status === "Active" ? "bg-emerald-500/10 text-emerald-600 text-[0.65rem]" : "bg-amber-500/10 text-amber-600 text-[0.65rem]"}>
                          {v.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── Recent Activities ─────────────────────────────────────────────── */}
      <div className="rounded-2xl border border-border/80 bg-card p-4 shadow-sm space-y-3">
        <h2 className="text-sm font-bold text-foreground flex items-center gap-2"><Activity className="size-4 text-primary" /> Recent Activities</h2>
        <div className="divide-y divide-border/40">
          {RECENT_ACTIVITIES.map(act => (
            <div key={act.id} className="flex items-start gap-3 py-2.5">
              <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-foreground">{act.action}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[0.62rem] text-muted-foreground">{act.date}</span>
                  <span className="text-[0.62rem] text-muted-foreground">·</span>
                  <span className="text-[0.62rem] text-muted-foreground font-semibold">{act.user}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Transport Staff Summary ───────────────────────────────────────── */}
      <div className="rounded-2xl border border-border/80 bg-card p-4 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-foreground flex items-center gap-2"><Users className="size-4 text-primary" /> Transport Staff Summary</h2>
          <div className="flex items-center gap-2">
            <Badge className="bg-emerald-500/10 text-emerald-600 text-[0.65rem]">
              {STAFF_SUMMARY.filter(s => s.status === "On Duty").length}/{STAFF_SUMMARY.length} On Duty
            </Badge>
            <Badge variant="outline" className="text-[0.65rem]">0 Pending Leave</Badge>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted/40 border-b border-border text-muted-foreground font-semibold uppercase tracking-wider text-[0.68rem]">
              <tr>
                <th className="py-2.5 px-3">Role</th>
                <th className="py-2.5 px-3">Name</th>
                <th className="py-2.5 px-3">Contact</th>
                <th className="py-2.5 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {STAFF_SUMMARY.map((s, i) => (
                <tr key={i} className="hover:bg-muted/20 transition-colors">
                  <td className="py-2.5 px-3 text-muted-foreground font-semibold">{s.role}</td>
                  <td className="py-2.5 px-3 font-medium text-foreground">{s.name}</td>
                  <td className="py-2.5 px-3 font-mono text-muted-foreground">{s.contact}</td>
                  <td className="py-2.5 px-3">{staffStatus(s.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Executive Quick Actions ──────────────────────────────────────── */}
      <div className="rounded-2xl border border-border/80 bg-card p-4 shadow-sm space-y-3">
        <h2 className="text-sm font-bold text-foreground flex items-center gap-2"><Sparkles className="size-4 text-primary" /> Executive Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {[
            { label: "Transport Configuration", icon: <Settings className="size-4" />,    action: () => setIsConfigOpen(true) },
            { label: "Fleet Reports",           icon: <BarChart3 className="size-4" />,   action: () => setIsReportOpen(true) },
            { label: "Download Transport Report", icon: <Download className="size-4" />,  action: handleExportCSV },
            { label: "Schedule Fleet Audit",    icon: <Calendar className="size-4" />,    action: () => toast.info("Fleet audit scheduling — contact Transport Manager") },
            { label: "Vehicle Compliance",      icon: <Shield className="size-4" />,      action: () => setActiveTab("health") },
            { label: "View Analytics",          icon: <TrendingUp className="size-4" />,  action: () => setActiveTab("routes") },
          ].map((qa, i) => (
            <button
              key={i}
              onClick={qa.action}
              className="flex items-center gap-2 p-3 rounded-xl border border-border/60 bg-muted/20 hover:bg-primary/5 hover:border-primary/30 transition-all text-xs font-semibold text-foreground group"
            >
              <span className="text-primary group-hover:scale-110 transition-transform">{qa.icon}</span>
              <span className="text-left leading-tight">{qa.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════
          MODAL: TRANSPORT CONFIGURATION — Dynamic Multi-Panel
      ═══════════════════════════════════════════════════════ */}
      <Dialog open={isConfigOpen} onOpenChange={(open) => { setIsConfigOpen(open); if (!open) setActivePanel(null); }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-base font-bold flex items-center gap-2">
              {activePanel ? (
                <button onClick={() => setActivePanel(null)} className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors text-sm font-medium">
                  <ChevronLeft className="size-4" />
                  <span className="text-xs">Back</span>
                </button>
              ) : (
                <Settings className="size-4 text-primary" />
              )}
              {activePanel ? (
                <span className="flex items-center gap-2">
                  {React.createElement(activePanel.icon, { className: "size-4 text-primary" })}
                  {activePanel.label}
                </span>
              ) : "Transport Configuration"}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              {activePanel ? activePanel.description : "Institutional transport policies, fee structures and system-wide transport settings."}
            </DialogDescription>
          </DialogHeader>

          {/* INDEX: list of all panels */}
          {!activePanel && (
            <div className="grid grid-cols-1 gap-1.5 pt-2 max-h-[400px] overflow-y-auto pr-1">
              {TRANSPORT_CONFIG_PANELS.map((panel) => (
                <button
                  key={panel.id}
                  onClick={() => setActivePanel(panel)}
                  className="flex items-center gap-3 px-4 py-2.5 rounded-xl border border-border/60 bg-muted/20 hover:bg-primary/5 hover:border-primary/30 transition-all text-xs font-medium text-foreground text-left group"
                >
                  {React.createElement(panel.icon, { className: "size-4 text-primary shrink-0" })}
                  <span className="flex-1">{panel.label}</span>
                  <ChevronRight className="size-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
                </button>
              ))}
            </div>
          )}

          {/* PANEL: individual settings form */}
          {activePanel && (
            <div className="space-y-3 pt-2 max-h-[400px] overflow-y-auto pr-1">
              {activePanel.fields.map((field) => {
                const stateKey = `${activePanel.id}__${field.key}`;
                const value = configData[stateKey] ?? "";
                return (
                  <div key={field.key} className="space-y-1">
                    <Label className="text-xs font-semibold text-foreground">{field.label}</Label>
                    {field.description && <p className="text-[0.62rem] text-muted-foreground">{field.description}</p>}

                    {field.type === "text" && (
                      <input
                        type="text"
                        value={value}
                        placeholder={field.placeholder}
                        onChange={e => setConfigData(prev => ({ ...prev, [stateKey]: e.target.value }))}
                        className="w-full h-9 rounded-lg border border-border bg-muted/30 px-3 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all"
                      />
                    )}

                    {field.type === "number" && (
                      <input
                        type="number"
                        value={value}
                        placeholder={field.placeholder}
                        onChange={e => setConfigData(prev => ({ ...prev, [stateKey]: e.target.value }))}
                        className="w-full h-9 rounded-lg border border-border bg-muted/30 px-3 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all"
                      />
                    )}

                    {field.type === "time" && (
                      <input
                        type="time"
                        value={value}
                        onChange={e => setConfigData(prev => ({ ...prev, [stateKey]: e.target.value }))}
                        className="w-full h-9 rounded-lg border border-border bg-muted/30 px-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all"
                      />
                    )}

                    {field.type === "textarea" && (
                      <textarea
                        value={value}
                        placeholder={field.placeholder}
                        rows={3}
                        onChange={e => setConfigData(prev => ({ ...prev, [stateKey]: e.target.value }))}
                        className="w-full rounded-lg border border-border bg-muted/30 px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all resize-none"
                      />
                    )}

                    {field.type === "select" && (
                      <Select
                        value={value}
                        onValueChange={val => setConfigData(prev => ({ ...prev, [stateKey]: val }))}
                      >
                        <SelectTrigger className="h-9 text-xs">
                          <SelectValue placeholder="Select…" />
                        </SelectTrigger>
                        <SelectContent>
                          {field.options?.map(opt => (
                            <SelectItem key={opt} value={opt} className="text-xs">{opt}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}

                    {field.type === "toggle" && (
                      <button
                        type="button"
                        onClick={() => setConfigData(prev => ({ ...prev, [stateKey]: prev[stateKey] === "true" ? "false" : "true" }))}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                          value === "true" ? "bg-primary" : "bg-muted-foreground/30"
                        }`}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                          value === "true" ? "translate-x-6" : "translate-x-1"
                        }`} />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          <DialogFooter className="pt-3 gap-2">
            {activePanel && (
              <Button
                onClick={() => { toast.success(`${activePanel.label} saved successfully!`); setActivePanel(null); }}
                className="bg-brand-gradient text-white text-xs font-semibold"
              >
                Save Changes
              </Button>
            )}
            <Button variant="outline" onClick={() => { setIsConfigOpen(false); setActivePanel(null); }} className="text-xs">Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ═══════════════════════════════════════════════════════
          MODAL: FLEET REPORTS
      ═══════════════════════════════════════════════════════ */}
      <Dialog open={isReportOpen} onOpenChange={setIsReportOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold flex items-center gap-2">
              <BarChart3 className="size-4 text-primary" /> Fleet Reports
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Generate and export institutional transport reports.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 pt-2">
            {REPORT_ITEMS.map((item, i) => (
              <button
                key={i}
                onClick={() => toast.success(`Generating: ${item}…`)}
                className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl border border-border/60 bg-muted/20 hover:bg-primary/5 hover:border-primary/30 transition-all text-xs font-medium text-foreground group"
              >
                <span>{item}</span>
                <Download className="size-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
              </button>
            ))}
          </div>
          <div className="flex gap-2 pt-2">
            <Button
              className="flex-1 bg-brand-gradient text-white text-xs font-semibold"
              onClick={() => { toast.success("Exporting all reports as PDF…"); setIsReportOpen(false); }}
            >
              <FileText className="size-3.5 mr-1.5" /> Export PDF
            </Button>
            <Button
              variant="outline"
              className="flex-1 text-xs font-semibold border-primary/30 text-primary"
              onClick={() => { handleExportCSV(); setIsReportOpen(false); }}
            >
              <Download className="size-3.5 mr-1.5" /> Export Excel
            </Button>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsReportOpen(false)} className="text-xs">Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export const TransportVerificationView = TransportModuleView;
export const TransportDashboardView = TransportModuleView;
export const TransportNotificationsView = TransportModuleView;
export const TransportSettingsView = TransportModuleView;
export const TransportFeesManagementView = TransportModuleView;
