import React from "react";
import {
  BadgeCheck,
  ShieldCheck,
  FileText,
  Database,
  Download,
  CheckCircle2,
  AlertCircle,
  FileCheck2,
  FolderGit2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExtraWorkWalletService } from "@/services/extra-work-wallet-service";

export function IQACExtraWorkGovernance() {
  const iqacData = ExtraWorkWalletService.getIQACGovernance();

  const handleExportNAAC = () => {
    alert("Generating Comprehensive NAAC Criteria 1-7 Evidence Index PDF Report...");
  };

  return (
    <div className="space-y-6 text-slate-900 dark:text-white">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold tracking-wider text-emerald-600 dark:text-emerald-400 uppercase">
            <BadgeCheck className="size-4" />
            <span>IQAC Accreditation Governance</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight mt-1">
            Accreditation & Evidence Readiness Governance
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Audit NAAC Criteria 1–7 faculty contributions, verify evidence readiness scores, and export SSR accreditation indices
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={handleExportNAAC}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs px-4 py-2 gap-2 rounded-xl shadow-xs"
          >
            <Download className="size-4" />
            <span>Generate NAAC Report</span>
          </Button>
          <Button variant="outline" className="border-slate-200 dark:border-slate-700 text-xs font-semibold rounded-xl gap-2">
            <FolderGit2 className="size-4" />
            <span>Export Evidence Index</span>
          </Button>
        </div>
      </div>

      {/* OVERALL EVIDENCE READINESS SCORE CARD */}
      <Card className="border border-emerald-500/30 bg-gradient-to-r from-emerald-500/10 via-emerald-600/5 to-teal-500/10 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <Badge className="bg-emerald-600 text-white font-bold text-xs px-3 py-1 rounded-full">
              SSR AUDIT READINESS SCORE
            </Badge>
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
              {iqacData.overallReadinessPercentage}% Verified Evidence Coverage
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Institutional criteria proof items verified and indexed for NAAC Peer Team Assessment
            </p>
          </div>

          <div className="flex items-center gap-4 border-t md:border-t-0 md:border-l border-emerald-200 dark:border-emerald-800 pt-3 md:pt-0 md:pl-6">
            <div className="text-center">
              <span className="text-2xl font-extrabold font-mono text-emerald-600 dark:text-emerald-400">
                {iqacData.evidenceStats.verifiedEvidencePercent}%
              </span>
              <p className="text-[10px] text-slate-500 font-semibold uppercase">Verified Proof</p>
            </div>
            <div className="text-center">
              <span className="text-2xl font-extrabold font-mono text-amber-600 dark:text-amber-400">
                {iqacData.evidenceStats.missingEvidencePercent}%
              </span>
              <p className="text-[10px] text-slate-500 font-semibold uppercase">Missing Proof</p>
            </div>
            <div className="text-center">
              <span className="text-2xl font-extrabold font-mono text-blue-600 dark:text-blue-400">
                {iqacData.evidenceStats.pendingReviewPercent}%
              </span>
              <p className="text-[10px] text-slate-500 font-semibold uppercase">Pending Review</p>
            </div>
          </div>
        </div>
      </Card>

      {/* CRITERIA PROGRESS BREAKDOWN */}
      <Card className="border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-2xl shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-slate-900 dark:text-white">NAAC Criteria 1–7 Contribution Breakdown</CardTitle>
          <CardDescription className="text-xs text-slate-500 dark:text-slate-400">
            Faculty extra work activities mapped to mandatory accreditation metrics
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {iqacData.criteriaProgress.map((item, index) => (
            <div key={index} className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-900 dark:text-white">
                <span>{item.criterion}</span>
                <span className="font-mono text-emerald-600 dark:text-emerald-400">{item.progress}% Readiness ({item.verifiedActivities} Verified Activities)</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${item.progress}%` }}
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
