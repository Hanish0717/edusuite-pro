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

export const Route = createFileRoute("/staff/student-dean/notifications")({
  head: () => ({ meta: [{ title: "Notifications System — Student Dean" }] }),
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
    "subject": "Student Grievance Hearing Decision Submission (Ref #300)",
    "message": "Official student welfare communication regarding campus grievances, hostel amenities, scholarship disbursements, and club event approvals.",
    "sender": "Student Grievance Cell",
    "receiver": "Student Dean Office",
    "date": "2026-08-06 11:00 AM",
    "priority": "High",
    "status": "Unread",
    "category": "Student Welfare",
    "attachment": "Student_Notice_1.pdf"
  },
  {
    "id": "MSG-R02",
    "subject": "Post-Matric Merit Scholarship Disbursement Clearance (Ref #301)",
    "message": "Official student welfare communication regarding campus grievances, hostel amenities, scholarship disbursements, and club event approvals.",
    "sender": "State Welfare Department",
    "receiver": "Student Dean Office",
    "date": "2026-08-05 11:00 AM",
    "priority": "Medium",
    "status": "Read",
    "category": "Scholarship"
  },
  {
    "id": "MSG-R03",
    "subject": "Hostel Mess Committee Infrastructure Upgrade Request (Ref #302)",
    "message": "Official student welfare communication regarding campus grievances, hostel amenities, scholarship disbursements, and club event approvals.",
    "sender": "Hostel Chief Warden",
    "receiver": "Student Dean Office",
    "date": "2026-08-04 11:00 AM",
    "priority": "Medium",
    "status": "Read",
    "category": "Hostel",
    "attachment": "Student_Notice_3.pdf"
  },
  {
    "id": "MSG-R04",
    "subject": "Disciplinary Committee Inquiry Report Submission (Ref #303)",
    "message": "Official student welfare communication regarding campus grievances, hostel amenities, scholarship disbursements, and club event approvals.",
    "sender": "Disciplinary Committee Chair",
    "receiver": "Student Dean Office",
    "date": "2026-08-03 11:00 AM",
    "priority": "High",
    "status": "Read",
    "category": "Discipline"
  },
  {
    "id": "MSG-R05",
    "subject": "Annual Campus Hackathon & Cultural Fest Clearance Request (Ref #304)",
    "message": "Official student welfare communication regarding campus grievances, hostel amenities, scholarship disbursements, and club event approvals.",
    "sender": "Campus Cultural Club President",
    "receiver": "Student Dean Office",
    "date": "2026-08-02 11:00 AM",
    "priority": "Medium",
    "status": "Unread",
    "category": "Events",
    "attachment": "Student_Notice_5.pdf"
  },
  {
    "id": "MSG-R06",
    "subject": "Student Psychological Counselling Monthly Activity Summary (Ref #305)",
    "message": "Official student welfare communication regarding campus grievances, hostel amenities, scholarship disbursements, and club event approvals.",
    "sender": "Dr. Lakshmi Devi (Student Counsellor)",
    "receiver": "Student Dean Office",
    "date": "2026-08-01 11:00 AM",
    "priority": "Medium",
    "status": "Read",
    "category": "Student Welfare"
  },
  {
    "id": "MSG-R07",
    "subject": "Bonafide Certificate & Passport NOC Application Batch (Ref #306)",
    "message": "Official student welfare communication regarding campus grievances, hostel amenities, scholarship disbursements, and club event approvals.",
    "sender": "NSS Student Lead",
    "receiver": "Student Dean Office",
    "date": "2026-08-06 11:00 AM",
    "priority": "High",
    "status": "Read",
    "category": "Scholarship",
    "attachment": "Student_Notice_7.pdf"
  },
  {
    "id": "MSG-R08",
    "subject": "NSS Community Service Drive Permission Sanction (Ref #307)",
    "message": "Official student welfare communication regarding campus grievances, hostel amenities, scholarship disbursements, and club event approvals.",
    "sender": "Principal Office",
    "receiver": "Student Dean Office",
    "date": "2026-08-05 11:00 AM",
    "priority": "Medium",
    "status": "Read",
    "category": "Hostel"
  },
  {
    "id": "MSG-R09",
    "subject": "Student Grievance Hearing Decision Submission (Ref #308)",
    "message": "Official student welfare communication regarding campus grievances, hostel amenities, scholarship disbursements, and club event approvals.",
    "sender": "Student Grievance Cell",
    "receiver": "Student Dean Office",
    "date": "2026-08-04 11:00 AM",
    "priority": "Medium",
    "status": "Unread",
    "category": "Discipline",
    "attachment": "Student_Notice_9.pdf"
  },
  {
    "id": "MSG-R10",
    "subject": "Post-Matric Merit Scholarship Disbursement Clearance (Ref #309)",
    "message": "Official student welfare communication regarding campus grievances, hostel amenities, scholarship disbursements, and club event approvals.",
    "sender": "State Welfare Department",
    "receiver": "Student Dean Office",
    "date": "2026-08-03 11:00 AM",
    "priority": "High",
    "status": "Read",
    "category": "Events"
  },
  {
    "id": "MSG-R11",
    "subject": "Hostel Mess Committee Infrastructure Upgrade Request (Ref #310)",
    "message": "Official student welfare communication regarding campus grievances, hostel amenities, scholarship disbursements, and club event approvals.",
    "sender": "Hostel Chief Warden",
    "receiver": "Student Dean Office",
    "date": "2026-08-02 11:00 AM",
    "priority": "Medium",
    "status": "Read",
    "category": "Student Welfare",
    "attachment": "Student_Notice_11.pdf"
  },
  {
    "id": "MSG-R12",
    "subject": "Disciplinary Committee Inquiry Report Submission (Ref #311)",
    "message": "Official student welfare communication regarding campus grievances, hostel amenities, scholarship disbursements, and club event approvals.",
    "sender": "Disciplinary Committee Chair",
    "receiver": "Student Dean Office",
    "date": "2026-08-01 11:00 AM",
    "priority": "Medium",
    "status": "Read",
    "category": "Scholarship"
  },
  {
    "id": "MSG-R13",
    "subject": "Annual Campus Hackathon & Cultural Fest Clearance Request (Ref #312)",
    "message": "Official student welfare communication regarding campus grievances, hostel amenities, scholarship disbursements, and club event approvals.",
    "sender": "Campus Cultural Club President",
    "receiver": "Student Dean Office",
    "date": "2026-08-06 11:00 AM",
    "priority": "High",
    "status": "Unread",
    "category": "Hostel",
    "attachment": "Student_Notice_13.pdf"
  },
  {
    "id": "MSG-R14",
    "subject": "Student Psychological Counselling Monthly Activity Summary (Ref #313)",
    "message": "Official student welfare communication regarding campus grievances, hostel amenities, scholarship disbursements, and club event approvals.",
    "sender": "Dr. Lakshmi Devi (Student Counsellor)",
    "receiver": "Student Dean Office",
    "date": "2026-08-05 11:00 AM",
    "priority": "Medium",
    "status": "Read",
    "category": "Discipline"
  },
  {
    "id": "MSG-R15",
    "subject": "Bonafide Certificate & Passport NOC Application Batch (Ref #314)",
    "message": "Official student welfare communication regarding campus grievances, hostel amenities, scholarship disbursements, and club event approvals.",
    "sender": "NSS Student Lead",
    "receiver": "Student Dean Office",
    "date": "2026-08-04 11:00 AM",
    "priority": "Medium",
    "status": "Read",
    "category": "Events",
    "attachment": "Student_Notice_15.pdf"
  },
  {
    "id": "MSG-R16",
    "subject": "NSS Community Service Drive Permission Sanction (Ref #315)",
    "message": "Official student welfare communication regarding campus grievances, hostel amenities, scholarship disbursements, and club event approvals.",
    "sender": "Principal Office",
    "receiver": "Student Dean Office",
    "date": "2026-08-03 11:00 AM",
    "priority": "High",
    "status": "Read",
    "category": "Student Welfare"
  },
  {
    "id": "MSG-R17",
    "subject": "Student Grievance Hearing Decision Submission (Ref #316)",
    "message": "Official student welfare communication regarding campus grievances, hostel amenities, scholarship disbursements, and club event approvals.",
    "sender": "Student Grievance Cell",
    "receiver": "Student Dean Office",
    "date": "2026-08-02 11:00 AM",
    "priority": "Medium",
    "status": "Unread",
    "category": "Scholarship",
    "attachment": "Student_Notice_17.pdf"
  },
  {
    "id": "MSG-R18",
    "subject": "Post-Matric Merit Scholarship Disbursement Clearance (Ref #317)",
    "message": "Official student welfare communication regarding campus grievances, hostel amenities, scholarship disbursements, and club event approvals.",
    "sender": "State Welfare Department",
    "receiver": "Student Dean Office",
    "date": "2026-08-01 11:00 AM",
    "priority": "Medium",
    "status": "Read",
    "category": "Hostel"
  },
  {
    "id": "MSG-R19",
    "subject": "Hostel Mess Committee Infrastructure Upgrade Request (Ref #318)",
    "message": "Official student welfare communication regarding campus grievances, hostel amenities, scholarship disbursements, and club event approvals.",
    "sender": "Hostel Chief Warden",
    "receiver": "Student Dean Office",
    "date": "2026-08-06 11:00 AM",
    "priority": "High",
    "status": "Read",
    "category": "Discipline",
    "attachment": "Student_Notice_19.pdf"
  },
  {
    "id": "MSG-R20",
    "subject": "Disciplinary Committee Inquiry Report Submission (Ref #319)",
    "message": "Official student welfare communication regarding campus grievances, hostel amenities, scholarship disbursements, and club event approvals.",
    "sender": "Disciplinary Committee Chair",
    "receiver": "Student Dean Office",
    "date": "2026-08-05 11:00 AM",
    "priority": "Medium",
    "status": "Read",
    "category": "Events"
  },
  {
    "id": "MSG-R21",
    "subject": "Annual Campus Hackathon & Cultural Fest Clearance Request (Ref #320)",
    "message": "Official student welfare communication regarding campus grievances, hostel amenities, scholarship disbursements, and club event approvals.",
    "sender": "Campus Cultural Club President",
    "receiver": "Student Dean Office",
    "date": "2026-08-04 11:00 AM",
    "priority": "Medium",
    "status": "Unread",
    "category": "Student Welfare",
    "attachment": "Student_Notice_21.pdf"
  },
  {
    "id": "MSG-R22",
    "subject": "Student Psychological Counselling Monthly Activity Summary (Ref #321)",
    "message": "Official student welfare communication regarding campus grievances, hostel amenities, scholarship disbursements, and club event approvals.",
    "sender": "Dr. Lakshmi Devi (Student Counsellor)",
    "receiver": "Student Dean Office",
    "date": "2026-08-03 11:00 AM",
    "priority": "High",
    "status": "Read",
    "category": "Scholarship"
  },
  {
    "id": "MSG-R23",
    "subject": "Bonafide Certificate & Passport NOC Application Batch (Ref #322)",
    "message": "Official student welfare communication regarding campus grievances, hostel amenities, scholarship disbursements, and club event approvals.",
    "sender": "NSS Student Lead",
    "receiver": "Student Dean Office",
    "date": "2026-08-02 11:00 AM",
    "priority": "Medium",
    "status": "Read",
    "category": "Hostel",
    "attachment": "Student_Notice_23.pdf"
  },
  {
    "id": "MSG-R24",
    "subject": "NSS Community Service Drive Permission Sanction (Ref #323)",
    "message": "Official student welfare communication regarding campus grievances, hostel amenities, scholarship disbursements, and club event approvals.",
    "sender": "Principal Office",
    "receiver": "Student Dean Office",
    "date": "2026-08-01 11:00 AM",
    "priority": "Medium",
    "status": "Read",
    "category": "Discipline"
  },
  {
    "id": "MSG-R25",
    "subject": "Student Grievance Hearing Decision Submission (Ref #324)",
    "message": "Official student welfare communication regarding campus grievances, hostel amenities, scholarship disbursements, and club event approvals.",
    "sender": "Student Grievance Cell",
    "receiver": "Student Dean Office",
    "date": "2026-08-06 11:00 AM",
    "priority": "High",
    "status": "Unread",
    "category": "Events",
    "attachment": "Student_Notice_25.pdf"
  }
]);
  const [sentMsgs, setSentMsgs] = useState([
  {
    "id": "MSG-S01",
    "subject": "Attendance Deficit & Condonation Shortage Warning Release (Notice #400)",
    "message": "Official Student Dean broadcast notification issued to all registered students, hostel inmates, club leads, and department mentors.",
    "sender": "Student Dean Office",
    "receiver": "All Enrolled Students (5,820)",
    "date": "2026-08-06 04:30 PM",
    "priority": "High",
    "status": "Delivered",
    "category": "Condonation Alert",
    "attachment": "Notice_Doc_1.pdf"
  },
  {
    "id": "MSG-S02",
    "subject": "Campus Dress Code & Code of Conduct Executive Circular (Notice #401)",
    "message": "Official Student Dean broadcast notification issued to all registered students, hostel inmates, club leads, and department mentors.",
    "sender": "Student Dean Office",
    "receiver": "Hostel Resident Students",
    "date": "2026-08-05 04:30 PM",
    "priority": "Medium",
    "status": "Delivered",
    "category": "Discipline",
    "attachment": "Notice_Doc_2.pdf"
  },
  {
    "id": "MSG-S03",
    "subject": "Hostel Room Allotment & Mess Fee Payment Notification (Notice #402)",
    "message": "Official Student Dean broadcast notification issued to all registered students, hostel inmates, club leads, and department mentors.",
    "sender": "Student Dean Office",
    "receiver": "All Faculty Mentors",
    "date": "2026-08-04 04:30 PM",
    "priority": "Medium",
    "status": "Delivered",
    "category": "Hostel Notice",
    "attachment": "Notice_Doc_3.pdf"
  },
  {
    "id": "MSG-S04",
    "subject": "Merit Scholarship Disbursement Clearance Announcement (Notice #403)",
    "message": "Official Student Dean broadcast notification issued to all registered students, hostel inmates, club leads, and department mentors.",
    "sender": "Student Dean Office",
    "receiver": "Department HODs",
    "date": "2026-08-03 04:30 PM",
    "priority": "High",
    "status": "Delivered",
    "category": "Events",
    "attachment": "Notice_Doc_4.pdf"
  },
  {
    "id": "MSG-S05",
    "subject": "Club Event Budget Sanction & Venue Allocation Release (Notice #404)",
    "message": "Official Student Dean broadcast notification issued to all registered students, hostel inmates, club leads, and department mentors.",
    "sender": "Student Dean Office",
    "receiver": "Student Club Presidents",
    "date": "2026-08-02 04:30 PM",
    "priority": "Medium",
    "status": "Delivered",
    "category": "Scholarship",
    "attachment": "Notice_Doc_5.pdf"
  },
  {
    "id": "MSG-S06",
    "subject": "Student Mentoring Monthly Review Compliance Notice (Notice #405)",
    "message": "Official Student Dean broadcast notification issued to all registered students, hostel inmates, club leads, and department mentors.",
    "sender": "Student Dean Office",
    "receiver": "Grievance Committee",
    "date": "2026-08-01 04:30 PM",
    "priority": "Medium",
    "status": "Delivered",
    "category": "Condonation Alert",
    "attachment": "Notice_Doc_6.pdf"
  },
  {
    "id": "MSG-S07",
    "subject": "Bonafide & Transfer Certificate Issuance Release (Notice #406)",
    "message": "Official Student Dean broadcast notification issued to all registered students, hostel inmates, club leads, and department mentors.",
    "sender": "Student Dean Office",
    "receiver": "Canteen & Hostel Staff",
    "date": "2026-08-06 04:30 PM",
    "priority": "High",
    "status": "Delivered",
    "category": "Discipline",
    "attachment": "Notice_Doc_7.pdf"
  },
  {
    "id": "MSG-S08",
    "subject": "Sports Tournament & Inter-College Championship Advisory (Notice #407)",
    "message": "Official Student Dean broadcast notification issued to all registered students, hostel inmates, club leads, and department mentors.",
    "sender": "Student Dean Office",
    "receiver": "Sports Council",
    "date": "2026-08-05 04:30 PM",
    "priority": "Medium",
    "status": "Delivered",
    "category": "Hostel Notice",
    "attachment": "Notice_Doc_8.pdf"
  },
  {
    "id": "MSG-S09",
    "subject": "Attendance Deficit & Condonation Shortage Warning Release (Notice #408)",
    "message": "Official Student Dean broadcast notification issued to all registered students, hostel inmates, club leads, and department mentors.",
    "sender": "Student Dean Office",
    "receiver": "All Enrolled Students (5,820)",
    "date": "2026-08-04 04:30 PM",
    "priority": "Medium",
    "status": "Delivered",
    "category": "Events",
    "attachment": "Notice_Doc_9.pdf"
  },
  {
    "id": "MSG-S10",
    "subject": "Campus Dress Code & Code of Conduct Executive Circular (Notice #409)",
    "message": "Official Student Dean broadcast notification issued to all registered students, hostel inmates, club leads, and department mentors.",
    "sender": "Student Dean Office",
    "receiver": "Hostel Resident Students",
    "date": "2026-08-03 04:30 PM",
    "priority": "High",
    "status": "Delivered",
    "category": "Scholarship",
    "attachment": "Notice_Doc_10.pdf"
  },
  {
    "id": "MSG-S11",
    "subject": "Hostel Room Allotment & Mess Fee Payment Notification (Notice #410)",
    "message": "Official Student Dean broadcast notification issued to all registered students, hostel inmates, club leads, and department mentors.",
    "sender": "Student Dean Office",
    "receiver": "All Faculty Mentors",
    "date": "2026-08-02 04:30 PM",
    "priority": "Medium",
    "status": "Delivered",
    "category": "Condonation Alert",
    "attachment": "Notice_Doc_11.pdf"
  },
  {
    "id": "MSG-S12",
    "subject": "Merit Scholarship Disbursement Clearance Announcement (Notice #411)",
    "message": "Official Student Dean broadcast notification issued to all registered students, hostel inmates, club leads, and department mentors.",
    "sender": "Student Dean Office",
    "receiver": "Department HODs",
    "date": "2026-08-01 04:30 PM",
    "priority": "Medium",
    "status": "Delivered",
    "category": "Discipline",
    "attachment": "Notice_Doc_12.pdf"
  },
  {
    "id": "MSG-S13",
    "subject": "Club Event Budget Sanction & Venue Allocation Release (Notice #412)",
    "message": "Official Student Dean broadcast notification issued to all registered students, hostel inmates, club leads, and department mentors.",
    "sender": "Student Dean Office",
    "receiver": "Student Club Presidents",
    "date": "2026-08-06 04:30 PM",
    "priority": "High",
    "status": "Delivered",
    "category": "Hostel Notice",
    "attachment": "Notice_Doc_13.pdf"
  },
  {
    "id": "MSG-S14",
    "subject": "Student Mentoring Monthly Review Compliance Notice (Notice #413)",
    "message": "Official Student Dean broadcast notification issued to all registered students, hostel inmates, club leads, and department mentors.",
    "sender": "Student Dean Office",
    "receiver": "Grievance Committee",
    "date": "2026-08-05 04:30 PM",
    "priority": "Medium",
    "status": "Delivered",
    "category": "Events",
    "attachment": "Notice_Doc_14.pdf"
  },
  {
    "id": "MSG-S15",
    "subject": "Bonafide & Transfer Certificate Issuance Release (Notice #414)",
    "message": "Official Student Dean broadcast notification issued to all registered students, hostel inmates, club leads, and department mentors.",
    "sender": "Student Dean Office",
    "receiver": "Canteen & Hostel Staff",
    "date": "2026-08-04 04:30 PM",
    "priority": "Medium",
    "status": "Delivered",
    "category": "Scholarship",
    "attachment": "Notice_Doc_15.pdf"
  },
  {
    "id": "MSG-S16",
    "subject": "Sports Tournament & Inter-College Championship Advisory (Notice #415)",
    "message": "Official Student Dean broadcast notification issued to all registered students, hostel inmates, club leads, and department mentors.",
    "sender": "Student Dean Office",
    "receiver": "Sports Council",
    "date": "2026-08-03 04:30 PM",
    "priority": "High",
    "status": "Delivered",
    "category": "Condonation Alert",
    "attachment": "Notice_Doc_16.pdf"
  },
  {
    "id": "MSG-S17",
    "subject": "Attendance Deficit & Condonation Shortage Warning Release (Notice #416)",
    "message": "Official Student Dean broadcast notification issued to all registered students, hostel inmates, club leads, and department mentors.",
    "sender": "Student Dean Office",
    "receiver": "All Enrolled Students (5,820)",
    "date": "2026-08-02 04:30 PM",
    "priority": "Medium",
    "status": "Delivered",
    "category": "Discipline",
    "attachment": "Notice_Doc_17.pdf"
  },
  {
    "id": "MSG-S18",
    "subject": "Campus Dress Code & Code of Conduct Executive Circular (Notice #417)",
    "message": "Official Student Dean broadcast notification issued to all registered students, hostel inmates, club leads, and department mentors.",
    "sender": "Student Dean Office",
    "receiver": "Hostel Resident Students",
    "date": "2026-08-01 04:30 PM",
    "priority": "Medium",
    "status": "Delivered",
    "category": "Hostel Notice",
    "attachment": "Notice_Doc_18.pdf"
  },
  {
    "id": "MSG-S19",
    "subject": "Hostel Room Allotment & Mess Fee Payment Notification (Notice #418)",
    "message": "Official Student Dean broadcast notification issued to all registered students, hostel inmates, club leads, and department mentors.",
    "sender": "Student Dean Office",
    "receiver": "All Faculty Mentors",
    "date": "2026-08-06 04:30 PM",
    "priority": "High",
    "status": "Delivered",
    "category": "Events",
    "attachment": "Notice_Doc_19.pdf"
  },
  {
    "id": "MSG-S20",
    "subject": "Merit Scholarship Disbursement Clearance Announcement (Notice #419)",
    "message": "Official Student Dean broadcast notification issued to all registered students, hostel inmates, club leads, and department mentors.",
    "sender": "Student Dean Office",
    "receiver": "Department HODs",
    "date": "2026-08-05 04:30 PM",
    "priority": "Medium",
    "status": "Delivered",
    "category": "Scholarship",
    "attachment": "Notice_Doc_20.pdf"
  },
  {
    "id": "MSG-S21",
    "subject": "Club Event Budget Sanction & Venue Allocation Release (Notice #420)",
    "message": "Official Student Dean broadcast notification issued to all registered students, hostel inmates, club leads, and department mentors.",
    "sender": "Student Dean Office",
    "receiver": "Student Club Presidents",
    "date": "2026-08-04 04:30 PM",
    "priority": "Medium",
    "status": "Delivered",
    "category": "Condonation Alert",
    "attachment": "Notice_Doc_21.pdf"
  },
  {
    "id": "MSG-S22",
    "subject": "Student Mentoring Monthly Review Compliance Notice (Notice #421)",
    "message": "Official Student Dean broadcast notification issued to all registered students, hostel inmates, club leads, and department mentors.",
    "sender": "Student Dean Office",
    "receiver": "Grievance Committee",
    "date": "2026-08-03 04:30 PM",
    "priority": "High",
    "status": "Delivered",
    "category": "Discipline",
    "attachment": "Notice_Doc_22.pdf"
  },
  {
    "id": "MSG-S23",
    "subject": "Bonafide & Transfer Certificate Issuance Release (Notice #422)",
    "message": "Official Student Dean broadcast notification issued to all registered students, hostel inmates, club leads, and department mentors.",
    "sender": "Student Dean Office",
    "receiver": "Canteen & Hostel Staff",
    "date": "2026-08-02 04:30 PM",
    "priority": "Medium",
    "status": "Delivered",
    "category": "Hostel Notice",
    "attachment": "Notice_Doc_23.pdf"
  },
  {
    "id": "MSG-S24",
    "subject": "Sports Tournament & Inter-College Championship Advisory (Notice #423)",
    "message": "Official Student Dean broadcast notification issued to all registered students, hostel inmates, club leads, and department mentors.",
    "sender": "Student Dean Office",
    "receiver": "Sports Council",
    "date": "2026-08-01 04:30 PM",
    "priority": "Medium",
    "status": "Delivered",
    "category": "Events",
    "attachment": "Notice_Doc_24.pdf"
  },
  {
    "id": "MSG-S25",
    "subject": "Attendance Deficit & Condonation Shortage Warning Release (Notice #424)",
    "message": "Official Student Dean broadcast notification issued to all registered students, hostel inmates, club leads, and department mentors.",
    "sender": "Student Dean Office",
    "receiver": "All Enrolled Students (5,820)",
    "date": "2026-08-06 04:30 PM",
    "priority": "High",
    "status": "Delivered",
    "category": "Scholarship",
    "attachment": "Notice_Doc_25.pdf"
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
      sender: "Student Dean Office",
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
            <Badge variant="outline" className="font-mono text-[0.65rem] uppercase text-primary border-primary/30">STUDENT COMMUNICATION</Badge>
            <span className="text-xs text-muted-foreground">• Institutional Notifications System</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Notification Center</h1>
          <p className="text-sm text-muted-foreground">Executive communication ledger for Student Dean. Broadcast alerts, circulars, and departmental memos.</p>
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
