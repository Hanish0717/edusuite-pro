import React from "react";
import { ReservedBookItem } from "./types";
import { BookmarkCheck, Clock, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface ReservationTabProps {
  reservations: ReservedBookItem[];
  onCancelReservation: (resId: string) => void;
}

export function ReservationTab({ reservations, onCancelReservation }: ReservationTabProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
            <BookmarkCheck className="h-5 w-5 text-blue-600" /> Holds & Book Reservations ({reservations.length})
          </h3>
          <p className="text-xs text-slate-500">
            Active queue status for out-of-stock or currently checked out titles.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reservations.map((res) => (
          <div
            key={res.id}
            className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs space-y-3 flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Badge
                  className={`text-[9px] font-mono ${
                    res.status === "Ready for Pickup"
                      ? "bg-emerald-500 text-white"
                      : res.status === "Expired"
                      ? "bg-rose-500 text-white"
                      : "bg-blue-600 text-white"
                  }`}
                >
                  {res.status}
                </Badge>
                <span className="text-[11px] font-mono font-bold text-blue-600 dark:text-blue-400">
                  Queue Position #{res.queuePosition}
                </span>
              </div>

              <h4 className="font-bold text-sm text-slate-900 dark:text-white">{res.title}</h4>
              <p className="text-xs text-slate-500">{res.author}</p>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-2 text-[11px] font-mono">
                <div>
                  <span className="text-slate-400 text-[10px] block">Reserved On</span>
                  <span className="text-slate-800 dark:text-slate-200 font-bold">{res.reservedDate}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">Est. Availability</span>
                  <span className="text-emerald-600 font-bold">{res.availabilityDate}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              {res.status === "Ready for Pickup" ? (
                <Button
                  onClick={() => {
                    toast.success(`Visit Counter 2 to pick up "${res.title}". Code: ${res.id}`);
                  }}
                  className="flex-1 rounded-xl text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-9 gap-1.5"
                >
                  <CheckCircle2 className="h-4 w-4" /> Ready For Pickup
                </Button>
              ) : (
                <Button
                  onClick={() => {
                    onCancelReservation(res.id);
                    toast.info(`Cancelled reservation for "${res.title}".`);
                  }}
                  variant="outline"
                  className="flex-1 rounded-xl text-xs font-semibold h-9 text-rose-600 border-rose-200 hover:bg-rose-50 dark:hover:bg-rose-950/30 gap-1.5"
                >
                  <XCircle className="h-4 w-4" /> Cancel Hold Queue
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
