import { Panel } from "@/components/dashboard/panel";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar"; // assume exists
import { toast } from "sonner";
import { ChevronRight } from "lucide-react";
import type { ReactNode } from "react";

interface QuickAction {
  label: string;
  onClick: () => void;
}

interface TableColumn {
  header: string;
  accessor: string;
}

interface DeanCommonSectionsProps {
  quickActions?: QuickAction[];
  tableColumns?: TableColumn[];
  tableData?: Record<string, any>[];
  recentActivities?: { title: string; description: string; time: string }[];
  notifications?: { title: string; time: string }[];
  calendar?: boolean; // show calendar if true
  exportEnabled?: boolean;
}

export function DeanCommonSections({
  quickActions,
  tableColumns,
  tableData,
  recentActivities,
  notifications,
  calendar = false,
  exportEnabled = false,
}: DeanCommonSectionsProps) {
  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      {quickActions && quickActions.length > 0 && (
        <Panel title="Quick Actions" description="Primary operational buttons">
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map((act, i) => (
              <button
                key={i}
                onClick={act.onClick}
                className="flex flex-col items-center justify-center p-3 rounded-2xl border text-center transition-all duration-300 cursor-pointer bg-primary/10 hover:bg-primary/20 text-primary"
              >
                {act.label}
              </button>
            ))}
          </div>
        </Panel>
      )}

      {/* Data Table */}
      {tableColumns && tableData && (
        <Panel title="Data Table" description="Exportable data view">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  {tableColumns.map((col, i) => (
                    <TableHead key={i}>{col.header}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {tableData.map((row, ri) => (
                  <TableRow key={ri} className="hover:bg-muted/40">
                    {tableColumns.map((col, ci) => (
                      <TableCell key={ci}>{row[col.accessor]}</TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {exportEnabled && (
            <div className="mt-3 flex justify-end">
              <Button
                size="sm"
                onClick={() => {
                  toast.success("Export triggered – mock PDF/Excel generated.");
                }}
                variant="outline"
              >
                Export PDF/Excel
              </Button>
            </div>
          )}
        </Panel>
      )}

      {/* Calendar */}
      {calendar && (
        <Panel title="Calendar" description="Important dates and events">
          <Calendar className="rounded-lg border" />
        </Panel>
      )}

      {/* Recent Activities */}
      {recentActivities && recentActivities.length > 0 && (
        <Panel title="Recent Activities" description="Latest actions and logs">
          <div className="space-y-2">
            {recentActivities.map((act, i) => (
              <div key={i} className="flex items-center justify-between p-2 rounded-md bg-muted/20">
                <div>
                  <p className="font-medium text-sm">{act.title}</p>
                  <p className="text-xs text-muted-foreground">{act.description}</p>
                </div>
                <span className="text-xs text-muted-foreground">{act.time}</span>
              </div>
            ))}
          </div>
        </Panel>
      )}

      {/* Notifications */}
      {notifications && notifications.length > 0 && (
        <Panel title="Notifications" description="System alerts and messages">
          <div className="space-y-1">
            {notifications.map((note, i) => (
              <div key={i} className="flex items-center gap-2 p-1 rounded-md hover:bg-muted/30">
                <ChevronRight className="size-4 text-muted-foreground" />
                <span className="font-medium text-sm">{note.title}</span>
                <span className="ml-auto text-xs text-muted-foreground">{note.time}</span>
              </div>
            ))}
          </div>
        </Panel>
      )}
    </div>
  );
}
