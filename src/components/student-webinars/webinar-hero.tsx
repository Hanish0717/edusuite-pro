import React, { useState, useEffect } from "react";
import { Webinar } from "./types";
import { Radio, Calendar, Clock, Users, Check, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface WebinarHeroProps {
  webinar: Webinar;
  onRegisterToggle: (webinarId: string) => void;
  onSelectWebinar: (webinar: Webinar) => void;
}

export function WebinarHero({ webinar, onRegisterToggle, onSelectWebinar }: WebinarHeroProps) {
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
    <div className="rounded-2xl bg-[#091024] text-white p-5 sm:p-6 shadow-xl border border-slate-800 relative overflow-hidden flex flex-col justify-between space-y-5">
      {/* Top Label */}
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-full border border-indigo-500/20">
          Featured Webinar
        </span>
        <span className="bg-red-600 text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 animate-pulse">
          <Radio className="size-3" /> LIVE
        </span>
      </div>

      {/* Title & Description */}
      <div className="space-y-2">
        <h2
          onClick={() => onSelectWebinar(webinar)}
          className="text-lg sm:text-xl font-extrabold text-white hover:text-indigo-300 transition-colors cursor-pointer leading-snug line-clamp-2"
        >
          {webinar.title}
        </h2>
        {webinar.subtitle && (
          <p className="text-xs text-slate-400 line-clamp-1 font-medium">{webinar.subtitle}</p>
        )}
      </div>

      {/* Speaker Info */}
      <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800/80">
        <img
          src={webinar.speaker.avatar}
          alt={webinar.speaker.name}
          className="size-9 rounded-full object-cover ring-2 ring-indigo-500/40 shrink-0"
        />
        <div className="min-w-0">
          <h4 className="text-xs font-bold text-white truncate">{webinar.speaker.name}</h4>
          <p className="text-[11px] text-slate-400 truncate">{webinar.speaker.role}</p>
        </div>
      </div>

      {/* Countdown Timer Row */}
      <div className="space-y-1.5">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
          Event Starts In:
        </span>
        <div className="grid grid-cols-4 gap-2 text-center">
          <div className="bg-slate-900/90 border border-slate-800/90 rounded-xl p-2">
            <span className="text-base sm:text-lg font-black text-white block leading-none">
              {String(timeLeft.days).padStart(2, "0")}
            </span>
            <span className="text-[9px] text-slate-400 uppercase font-semibold mt-1 block">Days</span>
          </div>
          <div className="bg-slate-900/90 border border-slate-800/90 rounded-xl p-2">
            <span className="text-base sm:text-lg font-black text-white block leading-none">
              {String(timeLeft.hours).padStart(2, "0")}
            </span>
            <span className="text-[9px] text-slate-400 uppercase font-semibold mt-1 block">Hours</span>
          </div>
          <div className="bg-slate-900/90 border border-slate-800/90 rounded-xl p-2">
            <span className="text-base sm:text-lg font-black text-white block leading-none">
              {String(timeLeft.mins).padStart(2, "0")}
            </span>
            <span className="text-[9px] text-slate-400 uppercase font-semibold mt-1 block">Mins</span>
          </div>
          <div className="bg-slate-900/90 border border-slate-800/90 rounded-xl p-2">
            <span className="text-base sm:text-lg font-black text-white block leading-none">
              {String(timeLeft.secs).padStart(2, "0")}
            </span>
            <span className="text-[9px] text-slate-400 uppercase font-semibold mt-1 block">Secs</span>
          </div>
        </div>
      </div>

      {/* Meta Pills */}
      <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-semibold text-slate-300">
        <span className="px-2 py-0.5 rounded-md bg-slate-800/80 border border-slate-700/80 flex items-center gap-1">
          <Calendar className="size-3 text-indigo-400" /> AUG 08, 2026
        </span>
        <span className="px-2 py-0.5 rounded-md bg-slate-800/80 border border-slate-700/80 flex items-center gap-1">
          <Clock className="size-3 text-indigo-400" /> 04:00 - 05:30 PM
        </span>
        <span className="px-2 py-0.5 rounded-md bg-slate-800/80 border border-slate-700/80 flex items-center gap-1">
          <Users className="size-3 text-emerald-400" /> 320 Seats Left
        </span>
      </div>

      {/* Bottom Action Row */}
      <div className="pt-2 flex items-center gap-3">
        <Button
          onClick={() => onRegisterToggle(webinar.id)}
          className={`flex-1 h-10 rounded-xl font-bold text-xs shadow-md transition-all cursor-pointer ${
            webinar.isRegistered
              ? "bg-emerald-600 hover:bg-emerald-500 text-white"
              : "bg-indigo-600 hover:bg-indigo-500 text-white"
          }`}
        >
          {webinar.isRegistered ? (
            <>
              <Check className="size-4 mr-1.5" /> Registered
            </>
          ) : (
            "Register Now"
          )}
        </Button>
        <Button
          variant="outline"
          onClick={() => onSelectWebinar(webinar)}
          className="h-10 px-4 rounded-xl border-slate-700 text-slate-200 hover:bg-slate-800 text-xs font-semibold gap-1 cursor-pointer"
        >
          Details <ArrowRight className="size-3.5" />
        </Button>
      </div>
    </div>
  );
}
