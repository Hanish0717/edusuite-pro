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
  UserPlus,
  Briefcase,
  MapPin,
  GraduationCap,
} from "lucide-react";

import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { Panel } from "@/components/dashboard/panel";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
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

  // Modal State for Add Alumni Record
  const [isAddAlumniOpen, setIsAddAlumniOpen] = useState(false);
  const [newAlumniForm, setNewAlumniForm] = useState({
    name: "",
    batch: "Batch of 2023",
    dept: "Computer Science",
    company: "",
    designation: "",
    location: "",
    mentoring: "Active Mentor",
  });

  const isCellCoordinator =
    (role as any) === "super-admin" || (role as any) === "super_admin" ||
    hasFlag("isTrainingCoordinator") ||
    hasFlag("isPlacementOfficer");

  const filteredAlumni = alumni.filter(
    (a) =>
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.company.toLowerCase().includes(search.toLowerCase()) ||
      a.batch.toLowerCase().includes(search.toLowerCase()) ||
      a.dept.toLowerCase().includes(search.toLowerCase()),
  );

  const handleAddAlumniSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAlumniForm.name || !newAlumniForm.company || !newAlumniForm.designation) {
      toast.error("Please fill in name, company, and designation.");
      return;
    }

    const batchYear = newAlumniForm.batch.split(" ").pop() || "2023";
    const newRecord = {
      id: `ALM-${batchYear}-${Math.floor(100 + Math.random() * 900)}`,
      name: newAlumniForm.name,
      batch: newAlumniForm.batch,
      dept: newAlumniForm.dept,
      company: newAlumniForm.company,
      designation: newAlumniForm.designation,
      location: newAlumniForm.location || "Bengaluru, India",
      mentoring: newAlumniForm.mentoring,
    };

    setAlumni((prev) => [newRecord, ...prev]);
    setIsAddAlumniOpen(false);
    setNewAlumniForm({
      name: "",
      batch: "Batch of 2023",
      dept: "Computer Science",
      company: "",
      designation: "",
      location: "",
      mentoring: "Active Mentor",
    });
    toast.success(`Alumni record for ${newRecord.name} (${newRecord.id}) added successfully!`);
  };

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
          <KpiCard label="Registered Alumni" value={String(12450 + alumni.length - initialAlumni.length)} icon={Users} />
          <KpiCard label="Active Student Mentors" value="480" icon={Award} tone="success" />
          <KpiCard label="Global Chapters" value="18 Cities" icon={Globe} tone="info" />
          <KpiCard label="Alumni Endowment Fund" value="Rs 1.85 Cr" icon={Heart} tone="warning" />
        </div>

        <Tabs defaultValue="directory" className="space-y-6">
          <TabsList className="bg-background/50 border border-border p-1">
            <TabsTrigger value="directory">Alumni Directory ({alumni.length})</TabsTrigger>
            <TabsTrigger value="mentorship">Mentorship Portal</TabsTrigger>
            <TabsTrigger value="events">Reunions & Meetups</TabsTrigger>
          </TabsList>

          <TabsContent value="directory">
            <Panel
              title="Global Alumni Network"
              description="Explore alumni records by batch, department, company, or geographical location."
              action={
                isCellCoordinator ? (
                  <Button
                    onClick={() => setIsAddAlumniOpen(true)}
                    className="bg-brand-gradient shadow-glow gap-1.5 cursor-pointer text-xs font-semibold text-white"
                  >
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
                    className="pl-8 h-9 text-xs"
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
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Over 120 mock interviews scheduled this month.
                </p>
                <div className="grid gap-3 sm:grid-cols-2">
                  {alumni.map((a) => (
                    <div key={a.id} className="p-3.5 rounded-xl border border-border bg-card flex items-center justify-between">
                      <div>
                        <h4 className="font-bold text-sm">{a.name}</h4>
                        <p className="text-xs text-muted-foreground">{a.designation} at {a.company}</p>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => toast.success(`Mentorship request sent to ${a.name}!`)}
                        className="text-xs cursor-pointer"
                      >
                        Connect
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
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

        {/* DIALOG: ADD ALUMNI RECORD */}
        <Dialog open={isAddAlumniOpen} onOpenChange={setIsAddAlumniOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold flex items-center gap-2">
                <UserPlus className="size-5 text-primary" /> Add New Alumni Record
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Register a new alumnus into the institutional alumni network directory.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleAddAlumniSubmit} className="space-y-4 pt-2">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Alumni Full Name *</Label>
                <Input
                  required
                  placeholder="e.g. Sarah Jenkins"
                  value={newAlumniForm.name}
                  onChange={(e) => setNewAlumniForm({ ...newAlumniForm, name: e.target.value })}
                  className="h-9 text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Graduation Batch</Label>
                  <Select
                    value={newAlumniForm.batch}
                    onValueChange={(val) => setNewAlumniForm({ ...newAlumniForm, batch: val })}
                  >
                    <SelectTrigger className="h-9 text-xs">
                      <SelectValue placeholder="Batch" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Batch of 2024" className="text-xs">Batch of 2024</SelectItem>
                      <SelectItem value="Batch of 2023" className="text-xs">Batch of 2023</SelectItem>
                      <SelectItem value="Batch of 2022" className="text-xs">Batch of 2022</SelectItem>
                      <SelectItem value="Batch of 2021" className="text-xs">Batch of 2021</SelectItem>
                      <SelectItem value="Batch of 2020" className="text-xs">Batch of 2020</SelectItem>
                      <SelectItem value="Batch of 2019" className="text-xs">Batch of 2019</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Department</Label>
                  <Select
                    value={newAlumniForm.dept}
                    onValueChange={(val) => setNewAlumniForm({ ...newAlumniForm, dept: val })}
                  >
                    <SelectTrigger className="h-9 text-xs">
                      <SelectValue placeholder="Department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Computer Science" className="text-xs">Computer Science</SelectItem>
                      <SelectItem value="Electronics (ECE)" className="text-xs">Electronics (ECE)</SelectItem>
                      <SelectItem value="Mechanical (ME)" className="text-xs">Mechanical (ME)</SelectItem>
                      <SelectItem value="AI & Data Science" className="text-xs">AI & Data Science</SelectItem>
                      <SelectItem value="Civil Engineering" className="text-xs">Civil Engineering</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Current Company *</Label>
                  <Input
                    required
                    placeholder="e.g. Google Cloud"
                    value={newAlumniForm.company}
                    onChange={(e) => setNewAlumniForm({ ...newAlumniForm, company: e.target.value })}
                    className="h-9 text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Designation *</Label>
                  <Input
                    required
                    placeholder="e.g. Senior Software Engineer"
                    value={newAlumniForm.designation}
                    onChange={(e) => setNewAlumniForm({ ...newAlumniForm, designation: e.target.value })}
                    className="h-9 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Work Location</Label>
                  <Input
                    placeholder="e.g. Mountain View, CA"
                    value={newAlumniForm.location}
                    onChange={(e) => setNewAlumniForm({ ...newAlumniForm, location: e.target.value })}
                    className="h-9 text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Mentorship Role</Label>
                  <Select
                    value={newAlumniForm.mentoring}
                    onValueChange={(val) => setNewAlumniForm({ ...newAlumniForm, mentoring: val })}
                  >
                    <SelectTrigger className="h-9 text-xs">
                      <SelectValue placeholder="Mentorship" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active Mentor" className="text-xs">Active Mentor</SelectItem>
                      <SelectItem value="Guest Speaker" className="text-xs">Guest Speaker</SelectItem>
                      <SelectItem value="Advisory Board" className="text-xs">Advisory Board</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <DialogFooter className="pt-3 border-t border-border">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsAddAlumniOpen(false)}
                  className="text-xs cursor-pointer"
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-brand-gradient text-white text-xs font-semibold cursor-pointer gap-1.5">
                  <Plus className="size-3.5" /> Save Alumni Record
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
