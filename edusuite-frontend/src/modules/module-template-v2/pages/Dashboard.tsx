import React from "react";
import type { ModuleRecord } from "../types";

interface DashboardProps {
  records: ModuleRecord[];
}

export function Dashboard({ records }: DashboardProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="p-5 rounded-2xl border border-border/80 bg-card shadow-sm">
        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total Records</h4>
        <p className="text-2xl font-bold mt-2">{records.length}</p>
      </div>
      <div className="p-5 rounded-2xl border border-border/80 bg-card shadow-sm">
        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Active Operational Ratio</h4>
        <p className="text-2xl font-bold mt-2">100%</p>
      </div>
      <div className="p-5 rounded-2xl border border-border/80 bg-card shadow-sm">
        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Pending Tasks</h4>
        <p className="text-2xl font-bold mt-2">0</p>
      </div>
    </div>
  );
}
