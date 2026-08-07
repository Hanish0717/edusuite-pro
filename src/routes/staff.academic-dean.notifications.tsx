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

export const Route = createFileRoute("/staff/academic-dean/notifications")({
  head: () => ({ meta: [{ title: "Notifications System — Academic Dean" }] }),
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
    "subject": "Academic Council Standing Committee Resolution Approval (Ref #100)",
    "message": "Official notification regarding academic governance, curriculum compliance, faculty load audits, and student performance metrics for the current academic term. Please inspect the attached directive.",
    "sender": "University Registrar Office",
    "receiver": "Academic Dean Office",
    "date": "2026-08-06 10:30 AM",
    "priority": "High",
    "status": "Unread",
    "category": "Academic Governance",
    "attachment": "Academic_Directive_1.pdf"
  },
  {
    "id": "MSG-R02",
    "subject": "Board of Studies (BOS) R24 Curriculum Revisions Approved (Ref #101)",
    "message": "Official notification regarding academic governance, curriculum compliance, faculty load audits, and student performance metrics for the current academic term. Please inspect the attached directive.",
    "sender": "BOS Chair Committee",
    "receiver": "Academic Dean Office",
    "date": "2026-08-05 10:30 AM",
    "priority": "Medium",
    "status": "Read",
    "category": "Curriculum"
  },
  {
    "id": "MSG-R03",
    "subject": "Annual NBA Accreditation Audit Schedule Release (Ref #102)",
    "message": "Official notification regarding academic governance, curriculum compliance, faculty load audits, and student performance metrics for the current academic term. Please inspect the attached directive.",
    "sender": "IQAC Executive Director",
    "receiver": "Academic Dean Office",
    "date": "2026-08-04 10:30 AM",
    "priority": "Low",
    "status": "Read",
    "category": "Accreditation",
    "attachment": "Academic_Directive_3.pdf"
  },
  {
    "id": "MSG-R04",
    "subject": "UGC / AICTE Teaching Load & STR Compliance Review (Ref #103)",
    "message": "Official notification regarding academic governance, curriculum compliance, faculty load audits, and student performance metrics for the current academic term. Please inspect the attached directive.",
    "sender": "Controller of Examinations",
    "receiver": "Academic Dean Office",
    "date": "2026-08-03 10:30 AM",
    "priority": "High",
    "status": "Read",
    "category": "Exam Moderation"
  },
  {
    "id": "MSG-R05",
    "subject": "Semester Mid-Term Question Paper Moderation Directive (Ref #104)",
    "message": "Official notification regarding academic governance, curriculum compliance, faculty load audits, and student performance metrics for the current academic term. Please inspect the attached directive.",
    "sender": "Dr. Srinivas Rao (HOD CSE)",
    "receiver": "Academic Dean Office",
    "date": "2026-08-02 10:30 AM",
    "priority": "Medium",
    "status": "Unread",
    "category": "Student Performance",
    "attachment": "Academic_Directive_5.pdf"
  },
  {
    "id": "MSG-R06",
    "subject": "Slow Learners Remedial Batch Allocation Confirmation (Ref #105)",
    "message": "Official notification regarding academic governance, curriculum compliance, faculty load audits, and student performance metrics for the current academic term. Please inspect the attached directive.",
    "sender": "Dr. Priya Sharma (HOD ECE)",
    "receiver": "Academic Dean Office",
    "date": "2026-08-01 10:30 AM",
    "priority": "Low",
    "status": "Read",
    "category": "Academic Governance"
  },
  {
    "id": "MSG-R07",
    "subject": "Dean's Honor Roll & Merit Scholarship Awardees List (Ref #106)",
    "message": "Official notification regarding academic governance, curriculum compliance, faculty load audits, and student performance metrics for the current academic term. Please inspect the attached directive.",
    "sender": "Dr. Ravi Kumar (HOD AI & DS)",
    "receiver": "Academic Dean Office",
    "date": "2026-08-06 10:30 AM",
    "priority": "High",
    "status": "Read",
    "category": "Curriculum",
    "attachment": "Academic_Directive_7.pdf"
  },
  {
    "id": "MSG-R08",
    "subject": "Outcome-Based Education (OBE) CO-PO Mapping Audit Passed (Ref #107)",
    "message": "Official notification regarding academic governance, curriculum compliance, faculty load audits, and student performance metrics for the current academic term. Please inspect the attached directive.",
    "sender": "Principal Academic Office",
    "receiver": "Academic Dean Office",
    "date": "2026-08-05 10:30 AM",
    "priority": "Medium",
    "status": "Read",
    "category": "Accreditation"
  },
  {
    "id": "MSG-R09",
    "subject": "Academic Council Standing Committee Resolution Approval (Ref #108)",
    "message": "Official notification regarding academic governance, curriculum compliance, faculty load audits, and student performance metrics for the current academic term. Please inspect the attached directive.",
    "sender": "University Registrar Office",
    "receiver": "Academic Dean Office",
    "date": "2026-08-04 10:30 AM",
    "priority": "Low",
    "status": "Unread",
    "category": "Exam Moderation",
    "attachment": "Academic_Directive_9.pdf"
  },
  {
    "id": "MSG-R10",
    "subject": "Board of Studies (BOS) R24 Curriculum Revisions Approved (Ref #109)",
    "message": "Official notification regarding academic governance, curriculum compliance, faculty load audits, and student performance metrics for the current academic term. Please inspect the attached directive.",
    "sender": "BOS Chair Committee",
    "receiver": "Academic Dean Office",
    "date": "2026-08-03 10:30 AM",
    "priority": "High",
    "status": "Read",
    "category": "Student Performance"
  },
  {
    "id": "MSG-R11",
    "subject": "Annual NBA Accreditation Audit Schedule Release (Ref #110)",
    "message": "Official notification regarding academic governance, curriculum compliance, faculty load audits, and student performance metrics for the current academic term. Please inspect the attached directive.",
    "sender": "IQAC Executive Director",
    "receiver": "Academic Dean Office",
    "date": "2026-08-02 10:30 AM",
    "priority": "Medium",
    "status": "Read",
    "category": "Academic Governance",
    "attachment": "Academic_Directive_11.pdf"
  },
  {
    "id": "MSG-R12",
    "subject": "UGC / AICTE Teaching Load & STR Compliance Review (Ref #111)",
    "message": "Official notification regarding academic governance, curriculum compliance, faculty load audits, and student performance metrics for the current academic term. Please inspect the attached directive.",
    "sender": "Controller of Examinations",
    "receiver": "Academic Dean Office",
    "date": "2026-08-01 10:30 AM",
    "priority": "Low",
    "status": "Read",
    "category": "Curriculum"
  },
  {
    "id": "MSG-R13",
    "subject": "Semester Mid-Term Question Paper Moderation Directive (Ref #112)",
    "message": "Official notification regarding academic governance, curriculum compliance, faculty load audits, and student performance metrics for the current academic term. Please inspect the attached directive.",
    "sender": "Dr. Srinivas Rao (HOD CSE)",
    "receiver": "Academic Dean Office",
    "date": "2026-08-06 10:30 AM",
    "priority": "High",
    "status": "Unread",
    "category": "Accreditation",
    "attachment": "Academic_Directive_13.pdf"
  },
  {
    "id": "MSG-R14",
    "subject": "Slow Learners Remedial Batch Allocation Confirmation (Ref #113)",
    "message": "Official notification regarding academic governance, curriculum compliance, faculty load audits, and student performance metrics for the current academic term. Please inspect the attached directive.",
    "sender": "Dr. Priya Sharma (HOD ECE)",
    "receiver": "Academic Dean Office",
    "date": "2026-08-05 10:30 AM",
    "priority": "Medium",
    "status": "Read",
    "category": "Exam Moderation"
  },
  {
    "id": "MSG-R15",
    "subject": "Dean's Honor Roll & Merit Scholarship Awardees List (Ref #114)",
    "message": "Official notification regarding academic governance, curriculum compliance, faculty load audits, and student performance metrics for the current academic term. Please inspect the attached directive.",
    "sender": "Dr. Ravi Kumar (HOD AI & DS)",
    "receiver": "Academic Dean Office",
    "date": "2026-08-04 10:30 AM",
    "priority": "Low",
    "status": "Read",
    "category": "Student Performance",
    "attachment": "Academic_Directive_15.pdf"
  },
  {
    "id": "MSG-R16",
    "subject": "Outcome-Based Education (OBE) CO-PO Mapping Audit Passed (Ref #115)",
    "message": "Official notification regarding academic governance, curriculum compliance, faculty load audits, and student performance metrics for the current academic term. Please inspect the attached directive.",
    "sender": "Principal Academic Office",
    "receiver": "Academic Dean Office",
    "date": "2026-08-03 10:30 AM",
    "priority": "High",
    "status": "Read",
    "category": "Academic Governance"
  },
  {
    "id": "MSG-R17",
    "subject": "Academic Council Standing Committee Resolution Approval (Ref #116)",
    "message": "Official notification regarding academic governance, curriculum compliance, faculty load audits, and student performance metrics for the current academic term. Please inspect the attached directive.",
    "sender": "University Registrar Office",
    "receiver": "Academic Dean Office",
    "date": "2026-08-02 10:30 AM",
    "priority": "Medium",
    "status": "Unread",
    "category": "Curriculum",
    "attachment": "Academic_Directive_17.pdf"
  },
  {
    "id": "MSG-R18",
    "subject": "Board of Studies (BOS) R24 Curriculum Revisions Approved (Ref #117)",
    "message": "Official notification regarding academic governance, curriculum compliance, faculty load audits, and student performance metrics for the current academic term. Please inspect the attached directive.",
    "sender": "BOS Chair Committee",
    "receiver": "Academic Dean Office",
    "date": "2026-08-01 10:30 AM",
    "priority": "Low",
    "status": "Read",
    "category": "Accreditation"
  },
  {
    "id": "MSG-R19",
    "subject": "Annual NBA Accreditation Audit Schedule Release (Ref #118)",
    "message": "Official notification regarding academic governance, curriculum compliance, faculty load audits, and student performance metrics for the current academic term. Please inspect the attached directive.",
    "sender": "IQAC Executive Director",
    "receiver": "Academic Dean Office",
    "date": "2026-08-06 10:30 AM",
    "priority": "High",
    "status": "Read",
    "category": "Exam Moderation",
    "attachment": "Academic_Directive_19.pdf"
  },
  {
    "id": "MSG-R20",
    "subject": "UGC / AICTE Teaching Load & STR Compliance Review (Ref #119)",
    "message": "Official notification regarding academic governance, curriculum compliance, faculty load audits, and student performance metrics for the current academic term. Please inspect the attached directive.",
    "sender": "Controller of Examinations",
    "receiver": "Academic Dean Office",
    "date": "2026-08-05 10:30 AM",
    "priority": "Medium",
    "status": "Read",
    "category": "Student Performance"
  },
  {
    "id": "MSG-R21",
    "subject": "Semester Mid-Term Question Paper Moderation Directive (Ref #120)",
    "message": "Official notification regarding academic governance, curriculum compliance, faculty load audits, and student performance metrics for the current academic term. Please inspect the attached directive.",
    "sender": "Dr. Srinivas Rao (HOD CSE)",
    "receiver": "Academic Dean Office",
    "date": "2026-08-04 10:30 AM",
    "priority": "Low",
    "status": "Unread",
    "category": "Academic Governance",
    "attachment": "Academic_Directive_21.pdf"
  },
  {
    "id": "MSG-R22",
    "subject": "Slow Learners Remedial Batch Allocation Confirmation (Ref #121)",
    "message": "Official notification regarding academic governance, curriculum compliance, faculty load audits, and student performance metrics for the current academic term. Please inspect the attached directive.",
    "sender": "Dr. Priya Sharma (HOD ECE)",
    "receiver": "Academic Dean Office",
    "date": "2026-08-03 10:30 AM",
    "priority": "High",
    "status": "Read",
    "category": "Curriculum"
  },
  {
    "id": "MSG-R23",
    "subject": "Dean's Honor Roll & Merit Scholarship Awardees List (Ref #122)",
    "message": "Official notification regarding academic governance, curriculum compliance, faculty load audits, and student performance metrics for the current academic term. Please inspect the attached directive.",
    "sender": "Dr. Ravi Kumar (HOD AI & DS)",
    "receiver": "Academic Dean Office",
    "date": "2026-08-02 10:30 AM",
    "priority": "Medium",
    "status": "Read",
    "category": "Accreditation",
    "attachment": "Academic_Directive_23.pdf"
  },
  {
    "id": "MSG-R24",
    "subject": "Outcome-Based Education (OBE) CO-PO Mapping Audit Passed (Ref #123)",
    "message": "Official notification regarding academic governance, curriculum compliance, faculty load audits, and student performance metrics for the current academic term. Please inspect the attached directive.",
    "sender": "Principal Academic Office",
    "receiver": "Academic Dean Office",
    "date": "2026-08-01 10:30 AM",
    "priority": "Low",
    "status": "Read",
    "category": "Exam Moderation"
  },
  {
    "id": "MSG-R25",
    "subject": "Academic Council Standing Committee Resolution Approval (Ref #124)",
    "message": "Official notification regarding academic governance, curriculum compliance, faculty load audits, and student performance metrics for the current academic term. Please inspect the attached directive.",
    "sender": "University Registrar Office",
    "receiver": "Academic Dean Office",
    "date": "2026-08-06 10:30 AM",
    "priority": "High",
    "status": "Unread",
    "category": "Student Performance",
    "attachment": "Academic_Directive_25.pdf"
  }
]);
  const [sentMsgs, setSentMsgs] = useState([
  {
    "id": "MSG-S01",
    "subject": "Faculty Circular: Mid-Term Exam Syllabus Coverage & Attendance Deficit (Circular #200)",
    "message": "Official Academic Dean circular issued to all department HODs, faculty members, and student coordinators for immediate implementation and compliance across all academic blocks.",
    "sender": "Academic Dean Office",
    "receiver": "All Department HODs & Faculty",
    "date": "2026-08-06 02:15 PM",
    "priority": "High",
    "status": "Delivered",
    "category": "Circular",
    "attachment": "Circular_Doc_1.pdf"
  },
  {
    "id": "MSG-S02",
    "subject": "Academic Calendar Released for Autumn Semester 2026 (Circular #201)",
    "message": "Official Academic Dean circular issued to all department HODs, faculty members, and student coordinators for immediate implementation and compliance across all academic blocks.",
    "sender": "Academic Dean Office",
    "receiver": "All Enrolled Engineering Students",
    "date": "2026-08-05 02:15 PM",
    "priority": "Medium",
    "status": "Delivered",
    "category": "Academic Calendar",
    "attachment": "Circular_Doc_2.pdf"
  },
  {
    "id": "MSG-S03",
    "subject": "Timetable Revision & Classroom Allocation Master Schedule (Circular #202)",
    "message": "Official Academic Dean circular issued to all department HODs, faculty members, and student coordinators for immediate implementation and compliance across all academic blocks.",
    "sender": "Academic Dean Office",
    "receiver": "Department Timetable Coordinators",
    "date": "2026-08-04 02:15 PM",
    "priority": "Medium",
    "status": "Delivered",
    "category": "Timetable",
    "attachment": "Circular_Doc_3.pdf"
  },
  {
    "id": "MSG-S04",
    "subject": "Departmental Workload & Substitute Allocation Sanction (Circular #203)",
    "message": "Official Academic Dean circular issued to all department HODs, faculty members, and student coordinators for immediate implementation and compliance across all academic blocks.",
    "sender": "Academic Dean Office",
    "receiver": "BOS Executive Members",
    "date": "2026-08-03 02:15 PM",
    "priority": "High",
    "status": "Delivered",
    "category": "Workload",
    "attachment": "Circular_Doc_4.pdf"
  },
  {
    "id": "MSG-S05",
    "subject": "Instructional Days & Attendance Shortage Alert Directive (Circular #204)",
    "message": "Official Academic Dean circular issued to all department HODs, faculty members, and student coordinators for immediate implementation and compliance across all academic blocks.",
    "sender": "Academic Dean Office",
    "receiver": "Dr. Srinivas Rao (HOD CSE)",
    "date": "2026-08-02 02:15 PM",
    "priority": "Medium",
    "status": "Delivered",
    "category": "Compliance",
    "attachment": "Circular_Doc_5.pdf"
  },
  {
    "id": "MSG-S06",
    "subject": "Course File Verification & OBE Bloom's Audit Notice (Circular #205)",
    "message": "Official Academic Dean circular issued to all department HODs, faculty members, and student coordinators for immediate implementation and compliance across all academic blocks.",
    "sender": "Academic Dean Office",
    "receiver": "Dr. Priya Sharma (HOD ECE)",
    "date": "2026-08-01 02:15 PM",
    "priority": "Medium",
    "status": "Delivered",
    "category": "Circular",
    "attachment": "Circular_Doc_6.pdf"
  },
  {
    "id": "MSG-S07",
    "subject": "Elective Course Equivalence Approval Release (Circular #206)",
    "message": "Official Academic Dean circular issued to all department HODs, faculty members, and student coordinators for immediate implementation and compliance across all academic blocks.",
    "sender": "Academic Dean Office",
    "receiver": "Dr. Ravi Kumar (HOD AI & DS)",
    "date": "2026-08-06 02:15 PM",
    "priority": "High",
    "status": "Delivered",
    "category": "Academic Calendar",
    "attachment": "Circular_Doc_7.pdf"
  },
  {
    "id": "MSG-S08",
    "subject": "Annual Department Performance & API Index Submission Notice (Circular #207)",
    "message": "Official Academic Dean circular issued to all department HODs, faculty members, and student coordinators for immediate implementation and compliance across all academic blocks.",
    "sender": "Academic Dean Office",
    "receiver": "All Academic Staff",
    "date": "2026-08-05 02:15 PM",
    "priority": "Medium",
    "status": "Delivered",
    "category": "Timetable",
    "attachment": "Circular_Doc_8.pdf"
  },
  {
    "id": "MSG-S09",
    "subject": "Faculty Circular: Mid-Term Exam Syllabus Coverage & Attendance Deficit (Circular #208)",
    "message": "Official Academic Dean circular issued to all department HODs, faculty members, and student coordinators for immediate implementation and compliance across all academic blocks.",
    "sender": "Academic Dean Office",
    "receiver": "All Department HODs & Faculty",
    "date": "2026-08-04 02:15 PM",
    "priority": "Medium",
    "status": "Delivered",
    "category": "Workload",
    "attachment": "Circular_Doc_9.pdf"
  },
  {
    "id": "MSG-S10",
    "subject": "Academic Calendar Released for Autumn Semester 2026 (Circular #209)",
    "message": "Official Academic Dean circular issued to all department HODs, faculty members, and student coordinators for immediate implementation and compliance across all academic blocks.",
    "sender": "Academic Dean Office",
    "receiver": "All Enrolled Engineering Students",
    "date": "2026-08-03 02:15 PM",
    "priority": "High",
    "status": "Delivered",
    "category": "Compliance",
    "attachment": "Circular_Doc_10.pdf"
  },
  {
    "id": "MSG-S11",
    "subject": "Timetable Revision & Classroom Allocation Master Schedule (Circular #210)",
    "message": "Official Academic Dean circular issued to all department HODs, faculty members, and student coordinators for immediate implementation and compliance across all academic blocks.",
    "sender": "Academic Dean Office",
    "receiver": "Department Timetable Coordinators",
    "date": "2026-08-02 02:15 PM",
    "priority": "Medium",
    "status": "Delivered",
    "category": "Circular",
    "attachment": "Circular_Doc_11.pdf"
  },
  {
    "id": "MSG-S12",
    "subject": "Departmental Workload & Substitute Allocation Sanction (Circular #211)",
    "message": "Official Academic Dean circular issued to all department HODs, faculty members, and student coordinators for immediate implementation and compliance across all academic blocks.",
    "sender": "Academic Dean Office",
    "receiver": "BOS Executive Members",
    "date": "2026-08-01 02:15 PM",
    "priority": "Medium",
    "status": "Delivered",
    "category": "Academic Calendar",
    "attachment": "Circular_Doc_12.pdf"
  },
  {
    "id": "MSG-S13",
    "subject": "Instructional Days & Attendance Shortage Alert Directive (Circular #212)",
    "message": "Official Academic Dean circular issued to all department HODs, faculty members, and student coordinators for immediate implementation and compliance across all academic blocks.",
    "sender": "Academic Dean Office",
    "receiver": "Dr. Srinivas Rao (HOD CSE)",
    "date": "2026-08-06 02:15 PM",
    "priority": "High",
    "status": "Delivered",
    "category": "Timetable",
    "attachment": "Circular_Doc_13.pdf"
  },
  {
    "id": "MSG-S14",
    "subject": "Course File Verification & OBE Bloom's Audit Notice (Circular #213)",
    "message": "Official Academic Dean circular issued to all department HODs, faculty members, and student coordinators for immediate implementation and compliance across all academic blocks.",
    "sender": "Academic Dean Office",
    "receiver": "Dr. Priya Sharma (HOD ECE)",
    "date": "2026-08-05 02:15 PM",
    "priority": "Medium",
    "status": "Delivered",
    "category": "Workload",
    "attachment": "Circular_Doc_14.pdf"
  },
  {
    "id": "MSG-S15",
    "subject": "Elective Course Equivalence Approval Release (Circular #214)",
    "message": "Official Academic Dean circular issued to all department HODs, faculty members, and student coordinators for immediate implementation and compliance across all academic blocks.",
    "sender": "Academic Dean Office",
    "receiver": "Dr. Ravi Kumar (HOD AI & DS)",
    "date": "2026-08-04 02:15 PM",
    "priority": "Medium",
    "status": "Delivered",
    "category": "Compliance",
    "attachment": "Circular_Doc_15.pdf"
  },
  {
    "id": "MSG-S16",
    "subject": "Annual Department Performance & API Index Submission Notice (Circular #215)",
    "message": "Official Academic Dean circular issued to all department HODs, faculty members, and student coordinators for immediate implementation and compliance across all academic blocks.",
    "sender": "Academic Dean Office",
    "receiver": "All Academic Staff",
    "date": "2026-08-03 02:15 PM",
    "priority": "High",
    "status": "Delivered",
    "category": "Circular",
    "attachment": "Circular_Doc_16.pdf"
  },
  {
    "id": "MSG-S17",
    "subject": "Faculty Circular: Mid-Term Exam Syllabus Coverage & Attendance Deficit (Circular #216)",
    "message": "Official Academic Dean circular issued to all department HODs, faculty members, and student coordinators for immediate implementation and compliance across all academic blocks.",
    "sender": "Academic Dean Office",
    "receiver": "All Department HODs & Faculty",
    "date": "2026-08-02 02:15 PM",
    "priority": "Medium",
    "status": "Delivered",
    "category": "Academic Calendar",
    "attachment": "Circular_Doc_17.pdf"
  },
  {
    "id": "MSG-S18",
    "subject": "Academic Calendar Released for Autumn Semester 2026 (Circular #217)",
    "message": "Official Academic Dean circular issued to all department HODs, faculty members, and student coordinators for immediate implementation and compliance across all academic blocks.",
    "sender": "Academic Dean Office",
    "receiver": "All Enrolled Engineering Students",
    "date": "2026-08-01 02:15 PM",
    "priority": "Medium",
    "status": "Delivered",
    "category": "Timetable",
    "attachment": "Circular_Doc_18.pdf"
  },
  {
    "id": "MSG-S19",
    "subject": "Timetable Revision & Classroom Allocation Master Schedule (Circular #218)",
    "message": "Official Academic Dean circular issued to all department HODs, faculty members, and student coordinators for immediate implementation and compliance across all academic blocks.",
    "sender": "Academic Dean Office",
    "receiver": "Department Timetable Coordinators",
    "date": "2026-08-06 02:15 PM",
    "priority": "High",
    "status": "Delivered",
    "category": "Workload",
    "attachment": "Circular_Doc_19.pdf"
  },
  {
    "id": "MSG-S20",
    "subject": "Departmental Workload & Substitute Allocation Sanction (Circular #219)",
    "message": "Official Academic Dean circular issued to all department HODs, faculty members, and student coordinators for immediate implementation and compliance across all academic blocks.",
    "sender": "Academic Dean Office",
    "receiver": "BOS Executive Members",
    "date": "2026-08-05 02:15 PM",
    "priority": "Medium",
    "status": "Delivered",
    "category": "Compliance",
    "attachment": "Circular_Doc_20.pdf"
  },
  {
    "id": "MSG-S21",
    "subject": "Instructional Days & Attendance Shortage Alert Directive (Circular #220)",
    "message": "Official Academic Dean circular issued to all department HODs, faculty members, and student coordinators for immediate implementation and compliance across all academic blocks.",
    "sender": "Academic Dean Office",
    "receiver": "Dr. Srinivas Rao (HOD CSE)",
    "date": "2026-08-04 02:15 PM",
    "priority": "Medium",
    "status": "Delivered",
    "category": "Circular",
    "attachment": "Circular_Doc_21.pdf"
  },
  {
    "id": "MSG-S22",
    "subject": "Course File Verification & OBE Bloom's Audit Notice (Circular #221)",
    "message": "Official Academic Dean circular issued to all department HODs, faculty members, and student coordinators for immediate implementation and compliance across all academic blocks.",
    "sender": "Academic Dean Office",
    "receiver": "Dr. Priya Sharma (HOD ECE)",
    "date": "2026-08-03 02:15 PM",
    "priority": "High",
    "status": "Delivered",
    "category": "Academic Calendar",
    "attachment": "Circular_Doc_22.pdf"
  },
  {
    "id": "MSG-S23",
    "subject": "Elective Course Equivalence Approval Release (Circular #222)",
    "message": "Official Academic Dean circular issued to all department HODs, faculty members, and student coordinators for immediate implementation and compliance across all academic blocks.",
    "sender": "Academic Dean Office",
    "receiver": "Dr. Ravi Kumar (HOD AI & DS)",
    "date": "2026-08-02 02:15 PM",
    "priority": "Medium",
    "status": "Delivered",
    "category": "Timetable",
    "attachment": "Circular_Doc_23.pdf"
  },
  {
    "id": "MSG-S24",
    "subject": "Annual Department Performance & API Index Submission Notice (Circular #223)",
    "message": "Official Academic Dean circular issued to all department HODs, faculty members, and student coordinators for immediate implementation and compliance across all academic blocks.",
    "sender": "Academic Dean Office",
    "receiver": "All Academic Staff",
    "date": "2026-08-01 02:15 PM",
    "priority": "Medium",
    "status": "Delivered",
    "category": "Workload",
    "attachment": "Circular_Doc_24.pdf"
  },
  {
    "id": "MSG-S25",
    "subject": "Faculty Circular: Mid-Term Exam Syllabus Coverage & Attendance Deficit (Circular #224)",
    "message": "Official Academic Dean circular issued to all department HODs, faculty members, and student coordinators for immediate implementation and compliance across all academic blocks.",
    "sender": "Academic Dean Office",
    "receiver": "All Department HODs & Faculty",
    "date": "2026-08-06 02:15 PM",
    "priority": "High",
    "status": "Delivered",
    "category": "Compliance",
    "attachment": "Circular_Doc_25.pdf"
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
      sender: "Academic Dean Office",
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
            <Badge variant="outline" className="font-mono text-[0.65rem] uppercase text-primary border-primary/30">ACADEMIC COMMUNICATION</Badge>
            <span className="text-xs text-muted-foreground">• Institutional Notifications System</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Notification Center</h1>
          <p className="text-sm text-muted-foreground">Executive communication ledger for Academic Dean. Broadcast alerts, circulars, and departmental memos.</p>
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
