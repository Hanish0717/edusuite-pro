import React from "react";
import { GlassCard } from "../cards/GlassCard";

export interface Column<T> {
  header: string;
  accessorKey?: keyof T;
  cell?: (item: T) => React.ReactNode;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  keyExtractor: (item: T) => string;
  emptyText?: string;
}

export function DataTable<T>({
  data,
  columns,
  keyExtractor,
  emptyText = "No rows found",
}: DataTableProps<T>) {
  return (
    <GlassCard className="p-0 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs font-mono border-collapse">
          <thead>
            <tr className="border-b border-border bg-muted/50 text-muted-foreground font-sans font-bold uppercase text-[0.68rem] tracking-wider">
              {columns.map((col, idx) => (
                <th key={idx} className="p-3.5 px-4">
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="p-8 text-center text-muted-foreground font-sans">
                  {emptyText}
                </td>
              </tr>
            ) : (
              data.map((item) => (
                <tr key={keyExtractor(item)} className="hover:bg-muted/30 transition-colors">
                  {columns.map((col, idx) => (
                    <td key={idx} className="p-3.5 px-4">
                      {col.cell ? col.cell(item) : (item[col.accessorKey as keyof T] as React.ReactNode)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </GlassCard>
  );
}
