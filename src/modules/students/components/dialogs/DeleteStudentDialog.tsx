import React from "react";
import { AlertTriangle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DeleteStudentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  rollNo: string;
  name: string;
  onConfirm: () => void;
}

export function DeleteStudentDialog({
  open,
  onOpenChange,
  rollNo,
  name,
  onConfirm,
}: DeleteStudentDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold flex items-center gap-2 text-destructive">
            <AlertTriangle className="size-5" /> Delete Student Record
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground pt-1">
            Are you sure you want to permanently delete the registry record for **{name} ({rollNo})**?
            This will wipe their academic transcripts, fee records, and integration configurations. This action is irreversible.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="pt-3 border-t border-border mt-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="text-xs"
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={onConfirm}
            className="text-xs font-semibold"
          >
            Delete Student
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
