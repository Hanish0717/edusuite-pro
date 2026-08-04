import { useState } from "react";
import {
  AlertTriangle,
  Clock,
  Zap,
  ArrowRight,
  ShieldAlert,
  CheckCircle2,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Panel } from "@/components/dashboard/panel";
import { WorkflowItem } from "@/types/approval";
import { getSlaStatus } from "@/lib/workflowService";
import { toast } from "sonner";

interface EscalationManagerProps {
  workflows: WorkflowItem[];
  onEscalateWorkflow: (id: string, reason: string) => void;
}

export function EscalationManager({ workflows, onEscalateWorkflow }: EscalationManagerProps) {
  const [selectedWorkflows, setSelectedWorkflows] = useState<string[]>([]);

  // Filter items needing escalation or already escalated
  const escalatedItems = workflows.filter((w) => w.isEscalated || w.status === "Escalated");
  const overdueItems = workflows.filter(
    (w) => w.status !== "Completed" && w.status !== "Rejected" && getSlaStatus(w).isOverdue
  );

  const toggleSelect = (id: string) => {
    setSelectedWorkflows((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleTriggerAutoEscalation = () => {
    if (overdueItems.length === 0) {
      toast.info("No workflows currently exceed SLA limits.");
      return;
    }

    overdueItems.forEach((w) => {
      onEscalateWorkflow(w.id, "Automated SLA Timeout Daemon (Exceeded Category SLA)");
    });

    toast.warning(`Triggered escalation for ${overdueItems.length} overdue workflows.`);
  };

  return (
    <div className="space-y-6">
      {/* HEADER HERO CARD */}
      <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <span className="grid size-12 place-items-center rounded-2xl bg-amber-500/20 text-amber-600 dark:text-amber-400 ring-4 ring-amber-500/10">
            <Zap className="size-6" />
          </span>
          <div>
            <h3 className="font-display text-base font-extrabold text-foreground">
              Automated Timeout Escalation Engine
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Monitors SLA timers per workflow category. Automatically elevates stale requests to higher authority levels.
            </p>
          </div>
        </div>

        <Button
          size="sm"
          onClick={handleTriggerAutoEscalation}
          className="bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs cursor-pointer gap-2 shrink-0 shadow-md"
        >
          <RefreshCw className="size-4" /> Run Escalation Daemon Now
        </Button>
      </div>

      {/* OVERDUE & ESCALATION QUEUES GRID */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* QUEUE 1: OVERDUE ITEMS (SLA BREACHED) */}
        <Panel
          title={`SLA Breached / Overdue Queue (${overdueItems.length})`}
          description="Workflows that have exceeded their designated SLA hours and require escalation"
          action={
            <Badge variant="destructive" className="font-mono text-xs">
              SLA ACTION REQUIRED
            </Badge>
          }
        >
          {overdueItems.length === 0 ? (
            <div className="py-8 text-center text-xs text-muted-foreground space-y-1">
              <CheckCircle2 className="size-8 mx-auto text-emerald-500/40" />
              <p className="font-bold text-foreground">All active workflows are within SLA benchmarks!</p>
              <p>No SLA timeouts detected at this time.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {overdueItems.map((wf) => {
                const sla = getSlaStatus(wf);
                const currentStep = wf.steps[wf.currentStepIndex];

                return (
                  <div
                    key={wf.id}
                    className="p-3.5 rounded-xl border border-destructive/30 bg-destructive/5 space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-destructive">{wf.id}</span>
                      <Badge variant="outline" className="font-mono text-[0.65rem] border-destructive/40 text-destructive">
                        {sla.displayText}
                      </Badge>
                    </div>

                    <h4 className="font-bold text-foreground">{wf.title}</h4>
                    <p className="text-[0.72rem] text-muted-foreground">
                      Stuck at Step {wf.currentStepIndex + 1}: <strong className="text-foreground">{currentStep?.label}</strong> ({currentStep?.role})
                    </p>

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[0.68rem] font-mono text-muted-foreground">
                        SLA Hours: {wf.slaHours}h
                      </span>
                      <Button
                        size="sm"
                        onClick={() => onEscalateWorkflow(wf.id, "Manual timeout escalation from manager")}
                        className="bg-amber-500 hover:bg-amber-600 text-white text-[0.7rem] h-7 px-2.5 font-bold cursor-pointer gap-1"
                      >
                        <Zap className="size-3" /> Escalate to Next Role
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Panel>

        {/* QUEUE 2: ESCALATED WORKFLOWS HISTORY */}
        <Panel
          title={`Active Escalated Workflows (${escalatedItems.length})`}
          description="Requests currently elevated to higher authorities (Dean / Principal / Super Admin)"
        >
          {escalatedItems.length === 0 ? (
            <div className="py-8 text-center text-xs text-muted-foreground space-y-1">
              <Clock className="size-8 mx-auto text-muted-foreground/30" />
              <p className="font-bold text-foreground">No active escalated workflows.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {escalatedItems.map((wf) => (
                <div
                  key={wf.id}
                  className="p-3.5 rounded-xl border border-amber-500/30 bg-amber-500/5 space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-amber-600 dark:text-amber-400">{wf.id}</span>
                    <Badge className="bg-amber-500 text-white font-mono text-[0.65rem]">
                      Escalated x{wf.escalationCount}
                    </Badge>
                  </div>

                  <h4 className="font-bold text-foreground">{wf.title}</h4>

                  {/* ESCALATION HISTORY STACK */}
                  <div className="space-y-1 pt-1">
                    {wf.escalationHistory.map((esc) => (
                      <div
                        key={esc.id}
                        className="p-2 rounded-lg bg-card border border-border/60 text-[0.68rem] flex items-center justify-between"
                      >
                        <div>
                          <span className="font-bold text-foreground">{esc.fromRole}</span>
                          <ArrowRight className="inline size-3 mx-1 text-amber-500" />
                          <span className="font-bold text-primary">{esc.toRole}</span>
                        </div>
                        <span className="font-mono text-muted-foreground">{esc.timestamp}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Panel>
      </div>
    </div>
  );
}
