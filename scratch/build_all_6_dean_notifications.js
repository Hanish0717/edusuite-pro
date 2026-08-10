import fs from 'fs';
import path from 'path';

const routesDir = path.join(process.cwd(), 'src/routes');

function generateDeanNotificationCode(
  routePath,
  title,
  subTitle,
  badgeText,
  deanRoleTitle,
  receivedMsgsJS,
  sentMsgsJS,
  recipientGroupOptions
) {
  return `import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { Bell, Send, Inbox, ShieldCheck, Plus, Search, Paperclip } from "lucide-react";
import { Panel } from "@/components/dashboard/panel";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("${routePath}")({
  head: () => ({ meta: [{ title: "${title} — ${deanRoleTitle}" }] }),
  component: NotificationsPage,
});

function NotificationsPage() {
  const [tab, setTab] = useState<"received" | "sent">("received");
  const [showCompose, setShowCompose] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);
  const [search, setSearch] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("all");

  const [recipient, setRecipient] = useState("${recipientGroupOptions[0]}");
  const [subjectInput, setSubjectInput] = useState("");
  const [messageInput, setMessageInput] = useState("");

  const receivedMsgs = useMemo(() => ${receivedMsgsJS}, []);
  const [sentMsgs, setSentMsgs] = useState(${sentMsgsJS});

  const activeMsgs = tab === "received" ? receivedMsgs : sentMsgs;

  const filteredMsgs = useMemo(() => {
    return activeMsgs.filter((m: any) => {
      const matchSearch = m.subject.toLowerCase().includes(search.toLowerCase()) ||
        (m.sender && m.sender.toLowerCase().includes(search.toLowerCase())) ||
        (m.receiver && m.receiver.toLowerCase().includes(search.toLowerCase()));
      const matchPriority = priorityFilter === "all" || m.priority.toLowerCase() === priorityFilter.toLowerCase();
      return matchSearch && matchPriority;
    });
  }, [activeMsgs, search, priorityFilter]);

  const handleSend = () => {
    if (!subjectInput) return;
    const newSentMsg = {
      id: \`MSG-S\${sentMsgs.length + 1}\`,
      subject: subjectInput,
      receiver: recipient,
      date: new Date().toISOString().split("T")[0],
      priority: "High",
      status: "Delivered",
      attachment: "None"
    };
    setSentMsgs((prev) => [newSentMsg, ...prev]);
    setSentSuccess(true);
    setShowCompose(false);
    setSubjectInput("");
    setMessageInput("");
  };

  return (
    <div className="space-y-6">
      {/* HEADER BAR */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="font-mono text-[0.65rem] uppercase text-primary border-primary/30">${badgeText}</Badge>
            <span className="text-xs text-muted-foreground">• Institutional Notifications Architecture</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">${title}</h1>
          <p className="text-sm text-muted-foreground">${subTitle}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button variant={tab === "received" ? "default" : "outline"} size="sm" onClick={() => setTab("received")} className="h-8 text-xs font-bold gap-1 cursor-pointer">
            <Inbox className="size-3.5" /> Tab 1: Received ({receivedMsgs.length})
          </Button>
          <Button variant={tab === "sent" ? "default" : "outline"} size="sm" onClick={() => setTab("sent")} className="h-8 text-xs font-bold gap-1 cursor-pointer">
            <Send className="size-3.5" /> Tab 2: Sent ({sentMsgs.length})
          </Button>
          <Button size="sm" onClick={() => setShowCompose(!showCompose)} className="h-8 text-xs gap-1.5 bg-primary text-primary-foreground cursor-pointer font-bold">
            <Plus className="size-3.5" /> Compose Notification
          </Button>
        </div>
      </div>

      {/* KPI CARDS */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Received Alerts" value={receivedMsgs.length.toString()} icon={Inbox} tone="info" />
        <KpiCard label="Sent Broadcasts" value={sentMsgs.length.toString()} icon={Send} tone="purple" />
        <KpiCard label="Unread Alerts" value="1 Alert" icon={Bell} tone="warning" />
        <KpiCard label="Delivery Status" value="100% Delivered" icon={ShieldCheck} tone="success" />
      </div>

      {/* COMPOSE FORM */}
      {showCompose && (
        <Panel title="Compose Broadcast Notification" description="Send instant notice to department heads, faculty, or institutional stakeholders.">
          <div className="space-y-4 max-w-2xl">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1">
                <label className="text-xs font-bold text-muted-foreground">Recipient Group</label>
                <input
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  className="w-full h-9 rounded-md border border-input bg-transparent px-3 text-xs shadow-xs"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-muted-foreground">Subject Line</label>
                <Input
                  value={subjectInput}
                  onChange={(e) => setSubjectInput(e.target.value)}
                  placeholder="Enter notice subject line..."
                  className="h-9 text-xs"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-muted-foreground">Notification Message Content</label>
              <textarea
                rows={3}
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                placeholder="Write official broadcast notice details..."
                className="w-full rounded-md border border-input bg-transparent p-2 text-xs shadow-xs"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <Button size="sm" onClick={handleSend} className="h-8 text-xs font-bold bg-emerald-600 text-white cursor-pointer gap-1.5">
                <Send className="size-3.5" /> Dispatch Official Broadcast Notice
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setShowCompose(false)} className="h-8 text-xs">
                Cancel
              </Button>
            </div>
          </div>
        </Panel>
      )}

      {sentSuccess && (
        <div className="p-3.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-700 flex items-center justify-between text-xs font-bold">
          <span>Broadcast notification dispatched successfully to all recipients. Delivery confirmed.</span>
          <Badge className="bg-emerald-600 text-white font-mono">Delivered ✓</Badge>
        </div>
      )}

      {/* MAIN NOTIFICATIONS LIST */}
      <Panel title={tab === "received" ? "Received Alerts Inbox" : "Sent Broadcast History"} description="Subject, sender/receiver, date, priority, and read status.">
        <div className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1 max-w-sm">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search subject or sender..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-9 text-xs"
              />
            </div>
          </div>

          <div className="space-y-3">
            {filteredMsgs.map((m: any) => (
              <div key={m.id} className="p-4 rounded-xl border border-border bg-card space-y-2 hover:bg-muted/20 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="font-mono text-[0.65rem]">{m.id}</Badge>
                    <Badge className={m.priority === "High" ? "bg-rose-500/10 text-rose-600 font-mono text-[0.65rem]" : "bg-amber-500/10 text-amber-600 font-mono text-[0.65rem]"}>
                      {m.priority} Priority
                    </Badge>
                  </div>
                  <span className="text-xs text-muted-foreground font-mono">{m.date}</span>
                </div>
                <h4 className="font-bold text-xs text-foreground flex items-center gap-2">
                  <Bell className="size-3.5 text-primary" /> {m.subject}
                </h4>
                <div className="flex items-center justify-between text-xs text-muted-foreground font-mono">
                  <span>{tab === "received" ? \`Sender: \${m.sender} | Status: \${m.status}\` : \`Receiver: \${m.receiver} | Status: \${m.status}\`}</span>
                  {m.attachment && m.attachment !== "None" && (
                    <span className="flex items-center gap-1 text-primary"><Paperclip className="size-3" /> {m.attachment}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Panel>
    </div>
  );
}
`;
}

// 1. IQAC Notifications
const iqacCode = generateDeanNotificationCode(
  "/staff/iqac/notifications",
  "IQAC Notifications & Quality Alerts",
  "Manage NAAC, AQAR, NBA, and quality audit broadcasts and alerts.",
  "IQAC DEAN",
  "IQAC Dean",
  `[
    { id: "MSG-R1", subject: "NAAC Mock Peer Team Visit Scheduled for August 18", sender: "Academic Senate", date: "2026-08-04", priority: "High", status: "Unread", attachment: "NAAC_Schedule.pdf" },
    { id: "MSG-R2", subject: "AQAR 2025-26 Desk Clearance Approved by UGC", sender: "UGC Desk", date: "2026-08-02", priority: "Medium", status: "Read", attachment: "AQAR_Approval.pdf" },
  ]`,
  `[
    { id: "MSG-S1", subject: "Submission Deadline for Criterion 1-7 Evidence Files", receiver: "All HODs & Quality Coordinators", date: "2026-08-03", priority: "High", status: "Delivered", attachment: "Criterion_Checklist.pdf" },
  ]`,
  ["All HODs & Quality Coordinators", "Academic Council", "NAAC Steering Committee"]
);
fs.writeFileSync(path.join(routesDir, "staff.iqac.notifications.tsx"), iqacCode, 'utf8');

// 2. IMA Notifications
const imaCode = generateDeanNotificationCode(
  "/staff/ima/notifications",
  "IMA Infrastructure & Policy Notifications",
  "Manage campus infrastructure capital projects, safety audits, and corporate MoUs.",
  "IMA DEAN",
  "IMA Dean",
  `[
    { id: "MSG-R1", subject: "Campus Solar Power Substation Inspection Clearances", sender: "State Energy Board", date: "2026-08-04", priority: "High", status: "Unread", attachment: "Safety_Clearance.pdf" },
    { id: "MSG-R2", subject: "Annual Capital Infrastructure Audit Schedule", sender: "Finance Committee", date: "2026-08-01", priority: "Medium", status: "Read", attachment: "CapEx_Audit.pdf" },
  ]`,
  `[
    { id: "MSG-S1", subject: "Supercomputing Lab Air Conditioning Maintenance Schedule", receiver: "CSE & IT Department HODs", date: "2026-08-03", priority: "High", status: "Delivered", attachment: "Infra_Notice.pdf" },
  ]`,
  ["CSE & IT Department HODs", "Campus Maintenance Team", "CapEx Advisory Board"]
);
fs.writeFileSync(path.join(routesDir, "staff.ima.notifications.tsx"), imaCode, 'utf8');

// 3. Research Notifications
const researchCode = generateDeanNotificationCode(
  "/staff/research-development/notifications",
  "R&D Grants & Research Notifications",
  "Manage DST/SERB grant calls, patent filings, and SCI journal publications.",
  "RESEARCH DEAN",
  "Research Dean",
  `[
    { id: "MSG-R1", subject: "DST SERB Call for Core Research Grant Proposals 2026", sender: "DST Government of India", date: "2026-08-04", priority: "High", status: "Unread", attachment: "DST_Call_2026.pdf" },
    { id: "MSG-R2", subject: "Indian Patent Office Grant Approval for AI Invention", sender: "IPR India Desk", date: "2026-08-02", priority: "Medium", status: "Read", attachment: "Patent_Grant.pdf" },
  ]`,
  `[
    { id: "MSG-S1", subject: "Mandatory SCI Journal Publication Metric Filings", receiver: "All Faculty Researchers & PhD Guides", date: "2026-08-03", priority: "High", status: "Delivered", attachment: "Publication_Format.docx" },
  ]`,
  ["All Faculty Researchers & PhD Guides", "R&D Advisory Council", "IPR Cell"]
);
fs.writeFileSync(path.join(routesDir, "staff.research-development.notifications.tsx"), researchCode, 'utf8');

// 4. Finance Notifications
const financeCode = generateDeanNotificationCode(
  "/staff/finance-dean/notifications",
  "Finance Dean Budget & Audit Notifications",
  "Manage department budget allocations, fee collection ledgers, and statutory financial audits.",
  "FINANCE DEAN",
  "Finance Dean",
  `[
    { id: "MSG-R1", subject: "Annual Statutory Financial Audit Clearance Report", sender: "Chartered Auditor Office", date: "2026-08-04", priority: "High", status: "Unread", attachment: "Audit_Clearance.pdf" },
    { id: "MSG-R2", subject: "State Government Scholarship Fund Disbursement Received", sender: "State Treasury", date: "2026-08-01", priority: "Medium", status: "Read", attachment: "Treasury_Ledger.pdf" },
  ]`,
  `[
    { id: "MSG-S1", subject: "Autumn Semester Department Budget Spending Limits", receiver: "All Academic HODs & Deans", date: "2026-08-03", priority: "High", status: "Delivered", attachment: "Budget_Limits.pdf" },
  ]`,
  ["All Academic HODs & Deans", "Accounts Section", "Audit Committee"]
);
fs.writeFileSync(path.join(routesDir, "staff.finance-dean.notifications.tsx"), financeCode, 'utf8');

// 5. Examination Notifications
const examCode = generateDeanNotificationCode(
  "/staff/examination-dean/notifications",
  "Examination Dean & Invigilation Alerts",
  "Manage end-sem exam schedules, invigilation rosters, hall tickets, and results.",
  "EXAMINATION DEAN",
  "Exam Dean",
  `[
    { id: "MSG-R1", subject: "End-Sem Answer Script Moderation Committee Approval", sender: "University Senate", date: "2026-08-04", priority: "High", status: "Unread", attachment: "Moderation_Rules.pdf" },
    { id: "MSG-R2", subject: "Hall Ticket Verification Clearance for Autonomous Block", sender: "Academic Registrar", date: "2026-08-02", priority: "Medium", status: "Read", attachment: "Clearance_List.pdf" },
  ]`,
  `[
    { id: "MSG-S1", subject: "Final Invigilation Duty Roster Release for End-Sem Examinations", receiver: "All Invigilating Faculty Members", date: "2026-08-03", priority: "High", status: "Delivered", attachment: "Duty_Roster.pdf" },
  ]`,
  ["All Invigilating Faculty Members", "Department Exam Coordinators", "Chief Superintendent"]
);
fs.writeFileSync(path.join(routesDir, "staff.examination-dean.notifications.tsx"), examCode, 'utf8');

// 6. Placement Notifications
const placementCode = generateDeanNotificationCode(
  "/staff/placement-dean/notifications",
  "Placement & Corporate Drive Alerts",
  "Manage corporate recruitment drives, pre-placement talks, and job offer dispatches.",
  "PLACEMENT DEAN",
  "Placement Dean",
  `[
    { id: "MSG-R1", subject: "Google Cloud Placement Drive Confirmation (24 LPA CTC)", sender: "Google University Relations", date: "2026-08-04", priority: "High", status: "Unread", attachment: "Drive_Details.pdf" },
    { id: "MSG-R2", subject: "Microsoft Tech Offer Letter Clearance for 12 Graduates", sender: "Microsoft HR India", date: "2026-08-02", priority: "Medium", status: "Read", attachment: "Offer_Letters.zip" },
  ]`,
  `[
    { id: "MSG-S1", subject: "Mandatory Aptitude & Technical Mock Interview Registration", receiver: "All Final Year Registered Students", date: "2026-08-03", priority: "High", status: "Delivered", attachment: "Registration_Link.pdf" },
  ]`,
  ["All Final Year Registered Students", "TPO Faculty Coordinators", "Corporate Placement Cell"]
);
fs.writeFileSync(path.join(routesDir, "staff.placement-dean.notifications.tsx"), placementCode, 'utf8');

console.log("All 6 Dean Notification routes generated successfully.");
