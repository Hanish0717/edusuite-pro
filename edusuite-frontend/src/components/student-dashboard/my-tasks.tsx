import React from "react";
import { TaskItem } from "./types";
import { CheckSquare, ArrowUpRight, AlertCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MyTasksProps {
  tasks: TaskItem[];
  onNavigate: (url: string) => void;
}

export const MyTasks: React.FC<MyTasksProps> = ({ tasks, onNavigate }) => {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-foreground flex items-center gap-2">
          <CheckSquare className="h-4 w-4 text-primary" /> My Action Tasks ({tasks.length})
        </h3>
        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
          Action Required
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="flex items-center justify-between p-3 rounded-xl border border-border bg-muted/20 hover:bg-muted/40 transition-colors"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-foreground line-clamp-1">{task.title}</span>
                {task.urgent && (
                  <AlertCircle className="h-3.5 w-3.5 text-red-500 shrink-0" />
                )}
              </div>
              <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                <span className="px-1.5 py-0.2 rounded bg-background border border-border font-medium">{task.category}</span>
                <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> Due {task.dueDate}</span>
              </div>
            </div>

            <Button
              variant="default"
              size="sm"
              onClick={() => onNavigate(task.linkUrl)}
              className="h-8 px-3 text-xs gap-1 shrink-0"
            >
              Go <ArrowUpRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};
