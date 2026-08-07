import fs from 'fs';
import path from 'path';

const routesDir = path.join(process.cwd(), 'src/routes');

function makeRoute(filename, routePath, pageTitle, description) {
  const code = `import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, ShieldCheck, CheckCircle2, Building2, Users } from "lucide-react";
import { Panel } from "@/components/dashboard/panel";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { getStudentDeanDashboardData } from "@/lib/deansService";

export const Route = createFileRoute("${routePath}")({
  head: () => ({
    meta: [{ title: "${pageTitle} — Student Dean" }],
  }),
  component: PageComponent,
});

function PageComponent() {
  const data = useMemo(() => getStudentDeanDashboardData(), []);
  const [search, setSearch] = useState("");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">${pageTitle}</h1>
        <p className="text-sm text-muted-foreground">${description}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Module Records" value="Verified" icon={Building2} tone="info" />
        <KpiCard label="Compliance Status" value="100% Valid" icon={ShieldCheck} tone="success" />
        <KpiCard label="Active Audit" value="2026-27" icon={CheckCircle2} tone="purple" />
        <KpiCard label="Status" value="Active" icon={Users} tone="warning" />
      </div>

      <Panel title="${pageTitle} Register" description="Real-time management ledger.">
        <div className="space-y-4">
          <div className="relative max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search directory..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-9 text-xs"
            />
          </div>

          <div className="p-4 border border-border rounded-xl bg-card space-y-3">
            <h4 className="font-bold text-sm text-foreground">Verified Module Register</h4>
            <p className="text-xs text-muted-foreground">All records for this module are active and synchronized with the ERP backend.</p>
            <div className="flex gap-2 font-mono text-xs">
              <Badge className="bg-emerald-500/10 text-emerald-600">Active Status</Badge>
              <Badge variant="outline">ERP Synchronized</Badge>
            </div>
          </div>
        </div>
      </Panel>
    </div>
  );
}
`;

  fs.writeFileSync(path.join(routesDir, filename), code, 'utf8');
  console.log(`Created ${filename}`);
}

makeRoute("staff.student-dean.student-activities.tsx", "/staff/student-dean/student-activities", "Student Activities", "Extracurricular, sports, and cultural activity tracking.");
makeRoute("staff.student-dean.mentoring.tsx", "/staff/student-dean/mentoring", "Faculty-Student Mentoring", "Mentoring allocations, progress tracking, and advice logs.");
makeRoute("staff.student-dean.student-requests.tsx", "/staff/student-dean/student-requests", "Student Requests & Approvals", "Bonafide, NOC, and fee concession request processing.");
makeRoute("staff.student-dean.certificates.tsx", "/staff/student-dean/certificates", "Student Certificates & Attestations", "Issuance of conduct, merit, and participation certificates.");
makeRoute("staff.student-dean.attendance-reports.tsx", "/staff/student-dean/attendance-reports", "Student Attendance Reports", "Monthly attendance trend dossiers and shortage listings.");
makeRoute("staff.student-dean.scholarship-reports.tsx", "/staff/student-dean/scholarship-reports", "Scholarship Disbursement Reports", "Annual merit and government scholarship disbursement ledgers.");

console.log("All new student dean routes created");
