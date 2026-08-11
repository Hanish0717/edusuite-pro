import React from "react";
import { StudentProfileData } from "../types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, Activity, ShieldCheck, AlertTriangle, Syringe, Phone, UserCheck, FileText } from "lucide-react";

interface MedicalTabProps {
  student: StudentProfileData;
}

export function MedicalTab({ student }: MedicalTabProps) {
  const m = student.medical;

  return (
    <div className="space-y-6">
      
      <div className="flex items-center justify-between p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Heart className="h-5 w-5 text-rose-600 animate-pulse" /> Student Health & Medical Profile
          </h3>
          <p className="text-xs text-slate-500">Campus wellness center records & emergency response data</p>
        </div>
        <Badge className="bg-rose-500/10 text-rose-600 border-rose-500/20 font-bold">
          Blood Group: {m.bloodGroup}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* HEALTH INSURANCE CARD */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm space-y-3">
          <div className="flex items-center gap-2 border-b pb-2 border-slate-100 dark:border-slate-800">
            <ShieldCheck className="h-5 w-5 text-blue-600" />
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">Campus Insurance Cover</h4>
          </div>
          <div className="space-y-2 text-xs">
            <div>
              <span className="text-slate-500 block text-[10px]">Provider</span>
              <strong className="text-slate-800 dark:text-slate-200">{m.insuranceProvider}</strong>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">Policy Number</span>
              <strong className="font-mono text-blue-600">{m.insurancePolicyNumber}</strong>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">Valid Till</span>
              <strong className="text-emerald-600">{m.validTill}</strong>
            </div>
          </div>
        </div>

        {/* ALLERGIES & PRE-EXISTING */}
        <div className="rounded-2xl border border-amber-200 dark:border-amber-900/40 bg-amber-50/30 dark:bg-amber-950/20 p-5 shadow-sm space-y-3">
          <div className="flex items-center gap-2 border-b pb-2 border-amber-200 dark:border-amber-900/40">
            <AlertTriangle className="h-5 w-5 text-amber-600" />
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">Known Allergies & Conditions</h4>
          </div>
          <div className="space-y-2 text-xs">
            <div>
              <span className="text-slate-500 block text-[10px]">Allergies</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {m.allergies.map((alg, i) => (
                  <Badge key={i} className="bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20 text-[10px]">
                    {alg}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">Pre-existing Medical History</span>
              <p className="text-slate-700 dark:text-slate-300 font-medium">{m.medicalConditions.join(", ")}</p>
            </div>
          </div>
        </div>

        {/* CAMPUS DOCTOR & EMERGENCY */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm space-y-3">
          <div className="flex items-center gap-2 border-b pb-2 border-slate-100 dark:border-slate-800">
            <UserCheck className="h-5 w-5 text-emerald-600" />
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">Campus Doctor & Emergency</h4>
          </div>
          <div className="space-y-2 text-xs">
            <div>
              <span className="text-slate-500 block text-[10px]">Attending Campus Doctor</span>
              <strong className="text-slate-800 dark:text-slate-200">{m.campusDoctorName}</strong>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">Infirmary Phone</span>
              <strong className="font-mono text-emerald-600">{m.campusDoctorPhone}</strong>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">Disability Category</span>
              <strong className="text-slate-700 dark:text-slate-300">{m.disabilityDetails}</strong>
            </div>
          </div>
        </div>

      </div>

      {/* VACCINATION LOG */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm space-y-4">
        <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Syringe className="h-4 w-4 text-purple-600" /> Vaccination & Immunization History
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {m.vaccinations.map((vax, idx) => (
            <div key={idx} className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-1">
              <span className="text-xs font-bold text-slate-900 dark:text-white block">{vax.name}</span>
              <div className="flex items-center justify-between text-[11px] text-slate-500">
                <span>Date: {vax.date}</span>
                <Badge className="bg-emerald-500/10 text-emerald-600 text-[9px]">{vax.status}</Badge>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
