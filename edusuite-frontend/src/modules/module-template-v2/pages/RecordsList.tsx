import React from "react";
import type { ModuleRecord } from "../types";
import { useModulePermissions } from "../hooks/useModulePermissions";

interface RecordsListProps {
  records: ModuleRecord[];
  loading: boolean;
  onDelete: (id: string) => void;
}

export function RecordsList({ records, loading, onDelete }: RecordsListProps) {
  const { can } = useModulePermissions();

  if (loading) return <div className="text-xs text-muted-foreground">Loading records...</div>;

  return (
    <div className="rounded-2xl border border-border/80 bg-card overflow-hidden shadow-sm">
      <table className="w-full text-left text-xs">
        <thead className="bg-muted/40 border-b border-border text-muted-foreground font-semibold uppercase text-[0.68rem]">
          <tr>
            <th className="py-3 px-4">Code</th>
            <th className="py-3 px-4">Name</th>
            <th className="py-3 px-4">Status</th>
            <th className="py-3 px-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border/60">
          {records.map((r) => (
            <tr key={r.id} className="hover:bg-muted/10 transition-colors">
              <td className="py-3 px-4 font-mono font-bold">{r.code}</td>
              <td className="py-3 px-4">{r.name}</td>
              <td className="py-3 px-4">{r.status}</td>
              <td className="py-3 px-4 text-right">
                {can("DELETE_MODULE") && (
                  <button onClick={() => onDelete(r.id)} className="text-red-500 hover:underline">
                    Delete
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
