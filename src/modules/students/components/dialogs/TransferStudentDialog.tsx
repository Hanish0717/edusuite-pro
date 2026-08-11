import React, { useState } from "react";
import { ArrowRightLeft } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { DEPARTMENTS } from "../../constants";
import type { StudentRecord } from "../../types";

interface TransferStudentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  student: StudentRecord | null;
  onConfirm: (dept: string, section: string) => void;
}

export function TransferStudentDialog({
  open,
  onOpenChange,
  student,
  onConfirm,
}: TransferStudentDialogProps) {
  const [dept, setDept] = useState(student?.department || "CSE");
  const [section, setSection] = useState(student?.section || "A");

  React.useEffect(() => {
    if (student) {
      setDept(student.department);
      setSection(student.section);
    }
  }, [student]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm(dept, section);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold flex items-center gap-2">
            <ArrowRightLeft className="size-5 text-primary" /> Transfer Student
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground pt-1">
            Update department and class section mappings for **{student?.fullName}**. This creates an audit trail event.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Target Department</Label>
              <Select value={dept} onValueChange={setDept}>
                <SelectTrigger className="h-9 text-xs">
                  <SelectValue placeholder="Select Department" />
                </SelectTrigger>
                <SelectContent>
                  {DEPARTMENTS.map((d) => (
                    <SelectItem key={d} value={d} className="text-xs">
                      {d}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Target Section</Label>
              <Input
                required
                value={section}
                onChange={(e) => setSection(e.target.value.toUpperCase())}
                placeholder="e.g. B"
                className="h-9 text-xs font-mono uppercase"
              />
            </div>
          </div>

          <DialogFooter className="pt-3 border-t border-border mt-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button type="submit" className="bg-brand-gradient text-white text-xs font-semibold">
              Apply Transfer
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
