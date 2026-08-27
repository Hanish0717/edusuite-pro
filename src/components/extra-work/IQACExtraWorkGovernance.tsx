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
    <div className="space-y-6 text-slate-900 dark:text-slate-100">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
            <BadgeCheck className="size-4 text-primary" />
            <span>IQAC Accreditation Governance</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-foreground mt-1">
            Accreditation & Evidence Readiness Governance
          </h1>
          <p className="text-xs md:text-sm text-muted-foreground mt-0.5">
            Audit NAAC Criteria 1–7 faculty contributions, verify evidence readiness scores, and export SSR accreditation indices
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={handleExportNAAC}
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs px-4 py-2 gap-2 rounded-xl shadow-2xs"
          >
            <Download className="size-4" />
            <span>Generate NAAC Report</span>
          </Button>
          <Button variant="outline" className="border-border text-xs font-semibold rounded-xl gap-2 shadow-2xs">
            <FolderGit2 className="size-4" />
            <span>Export Evidence Index</span>
          </Button>
        </div>
      </div>

      {/* OVERALL EVIDENCE READINESS SCORE CARD */}
      <Card className="border border-border bg-card text-card-foreground rounded-2xl p-6 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <Badge variant="secondary" className="font-bold text-xs px-3 py-1 rounded-full">
              SSR AUDIT READINESS SCORE
            </Badge>
            <h2 className="text-3xl font-extrabold text-foreground mt-1">
              {iqacData.overallReadinessPercentage}% Verified Evidence Coverage
            </h2>
            <p className="text-xs text-muted-foreground">
              Institutional criteria proof items verified and indexed for NAAC Peer Team Assessment
            </p>
          </div>

          <div className="flex items-center gap-4 border-t md:border-t-0 md:border-l border-border pt-3 md:pt-0 md:pl-6">
            <div className="text-center">
              <span className="text-2xl font-extrabold font-mono text-emerald-600 dark:text-emerald-400">
                {iqacData.evidenceStats.verifiedEvidencePercent}%
              </span>
              <p className="text-[10px] text-muted-foreground font-semibold uppercase">Verified Proof</p>
            </div>
            <div className="text-center">
              <span className="text-2xl font-extrabold font-mono text-amber-600 dark:text-amber-400">
                {iqacData.evidenceStats.missingEvidencePercent}%
              </span>
              <p className="text-[10px] text-muted-foreground font-semibold uppercase">Missing Proof</p>
            </div>
            <div className="text-center">
              <span className="text-2xl font-extrabold font-mono text-primary">
                {iqacData.evidenceStats.pendingReviewPercent}%
              </span>
              <p className="text-[10px] text-muted-foreground font-semibold uppercase">Pending Review</p>
            </div>
          </div>
        </div>
      </Card>

      {/* CRITERIA PROGRESS BREAKDOWN */}
      <Card className="border border-border bg-card text-card-foreground rounded-2xl shadow-2xs">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-foreground">NAAC Criteria 1–7 Contribution Breakdown</CardTitle>
          <CardDescription className="text-xs text-muted-foreground">
            Faculty extra work activities mapped to mandatory accreditation metrics
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {iqacData.criteriaProgress.map((item, index) => (
            <div key={index} className="p-4 bg-muted/40 rounded-2xl border border-border space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-foreground">
                <span>{item.criterion}</span>
                <span className="font-mono text-emerald-600 dark:text-emerald-400">{item.progress}% Readiness ({item.verifiedActivities} Verified Activities)</span>
              </div>
              <div className="w-full bg-muted h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-primary h-full rounded-full transition-all duration-500"
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
