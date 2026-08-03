import React, { useEffect, useState } from "react";
import {
  BarChart3,
  Download,
  FileSpreadsheet,
  RefreshCw,
  Search,
  CheckCircle2,
  FileText,
  PieChart,
  TrendingUp,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

import {
  fetchAnalyticsReports,
  INITIAL_REPORTS,
  type AnalyticsReport,
} from "./ReportsService";

export function ReportsModuleView() {
  const [reports, setReports] = useState<AnalyticsReport[]>(INITIAL_REPORTS);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const loadData = async () => {
    setLoading(true);
    const data = await fetchAnalyticsReports();
    setReports(data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const filtered = reports.filter(
    (r) =>
      r.reportName.toLowerCase().includes(search.toLowerCase()) ||
      r.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleDownload = (name: string, format: string) => {
    toast.success(`Downloading ${name} (${format})...`);
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-primary/10 text-primary border border-primary/20 shrink-0">
            <BarChart3 className="size-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-bold font-display tracking-tight text-foreground">
                Institutional Reports & BI Analytics
              </h1>
              <Badge variant="outline" className="font-mono text-xs text-primary border-primary/30">
                Executive Intelligence
              </Badge>
            </div>
            <p className="text-xs md:text-sm text-muted-foreground mt-0.5">
              Automated reporting for Academic Performance, NAAC AQAR Compliance, Financial Ledgers, and NIRF Audit.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 self-start sm:self-auto">
          <Button variant="outline" size="sm" onClick={loadData} disabled={loading} className="h-9 gap-2 text-xs font-medium">
            <RefreshCw className={`size-3.5 ${loading ? "animate-spin" : ""}`} /> Refresh
          </Button>
          <Button size="sm" onClick={() => toast.success("Generating Custom BI Report...")} className="h-9 bg-brand-gradient text-white gap-2 text-xs font-semibold shadow-glow">
            <FileSpreadsheet className="size-4" /> Generate BI Report
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-sm space-y-1">
          <p className="text-xs font-semibold text-muted-foreground uppercase">Available Reports</p>
          <p className="text-2xl font-bold font-mono text-primary">24 Ready</p>
          <p className="text-[0.68rem] text-muted-foreground">Automated Daily Sync</p>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-sm space-y-1">
          <p className="text-xs font-semibold text-muted-foreground uppercase">Scheduled Syncs</p>
          <p className="text-2xl font-bold font-mono text-emerald-600">12 Active</p>
          <p className="text-[0.68rem] text-emerald-600 font-medium">Auto Email Broadcasts</p>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-sm space-y-1">
          <p className="text-xs font-semibold text-muted-foreground uppercase">NAAC Compliance</p>
          <p className="text-2xl font-bold font-mono text-purple-600">100% AQAR Ready</p>
          <p className="text-[0.68rem] text-muted-foreground">Grade A++ Standards</p>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-sm space-y-1">
          <p className="text-xs font-semibold text-muted-foreground uppercase">Total Downloads</p>
          <p className="text-2xl font-bold font-mono text-amber-600">616 Exports</p>
          <p className="text-[0.68rem] text-muted-foreground">This Academic Term</p>
        </div>
      </div>

      <div className="rounded-2xl border border-border/80 bg-card p-5 space-y-4 shadow-sm">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Search reports by title or category..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-9 text-xs"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted/40 border-b border-border text-muted-foreground font-semibold uppercase tracking-wider text-[0.68rem]">
              <tr>
                <th className="py-3 px-3">Report ID</th>
                <th className="py-3 px-3">Report Title</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3">Generated Date</th>
                <th className="py-3 px-3">Format</th>
                <th className="py-3 px-3">Total Downloads</th>
                <th className="py-3 px-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filtered.map((r) => (
                <tr key={r.id} className="hover:bg-muted/20 transition-colors">
                  <td className="py-3 px-3 font-mono font-bold text-foreground">{r.id}</td>
                  <td className="py-3 px-3 font-bold text-foreground">{r.reportName}</td>
                  <td className="py-3 px-3"><Badge variant="outline" className="font-mono text-xs">{r.category}</Badge></td>
                  <td className="py-3 px-3 font-mono text-muted-foreground">{r.generatedDate}</td>
                  <td className="py-3 px-3 font-mono font-bold text-primary">{r.format}</td>
                  <td className="py-3 px-3 font-mono">{r.downloads}</td>
                  <td className="py-3 px-3">
                    <Button size="sm" variant="ghost" onClick={() => handleDownload(r.reportName, r.format)} className="h-7 text-xs text-primary gap-1">
                      <Download className="size-3.5" /> Download
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
