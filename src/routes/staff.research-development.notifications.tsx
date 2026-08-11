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

export const Route = createFileRoute("/staff/research-development/notifications")({
  head: () => ({ meta: [{ title: "Notifications System — Research & Development Dean" }] }),
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
    "subject": "DST-SERB Sponsored Research Grant Sanction (₹45.0 Lacs) (Ref #900)",
    "message": "Official R&D notification regarding sponsored research grants, Scopus/Web of Science journal acceptances, patent grants, and PhD scholar reviews.",
    "sender": "DST-SERB Government Project Officer",
    "receiver": "R&D Dean Office",
    "date": "2026-08-06 11:30 AM",
    "priority": "High",
    "status": "Unread",
    "category": "Research Grant",
    "attachment": "RD_Sanction_Letter_1.pdf"
  },
  {
    "id": "MSG-R02",
    "subject": "Scopus Indexed Journal Publication Acceptance Notice (Ref #901)",
    "message": "Official R&D notification regarding sponsored research grants, Scopus/Web of Science journal acceptances, patent grants, and PhD scholar reviews.",
    "sender": "Dr. Ravi Kumar (Principal Investigator)",
    "receiver": "R&D Dean Office",
    "date": "2026-08-05 11:30 AM",
    "priority": "Medium",
    "status": "Read",
    "category": "Publication"
  },
  {
    "id": "MSG-R03",
    "subject": "Indian Patent Granted: AI-Driven Smart Grid Controller (Ref #902)",
    "message": "Official R&D notification regarding sponsored research grants, Scopus/Web of Science journal acceptances, patent grants, and PhD scholar reviews.",
    "sender": "Dr. Priya Sharma (Patent Author)",
    "receiver": "R&D Dean Office",
    "date": "2026-08-04 11:30 AM",
    "priority": "Medium",
    "status": "Read",
    "category": "Patent Granted",
    "attachment": "RD_Sanction_Letter_3.pdf"
  },
  {
    "id": "MSG-R04",
    "subject": "PhD Scholar Bi-Annual Progress Review Committee Report (Ref #903)",
    "message": "Official R&D notification regarding sponsored research grants, Scopus/Web of Science journal acceptances, patent grants, and PhD scholar reviews.",
    "sender": "Indian Patent Office Secretariat",
    "receiver": "R&D Dean Office",
    "date": "2026-08-03 11:30 AM",
    "priority": "High",
    "status": "Read",
    "category": "PhD Review"
  },
  {
    "id": "MSG-R05",
    "subject": "Consultancy Project Sanction by Larsen & Toubro (Ref #904)",
    "message": "Official R&D notification regarding sponsored research grants, Scopus/Web of Science journal acceptances, patent grants, and PhD scholar reviews.",
    "sender": "Research Advisory Board",
    "receiver": "R&D Dean Office",
    "date": "2026-08-02 11:30 AM",
    "priority": "Medium",
    "status": "Unread",
    "category": "Incubation",
    "attachment": "RD_Sanction_Letter_5.pdf"
  },
  {
    "id": "MSG-R06",
    "subject": "Startup Incubation Seed Capital Grant Approval (Ref #905)",
    "message": "Official R&D notification regarding sponsored research grants, Scopus/Web of Science journal acceptances, patent grants, and PhD scholar reviews.",
    "sender": "Incubation Center Director",
    "receiver": "R&D Dean Office",
    "date": "2026-08-01 11:30 AM",
    "priority": "Medium",
    "status": "Read",
    "category": "Research Grant"
  },
  {
    "id": "MSG-R07",
    "subject": "International Conference Research Paper Presentation Clearance (Ref #906)",
    "message": "Official R&D notification regarding sponsored research grants, Scopus/Web of Science journal acceptances, patent grants, and PhD scholar reviews.",
    "sender": "Dr. Srinivas Rao (PhD Supervisor)",
    "receiver": "R&D Dean Office",
    "date": "2026-08-06 11:30 AM",
    "priority": "High",
    "status": "Read",
    "category": "Publication",
    "attachment": "RD_Sanction_Letter_7.pdf"
  },
  {
    "id": "MSG-R08",
    "subject": "Research Ethics & Integrity Committee Review Passed (Ref #907)",
    "message": "Official R&D notification regarding sponsored research grants, Scopus/Web of Science journal acceptances, patent grants, and PhD scholar reviews.",
    "sender": "Dean Graduate Studies",
    "receiver": "R&D Dean Office",
    "date": "2026-08-05 11:30 AM",
    "priority": "Medium",
    "status": "Read",
    "category": "Patent Granted"
  },
  {
    "id": "MSG-R09",
    "subject": "DST-SERB Sponsored Research Grant Sanction (₹45.0 Lacs) (Ref #908)",
    "message": "Official R&D notification regarding sponsored research grants, Scopus/Web of Science journal acceptances, patent grants, and PhD scholar reviews.",
    "sender": "DST-SERB Government Project Officer",
    "receiver": "R&D Dean Office",
    "date": "2026-08-04 11:30 AM",
    "priority": "Medium",
    "status": "Unread",
    "category": "PhD Review",
    "attachment": "RD_Sanction_Letter_9.pdf"
  },
  {
    "id": "MSG-R10",
    "subject": "Scopus Indexed Journal Publication Acceptance Notice (Ref #909)",
    "message": "Official R&D notification regarding sponsored research grants, Scopus/Web of Science journal acceptances, patent grants, and PhD scholar reviews.",
    "sender": "Dr. Ravi Kumar (Principal Investigator)",
    "receiver": "R&D Dean Office",
    "date": "2026-08-03 11:30 AM",
    "priority": "High",
    "status": "Read",
    "category": "Incubation"
  },
  {
    "id": "MSG-R11",
    "subject": "Indian Patent Granted: AI-Driven Smart Grid Controller (Ref #910)",
    "message": "Official R&D notification regarding sponsored research grants, Scopus/Web of Science journal acceptances, patent grants, and PhD scholar reviews.",
    "sender": "Dr. Priya Sharma (Patent Author)",
    "receiver": "R&D Dean Office",
    "date": "2026-08-02 11:30 AM",
    "priority": "Medium",
    "status": "Read",
    "category": "Research Grant",
    "attachment": "RD_Sanction_Letter_11.pdf"
  },
  {
    "id": "MSG-R12",
    "subject": "PhD Scholar Bi-Annual Progress Review Committee Report (Ref #911)",
    "message": "Official R&D notification regarding sponsored research grants, Scopus/Web of Science journal acceptances, patent grants, and PhD scholar reviews.",
    "sender": "Indian Patent Office Secretariat",
    "receiver": "R&D Dean Office",
    "date": "2026-08-01 11:30 AM",
    "priority": "Medium",
    "status": "Read",
    "category": "Publication"
  },
  {
    "id": "MSG-R13",
    "subject": "Consultancy Project Sanction by Larsen & Toubro (Ref #912)",
    "message": "Official R&D notification regarding sponsored research grants, Scopus/Web of Science journal acceptances, patent grants, and PhD scholar reviews.",
    "sender": "Research Advisory Board",
    "receiver": "R&D Dean Office",
    "date": "2026-08-06 11:30 AM",
    "priority": "High",
    "status": "Unread",
    "category": "Patent Granted",
    "attachment": "RD_Sanction_Letter_13.pdf"
  },
  {
    "id": "MSG-R14",
    "subject": "Startup Incubation Seed Capital Grant Approval (Ref #913)",
    "message": "Official R&D notification regarding sponsored research grants, Scopus/Web of Science journal acceptances, patent grants, and PhD scholar reviews.",
    "sender": "Incubation Center Director",
    "receiver": "R&D Dean Office",
    "date": "2026-08-05 11:30 AM",
    "priority": "Medium",
    "status": "Read",
    "category": "PhD Review"
  },
  {
    "id": "MSG-R15",
    "subject": "International Conference Research Paper Presentation Clearance (Ref #914)",
    "message": "Official R&D notification regarding sponsored research grants, Scopus/Web of Science journal acceptances, patent grants, and PhD scholar reviews.",
    "sender": "Dr. Srinivas Rao (PhD Supervisor)",
    "receiver": "R&D Dean Office",
    "date": "2026-08-04 11:30 AM",
    "priority": "Medium",
    "status": "Read",
    "category": "Incubation",
    "attachment": "RD_Sanction_Letter_15.pdf"
  },
  {
    "id": "MSG-R16",
    "subject": "Research Ethics & Integrity Committee Review Passed (Ref #915)",
    "message": "Official R&D notification regarding sponsored research grants, Scopus/Web of Science journal acceptances, patent grants, and PhD scholar reviews.",
    "sender": "Dean Graduate Studies",
    "receiver": "R&D Dean Office",
    "date": "2026-08-03 11:30 AM",
    "priority": "High",
    "status": "Read",
    "category": "Research Grant"
  },
  {
    "id": "MSG-R17",
    "subject": "DST-SERB Sponsored Research Grant Sanction (₹45.0 Lacs) (Ref #916)",
    "message": "Official R&D notification regarding sponsored research grants, Scopus/Web of Science journal acceptances, patent grants, and PhD scholar reviews.",
    "sender": "DST-SERB Government Project Officer",
    "receiver": "R&D Dean Office",
    "date": "2026-08-02 11:30 AM",
    "priority": "Medium",
    "status": "Unread",
    "category": "Publication",
    "attachment": "RD_Sanction_Letter_17.pdf"
  },
  {
    "id": "MSG-R18",
    "subject": "Scopus Indexed Journal Publication Acceptance Notice (Ref #917)",
    "message": "Official R&D notification regarding sponsored research grants, Scopus/Web of Science journal acceptances, patent grants, and PhD scholar reviews.",
    "sender": "Dr. Ravi Kumar (Principal Investigator)",
    "receiver": "R&D Dean Office",
    "date": "2026-08-01 11:30 AM",
    "priority": "Medium",
    "status": "Read",
    "category": "Patent Granted"
  },
  {
    "id": "MSG-R19",
    "subject": "Indian Patent Granted: AI-Driven Smart Grid Controller (Ref #918)",
    "message": "Official R&D notification regarding sponsored research grants, Scopus/Web of Science journal acceptances, patent grants, and PhD scholar reviews.",
    "sender": "Dr. Priya Sharma (Patent Author)",
    "receiver": "R&D Dean Office",
    "date": "2026-08-06 11:30 AM",
    "priority": "High",
    "status": "Read",
    "category": "PhD Review",
    "attachment": "RD_Sanction_Letter_19.pdf"
  },
  {
    "id": "MSG-R20",
    "subject": "PhD Scholar Bi-Annual Progress Review Committee Report (Ref #919)",
    "message": "Official R&D notification regarding sponsored research grants, Scopus/Web of Science journal acceptances, patent grants, and PhD scholar reviews.",
    "sender": "Indian Patent Office Secretariat",
    "receiver": "R&D Dean Office",
    "date": "2026-08-05 11:30 AM",
    "priority": "Medium",
    "status": "Read",
    "category": "Incubation"
  },
  {
    "id": "MSG-R21",
    "subject": "Consultancy Project Sanction by Larsen & Toubro (Ref #920)",
    "message": "Official R&D notification regarding sponsored research grants, Scopus/Web of Science journal acceptances, patent grants, and PhD scholar reviews.",
    "sender": "Research Advisory Board",
    "receiver": "R&D Dean Office",
    "date": "2026-08-04 11:30 AM",
    "priority": "Medium",
    "status": "Unread",
    "category": "Research Grant",
    "attachment": "RD_Sanction_Letter_21.pdf"
  },
  {
    "id": "MSG-R22",
    "subject": "Startup Incubation Seed Capital Grant Approval (Ref #921)",
    "message": "Official R&D notification regarding sponsored research grants, Scopus/Web of Science journal acceptances, patent grants, and PhD scholar reviews.",
    "sender": "Incubation Center Director",
    "receiver": "R&D Dean Office",
    "date": "2026-08-03 11:30 AM",
    "priority": "High",
    "status": "Read",
    "category": "Publication"
  },
  {
    "id": "MSG-R23",
    "subject": "International Conference Research Paper Presentation Clearance (Ref #922)",
    "message": "Official R&D notification regarding sponsored research grants, Scopus/Web of Science journal acceptances, patent grants, and PhD scholar reviews.",
    "sender": "Dr. Srinivas Rao (PhD Supervisor)",
    "receiver": "R&D Dean Office",
    "date": "2026-08-02 11:30 AM",
    "priority": "Medium",
    "status": "Read",
    "category": "Patent Granted",
    "attachment": "RD_Sanction_Letter_23.pdf"
  },
  {
    "id": "MSG-R24",
    "subject": "Research Ethics & Integrity Committee Review Passed (Ref #923)",
    "message": "Official R&D notification regarding sponsored research grants, Scopus/Web of Science journal acceptances, patent grants, and PhD scholar reviews.",
    "sender": "Dean Graduate Studies",
    "receiver": "R&D Dean Office",
    "date": "2026-08-01 11:30 AM",
    "priority": "Medium",
    "status": "Read",
    "category": "PhD Review"
  },
  {
    "id": "MSG-R25",
    "subject": "DST-SERB Sponsored Research Grant Sanction (₹45.0 Lacs) (Ref #924)",
    "message": "Official R&D notification regarding sponsored research grants, Scopus/Web of Science journal acceptances, patent grants, and PhD scholar reviews.",
    "sender": "DST-SERB Government Project Officer",
    "receiver": "R&D Dean Office",
    "date": "2026-08-06 11:30 AM",
    "priority": "High",
    "status": "Unread",
    "category": "Incubation",
    "attachment": "RD_Sanction_Letter_25.pdf"
  }
]);
  const [sentMsgs, setSentMsgs] = useState([
  {
    "id": "MSG-S01",
    "subject": "Call for Sponsored Research Project Proposals (DST / SERB / AICTE) (Circular #1000)",
    "message": "Official R&D Dean notification issued to all research supervisors, faculty investigators, and PhD scholars across engineering and science streams.",
    "sender": "R&D Dean Office",
    "receiver": "All PhD Supervisors & Research Faculty",
    "date": "2026-08-06 02:45 PM",
    "priority": "High",
    "status": "Delivered",
    "category": "Call for Proposals",
    "attachment": "RD_Circular_1.pdf"
  },
  {
    "id": "MSG-S02",
    "subject": "Research Incentive & Publication Reward Disbursement Clearance (Circular #1001)",
    "message": "Official R&D Dean notification issued to all research supervisors, faculty investigators, and PhD scholars across engineering and science streams.",
    "sender": "R&D Dean Office",
    "receiver": "All Registered PhD Scholars",
    "date": "2026-08-05 02:45 PM",
    "priority": "Medium",
    "status": "Delivered",
    "category": "Incentive Release",
    "attachment": "RD_Circular_2.pdf"
  },
  {
    "id": "MSG-S03",
    "subject": "Patent Filing Assistance & IPR Cell Guidance Advisory (Circular #1002)",
    "message": "Official R&D Dean notification issued to all research supervisors, faculty investigators, and PhD scholars across engineering and science streams.",
    "sender": "R&D Dean Office",
    "receiver": "IPR Cell Members",
    "date": "2026-08-04 02:45 PM",
    "priority": "Medium",
    "status": "Delivered",
    "category": "IPR Advisory",
    "attachment": "RD_Circular_3.pdf"
  },
  {
    "id": "MSG-S04",
    "subject": "PhD Viva-Voce Examination & Defense Schedule Release (Circular #1003)",
    "message": "Official R&D Dean notification issued to all research supervisors, faculty investigators, and PhD scholars across engineering and science streams.",
    "sender": "R&D Dean Office",
    "receiver": "Incubation Center Startups",
    "date": "2026-08-03 02:45 PM",
    "priority": "High",
    "status": "Delivered",
    "category": "PhD Schedule",
    "attachment": "RD_Circular_4.pdf"
  },
  {
    "id": "MSG-S05",
    "subject": "Institutional Seed Money Grant Awardees Announcement (Circular #1004)",
    "message": "Official R&D Dean notification issued to all research supervisors, faculty investigators, and PhD scholars across engineering and science streams.",
    "sender": "R&D Dean Office",
    "receiver": "Department HODs",
    "date": "2026-08-02 02:45 PM",
    "priority": "Medium",
    "status": "Delivered",
    "category": "Seed Grant",
    "attachment": "RD_Circular_5.pdf"
  },
  {
    "id": "MSG-S06",
    "subject": "Scopus Repository Updating & H-Index Audit Circular (Circular #1005)",
    "message": "Official R&D Dean notification issued to all research supervisors, faculty investigators, and PhD scholars across engineering and science streams.",
    "sender": "R&D Dean Office",
    "receiver": "Finance Dean Office",
    "date": "2026-08-01 02:45 PM",
    "priority": "Medium",
    "status": "Delivered",
    "category": "Call for Proposals",
    "attachment": "RD_Circular_6.pdf"
  },
  {
    "id": "MSG-S07",
    "subject": "Consultancy Revenue Sharing & Overhead Account Notice (Circular #1006)",
    "message": "Official R&D Dean notification issued to all research supervisors, faculty investigators, and PhD scholars across engineering and science streams.",
    "sender": "R&D Dean Office",
    "receiver": "Research Advisory Committee",
    "date": "2026-08-06 02:45 PM",
    "priority": "High",
    "status": "Delivered",
    "category": "Incentive Release",
    "attachment": "RD_Circular_7.pdf"
  },
  {
    "id": "MSG-S08",
    "subject": "Annual R&D Conclave & Innovation Expo Announcement (Circular #1007)",
    "message": "Official R&D Dean notification issued to all research supervisors, faculty investigators, and PhD scholars across engineering and science streams.",
    "sender": "R&D Dean Office",
    "receiver": "Dean Office Staff",
    "date": "2026-08-05 02:45 PM",
    "priority": "Medium",
    "status": "Delivered",
    "category": "IPR Advisory",
    "attachment": "RD_Circular_8.pdf"
  },
  {
    "id": "MSG-S09",
    "subject": "Call for Sponsored Research Project Proposals (DST / SERB / AICTE) (Circular #1008)",
    "message": "Official R&D Dean notification issued to all research supervisors, faculty investigators, and PhD scholars across engineering and science streams.",
    "sender": "R&D Dean Office",
    "receiver": "All PhD Supervisors & Research Faculty",
    "date": "2026-08-04 02:45 PM",
    "priority": "Medium",
    "status": "Delivered",
    "category": "PhD Schedule",
    "attachment": "RD_Circular_9.pdf"
  },
  {
    "id": "MSG-S10",
    "subject": "Research Incentive & Publication Reward Disbursement Clearance (Circular #1009)",
    "message": "Official R&D Dean notification issued to all research supervisors, faculty investigators, and PhD scholars across engineering and science streams.",
    "sender": "R&D Dean Office",
    "receiver": "All Registered PhD Scholars",
    "date": "2026-08-03 02:45 PM",
    "priority": "High",
    "status": "Delivered",
    "category": "Seed Grant",
    "attachment": "RD_Circular_10.pdf"
  },
  {
    "id": "MSG-S11",
    "subject": "Patent Filing Assistance & IPR Cell Guidance Advisory (Circular #1010)",
    "message": "Official R&D Dean notification issued to all research supervisors, faculty investigators, and PhD scholars across engineering and science streams.",
    "sender": "R&D Dean Office",
    "receiver": "IPR Cell Members",
    "date": "2026-08-02 02:45 PM",
    "priority": "Medium",
    "status": "Delivered",
    "category": "Call for Proposals",
    "attachment": "RD_Circular_11.pdf"
  },
  {
    "id": "MSG-S12",
    "subject": "PhD Viva-Voce Examination & Defense Schedule Release (Circular #1011)",
    "message": "Official R&D Dean notification issued to all research supervisors, faculty investigators, and PhD scholars across engineering and science streams.",
    "sender": "R&D Dean Office",
    "receiver": "Incubation Center Startups",
    "date": "2026-08-01 02:45 PM",
    "priority": "Medium",
    "status": "Delivered",
    "category": "Incentive Release",
    "attachment": "RD_Circular_12.pdf"
  },
  {
    "id": "MSG-S13",
    "subject": "Institutional Seed Money Grant Awardees Announcement (Circular #1012)",
    "message": "Official R&D Dean notification issued to all research supervisors, faculty investigators, and PhD scholars across engineering and science streams.",
    "sender": "R&D Dean Office",
    "receiver": "Department HODs",
    "date": "2026-08-06 02:45 PM",
    "priority": "High",
    "status": "Delivered",
    "category": "IPR Advisory",
    "attachment": "RD_Circular_13.pdf"
  },
  {
    "id": "MSG-S14",
    "subject": "Scopus Repository Updating & H-Index Audit Circular (Circular #1013)",
    "message": "Official R&D Dean notification issued to all research supervisors, faculty investigators, and PhD scholars across engineering and science streams.",
    "sender": "R&D Dean Office",
    "receiver": "Finance Dean Office",
    "date": "2026-08-05 02:45 PM",
    "priority": "Medium",
    "status": "Delivered",
    "category": "PhD Schedule",
    "attachment": "RD_Circular_14.pdf"
  },
  {
    "id": "MSG-S15",
    "subject": "Consultancy Revenue Sharing & Overhead Account Notice (Circular #1014)",
    "message": "Official R&D Dean notification issued to all research supervisors, faculty investigators, and PhD scholars across engineering and science streams.",
    "sender": "R&D Dean Office",
    "receiver": "Research Advisory Committee",
    "date": "2026-08-04 02:45 PM",
    "priority": "Medium",
    "status": "Delivered",
    "category": "Seed Grant",
    "attachment": "RD_Circular_15.pdf"
  },
  {
    "id": "MSG-S16",
    "subject": "Annual R&D Conclave & Innovation Expo Announcement (Circular #1015)",
    "message": "Official R&D Dean notification issued to all research supervisors, faculty investigators, and PhD scholars across engineering and science streams.",
    "sender": "R&D Dean Office",
    "receiver": "Dean Office Staff",
    "date": "2026-08-03 02:45 PM",
    "priority": "High",
    "status": "Delivered",
    "category": "Call for Proposals",
    "attachment": "RD_Circular_16.pdf"
  },
  {
    "id": "MSG-S17",
    "subject": "Call for Sponsored Research Project Proposals (DST / SERB / AICTE) (Circular #1016)",
    "message": "Official R&D Dean notification issued to all research supervisors, faculty investigators, and PhD scholars across engineering and science streams.",
    "sender": "R&D Dean Office",
    "receiver": "All PhD Supervisors & Research Faculty",
    "date": "2026-08-02 02:45 PM",
    "priority": "Medium",
    "status": "Delivered",
    "category": "Incentive Release",
    "attachment": "RD_Circular_17.pdf"
  },
  {
    "id": "MSG-S18",
    "subject": "Research Incentive & Publication Reward Disbursement Clearance (Circular #1017)",
    "message": "Official R&D Dean notification issued to all research supervisors, faculty investigators, and PhD scholars across engineering and science streams.",
    "sender": "R&D Dean Office",
    "receiver": "All Registered PhD Scholars",
    "date": "2026-08-01 02:45 PM",
    "priority": "Medium",
    "status": "Delivered",
    "category": "IPR Advisory",
    "attachment": "RD_Circular_18.pdf"
  },
  {
    "id": "MSG-S19",
    "subject": "Patent Filing Assistance & IPR Cell Guidance Advisory (Circular #1018)",
    "message": "Official R&D Dean notification issued to all research supervisors, faculty investigators, and PhD scholars across engineering and science streams.",
    "sender": "R&D Dean Office",
    "receiver": "IPR Cell Members",
    "date": "2026-08-06 02:45 PM",
    "priority": "High",
    "status": "Delivered",
    "category": "PhD Schedule",
    "attachment": "RD_Circular_19.pdf"
  },
  {
    "id": "MSG-S20",
    "subject": "PhD Viva-Voce Examination & Defense Schedule Release (Circular #1019)",
    "message": "Official R&D Dean notification issued to all research supervisors, faculty investigators, and PhD scholars across engineering and science streams.",
    "sender": "R&D Dean Office",
    "receiver": "Incubation Center Startups",
    "date": "2026-08-05 02:45 PM",
    "priority": "Medium",
    "status": "Delivered",
    "category": "Seed Grant",
    "attachment": "RD_Circular_20.pdf"
  },
  {
    "id": "MSG-S21",
    "subject": "Institutional Seed Money Grant Awardees Announcement (Circular #1020)",
    "message": "Official R&D Dean notification issued to all research supervisors, faculty investigators, and PhD scholars across engineering and science streams.",
    "sender": "R&D Dean Office",
    "receiver": "Department HODs",
    "date": "2026-08-04 02:45 PM",
    "priority": "Medium",
    "status": "Delivered",
    "category": "Call for Proposals",
    "attachment": "RD_Circular_21.pdf"
  },
  {
    "id": "MSG-S22",
    "subject": "Scopus Repository Updating & H-Index Audit Circular (Circular #1021)",
    "message": "Official R&D Dean notification issued to all research supervisors, faculty investigators, and PhD scholars across engineering and science streams.",
    "sender": "R&D Dean Office",
    "receiver": "Finance Dean Office",
    "date": "2026-08-03 02:45 PM",
    "priority": "High",
    "status": "Delivered",
    "category": "Incentive Release",
    "attachment": "RD_Circular_22.pdf"
  },
  {
    "id": "MSG-S23",
    "subject": "Consultancy Revenue Sharing & Overhead Account Notice (Circular #1022)",
    "message": "Official R&D Dean notification issued to all research supervisors, faculty investigators, and PhD scholars across engineering and science streams.",
    "sender": "R&D Dean Office",
    "receiver": "Research Advisory Committee",
    "date": "2026-08-02 02:45 PM",
    "priority": "Medium",
    "status": "Delivered",
    "category": "IPR Advisory",
    "attachment": "RD_Circular_23.pdf"
  },
  {
    "id": "MSG-S24",
    "subject": "Annual R&D Conclave & Innovation Expo Announcement (Circular #1023)",
    "message": "Official R&D Dean notification issued to all research supervisors, faculty investigators, and PhD scholars across engineering and science streams.",
    "sender": "R&D Dean Office",
    "receiver": "Dean Office Staff",
    "date": "2026-08-01 02:45 PM",
    "priority": "Medium",
    "status": "Delivered",
    "category": "PhD Schedule",
    "attachment": "RD_Circular_24.pdf"
  },
  {
    "id": "MSG-S25",
    "subject": "Call for Sponsored Research Project Proposals (DST / SERB / AICTE) (Circular #1024)",
    "message": "Official R&D Dean notification issued to all research supervisors, faculty investigators, and PhD scholars across engineering and science streams.",
    "sender": "R&D Dean Office",
    "receiver": "All PhD Supervisors & Research Faculty",
    "date": "2026-08-06 02:45 PM",
    "priority": "High",
    "status": "Delivered",
    "category": "Seed Grant",
    "attachment": "RD_Circular_25.pdf"
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
      sender: "Research & Development Dean Office",
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
            <Badge variant="outline" className="font-mono text-[0.65rem] uppercase text-primary border-primary/30">RESEARCH & INNOVATION</Badge>
            <span className="text-xs text-muted-foreground">• Institutional Notifications System</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Notification Center</h1>
          <p className="text-sm text-muted-foreground">Executive communication ledger for Research & Development Dean. Broadcast alerts, circulars, and departmental memos.</p>
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
