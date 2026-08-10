import { useState } from "react";
import { Send } from "lucide-react";
import { Panel } from "@/components/dashboard/panel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/shared/components/Form";
import { useNotifications } from "../hooks/useNotifications";
import { EmptyState, LoadingState } from "@/shared/components";
import { DataTable, ColumnDef } from "@/shared/components/DataTable/DataTable";
import type { AITriggerNotification } from "../types";

export function Notifications() {
  const { alerts, loading, error, dispatchCustomAlert } = useNotifications();

  // Custom alert state
  const [studentId, setStudentId] = useState("");
  const [studentName, setStudentName] = useState("");
  const [triggerType, setTriggerType] = useState<AITriggerNotification["triggerType"]>("Attendance Shortage");
  const [channel, setChannel] = useState<AITriggerNotification["channel"]>("SMS");
  const [recipient, setRecipient] = useState<AITriggerNotification["recipient"]>("Parent");
  const [message, setMessage] = useState("");

  const handleTrigger = async () => {
    if (!studentId || !studentName || !message) return;
    const success = await dispatchCustomAlert(
      studentId,
      studentName,
      triggerType,
      channel,
      recipient,
      message
    );
    if (success) {
      setStudentId("");
      setStudentName("");
      setMessage("");
    }
  };

  // Columns definition for the generic DataTable
  const columns: ColumnDef<AITriggerNotification>[] = [
    {
      header: "Log ID",
      accessorKey: "id",
      className: "font-mono text-xs font-semibold",
    },
    {
      header: "Student Name",
      render: (row) => (
        <div>
          <p className="font-bold text-sm text-foreground">{row.studentName}</p>
          <p className="font-mono text-xs text-muted-foreground">{row.studentId}</p>
        </div>
      ),
    },
    {
      header: "Trigger Type",
      accessorKey: "triggerType",
      className: "font-semibold text-sm text-foreground",
    },
    {
      header: "Channel",
      render: (row) => {
        const getChannelBadge = (ch: string) => {
          switch (ch) {
            case "SMS":
              return <Badge className="bg-purple-500/10 text-purple-600 border-purple-500/20 font-semibold">SMS</Badge>;
            case "In-App":
              return <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/20 font-semibold">In-App</Badge>;
            case "All":
              return <Badge className="bg-indigo-500/10 text-indigo-600 border-indigo-500/20 font-semibold">Omnichannel</Badge>;
            default:
              return <Badge className="bg-slate-500/10 text-slate-600 border-slate-500/20 font-semibold">Email</Badge>;
          }
        };
        return getChannelBadge(row.channel);
      },
    },
    {
      header: "Recipient",
      render: (row) => {
        const getRecipientBadge = (rec: string) => {
          switch (rec) {
            case "Parent":
              return <Badge className="bg-pink-500/10 text-pink-600 border-pink-500/20 font-semibold">Parent</Badge>;
            case "Faculty":
              return <Badge className="bg-cyan-500/10 text-cyan-600 border-cyan-500/20 font-semibold">Faculty Mentor</Badge>;
            case "HOD":
              return <Badge className="bg-orange-500/10 text-orange-600 border-orange-500/20 font-semibold">HOD</Badge>;
            case "All":
              return <Badge className="bg-violet-500/10 text-violet-600 border-violet-500/20 font-semibold">All Stakeholders</Badge>;
            default:
              return <Badge className="bg-teal-500/10 text-teal-600 border-teal-500/20 font-semibold">Student</Badge>;
          }
        };
        return getRecipientBadge(row.recipient);
      },
    },
    {
      header: "Alert Message",
      className: "max-w-xs truncate text-xs text-muted-foreground font-medium",
      accessorKey: "message",
    },
    {
      header: "Timestamp",
      accessorKey: "timestamp",
      className: "font-mono text-xs text-muted-foreground font-semibold",
    },
    {
      header: "Status",
      className: "text-right",
      render: (row) => (
        <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 font-bold">
          {row.status}
        </Badge>
      ),
    },
  ];

  const triggerOptions = [
    { value: "Attendance Shortage", label: "Attendance Shortage" },
    { value: "Internal Performance", label: "Internal Performance" },
    { value: "Fee Due", label: "Fee Due" },
    { value: "Exam Registry", label: "Exam Registry" },
    { value: "Library Overdue", label: "Library Overdue" },
    { value: "Hostel Alert", label: "Hostel Alert" },
    { value: "Transport Delay", label: "Transport Delay" },
  ];

  const channelOptions = [
    { value: "SMS", label: "SMS" },
    { value: "Email", label: "Email" },
    { value: "In-App", label: "In-App" },
    { value: "All", label: "All Channels" },
  ];

  const recipientOptions = [
    { value: "Student", label: "Student" },
    { value: "Parent", label: "Parent" },
    { value: "Faculty", label: "Faculty Mentor" },
    { value: "HOD", label: "HOD" },
    { value: "All", label: "All" },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Trigger card */}
        <div className="lg:col-span-1">
          <Panel
            title="Manual Warning Dispatcher"
            description="Trigger a simulated machine-learning warning notification log to any recipient channel."
          >
            <div className="space-y-4 pt-2">
              <Input
                label="Student Name"
                placeholder="e.g. John Doe"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
              />

              <Input
                label="Student Roll Number / ID"
                placeholder="e.g. 21CS001"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                className="font-mono"
              />

              <Select
                label="Trigger Type"
                value={triggerType}
                onChange={(val: any) => setTriggerType(val)}
                options={triggerOptions}
              />

              <div className="grid grid-cols-2 gap-2">
                <Select
                  label="Channel"
                  value={channel}
                  onChange={(val: any) => setChannel(val)}
                  options={channelOptions}
                />

                <Select
                  label="Recipient"
                  value={recipient}
                  onChange={(val: any) => setRecipient(val)}
                  options={recipientOptions}
                />
              </div>

              <Input
                label="Custom Alert Message"
                placeholder="e.g. Warning: Predicted semester attendance below 75% threshold."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />

              <Button
                onClick={handleTrigger}
                disabled={!studentId || !studentName || !message}
                className="w-full bg-primary hover:bg-primary/90 text-white font-semibold cursor-pointer gap-1.5 h-9 shadow-[0_2px_8px_rgba(29,78,216,0.15)]"
              >
                <Send className="size-3.5" /> Dispatch Alert
              </Button>
            </div>
          </Panel>
        </div>

        {/* Alerts logs */}
        <div className="lg:col-span-2">
          <Panel
            title="Real-Time Warning Logs"
            description="Omnichannel warning alerts sent dynamically by prediction algorithms and administrative overrides."
          >
            {loading ? (
              <LoadingState message="Connecting to push notification socket..." />
            ) : error ? (
              <div className="text-center p-6 text-red-500 font-semibold">{error}</div>
            ) : alerts.length === 0 ? (
              <EmptyState title="No notifications logged" description="Alert history is empty." />
            ) : (
              <div className="pt-2">
                <DataTable
                  columns={columns}
                  data={alerts}
                  searchKey="studentName"
                  searchPlaceholder="Search by student name..."
                  pageSize={8}
                />
              </div>
            )}
          </Panel>
        </div>
      </div>
    </div>
  );
}
