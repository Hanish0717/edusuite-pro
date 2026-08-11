import React from "react";
import { FolderOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = "No records found",
  description = "No matching items fit your active search or filter criteria.",
  actionText,
  onAction,
  icon,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center border-2 border-dashed border-border rounded-3xl bg-card/50 space-y-3">
      <div className="size-16 rounded-3xl bg-primary/10 text-primary grid place-items-center mb-1">
        {icon || <FolderOpen className="size-8" />}
      </div>
      <h3 className="font-extrabold text-lg text-foreground">{title}</h3>
      <p className="text-xs text-muted-foreground max-w-sm">{description}</p>
      {actionText && onAction && (
        <Button onClick={onAction} className="bg-[#2563EB] text-white font-bold h-9 rounded-xl px-4 mt-2">
          {actionText}
        </Button>
      )}
    </div>
  );
};
