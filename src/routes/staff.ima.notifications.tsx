import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { Bell, Send, Inbox, ShieldCheck, Plus, CheckCircle2, Search, Paperclip, Filter, Trash2, Eye, MailCheck } from "lucide-react";
import { Panel } from "@/components/dashboard/panel";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

export const Route = createFileRoute("/staff/ima/notifications")({
  head: () => ({ meta: [{ title: "Notifications System — IMA Dean" }] }),
  component: NotificationsPage,
});

function NotificationsPage() {
  const [tab, setTab] = useState<"received" | "sent">("received");
  const [showCompose, setShowCompose] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);
  const [search, setSearch] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("all");

  const [receivedMsgs, setReceivedMsgs] = useState([
  {
    "id": "MSG-R01",
    "subject": "Laboratory Equipment Annual Maintenance Request (Ref #700)",
    "message": "Official Infrastructure, Machinery & Assets (IMA) notification regarding lab equipment maintenance, asset procurement, and campus physical infrastructure.",
    "sender": "Central Computer Center Lab Incharge",
    "receiver": "IMA Dean Office",
    "date": "2026-08-06 10:15 AM",
    "priority": "High",
    "status": "Unread",
    "category": "Equipment Maintenance",
    "attachment": "IMA_Asset_Report_1.pdf"
  },
  {
    "id": "MSG-R02",
    "subject": "Computer Science Lab 4 Server Maintenance Completion (Ref #701)",
    "message": "Official Infrastructure, Machinery & Assets (IMA) notification regarding lab equipment maintenance, asset procurement, and campus physical infrastructure.",
    "sender": "Mechanical Workshop Superintendent",
    "receiver": "IMA Dean Office",
    "date": "2026-08-05 10:15 AM",
    "priority": "Medium",
    "status": "Read",
    "category": "Lab Inspection"
  },
  {
    "id": "MSG-R03",
    "subject": "Asset Purchase Requisition Approval Submission (Ref #702)",
    "message": "Official Infrastructure, Machinery & Assets (IMA) notification regarding lab equipment maintenance, asset procurement, and campus physical infrastructure.",
    "sender": "Campus Estate Officer",
    "receiver": "IMA Dean Office",
    "date": "2026-08-04 10:15 AM",
    "priority": "Medium",
    "status": "Read",
    "category": "Asset Purchase",
    "attachment": "IMA_Asset_Report_3.pdf"
  },
  {
    "id": "MSG-R04",
    "subject": "HVAC & Electrical Substation Preventative Inspection Report (Ref #703)",
    "message": "Official Infrastructure, Machinery & Assets (IMA) notification regarding lab equipment maintenance, asset procurement, and campus physical infrastructure.",
    "sender": "Electrical Engineering Head",
    "receiver": "IMA Dean Office",
    "date": "2026-08-03 10:15 AM",
    "priority": "High",
    "status": "Read",
    "category": "Infrastructure"
  },
  {
    "id": "MSG-R05",
    "subject": "Laboratory Safety & Chemical Fire Audit Certification (Ref #704)",
    "message": "Official Infrastructure, Machinery & Assets (IMA) notification regarding lab equipment maintenance, asset procurement, and campus physical infrastructure.",
    "sender": "Civil Infrastructure Manager",
    "receiver": "IMA Dean Office",
    "date": "2026-08-02 10:15 AM",
    "priority": "Medium",
    "status": "Unread",
    "category": "Inventory",
    "attachment": "IMA_Asset_Report_5.pdf"
  },
  {
    "id": "MSG-R06",
    "subject": "Infrastructure Classroom Modernization Work Completion (Ref #705)",
    "message": "Official Infrastructure, Machinery & Assets (IMA) notification regarding lab equipment maintenance, asset procurement, and campus physical infrastructure.",
    "sender": "Dr. Mahesh Gupta (HOD ME)",
    "receiver": "IMA Dean Office",
    "date": "2026-08-01 10:15 AM",
    "priority": "Medium",
    "status": "Read",
    "category": "Equipment Maintenance"
  },
  {
    "id": "MSG-R07",
    "subject": "Inventory Consumables Reorder Sanction Request (Ref #706)",
    "message": "Official Infrastructure, Machinery & Assets (IMA) notification regarding lab equipment maintenance, asset procurement, and campus physical infrastructure.",
    "sender": "Safety Inspection Officer",
    "receiver": "IMA Dean Office",
    "date": "2026-08-06 10:15 AM",
    "priority": "High",
    "status": "Read",
    "category": "Lab Inspection",
    "attachment": "IMA_Asset_Report_7.pdf"
  },
  {
    "id": "MSG-R08",
    "subject": "Vendor Maintenance SLA Compliance Evaluation (Ref #707)",
    "message": "Official Infrastructure, Machinery & Assets (IMA) notification regarding lab equipment maintenance, asset procurement, and campus physical infrastructure.",
    "sender": "Vendor Procurement Cell",
    "receiver": "IMA Dean Office",
    "date": "2026-08-05 10:15 AM",
    "priority": "Medium",
    "status": "Read",
    "category": "Asset Purchase"
  },
  {
    "id": "MSG-R09",
    "subject": "Laboratory Equipment Annual Maintenance Request (Ref #708)",
    "message": "Official Infrastructure, Machinery & Assets (IMA) notification regarding lab equipment maintenance, asset procurement, and campus physical infrastructure.",
    "sender": "Central Computer Center Lab Incharge",
    "receiver": "IMA Dean Office",
    "date": "2026-08-04 10:15 AM",
    "priority": "Medium",
    "status": "Unread",
    "category": "Infrastructure",
    "attachment": "IMA_Asset_Report_9.pdf"
  },
  {
    "id": "MSG-R10",
    "subject": "Computer Science Lab 4 Server Maintenance Completion (Ref #709)",
    "message": "Official Infrastructure, Machinery & Assets (IMA) notification regarding lab equipment maintenance, asset procurement, and campus physical infrastructure.",
    "sender": "Mechanical Workshop Superintendent",
    "receiver": "IMA Dean Office",
    "date": "2026-08-03 10:15 AM",
    "priority": "High",
    "status": "Read",
    "category": "Inventory"
  },
  {
    "id": "MSG-R11",
    "subject": "Asset Purchase Requisition Approval Submission (Ref #710)",
    "message": "Official Infrastructure, Machinery & Assets (IMA) notification regarding lab equipment maintenance, asset procurement, and campus physical infrastructure.",
    "sender": "Campus Estate Officer",
    "receiver": "IMA Dean Office",
    "date": "2026-08-02 10:15 AM",
    "priority": "Medium",
    "status": "Read",
    "category": "Equipment Maintenance",
    "attachment": "IMA_Asset_Report_11.pdf"
  },
  {
    "id": "MSG-R12",
    "subject": "HVAC & Electrical Substation Preventative Inspection Report (Ref #711)",
    "message": "Official Infrastructure, Machinery & Assets (IMA) notification regarding lab equipment maintenance, asset procurement, and campus physical infrastructure.",
    "sender": "Electrical Engineering Head",
    "receiver": "IMA Dean Office",
    "date": "2026-08-01 10:15 AM",
    "priority": "Medium",
    "status": "Read",
    "category": "Lab Inspection"
  },
  {
    "id": "MSG-R13",
    "subject": "Laboratory Safety & Chemical Fire Audit Certification (Ref #712)",
    "message": "Official Infrastructure, Machinery & Assets (IMA) notification regarding lab equipment maintenance, asset procurement, and campus physical infrastructure.",
    "sender": "Civil Infrastructure Manager",
    "receiver": "IMA Dean Office",
    "date": "2026-08-06 10:15 AM",
    "priority": "High",
    "status": "Unread",
    "category": "Asset Purchase",
    "attachment": "IMA_Asset_Report_13.pdf"
  },
  {
    "id": "MSG-R14",
    "subject": "Infrastructure Classroom Modernization Work Completion (Ref #713)",
    "message": "Official Infrastructure, Machinery & Assets (IMA) notification regarding lab equipment maintenance, asset procurement, and campus physical infrastructure.",
    "sender": "Dr. Mahesh Gupta (HOD ME)",
    "receiver": "IMA Dean Office",
    "date": "2026-08-05 10:15 AM",
    "priority": "Medium",
    "status": "Read",
    "category": "Infrastructure"
  },
  {
    "id": "MSG-R15",
    "subject": "Inventory Consumables Reorder Sanction Request (Ref #714)",
    "message": "Official Infrastructure, Machinery & Assets (IMA) notification regarding lab equipment maintenance, asset procurement, and campus physical infrastructure.",
    "sender": "Safety Inspection Officer",
    "receiver": "IMA Dean Office",
    "date": "2026-08-04 10:15 AM",
    "priority": "Medium",
    "status": "Read",
    "category": "Inventory",
    "attachment": "IMA_Asset_Report_15.pdf"
  },
  {
    "id": "MSG-R16",
    "subject": "Vendor Maintenance SLA Compliance Evaluation (Ref #715)",
    "message": "Official Infrastructure, Machinery & Assets (IMA) notification regarding lab equipment maintenance, asset procurement, and campus physical infrastructure.",
    "sender": "Vendor Procurement Cell",
    "receiver": "IMA Dean Office",
    "date": "2026-08-03 10:15 AM",
    "priority": "High",
    "status": "Read",
    "category": "Equipment Maintenance"
  },
  {
    "id": "MSG-R17",
    "subject": "Laboratory Equipment Annual Maintenance Request (Ref #716)",
    "message": "Official Infrastructure, Machinery & Assets (IMA) notification regarding lab equipment maintenance, asset procurement, and campus physical infrastructure.",
    "sender": "Central Computer Center Lab Incharge",
    "receiver": "IMA Dean Office",
    "date": "2026-08-02 10:15 AM",
    "priority": "Medium",
    "status": "Unread",
    "category": "Lab Inspection",
    "attachment": "IMA_Asset_Report_17.pdf"
  },
  {
    "id": "MSG-R18",
    "subject": "Computer Science Lab 4 Server Maintenance Completion (Ref #717)",
    "message": "Official Infrastructure, Machinery & Assets (IMA) notification regarding lab equipment maintenance, asset procurement, and campus physical infrastructure.",
    "sender": "Mechanical Workshop Superintendent",
    "receiver": "IMA Dean Office",
    "date": "2026-08-01 10:15 AM",
    "priority": "Medium",
    "status": "Read",
    "category": "Asset Purchase"
  },
  {
    "id": "MSG-R19",
    "subject": "Asset Purchase Requisition Approval Submission (Ref #718)",
    "message": "Official Infrastructure, Machinery & Assets (IMA) notification regarding lab equipment maintenance, asset procurement, and campus physical infrastructure.",
    "sender": "Campus Estate Officer",
    "receiver": "IMA Dean Office",
    "date": "2026-08-06 10:15 AM",
    "priority": "High",
    "status": "Read",
    "category": "Infrastructure",
    "attachment": "IMA_Asset_Report_19.pdf"
  },
  {
    "id": "MSG-R20",
    "subject": "HVAC & Electrical Substation Preventative Inspection Report (Ref #719)",
    "message": "Official Infrastructure, Machinery & Assets (IMA) notification regarding lab equipment maintenance, asset procurement, and campus physical infrastructure.",
    "sender": "Electrical Engineering Head",
    "receiver": "IMA Dean Office",
    "date": "2026-08-05 10:15 AM",
    "priority": "Medium",
    "status": "Read",
    "category": "Inventory"
  },
  {
    "id": "MSG-R21",
    "subject": "Laboratory Safety & Chemical Fire Audit Certification (Ref #720)",
    "message": "Official Infrastructure, Machinery & Assets (IMA) notification regarding lab equipment maintenance, asset procurement, and campus physical infrastructure.",
    "sender": "Civil Infrastructure Manager",
    "receiver": "IMA Dean Office",
    "date": "2026-08-04 10:15 AM",
    "priority": "Medium",
    "status": "Unread",
    "category": "Equipment Maintenance",
    "attachment": "IMA_Asset_Report_21.pdf"
  },
  {
    "id": "MSG-R22",
    "subject": "Infrastructure Classroom Modernization Work Completion (Ref #721)",
    "message": "Official Infrastructure, Machinery & Assets (IMA) notification regarding lab equipment maintenance, asset procurement, and campus physical infrastructure.",
    "sender": "Dr. Mahesh Gupta (HOD ME)",
    "receiver": "IMA Dean Office",
    "date": "2026-08-03 10:15 AM",
    "priority": "High",
    "status": "Read",
    "category": "Lab Inspection"
  },
  {
    "id": "MSG-R23",
    "subject": "Inventory Consumables Reorder Sanction Request (Ref #722)",
    "message": "Official Infrastructure, Machinery & Assets (IMA) notification regarding lab equipment maintenance, asset procurement, and campus physical infrastructure.",
    "sender": "Safety Inspection Officer",
    "receiver": "IMA Dean Office",
    "date": "2026-08-02 10:15 AM",
    "priority": "Medium",
    "status": "Read",
    "category": "Asset Purchase",
    "attachment": "IMA_Asset_Report_23.pdf"
  },
  {
    "id": "MSG-R24",
    "subject": "Vendor Maintenance SLA Compliance Evaluation (Ref #723)",
    "message": "Official Infrastructure, Machinery & Assets (IMA) notification regarding lab equipment maintenance, asset procurement, and campus physical infrastructure.",
    "sender": "Vendor Procurement Cell",
    "receiver": "IMA Dean Office",
    "date": "2026-08-01 10:15 AM",
    "priority": "Medium",
    "status": "Read",
    "category": "Infrastructure"
  },
  {
    "id": "MSG-R25",
    "subject": "Laboratory Equipment Annual Maintenance Request (Ref #724)",
    "message": "Official Infrastructure, Machinery & Assets (IMA) notification regarding lab equipment maintenance, asset procurement, and campus physical infrastructure.",
    "sender": "Central Computer Center Lab Incharge",
    "receiver": "IMA Dean Office",
    "date": "2026-08-06 10:15 AM",
    "priority": "High",
    "status": "Unread",
    "category": "Inventory",
    "attachment": "IMA_Asset_Report_25.pdf"
  }
]);
  const [sentMsgs, setSentMsgs] = useState([
  {
    "id": "MSG-S01",
    "subject": "Annual Equipment Calibration & Preventive Maintenance Schedule (Notice #800)",
    "message": "Official IMA Dean broadcast notification issued to all laboratory incharges, department HODs, and estate maintenance managers.",
    "sender": "IMA Dean Office",
    "receiver": "All Department Lab Incharges",
    "date": "2026-08-06 05:00 PM",
    "priority": "High",
    "status": "Delivered",
    "category": "Maintenance Directive",
    "attachment": "IMA_Notice_1.pdf"
  },
  {
    "id": "MSG-S02",
    "subject": "Lab Booking Master Schedule & Capacity Utilization Release (Notice #801)",
    "message": "Official IMA Dean broadcast notification issued to all laboratory incharges, department HODs, and estate maintenance managers.",
    "sender": "IMA Dean Office",
    "receiver": "Campus Estate Engineer",
    "date": "2026-08-05 05:00 PM",
    "priority": "Medium",
    "status": "Delivered",
    "category": "Lab Allocation",
    "attachment": "IMA_Notice_2.pdf"
  },
  {
    "id": "MSG-S03",
    "subject": "Asset Requisition Approval Sanction Notice (Notice #802)",
    "message": "Official IMA Dean broadcast notification issued to all laboratory incharges, department HODs, and estate maintenance managers.",
    "sender": "IMA Dean Office",
    "receiver": "Department HODs",
    "date": "2026-08-04 05:00 PM",
    "priority": "Medium",
    "status": "Delivered",
    "category": "Asset Approval",
    "attachment": "IMA_Notice_3.pdf"
  },
  {
    "id": "MSG-S04",
    "subject": "Infrastructure Maintenance Downtime Advisory for Block B (Notice #803)",
    "message": "Official IMA Dean broadcast notification issued to all laboratory incharges, department HODs, and estate maintenance managers.",
    "sender": "IMA Dean Office",
    "receiver": "Finance Dean Office",
    "date": "2026-08-03 05:00 PM",
    "priority": "High",
    "status": "Delivered",
    "category": "Downtime Advisory",
    "attachment": "IMA_Notice_4.pdf"
  },
  {
    "id": "MSG-S05",
    "subject": "Safety Protocol & Fire Extinguisher Inspection Directive (Notice #804)",
    "message": "Official IMA Dean broadcast notification issued to all laboratory incharges, department HODs, and estate maintenance managers.",
    "sender": "IMA Dean Office",
    "receiver": "Vendor Technical Leads",
    "date": "2026-08-02 05:00 PM",
    "priority": "Medium",
    "status": "Delivered",
    "category": "AMC Release",
    "attachment": "IMA_Notice_5.pdf"
  },
  {
    "id": "MSG-S06",
    "subject": "Vendor AMC Renewal & Payment Clearance Release (Notice #805)",
    "message": "Official IMA Dean broadcast notification issued to all laboratory incharges, department HODs, and estate maintenance managers.",
    "sender": "IMA Dean Office",
    "receiver": "Safety Officers",
    "date": "2026-08-01 05:00 PM",
    "priority": "Medium",
    "status": "Delivered",
    "category": "Maintenance Directive",
    "attachment": "IMA_Notice_6.pdf"
  },
  {
    "id": "MSG-S07",
    "subject": "Laboratory Inventory Disposal & E-Waste Clearance Notice (Notice #806)",
    "message": "Official IMA Dean broadcast notification issued to all laboratory incharges, department HODs, and estate maintenance managers.",
    "sender": "IMA Dean Office",
    "receiver": "Central Stores Manager",
    "date": "2026-08-06 05:00 PM",
    "priority": "High",
    "status": "Delivered",
    "category": "Lab Allocation",
    "attachment": "IMA_Notice_7.pdf"
  },
  {
    "id": "MSG-S08",
    "subject": "Campus Power Generator & UPS Backup Maintenance Schedule (Notice #807)",
    "message": "Official IMA Dean broadcast notification issued to all laboratory incharges, department HODs, and estate maintenance managers.",
    "sender": "IMA Dean Office",
    "receiver": "Academic Block Administrators",
    "date": "2026-08-05 05:00 PM",
    "priority": "Medium",
    "status": "Delivered",
    "category": "Asset Approval",
    "attachment": "IMA_Notice_8.pdf"
  },
  {
    "id": "MSG-S09",
    "subject": "Annual Equipment Calibration & Preventive Maintenance Schedule (Notice #808)",
    "message": "Official IMA Dean broadcast notification issued to all laboratory incharges, department HODs, and estate maintenance managers.",
    "sender": "IMA Dean Office",
    "receiver": "All Department Lab Incharges",
    "date": "2026-08-04 05:00 PM",
    "priority": "Medium",
    "status": "Delivered",
    "category": "Downtime Advisory",
    "attachment": "IMA_Notice_9.pdf"
  },
  {
    "id": "MSG-S10",
    "subject": "Lab Booking Master Schedule & Capacity Utilization Release (Notice #809)",
    "message": "Official IMA Dean broadcast notification issued to all laboratory incharges, department HODs, and estate maintenance managers.",
    "sender": "IMA Dean Office",
    "receiver": "Campus Estate Engineer",
    "date": "2026-08-03 05:00 PM",
    "priority": "High",
    "status": "Delivered",
    "category": "AMC Release",
    "attachment": "IMA_Notice_10.pdf"
  },
  {
    "id": "MSG-S11",
    "subject": "Asset Requisition Approval Sanction Notice (Notice #810)",
    "message": "Official IMA Dean broadcast notification issued to all laboratory incharges, department HODs, and estate maintenance managers.",
    "sender": "IMA Dean Office",
    "receiver": "Department HODs",
    "date": "2026-08-02 05:00 PM",
    "priority": "Medium",
    "status": "Delivered",
    "category": "Maintenance Directive",
    "attachment": "IMA_Notice_11.pdf"
  },
  {
    "id": "MSG-S12",
    "subject": "Infrastructure Maintenance Downtime Advisory for Block B (Notice #811)",
    "message": "Official IMA Dean broadcast notification issued to all laboratory incharges, department HODs, and estate maintenance managers.",
    "sender": "IMA Dean Office",
    "receiver": "Finance Dean Office",
    "date": "2026-08-01 05:00 PM",
    "priority": "Medium",
    "status": "Delivered",
    "category": "Lab Allocation",
    "attachment": "IMA_Notice_12.pdf"
  },
  {
    "id": "MSG-S13",
    "subject": "Safety Protocol & Fire Extinguisher Inspection Directive (Notice #812)",
    "message": "Official IMA Dean broadcast notification issued to all laboratory incharges, department HODs, and estate maintenance managers.",
    "sender": "IMA Dean Office",
    "receiver": "Vendor Technical Leads",
    "date": "2026-08-06 05:00 PM",
    "priority": "High",
    "status": "Delivered",
    "category": "Asset Approval",
    "attachment": "IMA_Notice_13.pdf"
  },
  {
    "id": "MSG-S14",
    "subject": "Vendor AMC Renewal & Payment Clearance Release (Notice #813)",
    "message": "Official IMA Dean broadcast notification issued to all laboratory incharges, department HODs, and estate maintenance managers.",
    "sender": "IMA Dean Office",
    "receiver": "Safety Officers",
    "date": "2026-08-05 05:00 PM",
    "priority": "Medium",
    "status": "Delivered",
    "category": "Downtime Advisory",
    "attachment": "IMA_Notice_14.pdf"
  },
  {
    "id": "MSG-S15",
    "subject": "Laboratory Inventory Disposal & E-Waste Clearance Notice (Notice #814)",
    "message": "Official IMA Dean broadcast notification issued to all laboratory incharges, department HODs, and estate maintenance managers.",
    "sender": "IMA Dean Office",
    "receiver": "Central Stores Manager",
    "date": "2026-08-04 05:00 PM",
    "priority": "Medium",
    "status": "Delivered",
    "category": "AMC Release",
    "attachment": "IMA_Notice_15.pdf"
  },
  {
    "id": "MSG-S16",
    "subject": "Campus Power Generator & UPS Backup Maintenance Schedule (Notice #815)",
    "message": "Official IMA Dean broadcast notification issued to all laboratory incharges, department HODs, and estate maintenance managers.",
    "sender": "IMA Dean Office",
    "receiver": "Academic Block Administrators",
    "date": "2026-08-03 05:00 PM",
    "priority": "High",
    "status": "Delivered",
    "category": "Maintenance Directive",
    "attachment": "IMA_Notice_16.pdf"
  },
  {
    "id": "MSG-S17",
    "subject": "Annual Equipment Calibration & Preventive Maintenance Schedule (Notice #816)",
    "message": "Official IMA Dean broadcast notification issued to all laboratory incharges, department HODs, and estate maintenance managers.",
    "sender": "IMA Dean Office",
    "receiver": "All Department Lab Incharges",
    "date": "2026-08-02 05:00 PM",
    "priority": "Medium",
    "status": "Delivered",
    "category": "Lab Allocation",
    "attachment": "IMA_Notice_17.pdf"
  },
  {
    "id": "MSG-S18",
    "subject": "Lab Booking Master Schedule & Capacity Utilization Release (Notice #817)",
    "message": "Official IMA Dean broadcast notification issued to all laboratory incharges, department HODs, and estate maintenance managers.",
    "sender": "IMA Dean Office",
    "receiver": "Campus Estate Engineer",
    "date": "2026-08-01 05:00 PM",
    "priority": "Medium",
    "status": "Delivered",
    "category": "Asset Approval",
    "attachment": "IMA_Notice_18.pdf"
  },
  {
    "id": "MSG-S19",
    "subject": "Asset Requisition Approval Sanction Notice (Notice #818)",
    "message": "Official IMA Dean broadcast notification issued to all laboratory incharges, department HODs, and estate maintenance managers.",
    "sender": "IMA Dean Office",
    "receiver": "Department HODs",
    "date": "2026-08-06 05:00 PM",
    "priority": "High",
    "status": "Delivered",
    "category": "Downtime Advisory",
    "attachment": "IMA_Notice_19.pdf"
  },
  {
    "id": "MSG-S20",
    "subject": "Infrastructure Maintenance Downtime Advisory for Block B (Notice #819)",
    "message": "Official IMA Dean broadcast notification issued to all laboratory incharges, department HODs, and estate maintenance managers.",
    "sender": "IMA Dean Office",
    "receiver": "Finance Dean Office",
    "date": "2026-08-05 05:00 PM",
    "priority": "Medium",
    "status": "Delivered",
    "category": "AMC Release",
    "attachment": "IMA_Notice_20.pdf"
  },
  {
    "id": "MSG-S21",
    "subject": "Safety Protocol & Fire Extinguisher Inspection Directive (Notice #820)",
    "message": "Official IMA Dean broadcast notification issued to all laboratory incharges, department HODs, and estate maintenance managers.",
    "sender": "IMA Dean Office",
    "receiver": "Vendor Technical Leads",
    "date": "2026-08-04 05:00 PM",
    "priority": "Medium",
    "status": "Delivered",
    "category": "Maintenance Directive",
    "attachment": "IMA_Notice_21.pdf"
  },
  {
    "id": "MSG-S22",
    "subject": "Vendor AMC Renewal & Payment Clearance Release (Notice #821)",
    "message": "Official IMA Dean broadcast notification issued to all laboratory incharges, department HODs, and estate maintenance managers.",
    "sender": "IMA Dean Office",
    "receiver": "Safety Officers",
    "date": "2026-08-03 05:00 PM",
    "priority": "High",
    "status": "Delivered",
    "category": "Lab Allocation",
    "attachment": "IMA_Notice_22.pdf"
  },
  {
    "id": "MSG-S23",
    "subject": "Laboratory Inventory Disposal & E-Waste Clearance Notice (Notice #822)",
    "message": "Official IMA Dean broadcast notification issued to all laboratory incharges, department HODs, and estate maintenance managers.",
    "sender": "IMA Dean Office",
    "receiver": "Central Stores Manager",
    "date": "2026-08-02 05:00 PM",
    "priority": "Medium",
    "status": "Delivered",
    "category": "Asset Approval",
    "attachment": "IMA_Notice_23.pdf"
  },
  {
    "id": "MSG-S24",
    "subject": "Campus Power Generator & UPS Backup Maintenance Schedule (Notice #823)",
    "message": "Official IMA Dean broadcast notification issued to all laboratory incharges, department HODs, and estate maintenance managers.",
    "sender": "IMA Dean Office",
    "receiver": "Academic Block Administrators",
    "date": "2026-08-01 05:00 PM",
    "priority": "Medium",
    "status": "Delivered",
    "category": "Downtime Advisory",
    "attachment": "IMA_Notice_24.pdf"
  },
  {
    "id": "MSG-S25",
    "subject": "Annual Equipment Calibration & Preventive Maintenance Schedule (Notice #824)",
    "message": "Official IMA Dean broadcast notification issued to all laboratory incharges, department HODs, and estate maintenance managers.",
    "sender": "IMA Dean Office",
    "receiver": "All Department Lab Incharges",
    "date": "2026-08-06 05:00 PM",
    "priority": "High",
    "status": "Delivered",
    "category": "AMC Release",
    "attachment": "IMA_Notice_25.pdf"
  }
]);

  const [composeRecipient, setComposeRecipient] = useState("All Department HODs & Faculty");
  const [composeSubject, setComposeSubject] = useState("");
  const [composeMessage, setComposeMessage] = useState("");

  const currentList = tab === "received" ? receivedMsgs : sentMsgs;

  const filteredMsgs = useMemo(() => {
    return currentList.filter((m) => {
      const matchSearch =
        m["subject"].toLowerCase().includes(search.toLowerCase()) ||
        m.message.toLowerCase().includes(search.toLowerCase()) ||
        (m.sender && m.sender.toLowerCase().includes(search.toLowerCase())) ||
        (m.receiver && m.receiver.toLowerCase().includes(search.toLowerCase())) ||
        (m.category && m.category.toLowerCase().includes(search.toLowerCase()));
      const matchPriority = priorityFilter === "all" || m.priority.toLowerCase() === priorityFilter.toLowerCase();
      return matchSearch && matchPriority;
    });
  }, [currentList, search, priorityFilter]);

  const unreadCount = useMemo(() => {
    return receivedMsgs.filter((m) => m["status"] === "Unread").length;
  }, [receivedMsgs]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!composeSubject || !composeMessage) {
      toast.error("Please fill in the subject and message body.");
      return;
    }
    const newMsg = {
      id: "MSG-S" + String(sentMsgs.length + 1).padStart(2, "0"),
      subject: composeSubject,
      message: composeMessage,
      sender: "IMA Dean Office",
      receiver: composeRecipient,
      date: new Date().toISOString().slice(0, 10) + " 10:00 AM",
      priority: "High",
      status: "Delivered",
      category: "Executive Order",
      attachment: "Notice_Document.pdf"
    };
    setSentMsgs([newMsg, ...sentMsgs]);
    setShowCompose(false);
    setSentSuccess(true);
    setComposeSubject("");
    setComposeMessage("");
    toast.success("Broadcast notification dispatched successfully to all recipients!");
  };

  const handleMarkAsRead = (id: string) => {
    setReceivedMsgs(receivedMsgs.map(m => m.id === id ? { ...m, status: "Read" } : m));
    toast.success("Notification marked as read.");
  };

  const handleDeleteMsg = (id: string) => {
    if (tab === "received") {
      setReceivedMsgs(receivedMsgs.filter(m => m.id !== id));
    } else {
      setSentMsgs(sentMsgs.filter(m => m.id !== id));
    }
    toast.success("Notification removed.");
  };

  return (
    <div className="space-y-6">
      {/* HEADER BAR */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="font-mono text-[0.65rem] uppercase text-primary border-primary/30">INFRASTRUCTURE & ASSETS</Badge>
            <span className="text-xs text-muted-foreground">• Institutional Notifications System</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Notification Center</h1>
          <p className="text-sm text-muted-foreground">Executive communication ledger for IMA Dean. Broadcast alerts, circulars, and departmental memos.</p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant={tab === "received" ? "default" : "outline"} size="sm" onClick={() => setTab("received")} className="h-8 text-xs font-bold gap-1 cursor-pointer">
            <Inbox className="size-3.5" /> Received ({receivedMsgs.length})
          </Button>
          <Button variant={tab === "sent" ? "default" : "outline"} size="sm" onClick={() => setTab("sent")} className="h-8 text-xs font-bold gap-1 cursor-pointer">
            <Send className="size-3.5" /> Sent ({sentMsgs.length})
          </Button>
          <Button size="sm" onClick={() => setShowCompose(!showCompose)} className="h-8 text-xs gap-1.5 bg-primary text-primary-foreground cursor-pointer font-bold">
            <Plus className="size-3.5" /> Compose Notification
          </Button>
        </div>
      </div>

      {/* KPI CARDS */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Received Alerts" value={receivedMsgs.length.toString() + " Notices"} icon={Inbox} tone="info" />
        <KpiCard label="Sent Broadcasts" value={sentMsgs.length.toString() + " Sent"} icon={Send} tone="purple" />
        <KpiCard label="Unread Alerts" value={unreadCount.toString() + " Unread"} icon={Bell} tone="warning" />
        <KpiCard label="Delivery SLA" value="100% Delivered" icon={ShieldCheck} tone="success" />
      </div>

      {showCompose && (
        <Panel title="Compose Executive Broadcast Notification" description="Send instant circular or urgent alert across university departments.">
          <form onSubmit={handleSendMessage} className="space-y-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="text-xs font-bold text-muted-foreground">Recipient Group</label>
                <Input value={composeRecipient} onChange={(e) => setComposeRecipient(e.target.value)} className="h-9 text-xs" />
              </div>
              <div>
                <label className="text-xs font-bold text-muted-foreground">Subject Line</label>
                <Input placeholder="Enter notice subject..." value={composeSubject} onChange={(e) => setComposeSubject(e.target.value)} className="h-9 text-xs" />
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-muted-foreground">Message Body</label>
              <textarea
                rows={3}
                placeholder="Write detailed notification content..."
                value={composeMessage}
                onChange={(e) => setComposeMessage(e.target.value)}
                className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-xs shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
            </div>
            <div className="flex items-center justify-between pt-1">
              <Button type="button" variant="outline" size="sm" onClick={() => setShowCompose(false)}>Cancel</Button>
              <Button type="submit" size="sm" className="h-8 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer">
                Send Broadcast Notice
              </Button>
            </div>
          </form>
        </Panel>
      )}

      {sentSuccess && (
        <div className="p-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-700 flex items-center justify-between text-xs font-bold">
          <span>Executive notification dispatched successfully to all recipients.</span>
          <Badge className="bg-emerald-600 text-white">Delivered</Badge>
        </div>
      )}

      {/* MAIN NOTIFICATION LEDGER */}
      <Panel title={tab === "received" ? "Received Alerts Inbox" : "Sent Broadcast History"} description="Subject, sender/receiver, date, priority, category, and attachments.">
        <div className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1 max-w-sm">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search subject, content, sender, category..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-9 text-xs"
              />
            </div>

            <div className="flex items-center gap-2">
              <Select value={priorityFilter} onValueChange={(val) => setPriorityFilter(val)}>
                <SelectTrigger className="h-9 w-[150px] text-xs">
                  <SelectValue placeholder="Priority Filter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="high">High Priority</SelectItem>
                  <SelectItem value="medium">Medium Priority</SelectItem>
                  <SelectItem value="low">Low Priority</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-3">
            {filteredMsgs.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground text-xs border border-border rounded-xl">
                No notifications found matching your search parameters.
              </div>
            ) : (
              filteredMsgs.map((m) => (
                <div key={m.id} className="p-4 rounded-xl border border-border bg-card space-y-2 hover:border-primary/40 transition-all">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="font-mono text-[0.65rem]">{m.id}</Badge>
                      <Badge className={m.priority === "High" ? "bg-rose-500/10 text-rose-600 font-mono text-[0.65rem]" : m.priority === "Medium" ? "bg-amber-500/10 text-amber-600 font-mono text-[0.65rem]" : "bg-blue-500/10 text-blue-600 font-mono text-[0.65rem]"}>
                        {m.priority} Priority
                      </Badge>
                      <Badge className="bg-purple-500/10 text-purple-600 font-mono text-[0.65rem]">{m.category}</Badge>
                      {tab === "received" && m["status"] === "Unread" && (
                        <Badge className="bg-emerald-500 text-white font-mono text-[0.60rem]">New</Badge>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground font-mono">{m.date}</span>
                  </div>

                  <h4 className="font-bold text-sm text-foreground flex items-center gap-2 pt-1">
                    <Bell className="size-4 text-primary shrink-0" /> {m["subject"]}
                  </h4>

                  <p className="text-xs text-muted-foreground leading-relaxed pl-6">{m.message}</p>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-border/50 text-xs text-muted-foreground font-mono">
                    <div>
                      {tab === "received" ? (
                        <span>Sender: <strong className="text-foreground">{m.sender}</strong></span>
                      ) : (
                        <span>Recipient: <strong className="text-foreground">{m.receiver}</strong></span>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      {m.attachment && (
                        <span className="flex items-center gap-1 text-primary cursor-pointer hover:underline" onClick={() => toast.success("Downloading attachment: " + m.attachment)}>
                          <Paperclip className="size-3.5" /> {m.attachment}
                        </span>
                      )}

                      {tab === "received" && m["status"] === "Unread" && (
                        <Button size="sm" variant="ghost" onClick={() => handleMarkAsRead(m.id)} className="h-6 text-[0.70rem] gap-1 px-2 cursor-pointer text-emerald-600">
                          <MailCheck className="size-3" /> Mark Read
                        </Button>
                      )}

                      <Button size="sm" variant="ghost" onClick={() => handleDeleteMsg(m.id)} className="h-6 text-[0.70rem] gap-1 px-2 cursor-pointer text-rose-500">
                        <Trash2 className="size-3" /> Delete
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </Panel>
    </div>
  );
}
