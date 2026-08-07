import React from "react";
import { StudentProfileData } from "./types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  IdCard,
  Edit3,
  Download,
  Printer,
  QrCode,
  CheckCircle2,
  GraduationCap,
  Building2,
  Calendar,
  Sparkles,
  ShieldCheck,
  UserCheck,
  KeyRound,
} from "lucide-react";

interface HeaderCardProps {
  student: StudentProfileData;
  onOpenIdCard: () => void;
  onOpenQr: () => void;
  onOpenEdit: () => void;
  onOpenResetPassword?: () => void;
  onDownloadPdf: () => void;
  onPrint: () => void;
}

export function StudentHeaderCard({
  student,
  onOpenIdCard,
  onOpenQr,
  onOpenEdit,
  onOpenResetPassword,
  onDownloadPdf,
  onPrint,
}: HeaderCardProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm transition-all duration-300 hover:shadow-md">
      {/* Background Subtle Gradient Accent */}
      <div className="absolute top-0 right-0 -mt-12 -mr-12 h-48 w-48 rounded-full bg-gradient-to-br from-blue-600/10 to-indigo-600/5 blur-2xl pointer-events-none" />
      
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between relative z-10">
        
        {/* Left Side: Avatar & Core Student Identity */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
          
          {/* Avatar Container with Animated Ring & Status Indicator */}
          <div className="relative group cursor-pointer" onClick={onOpenEdit}>
            <div className="relative h-28 w-28 rounded-2xl overflow-hidden border-2 border-blue-600/20 shadow-md bg-slate-100 dark:bg-slate-800 flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
              <img
                src={student.avatarUrl}
                alt={student.name}
                className="h-full w-full object-cover"
                onError={(e) => {
                  // Fallback if network image fails
                  (e.target as HTMLElement).style.display = "none";
                }}
              />
              <span className="font-bold text-2xl text-blue-600 dark:text-blue-400 font-display">
                {student.initials}
              </span>
            </div>
            
            {/* Online/Active Pulse Status */}
            <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 ring-4 ring-white dark:ring-slate-900" title="Status: Active Student">
              <UserCheck className="h-3.5 w-3.5 text-white" />
            </div>
            
            <div className="absolute inset-0 rounded-2xl bg-blue-900/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white text-xs font-semibold gap-1">
              <Edit3 className="h-3.5 w-3.5" /> Edit
            </div>
          </div>

          {/* Core Info */}
          <div className="space-y-2">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h1 className="text-2xl font-bold font-display tracking-tight text-slate-900 dark:text-white">
                {student.name}
              </h1>
              <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5" /> {student.status}
              </Badge>
            </div>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-4 gap-y-1.5 text-xs text-slate-600 dark:text-slate-400">
              <div className="flex items-center gap-1.5 font-medium">
                <span className="text-slate-400">Roll:</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                  {student.rollNumber}
                </span>
              </div>
              <div className="flex items-center gap-1.5 font-medium">
                <Building2 className="h-3.5 w-3.5 text-blue-600" />
                <span>{student.department}</span>
              </div>
              <div className="flex items-center gap-1.5 font-medium">
                <GraduationCap className="h-3.5 w-3.5 text-blue-600" />
                <span>Semester {student.currentSemester} ({student.degree})</span>
              </div>
            </div>

            {/* Badges Bar */}
            <div className="pt-1 flex flex-wrap items-center justify-center sm:justify-start gap-2 text-[11px]">
              <span className="inline-flex items-center gap-1 text-slate-500 dark:text-slate-400">
                <Calendar className="h-3 w-3 text-slate-400" /> Batch: <strong className="text-slate-700 dark:text-slate-200">{student.batch}</strong>
              </span>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <span className="inline-flex items-center gap-1 text-slate-500 dark:text-slate-400">
                <ShieldCheck className="h-3 w-3 text-blue-500" /> Adm No: <strong className="text-slate-700 dark:text-slate-200">{student.admissionNumber || student.registrationNumber}</strong>
              </span>
            </div>
          </div>
        </div>

        {/* Right Side: Action Button Toolbar */}
        <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row items-center gap-3 border-t md:border-t-0 pt-4 md:pt-0 border-slate-100 dark:border-slate-800">

          {/* Primary Action Buttons */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button
              onClick={onOpenEdit}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs shadow-sm shadow-blue-500/20 gap-1.5 h-9 px-4 font-medium"
            >
              <Edit3 className="h-3.5 w-3.5" /> Edit Profile
            </Button>

            {onOpenResetPassword && (
              <Button
                onClick={onOpenResetPassword}
                variant="outline"
                className="border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs gap-1.5 h-9 px-4 font-medium"
              >
                <KeyRound className="h-3.5 w-3.5 text-amber-500" /> Reset Password
              </Button>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
