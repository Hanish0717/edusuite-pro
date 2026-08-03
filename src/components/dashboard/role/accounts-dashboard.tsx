import { useMemo } from "react";
import { toast } from "sonner";
import { Wallet, Clock, UserCog, CheckCircle2, Download, FileSpreadsheet } from "lucide-react";

import { KpiCard } from "@/components/dashboard/kpi-card";
import { Panel } from "@/components/dashboard/panel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { fetchAccountsStats, fetchFeeCollections } from "@/lib/roleDashboardService";

export function AccountsDashboard() {
  const stats = useMemo(() => fetchAccountsStats(), []);
  const invoices = useMemo(() => fetchFeeCollections(), []);

  const renderIcon = (name: string) => {
    switch (name) {
      case "Wallet":
        return Wallet;
      case "Clock":
        return Clock;
      case "UserCog":
        return UserCog;
      default:
        return CheckCircle2;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-4">
        <div>
          <h2 className="font-display text-2xl font-extrabold tracking-tight">
            Accounts & Finance Console
          </h2>
          <p className="text-sm text-muted-foreground">
            Scope: Tuition Collections, Payroll Disbursement, Vendor Invoices, Financial Audits.
          </p>
        </div>
        <Badge className="bg-brand-gradient text-white w-fit font-mono">
          ACCOUNTS / FINANCE
        </Badge>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((kpi, idx) => {
          const IconComp = renderIcon(kpi.iconName);
          return (
            <KpiCard
              key={idx}
              label={kpi.label}
              value={kpi.value}
              icon={IconComp}
              tone={kpi.tone}
            />
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Panel title="Recent Fee Collections & Receipts">
            <div className="space-y-3">
              {invoices.map((inv) => (
                <div key={inv.id} className="p-4 rounded-xl border border-border/70 bg-card flex items-center justify-between">
                  <div>
                    <h4 className="font-display text-sm font-bold">{inv.title}</h4>
                    <p className="text-xs text-muted-foreground">{inv.meta}</p>
                  </div>
                  <Badge variant="outline" className="text-xs font-mono">
                    {inv.status}
                  </Badge>
                </div>
              ))}
            </div>
          </Panel>
        </div>

        <div className="space-y-6">
          <Panel title="Finance Actions">
            <div className="space-y-2">
              <Button
                onClick={() => toast.success("Generating monthly payroll disbursement sheet...")}
                className="w-full justify-start bg-brand-gradient text-xs cursor-pointer"
              >
                <FileSpreadsheet className="size-4 mr-2" /> Process Staff Payroll
              </Button>
              <Button
                onClick={() => toast.success("Exporting daily fee collection ledger...")}
                variant="outline"
                className="w-full justify-start text-xs cursor-pointer"
              >
                <Download className="size-4 mr-2" /> Export Financial Audit
              </Button>
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}
