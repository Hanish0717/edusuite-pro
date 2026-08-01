import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import {
  ShieldAlert,
  MessageSquare,
  Clock,
  CheckCircle2,
  Plus,
  Search,
} from "lucide-react";

import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { Panel } from "@/components/dashboard/panel";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRole } from "@/context/role-context";

export const Route = createFileRoute("/grievance")({
  head: () => ({
    meta: [{ title: "Grievance Redressal — EduSuite Pro" }],
  }),
  component: GrievancePage,
});

const initialTickets = [
  {
    id: "GRV-2026-081",
    category: "Academic / Internal Evaluation",
    subject: "Revaluation Request delay for Mathematics III",
    raisedBy: "Student (Roll 22CS089)",
    date: "2026-07-28",
    committee: "Academic Appeals Committee",
    status: "Under Review",
    sla: "48 Hours",
  },
  {
    id: "GRV-2026-082",
    category: "Hostel & Facilities",
    subject: "Wi-Fi connectivity issues in Block B 3rd Floor",
    raisedBy: "Student (Anonymous)",
    date: "2026-07-30",
    committee: "Hostel Oversight Committee",
    status: "Resolved",
    sla: "Closed",
  },
  {
    id: "GRV-2026-083",
    category: "Disciplinary / Anti-Ragging",
    subject: "Lab equipment damage incident report",
    raisedBy: "Faculty (CSE Lab Incharge)",
    date: "2026-07-31",
    committee: "Disciplinary Committee",
    status: "Committee Assigned",
    sla: "24 Hours",
  },
];

export function GrievancePage() {
  const { hasFlag, role } = useRole();
  const [tickets, setTickets] = useState(initialTickets);
  const [search, setSearch] = useState("");

  const isCommitteeMember =
    role === "super-admin" ||
    hasFlag("isDisciplinaryCommittee") ||
    hasFlag("isHod");

  const filteredTickets = tickets.filter(
    (t) =>
      t.subject.toLowerCase().includes(search.toLowerCase()) ||
      t.category.toLowerCase().includes(search.toLowerCase()) ||
      t.id.toLowerCase().includes(search.toLowerCase()),
  );

  const handleResolve = (id: string) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: "Resolved", sla: "Closed" } : t)),
    );
    toast.success(`Grievance ticket ${id} marked as Resolved!`);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-5">
          <div className="flex items-center gap-3">
            <span className="grid size-12 place-items-center rounded-2xl bg-brand-gradient text-white shadow-glow">
              <ShieldAlert className="size-6" />
            </span>
            <div>
              <h1 className="font-display text-xl font-extrabold sm:text-2xl">
                Grievance Redressal Module
              </h1>
              <p className="text-sm text-muted-foreground">
                Anonymous and identified ticketing, Grievance Committee assignment, and SLA tracking.
              </p>
            </div>
          </div>
          <Badge className="bg-brand-gradient text-white font-mono">
            {isCommitteeMember ? "Grievance Committee Member" : "User Portal"}
          </Badge>
        </header>

        {/* KPIS */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <KpiCard label="Total Tickets (FY26)" value="142" icon={MessageSquare} />
          <KpiCard label="Resolved SLA Rate" value="96.2%" icon={CheckCircle2} tone="success" />
          <KpiCard label="Pending Committee Review" value="5" icon={Clock} tone="warning" />
          <KpiCard label="Avg Resolution Time" value="34 Hours" icon={ShieldAlert} tone="info" />
        </div>

        <Tabs defaultValue="tickets" className="space-y-6">
          <TabsList className="bg-background/50 border border-border p-1">
            <TabsTrigger value="tickets">Grievance Tickets</TabsTrigger>
            <TabsTrigger value="committee">Disciplinary Committee</TabsTrigger>
            <TabsTrigger value="antiragging">Anti-Ragging Squad</TabsTrigger>
          </TabsList>

          <TabsContent value="tickets">
            <Panel
              title="Submitted Grievances"
              description="Students and staff can submit grievances. Disciplinary Committee members process cases with strict audit trails."
              action={
                <Button className="bg-brand-gradient shadow-glow gap-1.5 cursor-pointer">
                  <Plus className="size-4" /> Raise New Grievance
                </Button>
              }
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="relative w-full sm:max-w-xs">
                  <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search ticket subject or ID..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-8 h-9"
                  />
                </div>
              </div>

              <div className="overflow-x-auto border border-border rounded-xl">
                <Table>
                  <TableHeader className="bg-muted/40">
                    <TableRow>
                      <TableHead>Ticket ID</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead>Raised By</TableHead>
                      <TableHead>Assigned Committee</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTickets.map((t) => (
                      <TableRow key={t.id}>
                        <TableCell className="font-mono text-xs font-semibold">{t.id}</TableCell>
                        <TableCell className="text-xs text-muted-foreground">{t.category}</TableCell>
                        <TableCell className="font-semibold text-sm">{t.subject}</TableCell>
                        <TableCell className="text-xs">{t.raisedBy}</TableCell>
                        <TableCell className="text-xs font-mono">{t.committee}</TableCell>
                        <TableCell>
                          <Badge
                            className={
                              t.status === "Resolved"
                                ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                                : "bg-amber-500/10 text-amber-600 border-amber-500/20"
                            }
                          >
                            {t.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          {t.status !== "Resolved" && isCommitteeMember ? (
                            <Button
                              size="sm"
                              onClick={() => handleResolve(t.id)}
                              className="h-8 bg-brand-gradient text-xs cursor-pointer"
                            >
                              Resolve Ticket
                            </Button>
                          ) : (
                            <span className="text-xs text-muted-foreground font-mono">
                              {t.status}
                            </span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Panel>
          </TabsContent>

          <TabsContent value="committee">
            <Panel title="Disciplinary Committee Members" description="Appointed faculty and staff members handling escalated hearings.">
              <p className="text-sm text-muted-foreground">
                All hearing minutes and resolution reports are locked with digital signatures.
              </p>
            </Panel>
          </TabsContent>

          <TabsContent value="antiragging">
            <Panel title="Anti-Ragging Squad & Portal" description="24x7 emergency helpline logs and campus monitoring squad assignments.">
              <p className="text-sm text-muted-foreground">
                Compliant with UGC & AICTE Anti-Ragging Directives.
              </p>
            </Panel>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
