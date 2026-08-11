import { useState } from "react";
import {
  SlidersHorizontal,
  Save,
  ShieldCheck,
  Zap,
  Bell,
  Scale,
  RefreshCw,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";

import { Panel } from "@/components/dashboard/panel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function PlacementSettingsWorkspace() {
  const [minCgpa, setMinCgpa] = useState("7.5");
  const [maxBacklogs, setMaxBacklogs] = useState("0");
  const [superDreamCtc, setSuperDreamCtc] = useState("20.0");
  const [dreamCtc, setDreamCtc] = useState("10.0");
  const [oneStudentOneJob, setOneStudentOneJob] = useState(true);
  const [autoProctorAlerts, setAutoProctorAlerts] = useState(true);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Saved Institutional Placement Policy Configuration successfully!");
  };

  return (
    <div className="space-y-6 animate-fade-up">
      {/* HEADER BANNER */}
      <div className="relative overflow-hidden rounded-3xl border border-border/80 bg-card p-6 shadow-sm sm:p-8 backdrop-blur-xl">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between relative z-10">
          <div className="flex items-start gap-4">
            <div className="size-16 rounded-2xl bg-brand-gradient text-white grid place-items-center font-extrabold text-2xl shadow-glow shrink-0">
              <SlidersHorizontal className="size-8" />
            </div>
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <Badge className="bg-purple-600 text-white font-mono text-[0.7rem]">
                  Institutional Governance Engine
                </Badge>
                <Badge variant="outline" className="font-mono text-[0.7rem]">
                  Placement Policy Rules
                </Badge>
              </div>
              <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight">
                Placement Policy Rules & Governance Configurator
              </h1>
              <p className="text-xs text-muted-foreground font-mono">
                Configure CGPA cutoffs, backlog allowances, CTC tier thresholds (Super Dream / Dream), and automated proctoring rules.
              </p>
            </div>
          </div>

          <Button
            onClick={handleSaveSettings}
            className="bg-brand-gradient shadow-glow font-bold text-xs rounded-xl h-10 px-4 cursor-pointer gap-1.5"
          >
            <Save className="size-4" /> Save Governance Rules
          </Button>
        </div>
      </div>

      {/* POLICY CONFIGURATION FORM */}
      <Panel title="Placement Policy Configuration Engine">
        <form onSubmit={handleSaveSettings} className="space-y-4 pt-1 text-xs">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5 p-4 rounded-xl border border-border bg-card">
              <label className="font-bold flex items-center gap-1.5">
                <Scale className="size-4 text-primary" /> Minimum CGPA Eligibility Cutoff
              </label>
              <Input
                value={minCgpa}
                onChange={(e) => setMinCgpa(e.target.value)}
                placeholder="e.g. 7.5"
                className="h-10 text-xs rounded-xl font-mono"
              />
              <span className="text-[0.68rem] text-muted-foreground block">Students below this CGPA will be automatically marked Ineligible.</span>
            </div>

            <div className="space-y-1.5 p-4 rounded-xl border border-border bg-card">
              <label className="font-bold flex items-center gap-1.5">
                <ShieldCheck className="size-4 text-emerald-600" /> Maximum Allowed Active Backlogs
              </label>
              <Input
                value={maxBacklogs}
                onChange={(e) => setMaxBacklogs(e.target.value)}
                placeholder="e.g. 0"
                className="h-10 text-xs rounded-xl font-mono"
              />
              <span className="text-[0.68rem] text-muted-foreground block">Maximum active backlogs permitted at the time of drive application.</span>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5 p-4 rounded-xl border border-border bg-card">
              <label className="font-bold flex items-center gap-1.5">
                <Zap className="size-4 text-purple-600" /> Super Dream CTC Threshold (LPA)
              </label>
              <Input
                value={superDreamCtc}
                onChange={(e) => setSuperDreamCtc(e.target.value)}
                placeholder="e.g. 20.0"
                className="h-10 text-xs rounded-xl font-mono"
              />
              <span className="text-[0.68rem] text-muted-foreground block">Offers equal or above this package bypass the One Student One Job policy.</span>
            </div>

            <div className="space-y-1.5 p-4 rounded-xl border border-border bg-card">
              <label className="font-bold flex items-center gap-1.5">
                <Badge className="bg-blue-600 text-white font-mono text-[0.65rem]">Dream CTC Threshold</Badge>
              </label>
              <Input
                value={dreamCtc}
                onChange={(e) => setDreamCtc(e.target.value)}
                placeholder="e.g. 10.0"
                className="h-10 text-xs rounded-xl font-mono"
              />
              <span className="text-[0.68rem] text-muted-foreground block">Offers in ₹10–20 LPA bracket classified as Dream Tier.</span>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-border bg-card space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-foreground">One Student One Job Policy Enforcement</p>
                <span className="text-[0.68rem] text-muted-foreground block">Prevents placed candidates from applying to regular tier drives.</span>
              </div>
              <input
                type="checkbox"
                checked={oneStudentOneJob}
                onChange={(e) => setOneStudentOneJob(e.target.checked)}
                className="size-4 cursor-pointer"
              />
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-border/50">
              <div>
                <p className="font-bold text-foreground">Automated AI Proctoring Malpractice Alerts</p>
                <span className="text-[0.68rem] text-muted-foreground block">Instantly notify TPO proctor when tab switch or camera feed cut occurs.</span>
              </div>
              <input
                type="checkbox"
                checked={autoProctorAlerts}
                onChange={(e) => setAutoProctorAlerts(e.target.checked)}
                className="size-4 cursor-pointer"
              />
            </div>
          </div>

          <div className="pt-2">
            <Button type="submit" className="bg-brand-gradient shadow-glow font-bold rounded-xl text-xs cursor-pointer">
              Save Policy Configuration
            </Button>
          </div>
        </form>
      </Panel>
    </div>
  );
}
