import React from "react";
import { Search, Building2, Filter, CreditCard, ShieldCheck } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DEPARTMENTS, YEARS, FEE_STATUSES, STUDENT_STATUSES } from "../../constants";
import type { StudentFilters as Filters } from "../../types";

interface StudentFiltersProps {
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
}

export function StudentFilters({ filters, setFilters }: StudentFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 rounded-2xl bg-card border border-border/80 shadow-sm">
      <div className="flex flex-1 flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
        {/* Search */}
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Search roll number, name, email, guardian..."
            value={filters.search}
            onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
            className="pl-9 h-9 text-xs"
          />
        </div>

        {/* Dept */}
        <Select
          value={filters.department}
          onValueChange={(val) => setFilters((prev) => ({ ...prev, department: val }))}
        >
          <SelectTrigger className="h-9 w-full sm:w-[150px] text-xs">
            <Building2 className="size-3.5 mr-1.5 text-muted-foreground" />
            <SelectValue placeholder="Department" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All" className="text-xs">All Departments</SelectItem>
            {DEPARTMENTS.map((d) => (
              <SelectItem key={d} value={d} className="text-xs">{d}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Year */}
        <Select
          value={filters.academicYear}
          onValueChange={(val) => setFilters((prev) => ({ ...prev, academicYear: val }))}
        >
          <SelectTrigger className="h-9 w-full sm:w-[130px] text-xs">
            <Filter className="size-3.5 mr-1.5 text-muted-foreground" />
            <SelectValue placeholder="Year" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All" className="text-xs">All Years</SelectItem>
            {YEARS.map((y) => (
              <SelectItem key={y} value={y} className="text-xs">{y}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Fee Status */}
        <Select
          value={filters.feeStatus}
          onValueChange={(val) => setFilters((prev) => ({ ...prev, feeStatus: val }))}
        >
          <SelectTrigger className="h-9 w-full sm:w-[140px] text-xs">
            <CreditCard className="size-3.5 mr-1.5 text-muted-foreground" />
            <SelectValue placeholder="Fee Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All" className="text-xs">All Fee Status</SelectItem>
            {FEE_STATUSES.map((f) => (
              <SelectItem key={f} value={f} className="text-xs">{f}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Status */}
        <Select
          value={filters.status}
          onValueChange={(val) => setFilters((prev) => ({ ...prev, status: val }))}
        >
          <SelectTrigger className="h-9 w-full sm:w-[130px] text-xs">
            <ShieldCheck className="size-3.5 mr-1.5 text-muted-foreground" />
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All" className="text-xs">All Statuses</SelectItem>
            {STUDENT_STATUSES.map((s) => (
              <SelectItem key={s} value={s} className="text-xs">{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
