import React, { useEffect, useState } from "react";
import { Users, UserPlus, Search, Building2, ShieldCheck, Mail, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { fetchEmployees, type Employee } from "./EmployeeManagementService";

export function EmployeeManagementModuleView() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEmployees()
      .then(setEmployees)
      .finally(() => setLoading(false));
  }, []);

  const filtered = employees.filter(
    (emp) =>
      emp.name.toLowerCase().includes(search.toLowerCase()) ||
      emp.department.toLowerCase().includes(search.toLowerCase()) ||
      emp.designation.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <h1 className="text-2xl font-bold font-display flex items-center gap-2">
            <Users className="size-6 text-primary" /> Employee Management Module
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage staff profiles, department assignments, designations, and HR statuses.
          </p>
        </div>
        <Button className="bg-brand-gradient text-white gap-2 font-semibold shadow-glow">
          <UserPlus className="size-4" /> Add New Employee
        </Button>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Search employees by name, department or designation..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Badge variant="outline" className="font-mono text-xs py-1.5 px-3">
          Total Employees: {filtered.length}
        </Badge>
      </div>

      {loading ? (
        <div className="p-8 text-center text-sm text-muted-foreground">Loading employee roster...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((emp) => (
            <div
              key={emp.id}
              className="p-5 rounded-2xl border border-border/80 bg-card hover:border-primary/50 transition-all shadow-sm space-y-3"
            >
              <div className="flex items-center justify-between">
                <Badge variant="secondary" className="font-mono text-[0.68rem]">
                  {emp.id}
                </Badge>
                <Badge
                  className={
                    emp.status === "Active"
                      ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                      : "bg-amber-500/10 text-amber-600 border-amber-500/20"
                  }
                >
                  {emp.status}
                </Badge>
              </div>

              <div>
                <h3 className="font-bold text-base text-foreground">{emp.name}</h3>
                <p className="text-xs text-primary font-medium">{emp.designation}</p>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-border/50 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Building2 className="size-3.5" /> Department: <span className="font-mono font-semibold text-foreground">{emp.department}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="size-3.5" /> {emp.email}
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="size-3.5" /> Joined: {emp.joinDate}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
