import React, { useEffect, useState } from "react";
import {
  Award,
  ShieldCheck,
  RefreshCw,
  Download,
  FileCheck,
  Percent,
  Sparkles,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

import {
  fetchNaacCriteria,
  fetchNbaPrograms,
  INITIAL_NAAC,
  INITIAL_NBA,
  type NaacCriterion,
  type NbaProgram,
} from "./AccreditationService";

export function AccreditationModuleView() {
  const [naacList, setNaacList] = useState<NaacCriterion[]>(INITIAL_NAAC);
  const [nbaList, setNbaList] = useState<NbaProgram[]>(INITIAL_NBA);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"naac" | "nba">("naac");

  const loadData = async () => {
    setLoading(true);
    const [nc, nb] = await Promise.all([fetchNaacCriteria(), fetchNbaPrograms()]);
    setNaacList(nc);
    setNbaList(nb);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const totalScoreObtained = naacList.reduce((sum, item) => sum + item.scoreObtained, 0);
  const totalMaxScore = naacList.reduce((sum, item) => sum + item.maxScore, 0);
  const cgpaScore = ((totalScoreObtained / totalMaxScore) * 4).toFixed(2);

  const handleExportCSV = () => {
    const headers = ["Criterion Code", "Criterion Name", "Weightage", "Score Obtained", "Max Score", "Status"];
    const rows = naacList.map((c) => [c.code, `"${c.name}"`, c.weightage, c.scoreObtained, c.maxScore, c.status]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `NAAC_A++_AQAR_Accreditation_Report_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Exported NAAC & IQAC compliance dossier to CSV!");
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-primary/10 text-primary border border-primary/20 shrink-0">
            <Award className="size-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-bold font-display tracking-tight text-foreground">
                Accreditation & IQAC Quality Portal
              </h1>
              <Badge variant="outline" className="font-mono text-xs text-emerald-600 bg-emerald-500/10 border-emerald-500/30">
                NAAC A++ Grade (CGPA {cgpaScore} / 4.0)
              </Badge>
            </div>
            <p className="text-xs md:text-sm text-muted-foreground mt-0.5">
              National Assessment and Accreditation Council (NAAC), NBA Tier-1 Washington Accord, and NIRF Institutional Rankings.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 shrink-0 self-start sm:self-auto">
          <Button variant="outline" size="sm" onClick={loadData} disabled={loading} className="h-9 gap-2 text-xs font-medium">
            <RefreshCw className={`size-3.5 ${loading ? "animate-spin" : ""}`} /> Refresh
          </Button>
          <Button size="sm" onClick={handleExportCSV} className="h-9 bg-brand-gradient text-white gap-2 text-xs font-semibold shadow-glow">
            <Download className="size-4" /> Export AQAR Report
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground uppercase">
            <span>Cumulative Score</span>
            <ShieldCheck className="size-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-bold font-mono text-emerald-600">{totalScoreObtained} / {totalMaxScore}</p>
          <p className="text-[0.68rem] text-emerald-600 font-medium">CGPA {cgpaScore} • A++ Certified</p>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground uppercase">
            <span>NBA Programs</span>
            <Award className="size-4 text-blue-500" />
          </div>
          <p className="text-2xl font-bold font-mono text-blue-600">3 Tier-1 Programs</p>
          <p className="text-[0.68rem] text-muted-foreground">Washington Accord Compliant</p>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground uppercase">
            <span>NIRF India Rank</span>
            <TrendingUp className="size-4 text-purple-500" />
          </div>
          <p className="text-2xl font-bold font-mono text-purple-600">Rank #38</p>
          <p className="text-[0.68rem] text-purple-600 font-medium">Top 50 Engineering Colleges</p>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground uppercase">
            <span>AQAR Audit Status</span>
            <Percent className="size-4 text-amber-500" />
          </div>
          <p className="text-2xl font-bold font-mono text-amber-600">95.4% Verified</p>
          <p className="text-[0.68rem] text-muted-foreground">Annual Quality Assurance Report</p>
        </div>
      </div>

      {/* SUBPARTS TAB SWITCHER */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-muted/60 border border-border/80">
        <button onClick={() => setActiveTab("naac")} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === "naac" ? "bg-card text-primary shadow-sm" : "text-muted-foreground"}`}>
          1. NAAC 7-Criteria Score Audit ({naacList.length})
        </button>
        <button onClick={() => setActiveTab("nba")} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === "nba" ? "bg-card text-primary shadow-sm" : "text-muted-foreground"}`}>
          2. NBA Program Accreditation Status ({nbaList.length})
        </button>
      </div>

      {/* TAB 1: NAAC */}
      {activeTab === "naac" && (
        <div className="rounded-2xl border border-border/80 bg-card p-5 space-y-4 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/40 border-b border-border text-muted-foreground font-semibold uppercase tracking-wider text-[0.68rem]">
                <tr>
                  <th className="py-3 px-3">Criterion Code</th>
                  <th className="py-3 px-3">Criterion Focus Area</th>
                  <th className="py-3 px-3">Weightage</th>
                  <th className="py-3 px-3">Score Achieved</th>
                  <th className="py-3 px-3">Completion Progress</th>
                  <th className="py-3 px-3">Audit Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {naacList.map((c) => {
                  const pct = Math.round((c.scoreObtained / c.maxScore) * 100);
                  return (
                    <tr key={c.id} className="hover:bg-muted/20 transition-colors">
                      <td className="py-3 px-3 font-mono font-bold text-foreground">{c.code}</td>
                      <td className="py-3 px-3 font-bold text-foreground">{c.name}</td>
                      <td className="py-3 px-3 font-mono font-semibold">{c.weightage} Pts</td>
                      <td className="py-3 px-3 font-mono font-bold text-emerald-600">{c.scoreObtained} / {c.maxScore}</td>
                      <td className="py-3 px-3 min-w-[140px]">
                        <div className="flex items-center gap-2">
                          <Progress value={pct} className="h-2 flex-1" />
                          <span className="font-mono text-[0.7rem] font-bold text-primary">{pct}%</span>
                        </div>
                      </td>
                      <td className="py-3 px-3"><Badge className={c.status === "Completed" ? "bg-emerald-500/10 text-emerald-600" : "bg-amber-500/10 text-amber-600"}>{c.status}</Badge></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: NBA */}
      {activeTab === "nba" && (
        <div className="rounded-2xl border border-border/80 bg-card p-5 space-y-4 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/40 border-b border-border text-muted-foreground font-semibold uppercase tracking-wider text-[0.68rem]">
                <tr>
                  <th className="py-3 px-3">Program Name</th>
                  <th className="py-3 px-3">Department</th>
                  <th className="py-3 px-3">Accreditation Tier</th>
                  <th className="py-3 px-3">Current Status</th>
                  <th className="py-3 px-3">Valid Until</th>
                  <th className="py-3 px-3">Self-Assessment (SAR)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {nbaList.map((n) => (
                  <tr key={n.id} className="hover:bg-muted/20 transition-colors">
                    <td className="py-3 px-3 font-bold text-foreground">{n.programName}</td>
                    <td className="py-3 px-3 font-semibold">{n.department}</td>
                    <td className="py-3 px-3"><Badge variant="outline" className="font-mono text-xs">{n.tier}</Badge></td>
                    <td className="py-3 px-3 font-bold text-emerald-600">{n.accreditationStatus}</td>
                    <td className="py-3 px-3 font-mono text-muted-foreground">{n.validUntil}</td>
                    <td className="py-3 px-3 min-w-[140px]">
                      <div className="flex items-center gap-2">
                        <Progress value={n.sarProgress} className="h-2 flex-1" />
                        <span className="font-mono text-[0.7rem] font-bold text-primary">{n.sarProgress}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
