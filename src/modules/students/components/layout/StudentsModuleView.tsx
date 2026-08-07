import React from "react";
import { Users, LayoutDashboard, Database } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useStudents } from "../../hooks/useStudents";
import { Dashboard } from "../../pages/Dashboard";
import { Students } from "../../pages/Students";

export function StudentsModuleView() {
  const {
    students,
    allStudents,
    loading,
    filters,
    setFilters,
    refresh,
    createStudent,
    updateStudent,
    deleteStudent,
    promoteStudent,
    transferStudent,
  } = useStudents();

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-primary/10 text-primary border border-primary/20 shrink-0">
            <Users className="size-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-bold font-display tracking-tight text-foreground">
                Students & Student Lifecycle Management
              </h1>
              <Badge variant="outline" className="font-mono text-xs text-primary border-primary/30">
                Institutional Central Registry
              </Badge>
            </div>
            <p className="text-xs md:text-sm text-muted-foreground mt-0.5">
              Comprehensive student roster, academic GPA tracking, attendance alerts, and fee ledgers.
            </p>
          </div>
        </div>
      </div>

      {/* Main Module Tabs */}
      <Tabs defaultValue="registry" className="space-y-4">
        <TabsList className="bg-muted/40 border border-border/60 p-1 rounded-xl">
          <TabsTrigger value="dashboard" className="text-xs gap-1.5 px-3 py-1.5">
            <LayoutDashboard className="size-3.5" /> Dashboard Insights
          </TabsTrigger>
          <TabsTrigger value="registry" className="text-xs gap-1.5 px-3 py-1.5">
            <Database className="size-3.5" /> Student Registry
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-4">
          <Dashboard students={allStudents} />
        </TabsContent>

        <TabsContent value="registry" className="space-y-4">
          <Students
            students={students}
            allStudents={allStudents}
            loading={loading}
            filters={filters}
            setFilters={setFilters}
            refresh={refresh}
            createStudent={createStudent}
            updateStudent={updateStudent}
            deleteStudent={deleteStudent}
            promoteStudent={promoteStudent}
            transferStudent={transferStudent}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
