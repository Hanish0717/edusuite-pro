import React, { useState } from "react";
import { ChatMessage } from "./types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sparkles, Send, Maximize2 } from "lucide-react";
import { toast } from "sonner";

export function AiWidget() {
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "msg-1",
      sender: "ai",
      text: "Hello Aditya! I'm your EduSuite AI Academic Assistant. Ask me anything about your timetable, grades, or study strategies.",
      timestamp: "Just now",
    },
  ]);

  const suggestions = [
    "Show my attendance",
    "Upcoming exams",
    "Pending fees",
    "Today's classes",
    "Explain DBMS",
    "Generate study plan",
  ];

  const handleSend = (textToSend?: string) => {
    const q = textToSend || chatInput;
    if (!q.trim()) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: "user",
      text: q,
      timestamp: "Just now",
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setChatInput("");

    setTimeout(() => {
      let aiText = "Analyzing your request against live ERP database...";
      const queryLower = q.toLowerCase();

      if (queryLower.includes("attendance")) {
        aiText = "Your overall attendance is 88.5% (137/155 classes). You are fully eligible for semester exams!";
      } else if (queryLower.includes("class") || queryLower.includes("today")) {
        aiText = "Your next class is CS403 Theory of Computation at 12:00 PM in Room 204, Academic Block B with Dr. Ravi Shankar.";
      } else if (queryLower.includes("fee") || queryLower.includes("pending")) {
        aiText = "Great news! Your Semester VII fee balance is ₹0 (Fully Paid). No pending dues.";
      } else if (queryLower.includes("exam")) {
        aiText = "Your next exam is 'Theory of Computation' on August 8, 2026 at 10:00 AM in Room 302, Academic Block B.";
      } else if (queryLower.includes("study plan")) {
        aiText = "Generated 7-Day Study Plan: Focus on MapReduce (2h/day), RSA Cryptography (1.5h/day), and TOC Context-Free Grammars.";
      } else if (queryLower.includes("dbms")) {
        aiText = "DBMS Normalization is the process of organizing relational tables to reduce redundancy. 1NF: Atomic values, 2NF: No partial dependencies, 3NF: No transitive dependencies, BCNF: Determinant is candidate key.";
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          sender: "ai",
          text: aiText,
          timestamp: "Just now",
        },
      ]);
    }, 600);
  };

  return (
    <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4 flex flex-col justify-between">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-blue-600 text-white shadow-sm shadow-blue-500/20">
            <Sparkles className="h-4 w-4 animate-pulse" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              SECTION 16: AI STUDENT ASSISTANT
            </h3>
            <p className="text-[11px] text-slate-500 font-medium">
              Powered by EduSuite Neural Engine
            </p>
          </div>
        </div>

        <Button
          onClick={() => toast.info("Opening full AI Academic Assistant...")}
          size="sm"
          variant="outline"
          className="h-8 text-xs rounded-xl border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 gap-1"
        >
          <Maximize2 className="h-3.5 w-3.5" /> Expand
        </Button>
      </div>

      <div className="space-y-3">
        <div className="h-44 overflow-y-auto p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-2 text-xs scrollbar-thin">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl p-2.5 leading-relaxed ${
                  m.sender === "user"
                    ? "bg-blue-600 text-white rounded-br-none"
                    : "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-bl-none shadow-2xs"
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-1">
          {suggestions.map((q) => (
            <button
              key={q}
              onClick={() => handleSend(q)}
              className="text-[10px] font-medium bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/40 text-slate-600 dark:text-slate-300 hover:text-blue-600 border border-slate-200/60 dark:border-slate-700/60 px-2 py-0.5 rounded-lg transition-colors"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2 pt-1">
        <Input
          type="text"
          placeholder="Ask AI assistant anything..."
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          className="h-9 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 flex-1"
        />
        <Button
          onClick={() => handleSend()}
          size="sm"
          className="h-9 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-xs"
        >
          <Send className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}
