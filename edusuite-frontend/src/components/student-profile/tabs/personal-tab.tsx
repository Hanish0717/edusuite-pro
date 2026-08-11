import React from "react";
import { StudentProfileData } from "../types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { User, Phone, Mail, Calendar, ShieldCheck, Heart, Languages, Globe, FileText, Lock, Edit3 } from "lucide-react";

interface PersonalTabProps {
  student: StudentProfileData;
  onEdit: () => void;
}

export function PersonalTab({ student, onEdit }: PersonalTabProps) {
  const p = student.personal;

  const items = [
    { label: "Full Name", value: student.name, icon: User },
    { label: "Gender", value: p.gender, icon: User },
    { label: "Date of Birth", value: p.dob, icon: Calendar },
    { label: "Blood Group", value: p.bloodGroup, icon: Heart, highlight: true },
    { label: "Nationality", value: p.nationality, icon: Globe },
    { label: "Religion", value: p.religion, icon: Globe },
    { label: "Category", value: p.category, icon: ShieldCheck },
    { label: "Phone Number", value: p.phone, icon: Phone },
    { label: "Email Address", value: p.email, icon: Mail },
    { label: "Aadhar Number", value: p.aadharNumber, icon: FileText, isSecret: true },
    { label: "Passport Number", value: p.passportNumber, icon: FileText, isSecret: true },
    { label: "Emergency Contact", value: `${p.emergencyContact.name} (${p.emergencyContact.phone})`, icon: Phone, highlight: true },
    { label: "Languages Spoken", value: p.languages.join(", "), icon: Languages },
    { label: "Marital Status", value: p.maritalStatus, icon: User },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <User className="h-5 w-5 text-blue-600" /> Student Personal Records
          </h3>
          <p className="text-xs text-slate-500">Official government ID & contact records</p>
        </div>
        <Button onClick={onEdit} size="sm" variant="outline" className="rounded-xl text-xs gap-1.5 border-slate-200 dark:border-slate-700">
          <Edit3 className="h-3.5 w-3.5 text-blue-600" /> Edit Personal Details
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item, index) => {
          const IconComp = item.icon;
          return (
            <div
              key={index}
              className={`p-4 rounded-xl border bg-white dark:bg-slate-900 shadow-sm space-y-1.5 ${
                item.highlight
                  ? "border-blue-200 dark:border-blue-900/60 bg-blue-50/30 dark:bg-blue-950/20"
                  : "border-slate-200 dark:border-slate-800"
              }`}
            >
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
                <IconComp className="h-3.5 w-3.5 text-blue-600" />
                <span>{item.label}</span>
              </div>
              <div className="text-sm font-bold text-slate-900 dark:text-white flex items-center justify-between">
                <span>{item.value}</span>
                {item.isSecret && (
                  <Badge variant="outline" className="text-[9px] font-mono text-emerald-600 border-emerald-300">
                    VERIFIED
                  </Badge>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
