import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sparkles, Send, Bot, Maximize2 } from "lucide-react";
import { toast } from "sonner";

export function AiLearningWidget() {
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState<
    { id: string; sender: "user" | "ai"; text: string }[]
  >([
    {
      id: "m-1",
      sender: "ai",
      text: "Hi Aditya! I'm your AI LMS Tutor. Ask me to summarize lecture notes, generate flashcards, create practice MCQs, or simplify tough concepts!",
    },
  ]);

  const suggestions = [
    "Summarize this topic",
    "Generate notes",
    "Create flashcards",
    "Generate MCQs",
    "Explain difficult concepts",
    "Prepare exam revision",
  ];

  const handleSend = (textToSend?: string) => {
    const q = textToSend || chatInput;
    if (!q.trim()) return;

    const userMsg = { id: `u-${Date.now()}`, sender: "user" as const, text: q };
    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setChatInput("");

    setTimeout(() => {
      let responseText = "Analyzing your course repository with EduSuite Neural Engine...";
      const queryLower = q.toLowerCase();

      if (queryLower.includes("summarize")) {
        responseText = "Summary of CS401 Distributed Systems: Key focus areas are Vector Clocks, Consensus (Raft/Paxos), and MapReduce execution model.";
      } else if (queryLower.includes("notes") || queryLower.includes("generate notes")) {
        responseText = "Generated Quick Notes:\n1. Raft Leader Election: Heartbeat timeout triggers Candidate state.\n2. Log Replication: Uncommitted entries require quorum write.";
      } else if (queryLower.includes("flashcards")) {
        responseText = "Flashcards Created!\nCard 1: Q: What is AES-256? A: Symmetric block cipher using 14 rounds of substitution/permutation.\nCard 2: Q: What is 3NF? A: Relation in 2NF with no transitive dependencies.";
      } else if (queryLower.includes("mcqs") || queryLower.includes("mcq")) {
        responseText = "MCQ Practice:\nQ: Which automaton accepts Context-Free Languages?\nA) FSA  B) Pushdown Automata  C) Turing Machine\nCorrect: B (PDA with stack memory).";
      } else if (queryLower.includes("explain")) {
        responseText = "Simplifying Concept: Byzantine Fault Tolerance (BFT) ensures agreement even if nodes actively lie or send conflicting messages. Requires 3f+1 total nodes to handle f malicious nodes.";
      } else if (queryLower.includes("revision") || queryLower.includes("exam")) {
        responseText = "7-Day LMS Exam Revision Roadmap: Day 1-2 (TOC Automata), Day 3-4 (Crypto RSA/AES), Day 5-6 (Cloud Virtualization), Day 7 (Practice 30 Quizzes).";
      }

      setMessages((prev) => [
        ...prev,
        { id: `a-${Date.now()}`, sender: "ai" as const, text: responseText },
      ]);
    }, 500);
  };

  return (
    <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4 flex flex-col justify-between">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-purple-600 text-white shadow-sm shadow-purple-500/20">
            <Sparkles className="h-4 w-4 animate-pulse" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              AI LMS LEARNING TUTOR
            </h3>
            <p className="text-[11px] text-slate-500 font-medium">
              Smart Summarizer & Study Assistant
            </p>
          </div>
        </div>

        <Badge className="bg-purple-500/10 text-purple-600 border-purple-500/20 font-mono text-[10px]">
          Neural v4.2
        </Badge>
      </div>

      <div className="space-y-3">
        <div className="h-40 overflow-y-auto p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-2 text-xs scrollbar-thin">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl p-2.5 leading-relaxed whitespace-pre-line ${
                  m.sender === "user"
                    ? "bg-purple-600 text-white rounded-br-none"
                    : "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-bl-none shadow-2xs"
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-1">
          {suggestions.map((sug) => (
            <button
              key={sug}
              onClick={() => handleSend(sug)}
              className="text-[10px] font-medium bg-slate-100 dark:bg-slate-800 hover:bg-purple-50 dark:hover:bg-purple-950/40 text-slate-600 dark:text-slate-300 hover:text-purple-600 border border-slate-200/60 dark:border-slate-700/60 px-2 py-0.5 rounded-lg transition-colors"
            >
              {sug}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2 pt-1">
        <Input
          type="text"
          placeholder="Ask AI tutor anything about your courses..."
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          className="h-9 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 flex-1"
        />
        <Button
          onClick={() => handleSend()}
          size="sm"
          className="h-9 px-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white shadow-xs"
        >
          <Send className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}
