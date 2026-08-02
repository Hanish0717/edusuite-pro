import React from "react";
import { StudentProfileData } from "../types";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Mail,
  GraduationCap,
  Users,
  ShieldCheck,
  Award,
  Building2 as HostelIcon,
} from "lucide-react";

interface OverviewTabProps {
  student: StudentProfileData;
  onOpenBonafide?: () => void;
  onOpenLeave?: () => void;
  onOpenPayFees?: () => void;
  onOpenIdCard?: () => void;
  onOpenLibrarySearch?: () => void;
}

export function OverviewTab({ student }: OverviewTabProps) {
  return (
    <div className="space-y-6">
      
      {/* 2-COLUMN GRID FOR MASTER PROFILE DATA */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* 1. BASIC INFORMATION CARD */}
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <User className="h-4 w-4 text-[#0b193c] dark:text-blue-400" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Basic Information</h3>
          </div>

          <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-xs">
            <div>
              <span className="text-slate-400 block text-[11px]">Full Name</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{student.name}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Gender</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{student.personal.gender}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Date of Birth</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{student.personal.dob}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Blood Group</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{student.personal.bloodGroup}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Category</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{student.personal.category}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Religion</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{student.personal.religion}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Nationality</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{student.personal.nationality}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Admission Type</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{student.admissionType}</span>
            </div>
          </div>
        </div>

        {/* 2. CONTACT INFORMATION CARD */}
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <Mail className="h-4 w-4 text-[#0b193c] dark:text-blue-400" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Contact Information</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3 text-xs">
            <div>
              <span className="text-slate-400 block text-[11px]">University Email</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200 break-all">{student.personal.email}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Mobile Phone</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{student.personal.phone}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Emergency Contact</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{student.personal.emergencyContact.name} ({student.personal.emergencyContact.relationship})</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Emergency Phone</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{student.personal.emergencyContact.phone}</span>
            </div>
            <div className="sm:col-span-2">
              <span className="text-slate-400 block text-[11px]">Permanent Address</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {student.address.permanent.street}, {student.address.permanent.city}, {student.address.permanent.state} - {student.address.permanent.pincode}
              </span>
            </div>
          </div>
        </div>

        {/* 3. ACADEMIC INFORMATION CARD */}
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <GraduationCap className="h-4 w-4 text-[#0b193c] dark:text-blue-400" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Academic Information</h3>
          </div>

          <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-xs">
            <div>
              <span className="text-slate-400 block text-[11px]">Roll Number</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200 font-mono">{student.rollNumber}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Registration Number</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200 font-mono">{student.registrationNumber}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Department</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{student.department}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Program & Degree</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{student.degree} - {student.program}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Current Semester</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">Semester {student.currentSemester} (Section {student.section})</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Batch & Academic Year</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{student.batch} ({student.academicYear})</span>
            </div>
          </div>
        </div>

        {/* 4. GUARDIAN INFORMATION CARD */}
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <Users className="h-4 w-4 text-[#0b193c] dark:text-blue-400" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Guardian Information</h3>
          </div>

          <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-xs">
            <div>
              <span className="text-slate-400 block text-[11px]">Father's Name</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{student.parent.father.name}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Father's Occupation</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{student.parent.father.occupation}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Father's Phone</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{student.parent.father.phone}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Mother's Name</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{student.parent.mother.name}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Mother's Occupation</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{student.parent.mother.occupation}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Mother's Phone</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{student.parent.mother.phone}</span>
            </div>
          </div>
        </div>

        {/* 5. CURRENT STATUS CARD */}
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <ShieldCheck className="h-4 w-4 text-[#0b193c] dark:text-blue-400" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Current Status & Standing</h3>
          </div>

          <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-xs">
            <div>
              <span className="text-slate-400 block text-[11px]">Enrollment Status</span>
              <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 font-semibold px-2 py-0.5 rounded-full">
                {student.status}
              </Badge>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Batch Rank</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">Rank #{student.rank} of {student.totalStudentsInBatch}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Cumulative CGPA</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{student.cgpa} / {student.maxCgpa}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Overall Attendance</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{student.attendancePercentage}%</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Active Backlogs</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{student.activeBacklogs} Active</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Fee Status</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{student.feeStatus}</span>
            </div>
          </div>
        </div>

        {/* 6. SCHOLARSHIP & MENTOR DETAILS CARD */}
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <Award className="h-4 w-4 text-[#0b193c] dark:text-blue-400" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Scholarship & Mentor Details</h3>
          </div>

          <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-xs">
            <div>
              <span className="text-slate-400 block text-[11px]">Scholarship Name</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{student.scholarshipName}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Annual Amount</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">₹ {student.scholarshipAmount.toLocaleString()} / Year</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Assigned Mentor</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{student.academicAdvisor.name}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Mentor Designation</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{student.academicAdvisor.designation}</span>
            </div>
            <div className="col-span-2">
              <span className="text-slate-400 block text-[11px]">Mentor Email</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{student.academicAdvisor.email}</span>
            </div>
          </div>
        </div>

        {/* 7. HOSTEL & TRANSPORT STATUS CARD */}
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4 md:col-span-2">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <HostelIcon className="h-4 w-4 text-[#0b193c] dark:text-blue-400" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Hostel & Transport Status</h3>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-3 text-xs">
            <div>
              <span className="text-slate-400 block text-[11px]">Hostel Block & Room</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{student.hostel.block} - Room {student.hostel.roomNo} ({student.hostel.roomType})</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Mess Plan</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{student.hostel.messName} ({student.hostel.messPlan})</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Bus Number & Route</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">Bus #{student.transport.busNumber} ({student.transport.routeName})</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Pickup Point</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{student.transport.pickupPoint} ({student.transport.pickupTime})</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
