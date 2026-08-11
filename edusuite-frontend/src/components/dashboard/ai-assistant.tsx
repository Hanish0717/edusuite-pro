import { useState } from "react";
import { Bot, Send, Sparkles, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRole } from "@/context/role-context";
import { aiInsightsByRole } from "@/data/mock";
import { cn } from "@/lib/utils";

export function AiAssistant() {
  const [open, setOpen] = useState(false);
  const { role, profile } = useRole();
  const insights = aiInsightsByRole[role] ?? [];

  return (
    <>
      {open && (
        <div className="animate-fade-up fixed bottom-24 right-4 z-50 w-[min(22rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-border bg-card shadow-elevated">
          <div className="flex items-center justify-between bg-brand-gradient px-4 py-3">
            <div className="flex items-center gap-2 text-primary-foreground">
              <Sparkles className="size-4" />
              <p className="text-sm font-semibold">EduSuite AI Assistant</p>
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close assistant"
              className="text-primary-foreground/80 transition-colors hover:text-primary-foreground"
            >
              <X className="size-4" />
            </button>
          </div>
          <div className="space-y-2 p-4">
            <p className="text-xs text-muted-foreground">
              Suggestions for {profile.label.toLowerCase()}
            </p>
            {insights.map((insight) => (
              <p
                key={insight}
                className="rounded-xl bg-muted px-3 py-2 text-sm leading-relaxed text-foreground"
              >
                {insight}
              </p>
            ))}
            <div className="flex items-center gap-2 pt-1">
              <Input placeholder="Ask anything about your campus..." className="h-9" />
              <Button size="icon" className="size-9 shrink-0" aria-label="Send">
                <Send className="size-4" />
              </Button>
            </div>
          </div>
        </div>
      )}

      <Button
        onClick={() => setOpen((o) => !o)}
        aria-label="AI assistant"
        className={cn(
          "fixed bottom-6 right-4 z-50 size-14 rounded-full bg-brand-gradient shadow-glow transition-transform hover:scale-105",
        )}
      >
        <Bot className="size-6" />
      </Button>
    </>
  );
}
