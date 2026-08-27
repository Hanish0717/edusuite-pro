import React, { useState } from "react";
import {
  Award,
  BookOpen,
  FlaskConical,
  Landmark,
  ShieldCheck,
  CheckCircle2,
  Clock,
  TrendingUp,
  FileCheck,
  PlusCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExtraWorkWalletService } from "@/services/extra-work-wallet-service";
import { ExtraWorkItem } from "@/types/extra-work-wallet";

export function ResearchExtraWorkGovernance() {
  const researchData = ExtraWorkWalletService.getResearchGovernance();

  return (
    <div className="space-y-6 text-slate-900 dark:text-slate-100">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
            <FlaskConical className="size-4 text-primary" />
            <span>Research & Development Dean Portfolio</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-foreground mt-1">
            Research Contribution Governance
          </h1>
          <p className="text-xs md:text-sm text-muted-foreground mt-0.5">
            Audit Scopus/IEEE publications, Indian & International patent grants, funded research projects, and research grants
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs px-4 py-2 gap-2 rounded-xl shadow-2xs">
            <PlusCircle className="size-4" />
            <span>Assign Research Task</span>
          </Button>
        </div>
      </div>

      {/* RESEARCH KPIS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="border border-border bg-card text-card-foreground rounded-2xl shadow-2xs">
          <CardContent className="p-4">
            <p className="text-xs font-semibold text-muted-foreground">Research WWP This Year</p>
            <h3 className="text-2xl font-extrabold font-mono mt-1 text-foreground">
              {researchData.researchWWPThisYear} <span className="text-xs font-normal text-muted-foreground">WWP</span>
            </h3>
            <p className="text-[11px] text-muted-foreground mt-1">Verified Research Credits</p>
          </CardContent>
        </Card>

        <Card className="border border-border bg-card text-card-foreground rounded-2xl shadow-2xs">
          <CardContent className="p-4">
            <p className="text-xs font-semibold text-muted-foreground">Pending Claims</p>
            <h3 className="text-2xl font-extrabold font-mono mt-1 text-amber-600 dark:text-amber-400">
              {researchData.pendingResearchVerification} <span className="text-xs font-normal text-muted-foreground">Items</span>
            </h3>
            <p className="text-[11px] text-muted-foreground mt-1">Research Audit Queue</p>
          </CardContent>
        </Card>

        <Card className="border border-border bg-card text-card-foreground rounded-2xl shadow-2xs">
          <CardContent className="p-4">
            <p className="text-xs font-semibold text-muted-foreground">Publications</p>
            <h3 className="text-2xl font-extrabold font-mono mt-1 text-emerald-600 dark:text-emerald-400">
              {researchData.publicationsCount} <span className="text-xs font-normal text-muted-foreground">Scopus/WoS</span>
            </h3>
            <p className="text-[11px] text-muted-foreground mt-1">Journals & Conferences</p>
          </CardContent>
        </Card>

        <Card className="border border-border bg-card text-card-foreground rounded-2xl shadow-2xs">
          <CardContent className="p-4">
            <p className="text-xs font-semibold text-muted-foreground">Patents Granted</p>
            <h3 className="text-2xl font-extrabold font-mono mt-1 text-foreground">
              {researchData.patentsCount} <span className="text-xs font-normal text-muted-foreground">Granted</span>
            </h3>
            <p className="text-[11px] text-muted-foreground mt-1">Indian & International IP</p>
          </CardContent>
        </Card>

        <Card className="border border-border bg-card text-card-foreground rounded-2xl shadow-2xs">
          <CardContent className="p-4">
            <p className="text-xs font-semibold text-muted-foreground">Funded Projects</p>
            <h3 className="text-2xl font-extrabold font-mono mt-1 text-foreground">
              {researchData.fundedProjectsCount} <span className="text-xs font-normal text-muted-foreground">Active</span>
            </h3>
            <p className="text-[11px] text-muted-foreground mt-1">Govt & Industry Grants</p>
          </CardContent>
        </Card>
      </div>

      {/* RESEARCH PIPELINE BREAKDOWN */}
      <Card className="border border-border bg-card text-card-foreground rounded-2xl p-5 shadow-2xs space-y-4">
        <h3 className="text-base font-bold text-foreground">Research Claims Pipeline</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 bg-muted/40 rounded-xl border border-border">
            <p className="text-xs font-semibold text-muted-foreground">Publication Claims</p>
            <p className="text-2xl font-extrabold text-primary mt-1">{researchData.pipeline.publicationClaims}</p>
          </div>
          <div className="p-4 bg-muted/40 rounded-xl border border-border">
            <p className="text-xs font-semibold text-muted-foreground">Patent Claims</p>
            <p className="text-2xl font-extrabold text-foreground mt-1">{researchData.pipeline.patentClaims}</p>
          </div>
          <div className="p-4 bg-muted/40 rounded-xl border border-border">
            <p className="text-xs font-semibold text-muted-foreground">Project Claims</p>
            <p className="text-2xl font-extrabold text-foreground mt-1">{researchData.pipeline.projectClaims}</p>
          </div>
          <div className="p-4 bg-muted/40 rounded-xl border border-border">
            <p className="text-xs font-semibold text-muted-foreground">Conference Claims</p>
            <p className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">{researchData.pipeline.conferenceClaims}</p>
          </div>
        </div>
      </Card>

      {/* RESEARCH VERIFICATION QUEUE */}
      <Card className="border border-border bg-card text-card-foreground rounded-2xl shadow-2xs">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-foreground">Research Verification Queue</CardTitle>
          <CardDescription className="text-xs text-muted-foreground">
            High-impact patent and publication claims requiring Research Dean verification
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {researchData.verificationQueue.map((item) => (
            <div key={item.id} className="p-4 bg-muted/40 rounded-2xl border border-border flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-[10px] font-semibold">
                    {item.category.replace(/_/g, " ")}
                  </Badge>
                  <span className="text-xs font-bold text-foreground">{item.facultyName}</span>
                  <span className="text-xs text-muted-foreground">({item.department})</span>
                </div>
                <h4 className="text-sm font-bold text-foreground">{item.title}</h4>
                <p className="text-xs text-muted-foreground">
                  Role: <strong className="text-foreground">{item.role || "Lead Investigator"}</strong> • Submitted: {new Date(item.submittedAt || item.createdAt).toLocaleDateString()}
                </p>
              </div>

              <div className="flex items-center gap-3 self-end md:self-center">
                <span className="text-lg font-extrabold font-mono text-primary">+{item.calculation.totalWWP} WWP</span>
                <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold rounded-xl">
                  Inspect & Verify Research
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
