import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Users } from "lucide-react";
import { z } from "zod";
import { toast } from "sonner";

import { ModulePage } from "@/components/dashboard/module-page";
import { FormDialog, type FieldConfig } from "@/components/ui/form-dialog";

export const Route = createFileRoute("/super-admin/students")({
  head: () => ({
    meta: [{ title: "Students — EduSuite Pro" }],
  }),
  component: SuperAdminStudentsPage,
});

const studentSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  department: z.string().min(1, "Please select a department"),
  batchCode: z.string().min(4, "Batch code must be at least 4 characters"),
});

const defaultValues = {
  fullName: "",
  email: "",
  phone: "",
  department: "",
  batchCode: "",
};

const fields: FieldConfig[] = [
  {
    name: "fullName",
    label: "Full Name",
    placeholder: "e.g. Sai Teja",
    type: "text",
  },
  {
    name: "email",
    label: "Email Address",
    placeholder: "e.g. sai.teja@student.edu",
    type: "text",
  },
  {
    name: "phone",
    label: "Phone Number",
    placeholder: "e.g. 9876543210",
    type: "text",
  },
  {
    name: "department",
    label: "Department",
    placeholder: "Select Department",
    type: "select",
    options: [
      { label: "Computer Science & Engineering (CSE)", value: "CSE" },
      { label: "Electronics & Communication (ECE)", value: "ECE" },
      { label: "Mechanical Engineering (ME)", value: "ME" },
      { label: "Information Technology (IT)", value: "IT" },
    ],
  },
  {
    name: "batchCode",
    label: "Batch Code",
    placeholder: "e.g. 2022-2026",
    type: "text",
  },
];

function SuperAdminStudentsPage() {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  const handleSubmit = (values: z.infer<typeof studentSchema>) => {
    // Simulate database write
    console.log("Adding student:", values);
    toast.success("Student record created successfully!", {
      description: `${values.fullName} has been enrolled in ${values.department} department.`,
    });
  };

  return (
    <>
      <ModulePage
        title="Students"
        description="Student information and lifecycle"
        icon={Users}
        tabs={["All Students", "Admissions", "Documents"]}
        highlights={[
          { label: "Total", value: "3,240" },
          { label: "New Admissions", value: "612" },
          { label: "At Risk", value: "48" },
          { label: "Alumni", value: "5,120" },
        ]}
        actionText="Add Student"
        onActionClick={() => setIsDialogOpen(true)}
      />

      <FormDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        title="Register New Student"
        description="Fill out the student's profile information to create a new enrollment record."
        schema={studentSchema}
        defaultValues={defaultValues}
        fields={fields}
        onSubmit={handleSubmit}
        submitText="Register Student"
      />
    </>
  );
}
