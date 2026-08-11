import React, { useState, useEffect } from "react";
import { ModuleService } from "../services/ModuleService";
import type { ModuleRecord } from "../types";

interface RecordDetailProps {
  id: string;
}

export function RecordDetail({ id }: RecordDetailProps) {
  const [record, setRecord] = useState<ModuleRecord | null>(null);

  useEffect(() => {
    ModuleService.getById(id).then(setRecord);
  }, [id]);

  if (!record) return <div className="text-xs text-muted-foreground">Loading details...</div>;

  return (
    <div className="p-5 rounded-2xl border border-border/80 bg-card shadow-sm space-y-4">
      <h3 className="text-lg font-bold">Record Details</h3>
      <div className="grid grid-cols-2 gap-4 text-xs">
        <div>
          <span className="text-muted-foreground block">Code</span>
          <span className="font-bold">{record.code}</span>
        </div>
        <div>
          <span className="text-muted-foreground block">Name</span>
          <span className="font-bold">{record.name}</span>
        </div>
      </div>
    </div>
  );
}

export const pageMeta = {
  title: "Record Detail",
  breadcrumb: ["Records", "Detail"],
};
