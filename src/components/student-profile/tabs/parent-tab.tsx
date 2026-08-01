import React from "react";
import { StudentProfileData } from "../types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Phone, Mail, DollarSign, Briefcase, MapPin, User, ShieldCheck } from "lucide-react";

interface ParentTabProps {
  student: StudentProfileData;
}

export function ParentTab({ student }: ParentTabProps) {
  const p = student.parent;

  return (
    <div className="space-y-6">
      
      <div className="flex items-center justify-between p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-600" /> Parent & Guardian Records
          </h3>
          <p className="text-xs text-slate-500">Verified primary contacts for fee billing and communications</p>
        </div>
        <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
          Parent Portal Active
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* FATHER'S CARD */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-3 border-b pb-3 border-slate-100 dark:border-slate-800">
            <div className="h-12 w-12 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 font-bold font-display text-lg grid place-items-center border border-blue-200 dark:border-blue-800">
              FR
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-blue-600 tracking-wider">Father / Primary Guardian</span>
              <h4 className="text-base font-bold text-slate-900 dark:text-white">{p.father.name}</h4>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-500 flex items-center gap-1.5"><Briefcase className="h-3.5 w-3.5 text-slate-400" /> Occupation:</span>
              <strong className="text-slate-800 dark:text-slate-200">{p.father.occupation}</strong>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500 flex items-center gap-1.5"><DollarSign className="h-3.5 w-3.5 text-slate-400" /> Annual Income:</span>
              <strong className="text-emerald-600 font-mono">{p.father.annualIncome}</strong>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500 flex items-center gap-1.5"><Phone className="h-3.5 w-3.5 text-slate-400" /> Phone:</span>
              <strong className="text-slate-800 dark:text-slate-200 font-mono">{p.father.phone}</strong>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500 flex items-center gap-1.5"><Mail className="h-3.5 w-3.5 text-slate-400" /> Email:</span>
              <strong className="text-slate-800 dark:text-slate-200">{p.father.email}</strong>
            </div>
          </div>
        </div>

        {/* MOTHER'S CARD */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-3 border-b pb-3 border-slate-100 dark:border-slate-800">
            <div className="h-12 w-12 rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-600 font-bold font-display text-lg grid place-items-center border border-purple-200 dark:border-purple-800">
              MR
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-purple-600 tracking-wider">Mother</span>
              <h4 className="text-base font-bold text-slate-900 dark:text-white">{p.mother.name}</h4>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-500 flex items-center gap-1.5"><Briefcase className="h-3.5 w-3.5 text-slate-400" /> Occupation:</span>
              <strong className="text-slate-800 dark:text-slate-200">{p.mother.occupation}</strong>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500 flex items-center gap-1.5"><DollarSign className="h-3.5 w-3.5 text-slate-400" /> Annual Income:</span>
              <strong className="text-emerald-600 font-mono">{p.mother.annualIncome}</strong>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500 flex items-center gap-1.5"><Phone className="h-3.5 w-3.5 text-slate-400" /> Phone:</span>
              <strong className="text-slate-800 dark:text-slate-200 font-mono">{p.mother.phone}</strong>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500 flex items-center gap-1.5"><Mail className="h-3.5 w-3.5 text-slate-400" /> Email:</span>
              <strong className="text-slate-800 dark:text-slate-200">{p.mother.email}</strong>
            </div>
          </div>
        </div>

      </div>

      {/* LOCAL GUARDIAN CARD */}
      {p.guardian && (
        <div className="rounded-2xl border border-amber-200 dark:border-amber-900/40 bg-amber-50/30 dark:bg-amber-950/20 p-5 shadow-sm space-y-3">
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-amber-600" />
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">Local Guardian Address</h4>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <span className="text-slate-500 block text-[11px]">Guardian Name</span>
              <strong className="text-slate-800 dark:text-slate-200">{p.guardian.name}</strong>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">Relationship</span>
              <strong className="text-slate-800 dark:text-slate-200">{p.guardian.relationship}</strong>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">Contact</span>
              <strong className="text-slate-800 dark:text-slate-200 font-mono">{p.guardian.phone}</strong>
            </div>
          </div>
          <div className="text-xs text-slate-600 dark:text-slate-400 pt-1">
            <span className="font-semibold text-slate-700 dark:text-slate-300">Local Address:</span> {p.guardian.address}
          </div>
        </div>
      )}

    </div>
  );
}
