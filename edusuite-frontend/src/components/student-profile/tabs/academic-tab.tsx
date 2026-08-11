import React, { useState } from "react";
import { StudentProfileData } from "../types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  GraduationCap,
  Building2,
  Award,
  Calendar,
  CheckCircle2,
  UserCheck,
  Search,
  Download,
  BookOpen,
  Mail,
  Phone,
} from "lucide-react";

interface AcademicTabProps {
  student: StudentProfileData;
  onContactMentor: () => void;
}

export function AcademicTab({ student, onContactMentor }: AcademicTabProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const academicFields = [
    { label: "Roll Number", value: student.rollNumber, isMono: true },
    { label: "Registration Number", value: student.registrationNumber, isMono: true },
    { label: "Admission Number", value: student.admissionNumber, isMono: true },
    { label: "Program", value: student.program },
    { label: "Degree", value: student.degree },
    { label: "Branch / Department", value: student.branch },
    { label: "Section", value: student.section },
    { label: "Current Semester", value: `Semester ${student.currentSemester} (Year 3)` },
    { label: "Batch", value: student.batch },
    { label: "Academic Year", value: student.academicYear },
    { label: "Admission Type", value: student.admissionType },
    { label: "Student Status", value: student.status, badge: "Active" },
  ];

  const filteredSemesters = student.semesterResults.filter(
    (s) =>
      `Semester ${s.semester}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.monthYear.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.sgpa.toString().includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      
      {/* 1. ACADEMIC IDENTIFIERS GRID */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b pb-3 border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-blue-600" /> Institution Academic Enrollment Details
            </h3>
            <p className="text-xs text-slate-500">Curriculum track, section, and semester status</p>
          </div>
          <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/20 font-mono">
            CGPA: {student.cgpa} / 10.0
          </Badge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {academicFields.map((field, idx) => (
            <div key={idx} className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-1">
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block">
                {field.label}
              </span>
              <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span className={field.isMono ? "font-mono text-blue-600 dark:text-blue-400 font-bold" : ""}>
                  {field.value}
                </span>
                {field.badge && (
                  <Badge className="bg-emerald-500/10 text-emerald-600 text-[9px]">
                    {field.badge}
                  </Badge>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. ACADEMIC ADVISOR / MENTOR CARD */}
      <div className="rounded-2xl border border-teal-200 dark:border-teal-900/40 bg-teal-50/30 dark:bg-teal-950/20 p-5 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4 text-center sm:text-left">
          <div className="h-14 w-14 rounded-2xl bg-teal-600 text-white font-bold font-display text-xl grid place-items-center shadow-md">
            RK
          </div>
          <div>
            <div className="text-[10px] uppercase font-bold text-teal-600 dark:text-teal-400 tracking-wider">Assigned Faculty Advisor</div>
            <h4 className="text-base font-bold text-slate-900 dark:text-white">{student.academicAdvisor.name}</h4>
            <p className="text-xs text-slate-500">{student.academicAdvisor.designation}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button onClick={onContactMentor} size="sm" className="rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs gap-1.5 shadow-sm">
            <Mail className="h-3.5 w-3.5" /> Email Advisor
          </Button>
          <Button size="sm" variant="outline" className="rounded-xl border-teal-300 text-teal-700 dark:text-teal-300 text-xs gap-1.5">
            <Phone className="h-3.5 w-3.5" /> Call
          </Button>
        </div>
      </div>

      {/* 3. SEMESTER GRADE BREAKDOWN TABLE */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Award className="h-5 w-5 text-emerald-600" /> Semester Grade History & Transcripts
            </h3>
            <p className="text-xs text-slate-500">Official SGPA & CGPA record evaluated by Controller of Exams</p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative w-48">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
              <Input
                placeholder="Search term/semester..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 h-8 text-xs rounded-xl"
              />
            </div>
            <Button size="sm" variant="outline" className="h-8 text-xs rounded-xl gap-1" onClick={() => alert("Downloading Transcripts PDF...")}>
              <Download className="h-3.5 w-3.5" /> Export
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 font-semibold bg-slate-50 dark:bg-slate-800/50">
                <th className="p-3 rounded-l-xl">Semester</th>
                <th className="p-3">Examination Month</th>
                <th className="p-3">Attempted Credits</th>
                <th className="p-3">Earned Credits</th>
                <th className="p-3">SGPA</th>
                <th className="p-3">Cumulative CGPA</th>
                <th className="p-3 rounded-r-xl">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredSemesters.map((sem) => (
                <tr key={sem.semester} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="p-3 font-bold font-mono text-slate-900 dark:text-white">Semester {sem.semester}</td>
                  <td className="p-3 text-slate-600 dark:text-slate-400">{sem.monthYear}</td>
                  <td className="p-3 font-mono">{sem.creditsAttempted}</td>
                  <td className="p-3 font-mono">{sem.creditsEarned}</td>
                  <td className="p-3 font-bold font-mono text-blue-600">{sem.sgpa.toFixed(2)}</td>
                  <td className="p-3 font-bold font-mono text-emerald-600">{sem.cgpa.toFixed(2)}</td>
                  <td className="p-3">
                    <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[10px]">
                      PASS
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
