import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { UserCheck, Calendar, Clock, AlertCircle } from "lucide-react";
import { toast } from "sonner";

import { Panel } from "@/components/dashboard/panel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getAcademicDeanDashboardData } from "@/lib/deansService";

export const Route = createFileRoute("/staff/academic-dean/assign-substitute")({
  head: () => ({
    meta: [{ title: "Assign Substitute Faculty — Academic Dean" }],
  }),
  component: AssignSubstitutePage,
});

function AssignSubstitutePage() {
  const data = useMemo(() => getAcademicDeanDashboardData(), []);
  const [date, setDate] = useState("2026-08-10");
  const [period, setPeriod] = useState("Period 2 (10:00 AM - 11:00 AM)");
  const [originalFaculty, setOriginalFaculty] = useState(data.facultyList[1]?.name || "");
  const [substituteFaculty, setSubstituteFaculty] = useState(data.facultyList[2]?.name || "");
  const [reason, setReason] = useState("Attending National AI Conference");

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!originalFaculty || !substituteFaculty) {
      toast.error("Please select both original and substitute faculty");
      return;
    }
    toast.success(`Successfully assigned ${substituteFaculty} as substitute for ${originalFaculty} on ${date} (${period})!`);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Assign Substitute Faculty</h1>
        <p className="text-sm text-muted-foreground">
          Reassign class slots to available substitute faculty members and update the master timetable.
        </p>
      </div>

      <Panel title="Faculty Substitution Form" description="Fill details to schedule and authorize substitute teaching assignments.">
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Select Date</Label>
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="h-9 text-xs font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Select Class Period</Label>
              <Select value={period} onValueChange={setPeriod}>
                <SelectTrigger className="h-9 text-xs">
                  <SelectValue placeholder="Select Period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Period 1 (09:00 AM - 10:00 AM)">Period 1 (09:00 AM - 10:00 AM)</SelectItem>
                  <SelectItem value="Period 2 (10:00 AM - 11:00 AM)">Period 2 (10:00 AM - 11:00 AM)</SelectItem>
                  <SelectItem value="Period 3 (11:15 AM - 12:15 PM)">Period 3 (11:15 AM - 12:15 PM)</SelectItem>
                  <SelectItem value="Period 4 (12:15 PM - 01:15 PM)">Period 4 (12:15 PM - 01:15 PM)</SelectItem>
                  <SelectItem value="Period 5 (02:00 PM - 03:00 PM)">Period 5 (02:00 PM - 03:00 PM)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Original Faculty Member</Label>
              <Select value={originalFaculty} onValueChange={setOriginalFaculty}>
                <SelectTrigger className="h-9 text-xs">
                  <SelectValue placeholder="Select Original Faculty" />
                </SelectTrigger>
                <SelectContent>
                  {data.facultyList.map((f) => (
                    <SelectItem key={f.id} value={f.name}>
                      {f.name} ({f.department})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Substitute Faculty Member</Label>
              <Select value={substituteFaculty} onValueChange={setSubstituteFaculty}>
                <SelectTrigger className="h-9 text-xs">
                  <SelectValue placeholder="Select Substitute Faculty" />
                </SelectTrigger>
                <SelectContent>
                  {data.facultyList.map((f) => (
                    <SelectItem key={f.id} value={f.name}>
                      {f.name} ({f.department})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Reason for Substitution</Label>
            <Input
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Enter reason (e.g. Leave, Conference, Official Duty)..."
              className="h-9 text-xs"
            />
          </div>

          <div className="pt-2">
            <Button type="submit" className="bg-brand-gradient text-xs cursor-pointer gap-1.5 w-full sm:w-auto">
              <UserCheck className="size-4" /> Save & Authorize Substitution
            </Button>
          </div>
        </form>
      </Panel>
    </div>
  );
}
