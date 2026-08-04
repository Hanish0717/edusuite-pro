import React, { useState, useMemo } from "react";
import { Search, ChevronLeft, ChevronRight, Download, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface ColumnDef<T> {
  header: string;
  accessorKey?: keyof T;
  render?: (row: T) => React.ReactNode;
  className?: string;
}

interface FilterDef<T> {
  key: keyof T;
  label: string;
  options: string[];
}

interface DataTableProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
  searchKey?: keyof T;
  searchPlaceholder?: string;
  filters?: FilterDef<T>[];
  pagination?: boolean;
  pageSize?: number;
  onExport?: (format: "PDF" | "Excel" | "CSV") => void;
  exportFormats?: ("PDF" | "Excel" | "CSV")[];
}

export function DataTable<T>({
  columns,
  data,
  searchKey,
  searchPlaceholder = "Search records...",
  filters = [],
  pagination = true,
  pageSize = 10,
  onExport,
  exportFormats = ["PDF", "Excel", "CSV"],
}: DataTableProps<T>) {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});

  // Reset pagination on filter or search changes
  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleFilterChange = (key: string, value: string) => {
    setActiveFilters((prev) => ({
      ...prev,
      [key]: value === "ALL" ? "" : value,
    }));
    setCurrentPage(1);
  };

  // Filter and search logic
  const filteredData = useMemo(() => {
    return data.filter((row) => {
      // 1. Search Query Match
      if (searchKey && searchQuery) {
        const value = row[searchKey];
        if (
          !value ||
          !String(value).toLowerCase().includes(searchQuery.toLowerCase())
        ) {
          return false;
        }
      }

      // 2. Active Filters Match
      for (const filter of filters) {
        const activeVal = activeFilters[String(filter.key)];
        if (activeVal) {
          const rowVal = row[filter.key];
          if (String(rowVal) !== activeVal) {
            return false;
          }
        }
      }

      return true;
    });
  }, [data, searchQuery, searchKey, activeFilters, filters]);

  // Pagination logic
  const totalPages = Math.ceil(filteredData.length / pageSize) || 1;
  const paginatedData = useMemo(() => {
    if (!pagination) return filteredData;
    const startIndex = (currentPage - 1) * pageSize;
    return filteredData.slice(startIndex, startIndex + pageSize);
  }, [filteredData, currentPage, pageSize, pagination]);

  return (
    <div className="space-y-4">
      {/* Search, filters, export actions bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-muted/10 p-3 rounded-2xl border border-border/40">
        <div className="flex flex-1 flex-col sm:flex-row items-stretch sm:items-center gap-2">
          {searchKey && (
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/70" />
              <Input
                placeholder={searchPlaceholder}
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-9 h-9"
              />
            </div>
          )}

          {filters.map((filter) => {
            const currentVal = activeFilters[String(filter.key)] || "ALL";
            return (
              <DropdownMenu key={String(filter.key)}>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-9 gap-1.5 cursor-pointer font-semibold">
                    <Filter className="size-4 text-muted-foreground" />
                    {filter.label}: {currentVal === "ALL" ? "All" : currentVal}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuItem
                    onClick={() => handleFilterChange(String(filter.key), "ALL")}
                    className="cursor-pointer font-medium"
                  >
                    All
                  </DropdownMenuItem>
                  {filter.options.map((opt) => (
                    <DropdownMenuItem
                      key={opt}
                      onClick={() => handleFilterChange(String(filter.key), opt)}
                      className="cursor-pointer font-medium"
                    >
                      {opt}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            );
          })}
        </div>

        {onExport && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" className="bg-primary hover:bg-primary/90 text-white font-semibold cursor-pointer gap-1.5 h-9 shadow-[0_2px_8px_rgba(29,78,216,0.15)]">
                <Download className="size-4" /> Export Data
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {exportFormats.map((fmt) => (
                <DropdownMenuItem
                  key={fmt}
                  onClick={() => onExport(fmt)}
                  className="cursor-pointer font-semibold"
                >
                  Export as {fmt}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {/* Main Table */}
      <div className="border border-border/60 rounded-2xl overflow-hidden bg-card shadow-[0_1px_3px_rgba(0,0,0,0.01)]">
        <Table>
          <TableHeader className="bg-muted/40">
            <TableRow>
              {columns.map((col, idx) => (
                <TableHead key={idx} className={col.className}>
                  {col.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center py-10 text-muted-foreground font-semibold">
                  No records found matching query filters.
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((row, rowIdx) => (
                <TableRow key={rowIdx} className="hover:bg-muted/5 transition-colors">
                  {columns.map((col, colIdx) => (
                    <TableCell key={colIdx} className={col.className}>
                      {col.render
                        ? col.render(row)
                        : col.accessorKey
                        ? String(row[col.accessorKey] || "")
                        : null}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      {pagination && filteredData.length > pageSize && (
        <div className="flex items-center justify-between pt-2">
          <span className="text-xs font-semibold text-muted-foreground">
            Showing Page {currentPage} of {totalPages} ({filteredData.length} records)
          </span>
          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="icon"
              className="size-8 cursor-pointer rounded-lg"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
            >
              <ChevronLeft className="size-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="size-8 cursor-pointer rounded-lg"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
            >
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default DataTable;
