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

export const Route = createFileRoute("/staff/iqac/notifications")({
  head: () => ({ meta: [{ title: "Notifications System — IQAC Dean" }] }),
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
    "subject": "NAAC Grade A++ Peer Team Visit Audit Confirmation (Ref #500)",
    "message": "Official IQAC institutional audit communication regarding NAAC peer team visit preparations, AQAR documentation, and NBA criteria verification.",
    "sender": "NAAC Steering Committee",
    "receiver": "IQAC Dean Office",
    "date": "2026-08-06 09:45 AM",
    "priority": "High",
    "status": "Unread",
    "category": "NAAC Audit",
    "attachment": "IQAC_Audit_Doc_1.pdf"
  },
  {
    "id": "MSG-R02",
    "subject": "AQAR Annual Quality Assurance Report Data Submission (Ref #501)",
    "message": "Official IQAC institutional audit communication regarding NAAC peer team visit preparations, AQAR documentation, and NBA criteria verification.",
    "sender": "NBA National Board Secretariat",
    "receiver": "IQAC Dean Office",
    "date": "2026-08-05 09:45 AM",
    "priority": "Medium",
    "status": "Read",
    "category": "AQAR"
  },
  {
    "id": "MSG-R03",
    "subject": "NBA Accreditation Tier-1 Criteria Compliance Report (Ref #502)",
    "message": "Official IQAC institutional audit communication regarding NAAC peer team visit preparations, AQAR documentation, and NBA criteria verification.",
    "sender": "Internal Audit Panel",
    "receiver": "IQAC Dean Office",
    "date": "2026-08-04 09:45 AM",
    "priority": "Medium",
    "status": "Read",
    "category": "NBA Accreditation",
    "attachment": "IQAC_Audit_Doc_3.pdf"
  },
  {
    "id": "MSG-R04",
    "subject": "Department Quality Metrics (DQM) Monthly Scorecard (Ref #503)",
    "message": "Official IQAC institutional audit communication regarding NAAC peer team visit preparations, AQAR documentation, and NBA criteria verification.",
    "sender": "Dr. Srinivas Rao (HOD CSE)",
    "receiver": "IQAC Dean Office",
    "date": "2026-08-03 09:45 AM",
    "priority": "High",
    "status": "Read",
    "category": "Quality Metrics"
  },
  {
    "id": "MSG-R05",
    "subject": "Internal Quality Audit Non-Conformance Closure Report (Ref #504)",
    "message": "Official IQAC institutional audit communication regarding NAAC peer team visit preparations, AQAR documentation, and NBA criteria verification.",
    "sender": "Dr. Priya Sharma (HOD ECE)",
    "receiver": "IQAC Dean Office",
    "date": "2026-08-02 09:45 AM",
    "priority": "Medium",
    "status": "Unread",
    "category": "Internal Audit",
    "attachment": "IQAC_Audit_Doc_5.pdf"
  },
  {
    "id": "MSG-R06",
    "subject": "Student Feedback Analytic & Action Taken Report (ATR) (Ref #505)",
    "message": "Official IQAC institutional audit communication regarding NAAC peer team visit preparations, AQAR documentation, and NBA criteria verification.",
    "sender": "Dr. Mahesh Gupta (HOD ME)",
    "receiver": "IQAC Dean Office",
    "date": "2026-08-01 09:45 AM",
    "priority": "Medium",
    "status": "Read",
    "category": "NAAC Audit"
  },
  {
    "id": "MSG-R07",
    "subject": "Quality Improvement Plan (QIP) Faculty Workshop Sanction (Ref #506)",
    "message": "Official IQAC institutional audit communication regarding NAAC peer team visit preparations, AQAR documentation, and NBA criteria verification.",
    "sender": "Department Quality Committee",
    "receiver": "IQAC Dean Office",
    "date": "2026-08-06 09:45 AM",
    "priority": "High",
    "status": "Read",
    "category": "AQAR",
    "attachment": "IQAC_Audit_Doc_7.pdf"
  },
  {
    "id": "MSG-R08",
    "subject": "Green Campus & Energy Audit Compliance Certificate (Ref #507)",
    "message": "Official IQAC institutional audit communication regarding NAAC peer team visit preparations, AQAR documentation, and NBA criteria verification.",
    "sender": "Vice Chancellor Office",
    "receiver": "IQAC Dean Office",
    "date": "2026-08-05 09:45 AM",
    "priority": "Medium",
    "status": "Read",
    "category": "NBA Accreditation"
  },
  {
    "id": "MSG-R09",
    "subject": "NAAC Grade A++ Peer Team Visit Audit Confirmation (Ref #508)",
    "message": "Official IQAC institutional audit communication regarding NAAC peer team visit preparations, AQAR documentation, and NBA criteria verification.",
    "sender": "NAAC Steering Committee",
    "receiver": "IQAC Dean Office",
    "date": "2026-08-04 09:45 AM",
    "priority": "Medium",
    "status": "Unread",
    "category": "Quality Metrics",
    "attachment": "IQAC_Audit_Doc_9.pdf"
  },
  {
    "id": "MSG-R10",
    "subject": "AQAR Annual Quality Assurance Report Data Submission (Ref #509)",
    "message": "Official IQAC institutional audit communication regarding NAAC peer team visit preparations, AQAR documentation, and NBA criteria verification.",
    "sender": "NBA National Board Secretariat",
    "receiver": "IQAC Dean Office",
    "date": "2026-08-03 09:45 AM",
    "priority": "High",
    "status": "Read",
    "category": "Internal Audit"
  },
  {
    "id": "MSG-R11",
    "subject": "NBA Accreditation Tier-1 Criteria Compliance Report (Ref #510)",
    "message": "Official IQAC institutional audit communication regarding NAAC peer team visit preparations, AQAR documentation, and NBA criteria verification.",
    "sender": "Internal Audit Panel",
    "receiver": "IQAC Dean Office",
    "date": "2026-08-02 09:45 AM",
    "priority": "Medium",
    "status": "Read",
    "category": "NAAC Audit",
    "attachment": "IQAC_Audit_Doc_11.pdf"
  },
  {
    "id": "MSG-R12",
    "subject": "Department Quality Metrics (DQM) Monthly Scorecard (Ref #511)",
    "message": "Official IQAC institutional audit communication regarding NAAC peer team visit preparations, AQAR documentation, and NBA criteria verification.",
    "sender": "Dr. Srinivas Rao (HOD CSE)",
    "receiver": "IQAC Dean Office",
    "date": "2026-08-01 09:45 AM",
    "priority": "Medium",
    "status": "Read",
    "category": "AQAR"
  },
  {
    "id": "MSG-R13",
    "subject": "Internal Quality Audit Non-Conformance Closure Report (Ref #512)",
    "message": "Official IQAC institutional audit communication regarding NAAC peer team visit preparations, AQAR documentation, and NBA criteria verification.",
    "sender": "Dr. Priya Sharma (HOD ECE)",
    "receiver": "IQAC Dean Office",
    "date": "2026-08-06 09:45 AM",
    "priority": "High",
    "status": "Unread",
    "category": "NBA Accreditation",
    "attachment": "IQAC_Audit_Doc_13.pdf"
  },
  {
    "id": "MSG-R14",
    "subject": "Student Feedback Analytic & Action Taken Report (ATR) (Ref #513)",
    "message": "Official IQAC institutional audit communication regarding NAAC peer team visit preparations, AQAR documentation, and NBA criteria verification.",
    "sender": "Dr. Mahesh Gupta (HOD ME)",
    "receiver": "IQAC Dean Office",
    "date": "2026-08-05 09:45 AM",
    "priority": "Medium",
    "status": "Read",
    "category": "Quality Metrics"
  },
  {
    "id": "MSG-R15",
    "subject": "Quality Improvement Plan (QIP) Faculty Workshop Sanction (Ref #514)",
    "message": "Official IQAC institutional audit communication regarding NAAC peer team visit preparations, AQAR documentation, and NBA criteria verification.",
    "sender": "Department Quality Committee",
    "receiver": "IQAC Dean Office",
    "date": "2026-08-04 09:45 AM",
    "priority": "Medium",
    "status": "Read",
    "category": "Internal Audit",
    "attachment": "IQAC_Audit_Doc_15.pdf"
  },
  {
    "id": "MSG-R16",
    "subject": "Green Campus & Energy Audit Compliance Certificate (Ref #515)",
    "message": "Official IQAC institutional audit communication regarding NAAC peer team visit preparations, AQAR documentation, and NBA criteria verification.",
    "sender": "Vice Chancellor Office",
    "receiver": "IQAC Dean Office",
    "date": "2026-08-03 09:45 AM",
    "priority": "High",
    "status": "Read",
    "category": "NAAC Audit"
  },
  {
    "id": "MSG-R17",
    "subject": "NAAC Grade A++ Peer Team Visit Audit Confirmation (Ref #516)",
    "message": "Official IQAC institutional audit communication regarding NAAC peer team visit preparations, AQAR documentation, and NBA criteria verification.",
    "sender": "NAAC Steering Committee",
    "receiver": "IQAC Dean Office",
    "date": "2026-08-02 09:45 AM",
    "priority": "Medium",
    "status": "Unread",
    "category": "AQAR",
    "attachment": "IQAC_Audit_Doc_17.pdf"
  },
  {
    "id": "MSG-R18",
    "subject": "AQAR Annual Quality Assurance Report Data Submission (Ref #517)",
    "message": "Official IQAC institutional audit communication regarding NAAC peer team visit preparations, AQAR documentation, and NBA criteria verification.",
    "sender": "NBA National Board Secretariat",
    "receiver": "IQAC Dean Office",
    "date": "2026-08-01 09:45 AM",
    "priority": "Medium",
    "status": "Read",
    "category": "NBA Accreditation"
  },
  {
    "id": "MSG-R19",
    "subject": "NBA Accreditation Tier-1 Criteria Compliance Report (Ref #518)",
    "message": "Official IQAC institutional audit communication regarding NAAC peer team visit preparations, AQAR documentation, and NBA criteria verification.",
    "sender": "Internal Audit Panel",
    "receiver": "IQAC Dean Office",
    "date": "2026-08-06 09:45 AM",
    "priority": "High",
    "status": "Read",
    "category": "Quality Metrics",
    "attachment": "IQAC_Audit_Doc_19.pdf"
  },
  {
    "id": "MSG-R20",
    "subject": "Department Quality Metrics (DQM) Monthly Scorecard (Ref #519)",
    "message": "Official IQAC institutional audit communication regarding NAAC peer team visit preparations, AQAR documentation, and NBA criteria verification.",
    "sender": "Dr. Srinivas Rao (HOD CSE)",
    "receiver": "IQAC Dean Office",
    "date": "2026-08-05 09:45 AM",
    "priority": "Medium",
    "status": "Read",
    "category": "Internal Audit"
  },
  {
    "id": "MSG-R21",
    "subject": "Internal Quality Audit Non-Conformance Closure Report (Ref #520)",
    "message": "Official IQAC institutional audit communication regarding NAAC peer team visit preparations, AQAR documentation, and NBA criteria verification.",
    "sender": "Dr. Priya Sharma (HOD ECE)",
    "receiver": "IQAC Dean Office",
    "date": "2026-08-04 09:45 AM",
    "priority": "Medium",
    "status": "Unread",
    "category": "NAAC Audit",
    "attachment": "IQAC_Audit_Doc_21.pdf"
  },
  {
    "id": "MSG-R22",
    "subject": "Student Feedback Analytic & Action Taken Report (ATR) (Ref #521)",
    "message": "Official IQAC institutional audit communication regarding NAAC peer team visit preparations, AQAR documentation, and NBA criteria verification.",
    "sender": "Dr. Mahesh Gupta (HOD ME)",
    "receiver": "IQAC Dean Office",
    "date": "2026-08-03 09:45 AM",
    "priority": "High",
    "status": "Read",
    "category": "AQAR"
  },
  {
    "id": "MSG-R23",
    "subject": "Quality Improvement Plan (QIP) Faculty Workshop Sanction (Ref #522)",
    "message": "Official IQAC institutional audit communication regarding NAAC peer team visit preparations, AQAR documentation, and NBA criteria verification.",
    "sender": "Department Quality Committee",
    "receiver": "IQAC Dean Office",
    "date": "2026-08-02 09:45 AM",
    "priority": "Medium",
    "status": "Read",
    "category": "NBA Accreditation",
    "attachment": "IQAC_Audit_Doc_23.pdf"
  },
  {
    "id": "MSG-R24",
    "subject": "Green Campus & Energy Audit Compliance Certificate (Ref #523)",
    "message": "Official IQAC institutional audit communication regarding NAAC peer team visit preparations, AQAR documentation, and NBA criteria verification.",
    "sender": "Vice Chancellor Office",
    "receiver": "IQAC Dean Office",
    "date": "2026-08-01 09:45 AM",
    "priority": "Medium",
    "status": "Read",
    "category": "Quality Metrics"
  },
  {
    "id": "MSG-R25",
    "subject": "NAAC Grade A++ Peer Team Visit Audit Confirmation (Ref #524)",
    "message": "Official IQAC institutional audit communication regarding NAAC peer team visit preparations, AQAR documentation, and NBA criteria verification.",
    "sender": "NAAC Steering Committee",
    "receiver": "IQAC Dean Office",
    "date": "2026-08-06 09:45 AM",
    "priority": "High",
    "status": "Unread",
    "category": "Internal Audit",
    "attachment": "IQAC_Audit_Doc_25.pdf"
  }
]);
  const [sentMsgs, setSentMsgs] = useState([
  {
    "id": "MSG-S01",
    "subject": "IQAC Directive: AQAR Data Submission Deadline Reminder (Circular #600)",
    "message": "Official IQAC Dean notification issued to all academic departments, accreditation coordinators, and administrative officers.",
    "sender": "IQAC Dean Office",
    "receiver": "All Department HODs & Accreditation Leads",
    "date": "2026-08-06 03:20 PM",
    "priority": "High",
    "status": "Delivered",
    "category": "AQAR Directive",
    "attachment": "IQAC_Circular_1.pdf"
  },
  {
    "id": "MSG-S02",
    "subject": "NAAC SSR Metric Documentation Final Verification Circular (Circular #601)",
    "message": "Official IQAC Dean notification issued to all academic departments, accreditation coordinators, and administrative officers.",
    "sender": "IQAC Dean Office",
    "receiver": "Academic Dean",
    "date": "2026-08-05 03:20 PM",
    "priority": "Medium",
    "status": "Delivered",
    "category": "NAAC Circular",
    "attachment": "IQAC_Circular_2.pdf"
  },
  {
    "id": "MSG-S03",
    "subject": "NBA Accreditation Mock Peer Visit Schedule Release (Circular #602)",
    "message": "Official IQAC Dean notification issued to all academic departments, accreditation coordinators, and administrative officers.",
    "sender": "IQAC Dean Office",
    "receiver": "Examination Dean",
    "date": "2026-08-04 03:20 PM",
    "priority": "Medium",
    "status": "Delivered",
    "category": "NBA Notice",
    "attachment": "IQAC_Circular_3.pdf"
  },
  {
    "id": "MSG-S04",
    "subject": "Internal Quality Audit Action Plan & Closure Directive (Circular #603)",
    "message": "Official IQAC Dean notification issued to all academic departments, accreditation coordinators, and administrative officers.",
    "sender": "IQAC Dean Office",
    "receiver": "Finance Office",
    "date": "2026-08-03 03:20 PM",
    "priority": "High",
    "status": "Delivered",
    "category": "Quality Audit",
    "attachment": "IQAC_Circular_4.pdf"
  },
  {
    "id": "MSG-S05",
    "subject": "Department Quality Metrics Benchmark Release Q3 (Circular #604)",
    "message": "Official IQAC Dean notification issued to all academic departments, accreditation coordinators, and administrative officers.",
    "sender": "IQAC Dean Office",
    "receiver": "Library Director",
    "date": "2026-08-02 03:20 PM",
    "priority": "Medium",
    "status": "Delivered",
    "category": "Feedback",
    "attachment": "IQAC_Circular_5.pdf"
  },
  {
    "id": "MSG-S06",
    "subject": "Stakeholder Feedback Collection Circular for Autumn Term (Circular #605)",
    "message": "Official IQAC Dean notification issued to all academic departments, accreditation coordinators, and administrative officers.",
    "sender": "IQAC Dean Office",
    "receiver": "Placement Office",
    "date": "2026-08-01 03:20 PM",
    "priority": "Medium",
    "status": "Delivered",
    "category": "AQAR Directive",
    "attachment": "IQAC_Circular_6.pdf"
  },
  {
    "id": "MSG-S07",
    "subject": "Quality Assurance Workshop for Academic & Administrative Heads (Circular #606)",
    "message": "Official IQAC Dean notification issued to all academic departments, accreditation coordinators, and administrative officers.",
    "sender": "IQAC Dean Office",
    "receiver": "Campus Administrator",
    "date": "2026-08-06 03:20 PM",
    "priority": "High",
    "status": "Delivered",
    "category": "NAAC Circular",
    "attachment": "IQAC_Circular_7.pdf"
  },
  {
    "id": "MSG-S08",
    "subject": "Institutional Academic & Administrative Audit (AAA) Call (Circular #607)",
    "message": "Official IQAC Dean notification issued to all academic departments, accreditation coordinators, and administrative officers.",
    "sender": "IQAC Dean Office",
    "receiver": "Internal Quality Auditors",
    "date": "2026-08-05 03:20 PM",
    "priority": "Medium",
    "status": "Delivered",
    "category": "NBA Notice",
    "attachment": "IQAC_Circular_8.pdf"
  },
  {
    "id": "MSG-S09",
    "subject": "IQAC Directive: AQAR Data Submission Deadline Reminder (Circular #608)",
    "message": "Official IQAC Dean notification issued to all academic departments, accreditation coordinators, and administrative officers.",
    "sender": "IQAC Dean Office",
    "receiver": "All Department HODs & Accreditation Leads",
    "date": "2026-08-04 03:20 PM",
    "priority": "Medium",
    "status": "Delivered",
    "category": "Quality Audit",
    "attachment": "IQAC_Circular_9.pdf"
  },
  {
    "id": "MSG-S10",
    "subject": "NAAC SSR Metric Documentation Final Verification Circular (Circular #609)",
    "message": "Official IQAC Dean notification issued to all academic departments, accreditation coordinators, and administrative officers.",
    "sender": "IQAC Dean Office",
    "receiver": "Academic Dean",
    "date": "2026-08-03 03:20 PM",
    "priority": "High",
    "status": "Delivered",
    "category": "Feedback",
    "attachment": "IQAC_Circular_10.pdf"
  },
  {
    "id": "MSG-S11",
    "subject": "NBA Accreditation Mock Peer Visit Schedule Release (Circular #610)",
    "message": "Official IQAC Dean notification issued to all academic departments, accreditation coordinators, and administrative officers.",
    "sender": "IQAC Dean Office",
    "receiver": "Examination Dean",
    "date": "2026-08-02 03:20 PM",
    "priority": "Medium",
    "status": "Delivered",
    "category": "AQAR Directive",
    "attachment": "IQAC_Circular_11.pdf"
  },
  {
    "id": "MSG-S12",
    "subject": "Internal Quality Audit Action Plan & Closure Directive (Circular #611)",
    "message": "Official IQAC Dean notification issued to all academic departments, accreditation coordinators, and administrative officers.",
    "sender": "IQAC Dean Office",
    "receiver": "Finance Office",
    "date": "2026-08-01 03:20 PM",
    "priority": "Medium",
    "status": "Delivered",
    "category": "NAAC Circular",
    "attachment": "IQAC_Circular_12.pdf"
  },
  {
    "id": "MSG-S13",
    "subject": "Department Quality Metrics Benchmark Release Q3 (Circular #612)",
    "message": "Official IQAC Dean notification issued to all academic departments, accreditation coordinators, and administrative officers.",
    "sender": "IQAC Dean Office",
    "receiver": "Library Director",
    "date": "2026-08-06 03:20 PM",
    "priority": "High",
    "status": "Delivered",
    "category": "NBA Notice",
    "attachment": "IQAC_Circular_13.pdf"
  },
  {
    "id": "MSG-S14",
    "subject": "Stakeholder Feedback Collection Circular for Autumn Term (Circular #613)",
    "message": "Official IQAC Dean notification issued to all academic departments, accreditation coordinators, and administrative officers.",
    "sender": "IQAC Dean Office",
    "receiver": "Placement Office",
    "date": "2026-08-05 03:20 PM",
    "priority": "Medium",
    "status": "Delivered",
    "category": "Quality Audit",
    "attachment": "IQAC_Circular_14.pdf"
  },
  {
    "id": "MSG-S15",
    "subject": "Quality Assurance Workshop for Academic & Administrative Heads (Circular #614)",
    "message": "Official IQAC Dean notification issued to all academic departments, accreditation coordinators, and administrative officers.",
    "sender": "IQAC Dean Office",
    "receiver": "Campus Administrator",
    "date": "2026-08-04 03:20 PM",
    "priority": "Medium",
    "status": "Delivered",
    "category": "Feedback",
    "attachment": "IQAC_Circular_15.pdf"
  },
  {
    "id": "MSG-S16",
    "subject": "Institutional Academic & Administrative Audit (AAA) Call (Circular #615)",
    "message": "Official IQAC Dean notification issued to all academic departments, accreditation coordinators, and administrative officers.",
    "sender": "IQAC Dean Office",
    "receiver": "Internal Quality Auditors",
    "date": "2026-08-03 03:20 PM",
    "priority": "High",
    "status": "Delivered",
    "category": "AQAR Directive",
    "attachment": "IQAC_Circular_16.pdf"
  },
  {
    "id": "MSG-S17",
    "subject": "IQAC Directive: AQAR Data Submission Deadline Reminder (Circular #616)",
    "message": "Official IQAC Dean notification issued to all academic departments, accreditation coordinators, and administrative officers.",
    "sender": "IQAC Dean Office",
    "receiver": "All Department HODs & Accreditation Leads",
    "date": "2026-08-02 03:20 PM",
    "priority": "Medium",
    "status": "Delivered",
    "category": "NAAC Circular",
    "attachment": "IQAC_Circular_17.pdf"
  },
  {
    "id": "MSG-S18",
    "subject": "NAAC SSR Metric Documentation Final Verification Circular (Circular #617)",
    "message": "Official IQAC Dean notification issued to all academic departments, accreditation coordinators, and administrative officers.",
    "sender": "IQAC Dean Office",
    "receiver": "Academic Dean",
    "date": "2026-08-01 03:20 PM",
    "priority": "Medium",
    "status": "Delivered",
    "category": "NBA Notice",
    "attachment": "IQAC_Circular_18.pdf"
  },
  {
    "id": "MSG-S19",
    "subject": "NBA Accreditation Mock Peer Visit Schedule Release (Circular #618)",
    "message": "Official IQAC Dean notification issued to all academic departments, accreditation coordinators, and administrative officers.",
    "sender": "IQAC Dean Office",
    "receiver": "Examination Dean",
    "date": "2026-08-06 03:20 PM",
    "priority": "High",
    "status": "Delivered",
    "category": "Quality Audit",
    "attachment": "IQAC_Circular_19.pdf"
  },
  {
    "id": "MSG-S20",
    "subject": "Internal Quality Audit Action Plan & Closure Directive (Circular #619)",
    "message": "Official IQAC Dean notification issued to all academic departments, accreditation coordinators, and administrative officers.",
    "sender": "IQAC Dean Office",
    "receiver": "Finance Office",
    "date": "2026-08-05 03:20 PM",
    "priority": "Medium",
    "status": "Delivered",
    "category": "Feedback",
    "attachment": "IQAC_Circular_20.pdf"
  },
  {
    "id": "MSG-S21",
    "subject": "Department Quality Metrics Benchmark Release Q3 (Circular #620)",
    "message": "Official IQAC Dean notification issued to all academic departments, accreditation coordinators, and administrative officers.",
    "sender": "IQAC Dean Office",
    "receiver": "Library Director",
    "date": "2026-08-04 03:20 PM",
    "priority": "Medium",
    "status": "Delivered",
    "category": "AQAR Directive",
    "attachment": "IQAC_Circular_21.pdf"
  },
  {
    "id": "MSG-S22",
    "subject": "Stakeholder Feedback Collection Circular for Autumn Term (Circular #621)",
    "message": "Official IQAC Dean notification issued to all academic departments, accreditation coordinators, and administrative officers.",
    "sender": "IQAC Dean Office",
    "receiver": "Placement Office",
    "date": "2026-08-03 03:20 PM",
    "priority": "High",
    "status": "Delivered",
    "category": "NAAC Circular",
    "attachment": "IQAC_Circular_22.pdf"
  },
  {
    "id": "MSG-S23",
    "subject": "Quality Assurance Workshop for Academic & Administrative Heads (Circular #622)",
    "message": "Official IQAC Dean notification issued to all academic departments, accreditation coordinators, and administrative officers.",
    "sender": "IQAC Dean Office",
    "receiver": "Campus Administrator",
    "date": "2026-08-02 03:20 PM",
    "priority": "Medium",
    "status": "Delivered",
    "category": "NBA Notice",
    "attachment": "IQAC_Circular_23.pdf"
  },
  {
    "id": "MSG-S24",
    "subject": "Institutional Academic & Administrative Audit (AAA) Call (Circular #623)",
    "message": "Official IQAC Dean notification issued to all academic departments, accreditation coordinators, and administrative officers.",
    "sender": "IQAC Dean Office",
    "receiver": "Internal Quality Auditors",
    "date": "2026-08-01 03:20 PM",
    "priority": "Medium",
    "status": "Delivered",
    "category": "Quality Audit",
    "attachment": "IQAC_Circular_24.pdf"
  },
  {
    "id": "MSG-S25",
    "subject": "IQAC Directive: AQAR Data Submission Deadline Reminder (Circular #624)",
    "message": "Official IQAC Dean notification issued to all academic departments, accreditation coordinators, and administrative officers.",
    "sender": "IQAC Dean Office",
    "receiver": "All Department HODs & Accreditation Leads",
    "date": "2026-08-06 03:20 PM",
    "priority": "High",
    "status": "Delivered",
    "category": "Feedback",
    "attachment": "IQAC_Circular_25.pdf"
  }
]);

  const [composeRecipient, setComposeRecipient] = useState("All Department HODs & Faculty");
  const [composeSubject, setComposeSubject] = useState("");
  const [composeMessage, setComposeMessage] = useState("");

  const currentList = tab === "received" ? receivedMsgs : sentMsgs;

  const filteredMsgs = useMemo(() => {
    return currentList.filter((m) => {
      const matchSearch =
        m.subject.toLowerCase().includes(search.toLowerCase()) ||
        m.message.toLowerCase().includes(search.toLowerCase()) ||
        (m.sender && m.sender.toLowerCase().includes(search.toLowerCase())) ||
        (m.receiver && m.receiver.toLowerCase().includes(search.toLowerCase())) ||
        (m.category && m.category.toLowerCase().includes(search.toLowerCase()));
      const matchPriority = priorityFilter === "all" || m.priority.toLowerCase() === priorityFilter.toLowerCase();
      return matchSearch && matchPriority;
    });
  }, [currentList, search, priorityFilter]);

  const unreadCount = useMemo(() => {
    return receivedMsgs.filter((m) => m.status === "Unread").length;
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
      sender: "IQAC Dean Office",
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
            <Badge variant="outline" className="font-mono text-[0.65rem] uppercase text-primary border-primary/30">QUALITY ASSURANCE</Badge>
            <span className="text-xs text-muted-foreground">• Institutional Notifications System</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Notification Center</h1>
          <p className="text-sm text-muted-foreground">Executive communication ledger for IQAC Dean. Broadcast alerts, circulars, and departmental memos.</p>
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
                      {tab === "received" && m.status === "Unread" && (
                        <Badge className="bg-emerald-500 text-white font-mono text-[0.60rem]">New</Badge>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground font-mono">{m.date}</span>
                  </div>

                  <h4 className="font-bold text-sm text-foreground flex items-center gap-2 pt-1">
                    <Bell className="size-4 text-primary shrink-0" /> {m.subject}
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

                      {tab === "received" && m.status === "Unread" && (
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
