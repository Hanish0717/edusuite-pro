import React from "react";
import { StudentProfileData } from "../types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Home, ShieldCheck, Phone, Utensils, QrCode, Ticket } from "lucide-react";
import { toast } from "sonner";

interface HostelTabProps {
  student: StudentProfileData;
}

export function HostelTab({ student }: HostelTabProps) {
  const h = student.hostel;

  const handleOutingPass = () => {
    toast.success("Outing Pass requested! Chief Warden notification sent.");
  };

  return (
    <div className="space-y-6">
      
      {/* HOSTEL ROOM METRICS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-3">
          <div className="flex items-center gap-2">
            <Home className="h-5 w-5 text-blue-600" />
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">Hostel Allotment</h4>
          </div>
          <div className="space-y-1 text-xs">
            <div className="font-bold text-base text-slate-900 dark:text-white">{h.block}</div>
            <p className="text-slate-500 font-semibold">{h.roomNo} &middot; {h.floor}</p>
            <Badge className="bg-blue-500/10 text-blue-600 text-[10px]">{h.roomType}</Badge>
          </div>
        </div>

        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-3">
          <div className="flex items-center gap-2">
            <Utensils className="h-5 w-5 text-amber-600" />
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">Dining & Mess Subscription</h4>
          </div>
          <div className="space-y-1 text-xs">
            <div className="font-bold text-sm text-slate-900 dark:text-white">{h.messName}</div>
            <p className="text-slate-500">{h.messPlan}</p>
            <Badge className="bg-emerald-500/10 text-emerald-600 text-[10px]">Mess Active</Badge>
          </div>
        </div>

        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-emerald-600" />
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">Chief Warden Contact</h4>
          </div>
          <div className="space-y-1 text-xs">
            <div className="font-bold text-sm text-slate-900 dark:text-white">{h.wardenName}</div>
            <p className="font-mono text-blue-600 font-bold">{h.wardenPhone}</p>
            <p className="text-[10px] text-slate-400">Office: Warden Administration Block B</p>
          </div>
        </div>

      </div>

      {/* OUTING / LEAVE PASSES TABLE */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Ticket className="h-4 w-4 text-blue-600" /> Hostel Outing & Gate Passes
            </h4>
            <p className="text-xs text-slate-500">Security gate scan history and digital pass approvals</p>
          </div>
          <Button onClick={handleOutingPass} size="sm" className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs gap-1.5">
            <QrCode className="h-3.5 w-3.5" /> Apply Outing Pass
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 font-semibold bg-slate-50 dark:bg-slate-800/50">
                <th className="p-3 rounded-l-xl">Pass ID</th>
                <th className="p-3">Destination</th>
                <th className="p-3">Out Time</th>
                <th className="p-3">Expected Return</th>
                <th className="p-3 rounded-r-xl">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {h.outingPasses.map((pass) => (
                <tr key={pass.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                  <td className="p-3 font-mono font-bold text-blue-600">{pass.id}</td>
                  <td className="p-3 font-semibold text-slate-900 dark:text-white">{pass.destination}</td>
                  <td className="p-3 font-mono text-slate-600 dark:text-slate-400">{pass.outTime}</td>
                  <td className="p-3 font-mono text-slate-600 dark:text-slate-400">{pass.expectedInTime}</td>
                  <td className="p-3">
                    <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[10px]">{pass.status}</Badge>
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
