import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  ShieldAlert,
  MessageSquare,
  Clock,
  CheckCircle2,
  Plus,
  Search,
  Filter,
  Eye,
  PhoneCall,
  UserCheck,
  Check,
  Send,
} from "lucide-react";

import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { StudentFeedbackModule } from "@/components/student-feedback";
import { Panel } from "@/components/dashboard/panel";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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

import {
  fetchGrievanceTickets,
  fetchCommitteeMembers,
  fetchAntiRaggingSquad,
  calculateGrievanceStats,
  type GrievanceTicket,
} from "@/lib/grievanceService";

export const Route = createFileRoute("/grievance")({
  head: () => ({
    meta: [{ title: "Feedback & Grievance Redressal — EduSuite Pro" }],
  }),
  component: GrievancePage,
});

export function GrievancePage() {
  const { hasFlag, role } = useRole();

  if (role === "student") {
    return (
      <DashboardLayout>
        <StudentFeedbackModule />
      </DashboardLayout>
    );
  }

  // State for search and filter controls
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [priorityFilter, setPriorityFilter] = useState("All Priorities");

  // State for dynamic ticket resolution and modal view
  const [ticketState, setTicketState] = useState<GrievanceTicket[]>(() =>
    fetchGrievanceTickets("", "All Statuses", "All Priorities"),
  );
  const [selectedTimelineTicket, setSelectedTimelineTicket] = useState<GrievanceTicket | null>(null);

  // State for Raise New Grievance Modal
  const [isNewGrievanceOpen, setIsNewGrievanceOpen] = useState(false);
  const [newGrievanceForm, setNewGrievanceForm] = useState({
    subject: "",
    category: "Infrastructure & Amenities",
    priority: "Medium" as "Low" | "Medium" | "High" | "Urgent",
    identityMode: "Identified",
    description: "",
  });

  const isCommitteeMember =
    role === "super-admin" ||
    hasFlag("isDisciplinaryCommittee") ||
    hasFlag("isHod");

  // Dynamic Metrics & Rosters
  const stats = useMemo(() => calculateGrievanceStats(), []);
  const committeeMembers = useMemo(() => fetchCommitteeMembers(), []);
  const antiRaggingSquad = useMemo(() => fetchAntiRaggingSquad(), []);

  // Filtered Complaint List
  const filteredTickets = useMemo(() => {
    return ticketState.filter((t) => {
      const matchesSearch =
        t.subject.toLowerCase().includes(search.toLowerCase()) ||
        t.category.toLowerCase().includes(search.toLowerCase()) ||
        t.id.toLowerCase().includes(search.toLowerCase()) ||
        t.raisedBy.toLowerCase().includes(search.toLowerCase());

      const matchesStatus = statusFilter === "All Statuses" || t.status === statusFilter;
      const matchesPriority = priorityFilter === "All Priorities" || t.priority === priorityFilter;

      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [ticketState, search, statusFilter, priorityFilter]);

  const handleResolve = (id: string) => {
    setTicketState((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              status: "Resolved",
              sla: "Closed",
              timeline: [
                ...t.timeline,
                {
                  step: "Resolved & Closed",
                  date: new Date().toLocaleString(),
                  description: "Marked resolved by Grievance Committee Member.",
                  actor: role,
                },
              ],
            }
          : t,
      ),
    );
    toast.success(`Grievance ticket ${id} marked as Resolved!`);
  };

  const handleCreateGrievanceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGrievanceForm.subject || !newGrievanceForm.description) {
      toast.error("Please enter a subject and detailed description.");
      return;
    }

    const newTicket: GrievanceTicket = {
      id: `GRV-${Math.floor(1000 + Math.random() * 9000)}`,
      subject: newGrievanceForm.subject,
      category: newGrievanceForm.category,
      priority: newGrievanceForm.priority,
      date: new Date().toISOString().split("T")[0] ?? "2026-08-01",
      raisedBy:
        newGrievanceForm.identityMode === "Anonymous"
          ? "Anonymous User"
          : `${role.toUpperCase()} User`,
      committee: "Disciplinary & Grievance Cell",
      status: "Pending",
      sla: "48 Hours",
      timeline: [
        {
          step: "Grievance Ticket Submitted",
          date: new Date().toLocaleString(),
          description: newGrievanceForm.description,
          actor:
            newGrievanceForm.identityMode === "Anonymous"
              ? "Anonymous User"
              : `${role.toUpperCase()} User`,
        },
      ],
    };

    setTicketState((prev) => [newTicket, ...prev]);
    setIsNewGrievanceOpen(false);
    setNewGrievanceForm({
      subject: "",
      category: "Infrastructure & Amenities",
      priority: "Medium",
      identityMode: "Identified",
      description: "",
    });
    toast.success(`Grievance ${newTicket.id} submitted successfully!`);
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "Urgent":
        return <Badge variant="destructive">Urgent</Badge>;
      case "High":
        return <Badge className="bg-amber-500 text-white">High</Badge>;
      case "Medium":
        return <Badge variant="secondary">Medium</Badge>;
      default:
        return <Badge variant="outline">Low</Badge>;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* HEADER BANNER */}
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

        {/* COMPUTED KPIS */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <KpiCard label="Total Tickets (FY26)" value={String(ticketState.length)} icon={MessageSquare} />
          <KpiCard label="Resolved SLA Rate" value={stats.resolvedSlaRate} icon={CheckCircle2} tone="success" />
          <KpiCard
            label="Pending Committee Review"
            value={String(ticketState.filter((t) => t.status !== "Resolved").length)}
            icon={Clock}
            tone="warning"
          />
          <KpiCard label="Avg Resolution Time" value={stats.avgResolutionTime} icon={ShieldAlert} tone="info" />
        </div>

        {/* TABS CONTAINER */}
        <Tabs defaultValue="tickets" className="space-y-6">
          <TabsList className="bg-background/50 border border-border p-1">
            <TabsTrigger value="tickets">Grievance Tickets ({ticketState.length})</TabsTrigger>
            <TabsTrigger value="committee">Disciplinary Committee</TabsTrigger>
            <TabsTrigger value="antiragging">Anti-Ragging Squad</TabsTrigger>
          </TabsList>

          {/* GRIEVANCE TICKETS TAB */}
          <TabsContent value="tickets">
            <Panel
              title="Submitted Grievances"
              description="Students and staff can submit grievances. Disciplinary Committee members process cases with strict audit trails."
              action={
                <Button
                  onClick={() => setIsNewGrievanceOpen(true)}
                  className="bg-brand-gradient shadow-glow gap-1.5 cursor-pointer text-xs font-semibold text-white"
                >
                  <Plus className="size-4" /> Raise New Grievance
                </Button>
              }
            >
              <div className="space-y-4">
                {/* DYNAMIC FILTERS */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Search ticket subject, category, or ID..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="pl-9 h-9 text-xs"
                    />
                  </div>

                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[150px] h-9 text-xs">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All Statuses">All Statuses</SelectItem>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Under Review">Under Review</SelectItem>
                      <SelectItem value="Committee Assigned">Committee Assigned</SelectItem>
                      <SelectItem value="Resolved">Resolved</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                    <SelectTrigger className="w-[140px] h-9 text-xs">
                      <SelectValue placeholder="Priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All Priorities">All Priorities</SelectItem>
                      <SelectItem value="Urgent">Urgent</SelectItem>
                      <SelectItem value="High">High</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="Low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* DYNAMIC COMPLAINT LIST TABLE */}
                <div className="overflow-x-auto border border-border rounded-xl">
                  <Table>
                    <TableHeader className="bg-muted/40">
                      <TableRow>
                        <TableHead>Ticket ID</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Subject</TableHead>
                        <TableHead>Priority</TableHead>
                        <TableHead>Raised By</TableHead>
                        <TableHead>Assigned Committee</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredTickets.length > 0 ? (
                        filteredTickets.map((t) => (
                          <TableRow key={t.id}>
                            <TableCell className="font-mono text-xs font-semibold">{t.id}</TableCell>
                            <TableCell className="text-xs text-muted-foreground">{t.category}</TableCell>
                            <TableCell className="font-semibold text-sm">{t.subject}</TableCell>
                            <TableCell>{getPriorityBadge(t.priority)}</TableCell>
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
                              <div className="flex items-center justify-end gap-1.5">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => setSelectedTimelineTicket(t)}
                                  className="h-8 text-xs cursor-pointer gap-1 px-2"
                                  title="View Timeline"
                                >
                                  <Eye className="size-3.5" /> Timeline
                                </Button>

                                {t.status !== "Resolved" && isCommitteeMember ? (
                                  <Button
                                    size="sm"
                                    onClick={() => handleResolve(t.id)}
                                    className="h-8 bg-brand-gradient text-xs cursor-pointer text-white"
                                  >
                                    Resolve
                                  </Button>
                                ) : (
                                  <span className="text-xs text-muted-foreground font-mono px-2">
                                    {t.status}
                                  </span>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={8} className="text-center py-6 text-muted-foreground">
                            No grievance complaints match the current filters.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </Panel>
          </TabsContent>

          {/* DISCIPLINARY COMMITTEE TAB */}
          <TabsContent value="committee">
            <Panel title="Disciplinary Committee Members" description="Appointed faculty and staff members handling escalated hearings.">
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  All hearing minutes and resolution reports are locked with digital signatures.
                </p>

                <div className="grid gap-4 sm:grid-cols-3">
                  {committeeMembers.map((m) => (
                    <div key={m.id} className="p-4 rounded-xl border border-border/80 bg-card space-y-2">
                      <div className="flex items-center gap-3">
                        <span className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary">
                          <UserCheck className="size-5" />
                        </span>
                        <div>
                          <h4 className="font-display text-sm font-bold">{m.name}</h4>
                          <p className="text-xs text-muted-foreground">{m.role}</p>
                        </div>
                      </div>
                      <div className="pt-2 flex items-center justify-between text-xs border-t border-border/60">
                        <span className="text-muted-foreground">{m.department}</span>
                        <Badge variant="outline" className="font-mono">
                          {m.assignedCases} Active Cases
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Panel>
          </TabsContent>

          {/* ANTI-RAGGING TAB */}
          <TabsContent value="antiragging">
            <Panel title="Anti-Ragging Squad & Portal" description="24x7 emergency helpline logs and campus monitoring squad assignments.">
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Compliant with UGC & AICTE Anti-Ragging Directives. Emergency Hotline: <span className="font-mono font-bold text-rose-600">1800-180-5522</span>
                </p>

                <div className="grid gap-4 sm:grid-cols-3">
                  {antiRaggingSquad.map((s) => (
                    <div key={s.id} className="p-4 rounded-xl border border-border/80 bg-card space-y-2">
                      <div className="flex items-center justify-between">
                        <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-xs">
                          {s.status}
                        </Badge>
                        <span className="text-xs font-mono text-muted-foreground">{s.id}</span>
                      </div>
                      <h4 className="font-display text-sm font-bold">{s.name}</h4>
                      <p className="text-xs text-muted-foreground">Zone: {s.zone}</p>
                      <p className="text-xs font-mono text-primary flex items-center gap-1.5 pt-1">
                        <PhoneCall className="size-3.5" /> {s.contact}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </Panel>
          </TabsContent>
        </Tabs>

        {/* DIALOG: RAISE NEW GRIEVANCE */}
        <Dialog open={isNewGrievanceOpen} onOpenChange={setIsNewGrievanceOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold flex items-center gap-2">
                <ShieldAlert className="size-5 text-primary" /> Raise New Grievance Ticket
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Submit an official grievance to the Disciplinary Committee. You can choose to remain anonymous.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleCreateGrievanceSubmit} className="space-y-4 pt-2">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Grievance Subject *</Label>
                <Input
                  required
                  placeholder="e.g. Lab Equipment Defect in Block B"
                  value={newGrievanceForm.subject}
                  onChange={(e) => setNewGrievanceForm({ ...newGrievanceForm, subject: e.target.value })}
                  className="h-9 text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Category</Label>
                  <Select
                    value={newGrievanceForm.category}
                    onValueChange={(val) => setNewGrievanceForm({ ...newGrievanceForm, category: val })}
                  >
                    <SelectTrigger className="h-9 text-xs">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Infrastructure & Amenities" className="text-xs">
                        Infrastructure & Amenities
                      </SelectItem>
                      <SelectItem value="Academic Affairs" className="text-xs">
                        Academic Affairs
                      </SelectItem>
                      <SelectItem value="Hostel & Mess" className="text-xs">
                        Hostel & Mess
                      </SelectItem>
                      <SelectItem value="Transportation" className="text-xs">
                        Transportation
                      </SelectItem>
                      <SelectItem value="Disciplinary & Misconduct" className="text-xs">
                        Disciplinary & Misconduct
                      </SelectItem>
                      <SelectItem value="Financial & Fees" className="text-xs">
                        Financial & Fees
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Priority Level</Label>
                  <Select
                    value={newGrievanceForm.priority}
                    onValueChange={(val: any) => setNewGrievanceForm({ ...newGrievanceForm, priority: val })}
                  >
                    <SelectTrigger className="h-9 text-xs">
                      <SelectValue placeholder="Priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Low" className="text-xs">
                        Low
                      </SelectItem>
                      <SelectItem value="Medium" className="text-xs">
                        Medium
                      </SelectItem>
                      <SelectItem value="High" className="text-xs">
                        High
                      </SelectItem>
                      <SelectItem value="Urgent" className="text-xs">
                        Urgent
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Submission Identity Mode</Label>
                <Select
                  value={newGrievanceForm.identityMode}
                  onValueChange={(val) => setNewGrievanceForm({ ...newGrievanceForm, identityMode: val })}
                >
                  <SelectTrigger className="h-9 text-xs">
                    <SelectValue placeholder="Identity Mode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Identified" className="text-xs">
                      Identified (Linked to my account)
                    </SelectItem>
                    <SelectItem value="Anonymous" className="text-xs">
                      Anonymous (Hide my identity)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Grievance Details *</Label>
                <Textarea
                  required
                  rows={4}
                  placeholder="Provide complete context, location, and details of the complaint..."
                  value={newGrievanceForm.description}
                  onChange={(e) => setNewGrievanceForm({ ...newGrievanceForm, description: e.target.value })}
                  className="text-xs"
                />
              </div>

              <DialogFooter className="pt-3 border-t border-border">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsNewGrievanceOpen(false)}
                  className="text-xs cursor-pointer"
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-brand-gradient text-white text-xs font-semibold cursor-pointer gap-1.5">
                  <Send className="size-3.5" /> Submit Grievance
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* DYNAMIC TIMELINE DIALOG */}
        <Dialog open={!!selectedTimelineTicket} onOpenChange={() => setSelectedTimelineTicket(null)}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-base font-bold font-display flex items-center justify-between">
                <span>Grievance Resolution Timeline</span>
                <span className="font-mono text-xs text-muted-foreground">
                  {selectedTimelineTicket?.id}
                </span>
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                {selectedTimelineTicket?.subject}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-2">
              <div className="relative border-l-2 border-primary/30 pl-4 space-y-4 ml-2">
                {selectedTimelineTicket?.timeline.map((event, idx) => (
                  <div key={idx} className="relative group">
                    <span className="absolute -left-[21px] top-0 size-3 rounded-full bg-primary border-2 border-background" />
                    <div>
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-bold text-foreground">{event.step}</p>
                        <span className="text-[0.65rem] font-mono text-muted-foreground">
                          {event.date}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">{event.description}</p>
                      <p className="text-[0.68rem] font-mono text-primary/80 mt-0.5">By: {event.actor}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
=======
  return (
    <DashboardLayout activeSection="Student Workspace" activeItem="Feedback">
      <StudentFeedbackModule />
>>>>>>> origin/main
    </DashboardLayout>
  );
}
