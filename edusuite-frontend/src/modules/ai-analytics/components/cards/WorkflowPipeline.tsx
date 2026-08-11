import { ArrowRight, Cpu, Database, ShieldAlert, Bell, Users } from "lucide-react";

export function WorkflowPipeline() {
  const steps = [
    {
      id: "data",
      title: "Biometric Logs",
      desc: "Attendance & LMS registers",
      icon: Database,
      color: "bg-blue-500/10 border-blue-500/30 text-blue-500",
    },
    {
      id: "forecast",
      title: "LSTM Predictor",
      desc: "Shortage forecasting engine",
      icon: Cpu,
      color: "bg-indigo-500/10 border-indigo-500/30 text-indigo-500",
    },
    {
      id: "risk",
      title: "Risk Analysis",
      desc: "Academic fail probability",
      icon: ShieldAlert,
      color: "bg-amber-500/10 border-amber-500/30 text-amber-500",
    },
    {
      id: "notify",
      title: "Alerts Dispatcher",
      desc: "Email / SMS / Push trigger",
      icon: Bell,
      color: "bg-purple-500/10 border-purple-500/30 text-purple-500",
    },
    {
      id: "actors",
      title: "Stakeholders",
      desc: "HOD, Parents & Mentors",
      icon: Users,
      color: "bg-emerald-500/10 border-emerald-500/30 text-emerald-500",
    },
  ];

  return (
    <div className="w-full bg-card border border-border/50 rounded-2xl p-5 shadow-[0_4px_20px_-2px_rgba(29,78,216,0.05)]">
      <div className="flex items-center justify-between mb-4 border-b border-border/40 pb-3">
        <div>
          <h3 className="font-bold text-sm text-foreground">AI Intelligence Data Pipeline</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Institutional telemetry processing pipeline.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-9 items-center gap-4 py-2">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          const isLast = idx === steps.length - 1;

          return (
            <React.Fragment key={step.id}>
              {/* Node Card */}
              <div className="md:col-span-1 flex flex-col items-center text-center p-3 rounded-xl border bg-muted/5 border-border/40 hover:border-primary/40 hover:shadow-md transition-all duration-200">
                <div className={`size-10 rounded-full flex items-center justify-center border ${step.color} mb-2 shadow-sm animate-pulse`}>
                  <Icon className="size-5" />
                </div>
                <h4 className="font-bold text-xs text-foreground leading-tight">{step.title}</h4>
                <p className="text-[10px] text-muted-foreground mt-1 max-w-[120px] leading-tight">
                  {step.desc}
                </p>
              </div>

              {/* Arrow connector */}
              {!isLast && (
                <div className="md:col-span-1 flex items-center justify-center text-muted-foreground/40">
                  <ArrowRight className="size-5 rotate-90 md:rotate-0 animate-bounce" />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

import React from "react";
export default WorkflowPipeline;
