import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Loader2, HelpCircle, Trash2 } from "lucide-react";
import { useChatbot } from "../hooks/useChatbot";
import { Panel } from "@/components/dashboard/panel";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { WorkflowPipeline } from "../components/cards/WorkflowPipeline";

const SUGGESTED_QUERIES = [
  "What is my attendance?",
  "Show my timetable",
  "Show my hall ticket",
  "Show fee status",
  "Show today's classes",
  "Show placement eligibility",
  "Generate attendance report",
  "Show pending assignments",
];

export function Chatbot() {
  const { messages, typing, sendMessage, clearChat } = useChatbot();
  const [input, setInput] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);

  const handleSend = () => {
    if (!input.trim()) return;
    sendMessage(input);
    setInput("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const renderDataPayload = (type: string, data: any) => {
    if (type === "table" && Array.isArray(data)) {
      return (
        <div className="mt-3 border border-border/80 rounded-xl overflow-hidden text-xs w-full max-w-md bg-background/50">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted/80 border-b border-border/60">
                {Object.keys(data[0] || {}).map((key) => (
                  <th key={key} className="p-2 capitalize font-bold text-foreground">
                    {key}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, idx) => (
                <tr key={idx} className="border-b border-border/40 last:border-b-0 hover:bg-muted/30">
                  {Object.values(row).map((val: any, cellIdx) => (
                    <td key={cellIdx} className="p-2 font-medium text-muted-foreground">
                      {val}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    if (type === "chart" && Array.isArray(data)) {
      return (
        <div className="mt-3 flex flex-col gap-1.5 w-full max-w-md bg-background/40 p-3 rounded-xl border border-border/60">
          {data.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between text-xs">
              <span className="font-semibold text-muted-foreground">{item.criterion}</span>
              <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 font-bold">
                Met
              </Badge>
            </div>
          ))}
        </div>
      );
    }

    return null;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Visual Pipeline Graph */}
      <WorkflowPipeline />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Suggestions column */}
        <div className="lg:col-span-1 space-y-4">
          <Panel
            title="Suggested Queries"
            description="Click any preloaded command template to send a simulated inquiry directly to the LLM agent."
          >
            <div className="flex flex-col gap-2">
              {SUGGESTED_QUERIES.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => sendMessage(q)}
                  className="flex items-center gap-2 text-left text-xs font-semibold px-3 py-2.5 rounded-xl border border-border/80 text-muted-foreground hover:text-primary hover:border-primary/40 hover:bg-primary/5 transition-all duration-200 cursor-pointer"
                >
                  <HelpCircle className="size-3.5 text-primary shrink-0" />
                  <span>{q}</span>
                </button>
              ))}
            </div>
          </Panel>
        </div>

        {/* Main chat window column */}
        <div className="lg:col-span-2">
          <Panel
            title="EduSuite AI Virtual Assistant"
            description="Natural language queries addressing grades, fees, class lists, and general institutional data."
            action={
              <Button
                variant="outline"
                size="sm"
                onClick={clearChat}
                className="text-xs font-semibold gap-1.5 cursor-pointer text-red-500 hover:text-red-600 border-red-500/25 hover:bg-red-500/5"
              >
                <Trash2 className="size-3.5" /> Clear History
              </Button>
            }
          >
            {/* Messages feed */}
            <div className="h-[400px] overflow-y-auto border border-border/60 rounded-2xl p-4 bg-muted/10 flex flex-col gap-4">
              {messages.map((msg) => {
                const isBot = msg.sender === "bot";
                return (
                  <div
                    key={msg.id}
                    className={`flex gap-3 max-w-[85%] ${
                      isBot ? "self-start" : "self-end flex-row-reverse"
                    }`}
                  >
                    <span
                      className={`grid size-8 place-items-center rounded-xl shrink-0 ${
                        isBot
                          ? "bg-primary text-white shadow-[0_2px_8px_rgba(29,78,216,0.2)]"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {isBot ? <Bot className="size-4" /> : <User className="size-4" />}
                    </span>
                    <div className="flex flex-col gap-1">
                      <div
                        className={`p-3 rounded-2xl text-sm leading-relaxed ${
                          isBot
                            ? "bg-card text-foreground border border-border/60"
                            : "bg-primary text-white font-medium"
                        }`}
                      >
                        <p className="whitespace-pre-line text-xs font-semibold">{msg.text}</p>
                        {msg.type && renderDataPayload(msg.type, msg.data)}
                      </div>
                      <span className="text-[10px] text-muted-foreground px-1 self-start font-mono font-semibold">
                        {msg.timestamp}
                      </span>
                    </div>
                  </div>
                );
              })}

              {typing && (
                <div className="flex gap-3 self-start">
                  <span className="grid size-8 place-items-center rounded-xl bg-primary text-white shadow-[0_2px_8px_rgba(29,78,216,0.2)] shrink-0">
                    <Bot className="size-4" />
                  </span>
                  <div className="flex items-center gap-1.5 px-4 py-3 bg-card border border-border/60 rounded-2xl text-xs text-muted-foreground font-semibold font-display">
                    <Loader2 className="size-3.5 animate-spin text-primary" />
                    <span>Processing metrics...</span>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Chat input box */}
            <div className="flex items-center gap-2 mt-4">
              <Input
                placeholder="Ask anything about attendance, schedules, exam codes..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                className="h-10"
              />
              <Button
                onClick={handleSend}
                className="h-10 bg-primary hover:bg-primary/90 text-white font-semibold cursor-pointer shrink-0"
              >
                <Send className="size-4" />
              </Button>
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}
