import React, { useState, useEffect } from "react";
import { Webinar } from "./types";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Radio,
  Users,
  Send,
  Heart,
  ThumbsUp,
  Flame,
  MessageSquare,
  BarChart2,
  X,
  Volume2,
  Maximize2,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";

interface LiveSessionModalProps {
  webinar: Webinar | null;
  isOpen: boolean;
  onClose: () => void;
}

export function LiveSessionModal({ webinar, isOpen, onClose }: LiveSessionModalProps) {
  const [chatMessage, setChatMessage] = useState("");
  const [chatLog, setChatLog] = useState([
    { id: "1", user: "Aarav Sharma", text: "Great insights on RAG pipelines!", time: "16:04" },
    { id: "2", user: "Sneha Patel", text: "Can we use Pinecone for real-time vector search here?", time: "16:05" },
    { id: "3", user: "Vikram R.", text: "The slide explanation on LoRA adapters is so clear!", time: "16:06" },
  ]);
  const [reactions, setReactions] = useState<{ id: number; emoji: string }[]>([]);
  const [pollVoted, setPollVoted] = useState<string | null>(null);

  // Simulate new live chat messages arriving
  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      const sampleMsgs = [
        "What is the recommended batch size for fine-tuning?",
        "Will the recording be available in the LMS tab?",
        "Awesome demo by the speaker!",
        "Thanks EduSuite for arranging this FAANG talk!",
      ];
      const randomMsg = sampleMsgs[Math.floor(Math.random() * sampleMsgs.length)];
      const names = ["Divya", "Karan", "Meera", "Aditya"];
      const randomName = names[Math.floor(Math.random() * names.length)];

      setChatLog((prev) => [
        ...prev.slice(-15),
        { id: String(Date.now()), user: randomName || "Student", text: randomMsg || "Interesting!", time: "16:08" },
      ]);
    }, 4000);

    return () => clearInterval(interval);
  }, [isOpen]);

  if (!webinar) return null;

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;
    setChatLog((prev) => [
      ...prev,
      { id: String(Date.now()), user: "You (Student)", text: chatMessage.trim(), time: "16:08" },
    ]);
    setChatMessage("");
  };

  const handleReaction = (emoji: string) => {
    setReactions((prev) => [...prev, { id: Date.now(), emoji }]);
    toast.success(`Sent ${emoji} reaction to speaker!`);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[92vh] h-[85vh] p-0 rounded-[24px] border border-slate-800 bg-slate-950 text-white shadow-2xl overflow-hidden flex flex-col">
        {/* Top Live Bar */}
        <div className="flex items-center justify-between p-4 bg-slate-900 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <Badge className="bg-red-600 text-white font-bold text-xs px-3 py-1 animate-pulse">
              <Radio className="size-3.5 mr-1" /> LIVE STREAMING NOW
            </Badge>
            <h2 className="text-sm font-bold text-white truncate max-w-md">
              {webinar.title}
            </h2>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5 text-emerald-400 font-semibold bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
              <Users className="size-3.5" /> 468 Students Online
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="size-5" />
            </button>
          </div>
        </div>

        {/* Content Layout: Left Video Stream (2/3), Right Chat & Polls (1/3) */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 overflow-hidden">
          {/* Video Stream Container */}
          <div className="lg:col-span-2 relative bg-slate-900 flex flex-col justify-between p-6">
            {/* Simulated Live Video Graphic */}
            <div className="absolute inset-0 bg-cover bg-center opacity-40" style={{ backgroundImage: `url(${webinar.bannerImage})` }} />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

            {/* Speaker Video Overlay */}
            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center gap-3 bg-slate-900/90 backdrop-blur-md border border-slate-700/60 p-2.5 rounded-2xl">
                <img
                  src={webinar.speaker.avatar}
                  alt={webinar.speaker.name}
                  className="size-10 rounded-full object-cover ring-2 ring-indigo-500"
                />
                <div>
                  <span className="text-xs font-bold text-white block">{webinar.speaker.name}</span>
                  <span className="text-[10px] text-slate-300">{webinar.speaker.organization}</span>
                </div>
              </div>

              <Badge className="bg-indigo-600/80 text-white backdrop-blur-md text-xs px-3 py-1">
                1080p HD 60fps
              </Badge>
            </div>

            {/* Center Live Stream Overlay Text */}
            <div className="relative z-10 my-auto text-center space-y-3 p-6 bg-slate-950/60 backdrop-blur-md rounded-2xl border border-white/10 max-w-lg mx-auto">
              <div className="size-12 rounded-full bg-red-600/20 text-red-500 flex items-center justify-center mx-auto animate-pulse">
                <Radio className="size-6" />
              </div>
              <h3 className="text-lg font-bold text-white">{webinar.title}</h3>
              <p className="text-xs text-slate-300">
                Speaker is presenting slide deck: "Scalable Architecture Patterns 2026"
              </p>
            </div>

            {/* Bottom Stream Controls & Reactions */}
            <div className="relative z-10 flex items-center justify-between bg-slate-900/90 backdrop-blur-md border border-slate-800 p-3 rounded-2xl">
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <Volume2 className="size-4 text-indigo-400" />
                <span>Audio Live</span>
              </div>

              {/* Reaction Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleReaction("❤️")}
                  className="p-2 rounded-xl bg-pink-500/20 hover:bg-pink-500/30 text-pink-400 transition-transform active:scale-125"
                  title="Send Heart"
                >
                  <Heart className="size-4 fill-current" />
                </button>
                <button
                  onClick={() => handleReaction("👍")}
                  className="p-2 rounded-xl bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 transition-transform active:scale-125"
                  title="Thumbs Up"
                >
                  <ThumbsUp className="size-4 fill-current" />
                </button>
                <button
                  onClick={() => handleReaction("🔥")}
                  className="p-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 transition-transform active:scale-125"
                  title="Fire"
                >
                  <Flame className="size-4 fill-current" />
                </button>
              </div>

              <button className="text-slate-400 hover:text-white p-1">
                <Maximize2 className="size-4" />
              </button>
            </div>
          </div>

          {/* Right Live Chat & Poll Panel */}
          <div className="bg-slate-900 border-l border-slate-800 flex flex-col h-full">
            {/* Chat Tabs */}
            <div className="p-3 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-2">
                <MessageSquare className="size-4 text-indigo-400" /> Live Student Chat
              </span>
              <Badge variant="outline" className="text-[10px] border-slate-700 text-slate-300">
                Real-time
              </Badge>
            </div>

            {/* Poll Box */}
            <div className="p-3 bg-indigo-950/40 border-b border-indigo-900/50 space-y-2">
              <span className="text-[10px] font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-1">
                <BarChart2 className="size-3 text-indigo-400" /> Active Speaker Poll
              </span>
              <p className="text-xs font-semibold text-white">
                Which feature is most critical in system design interviews?
              </p>
              <div className="grid grid-cols-2 gap-1.5 pt-1">
                {["Caching (Redis)", "Database Sharding", "Message Queues", "Rate Limiting"].map((opt) => (
                  <button
                    key={opt}
                    onClick={() => {
                      setPollVoted(opt);
                      toast.success(`Voted: ${opt}`);
                    }}
                    className={`px-2.5 py-1.5 rounded-lg text-[11px] font-medium text-left transition-all ${
                      pollVoted === opt
                        ? "bg-indigo-600 text-white font-bold"
                        : "bg-slate-800/80 hover:bg-slate-800 text-slate-300"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {/* Chat Feed */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 no-scrollbar text-xs">
              {chatLog.map((msg) => (
                <div key={msg.id} className="space-y-0.5">
                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span className="font-bold text-indigo-400">{msg.user}</span>
                    <span>{msg.time}</span>
                  </div>
                  <p className="text-slate-200 bg-slate-800/60 p-2 rounded-xl border border-slate-700/40">
                    {msg.text}
                  </p>
                </div>
              ))}
            </div>

            {/* Chat Input */}
            <form onSubmit={handleSendChat} className="p-3 bg-slate-950 border-t border-slate-800 flex gap-2">
              <Input
                type="text"
                placeholder="Send a live message..."
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 rounded-xl text-xs h-9"
              />
              <Button type="submit" size="sm" className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl h-9 px-3">
                <Send className="size-3.5" />
              </Button>
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
