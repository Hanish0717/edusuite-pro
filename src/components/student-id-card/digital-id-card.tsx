import React, { useState } from "react";
import { StudentIdCardData } from "./types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  RotateCw,
  ShieldCheck,
  QrCode,
  Phone,
  Mail,
  MapPin,
  Building2,
  BookOpen,
  BedDouble,
  Bus,
  CheckCircle2,
  Calendar,
  Sparkles,
} from "lucide-react";
import { downloadStudentIdCardPdf } from "@/components/student-profile/download-id-card";

interface DigitalIdCardProps {
  cardData: StudentIdCardData;
}

export function DigitalIdCard({ cardData }: DigitalIdCardProps) {
  const [side, setSide] = useState<"front" | "back">("front");

  return (
    <div className="space-y-4">
      {/* CARD FLIP CONTROLLER HEADER */}
      <div className="flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-2">
          <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/20 font-bold px-3 py-1">
            {side === "front" ? "FRONT VIEW" : "BACK VIEW"}
          </Badge>
          <span className="text-xs text-slate-500 hidden sm:inline">
            Click toggle to flip identity card
          </span>
        </div>

        <Button
          onClick={() => setSide(side === "front" ? "back" : "front")}
          variant="outline"
          size="sm"
          className="rounded-xl text-xs gap-2 border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40"
        >
          <RotateCw className="h-3.5 w-3.5" /> Flip Card to {side === "front" ? "Back" : "Front"}
        </Button>
      </div>

      {/* ID CARD CONTAINER */}
      <div className="relative mx-auto max-w-md min-h-[460px] rounded-3xl overflow-hidden border-2 border-slate-800/80 bg-slate-950 text-white shadow-2xl transition-all duration-500 p-6 flex flex-col justify-between">
        
        {/* TOP GLOW & BACKGROUND WATERMARK */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 h-40 w-40 rounded-full bg-blue-600/20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 h-40 w-40 rounded-full bg-indigo-600/20 blur-3xl pointer-events-none" />

        {side === "front" ? (
          /* FRONT SIDE CONTENT */
          <div className="space-y-4 relative z-10 flex flex-col h-full justify-between">
            
            {/* INSTITUTION HEADER */}
            <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-xl bg-blue-600 grid place-items-center font-bold text-white shadow-md">
                  EP
                </div>
                <div>
                  <h3 className="text-xs font-bold tracking-tight text-white uppercase leading-none">
                    EduSuite Pro
                  </h3>
                  <p className="text-[10px] text-slate-400 font-mono mt-0.5">College of Engineering</p>
                </div>
              </div>
              <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 text-[10px] uppercase font-bold">
                {cardData.status} PASS
              </Badge>
            </div>

            {/* MAIN STUDENT INFO BODY */}
            <div className="flex items-center gap-4 py-2">
              {/* STUDENT PHOTO */}
              <div className="relative h-28 w-24 rounded-2xl overflow-hidden border-2 border-blue-500/40 bg-slate-800 shadow-md shrink-0">
                <img
                  src={cardData.avatarUrl}
                  alt={cardData.name}
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = "none";
                  }}
                />
                <span className="font-bold text-xl text-blue-400 font-display grid place-items-center h-full">
                  {cardData.initials}
                </span>
              </div>

              {/* IDENTITY METRICS */}
              <div className="space-y-1 text-xs">
                <h4 className="text-base font-extrabold text-white font-display leading-snug">
                  {cardData.name}
                </h4>
                <div className="text-blue-400 font-mono font-bold text-xs">
                  Roll No: {cardData.rollNumber}
                </div>
                <div className="text-slate-300 text-[11px] font-medium">
                  {cardData.department}
                </div>
                <div className="text-slate-400 text-[11px]">
                  {cardData.degree} &middot; {cardData.year}
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <Badge variant="outline" className="text-[10px] border-rose-500/40 bg-rose-500/10 text-rose-300 font-semibold">
                    Blood: {cardData.bloodGroup}
                  </Badge>
                  <span className="text-[10px] text-slate-400 font-mono">Sec: {cardData.section}</span>
                </div>
              </div>
            </div>

            {/* KEY DATES & REGISTRATION */}
            <div className="grid grid-cols-2 gap-2 text-[11px] bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
              <div>
                <span className="text-slate-500 block text-[9px] uppercase font-mono">Adm. Number</span>
                <strong className="text-slate-200 font-mono text-[10px]">{cardData.admissionNumber || cardData.registrationNumber}</strong>
              </div>
              <div>
                <span className="text-slate-500 block text-[9px] uppercase font-mono">Date of Birth</span>
                <strong className="text-slate-200 font-mono text-[10px]">{cardData.dob}</strong>
              </div>
              <div>
                <span className="text-slate-500 block text-[9px] uppercase font-mono">Valid Until</span>
                <strong className="text-emerald-400 font-mono text-[10px]">{cardData.validTill}</strong>
              </div>
              <div>
                <span className="text-slate-500 block text-[9px] uppercase font-mono">Library ID</span>
                <strong className="text-blue-300 font-mono text-[10px]">{cardData.libraryId}</strong>
              </div>
            </div>

            {/* FOOTER BARCODES & SIGNATURES */}
            <div className="border-t border-slate-800 pt-3 flex items-center justify-between">
              {/* QR & BARCODE GRAPHIC */}
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-white text-slate-950">
                  <QrCode className="h-8 w-8" />
                </div>
                <div>
                  {/* BARCODE GRAPHIC */}
                  <div className="h-5 w-24 bg-slate-800 border border-slate-700 rounded px-1 flex items-center justify-between space-x-0.5">
                    {[1, 2, 1, 3, 1, 2, 3, 1, 2, 1, 2, 1, 3, 2, 1].map((w, i) => (
                      <span
                        key={i}
                        className={`h-3 bg-[#0b193c] dark:bg-white inline-block ${
                          w === 3 ? "w-1" : w === 2 ? "w-[2px]" : "w-[1px]"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-[8px] font-mono text-slate-400 block pt-0.5">{cardData.barcodeValue}</span>
                </div>
              </div>

              {/* PRINCIPAL SIGNATURE */}
              <div className="text-right">
                <span className="font-serif italic text-blue-300 text-xs block font-bold">
                  K.R. Sharma
                </span>
                <span className="text-[9px] text-slate-400 block font-sans">Principal Signature</span>
              </div>
            </div>

          </div>
        ) : (
          /* BACK SIDE CONTENT */
          <div className="space-y-4 relative z-10 flex flex-col h-full justify-between text-xs">
            
            <div className="border-b border-slate-800 pb-2 flex items-center justify-between">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Building2 className="h-3.5 w-3.5 text-blue-400" /> College Identity Card Back
              </h4>
              <span className="text-[10px] text-slate-400 font-mono">Card ID: {cardData.studentId}</span>
            </div>

            {/* ADDRESS & EMERGENCY CONTACT */}
            <div className="space-y-2 bg-slate-900/80 p-3 rounded-2xl border border-slate-800 text-[11px]">
              <div>
                <span className="text-slate-400 font-bold block flex items-center gap-1">
                  <MapPin className="h-3 w-3 text-blue-400" /> Residential Address:
                </span>
                <p className="text-slate-300 pl-4">{cardData.address}</p>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-800/80">
                <div>
                  <span className="text-slate-400 font-bold block flex items-center gap-1">
                    <Phone className="h-3 w-3 text-emerald-400" /> Emergency Contact:
                  </span>
                  <p className="text-slate-200 font-mono text-[10px] pl-4">{cardData.emergencyContact.name}</p>
                  <p className="text-emerald-400 font-mono text-[10px] pl-4">{cardData.emergencyContact.phone}</p>
                </div>
                <div>
                  <span className="text-slate-400 font-bold block flex items-center gap-1">
                    <Phone className="h-3 w-3 text-amber-400" /> Parent Phone:
                  </span>
                  <p className="text-slate-200 font-mono text-[10px] pl-4">{cardData.parentContact.fatherName}</p>
                  <p className="text-amber-400 font-mono text-[10px] pl-4">{cardData.parentContact.fatherPhone}</p>
                </div>
              </div>
            </div>

            {/* CAMPUS SERVICES STATUS */}
            <div className="grid grid-cols-2 gap-2 text-[10px]">
              <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-2">
                <BedDouble className="h-4 w-4 text-purple-400" />
                <div>
                  <span className="text-slate-400 block font-medium">Hostel Status</span>
                  <strong className="text-slate-200">{cardData.hostelStatus}</strong>
                </div>
              </div>

              <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-2">
                <Bus className="h-4 w-4 text-teal-400" />
                <div>
                  <span className="text-slate-400 block font-medium">Transport Status</span>
                  <strong className="text-slate-200">{cardData.transportStatus}</strong>
                </div>
              </div>
            </div>

            {/* INSTRUCTIONS */}
            <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800 space-y-1">
              <span className="font-bold text-[10px] text-slate-300 uppercase block">Instructions:</span>
              <ul className="list-disc list-inside text-[9.5px] text-slate-400 space-y-0.5">
                {cardData.instructions.slice(0, 3).map((inst, i) => (
                  <li key={i}>{inst}</li>
                ))}
              </ul>
            </div>

            {/* COLLEGE CONTACT */}
            <div className="border-t border-slate-800 pt-2 flex items-center justify-between text-[9px] text-slate-400">
              <span>{cardData.collegeEmail}</span>
              <span>{cardData.collegePhone}</span>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
