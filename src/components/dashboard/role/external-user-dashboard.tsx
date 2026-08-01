import {
  FileText,
  Upload,
  Clock,
  CheckCircle,
  Briefcase,
  Users,
  Calendar,
  Gift,
  Building,
  CreditCard,
  PlusCircle,
  BookOpen,
  DollarSign,
} from "lucide-react";

import { KpiCard } from "@/components/dashboard/kpi-card";
import { Panel } from "@/components/dashboard/panel";
import { QuickActionsWidget } from "@/components/dashboard/widgets";
import { useRole } from "@/context/role-context";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function ExternalUserDashboard() {
  const { profile } = useRole();
  const persona = profile.externalPersona || "applicant";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div>
          <h2 className="font-display text-2xl font-extrabold tracking-tight">
            External Portal: {profile.personaName}
          </h2>
          <p className="text-sm text-muted-foreground">{profile.personaMeta}</p>
        </div>
        <Badge className="bg-primary/10 text-primary hover:bg-primary/20">
          {persona.toUpperCase()}
        </Badge>
      </div>

      {/* Render conditional views depending on the persona */}
      {persona === "applicant" && <ApplicantView />}
      {persona === "alumni" && <AlumniView />}
      {persona === "recruiter" && <RecruiterView />}
      {persona === "vendor" && <VendorView />}
      {persona === "guest-faculty" && <GuestFacultyView />}
    </div>
  );
}

function ApplicantView() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Application Status" value="In Review" icon={Clock} tone="warning" />
        <KpiCard label="Documents Uploaded" value="6 / 6" icon={Upload} tone="success" />
        <KpiCard label="Verification Step" value="Step 3: Academic" icon={FileText} tone="info" />
        <KpiCard label="Admission Fees Paid" value="Pending" icon={CreditCard} tone="destructive" />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Panel
          title="Application Tracker"
          description="Your admission timeline"
          className="lg:col-span-2"
        >
          <div className="relative pl-6 space-y-6 after:absolute after:bottom-1.5 after:left-2 after:top-1.5 after:w-0.5 after:bg-border">
            {[
              {
                title: "Application Submitted",
                desc: "Submitted on July 10, 2026",
                status: "completed",
              },
              {
                title: "Document Verification",
                desc: "10th, 12th & Entrance Rank cards verified",
                status: "completed",
              },
              {
                title: "Academic Committee Review",
                desc: "Currently being reviewed by CSE Dept",
                status: "active",
              },
              {
                title: "Admission Offer & Fee Payment",
                desc: "Offer letter pending review status",
                status: "pending",
              },
            ].map((step, idx) => (
              <div key={idx} className="relative">
                <span
                  className={`absolute -left-6 top-1 grid size-4.5 place-items-center rounded-full border text-[0.6rem] font-bold ${
                    step.status === "completed"
                      ? "bg-primary border-primary text-primary-foreground"
                      : step.status === "active"
                        ? "bg-amber-500 border-amber-500 text-white animate-pulse"
                        : "bg-muted border-muted text-muted-foreground"
                  }`}
                >
                  {step.status === "completed" ? "✓" : idx + 1}
                </span>
                <div className="ml-2">
                  <h4 className="text-sm font-semibold">{step.title}</h4>
                  <p className="text-xs text-muted-foreground">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Missing / Action Required" description="Required documents">
          <div className="space-y-4">
            <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-4">
              <h4 className="text-sm font-semibold text-destructive">Pay Tuition Deposit</h4>
              <p className="mt-1 text-xs text-muted-foreground">
                Pay the partial tuition deposit of $500 to secure your merit seat once approved.
              </p>
            </div>
            <div className="rounded-xl border border-border p-4">
              <h4 className="text-sm font-semibold">Income Certificate (Optional)</h4>
              <p className="mt-1 text-xs text-muted-foreground">
                Upload for merit-cum-means scholarship considerations.
              </p>
            </div>
          </div>
        </Panel>
      </div>

      <QuickActionsWidget
        actions={[
          "Upload Additional Documents",
          "View Eligibility Rules",
          "Contact Admissions Desk",
          "Download Challan",
        ]}
      />
    </div>
  );
}

function AlumniView() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Alumni ID" value="#AL-2022-89" icon={FileText} tone="info" />
        <KpiCard label="Mentoring Sessions" value="4 Hosted" icon={Users} tone="success" />
        <KpiCard label="Next Alumni Meet" value="15 Days" icon={Calendar} tone="warning" />
        <KpiCard label="Contribution Total" value="$1,200" icon={Gift} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Panel
          title="Upcoming Alumni Events"
          description="Connect back with your roots"
          className="lg:col-span-2"
        >
          <div className="space-y-4">
            {[
              {
                title: "Annual Alumni Homecoming 2026",
                date: "August 15, 2026",
                time: "6:00 PM - Campus Lawn",
                type: "Homecoming",
              },
              {
                title: "Mentorship Drive: Career in AI/ML",
                date: "August 22, 2026",
                time: "4:00 PM - Virtual",
                type: "Mentorship",
              },
              {
                title: "ECE Dept silver jubilee meet",
                date: "September 05, 2026",
                time: "10:30 AM - Seminar Hall 1",
                type: "Departmental",
              },
            ].map((ev, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between border-b border-border/50 pb-3 last:border-0 last:pb-0"
              >
                <div>
                  <h4 className="text-sm font-semibold">{ev.title}</h4>
                  <p className="text-xs text-muted-foreground">
                    {ev.date} | {ev.time}
                  </p>
                </div>
                <Badge variant="secondary">{ev.type}</Badge>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Mentee Requests" description="Students looking for guidance">
          <div className="space-y-3">
            {[
              { name: "Rahul S (Final Year)", topic: "Cloud Architecture" },
              { name: "Priya Patel (Pre-Final Year)", topic: "Product Management" },
            ].map((r, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-border p-3 flex justify-between items-center"
              >
                <div>
                  <h4 className="text-xs font-semibold">{r.name}</h4>
                  <p className="text-[0.65rem] text-muted-foreground">{r.topic}</p>
                </div>
                <Badge className="bg-primary text-[0.6rem] cursor-pointer">Accept</Badge>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <QuickActionsWidget
        actions={[
          "Donate to Campus Fund",
          "Register for Meet",
          "Submit Job Opening",
          "Request Degree Transcript",
        ]}
      />
    </div>
  );
}

import { RecruiterPortalWorkspace } from "@/components/dashboard/role/recruiter-portal-workspace";

function RecruiterView() {
  return <RecruiterPortalWorkspace />;
}

function VendorView() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Contract ID" value="#CON-CAF-4" icon={Building} tone="info" />
        <KpiCard label="Purchase Orders" value="12 Issued" icon={FileText} />
        <KpiCard label="Pending Invoices" value="2 Invoices" icon={Clock} tone="warning" />
        <KpiCard label="Total Unpaid Amount" value="$3,450" icon={DollarSign} tone="destructive" />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Panel
          title="Active Purchase Orders"
          description="Fulfillments requested"
          className="lg:col-span-2"
        >
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>PO Number</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[
                {
                  id: "PO-2026-092",
                  desc: "Hostel Mess Provisions - Batch 4",
                  date: "Aug 05, 2026",
                  amount: "$1,850.00",
                  status: "In Progress",
                },
                {
                  id: "PO-2026-088",
                  desc: "Sports Event Refreshments",
                  date: "Jul 28, 2026",
                  amount: "$900.00",
                  status: "Delivered",
                },
                {
                  id: "PO-2026-081",
                  desc: "Annual Seminar Coffee Catering",
                  date: "Jul 20, 2026",
                  amount: "$700.00",
                  status: "Paid",
                },
              ].map((po, idx) => (
                <TableRow key={idx}>
                  <TableCell className="font-mono text-xs">{po.id}</TableCell>
                  <TableCell>{po.desc}</TableCell>
                  <TableCell>{po.date}</TableCell>
                  <TableCell>{po.amount}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        po.status === "In Progress"
                          ? "outline"
                          : po.status === "Delivered"
                            ? "default"
                            : "secondary"
                      }
                      className={po.status === "In Progress" ? "bg-amber-500/10 text-amber-600 border-amber-500/30" : ""}
                    >
                      {po.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Panel>

        <Panel title="Submit Invoice" description="Request payment for delivery">
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-1">
                Select Purchase Order
              </label>
              <select className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm focus-visible:ring-ring">
                <option>PO-2026-092 - Hostel Mess Provisions ($1,850.00)</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-1">
                Invoice Number
              </label>
              <input
                type="text"
                placeholder="INV-2026-XXXX"
                className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-1">
                Attach Bill/Receipt (PDF)
              </label>
              <div className="border border-dashed border-border rounded-md p-4 text-center cursor-pointer hover:bg-accent/30 transition-colors">
                <Upload className="size-5 mx-auto text-muted-foreground" />
                <span className="text-[0.65rem] text-muted-foreground block mt-1">
                  Upload scanned copy
                </span>
              </div>
            </div>
            <button className="w-full h-9 rounded-md bg-primary text-primary-foreground font-semibold text-xs transition-colors hover:bg-primary/90">
              Submit Invoice
            </button>
          </form>
        </Panel>
      </div>
    </div>
  );
}

function GuestFacultyView() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <KpiCard label="Assigned Subject" value="Distributed Systems" icon={BookOpen} tone="info" />
        <KpiCard label="Next Lecture" value="Tomorrow 10:00 AM" icon={Calendar} tone="warning" />
        <KpiCard label="Claim Status" value="Processing ($450)" icon={Clock} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Panel
          title="Lectures Schedule"
          description="Your upcoming guest classes"
          className="lg:col-span-2"
        >
          <div className="space-y-4">
            {[
              {
                topic: "Lecture 4: Raft Consensus Algorithm",
                date: "Aug 01, 2026",
                time: "10:00 AM - 12:00 PM",
                hall: "CSE Seminar Hall 2",
              },
              {
                topic: "Lecture 5: MapReduce & Spark Foundations",
                date: "Aug 03, 2026",
                time: "10:00 AM - 12:00 PM",
                hall: "CSE Seminar Hall 2",
              },
              {
                topic: "Lecture 6: CAP Theorem & DynamoDB Case Study",
                date: "Aug 08, 2026",
                time: "02:00 PM - 04:00 PM",
                hall: "CSE Seminar Hall 2",
              },
            ].map((l, idx) => (
              <div
                key={idx}
                className="flex justify-between items-center border-b border-border/50 pb-3 last:border-0 last:pb-0"
              >
                <div>
                  <h4 className="text-sm font-semibold">{l.topic}</h4>
                  <p className="text-xs text-muted-foreground">
                    {l.date} | {l.time}
                  </p>
                </div>
                <Badge variant="secondary">{l.hall}</Badge>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Submit Honorarium Claim" description="Request session payments">
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-1">
                Select Completed Lecture
              </label>
              <select className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm">
                <option>Lecture 3: Paxos Algorithm (Completed Jul 27)</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-1">
                Sessions Hours
              </label>
              <input
                type="number"
                defaultValue="2"
                className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm"
              />
            </div>
            <button className="w-full h-9 rounded-md bg-primary text-primary-foreground font-semibold text-xs hover:bg-primary/90">
              Submit Claim
            </button>
          </form>
        </Panel>
      </div>
    </div>
  );
}
