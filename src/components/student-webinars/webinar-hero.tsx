import React, { useState, useEffect } from "react";
import { Webinar } from "./types";
import { Radio, Loader2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface WebinarHeroProps {
  webinar: Webinar;
  onRegisterToggle: (webinarId: string) => void;
  onSelectWebinar: (webinar: Webinar) => void;
  newlyRegisteredIds?: string[];
  registeringId?: string | null;
}

export function WebinarHero({
  webinar,
  onRegisterToggle,
  onSelectWebinar,
  newlyRegisteredIds = [],
  registeringId = null,
}: WebinarHeroProps) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 2, mins: 35, secs: 40 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.secs > 0) return { ...prev, secs: prev.secs - 1 };
        if (prev.mins > 0) return { ...prev, mins: prev.mins - 1, secs: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, mins: 59, secs: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="rounded-2xl bg-[#091024] text-white p-6 shadow-xl border border-slate-800 relative overflow-hidden flex flex-col justify-between space-y-6">
      {/* Top Label */}
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
          Featured Webinar
        </h3>
        <span className="bg-red-600 text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 animate-pulse">
          <Radio className="size-3" /> LIVE
        </span>
      </div>

      {/* Main Content Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        {/* Left 2 Cols: Details */}
        <div className="md:col-span-2 space-y-4">
          <h2
            onClick={() => onSelectWebinar(webinar)}
            className="text-xl sm:text-2xl font-black text-white hover:text-indigo-300 transition-colors cursor-pointer leading-tight"
          >
            {webinar.title}
          </h2>

          {/* Speaker */}
          <div className="flex items-center gap-3">
            <img
              src={webinar.speaker.avatar}
              alt={webinar.speaker.name}
              className="size-10 rounded-full object-cover ring-2 ring-indigo-500/40"
            />
            <div>
              <h4 className="text-xs font-bold text-white">{webinar.speaker.name}</h4>
              <p className="text-[11px] text-slate-400">{webinar.speaker.role}</p>
            </div>
          </div>

          {/* Date & Time Bar */}
          <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold text-slate-300 pt-2">
            <span className="px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700">
              AUG 08, 2026
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700">
              04:00 PM - 05:30 PM
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700">
              1h 30m
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700">
              320 Seats Left
            </span>
          </div>
        </div>

        {/* Right 1 Col: Countdown & Register Button */}
        <div className="flex flex-col items-center md:items-end justify-center space-y-4">
          {/* Countdown Boxes */}
          <div className="grid grid-cols-4 gap-2 text-center">
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-2 min-w-[50px]">
              <span className="text-lg font-black text-white block">
                {String(timeLeft.days).padStart(2, "0")}
              </span>
              <span className="text-[9px] text-slate-400 uppercase font-medium">Days</span>
            </div>
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-2 min-w-[50px]">
              <span className="text-lg font-black text-white block">
                {String(timeLeft.hours).padStart(2, "0")}
              </span>
              <span className="text-[9px] text-slate-400 uppercase font-medium">Hours</span>
            </div>
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-2 min-w-[50px]">
              <span className="text-lg font-black text-white block">
                {String(timeLeft.mins).padStart(2, "0")}
              </span>
              <span className="text-[9px] text-slate-400 uppercase font-medium">Mins</span>
            </div>
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-2 min-w-[50px]">
              <span className="text-lg font-black text-white block">
                {String(timeLeft.secs).padStart(2, "0")}
              </span>
              <span className="text-[9px] text-slate-400 uppercase font-medium">Secs</span>
            </div>
          </div>

          {/* Button */}
          <Button
            disabled={webinar.isRegistered || registeringId === webinar.id}
            onClick={() => onRegisterToggle(webinar.id)}
            className={`w-full sm:w-48 h-10 rounded-xl font-bold text-xs shadow-md transition-all ${
              webinar.isRegistered
                ? "bg-emerald-600 text-white opacity-95 cursor-default pointer-events-none"
                : "bg-indigo-600 hover:bg-indigo-500 text-white"
            }`}
          >
            {registeringId === webinar.id ? (
              <>
                <Loader2 className="size-3.5 mr-1.5 animate-spin" />
                Loading...
              </>
            ) : webinar.isRegistered ? (
              newlyRegisteredIds.includes(webinar.id) ? (
                <>
                  <Check className="size-3.5 mr-1" /> Registered ✓
                </>
              ) : (
                <>
                  <Check className="size-3.5 mr-1" /> Already Registered
                </>
              )
            ) : (
              "Register Now"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
