/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowUpDown,
  Search,
  CheckSquare,
  Square,
  MinusSquare,
  FileSpreadsheet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

export interface ColumnDef<T> {
  header: string;
  accessorKey: keyof T | string;
  cell?: (row: T) => React.ReactNode;
  sortable?: boolean;
}

interface BulkActionDef<T> {
  label: string;
  onClick: (selected: T[]) => void;
  icon?: any;
  tone?: "primary" | "destructive" | "secondary";
}

interface DataTableProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
  searchPlaceholder?: string;
  searchKey?: keyof T; // Key to filter data by
  pagination?: boolean;
  pageSize?: number;
  bulkActions?: BulkActionDef<T>[];
  className?: string;
}

export function DataTable<T>({
  columns,
  data,
  searchPlaceholder = "Search records...",
  searchKey,
  pagination = true,
  pageSize = 5,
  bulkActions = [],
  className,
}: DataTableProps<T>) {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [sortKey, setSortKey] = React.useState<string | null>(null);
  const [sortOrder, setSortOrder] = React.useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = React.useState(1);
  const [selectedIds, setSelectedIds] = React.useState<Set<number | string>>(new Set());

  // 1. Reset selection on query changes
  React.useEffect(() => {
    setSelectedIds(new Set());
  }, [searchQuery]);

  // 2. Filter data
  const filteredData = React.useMemo(() => {
    return data.filter((row: any) => {
      if (!searchQuery) return true;
      if (searchKey) {
        return String(row[searchKey]).toLowerCase().includes(searchQuery.toLowerCase());
      }
      // Global search across all fields
      return Object.values(row).some((val) =>
        String(val).toLowerCase().includes(searchQuery.toLowerCase()),
      );
    });
  }, [data, searchQuery, searchKey]);

  // 3. Sort data
  const sortedData = React.useMemo(() => {
    if (!sortKey) return filteredData;
    const sorted = [...filteredData].sort((a: any, b: any) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortOrder === "asc" ? aVal - bVal : bVal - aVal;
      }
      return sortOrder === "asc"
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal));
    });
    return sorted;
  }, [filteredData, sortKey, sortOrder]);

  // 4. Paginate data
  const totalPages = Math.ceil(sortedData.length / pageSize);
  const paginatedData = React.useMemo(() => {
    if (!pagination) return sortedData;
    const start = (currentPage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, currentPage, pageSize, pagination]);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  // Row selection helpers (requires each row to have a unique 'id' or we fallback to index)
  const getRowId = (row: any, index: number): string | number => {
    return row.id !== undefined ? row.id : index;
  };

  const handleSelectRow = (rowId: string | number) => {
    const next = new Set(selectedIds);
    if (next.has(rowId)) {
      next.delete(rowId);
    } else {
      next.add(rowId);
    }
    setSelectedIds(next);
  };

  const handleSelectAll = () => {
    const allIdsOnPage = paginatedData.map((row, idx) => getRowId(row, idx));
    const allSelected = allIdsOnPage.every((id) => selectedIds.has(id));
    const next = new Set(selectedIds);

    if (allSelected) {
      allIdsOnPage.forEach((id) => next.delete(id));
    } else {
      allIdsOnPage.forEach((id) => next.add(id));
    }
    setSelectedIds(next);
  };

  const getSelectedRows = (): T[] => {
    return data.filter((row, idx) => selectedIds.has(getRowId(row, idx)));
  };

  const isAllSelected =
    paginatedData.length > 0 &&
    paginatedData.every((row, idx) => selectedIds.has(getRowId(row, idx)));
  const isSomeSelected =
    paginatedData.length > 0 &&
    paginatedData.some((row, idx) => selectedIds.has(getRowId(row, idx))) &&
    !isAllSelected;

  return (
    <div className={cn("space-y-4", className)}>
      {/* Search and Bulk Actions Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-8 h-9 rounded-xl"
          />
        </div>

        {/* Bulk Action Buttons */}
        {selectedIds.size > 0 && bulkActions.length > 0 && (
          <div className="flex items-center gap-2 animate-fade-in bg-primary/5 px-3 py-1.5 rounded-xl border border-primary/20">
            <span className="text-xs font-semibold text-primary">{selectedIds.size} Selected</span>
            <div className="h-4 w-px bg-primary/20 mx-1" />
            <div className="flex items-center gap-1.5">
              {bulkActions.map((action, idx) => {
                const Icon = action.icon;
                return (
                  <Button
                    key={idx}
                    variant={
                      action.tone === "destructive"
                        ? "destructive"
                        : action.tone === "secondary"
                          ? "outline"
                          : "default"
                    }
                    size="sm"
                    className="h-7 text-xs px-2.5 rounded-lg"
                    onClick={() => action.onClick(getSelectedRows())}
                  >
                    {Icon && <Icon className="mr-1 size-3.5" />}
                    {action.label}
                  </Button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Main Table */}
      <div className="rounded-xl border border-border overflow-hidden bg-card">
        <Table>
          <TableHeader className="bg-muted/40">
            <TableRow>
              {bulkActions.length > 0 && (
                <TableHead className="w-12 text-center">
                  <button
                    type="button"
                    onClick={handleSelectAll}
                    className="text-muted-foreground hover:text-primary transition-colors mt-1"
                  >
                    {isAllSelected ? (
                      <CheckSquare className="size-4.5 text-primary" />
                    ) : isSomeSelected ? (
                      <MinusSquare className="size-4.5 text-primary" />
                    ) : (
                      <Square className="size-4.5" />
                    )}
                  </button>
                </TableHead>
              )}
              {columns.map((col, idx) => (
                <TableHead key={idx}>
                  {col.sortable ? (
                    <button
                      type="button"
                      onClick={() => handleSort(col.accessorKey as string)}
                      className="flex items-center gap-1.5 font-bold hover:text-foreground transition-colors"
                    >
                      {col.header}
                      <ArrowUpDown className="size-3" />
                    </button>
                  ) : (
                    <span className="font-bold">{col.header}</span>
                  )}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length > 0 ? (
              paginatedData.map((row: any, idx) => {
                const rowId = getRowId(row, idx);
                const isSelected = selectedIds.has(rowId);
                return (
                  <TableRow
                    key={rowId}
                    className={cn(
                      "hover:bg-accent/10 transition-colors",
                      isSelected && "bg-primary/5 hover:bg-primary/10",
                    )}
                  >
                    {bulkActions.length > 0 && (
                      <TableCell className="text-center py-3">
                        <button
                          type="button"
                          onClick={() => handleSelectRow(rowId)}
                          className={cn(
                            "text-muted-foreground hover:text-primary transition-colors mt-0.5",
                            isSelected && "text-primary",
                          )}
                        >
                          {isSelected ? (
                            <CheckSquare className="size-4.5" />
                          ) : (
                            <Square className="size-4.5" />
                          )}
                        </button>
                      </TableCell>
                    )}
                    {columns.map((col, cIdx) => (
                      <TableCell key={cIdx} className="py-3">
                        {col.cell ? col.cell(row) : String(row[col.accessorKey as keyof T])}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length + (bulkActions.length > 0 ? 1 : 0)}
                  className="h-32 text-center text-muted-foreground text-sm font-medium"
                >
                  No matching records found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      {pagination && totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-border/50 pt-4 px-1">
          <span className="text-xs text-muted-foreground">
            Showing Page <b>{currentPage}</b> of <b>{totalPages}</b> (
            {(currentPage - 1) * pageSize + 1} -{" "}
            {Math.min(currentPage * pageSize, sortedData.length)} of {sortedData.length} records)
          </span>
          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="icon"
              className="size-8 rounded-lg"
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
            >
              <ChevronsLeft className="size-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="size-8 rounded-lg"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="size-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="size-8 rounded-lg"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="size-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="size-8 rounded-lg"
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
            >
              <ChevronsRight className="size-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
