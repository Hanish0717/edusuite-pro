import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import {
  Globe,
  Users,
  Award,
  Heart,
  Search,
  Plus,
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

export const Route = createFileRoute("/alumni")({
  head: () => ({
    meta: [{ title: "Alumni Network & Cell — EduSuite Pro" }],
  }),
  component: AlumniPage,
});

const initialAlumni = [
  {
    id: "ALM-2022-014",
    name: "Sarah Jenkins",
    batch: "Batch of 2022",
    dept: "Computer Science",
    company: "Google Cloud",
    designation: "Senior Staff Engineer",
    location: "Mountain View, CA",
    mentoring: "Active Mentor",
  },
  {
    id: "ALM-2020-089",
    name: "Vikram Malhotra",
    batch: "Batch of 2020",
    dept: "Electronics (ECE)",
    company: "Qualcomm India",
    designation: "Lead Systems Architect",
    location: "Bengaluru, India",
    mentoring: "Active Mentor",
  },
  {
    id: "ALM-2018-102",
    name: "Deepa Krishnan",
    batch: "Batch of 2018",
    dept: "Mechanical (ME)",
    company: "Tesla Motors",
    designation: "Product Design Manager",
    location: "Austin, TX",
    mentoring: "Guest Speaker",
  },
  {
    id: "ALM-2021-045",
    name: "Karthik Subramanian",
    batch: "Batch of 2021",
    dept: "Computer Science",
    company: "Microsoft",
    designation: "Software Engineer II",
    location: "Hyderabad, India",
    mentoring: "Active Mentor",
  },
];

export function AlumniPage() {
  const { hasFlag, role } = useRole();
  const [alumni, setAlumni] = useState(initialAlumni);
  const [search, setSearch] = useState("");

  const isCellCoordinator =
    role === "super-admin" ||
    hasFlag("isTrainingCoordinator") ||
    hasFlag("isPlacementOfficer");

  const filteredAlumni = alumni.filter(
    (a) =>
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.company.toLowerCase().includes(search.toLowerCase()) ||
      a.batch.toLowerCase().includes(search.toLowerCase()) ||
      a.dept.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-5">
          <div className="flex items-center gap-3">
            <span className="grid size-12 place-items-center rounded-2xl bg-brand-gradient text-white shadow-glow">
              <Globe className="size-6" />
            </span>
            <div>
              <h1 className="font-display text-xl font-extrabold sm:text-2xl">
                Alumni Network & Cell Module
              </h1>
              <p className="text-sm text-muted-foreground">
                Alumni directory, batch reunions, student mentoring programs, and alumni cell management.
              </p>
            </div>
          </div>
          <Badge className="bg-brand-gradient text-white font-mono">
            {isCellCoordinator ? "Alumni Cell Coordinator" : "Alumni Network Portal"}
          </Badge>
        </header>

        {/* KPIS */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <KpiCard label="Registered Alumni" value="12,450" icon={Users} />
          <KpiCard label="Active Student Mentors" value="480" icon={Award} tone="success" />
          <KpiCard label="Global Chapters" value="18 Cities" icon={Globe} tone="info" />
          <KpiCard label="Alumni Endowment Fund" value="Rs 1.85 Cr" icon={Heart} tone="warning" />
        </div>

        <Tabs defaultValue="directory" className="space-y-6">
          <TabsList className="bg-background/50 border border-border p-1">
            <TabsTrigger value="directory">Alumni Directory</TabsTrigger>
            <TabsTrigger value="mentorship">Mentorship Portal</TabsTrigger>
            <TabsTrigger value="events">Reunions & Meetups</TabsTrigger>
          </TabsList>

          <TabsContent value="directory">
            <Panel
              title="Global Alumni Network"
              description="Explore alumni records by batch, department, company, or geographical location."
              action={
                isCellCoordinator ? (
                  <Button className="bg-brand-gradient shadow-glow gap-1.5 cursor-pointer">
                    <Plus className="size-4" /> Add Alumni Record
                  </Button>
                ) : undefined
              }
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="relative w-full sm:max-w-xs">
                  <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search name, company, or batch..."
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
                      <TableHead>Alumni ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Batch</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Current Company</TableHead>
                      <TableHead>Designation</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Role</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAlumni.map((a) => (
                      <TableRow key={a.id}>
                        <TableCell className="font-mono text-xs font-semibold">{a.id}</TableCell>
                        <TableCell className="font-semibold text-sm">{a.name}</TableCell>
                        <TableCell className="text-xs font-mono">{a.batch}</TableCell>
                        <TableCell className="text-xs">{a.dept}</TableCell>
                        <TableCell className="font-semibold text-sm text-primary">{a.company}</TableCell>
                        <TableCell className="text-xs">{a.designation}</TableCell>
                        <TableCell className="text-xs text-muted-foreground">{a.location}</TableCell>
                        <TableCell>
                          <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[0.65rem]">
                            {a.mentoring}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Panel>
          </TabsContent>

          <TabsContent value="mentorship">
            <Panel title="Alumni-Student Mentorship Matching" description="Students connect with alumni for career guidance, mock interviews, and referral requests.">
              <p className="text-sm text-muted-foreground">
                Over 120 mock interviews scheduled this month.
              </p>
            </Panel>
          </TabsContent>

          <TabsContent value="events">
            <Panel title="Annual Global Reunions & Chapters" description="Upcoming alumni meetups in Bengaluru, Hyderabad, San Francisco, and London.">
              <p className="text-sm text-muted-foreground">
                Next Event: Annual Grand Alumni Meet 2026 — Dec 18, Main Campus Auditorium.
              </p>
            </Panel>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
