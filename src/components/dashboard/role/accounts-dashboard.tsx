import {
  Wallet,
  FileSpreadsheet,
  CheckCircle2,
  TrendingUp,
  Download,
  Plus,
} from "lucide-react";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { Panel } from "@/components/dashboard/panel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function AccountsDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-4">
        <div>
          <h2 className="font-display text-2xl font-extrabold tracking-tight">
            Accounts & Finance Management Console
          </h2>
          <p className="text-sm text-muted-foreground">
            Scope: Financial Operations, Fee Invoicing, Payroll Disbursement, GST & Tax Filings, Audit Ledgers.
          </p>
        </div>
        <Badge className="bg-brand-gradient text-white w-fit font-mono">
          ACCOUNTS & FINANCE
        </Badge>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Fee Revenue (YTD)" value="Rs 12.45 Cr" icon={Wallet} tone="success" />
        <KpiCard label="Monthly Payroll Status" value="Rs 84.5 L Disbursed" icon={CheckCircle2} tone="info" />
        <KpiCard label="Pending Fee Dues" value="Rs 18.2 L" icon={TrendingUp} tone="warning" />
        <KpiCard label="GST Tax Filings" value="Compliant (Q1)" icon={FileSpreadsheet} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Panel title="Recent Transactions & Invoices">
            <div className="space-y-3">
              {[
                { txId: "TXN-2026-9041", desc: "B.Tech Sem 6 Tuition Fee — K. Sai Teja", amount: "Rs 65,000", mode: "Razorpay Online", status: "Success" },
                { txId: "TXN-2026-9042", desc: "Hostel & Mess Fee Receipt — Rohan V.", amount: "Rs 42,000", mode: "Bank Transfer", status: "Success" },
                { txId: "TXN-2026-9043", desc: "Vendor PO Disbursement — Dell Systems", amount: "Rs 2,45,000", mode: "NEFT Ledger", status: "Disbursed" },
              ].map((tx) => (
                <div key={tx.txId} className="p-4 rounded-xl border border-border/70 bg-card flex items-center justify-between">
                  <div>
                    <h4 className="font-display text-sm font-bold">{tx.desc}</h4>
                    <p className="text-xs text-muted-foreground">ID: {tx.txId} | Mode: {tx.mode}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-sm text-emerald-600">{tx.amount}</p>
                    <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[0.65rem] font-mono">
                      {tx.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </Panel>
        </div>

        <div className="space-y-6">
          <Panel title="Accounts Actions">
            <div className="space-y-2">
              <Button className="w-full justify-start bg-brand-gradient text-xs cursor-pointer">
                <Plus className="size-4 mr-2" /> Issue Fee Receipt
              </Button>
              <Button variant="outline" className="w-full justify-start text-xs cursor-pointer">
                <Download className="size-4 mr-2" /> Export GST & Tax Audit Ledger
              </Button>
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}
