import React from "react";
import { LayoutDashboard, Database, Box } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useModule } from "../../hooks/useModule";
import { Dashboard } from "../../pages/Dashboard";
import { RecordsList } from "../../pages/RecordsList";

export function ModuleView() {
  const { records, loading, deleteRecord } = useModule();

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-primary/10 text-primary border border-primary/20 shrink-0">
            <Box className="size-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-bold tracking-tight">Module Workspace</h1>
              <Badge variant="outline">Template v2</Badge>
            </div>
            <p className="text-xs md:text-sm text-muted-foreground mt-0.5">
              Standardized workspace template for administrative registers.
            </p>
          </div>
        </div>
      </div>

      <Tabs defaultValue="registry" className="space-y-4">
        <TabsList className="bg-muted/40 border border-border/60 p-1 rounded-xl">
          <TabsTrigger value="dashboard" className="text-xs gap-1.5 px-3 py-1.5">
            <LayoutDashboard className="size-3.5" /> Dashboard
          </TabsTrigger>
          <TabsTrigger value="registry" className="text-xs gap-1.5 px-3 py-1.5">
            <Database className="size-3.5" /> Registry
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-4">
          <Dashboard records={records} />
        </TabsContent>

        <TabsContent value="registry" className="space-y-4">
          <RecordsList records={records} loading={loading} onDelete={deleteRecord} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
