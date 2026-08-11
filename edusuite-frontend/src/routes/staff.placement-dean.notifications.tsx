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

export const Route = createFileRoute("/staff/placement-dean/notifications")({
  head: () => ({ meta: [{ title: "Notifications System — Placement Dean" }] }),
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
    "subject": "Microsoft India On-Campus Drive Confirmation (52 LPA) (Ref #1500)",
    "message": "Official Placement Dean notification regarding corporate recruitment drives, shortlist announcements, offer letter verification, and internship drives.",
    "sender": "Microsoft University Relations Lead",
    "receiver": "Placement Dean Office",
    "date": "2026-08-06 11:45 AM",
    "priority": "High",
    "status": "Unread",
    "category": "Corporate Drive",
    "attachment": "Placement_Shortlist_1.pdf"
  },
  {
    "id": "MSG-R02",
    "subject": "Deloitte India Shortlisted Students List (14.5 LPA) (Ref #1501)",
    "message": "Official Placement Dean notification regarding corporate recruitment drives, shortlist announcements, offer letter verification, and internship drives.",
    "sender": "Deloitte Talent Acquisition Team",
    "receiver": "Placement Dean Office",
    "date": "2026-08-05 11:45 AM",
    "priority": "Medium",
    "status": "Read",
    "category": "Shortlist Announced"
  },
  {
    "id": "MSG-R03",
    "subject": "TCS Ninja & Digital National Qualifier Test (NQT) Schedule (Ref #1502)",
    "message": "Official Placement Dean notification regarding corporate recruitment drives, shortlist announcements, offer letter verification, and internship drives.",
    "sender": "TCS Campus Recruitment Office",
    "receiver": "Placement Dean Office",
    "date": "2026-08-04 11:45 AM",
    "priority": "Medium",
    "status": "Read",
    "category": "Offer Letter",
    "attachment": "Placement_Shortlist_3.pdf"
  },
  {
    "id": "MSG-R04",
    "subject": "Signed Corporate Offer Letters Uploaded by HR (Ref #1503)",
    "message": "Official Placement Dean notification regarding corporate recruitment drives, shortlist announcements, offer letter verification, and internship drives.",
    "sender": "Amazon AWS India HR",
    "receiver": "Placement Dean Office",
    "date": "2026-08-03 11:45 AM",
    "priority": "High",
    "status": "Read",
    "category": "Internship"
  },
  {
    "id": "MSG-R05",
    "subject": "Amazon AWS Winter Internship Opportunity Clearance (Ref #1504)",
    "message": "Official Placement Dean notification regarding corporate recruitment drives, shortlist announcements, offer letter verification, and internship drives.",
    "sender": "Infosys Campus Lead",
    "receiver": "Placement Dean Office",
    "date": "2026-08-02 11:45 AM",
    "priority": "Medium",
    "status": "Unread",
    "category": "MoU Signed",
    "attachment": "Placement_Shortlist_5.pdf"
  },
  {
    "id": "MSG-R06",
    "subject": "Recruitment Partner MoU Renewal Confirmation by Infosys (Ref #1505)",
    "message": "Official Placement Dean notification regarding corporate recruitment drives, shortlist announcements, offer letter verification, and internship drives.",
    "sender": "Dr. Ananya Rao (Placement Officer)",
    "receiver": "Placement Dean Office",
    "date": "2026-08-01 11:45 AM",
    "priority": "Medium",
    "status": "Read",
    "category": "Corporate Drive"
  },
  {
    "id": "MSG-R07",
    "subject": "Pre-Placement Talk (PPT) Venue Booking Sanction (Ref #1506)",
    "message": "Official Placement Dean notification regarding corporate recruitment drives, shortlist announcements, offer letter verification, and internship drives.",
    "sender": "Student Placement Committee",
    "receiver": "Placement Dean Office",
    "date": "2026-08-06 11:45 AM",
    "priority": "High",
    "status": "Read",
    "category": "Shortlist Announced",
    "attachment": "Placement_Shortlist_7.pdf"
  },
  {
    "id": "MSG-R08",
    "subject": "Placement Eligibility & CGPA Shortlist Verification Report (Ref #1507)",
    "message": "Official Placement Dean notification regarding corporate recruitment drives, shortlist announcements, offer letter verification, and internship drives.",
    "sender": "Corporate Relations Manager",
    "receiver": "Placement Dean Office",
    "date": "2026-08-05 11:45 AM",
    "priority": "Medium",
    "status": "Read",
    "category": "Offer Letter"
  },
  {
    "id": "MSG-R09",
    "subject": "Microsoft India On-Campus Drive Confirmation (52 LPA) (Ref #1508)",
    "message": "Official Placement Dean notification regarding corporate recruitment drives, shortlist announcements, offer letter verification, and internship drives.",
    "sender": "Microsoft University Relations Lead",
    "receiver": "Placement Dean Office",
    "date": "2026-08-04 11:45 AM",
    "priority": "Medium",
    "status": "Unread",
    "category": "Internship",
    "attachment": "Placement_Shortlist_9.pdf"
  },
  {
    "id": "MSG-R10",
    "subject": "Deloitte India Shortlisted Students List (14.5 LPA) (Ref #1509)",
    "message": "Official Placement Dean notification regarding corporate recruitment drives, shortlist announcements, offer letter verification, and internship drives.",
    "sender": "Deloitte Talent Acquisition Team",
    "receiver": "Placement Dean Office",
    "date": "2026-08-03 11:45 AM",
    "priority": "High",
    "status": "Read",
    "category": "MoU Signed"
  },
  {
    "id": "MSG-R11",
    "subject": "TCS Ninja & Digital National Qualifier Test (NQT) Schedule (Ref #1510)",
    "message": "Official Placement Dean notification regarding corporate recruitment drives, shortlist announcements, offer letter verification, and internship drives.",
    "sender": "TCS Campus Recruitment Office",
    "receiver": "Placement Dean Office",
    "date": "2026-08-02 11:45 AM",
    "priority": "Medium",
    "status": "Read",
    "category": "Corporate Drive",
    "attachment": "Placement_Shortlist_11.pdf"
  },
  {
    "id": "MSG-R12",
    "subject": "Signed Corporate Offer Letters Uploaded by HR (Ref #1511)",
    "message": "Official Placement Dean notification regarding corporate recruitment drives, shortlist announcements, offer letter verification, and internship drives.",
    "sender": "Amazon AWS India HR",
    "receiver": "Placement Dean Office",
    "date": "2026-08-01 11:45 AM",
    "priority": "Medium",
    "status": "Read",
    "category": "Shortlist Announced"
  },
  {
    "id": "MSG-R13",
    "subject": "Amazon AWS Winter Internship Opportunity Clearance (Ref #1512)",
    "message": "Official Placement Dean notification regarding corporate recruitment drives, shortlist announcements, offer letter verification, and internship drives.",
    "sender": "Infosys Campus Lead",
    "receiver": "Placement Dean Office",
    "date": "2026-08-06 11:45 AM",
    "priority": "High",
    "status": "Unread",
    "category": "Offer Letter",
    "attachment": "Placement_Shortlist_13.pdf"
  },
  {
    "id": "MSG-R14",
    "subject": "Recruitment Partner MoU Renewal Confirmation by Infosys (Ref #1513)",
    "message": "Official Placement Dean notification regarding corporate recruitment drives, shortlist announcements, offer letter verification, and internship drives.",
    "sender": "Dr. Ananya Rao (Placement Officer)",
    "receiver": "Placement Dean Office",
    "date": "2026-08-05 11:45 AM",
    "priority": "Medium",
    "status": "Read",
    "category": "Internship"
  },
  {
    "id": "MSG-R15",
    "subject": "Pre-Placement Talk (PPT) Venue Booking Sanction (Ref #1514)",
    "message": "Official Placement Dean notification regarding corporate recruitment drives, shortlist announcements, offer letter verification, and internship drives.",
    "sender": "Student Placement Committee",
    "receiver": "Placement Dean Office",
    "date": "2026-08-04 11:45 AM",
    "priority": "Medium",
    "status": "Read",
    "category": "MoU Signed",
    "attachment": "Placement_Shortlist_15.pdf"
  },
  {
    "id": "MSG-R16",
    "subject": "Placement Eligibility & CGPA Shortlist Verification Report (Ref #1515)",
    "message": "Official Placement Dean notification regarding corporate recruitment drives, shortlist announcements, offer letter verification, and internship drives.",
    "sender": "Corporate Relations Manager",
    "receiver": "Placement Dean Office",
    "date": "2026-08-03 11:45 AM",
    "priority": "High",
    "status": "Read",
    "category": "Corporate Drive"
  },
  {
    "id": "MSG-R17",
    "subject": "Microsoft India On-Campus Drive Confirmation (52 LPA) (Ref #1516)",
    "message": "Official Placement Dean notification regarding corporate recruitment drives, shortlist announcements, offer letter verification, and internship drives.",
    "sender": "Microsoft University Relations Lead",
    "receiver": "Placement Dean Office",
    "date": "2026-08-02 11:45 AM",
    "priority": "Medium",
    "status": "Unread",
    "category": "Shortlist Announced",
    "attachment": "Placement_Shortlist_17.pdf"
  },
  {
    "id": "MSG-R18",
    "subject": "Deloitte India Shortlisted Students List (14.5 LPA) (Ref #1517)",
    "message": "Official Placement Dean notification regarding corporate recruitment drives, shortlist announcements, offer letter verification, and internship drives.",
    "sender": "Deloitte Talent Acquisition Team",
    "receiver": "Placement Dean Office",
    "date": "2026-08-01 11:45 AM",
    "priority": "Medium",
    "status": "Read",
    "category": "Offer Letter"
  },
  {
    "id": "MSG-R19",
    "subject": "TCS Ninja & Digital National Qualifier Test (NQT) Schedule (Ref #1518)",
    "message": "Official Placement Dean notification regarding corporate recruitment drives, shortlist announcements, offer letter verification, and internship drives.",
    "sender": "TCS Campus Recruitment Office",
    "receiver": "Placement Dean Office",
    "date": "2026-08-06 11:45 AM",
    "priority": "High",
    "status": "Read",
    "category": "Internship",
    "attachment": "Placement_Shortlist_19.pdf"
  },
  {
    "id": "MSG-R20",
    "subject": "Signed Corporate Offer Letters Uploaded by HR (Ref #1519)",
    "message": "Official Placement Dean notification regarding corporate recruitment drives, shortlist announcements, offer letter verification, and internship drives.",
    "sender": "Amazon AWS India HR",
    "receiver": "Placement Dean Office",
    "date": "2026-08-05 11:45 AM",
    "priority": "Medium",
    "status": "Read",
    "category": "MoU Signed"
  },
  {
    "id": "MSG-R21",
    "subject": "Amazon AWS Winter Internship Opportunity Clearance (Ref #1520)",
    "message": "Official Placement Dean notification regarding corporate recruitment drives, shortlist announcements, offer letter verification, and internship drives.",
    "sender": "Infosys Campus Lead",
    "receiver": "Placement Dean Office",
    "date": "2026-08-04 11:45 AM",
    "priority": "Medium",
    "status": "Unread",
    "category": "Corporate Drive",
    "attachment": "Placement_Shortlist_21.pdf"
  },
  {
    "id": "MSG-R22",
    "subject": "Recruitment Partner MoU Renewal Confirmation by Infosys (Ref #1521)",
    "message": "Official Placement Dean notification regarding corporate recruitment drives, shortlist announcements, offer letter verification, and internship drives.",
    "sender": "Dr. Ananya Rao (Placement Officer)",
    "receiver": "Placement Dean Office",
    "date": "2026-08-03 11:45 AM",
    "priority": "High",
    "status": "Read",
    "category": "Shortlist Announced"
  },
  {
    "id": "MSG-R23",
    "subject": "Pre-Placement Talk (PPT) Venue Booking Sanction (Ref #1522)",
    "message": "Official Placement Dean notification regarding corporate recruitment drives, shortlist announcements, offer letter verification, and internship drives.",
    "sender": "Student Placement Committee",
    "receiver": "Placement Dean Office",
    "date": "2026-08-02 11:45 AM",
    "priority": "Medium",
    "status": "Read",
    "category": "Offer Letter",
    "attachment": "Placement_Shortlist_23.pdf"
  },
  {
    "id": "MSG-R24",
    "subject": "Placement Eligibility & CGPA Shortlist Verification Report (Ref #1523)",
    "message": "Official Placement Dean notification regarding corporate recruitment drives, shortlist announcements, offer letter verification, and internship drives.",
    "sender": "Corporate Relations Manager",
    "receiver": "Placement Dean Office",
    "date": "2026-08-01 11:45 AM",
    "priority": "Medium",
    "status": "Read",
    "category": "Internship"
  },
  {
    "id": "MSG-R25",
    "subject": "Microsoft India On-Campus Drive Confirmation (52 LPA) (Ref #1524)",
    "message": "Official Placement Dean notification regarding corporate recruitment drives, shortlist announcements, offer letter verification, and internship drives.",
    "sender": "Microsoft University Relations Lead",
    "receiver": "Placement Dean Office",
    "date": "2026-08-06 11:45 AM",
    "priority": "High",
    "status": "Unread",
    "category": "MoU Signed",
    "attachment": "Placement_Shortlist_25.pdf"
  }
]);
  const [sentMsgs, setSentMsgs] = useState([
  {
    "id": "MSG-S01",
    "subject": "Microsoft India Placement Drive Registration Open for 2026 Batch (Notice #1600)",
    "message": "Official Placement Dean broadcast notification issued to all eligible final year and pre-final year engineering students.",
    "sender": "Placement Dean Office",
    "receiver": "All Eligible Final Year Students (1,640)",
    "date": "2026-08-06 06:15 PM",
    "priority": "High",
    "status": "Delivered",
    "category": "Drive Registration",
    "attachment": "Placement_Circular_1.pdf"
  },
  {
    "id": "MSG-S02",
    "subject": "Deloitte India Technical Round & Interview Schedule Released (Notice #1601)",
    "message": "Official Placement Dean broadcast notification issued to all eligible final year and pre-final year engineering students.",
    "sender": "Placement Dean Office",
    "receiver": "Pre-Final Year Engineering Students",
    "date": "2026-08-05 06:15 PM",
    "priority": "Medium",
    "status": "Delivered",
    "category": "Interview Schedule",
    "attachment": "Placement_Circular_2.pdf"
  },
  {
    "id": "MSG-S03",
    "subject": "TCS National Qualifier Drive Instructions & Hall Ticket Release (Notice #1602)",
    "message": "Official Placement Dean broadcast notification issued to all eligible final year and pre-final year engineering students.",
    "sender": "Placement Dean Office",
    "receiver": "Department Placement Coordinators",
    "date": "2026-08-04 06:15 PM",
    "priority": "Medium",
    "status": "Delivered",
    "category": "Offer Notice",
    "attachment": "Placement_Circular_3.pdf"
  },
  {
    "id": "MSG-S04",
    "subject": "Selected Students Announcement & Offer Letter Distribution Notice (Notice #1603)",
    "message": "Official Placement Dean broadcast notification issued to all eligible final year and pre-final year engineering students.",
    "sender": "Placement Dean Office",
    "receiver": "Corporate HR Partners",
    "date": "2026-08-03 06:15 PM",
    "priority": "High",
    "status": "Delivered",
    "category": "Internship Alert",
    "attachment": "Placement_Circular_4.pdf"
  },
  {
    "id": "MSG-S05",
    "subject": "Amazon AWS Internship Application Directive for B.Tech 3rd Years (Notice #1604)",
    "message": "Official Placement Dean broadcast notification issued to all eligible final year and pre-final year engineering students.",
    "sender": "Placement Dean Office",
    "receiver": "Academic Dean Office",
    "date": "2026-08-02 06:15 PM",
    "priority": "Medium",
    "status": "Delivered",
    "category": "Mock Interview",
    "attachment": "Placement_Circular_5.pdf"
  },
  {
    "id": "MSG-S06",
    "subject": "Pre-Placement Mock Technical Interview Schedule for CSE & ECE (Notice #1605)",
    "message": "Official Placement Dean broadcast notification issued to all eligible final year and pre-final year engineering students.",
    "sender": "Placement Dean Office",
    "receiver": "Student Dean Office",
    "date": "2026-08-01 06:15 PM",
    "priority": "Medium",
    "status": "Delivered",
    "category": "Drive Registration",
    "attachment": "Placement_Circular_6.pdf"
  },
  {
    "id": "MSG-S07",
    "subject": "Corporate Resume Verification & Portfolio Upload Reminder (Notice #1606)",
    "message": "Official Placement Dean broadcast notification issued to all eligible final year and pre-final year engineering students.",
    "sender": "Placement Dean Office",
    "receiver": "Campus Training Cell",
    "date": "2026-08-06 06:15 PM",
    "priority": "High",
    "status": "Delivered",
    "category": "Interview Schedule",
    "attachment": "Placement_Circular_7.pdf"
  },
  {
    "id": "MSG-S08",
    "subject": "Off-Campus Placement Opportunity Alert for Graduating Batch (Notice #1607)",
    "message": "Official Placement Dean broadcast notification issued to all eligible final year and pre-final year engineering students.",
    "sender": "Placement Dean Office",
    "receiver": "Placement Student Volunteers",
    "date": "2026-08-05 06:15 PM",
    "priority": "Medium",
    "status": "Delivered",
    "category": "Offer Notice",
    "attachment": "Placement_Circular_8.pdf"
  },
  {
    "id": "MSG-S09",
    "subject": "Microsoft India Placement Drive Registration Open for 2026 Batch (Notice #1608)",
    "message": "Official Placement Dean broadcast notification issued to all eligible final year and pre-final year engineering students.",
    "sender": "Placement Dean Office",
    "receiver": "All Eligible Final Year Students (1,640)",
    "date": "2026-08-04 06:15 PM",
    "priority": "Medium",
    "status": "Delivered",
    "category": "Internship Alert",
    "attachment": "Placement_Circular_9.pdf"
  },
  {
    "id": "MSG-S10",
    "subject": "Deloitte India Technical Round & Interview Schedule Released (Notice #1609)",
    "message": "Official Placement Dean broadcast notification issued to all eligible final year and pre-final year engineering students.",
    "sender": "Placement Dean Office",
    "receiver": "Pre-Final Year Engineering Students",
    "date": "2026-08-03 06:15 PM",
    "priority": "High",
    "status": "Delivered",
    "category": "Mock Interview",
    "attachment": "Placement_Circular_10.pdf"
  },
  {
    "id": "MSG-S11",
    "subject": "TCS National Qualifier Drive Instructions & Hall Ticket Release (Notice #1610)",
    "message": "Official Placement Dean broadcast notification issued to all eligible final year and pre-final year engineering students.",
    "sender": "Placement Dean Office",
    "receiver": "Department Placement Coordinators",
    "date": "2026-08-02 06:15 PM",
    "priority": "Medium",
    "status": "Delivered",
    "category": "Drive Registration",
    "attachment": "Placement_Circular_11.pdf"
  },
  {
    "id": "MSG-S12",
    "subject": "Selected Students Announcement & Offer Letter Distribution Notice (Notice #1611)",
    "message": "Official Placement Dean broadcast notification issued to all eligible final year and pre-final year engineering students.",
    "sender": "Placement Dean Office",
    "receiver": "Corporate HR Partners",
    "date": "2026-08-01 06:15 PM",
    "priority": "Medium",
    "status": "Delivered",
    "category": "Interview Schedule",
    "attachment": "Placement_Circular_12.pdf"
  },
  {
    "id": "MSG-S13",
    "subject": "Amazon AWS Internship Application Directive for B.Tech 3rd Years (Notice #1612)",
    "message": "Official Placement Dean broadcast notification issued to all eligible final year and pre-final year engineering students.",
    "sender": "Placement Dean Office",
    "receiver": "Academic Dean Office",
    "date": "2026-08-06 06:15 PM",
    "priority": "High",
    "status": "Delivered",
    "category": "Offer Notice",
    "attachment": "Placement_Circular_13.pdf"
  },
  {
    "id": "MSG-S14",
    "subject": "Pre-Placement Mock Technical Interview Schedule for CSE & ECE (Notice #1613)",
    "message": "Official Placement Dean broadcast notification issued to all eligible final year and pre-final year engineering students.",
    "sender": "Placement Dean Office",
    "receiver": "Student Dean Office",
    "date": "2026-08-05 06:15 PM",
    "priority": "Medium",
    "status": "Delivered",
    "category": "Internship Alert",
    "attachment": "Placement_Circular_14.pdf"
  },
  {
    "id": "MSG-S15",
    "subject": "Corporate Resume Verification & Portfolio Upload Reminder (Notice #1614)",
    "message": "Official Placement Dean broadcast notification issued to all eligible final year and pre-final year engineering students.",
    "sender": "Placement Dean Office",
    "receiver": "Campus Training Cell",
    "date": "2026-08-04 06:15 PM",
    "priority": "Medium",
    "status": "Delivered",
    "category": "Mock Interview",
    "attachment": "Placement_Circular_15.pdf"
  },
  {
    "id": "MSG-S16",
    "subject": "Off-Campus Placement Opportunity Alert for Graduating Batch (Notice #1615)",
    "message": "Official Placement Dean broadcast notification issued to all eligible final year and pre-final year engineering students.",
    "sender": "Placement Dean Office",
    "receiver": "Placement Student Volunteers",
    "date": "2026-08-03 06:15 PM",
    "priority": "High",
    "status": "Delivered",
    "category": "Drive Registration",
    "attachment": "Placement_Circular_16.pdf"
  },
  {
    "id": "MSG-S17",
    "subject": "Microsoft India Placement Drive Registration Open for 2026 Batch (Notice #1616)",
    "message": "Official Placement Dean broadcast notification issued to all eligible final year and pre-final year engineering students.",
    "sender": "Placement Dean Office",
    "receiver": "All Eligible Final Year Students (1,640)",
    "date": "2026-08-02 06:15 PM",
    "priority": "Medium",
    "status": "Delivered",
    "category": "Interview Schedule",
    "attachment": "Placement_Circular_17.pdf"
  },
  {
    "id": "MSG-S18",
    "subject": "Deloitte India Technical Round & Interview Schedule Released (Notice #1617)",
    "message": "Official Placement Dean broadcast notification issued to all eligible final year and pre-final year engineering students.",
    "sender": "Placement Dean Office",
    "receiver": "Pre-Final Year Engineering Students",
    "date": "2026-08-01 06:15 PM",
    "priority": "Medium",
    "status": "Delivered",
    "category": "Offer Notice",
    "attachment": "Placement_Circular_18.pdf"
  },
  {
    "id": "MSG-S19",
    "subject": "TCS National Qualifier Drive Instructions & Hall Ticket Release (Notice #1618)",
    "message": "Official Placement Dean broadcast notification issued to all eligible final year and pre-final year engineering students.",
    "sender": "Placement Dean Office",
    "receiver": "Department Placement Coordinators",
    "date": "2026-08-06 06:15 PM",
    "priority": "High",
    "status": "Delivered",
    "category": "Internship Alert",
    "attachment": "Placement_Circular_19.pdf"
  },
  {
    "id": "MSG-S20",
    "subject": "Selected Students Announcement & Offer Letter Distribution Notice (Notice #1619)",
    "message": "Official Placement Dean broadcast notification issued to all eligible final year and pre-final year engineering students.",
    "sender": "Placement Dean Office",
    "receiver": "Corporate HR Partners",
    "date": "2026-08-05 06:15 PM",
    "priority": "Medium",
    "status": "Delivered",
    "category": "Mock Interview",
    "attachment": "Placement_Circular_20.pdf"
  },
  {
    "id": "MSG-S21",
    "subject": "Amazon AWS Internship Application Directive for B.Tech 3rd Years (Notice #1620)",
    "message": "Official Placement Dean broadcast notification issued to all eligible final year and pre-final year engineering students.",
    "sender": "Placement Dean Office",
    "receiver": "Academic Dean Office",
    "date": "2026-08-04 06:15 PM",
    "priority": "Medium",
    "status": "Delivered",
    "category": "Drive Registration",
    "attachment": "Placement_Circular_21.pdf"
  },
  {
    "id": "MSG-S22",
    "subject": "Pre-Placement Mock Technical Interview Schedule for CSE & ECE (Notice #1621)",
    "message": "Official Placement Dean broadcast notification issued to all eligible final year and pre-final year engineering students.",
    "sender": "Placement Dean Office",
    "receiver": "Student Dean Office",
    "date": "2026-08-03 06:15 PM",
    "priority": "High",
    "status": "Delivered",
    "category": "Interview Schedule",
    "attachment": "Placement_Circular_22.pdf"
  },
  {
    "id": "MSG-S23",
    "subject": "Corporate Resume Verification & Portfolio Upload Reminder (Notice #1622)",
    "message": "Official Placement Dean broadcast notification issued to all eligible final year and pre-final year engineering students.",
    "sender": "Placement Dean Office",
    "receiver": "Campus Training Cell",
    "date": "2026-08-02 06:15 PM",
    "priority": "Medium",
    "status": "Delivered",
    "category": "Offer Notice",
    "attachment": "Placement_Circular_23.pdf"
  },
  {
    "id": "MSG-S24",
    "subject": "Off-Campus Placement Opportunity Alert for Graduating Batch (Notice #1623)",
    "message": "Official Placement Dean broadcast notification issued to all eligible final year and pre-final year engineering students.",
    "sender": "Placement Dean Office",
    "receiver": "Placement Student Volunteers",
    "date": "2026-08-01 06:15 PM",
    "priority": "Medium",
    "status": "Delivered",
    "category": "Internship Alert",
    "attachment": "Placement_Circular_24.pdf"
  },
  {
    "id": "MSG-S25",
    "subject": "Microsoft India Placement Drive Registration Open for 2026 Batch (Notice #1624)",
    "message": "Official Placement Dean broadcast notification issued to all eligible final year and pre-final year engineering students.",
    "sender": "Placement Dean Office",
    "receiver": "All Eligible Final Year Students (1,640)",
    "date": "2026-08-06 06:15 PM",
    "priority": "High",
    "status": "Delivered",
    "category": "Mock Interview",
    "attachment": "Placement_Circular_25.pdf"
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
      sender: "Placement Dean Office",
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
            <Badge variant="outline" className="font-mono text-[0.65rem] uppercase text-primary border-primary/30">PLACEMENT CELL</Badge>
            <span className="text-xs text-muted-foreground">• Institutional Notifications System</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Notification Center</h1>
          <p className="text-sm text-muted-foreground">Executive communication ledger for Placement Dean. Broadcast alerts, circulars, and departmental memos.</p>
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
