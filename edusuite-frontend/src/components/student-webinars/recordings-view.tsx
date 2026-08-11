import React from "react";
import { RecordingItem } from "./types";
import { PlayCircle, Eye, Clock, Bookmark, BookmarkCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

interface RecordingsViewProps {
  recordings: RecordingItem[];
  onWatch: (rec: RecordingItem) => void;
  onToggleBookmark: (recId: string) => void;
}

export function RecordingsView({ recordings, onWatch, onToggleBookmark }: RecordingsViewProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <PlayCircle className="size-5 text-indigo-600" /> Recent Recordings ({recordings.length})
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {recordings.map((rec) => (
          <div
            key={rec.id}
            className="flex flex-col rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 overflow-hidden shadow-2xs space-y-3"
          >
            <div className="relative h-40 bg-slate-900 cursor-pointer" onClick={() => onWatch(rec)}>
              <img src={rec.thumbnail} alt={rec.title} className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <PlayCircle className="size-10 text-white shadow-lg" />
              </div>
              <span className="absolute bottom-2 right-2 bg-black/80 text-white text-[10px] px-2 py-0.5 rounded font-bold">
                {rec.duration}
              </span>
            </div>

            <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white line-clamp-2">
                  {rec.title}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  by {rec.speaker.name}
                </p>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-800">
                <span>{rec.views} views</span>
                <span>{rec.recordedDate}</span>
              </div>

              <Button
                onClick={() => onWatch(rec)}
                className="w-full h-9 text-xs font-bold rounded-xl bg-[#091024] hover:bg-[#152248] text-white mt-1"
              >
                Watch Recording
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
