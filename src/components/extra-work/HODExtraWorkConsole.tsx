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
    <div className="space-y-6 text-slate-900 dark:text-slate-100">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
            <Building2 className="size-4 text-primary" />
            <span>Department Governance • {deptCode}</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-foreground mt-1">
            Department Extra Work Management
          </h1>
          <p className="text-xs md:text-sm text-muted-foreground mt-0.5">
            Audit extra contribution claims, assign department duties, and publish volunteer roles for {deptSummary.departmentName}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs px-4 py-2 gap-2 rounded-xl shadow-2xs">
            <PlusCircle className="size-4" />
            <span>Assign Department Work</span>
          </Button>
          <Button variant="outline" className="text-xs font-semibold rounded-xl gap-2 border-border shadow-2xs">
            <Briefcase className="size-4" />
            <span>Publish Dept Opportunity</span>
          </Button>
        </div>
      </div>

      {/* DEPARTMENT KPIS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border border-border bg-card text-card-foreground rounded-2xl shadow-2xs">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-muted-foreground">Department WWP This Month</p>
              <h3 className="text-3xl font-extrabold font-mono mt-1 text-foreground">
                {deptSummary.totalDepartmentWWP} <span className="text-xs font-normal text-muted-foreground">WWP</span>
              </h3>
              <p className="text-[11px] text-muted-foreground mt-1">Verified CSE Contribution</p>
            </div>
            <div className="p-3 bg-primary/10 text-primary rounded-2xl">
              <Award className="size-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border bg-card text-card-foreground rounded-2xl shadow-2xs">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-muted-foreground">Pending Verification</p>
              <h3 className="text-3xl font-extrabold font-mono mt-1 text-amber-600 dark:text-amber-400">
                {deptSummary.pendingCount} <span className="text-xs font-normal text-muted-foreground">Claims</span>
              </h3>
              <p className="text-[11px] text-muted-foreground mt-1">Requires HOD Sign-off</p>
            </div>
            <div className="p-3 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-2xl">
              <Clock className="size-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border bg-card text-card-foreground rounded-2xl shadow-2xs">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-muted-foreground">Active Extra Work</p>
              <h3 className="text-3xl font-extrabold font-mono mt-1 text-emerald-600 dark:text-emerald-400">
                {deptSummary.activeExtraWorkCount} <span className="text-xs font-normal text-muted-foreground">Tasks</span>
              </h3>
              <p className="text-[11px] text-muted-foreground mt-1">Ongoing Dept Activities</p>
            </div>
            <div className="p-3 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-2xl">
              <Layers className="size-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border bg-card text-card-foreground rounded-2xl shadow-2xs">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-muted-foreground">Open Opportunities</p>
              <h3 className="text-3xl font-extrabold font-mono mt-1 text-foreground">
                {deptSummary.openOpportunitiesCount} <span className="text-xs font-normal text-muted-foreground">Roles</span>
              </h3>
              <p className="text-[11px] text-muted-foreground mt-1">Available for Faculty</p>
            </div>
            <div className="p-3 bg-primary/10 text-primary rounded-2xl">
              <Briefcase className="size-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* DEPARTMENT VERIFICATION QUEUE */}
      <Card className="border border-border bg-card text-card-foreground rounded-2xl shadow-2xs">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-bold text-foreground">Department Verification Queue</CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
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
            <div key={item.id} className="p-4 bg-muted/40 rounded-2xl border border-border flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-[10px] font-semibold">
                    {item.category.replace(/_/g, " ")}
                  </Badge>
                  <span className="text-xs font-bold text-foreground">{item.facultyName}</span>
                </div>
                <h4 className="text-sm font-bold text-foreground">{item.title}</h4>
                <p className="text-xs text-muted-foreground">
                  Role: <strong className="text-foreground">{item.role || "Contributor"}</strong> • Submitted: {new Date(item.submittedAt || item.createdAt).toLocaleDateString()}
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
      <Card className="border border-border bg-card text-card-foreground rounded-2xl shadow-2xs">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-foreground">Department Faculty Contribution Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-muted/50 text-muted-foreground uppercase font-bold text-[10px] border-b border-border">
                <tr>
                  <th className="p-3">Faculty Member</th>
                  <th className="p-3">Verified WWP</th>
                  <th className="p-3">Pending Claims</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-foreground">
                {deptSummary.facultyList.map((f, i) => (
                  <tr key={i} className="hover:bg-muted/30 transition-colors">
                    <td className="p-3 font-semibold text-foreground">{f.facultyName}</td>
                    <td className="p-3 font-mono font-bold text-primary">+{f.verifiedWWP} WWP</td>
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
