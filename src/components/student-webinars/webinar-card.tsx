import React from "react";
import { Webinar } from "./types";
import { Bookmark, BookmarkCheck, Check, Radio, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface WebinarCardProps {
  webinar: Webinar;
  onRegisterToggle: (webinarId: string) => void;
  onSelectWebinar: (webinar: Webinar) => void;
  newlyRegisteredIds?: string[];
  registeringId?: string | null;
  onBookmarkToggle?: (webinarId: string) => void;
}

export function WebinarCard({
  webinar,
  onRegisterToggle,
  onSelectWebinar,
  newlyRegisteredIds = [],
  registeringId = null,
  onBookmarkToggle,
}: WebinarCardProps) {
  return (
    <div className="flex flex-col rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xs hover:shadow-md transition-all duration-200 overflow-hidden">
      {/* Top Banner Image with Floating Badges */}
      <div className="relative h-44 w-full bg-slate-900 overflow-hidden cursor-pointer" onClick={() => onSelectWebinar(webinar)}>
        <img
          src={webinar.bannerImage}
          alt={webinar.title}
          className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/20" />

        {/* Top Left Floating Date Badge */}
        <div className="absolute top-3 left-3 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-xl p-2 text-center shadow-md min-w-[46px] border border-slate-100 dark:border-slate-800">
          <span className="text-[9px] font-extrabold uppercase text-slate-500 dark:text-slate-400 block leading-tight">
            {webinar.dateBadge.month}
          </span>
          <span className="text-base font-black text-slate-900 dark:text-white leading-none">
            {webinar.dateBadge.day}
          </span>
        </div>

        {/* Top Right Floating Status Badge */}
        <div className="absolute top-3 right-3">
          {webinar.status === "live" ? (
            <span className="bg-red-600 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-md flex items-center gap-1 animate-pulse">
              <Radio className="size-3" /> LIVE
            </span>
          ) : (
            <span className="bg-white/95 dark:bg-slate-900/95 text-slate-800 dark:text-slate-200 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-xs border border-slate-200/60 dark:border-slate-800">
              UPCOMING
            </span>
          )}
        </div>
      </div>

      {/* Card Content Body */}
      <div className="flex flex-1 flex-col p-4 space-y-3">
        {/* Time & Duration */}
        <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
          {webinar.displayTime} ({webinar.duration})
        </p>

        {/* Webinar Title */}
        <h3
          onClick={() => onSelectWebinar(webinar)}
          className="text-sm font-extrabold text-slate-900 dark:text-white line-clamp-2 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer leading-snug"
        >
          {webinar.title}
        </h3>

        {/* Speaker Info */}
        <div className="flex items-center gap-2.5 py-1">
          <img
            src={webinar.speaker.avatar}
            alt={webinar.speaker.name}
            className="size-8 rounded-full object-cover ring-1 ring-slate-200 dark:ring-slate-700"
          />
          <div className="min-w-0">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
              {webinar.speaker.name}
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
              {webinar.speaker.role}
            </p>
          </div>
        </div>

        {/* Seats & Registered Meta */}
        <p className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">
          {webinar.registeredCount} Registered <span className="mx-1">•</span> {webinar.seatsLeft} Seats Left
        </p>

        {/* Action Button Row */}
        <div className="pt-1 mt-auto flex items-center gap-2">
          <Button
            disabled={webinar.isRegistered || registeringId === webinar.id}
            onClick={() => onRegisterToggle(webinar.id)}
            className={`flex-1 h-9 rounded-xl text-xs font-bold transition-all ${
              webinar.isRegistered
                ? "bg-emerald-600 text-white opacity-95 cursor-default pointer-events-none"
                : "bg-[#091024] hover:bg-[#152248] text-white shadow-xs"
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

          <button
            onClick={() => onBookmarkToggle ? onBookmarkToggle(webinar.id) : onRegisterToggle(webinar.id)}
            className="size-9 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shrink-0"
            title="Bookmark"
          >
            {webinar.isBookmarked ? (
              <BookmarkCheck className="size-4 text-indigo-600 fill-indigo-600" />
            ) : (
              <Bookmark className="size-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
