import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import {
  GraduationCap,
  FileText,
  UserCheck,
  CheckCircle2,
  Clock,
  Plus,
  Search,
  Filter,
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
import { hasPermission } from "@/lib/permissions";

export const Route = createFileRoute("/admission")({
  head: () => ({
    meta: [{ title: "Admission Management — EduSuite Pro" }],
  }),
  component: AdmissionPage,
});

const initialApplications = [
  {
    id: "APP-2026-001",
    name: "Rohan Verma",
    email: "rohan.v@gmail.com",
    course: "B.Tech Computer Science (CSE)",
    meritScore: "96.4%",
    status: "Verified",
    dateSubmitted: "2026-07-28",
    documents: "All 5 Verified",
  },
  {
    id: "APP-2026-002",
    name: "Priya Sundaram",
    email: "priya.s@outlook.com",
    course: "B.Tech Electronics (ECE)",
    meritScore: "94.8%",
    status: "Under Review",
    dateSubmitted: "2026-07-29",
    documents: "Pending Migration Cert.",
  },
  {
    id: "APP-2026-003",
    name: "Anish Kulkarni",
    email: "akulkarni@yahoo.com",
    course: "B.Tech Mechanical (ME)",
    meritScore: "88.2%",
    status: "Admitted",
    dateSubmitted: "2026-07-25",
    documents: "All Verified & Fees Paid",
  },
  {
    id: "APP-2026-004",
    name: "Sneha Reddy",
    email: "snehareddy@gmail.com",
    course: "MBA (Data Analytics)",
    meritScore: "91.0%",
    status: "Seat Allotted",
    dateSubmitted: "2026-07-30",
    documents: "Verified",
  },
];

export function AdmissionPage() {
  const { role, flags, department, externalPersona, featureFlags } = useRole();
  const [applications, setApplications] = useState(initialApplications);
  const [search, setSearch] = useState("");

  const perm = hasPermission(
    { role, flags, department, externalPersona, featureFlags },
    "admission",
    "read",
  );

  const canApprove = hasPermission(
    { role, flags, department, externalPersona, featureFlags },
    "admission",
    "approve",
  ).allowed;

  const handleApproveApp = (id: string) => {
    setApplications((prev) =>
      prev.map((app) =>
        app.id === id ? { ...app, status: "Admitted" } : app,
      ),
    );
    toast.success(`Application ${id} approved for enrolment!`);
  };

  const filteredApps = applications.filter(
    (app) =>
      app.name.toLowerCase().includes(search.toLowerCase()) ||
      app.id.toLowerCase().includes(search.toLowerCase()) ||
      app.course.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-5">
          <div className="flex items-center gap-3">
            <span className="grid size-12 place-items-center rounded-2xl bg-brand-gradient text-white shadow-glow">
              <GraduationCap className="size-6" />
            </span>
            <div>
              <h1 className="font-display text-xl font-extrabold sm:text-2xl">
                Admission Management Module
              </h1>
              <p className="text-sm text-muted-foreground">
                Enquiry, application verification, merit lists, seat allotment, and admission officer approvals.
              </p>
            </div>
          </div>
          <Badge className="bg-primary/10 text-primary w-fit font-mono">
            Scope: {perm.scope.toUpperCase()}
          </Badge>
        </header>

        {/* KPI CARDS */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <KpiCard label="Total Applications" value="1,420" icon={FileText} delta="+14% YoY" />
          <KpiCard label="Seats Allotted" value="480 / 600" icon={UserCheck} tone="success" />
          <KpiCard label="Pending Verifications" value="68" icon={Clock} tone="warning" />
          <KpiCard label="Fee Collections" value="Rs 3.84 Cr" icon={CheckCircle2} tone="info" />
        </div>

        {/* APPLICATIONS TAB & LIST */}
        <Tabs defaultValue="applications" className="space-y-6">
          <TabsList className="bg-background/50 border border-border p-1">
            <TabsTrigger value="applications">Applications & Enrolment</TabsTrigger>
            <TabsTrigger value="merit">Merit & Counseling List</TabsTrigger>
            <TabsTrigger value="documents">Document Verification</TabsTrigger>
          </TabsList>

          <TabsContent value="applications">
            <Panel
              title="Submitted Applications"
              description="Manage student applications. Staff with 'isAdmissionOfficer' flag or Super Admin can approve enrolments."
              action={
                <Button className="bg-brand-gradient shadow-glow gap-1.5 cursor-pointer">
                  <Plus className="size-4" /> New Applicant
                </Button>
              }
            >
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-4">
                <div className="relative w-full sm:max-w-xs">
                  <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search applicant name or ID..."
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
                      <TableHead>App ID</TableHead>
                      <TableHead>Applicant Name</TableHead>
                      <TableHead>Target Course</TableHead>
                      <TableHead>Merit Score</TableHead>
                      <TableHead>Documents</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredApps.map((app) => (
                      <TableRow key={app.id}>
                        <TableCell className="font-mono text-xs font-semibold">{app.id}</TableCell>
                        <TableCell>
                          <div>
                            <p className="font-semibold text-sm">{app.name}</p>
                            <p className="text-xs text-muted-foreground">{app.email}</p>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm">{app.course}</TableCell>
                        <TableCell className="font-bold text-sm">{app.meritScore}</TableCell>
                        <TableCell className="text-xs text-muted-foreground">{app.documents}</TableCell>
                        <TableCell>
                          <Badge
                            className={
                              app.status === "Admitted"
                                ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                                : app.status === "Verified"
                                ? "bg-blue-500/10 text-blue-600 border-blue-500/20"
                                : "bg-amber-500/10 text-amber-600 border-amber-500/20"
                            }
                          >
                            {app.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          {app.status !== "Admitted" && canApprove ? (
                            <Button
                              size="sm"
                              onClick={() => handleApproveApp(app.id)}
                              className="h-8 bg-brand-gradient text-xs cursor-pointer"
                            >
                              Approve Seat
                            </Button>
                          ) : (
                            <span className="text-xs text-muted-foreground font-mono">
                              {app.status === "Admitted" ? "Enrolled" : "View Only"}
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

          <TabsContent value="merit">
            <Panel title="Cut-off & Merit Rankings" description="Rankings based on qualifying board marks & entrance exam percentile.">
              <p className="text-sm text-muted-foreground">
                Cutoff thresholds for CS (CSE): General - 92.5%, ECE - 88.0%, ME - 82.5%.
              </p>
            </Panel>
          </TabsContent>

          <TabsContent value="documents">
            <Panel title="Verification Status" description="Audit of 10th/12th marks, transfer certificates, and category verifications.">
              <p className="text-sm text-muted-foreground">
                Digital locker integration enabled for DigiLocker certificates.
              </p>
            </Panel>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
