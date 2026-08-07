import React, { useState } from "react";
import { StudentProfileData } from "../types";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Printer, RotateCw, ShieldCheck, QrCode, Phone, Mail, MapPin } from "lucide-react";
import { brand } from "@/config/branding";
import { downloadStudentIdCardPdf } from "../download-id-card";

interface DigitalIdCardModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  student: StudentProfileData;
}

export function DigitalIdCardModal({ open, onOpenChange, student }: DigitalIdCardModalProps) {
  const [side, setSide] = useState<"front" | "back">("front");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-2xl p-6 bg-slate-900 border-slate-800 text-white shadow-2xl">
        <DialogHeader className="text-left space-y-1">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-bold flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-blue-500" /> Digital Student ID Card
            </DialogTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSide(side === "front" ? "back" : "front")}
              className="text-xs bg-slate-800 border-slate-700 hover:bg-slate-700 text-slate-200 gap-1 rounded-xl h-8"
            >
              <RotateCw className="h-3.5 w-3.5" /> Flip Card ({side === "front" ? "Back" : "Front"})
            </Button>
          </div>
          <DialogDescription className="text-xs text-slate-400">
            Official NFC & QR enabled University Smart Card for campus access and exams.
          </DialogDescription>
        </DialogHeader>

        {/* CARD CANVAS CONTAINER */}
        <div className="my-4 perspective-1000">
          <div className={`relative w-full rounded-2xl overflow-hidden border-2 border-slate-700 shadow-2xl transition-all duration-500 bg-gradient-to-br from-slate-900 via-slate-850 to-blue-950 p-5 ${side === "front" ? "" : ""}`}>
            
            {/* Top Branding Banner */}
            <div className="flex items-center justify-between border-b border-slate-700/80 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-blue-600 grid place-items-center font-bold text-white text-sm shadow-md">
                  EP
                </div>
                <div>
                  <div className="text-sm font-black tracking-tight text-white">{brand.name}</div>
                  <div className="text-[9px] uppercase tracking-widest text-blue-400 font-semibold">Autonomous ERP Campus</div>
                </div>
              </div>
              <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 text-[10px]">
                AY 2024-25
              </Badge>
            </div>

            {side === "front" ? (
              /* FRONT SIDE */
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="relative h-24 w-24 rounded-xl overflow-hidden border-2 border-blue-500 shadow-lg bg-slate-800 flex-shrink-0">
                    <img src={student.avatarUrl} alt={student.name} className="h-full w-full object-cover" />
                  </div>
                  
                  <div className="space-y-1 text-left min-w-0">
                    <h3 className="text-base font-extrabold text-white truncate">{student.name}</h3>
                    <p className="text-xs text-blue-400 font-semibold truncate">{student.department}</p>
                    <div className="text-[11px] text-slate-300">
                      Adm No: <span className="font-mono font-bold text-white bg-slate-800 px-1.5 py-0.5 rounded">{student.rollNumber}</span>
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Degree: <span className="text-slate-200 font-medium">{student.degree} (Sem {student.currentSemester})</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase">Blood Group</span>
                    <span className="font-bold text-emerald-400">{student.personal.bloodGroup}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase">Valid Thru</span>
                    <span className="font-bold text-white">JUNE 2026</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase">DOB</span>
                    <span className="font-semibold text-slate-200">{student.personal.dob}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase">Status</span>
                    <span className="font-semibold text-emerald-400">ACTIVE STUDENT</span>
                  </div>
                </div>

                {/* Barcode & Hologram Simulation */}
                <div className="flex items-center justify-between pt-1">
                  <div className="font-mono text-[9px] tracking-widest text-slate-400 bg-black/40 px-2 py-1 rounded">
                    ||||| ||| ||||||| |||| || ||| ||||
                  </div>
                  <div className="h-6 w-6 rounded-full bg-gradient-to-tr from-amber-400 via-rose-400 to-blue-500 opacity-80 blur-[0.5px] border border-white/20 shadow-inner" title="Hologram Security Seal" />
                </div>
              </div>
            ) : (
              /* BACK SIDE */
              <div className="space-y-3 text-xs">
                <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-400 flex items-center gap-1">
                      <Phone className="h-3 w-3 text-blue-400" /> Student Phone:
                    </span>
                    <span className="font-semibold text-slate-200">{student.personal.phone}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-400 flex items-center gap-1">
                      <Mail className="h-3 w-3 text-blue-400" /> Student Email:
                    </span>
                    <span className="font-semibold text-slate-200 truncate max-w-[180px]">{student.personal.email}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-400 flex items-center gap-1">
                      <Phone className="h-3 w-3 text-rose-400" /> Emergency:
                    </span>
                    <span className="font-bold text-rose-400">{student.personal.emergencyContact.phone}</span>
                  </div>
                </div>

                <div className="text-[10px] text-slate-400 bg-slate-900/50 p-2.5 rounded-lg border border-slate-800">
                  <span className="font-semibold text-slate-300 block mb-0.5 flex items-center gap-1">
                    <MapPin className="h-3 w-3 text-blue-400" /> Permanent Address:
                  </span>
                  {student.address.permanent.street}, {student.address.permanent.city}, {student.address.permanent.state} - {student.address.permanent.pincode}
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-2">
                    <QrCode className="h-10 w-10 text-white p-1 bg-blue-600 rounded-lg" />
                    <div className="text-[9px] text-slate-400">
                      Scan to verify student authenticity on ERP portal.
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[9px] text-slate-500 uppercase">Authorized Signatory</div>
                    <div className="font-serif italic text-blue-300 font-bold text-xs">Registrar Academic</div>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>

        <DialogFooter className="flex-row gap-2 sm:justify-between">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="rounded-xl border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs"
          >
            Close
          </Button>
          <div className="flex gap-2">
            <Button
              onClick={() => window.print()}
              variant="outline"
              className="rounded-xl border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700 text-xs gap-1.5"
            >
              <Printer className="h-3.5 w-3.5 text-slate-400" /> Print
            </Button>
            <Button
              onClick={() => downloadStudentIdCardPdf(student)}
              className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs gap-1.5"
            >
              <Download className="h-3.5 w-3.5" /> Download Pass
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
