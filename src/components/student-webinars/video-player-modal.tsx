import React, { useState } from "react";
import { RecordingItem } from "./types";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Pause, Volume2, Maximize2, Clock, Eye, FileText, Download, X, ListVideo } from "lucide-react";
import { toast } from "sonner";

interface VideoPlayerModalProps {
  recording: RecordingItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export function VideoPlayerModal({ recording, isOpen, onClose }: VideoPlayerModalProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeTab, setActiveTab] = useState<"chapters" | "transcript">("chapters");

  if (!recording) return null;

  const chapters = [
    { title: "00:00 - Introduction & Prerequisites", duration: "10 mins" },
    { title: "10:15 - Architecture Deep Dive & Key Models", duration: "35 mins" },
    { title: "45:30 - Live Code Walkthrough & Implementation", duration: "45 mins" },
    { title: "01:30:00 - Q&A & Audience Discussion", duration: "30 mins" },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] p-0 rounded-[24px] border border-slate-800 bg-slate-950 text-white shadow-2xl overflow-hidden flex flex-col">
        {/* Top Header */}
        <div className="flex items-center justify-between p-4 bg-slate-900 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <Badge className="bg-indigo-600 text-white text-xs">{recording.category}</Badge>
            <h2 className="text-sm font-bold text-white truncate max-w-lg">
              {recording.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Video Player & Sidebar */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 overflow-hidden">
          {/* Player Main Area */}
          <div className="lg:col-span-2 relative bg-black flex flex-col justify-between p-6">
            <img
              src={recording.thumbnail}
              alt={recording.title}
              className="absolute inset-0 h-full w-full object-cover opacity-50"
            />
            <div className="absolute inset-0 bg-black/60 backdrop-blur-xs" />

            {/* Top info */}
            <div className="relative z-10 flex items-center justify-between">
              <span className="text-xs text-slate-300 flex items-center gap-1.5 bg-black/60 px-3 py-1 rounded-full backdrop-blur-md">
                <Clock className="size-3.5 text-indigo-400" /> {recording.duration}
              </span>
              <span className="text-xs text-slate-300 flex items-center gap-1.5 bg-black/60 px-3 py-1 rounded-full backdrop-blur-md">
                <Eye className="size-3.5 text-indigo-400" /> {recording.views.toLocaleString()} views
              </span>
            </div>

            {/* Center Play Button */}
            <div className="relative z-10 my-auto text-center space-y-4">
              <button
                onClick={() => {
                  setIsPlaying(!isPlaying);
                  toast.info(isPlaying ? "Video paused" : "Playing video recording...");
                }}
                className="size-16 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center mx-auto shadow-2xl hover:scale-110 transition-all"
              >
                {isPlaying ? <Pause className="size-7 fill-current" /> : <Play className="size-7 fill-current ml-1" />}
              </button>
              <p className="text-xs text-slate-300 font-semibold">
                {isPlaying ? "Playing recording (HD 1080p)" : "Click Play to start watching"}
              </p>
            </div>

            {/* Bottom Controls */}
            <div className="relative z-10 flex items-center justify-between bg-slate-900/90 backdrop-blur-md p-3 rounded-2xl border border-slate-800">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="text-white hover:text-indigo-400"
                >
                  {isPlaying ? <Pause className="size-4" /> : <Play className="size-4" />}
                </button>
                <Volume2 className="size-4 text-slate-400" />
                <span className="text-xs text-slate-300">00:00 / {recording.duration}</span>
              </div>
              <Maximize2 className="size-4 text-slate-400 hover:text-white cursor-pointer" />
            </div>
          </div>

          {/* Chapters & Transcript Sidebar */}
          <div className="bg-slate-900 border-l border-slate-800 flex flex-col h-full">
            <div className="grid grid-cols-2 p-2 bg-slate-950 border-b border-slate-800 gap-1 text-xs">
              <button
                onClick={() => setActiveTab("chapters")}
                className={`py-1.5 rounded-lg font-bold flex items-center justify-center gap-1.5 ${
                  activeTab === "chapters" ? "bg-slate-800 text-white" : "text-slate-400 hover:text-white"
                }`}
              >
                <ListVideo className="size-3.5" /> Chapters
              </button>
              <button
                onClick={() => setActiveTab("transcript")}
                className={`py-1.5 rounded-lg font-bold flex items-center justify-center gap-1.5 ${
                  activeTab === "transcript" ? "bg-slate-800 text-white" : "text-slate-400 hover:text-white"
                }`}
              >
                <FileText className="size-3.5" /> Notes & Slides
              </button>
            </div>

            <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs">
              {activeTab === "chapters" ? (
                chapters.map((ch, idx) => (
                  <div
                    key={idx}
                    onClick={() => toast.info(`Jumped to ${ch.title}`)}
                    className="p-3 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/50 cursor-pointer transition-colors space-y-1"
                  >
                    <span className="font-bold text-white block">{ch.title}</span>
                    <span className="text-[10px] text-indigo-400">{ch.duration}</span>
                  </div>
                ))
              ) : (
                <div className="space-y-4">
                  <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/50 space-y-2">
                    <span className="font-bold text-white block">Download Presentation Deck</span>
                    <p className="text-slate-400 text-[11px]">
                      Official PDF slides presented during this session.
                    </p>
                    <Button
                      size="sm"
                      onClick={() => toast.success("Downloading presentation slides PDF...")}
                      className="w-full h-8 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs"
                    >
                      <Download className="size-3.5 mr-1.5" /> Download Slides (PDF)
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
