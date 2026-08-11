import React, { useState } from "react";
import { LiveClassItem } from "./types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Video, Clock, User, Download, ExternalLink, Play, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

interface OnlineClassesProps {
  classes: LiveClassItem[];
  searchQuery: string;
}

export function OnlineClasses({ classes, searchQuery }: OnlineClassesProps) {
  const [activeTab, setActiveTab] = useState<"Today" | "Upcoming" | "Recordings">("Today");
  const [watchingRecording, setWatchingRecording] = useState<LiveClassItem | null>(null);

  const filteredClasses = classes.filter((c) => {
    const matchesSearch =
      c.courseName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.courseCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.faculty.toLowerCase().includes(searchQuery.toLowerCase());

    if (activeTab === "Today") return matchesSearch && (c.status === "Live Now" || c.status === "Upcoming");
    if (activeTab === "Upcoming") return matchesSearch && c.status === "Upcoming";
    return matchesSearch && c.status === "Completed";
  });

  const handleDownloadNotes = (courseCode: string) => {
    toast.success(`Lecture notes PDF for ${courseCode} downloaded!`);
  };

  return (
    <div className="space-y-4">
      {/* TOOLBAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs">
        <div className="flex items-center gap-2">
          <Video className="h-5 w-5 text-emerald-600 animate-pulse" />
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Virtual Classroom & High-Definition Lecture Recordings
            </h3>
            <p className="text-[11px] text-slate-500 font-medium">
              Join online lectures via EduSuite Virtual Rooms, Zoom & Google Meet.
            </p>
          </div>
        </div>

        {/* TABS */}
        <div className="flex items-center gap-1">
          {(["Today", "Upcoming", "Recordings"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all ${
                activeTab === tab
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
              }`}
            >
              {tab === "Today" ? "Today's Live" : tab === "Upcoming" ? "Upcoming Schedule" : "Recorded Sessions"}
            </button>
          ))}
        </div>
      </div>

      {/* CLASSES LIST */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredClasses.map((cls) => {
          const isLiveNow = cls.status === "Live Now";
          const isCompleted = cls.status === "Completed";

          return (
            <div
              key={cls.id}
              className={`p-5 rounded-2xl border transition-all flex flex-col justify-between space-y-4 group ${
                isLiveNow
                  ? "border-emerald-500/40 bg-emerald-50/40 dark:bg-emerald-950/30 ring-1 ring-emerald-500/30 shadow-md"
                  : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-md"
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="font-mono font-bold text-emerald-600 border-emerald-200 text-[11px]">
                    {cls.courseCode}
                  </Badge>

                  <Badge
                    className={`text-[9px] px-2 py-0.5 font-mono ${
                      isLiveNow
                        ? "bg-emerald-600 text-white animate-pulse"
                        : isCompleted
                        ? "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
                        : "bg-blue-500/10 text-blue-600 border-blue-500/20"
                    }`}
                  >
                    {isLiveNow ? "● LIVE NOW" : cls.status}
                  </Badge>
                </div>

                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white group-hover:text-emerald-600 transition-colors leading-snug">
                  {cls.courseName}
                </h3>

                <p className="text-xs text-slate-500 font-medium flex items-center gap-1">
                  <User className="h-3.5 w-3.5 text-slate-400" /> {cls.faculty}
                </p>
              </div>

              <div className="space-y-2 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-1 font-mono text-[11px]">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Meeting Time:</span>
                    <span className="font-bold text-slate-900 dark:text-white">{cls.meetingTime}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Platform:</span>
                    <span className="text-emerald-600 font-bold">{cls.platform}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
                  <span>Duration: {cls.duration}</span>
                  <span className="text-emerald-600 font-bold flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" /> Status: {cls.attendanceStatus}
                  </span>
                </div>
              </div>

              {/* ACTION BUTTONS */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 w-full min-w-0 overflow-hidden">
                {isLiveNow || cls.status === "Upcoming" ? (
                  <a
                    href={cls.joinUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="col-span-2 w-full min-w-0"
                  >
                    <Button
                      size="sm"
                      className="w-full h-8 text-xs rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold gap-1.5 shadow-sm min-w-0 overflow-hidden"
                    >
                      <Video className="h-3.5 w-3.5 shrink-0" />
                      <span className="truncate">Join Live Classroom Now</span>
                    </Button>
                  </a>
                ) : (
                  <>
                    <Button
                      onClick={() => setWatchingRecording(cls)}
                      size="sm"
                      className="h-8 text-xs rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold gap-1 w-full min-w-0 overflow-hidden"
                    >
                      <Play className="h-3.5 w-3.5 fill-current shrink-0" />
                      <span className="truncate">Watch Recording</span>
                    </Button>

                    <Button
                      onClick={() => handleDownloadNotes(cls.courseCode)}
                      size="sm"
                      variant="outline"
                      className="h-8 text-xs rounded-xl border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 gap-1 w-full min-w-0 overflow-hidden"
                    >
                      <Download className="h-3.5 w-3.5 text-blue-600 shrink-0" />
                      <span className="truncate">Notes</span>
                    </Button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* RECORDING PLAYER MODAL */}
      {watchingRecording && (
        <Dialog open={!!watchingRecording} onOpenChange={() => setWatchingRecording(null)}>
          <DialogContent className="max-w-2xl rounded-2xl p-6 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
            <DialogHeader className="border-b pb-3 border-slate-100 dark:border-slate-800 text-left">
              <Badge variant="outline" className="w-fit mb-1 font-mono font-bold text-purple-600 border-purple-200">
                {watchingRecording.courseCode} • High-Definition Video Recording
              </Badge>
              <DialogTitle className="text-base font-bold">
                {watchingRecording.courseName}
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500">
                Recorded session by {watchingRecording.faculty} ({watchingRecording.duration})
              </DialogDescription>
            </DialogHeader>

            <div className="my-3 aspect-video rounded-2xl bg-slate-950 flex flex-col items-center justify-center text-white p-6 relative overflow-hidden border border-slate-800 shadow-xl">
              <Play className="h-16 w-16 text-purple-500 animate-bounce cursor-pointer" />
              <p className="text-xs font-mono mt-3 text-slate-300">HTML5 HD Video Stream Initialized</p>
              <span className="text-[10px] text-slate-500">1080p • 60 FPS • Dual-Channel Audio</span>
            </div>

            <DialogFooter>
              <Button onClick={() => setWatchingRecording(null)} className="rounded-xl text-xs w-full">
                Close Video Player
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
