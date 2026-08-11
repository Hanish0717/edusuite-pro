// ============================================================
// Classroom & Laboratory Resource Management — Mock Data
// ============================================================

export type RoomType = "Lecture Hall" | "Smart Classroom" | "Seminar Hall" | "Conference Room" | "Tutorial Room";
export type RoomStatus = "Available" | "Occupied" | "Reserved" | "Maintenance" | "Inactive";
export type LabType =
  | "Computer Lab"
  | "Electronics Lab"
  | "Mechanical Lab"
  | "Civil Lab"
  | "Physics Lab"
  | "Chemistry Lab"
  | "AI & ML Lab"
  | "IoT Lab"
  | "Robotics Lab"
  | "Research Lab";

export interface Classroom {
  id: string;
  roomNumber: string;
  building: string;
  floor: string;
  capacity: number;
  roomType: RoomType;
  status: RoomStatus;
  todaySchedule: string[];
  maintenanceStatus: "Normal" | "Pending Maintenance" | "Under Repair";
  facilities: string[];
}

export interface Laboratory {
  id: string;
  labName: string;
  department: string;
  building: string;
  floor: string;
  capacity: number;
  equipmentCount: number;
  labType: LabType;
  status: RoomStatus;
  todaySchedule: string[];
  maintenanceStatus: "Normal" | "Pending Maintenance" | "Under Repair";
  facilities: string[];
}

export interface Equipment {
  id: string;
  equipmentName: string;
  quantity: number;
  working: number;
  repair: number;
  department: string;
  laboratory: string;
  lastInspection: string;
  nextInspection: string;
}

export interface MaintenanceTicket {
  id: string;
  resource: string;
  issue: string;
  reportedBy: string;
  reportedDate: string;
  priority: "Low" | "Medium" | "High" | "Critical";
  status: "Open" | "In Progress" | "Completed";
  assignedTechnician: string;
  expectedCompletion: string;
}

export interface ResourceNotification {
  id: string;
  message: string;
  time: string;
  type: "info" | "warning" | "error";
}

// ── 1. CLASSROOMS ────────────────────────────────────────────
export const MOCK_CLASSROOMS: Classroom[] = [
  {
    id: "CLR-101",
    roomNumber: "LH-101",
    building: "Academic Block A",
    floor: "1st Floor",
    capacity: 120,
    roomType: "Lecture Hall",
    status: "Occupied",
    todaySchedule: ["09:00 - 11:00 (CS501 - Dr. Sai Teja)", "11:30 - 01:30 (EC304 - Dr. Meera)"],
    maintenanceStatus: "Normal",
    facilities: ["Interactive Smartboard", "Dual HD Projectors", "Acoustic Audio", "AC"],
  },
  {
    id: "CLR-102",
    roomNumber: "CR-204",
    building: "Academic Block A",
    floor: "2nd Floor",
    capacity: 60,
    roomType: "Smart Classroom",
    status: "Available",
    todaySchedule: ["14:00 - 16:00 (AI401 - Dr. Gupta)"],
    maintenanceStatus: "Normal",
    facilities: ["Interactive Display", "Wi-Fi Access", "AC"],
  },
  {
    id: "CLR-103",
    roomNumber: "SH-301",
    building: "Central Administrative Block",
    floor: "3rd Floor",
    capacity: 250,
    roomType: "Seminar Hall",
    status: "Reserved",
    todaySchedule: ["10:00 - 04:00 (Annual Tech Symposium)"],
    maintenanceStatus: "Normal",
    facilities: ["Podium System", "Dolby Surround Sound", "Video Conferencing", "AC"],
  },
  {
    id: "CLR-104",
    roomNumber: "TR-108",
    building: "Academic Block B",
    floor: "1st Floor",
    capacity: 40,
    roomType: "Tutorial Room",
    status: "Maintenance",
    todaySchedule: [],
    maintenanceStatus: "Under Repair",
    facilities: ["Whiteboard", "Projector"],
  },
  {
    id: "CLR-105",
    roomNumber: "CONF-502",
    building: "Central Administrative Block",
    floor: "5th Floor",
    capacity: 35,
    roomType: "Conference Room",
    status: "Available",
    todaySchedule: ["15:30 - 17:00 (Academic Council Meeting)"],
    maintenanceStatus: "Normal",
    facilities: ["Smart Screen", "Conf Mic Array", "Executive Seating", "AC"],
  },
];

// ── 2. LABORATORIES ──────────────────────────────────────────
export const MOCK_LABORATORIES: Laboratory[] = [
  {
    id: "LAB-201",
    labName: "Advanced AI & Cloud Computing Lab",
    department: "CSE",
    building: "Tech Block C",
    floor: "2nd Floor",
    capacity: 60,
    equipmentCount: 65,
    labType: "AI & ML Lab",
    status: "Occupied",
    todaySchedule: ["09:00 - 01:00 (Cloud Systems Lab - CSE-A)", "02:00 - 05:00 (AI Models Workshop)"],
    maintenanceStatus: "Normal",
    facilities: ["NVIDIA RTX GPUs", "Gigabit LAN", "Central UPS", "AC"],
  },
  {
    id: "LAB-202",
    labName: "VLSI & Embedded Systems Laboratory",
    department: "ECE",
    building: "Tech Block C",
    floor: "1st Floor",
    capacity: 45,
    equipmentCount: 50,
    labType: "Electronics Lab",
    status: "Available",
    todaySchedule: ["11:00 - 01:00 (Embedded Systems Practical)"],
    maintenanceStatus: "Normal",
    facilities: ["Digital Oscilloscopes", "FPGA Kits", "Logic Analyzers"],
  },
  {
    id: "LAB-203",
    labName: "Robotics & Automation Center",
    department: "ME",
    building: "Engineering Workshop Block",
    floor: "Ground Floor",
    capacity: 40,
    equipmentCount: 28,
    labType: "Robotics Lab",
    status: "Available",
    todaySchedule: ["02:00 - 04:00 (Robotics Design Lab)"],
    maintenanceStatus: "Normal",
    facilities: ["Robotic Arms", "Pneumatic Trainers", "3D Printers"],
  },
  {
    id: "LAB-204",
    labName: "IoT & Smart Systems Lab",
    department: "AI&DS",
    building: "Tech Block C",
    floor: "3rd Floor",
    capacity: 50,
    equipmentCount: 55,
    labType: "IoT Lab",
    status: "Maintenance",
    todaySchedule: [],
    maintenanceStatus: "Pending Maintenance",
    facilities: ["Raspberry Pi 4 Kits", "Arduino Stations", "Sensor Modules"],
  },
];

// ── 3. LAB EQUIPMENT ─────────────────────────────────────────
export const MOCK_EQUIPMENT: Equipment[] = [
  { id: "EQ-101", equipmentName: "Dell Precision Workstations (RTX 4080)", quantity: 60, working: 58, repair: 2, department: "CSE", laboratory: "Advanced AI Lab", lastInspection: "2026-07-20", nextInspection: "2026-08-20" },
  { id: "EQ-102", equipmentName: "Tektronix Digital Storage Oscilloscopes", quantity: 25, working: 24, repair: 1, department: "ECE", laboratory: "VLSI Lab", lastInspection: "2026-07-15", nextInspection: "2026-08-15" },
  { id: "EQ-103", equipmentName: "KUKA 6-Axis Industrial Robotic Arm", quantity: 4, working: 4, repair: 0, department: "ME", laboratory: "Robotics Center", lastInspection: "2026-07-25", nextInspection: "2026-08-25" },
  { id: "EQ-104", equipmentName: "Ultimaker S5 Industrial 3D Printer", quantity: 6, working: 5, repair: 1, department: "ME", laboratory: "Robotics Center", lastInspection: "2026-07-10", nextInspection: "2026-08-10" },
];

// ── 4. MAINTENANCE TICKETS ───────────────────────────────────
export const MOCK_MAINTENANCE_TICKETS: MaintenanceTicket[] = [
  { id: "MNT-501", resource: "Tutorial Room TR-108", issue: "HVAC cooling unit leak & projector lamp replacement", reportedBy: "Dr. S. Rajan", reportedDate: "2026-08-02", priority: "High", status: "In Progress", assignedTechnician: "Rajesh Kumar (HVAC Team)", expectedCompletion: "2026-08-06" },
  { id: "MNT-502", resource: "IoT Lab (Tech Block C)", issue: "Main switchgear breaker tripping under heavy load", reportedBy: "Dr. S. K. Gupta", reportedDate: "2026-08-03", priority: "Critical", status: "Open", assignedTechnician: "Suresh Reddy (Electrical Dept)", expectedCompletion: "2026-08-05" },
  { id: "MNT-503", resource: "Lecture Hall LH-101", issue: "Wireless microphone frequency interference", reportedBy: "Dr. K. Sai Teja", reportedDate: "2026-08-01", priority: "Low", status: "Completed", assignedTechnician: "AV Support Team", expectedCompletion: "2026-08-02" },
];

// ── 5. NOTIFICATIONS ──────────────────────────────────────────
export const MOCK_RESOURCE_NOTIFICATIONS: ResourceNotification[] = [
  { id: "n1", message: "Maintenance scheduled for Tutorial Room TR-108 on Aug 5.", time: "20 mins ago", type: "warning" },
  { id: "n2", message: "Lecture Hall LH-101 allocated for CS501 examination.", time: "1 hour ago", type: "info" },
  { id: "n3", message: "Allocation conflict detected for Tech Block C Lab 2.", time: "3 hours ago", type: "error" },
  { id: "n4", message: "Quarterly equipment inspection due for Advanced AI Lab.", time: "Yesterday", type: "info" },
];

// ── 6. ANALYTICS DATASETS ─────────────────────────────────────
export const ROOM_UTILIZATION_CHART = [
  { name: "LH-101", Utilization: 88 },
  { name: "CR-204", Utilization: 74 },
  { name: "SH-301", Utilization: 82 },
  { name: "TR-108", Utilization: 45 },
  { name: "CONF-502", Utilization: 68 },
];

export const LAB_UTILIZATION_CHART = [
  { name: "AI & ML Lab", Utilization: 92 },
  { name: "VLSI Lab", Utilization: 84 },
  { name: "Robotics Lab", Utilization: 78 },
  { name: "IoT Lab", Utilization: 60 },
];

export const BUILDING_USAGE_CHART = [
  { name: "Block A", value: 86 },
  { name: "Block B", value: 75 },
  { name: "Tech Block C", value: 90 },
  { name: "Admin Block", value: 70 },
];
