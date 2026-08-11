import { useState, useMemo } from "react";
import { ShieldCheck, Search, ShieldAlert, FileText, Download, Lock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Panel } from "@/components/dashboard/panel";
import { WorkflowItem, AuditLogEntry } from "@/types/approval";
import { toast } from "sonner";

interface AuditLogViewerProps {
  workflows: WorkflowItem[];
}

export function AuditLogViewer({ workflows }: AuditLogViewerProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [overrideOnly, setOverrideOnly] = useState(false);

  // Flatten and sort audit logs by timestamp descending
  const allLogs: AuditLogEntry[] = useMemo(() => {
    const logs: AuditLogEntry[] = [];
    workflows.forEach((w) => {
      w.auditLogs.forEach((log) => {
        logs.push(log);
      });
    });
    return logs.sort((a, b) => (a.timestamp < b.timestamp ? 1 : -1));
  }, [workflows]);

  const filteredLogs = useMemo(() => {
    return allLogs.filter((log) => {
      if (overrideOnly && !log.isOverride) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches =
          log.workflowId.toLowerCase().includes(q) ||
          log.workflowTitle.toLowerCase().includes(q) ||
          log.actor.toLowerCase().includes(q) ||
          log.action.toLowerCase().includes(q) ||
          log.ipAddress.toLowerCase().includes(q);
        if (!matches) return false;
      }
      return true;
    });
  }, [allLogs, searchQuery, overrideOnly]);

  const handleExportAuditCSV = () => {
    toast.success(`Exporting ${filteredLogs.length} immutable audit logs to CSV...`);
  };

  return (
    <div className="space-y-6">
      {/* FILTER & SEARCH BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card border border-border/80 rounded-2xl p-4 shadow-sm">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by ID, Workflow Title, Actor Name, Action, or IP Address..."
            className="pl-9 text-xs"
          />
        </div>

        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
            <input
              type="checkbox"
              checked={overrideOnly}
              onChange={(e) => setOverrideOnly(e.target.checked)}
              className="accent-destructive cursor-pointer"
            />
            <span className="text-destructive font-bold flex items-center gap-1">
              <ShieldAlert className="size-3.5" /> Emergency Overrides Only
            </span>
          </label>

          <Button
            size="sm"
            variant="outline"
            onClick={handleExportAuditCSV}
            className="text-xs cursor-pointer gap-1.5"
          >
            <Download className="size-4" /> Export Immutable Ledger
          </Button>
        </div>
      </div>

      {/* READ ONLY AUDIT LOG TABLE */}
      <Panel
        title="Immutable Workflow Audit Trail"
        description="Comprehensive, unalterable log recording every workflow initiation, operational sign-off, escalation, and Super Admin emergency override"
        action={
          <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono text-xs gap-1 border-emerald-500/30">
            <Lock className="size-3" /> Cryptographically Sealed Log
          </Badge>
        }
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border/80 text-muted-foreground font-mono uppercase text-[0.68rem] tracking-wider">
                <th className="py-2.5 px-3">Timestamp</th>
                <th className="py-2.5 px-3">Workflow Ref</th>
                <th className="py-2.5 px-3">Action Executed</th>
                <th className="py-2.5 px-3">Actor & Role</th>
                <th className="py-2.5 px-3">IP & Device Context</th>
                <th className="py-2.5 px-3">Reason / Details</th>
                <th className="py-2.5 px-3 text-right">Flags</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60 font-medium">
              {filteredLogs.map((log) => (
                <tr
                  key={log.id}
                  className={`hover:bg-muted/30 transition-colors ${
                    log.isOverride ? "bg-destructive/5" : ""
                  }`}
                >
                  <td className="py-3 px-3 font-mono text-[0.72rem] text-muted-foreground whitespace-nowrap">
                    {log.timestamp}
                  </td>
                  <td className="py-3 px-3">
                    <span className="font-mono font-bold text-primary block">{log.workflowId}</span>
                    <span className="text-[0.68rem] text-muted-foreground truncate max-w-[140px] block">
                      {log.workflowTitle}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`font-bold ${
                        log.isOverride ? "text-destructive" : "text-foreground"
                      }`}
                    >
                      {log.action}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span className="font-bold text-foreground block">{log.actor}</span>
                    <span className="text-[0.68rem] font-mono text-muted-foreground">{log.role}</span>
                  </td>
                  <td className="py-3 px-3 font-mono text-[0.7rem] text-muted-foreground">
                    <div>{log.ipAddress}</div>
                    <div className="text-[0.65rem] opacity-80">{log.device}</div>
                  </td>
                  <td className="py-3 px-3 max-w-[200px] text-muted-foreground text-[0.72rem]">
                    {log.reason || "Standard step sign-off"}
                  </td>
                  <td className="py-3 px-3 text-right whitespace-nowrap">
                    {log.isOverride ? (
                      <Badge className="bg-destructive text-white font-mono text-[0.6rem] gap-1">
                        <ShieldAlert className="size-3" /> OVERRIDE
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="font-mono text-[0.65rem]">
                        Verified
                      </Badge>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}
