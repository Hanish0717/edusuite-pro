import React, { useState } from "react";
import { toast } from "sonner";
import { ShieldCheck, CheckCircle2, XCircle, HelpCircle, UserCheck, Clock, Search, FileCheck2, Filter } from "lucide-react";
import { VerificationQueueItem } from "@/types/alumni";
import { PageHeader } from "@/components/alumni/shared/PageHeader";
import { StatCard } from "@/components/alumni/cards/StatCard";
import { GlassCard } from "@/components/alumni/cards/GlassCard";
import { SearchBar } from "@/components/alumni/shared/SearchBar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface AlumniVerificationQueueViewProps {
  queue: VerificationQueueItem[];
  onUpdateStatus: (id: string, newStatus: VerificationQueueItem["status"]) => void;
  onOpenMessagingCenter?: (() => void) | undefined;
}

export const AlumniVerificationQueueView: React.FC<AlumniVerificationQueueViewProps> = ({
  queue,
  onUpdateStatus,
  onOpenMessagingCenter,
}) => {
  const [activeTab, setActiveTab] = useState<"All" | "Pending Approval" | "Approved" | "Rejected" | "Info Requested">("Pending Approval");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredQueue = queue.filter((item) => {
    const matchesTab = activeTab === "All" || item.status === activeTab;
    const matchesSearch =
      item.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.rollNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.dept.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const handleAction = (item: VerificationQueueItem, action: "Approve" | "Reject" | "Request Info") => {
    if (action === "Approve") {
      onUpdateStatus(item.id, "Approved");
      toast.success(`Approved alumni registration for ${item.fullName}!`, {
        description: `Account activated. Welcome email sent to ${item.email}.`,
        icon: <UserCheck className="size-4 text-emerald-600" />,
      });
    } else if (action === "Reject") {
      onUpdateStatus(item.id, "Rejected");
      toast.error(`Rejected application for ${item.fullName}.`);
    } else {
      onUpdateStatus(item.id, "Info Requested");
      toast.info(`Requested additional graduation proof from ${item.fullName}.`);
    }
  };

  const pendingCount = queue.filter((q) => q.status === "Pending Approval").length;
  const verifiedCount = queue.filter((q) => q.studentRecordVerified).length;
  const approvedCount = queue.filter((q) => q.status === "Approved").length;
  const infoReqCount = queue.filter((q) => q.status === "Info Requested" || q.status === "Rejected").length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Alumni Registration Verification Queue"
        subtitle="Review pending graduate applications, verify institutional registrar student records, and approve verified alumni access."
        badgeText="Registrar Verification Portal"
        icon={ShieldCheck}
        onOpenMessagingCenter={onOpenMessagingCenter}
      />

      {/* SUB-DASHBOARD STATISTICS CARDS */}
      <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Pending Review" value={pendingCount.toString()} change="Requires Coordinator Review" icon={Clock} />
        <StatCard title="Student Record Verified" value={verifiedCount.toString()} change="Roll No Matched" icon={CheckCircle2} />
        <StatCard title="Approved Alumni" value={approvedCount.toString()} change="Active Accounts" icon={UserCheck} />
        <StatCard title="Action Required" value={infoReqCount.toString()} change="Info / Rejected" icon={FileCheck2} />
      </div>

      {/* SEARCH & FILTER TABS */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search application by applicant name, roll number, or company..."
        />

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 font-mono text-xs">
          {(["Pending Approval", "All", "Approved", "Info Requested", "Rejected"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`p-2 px-3 rounded-xl border font-bold cursor-pointer transition-all whitespace-nowrap ${
                activeTab === tab
                  ? "bg-[#2563EB] text-white border-[#2563EB]"
                  : "bg-card border-border hover:border-primary/50 text-muted-foreground"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* QUEUE ITEMS LIST */}
      {filteredQueue.length === 0 ? (
        <GlassCard className="p-8 text-center space-y-2 font-mono text-xs text-muted-foreground">
          <CheckCircle2 className="size-10 text-emerald-500 mx-auto" />
          <p className="font-bold text-foreground text-sm font-sans">No Verification Queue Applications</p>
          <p>There are no applications matching your current filter selection.</p>
        </GlassCard>
      ) : (
        <div className="space-y-4">
          {filteredQueue.map((item) => (
            <GlassCard key={item.id} className="p-5 space-y-4 border border-[#24356B]/30 font-sans">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <h3 className="font-extrabold text-base text-foreground truncate">{item.fullName}</h3>
                    <Badge
                      variant="outline"
                      className={`text-[0.65rem] font-mono ${
                        item.status === "Approved"
                          ? "bg-emerald-500/10 text-emerald-600 border-emerald-300"
                          : item.status === "Rejected"
                          ? "bg-rose-500/10 text-rose-600 border-rose-300"
                          : item.status === "Info Requested"
                          ? "bg-blue-500/10 text-blue-600 border-blue-300"
                          : "bg-amber-500/10 text-amber-600 border-amber-300"
                      }`}
                    >
                      {item.status}
                    </Badge>
                  </div>

                  <p className="text-primary font-bold font-mono text-xs">
                    {item.designation} @ {item.company}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground font-mono pt-1">
                    <span>🆔 Roll No: <strong>{item.rollNumber}</strong></span>
                    <span>🎓 Batch of {item.graduationYear} ({item.dept})</span>
                    <span>📧 {item.email}</span>
                    <span>📞 {item.phone}</span>
                  </div>
                </div>

                {/* VERIFICATION BADGE & ACTIONS */}
                <div className="flex flex-col items-start md:items-end gap-2 shrink-0">
                  <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl font-mono text-[0.68rem] text-emerald-600 font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="size-4" /> Registrar Student Record Verified
                  </div>

                  <span className="text-[0.65rem] font-mono text-muted-foreground">
                    Submitted: {item.submittedDate} • Invited By: <strong>{item.invitedBy || "Direct"}</strong>
                  </span>
                </div>
              </div>

              {/* ACTION BUTTONS BAR */}
              {item.status === "Pending Approval" && (
                <div className="pt-3 border-t border-border/60 flex flex-wrap items-center justify-between gap-3">
                  <span className="text-xs text-muted-foreground font-mono">
                    Action required by Alumni Coordinator:
                  </span>

                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleAction(item, "Approve")}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-9 text-xs rounded-xl cursor-pointer gap-1.5 shadow-2xs"
                    >
                      <CheckCircle2 className="size-4" /> Approve Alumni Account
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleAction(item, "Request Info")}
                      className="h-9 text-xs rounded-xl cursor-pointer gap-1.5"
                    >
                      <HelpCircle className="size-4" /> Request Proof
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleAction(item, "Reject")}
                      className="h-9 text-xs text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl cursor-pointer gap-1.5"
                    >
                      <XCircle className="size-4" /> Reject Application
                    </Button>
                  </div>
                </div>
              )}
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
};
