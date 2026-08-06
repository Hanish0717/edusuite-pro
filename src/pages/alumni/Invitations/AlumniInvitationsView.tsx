import React, { useState } from "react";
import { toast } from "sonner";
import { Mail, UserPlus, Clock, CheckCircle2, XCircle, Send, Search } from "lucide-react";
import { InvitationItem } from "@/types/alumni";
import { PageHeader } from "@/components/alumni/shared/PageHeader";
import { StatCard } from "@/components/alumni/cards/StatCard";
import { GlassCard } from "@/components/alumni/cards/GlassCard";
import { SearchBar } from "@/components/alumni/shared/SearchBar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface AlumniInvitationsViewProps {
  invitationsList: InvitationItem[];
  onOpenInviteModal: () => void;
}

export const AlumniInvitationsView: React.FC<AlumniInvitationsViewProps> = ({
  invitationsList,
  onOpenInviteModal,
}) => {
  const [activeTab, setActiveTab] = useState<"All" | "Pending" | "Accepted" | "Expired" | "Rejected">("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredInvitations = invitationsList.filter((inv) => {
    const matchesTab = activeTab === "All" || inv.status === activeTab;
    const matchesSearch =
      inv.recipientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.recipientEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.dept.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const handleResendInvitation = (inv: InvitationItem) => {
    toast.success(`Resent invitation email to ${inv.recipientEmail}!`, {
      description: "Invitation link valid for 7 days.",
    });
  };

  const pendingCount = invitationsList.filter((i) => i.status === "Pending").length;
  const acceptedCount = invitationsList.filter((i) => i.status === "Accepted").length;
  const expiredCount = invitationsList.filter((i) => i.status === "Expired").length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Batchmate Invitation Management"
        subtitle="Track invitation emails dispatched to batchmates, review verification progress, and resend invitation links."
        badgeText="Alumni Verification Portal"
        icon={Mail}
        actions={
          <Button
            onClick={onOpenInviteModal}
            className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-xs rounded-xl h-9 px-3.5 cursor-pointer shadow-md gap-1.5"
          >
            <UserPlus className="size-3.5" /> Invite Batchmate
          </Button>
        }
      />

      {/* STATISTICS CARDS */}
      <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Dispatched" value={invitationsList.length.toString()} change="All Invitations" icon={Mail} />
        <StatCard title="Pending Verification" value={pendingCount.toString()} change="Awaiting Signup" icon={Clock} />
        <StatCard title="Accepted & Joined" value={acceptedCount.toString()} change="Verified Members" icon={CheckCircle2} />
        <StatCard title="Expired Invites" value={expiredCount.toString()} change="Requires Resend" icon={XCircle} />
      </div>

      {/* FILTER PILLS & SEARCH */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search invitations by recipient name or email..."
        />

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 font-mono text-xs">
          {(["All", "Pending", "Accepted", "Expired", "Rejected"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={`p-2 px-3 rounded-xl border font-bold cursor-pointer transition-all ${
                activeTab === t
                  ? "bg-[#2563EB] text-white border-[#2563EB]"
                  : "bg-card border-border hover:border-primary/50 text-muted-foreground"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* INVITATION CARDS GRID */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredInvitations.map((inv) => (
          <GlassCard key={inv.id} className="p-5 space-y-3 flex flex-col justify-between border border-[#24356B]/30">
            <div className="space-y-2 font-mono text-xs">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="font-extrabold text-base text-foreground font-sans truncate">{inv.recipientName}</h4>
                  <span className="text-[#2563EB] font-bold text-[0.72rem] block">{inv.recipientEmail}</span>
                </div>

                <Badge
                  variant="outline"
                  className={`text-[0.62rem] ${
                    inv.status === "Accepted"
                      ? "bg-emerald-500/10 text-emerald-600 border-emerald-300"
                      : inv.status === "Pending"
                      ? "bg-amber-500/10 text-amber-600 border-amber-300"
                      : "bg-rose-500/10 text-rose-600 border-rose-300"
                  }`}
                >
                  {inv.status}
                </Badge>
              </div>

              <div className="p-3 bg-muted/40 rounded-xl space-y-1 text-[0.68rem]">
                <p>🎓 {inv.batch} • {inv.dept}</p>
                <p>👤 Invited By: <strong>{inv.invitedBy}</strong></p>
                <p>📅 Dispatched: {inv.invitedDate}</p>
              </div>
            </div>

            {inv.status === "Pending" && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleResendInvitation(inv)}
                className="w-full h-8 text-[0.7rem] rounded-xl font-bold cursor-pointer gap-1.5 mt-2"
              >
                <Send className="size-3" /> Resend Invitation Link
              </Button>
            )}
          </GlassCard>
        ))}
      </div>
    </div>
  );
};
