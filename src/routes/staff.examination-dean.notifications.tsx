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

export const Route = createFileRoute("/staff/examination-dean/notifications")({
  head: () => ({ meta: [{ title: "Notifications System — Examination Dean" }] }),
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
    "subject": "Mid-Term Examination Answer Script Valuation Completion (Ref #1300)",
    "message": "Official Examination Dean notification regarding semester exam timetables, question paper confidentiality, invigilation duty, and result publication.",
    "sender": "Chief Superintendent of Exams",
    "receiver": "Examination Dean Office",
    "date": "2026-08-06 08:30 AM",
    "priority": "High",
    "status": "Unread",
    "category": "Exam Schedule",
    "attachment": "Exam_Ledger_1.pdf"
  },
  {
    "id": "MSG-R02",
    "subject": "Hall Ticket Barcode Verification Audit Passed (Ref #1301)",
    "message": "Official Examination Dean notification regarding semester exam timetables, question paper confidentiality, invigilation duty, and result publication.",
    "sender": "Dr. Srinivas Rao (HOD CSE)",
    "receiver": "Examination Dean Office",
    "date": "2026-08-05 08:30 AM",
    "priority": "Medium",
    "status": "Read",
    "category": "Hall Tickets"
  },
  {
    "id": "MSG-R03",
    "subject": "Confidential Question Paper Submission by HOD CSE (Ref #1302)",
    "message": "Official Examination Dean notification regarding semester exam timetables, question paper confidentiality, invigilation duty, and result publication.",
    "sender": "Dr. Priya Sharma (HOD ECE)",
    "receiver": "Examination Dean Office",
    "date": "2026-08-04 08:30 AM",
    "priority": "Medium",
    "status": "Read",
    "category": "Marks Submitted",
    "attachment": "Exam_Ledger_3.pdf"
  },
  {
    "id": "MSG-R04",
    "subject": "Invigilator Allocation & Hall Duty Acceptance Summary (Ref #1303)",
    "message": "Official Examination Dean notification regarding semester exam timetables, question paper confidentiality, invigilation duty, and result publication.",
    "sender": "Valuation Center Coordinator",
    "receiver": "Examination Dean Office",
    "date": "2026-08-03 08:30 AM",
    "priority": "High",
    "status": "Read",
    "category": "Result Published"
  },
  {
    "id": "MSG-R05",
    "subject": "Student Revaluation & Photo-Copy Request Submissions (Ref #1304)",
    "message": "Official Examination Dean notification regarding semester exam timetables, question paper confidentiality, invigilation duty, and result publication.",
    "sender": "Malpractice Inquiry Committee",
    "receiver": "Examination Dean Office",
    "date": "2026-08-02 08:30 AM",
    "priority": "Medium",
    "status": "Unread",
    "category": "Revaluation",
    "attachment": "Exam_Ledger_5.pdf"
  },
  {
    "id": "MSG-R06",
    "subject": "Examination Malpractice (MPC) Hearing Committee Summary (Ref #1305)",
    "message": "Official Examination Dean notification regarding semester exam timetables, question paper confidentiality, invigilation duty, and result publication.",
    "sender": "Tabulation Officer",
    "receiver": "Examination Dean Office",
    "date": "2026-08-01 08:30 AM",
    "priority": "Medium",
    "status": "Read",
    "category": "Exam Schedule"
  },
  {
    "id": "MSG-R07",
    "subject": "End-Semester SGPA / CGPA Result Processing Verification (Ref #1306)",
    "message": "Official Examination Dean notification regarding semester exam timetables, question paper confidentiality, invigilation duty, and result publication.",
    "sender": "University Exam Cell",
    "receiver": "Examination Dean Office",
    "date": "2026-08-06 08:30 AM",
    "priority": "High",
    "status": "Read",
    "category": "Hall Tickets",
    "attachment": "Exam_Ledger_7.pdf"
  },
  {
    "id": "MSG-R08",
    "subject": "Degree Certificate Hologram & Gold Medalist Approval (Ref #1307)",
    "message": "Official Examination Dean notification regarding semester exam timetables, question paper confidentiality, invigilation duty, and result publication.",
    "sender": "Academic Audit Lead",
    "receiver": "Examination Dean Office",
    "date": "2026-08-05 08:30 AM",
    "priority": "Medium",
    "status": "Read",
    "category": "Marks Submitted"
  },
  {
    "id": "MSG-R09",
    "subject": "Mid-Term Examination Answer Script Valuation Completion (Ref #1308)",
    "message": "Official Examination Dean notification regarding semester exam timetables, question paper confidentiality, invigilation duty, and result publication.",
    "sender": "Chief Superintendent of Exams",
    "receiver": "Examination Dean Office",
    "date": "2026-08-04 08:30 AM",
    "priority": "Medium",
    "status": "Unread",
    "category": "Result Published",
    "attachment": "Exam_Ledger_9.pdf"
  },
  {
    "id": "MSG-R10",
    "subject": "Hall Ticket Barcode Verification Audit Passed (Ref #1309)",
    "message": "Official Examination Dean notification regarding semester exam timetables, question paper confidentiality, invigilation duty, and result publication.",
    "sender": "Dr. Srinivas Rao (HOD CSE)",
    "receiver": "Examination Dean Office",
    "date": "2026-08-03 08:30 AM",
    "priority": "High",
    "status": "Read",
    "category": "Revaluation"
  },
  {
    "id": "MSG-R11",
    "subject": "Confidential Question Paper Submission by HOD CSE (Ref #1310)",
    "message": "Official Examination Dean notification regarding semester exam timetables, question paper confidentiality, invigilation duty, and result publication.",
    "sender": "Dr. Priya Sharma (HOD ECE)",
    "receiver": "Examination Dean Office",
    "date": "2026-08-02 08:30 AM",
    "priority": "Medium",
    "status": "Read",
    "category": "Exam Schedule",
    "attachment": "Exam_Ledger_11.pdf"
  },
  {
    "id": "MSG-R12",
    "subject": "Invigilator Allocation & Hall Duty Acceptance Summary (Ref #1311)",
    "message": "Official Examination Dean notification regarding semester exam timetables, question paper confidentiality, invigilation duty, and result publication.",
    "sender": "Valuation Center Coordinator",
    "receiver": "Examination Dean Office",
    "date": "2026-08-01 08:30 AM",
    "priority": "Medium",
    "status": "Read",
    "category": "Hall Tickets"
  },
  {
    "id": "MSG-R13",
    "subject": "Student Revaluation & Photo-Copy Request Submissions (Ref #1312)",
    "message": "Official Examination Dean notification regarding semester exam timetables, question paper confidentiality, invigilation duty, and result publication.",
    "sender": "Malpractice Inquiry Committee",
    "receiver": "Examination Dean Office",
    "date": "2026-08-06 08:30 AM",
    "priority": "High",
    "status": "Unread",
    "category": "Marks Submitted",
    "attachment": "Exam_Ledger_13.pdf"
  },
  {
    "id": "MSG-R14",
    "subject": "Examination Malpractice (MPC) Hearing Committee Summary (Ref #1313)",
    "message": "Official Examination Dean notification regarding semester exam timetables, question paper confidentiality, invigilation duty, and result publication.",
    "sender": "Tabulation Officer",
    "receiver": "Examination Dean Office",
    "date": "2026-08-05 08:30 AM",
    "priority": "Medium",
    "status": "Read",
    "category": "Result Published"
  },
  {
    "id": "MSG-R15",
    "subject": "End-Semester SGPA / CGPA Result Processing Verification (Ref #1314)",
    "message": "Official Examination Dean notification regarding semester exam timetables, question paper confidentiality, invigilation duty, and result publication.",
    "sender": "University Exam Cell",
    "receiver": "Examination Dean Office",
    "date": "2026-08-04 08:30 AM",
    "priority": "Medium",
    "status": "Read",
    "category": "Revaluation",
    "attachment": "Exam_Ledger_15.pdf"
  },
  {
    "id": "MSG-R16",
    "subject": "Degree Certificate Hologram & Gold Medalist Approval (Ref #1315)",
    "message": "Official Examination Dean notification regarding semester exam timetables, question paper confidentiality, invigilation duty, and result publication.",
    "sender": "Academic Audit Lead",
    "receiver": "Examination Dean Office",
    "date": "2026-08-03 08:30 AM",
    "priority": "High",
    "status": "Read",
    "category": "Exam Schedule"
  },
  {
    "id": "MSG-R17",
    "subject": "Mid-Term Examination Answer Script Valuation Completion (Ref #1316)",
    "message": "Official Examination Dean notification regarding semester exam timetables, question paper confidentiality, invigilation duty, and result publication.",
    "sender": "Chief Superintendent of Exams",
    "receiver": "Examination Dean Office",
    "date": "2026-08-02 08:30 AM",
    "priority": "Medium",
    "status": "Unread",
    "category": "Hall Tickets",
    "attachment": "Exam_Ledger_17.pdf"
  },
  {
    "id": "MSG-R18",
    "subject": "Hall Ticket Barcode Verification Audit Passed (Ref #1317)",
    "message": "Official Examination Dean notification regarding semester exam timetables, question paper confidentiality, invigilation duty, and result publication.",
    "sender": "Dr. Srinivas Rao (HOD CSE)",
    "receiver": "Examination Dean Office",
    "date": "2026-08-01 08:30 AM",
    "priority": "Medium",
    "status": "Read",
    "category": "Marks Submitted"
  },
  {
    "id": "MSG-R19",
    "subject": "Confidential Question Paper Submission by HOD CSE (Ref #1318)",
    "message": "Official Examination Dean notification regarding semester exam timetables, question paper confidentiality, invigilation duty, and result publication.",
    "sender": "Dr. Priya Sharma (HOD ECE)",
    "receiver": "Examination Dean Office",
    "date": "2026-08-06 08:30 AM",
    "priority": "High",
    "status": "Read",
    "category": "Result Published",
    "attachment": "Exam_Ledger_19.pdf"
  },
  {
    "id": "MSG-R20",
    "subject": "Invigilator Allocation & Hall Duty Acceptance Summary (Ref #1319)",
    "message": "Official Examination Dean notification regarding semester exam timetables, question paper confidentiality, invigilation duty, and result publication.",
    "sender": "Valuation Center Coordinator",
    "receiver": "Examination Dean Office",
    "date": "2026-08-05 08:30 AM",
    "priority": "Medium",
    "status": "Read",
    "category": "Revaluation"
  },
  {
    "id": "MSG-R21",
    "subject": "Student Revaluation & Photo-Copy Request Submissions (Ref #1320)",
    "message": "Official Examination Dean notification regarding semester exam timetables, question paper confidentiality, invigilation duty, and result publication.",
    "sender": "Malpractice Inquiry Committee",
    "receiver": "Examination Dean Office",
    "date": "2026-08-04 08:30 AM",
    "priority": "Medium",
    "status": "Unread",
    "category": "Exam Schedule",
    "attachment": "Exam_Ledger_21.pdf"
  },
  {
    "id": "MSG-R22",
    "subject": "Examination Malpractice (MPC) Hearing Committee Summary (Ref #1321)",
    "message": "Official Examination Dean notification regarding semester exam timetables, question paper confidentiality, invigilation duty, and result publication.",
    "sender": "Tabulation Officer",
    "receiver": "Examination Dean Office",
    "date": "2026-08-03 08:30 AM",
    "priority": "High",
    "status": "Read",
    "category": "Hall Tickets"
  },
  {
    "id": "MSG-R23",
    "subject": "End-Semester SGPA / CGPA Result Processing Verification (Ref #1322)",
    "message": "Official Examination Dean notification regarding semester exam timetables, question paper confidentiality, invigilation duty, and result publication.",
    "sender": "University Exam Cell",
    "receiver": "Examination Dean Office",
    "date": "2026-08-02 08:30 AM",
    "priority": "Medium",
    "status": "Read",
    "category": "Marks Submitted",
    "attachment": "Exam_Ledger_23.pdf"
  },
  {
    "id": "MSG-R24",
    "subject": "Degree Certificate Hologram & Gold Medalist Approval (Ref #1323)",
    "message": "Official Examination Dean notification regarding semester exam timetables, question paper confidentiality, invigilation duty, and result publication.",
    "sender": "Academic Audit Lead",
    "receiver": "Examination Dean Office",
    "date": "2026-08-01 08:30 AM",
    "priority": "Medium",
    "status": "Read",
    "category": "Result Published"
  },
  {
    "id": "MSG-R25",
    "subject": "Mid-Term Examination Answer Script Valuation Completion (Ref #1324)",
    "message": "Official Examination Dean notification regarding semester exam timetables, question paper confidentiality, invigilation duty, and result publication.",
    "sender": "Chief Superintendent of Exams",
    "receiver": "Examination Dean Office",
    "date": "2026-08-06 08:30 AM",
    "priority": "High",
    "status": "Unread",
    "category": "Revaluation",
    "attachment": "Exam_Ledger_25.pdf"
  }
]);
  const [sentMsgs, setSentMsgs] = useState([
  {
    "id": "MSG-S01",
    "subject": "Autumn Semester Main Examination Timetable Released (Circular #1400)",
    "message": "Official Examination Dean broadcast notification issued to all department exam coordinators, invigilators, and appearing students.",
    "sender": "Examination Dean Office",
    "receiver": "All Department Exam Coordinators",
    "date": "2026-08-06 01:30 PM",
    "priority": "High",
    "status": "Delivered",
    "category": "Exam Timetable",
    "attachment": "Exam_Circular_1.pdf"
  },
  {
    "id": "MSG-S02",
    "subject": "Hall Ticket Download Portal Activation for Eligible Students (Circular #1401)",
    "message": "Official Examination Dean broadcast notification issued to all department exam coordinators, invigilators, and appearing students.",
    "sender": "Examination Dean Office",
    "receiver": "All Appearing Students (5,420)",
    "date": "2026-08-05 01:30 PM",
    "priority": "Medium",
    "status": "Delivered",
    "category": "Hall Ticket Release",
    "attachment": "Exam_Circular_2.pdf"
  },
  {
    "id": "MSG-S03",
    "subject": "Faculty Invigilation Duty Master Allocation Notice (Circular #1402)",
    "message": "Official Examination Dean broadcast notification issued to all department exam coordinators, invigilators, and appearing students.",
    "sender": "Examination Dean Office",
    "receiver": "Faculty Invigilators",
    "date": "2026-08-04 01:30 PM",
    "priority": "Medium",
    "status": "Delivered",
    "category": "Invigilation Notice",
    "attachment": "Exam_Circular_3.pdf"
  },
  {
    "id": "MSG-S04",
    "subject": "Confidential Question Paper Upload & Moderation Directive (Circular #1403)",
    "message": "Official Examination Dean broadcast notification issued to all department exam coordinators, invigilators, and appearing students.",
    "sender": "Examination Dean Office",
    "receiver": "Question Paper Moderators",
    "date": "2026-08-03 01:30 PM",
    "priority": "High",
    "status": "Delivered",
    "category": "Result Announcement",
    "attachment": "Exam_Circular_4.pdf"
  },
  {
    "id": "MSG-S05",
    "subject": "Faculty Marks Entry & Internal Assessment Upload Deadline (Circular #1404)",
    "message": "Official Examination Dean broadcast notification issued to all department exam coordinators, invigilators, and appearing students.",
    "sender": "Examination Dean Office",
    "receiver": "Valuation Panel",
    "date": "2026-08-02 01:30 PM",
    "priority": "Medium",
    "status": "Delivered",
    "category": "Revaluation Notice",
    "attachment": "Exam_Circular_5.pdf"
  },
  {
    "id": "MSG-S06",
    "subject": "End-Semester Examination Result Publication Announcement (Circular #1405)",
    "message": "Official Examination Dean broadcast notification issued to all department exam coordinators, invigilators, and appearing students.",
    "sender": "Examination Dean Office",
    "receiver": "Academic Dean",
    "date": "2026-08-01 01:30 PM",
    "priority": "Medium",
    "status": "Delivered",
    "category": "Exam Timetable",
    "attachment": "Exam_Circular_6.pdf"
  },
  {
    "id": "MSG-S07",
    "subject": "Student Revaluation & Challenge Valuation Notification (Circular #1406)",
    "message": "Official Examination Dean broadcast notification issued to all department exam coordinators, invigilators, and appearing students.",
    "sender": "Examination Dean Office",
    "receiver": "Registrar Office",
    "date": "2026-08-06 01:30 PM",
    "priority": "High",
    "status": "Delivered",
    "category": "Hall Ticket Release",
    "attachment": "Exam_Circular_7.pdf"
  },
  {
    "id": "MSG-S08",
    "subject": "Exam Hall Seating Arrangement & Flying Squad Audit Notice (Circular #1407)",
    "message": "Official Examination Dean broadcast notification issued to all department exam coordinators, invigilators, and appearing students.",
    "sender": "Examination Dean Office",
    "receiver": "Flying Squad Officers",
    "date": "2026-08-05 01:30 PM",
    "priority": "Medium",
    "status": "Delivered",
    "category": "Invigilation Notice",
    "attachment": "Exam_Circular_8.pdf"
  },
  {
    "id": "MSG-S09",
    "subject": "Autumn Semester Main Examination Timetable Released (Circular #1408)",
    "message": "Official Examination Dean broadcast notification issued to all department exam coordinators, invigilators, and appearing students.",
    "sender": "Examination Dean Office",
    "receiver": "All Department Exam Coordinators",
    "date": "2026-08-04 01:30 PM",
    "priority": "Medium",
    "status": "Delivered",
    "category": "Result Announcement",
    "attachment": "Exam_Circular_9.pdf"
  },
  {
    "id": "MSG-S10",
    "subject": "Hall Ticket Download Portal Activation for Eligible Students (Circular #1409)",
    "message": "Official Examination Dean broadcast notification issued to all department exam coordinators, invigilators, and appearing students.",
    "sender": "Examination Dean Office",
    "receiver": "All Appearing Students (5,420)",
    "date": "2026-08-03 01:30 PM",
    "priority": "High",
    "status": "Delivered",
    "category": "Revaluation Notice",
    "attachment": "Exam_Circular_10.pdf"
  },
  {
    "id": "MSG-S11",
    "subject": "Faculty Invigilation Duty Master Allocation Notice (Circular #1410)",
    "message": "Official Examination Dean broadcast notification issued to all department exam coordinators, invigilators, and appearing students.",
    "sender": "Examination Dean Office",
    "receiver": "Faculty Invigilators",
    "date": "2026-08-02 01:30 PM",
    "priority": "Medium",
    "status": "Delivered",
    "category": "Exam Timetable",
    "attachment": "Exam_Circular_11.pdf"
  },
  {
    "id": "MSG-S12",
    "subject": "Confidential Question Paper Upload & Moderation Directive (Circular #1411)",
    "message": "Official Examination Dean broadcast notification issued to all department exam coordinators, invigilators, and appearing students.",
    "sender": "Examination Dean Office",
    "receiver": "Question Paper Moderators",
    "date": "2026-08-01 01:30 PM",
    "priority": "Medium",
    "status": "Delivered",
    "category": "Hall Ticket Release",
    "attachment": "Exam_Circular_12.pdf"
  },
  {
    "id": "MSG-S13",
    "subject": "Faculty Marks Entry & Internal Assessment Upload Deadline (Circular #1412)",
    "message": "Official Examination Dean broadcast notification issued to all department exam coordinators, invigilators, and appearing students.",
    "sender": "Examination Dean Office",
    "receiver": "Valuation Panel",
    "date": "2026-08-06 01:30 PM",
    "priority": "High",
    "status": "Delivered",
    "category": "Invigilation Notice",
    "attachment": "Exam_Circular_13.pdf"
  },
  {
    "id": "MSG-S14",
    "subject": "End-Semester Examination Result Publication Announcement (Circular #1413)",
    "message": "Official Examination Dean broadcast notification issued to all department exam coordinators, invigilators, and appearing students.",
    "sender": "Examination Dean Office",
    "receiver": "Academic Dean",
    "date": "2026-08-05 01:30 PM",
    "priority": "Medium",
    "status": "Delivered",
    "category": "Result Announcement",
    "attachment": "Exam_Circular_14.pdf"
  },
  {
    "id": "MSG-S15",
    "subject": "Student Revaluation & Challenge Valuation Notification (Circular #1414)",
    "message": "Official Examination Dean broadcast notification issued to all department exam coordinators, invigilators, and appearing students.",
    "sender": "Examination Dean Office",
    "receiver": "Registrar Office",
    "date": "2026-08-04 01:30 PM",
    "priority": "Medium",
    "status": "Delivered",
    "category": "Revaluation Notice",
    "attachment": "Exam_Circular_15.pdf"
  },
  {
    "id": "MSG-S16",
    "subject": "Exam Hall Seating Arrangement & Flying Squad Audit Notice (Circular #1415)",
    "message": "Official Examination Dean broadcast notification issued to all department exam coordinators, invigilators, and appearing students.",
    "sender": "Examination Dean Office",
    "receiver": "Flying Squad Officers",
    "date": "2026-08-03 01:30 PM",
    "priority": "High",
    "status": "Delivered",
    "category": "Exam Timetable",
    "attachment": "Exam_Circular_16.pdf"
  },
  {
    "id": "MSG-S17",
    "subject": "Autumn Semester Main Examination Timetable Released (Circular #1416)",
    "message": "Official Examination Dean broadcast notification issued to all department exam coordinators, invigilators, and appearing students.",
    "sender": "Examination Dean Office",
    "receiver": "All Department Exam Coordinators",
    "date": "2026-08-02 01:30 PM",
    "priority": "Medium",
    "status": "Delivered",
    "category": "Hall Ticket Release",
    "attachment": "Exam_Circular_17.pdf"
  },
  {
    "id": "MSG-S18",
    "subject": "Hall Ticket Download Portal Activation for Eligible Students (Circular #1417)",
    "message": "Official Examination Dean broadcast notification issued to all department exam coordinators, invigilators, and appearing students.",
    "sender": "Examination Dean Office",
    "receiver": "All Appearing Students (5,420)",
    "date": "2026-08-01 01:30 PM",
    "priority": "Medium",
    "status": "Delivered",
    "category": "Invigilation Notice",
    "attachment": "Exam_Circular_18.pdf"
  },
  {
    "id": "MSG-S19",
    "subject": "Faculty Invigilation Duty Master Allocation Notice (Circular #1418)",
    "message": "Official Examination Dean broadcast notification issued to all department exam coordinators, invigilators, and appearing students.",
    "sender": "Examination Dean Office",
    "receiver": "Faculty Invigilators",
    "date": "2026-08-06 01:30 PM",
    "priority": "High",
    "status": "Delivered",
    "category": "Result Announcement",
    "attachment": "Exam_Circular_19.pdf"
  },
  {
    "id": "MSG-S20",
    "subject": "Confidential Question Paper Upload & Moderation Directive (Circular #1419)",
    "message": "Official Examination Dean broadcast notification issued to all department exam coordinators, invigilators, and appearing students.",
    "sender": "Examination Dean Office",
    "receiver": "Question Paper Moderators",
    "date": "2026-08-05 01:30 PM",
    "priority": "Medium",
    "status": "Delivered",
    "category": "Revaluation Notice",
    "attachment": "Exam_Circular_20.pdf"
  },
  {
    "id": "MSG-S21",
    "subject": "Faculty Marks Entry & Internal Assessment Upload Deadline (Circular #1420)",
    "message": "Official Examination Dean broadcast notification issued to all department exam coordinators, invigilators, and appearing students.",
    "sender": "Examination Dean Office",
    "receiver": "Valuation Panel",
    "date": "2026-08-04 01:30 PM",
    "priority": "Medium",
    "status": "Delivered",
    "category": "Exam Timetable",
    "attachment": "Exam_Circular_21.pdf"
  },
  {
    "id": "MSG-S22",
    "subject": "End-Semester Examination Result Publication Announcement (Circular #1421)",
    "message": "Official Examination Dean broadcast notification issued to all department exam coordinators, invigilators, and appearing students.",
    "sender": "Examination Dean Office",
    "receiver": "Academic Dean",
    "date": "2026-08-03 01:30 PM",
    "priority": "High",
    "status": "Delivered",
    "category": "Hall Ticket Release",
    "attachment": "Exam_Circular_22.pdf"
  },
  {
    "id": "MSG-S23",
    "subject": "Student Revaluation & Challenge Valuation Notification (Circular #1422)",
    "message": "Official Examination Dean broadcast notification issued to all department exam coordinators, invigilators, and appearing students.",
    "sender": "Examination Dean Office",
    "receiver": "Registrar Office",
    "date": "2026-08-02 01:30 PM",
    "priority": "Medium",
    "status": "Delivered",
    "category": "Invigilation Notice",
    "attachment": "Exam_Circular_23.pdf"
  },
  {
    "id": "MSG-S24",
    "subject": "Exam Hall Seating Arrangement & Flying Squad Audit Notice (Circular #1423)",
    "message": "Official Examination Dean broadcast notification issued to all department exam coordinators, invigilators, and appearing students.",
    "sender": "Examination Dean Office",
    "receiver": "Flying Squad Officers",
    "date": "2026-08-01 01:30 PM",
    "priority": "Medium",
    "status": "Delivered",
    "category": "Result Announcement",
    "attachment": "Exam_Circular_24.pdf"
  },
  {
    "id": "MSG-S25",
    "subject": "Autumn Semester Main Examination Timetable Released (Circular #1424)",
    "message": "Official Examination Dean broadcast notification issued to all department exam coordinators, invigilators, and appearing students.",
    "sender": "Examination Dean Office",
    "receiver": "All Department Exam Coordinators",
    "date": "2026-08-06 01:30 PM",
    "priority": "High",
    "status": "Delivered",
    "category": "Revaluation Notice",
    "attachment": "Exam_Circular_25.pdf"
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
      sender: "Examination Dean Office",
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
            <Badge variant="outline" className="font-mono text-[0.65rem] uppercase text-primary border-primary/30">EXAMINATION CELL</Badge>
            <span className="text-xs text-muted-foreground">• Institutional Notifications System</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Notification Center</h1>
          <p className="text-sm text-muted-foreground">Executive communication ledger for Examination Dean. Broadcast alerts, circulars, and departmental memos.</p>
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
