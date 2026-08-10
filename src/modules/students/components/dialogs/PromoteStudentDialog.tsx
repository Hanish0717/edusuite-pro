import React, { useState } from "react";
import { Milestone } from "lucide-react";
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
import { YEARS } from "../../constants";
import type { StudentRecord } from "../../types";

interface PromoteStudentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  student: StudentRecord | null;
  onConfirm: (year: string, semester: number) => void;
}

export function PromoteStudentDialog({
  open,
  onOpenChange,
  student,
  onConfirm,
}: PromoteStudentDialogProps) {
  const [year, setYear] = useState(student?.academicYear || "Year 1");
  const [semester, setSemester] = useState(student?.semester || 1);

  React.useEffect(() => {
    if (student) {
      setYear(student.academicYear);
      setSemester(student.semester);
    }
  }, [student]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm(year, semester);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold flex items-center gap-2">
            <Milestone className="size-5 text-primary" /> Promote Student
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground pt-1">
            Advance the academic year and semester standing for **{student?.fullName}**.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Academic Year</Label>
              <Select value={year} onValueChange={setYear}>
                <SelectTrigger className="h-9 text-xs">
                  <SelectValue placeholder="Select Year" />
                </SelectTrigger>
                <SelectContent>
                  {YEARS.map((y) => (
                    <SelectItem key={y} value={y} className="text-xs">
                      {y}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Semester</Label>
              <Input
                type="number"
                min="1"
                max="8"
                required
                value={semester}
                onChange={(e) => setSemester(Number(e.target.value))}
                placeholder="e.g. 5"
                className="h-9 text-xs font-mono"
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
              Apply Promotion
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
