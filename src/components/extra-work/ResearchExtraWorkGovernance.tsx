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
    <div className="space-y-6 text-slate-900 dark:text-white">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold tracking-wider text-blue-600 dark:text-blue-400 uppercase">
            <FlaskConical className="size-4" />
            <span>Research & Development Dean Portfolio</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight mt-1">
            Research Contribution Governance
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Audit Scopus/IEEE publications, Indian & International patent grants, funded research projects, and research grants
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-4 py-2 gap-2 rounded-xl shadow-xs">
            <PlusCircle className="size-4" />
            <span>Assign Research Task</span>
          </Button>
        </div>
      </div>

      {/* RESEARCH KPIS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="border border-blue-500/20 bg-blue-500/5 text-slate-900 dark:text-white rounded-2xl shadow-xs">
          <CardContent className="p-4">
            <p className="text-xs font-semibold text-blue-600 dark:text-blue-400">Research WWP This Year</p>
            <h3 className="text-2xl font-extrabold font-mono mt-1 text-blue-700 dark:text-blue-300">
              {researchData.researchWWPThisYear} <span className="text-xs font-normal">WWP</span>
            </h3>
            <p className="text-[11px] text-slate-500 mt-1">Verified Research Credits</p>
          </CardContent>
        </Card>

        <Card className="border border-amber-500/20 bg-amber-500/5 text-slate-900 dark:text-white rounded-2xl shadow-xs">
          <CardContent className="p-4">
            <p className="text-xs font-semibold text-amber-600 dark:text-amber-400">Pending Claims</p>
            <h3 className="text-2xl font-extrabold font-mono mt-1 text-amber-700 dark:text-amber-300">
              {researchData.pendingResearchVerification} <span className="text-xs font-normal">Items</span>
            </h3>
            <p className="text-[11px] text-slate-500 mt-1">Research Audit Queue</p>
          </CardContent>
        </Card>

        <Card className="border border-emerald-500/20 bg-emerald-500/5 text-slate-900 dark:text-white rounded-2xl shadow-xs">
          <CardContent className="p-4">
            <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">Publications</p>
            <h3 className="text-2xl font-extrabold font-mono mt-1 text-emerald-700 dark:text-emerald-300">
              {researchData.publicationsCount} <span className="text-xs font-normal">Scopus/WoS</span>
            </h3>
            <p className="text-[11px] text-slate-500 mt-1">Journals & Conferences</p>
          </CardContent>
        </Card>

        <Card className="border border-purple-500/20 bg-purple-500/5 text-slate-900 dark:text-white rounded-2xl shadow-xs">
          <CardContent className="p-4">
            <p className="text-xs font-semibold text-purple-600 dark:text-purple-400">Patents Granted</p>
            <h3 className="text-2xl font-extrabold font-mono mt-1 text-purple-700 dark:text-purple-300">
              {researchData.patentsCount} <span className="text-xs font-normal">Granted</span>
            </h3>
            <p className="text-[11px] text-slate-500 mt-1">Indian & International IP</p>
          </CardContent>
        </Card>

        <Card className="border border-indigo-500/20 bg-indigo-500/5 text-slate-900 dark:text-white rounded-2xl shadow-xs">
          <CardContent className="p-4">
            <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">Funded Projects</p>
            <h3 className="text-2xl font-extrabold font-mono mt-1 text-indigo-700 dark:text-indigo-300">
              {researchData.fundedProjectsCount} <span className="text-xs font-normal">Active</span>
            </h3>
            <p className="text-[11px] text-slate-500 mt-1">Govt & Industry Grants</p>
          </CardContent>
        </Card>
      </div>

      {/* RESEARCH PIPELINE BREAKDOWN */}
      <Card className="border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-white">Research Claims Pipeline</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
            <p className="text-xs font-semibold text-slate-500">Publication Claims</p>
            <p className="text-2xl font-extrabold text-blue-600 dark:text-blue-400 mt-1">{researchData.pipeline.publicationClaims}</p>
          </div>
          <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
            <p className="text-xs font-semibold text-slate-500">Patent Claims</p>
            <p className="text-2xl font-extrabold text-purple-600 dark:text-purple-400 mt-1">{researchData.pipeline.patentClaims}</p>
          </div>
          <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
            <p className="text-xs font-semibold text-slate-500">Project Claims</p>
            <p className="text-2xl font-extrabold text-indigo-600 dark:text-indigo-400 mt-1">{researchData.pipeline.projectClaims}</p>
          </div>
          <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
            <p className="text-xs font-semibold text-slate-500">Conference Claims</p>
            <p className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">{researchData.pipeline.conferenceClaims}</p>
          </div>
        </div>
      </Card>

      {/* RESEARCH VERIFICATION QUEUE */}
      <Card className="border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-2xl shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-slate-900 dark:text-white">Research Verification Queue</CardTitle>
          <CardDescription className="text-xs text-slate-500 dark:text-slate-400">
            High-impact patent and publication claims requiring Research Dean verification
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {researchData.verificationQueue.map((item) => (
            <div key={item.id} className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge className="bg-blue-600 text-white text-[10px] font-bold">
                    {item.category.replace("_", " ")}
                  </Badge>
                  <span className="text-xs font-bold text-slate-900 dark:text-white">{item.facultyName}</span>
                  <span className="text-xs text-slate-500">({item.department})</span>
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">{item.title}</h4>
                <p className="text-xs text-slate-500">
                  Role: <strong>{item.role || "Lead Investigator"}</strong> • Submitted: {new Date(item.submittedAt || item.createdAt).toLocaleDateString()}
                </p>
              </div>

              <div className="flex items-center gap-3 self-end md:self-center">
                <span className="text-lg font-extrabold font-mono text-blue-600 dark:text-blue-400">+{item.calculation.totalWWP} WWP</span>
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl">
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
