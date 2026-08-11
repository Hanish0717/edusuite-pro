import React from "react";
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
import { DEPARTMENTS, YEARS } from "../../constants";
import type { StudentRecord } from "../../types";

interface StudentFormProps {
  initialData?: Partial<StudentRecord>;
  onSubmit: (data: Partial<StudentRecord>) => void;
  onCancel: () => void;
  submitLabel?: string;
}

export function StudentForm({
  initialData = {},
  onSubmit,
  onCancel,
  submitLabel = "Submit",
}: StudentFormProps) {
  const [formData, setFormData] = React.useState<Partial<StudentRecord>>({
    rollNo: "",
    fullName: "",
    email: "",
    phone: "",
    gender: "Male",
    department: "CSE",
    academicYear: "Year 1",
    semester: 1,
    batchCode: "2024-2028",
    section: "A",
    cgpa: 8.0,
    attendancePct: 90.0,
    feeStatus: "Paid",
    feeAmount: 85000,
    feePaid: 85000,
    guardianName: "",
    guardianPhone: "",
    status: "Active",
    hostelResident: false,
    transportUser: false,
    placementEligible: false,
    scholarshipStudent: false,
    ...initialData,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold">Roll Number *</Label>
          <Input
            required
            disabled={!!initialData.rollNo}
            placeholder="e.g. 23CSE088"
            value={formData.rollNo || ""}
            onChange={(e) => setFormData({ ...formData, rollNo: e.target.value })}
            className="h-9 text-xs font-mono uppercase"
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs font-semibold">Full Name *</Label>
          <Input
            required
            placeholder="e.g. Siddharth Nambiar"
            value={formData.fullName || ""}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            className="h-9 text-xs"
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs font-semibold">Email Address *</Label>
          <Input
            required
            type="email"
            placeholder="e.g. student@college.edu"
            value={formData.email || ""}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="h-9 text-xs"
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs font-semibold">Phone Number</Label>
          <Input
            placeholder="e.g. +91 9811223344"
            value={formData.phone || ""}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="h-9 text-xs font-mono"
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs font-semibold">Gender</Label>
          <Select
            value={formData.gender}
            onValueChange={(val: any) => setFormData({ ...formData, gender: val })}
          >
            <SelectTrigger className="h-9 text-xs">
              <SelectValue placeholder="Select Gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Male" className="text-xs">Male</SelectItem>
              <SelectItem value="Female" className="text-xs">Female</SelectItem>
              <SelectItem value="Other" className="text-xs">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs font-semibold">Department</Label>
          <Select
            value={formData.department}
            onValueChange={(val) => setFormData({ ...formData, department: val })}
          >
            <SelectTrigger className="h-9 text-xs">
              <SelectValue placeholder="Department" />
            </SelectTrigger>
            <SelectContent>
              {DEPARTMENTS.map((d) => (
                <SelectItem key={d} value={d} className="text-xs">{d}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs font-semibold">Academic Year</Label>
          <Select
            value={formData.academicYear}
            onValueChange={(val) => setFormData({ ...formData, academicYear: val })}
          >
            <SelectTrigger className="h-9 text-xs">
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent>
              {YEARS.map((y) => (
                <SelectItem key={y} value={y} className="text-xs">{y}</SelectItem>
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
            value={formData.semester || 1}
            onChange={(e) => setFormData({ ...formData, semester: Number(e.target.value) })}
            className="h-9 text-xs font-mono"
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs font-semibold">Section</Label>
          <Input
            placeholder="e.g. A"
            value={formData.section || ""}
            onChange={(e) => setFormData({ ...formData, section: e.target.value })}
            className="h-9 text-xs font-mono uppercase"
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs font-semibold">Batch Code</Label>
          <Input
            placeholder="e.g. 2023-2027"
            value={formData.batchCode || ""}
            onChange={(e) => setFormData({ ...formData, batchCode: e.target.value })}
            className="h-9 text-xs font-mono"
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs font-semibold">Guardian Name</Label>
          <Input
            placeholder="e.g. Ramesh Nambiar"
            value={formData.guardianName || ""}
            onChange={(e) => setFormData({ ...formData, guardianName: e.target.value })}
            className="h-9 text-xs"
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs font-semibold">Guardian Phone</Label>
          <Input
            placeholder="e.g. +91 9811200001"
            value={formData.guardianPhone || ""}
            onChange={(e) => setFormData({ ...formData, guardianPhone: e.target.value })}
            className="h-9 text-xs font-mono"
          />
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-3 border-t border-border mt-4">
        <Button type="button" variant="outline" onClick={onCancel} className="text-xs">
          Cancel
        </Button>
        <Button type="submit" className="bg-brand-gradient text-white text-xs font-semibold">
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
