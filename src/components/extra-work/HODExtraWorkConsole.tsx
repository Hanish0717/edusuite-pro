import React, { useState } from "react";
import {
  Building2,
  UserCheck,
  CheckCircle2,
  XCircle,
  PlusCircle,
  Search,
  Clock,
  Briefcase,
  AlertCircle,
  Award,
  Layers,
  FileCheck,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ExtraWorkWalletService } from "@/services/extra-work-wallet-service";
import { ExtraWorkItem } from "@/types/extra-work-wallet";
import { useRole } from "@/context/role-context";

export function HODExtraWorkConsole() {
  const { department } = useRole();
  const deptCode = department || "CSE";
  const deptSummary = ExtraWorkWalletService.getDepartmentSummary(deptCode);
  const queue = ExtraWorkWalletService.getDepartmentVerificationQueue(deptCode);

  const [activeItem, setActiveItem] = useState<ExtraWorkItem | null>(null);
  const [reviewerNotes, setReviewerNotes] = useState("");

  const handleVerify = (action: "VERIFY" | "REJECT" | "REQUEST_CORRECTION") => {
    if (!activeItem) return;
    const res = ExtraWorkWalletService.verifyExtraWorkItem(
      activeItem.id,
      action,
      `HOD (${deptCode})`,
      "HOD",
      reviewerNotes
    );
    alert(res.message);
    setActiveItem(null);
    setReviewerNotes("");
  };

  return (
    <div className="space-y-6 text-slate-900 dark:text-white">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold tracking-wider text-purple-600 dark:text-purple-400 uppercase">
            <Building2 className="size-4" />
            <span>Department Governance • {deptCode}</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight mt-1">
            Department Extra Work Management
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Audit extra contribution claims, assign department duties, and publish volunteer roles for {deptSummary.departmentName}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button className="bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs px-4 py-2 gap-2 rounded-xl shadow-xs">
            <PlusCircle className="size-4" />
            <span>Assign Department Work</span>
          </Button>
          <Button variant="outline" className="border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 text-xs font-semibold rounded-xl gap-2">
            <Briefcase className="size-4" />
            <span>Publish Dept Opportunity</span>
          </Button>
        </div>
      </div>

      {/* DEPARTMENT KPIS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border border-purple-500/20 bg-purple-500/5 text-slate-900 dark:text-white rounded-2xl shadow-xs">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-purple-600 dark:text-purple-400">Department WWP This Month</p>
              <h3 className="text-3xl font-extrabold font-mono mt-1 text-purple-700 dark:text-purple-300">
                {deptSummary.totalDepartmentWWP} <span className="text-xs font-normal">WWP</span>
              </h3>
              <p className="text-[11px] text-slate-500 mt-1">Verified CSE Contribution</p>
            </div>
            <div className="p-3 bg-purple-600 text-white rounded-2xl shadow-xs">
              <Award className="size-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-amber-500/20 bg-amber-500/5 text-slate-900 dark:text-white rounded-2xl shadow-xs">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-amber-600 dark:text-amber-400">Pending Verification</p>
              <h3 className="text-3xl font-extrabold font-mono mt-1 text-amber-700 dark:text-amber-300">
                {deptSummary.pendingCount} <span className="text-xs font-normal">Claims</span>
              </h3>
              <p className="text-[11px] text-slate-500 mt-1">Requires HOD Sign-off</p>
            </div>
            <div className="p-3 bg-amber-500 text-white rounded-2xl shadow-xs">
              <Clock className="size-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-emerald-500/20 bg-emerald-500/5 text-slate-900 dark:text-white rounded-2xl shadow-xs">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">Active Extra Work</p>
              <h3 className="text-3xl font-extrabold font-mono mt-1 text-emerald-700 dark:text-emerald-300">
                {deptSummary.activeExtraWorkCount} <span className="text-xs font-normal">Tasks</span>
              </h3>
              <p className="text-[11px] text-slate-500 mt-1">Ongoing Dept Activities</p>
            </div>
            <div className="p-3 bg-emerald-600 text-white rounded-2xl shadow-xs">
              <Layers className="size-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-blue-500/20 bg-blue-500/5 text-slate-900 dark:text-white rounded-2xl shadow-xs">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-blue-600 dark:text-blue-400">Open Opportunities</p>
              <h3 className="text-3xl font-extrabold font-mono mt-1 text-blue-700 dark:text-blue-300">
                {deptSummary.openOpportunitiesCount} <span className="text-xs font-normal">Roles</span>
              </h3>
              <p className="text-[11px] text-slate-500 mt-1">Available for Faculty</p>
            </div>
            <div className="p-3 bg-blue-600 text-white rounded-2xl shadow-xs">
              <Briefcase className="size-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* DEPARTMENT VERIFICATION QUEUE */}
      <Card className="border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-2xl shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-bold text-slate-900 dark:text-white">Department Verification Queue</CardTitle>
              <CardDescription className="text-xs text-slate-500 dark:text-slate-400">
                {queue.length} claims submitted by {deptCode} department faculty awaiting review
              </CardDescription>
            </div>
            <Badge className="bg-amber-500 text-white font-bold text-xs rounded-full px-3 py-1">
              {queue.length} Pending
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {queue.map((item) => (
            <div key={item.id} className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 text-[10px] font-semibold">
                    {item.category.replace("_", " ")}
                  </Badge>
                  <span className="text-xs font-bold text-slate-900 dark:text-white">{item.facultyName}</span>
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">{item.title}</h4>
                <p className="text-xs text-slate-500">
                  Role: <strong>{item.role || "Contributor"}</strong> • Submitted: {new Date(item.submittedAt || item.createdAt).toLocaleDateString()}
                </p>
              </div>

              <div className="flex items-center gap-3 self-end md:self-center">
                <span className="text-lg font-extrabold font-mono text-amber-600 dark:text-amber-400">+{item.calculation.totalWWP} WWP</span>
                <Button
                  onClick={() => setActiveItem(item)}
                  size="sm"
                  className="bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold rounded-xl"
                >
                  Review Claim
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* FACULTY CONTRIBUTION TABLE */}
      <Card className="border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-2xl shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-slate-900 dark:text-white">Department Faculty Contribution Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 uppercase font-bold text-[10px]">
                <tr>
                  <th className="p-3">Faculty Member</th>
                  <th className="p-3">Verified WWP</th>
                  <th className="p-3">Pending Claims</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-900 dark:text-white">
                {deptSummary.facultyList.map((f, i) => (
                  <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="p-3 font-semibold">{f.facultyName}</td>
                    <td className="p-3 font-mono font-bold text-purple-600 dark:text-purple-400">+{f.verifiedWWP} WWP</td>
                    <td className="p-3 font-mono font-semibold text-amber-600 dark:text-amber-400">{f.pendingCount}</td>
                    <td className="p-3">
                      <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-[10px]">
                        Active Contributor
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
