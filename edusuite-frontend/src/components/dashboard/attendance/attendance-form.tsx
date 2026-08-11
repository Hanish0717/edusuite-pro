import { useState } from "react";
import { Check, X, Clock, Award, ShieldAlert, CheckSquare, RefreshCw, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import type { TimetableSlot, StudentAttendance } from "@/data/faculty-mock-data";

interface AttendanceFormProps {
  slot: TimetableSlot;
  students: StudentAttendance[];
  onSubmit: (presentRolls: string[], absentRolls: string[]) => void;
  onCancel: () => void;
}

type AttendanceChoice = "P" | "A" | "L" | "OD" | "ML";

export function AttendanceForm({ slot, students, onSubmit, onCancel }: AttendanceFormProps) {
  // Local state holding the choice for each student roll number
  const [choices, setChoices] = useState<Record<string, AttendanceChoice>>(
    students.reduce((acc, stud) => {
      acc[stud.rollNumber] = "P"; // default present
      return acc;
    }, {} as Record<string, AttendanceChoice>)
  );

  const handleChoiceChange = (roll: string, choice: AttendanceChoice) => {
    setChoices((prev) => ({ ...prev, [roll]: choice }));
  };

  const handleMarkAll = (choice: AttendanceChoice) => {
    setChoices(
      students.reduce((acc, stud) => {
        acc[stud.rollNumber] = choice;
        return acc;
      }, {} as Record<string, AttendanceChoice>)
    );
    toast.success(`Marked all students as ${choice === "P" ? "Present" : "Absent"}`);
  };

  const handleReset = () => {
    setChoices(
      students.reduce((acc, stud) => {
        acc[stud.rollNumber] = "P";
        return acc;
      }, {} as Record<string, AttendanceChoice>)
    );
    toast.info("Selections reset to Present.");
  };

  const handleSubmitForm = () => {
    const presentRolls: string[] = [];
    const absentRolls: string[] = [];

    Object.entries(choices).forEach(([roll, val]) => {
      if (val === "P" || val === "L" || val === "OD") {
        presentRolls.push(roll);
      } else {
        absentRolls.push(roll);
      }
    });

    toast.success("Attendance submitted successfully!", {
      description: `Report: ${presentRolls.length} Present, ${absentRolls.length} Absent.`,
    });
    onSubmit(presentRolls, absentRolls);
  };

  // Ratios for summaries
  const totalCount = students.length;
  const presentCount = Object.values(choices).filter((v) => v === "P" || v === "L" || v === "OD").length;
  const absentCount = totalCount - presentCount;

  return (
    <div className="bg-card border rounded-3xl p-5 shadow-card space-y-6 text-xs">
      {/* Header bar with slot properties */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-border pb-4 gap-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" onClick={onCancel} className="rounded-xl size-9 p-0 hover:bg-muted shrink-0 cursor-pointer">
            <ChevronLeft className="size-5" />
          </Button>
          <div>
            <h3 className="font-extrabold text-sm text-foreground leading-tight">
              Taking Attendance: {slot.subject}
            </h3>
            <p className="text-[0.65rem] text-muted-foreground mt-0.5 font-semibold">
              Section {slot.section} &middot; Period: {slot.time}
            </p>
          </div>
        </div>

        {/* Present counts ratio */}
        <div className="flex items-center gap-4 bg-muted/40 px-4 py-2 rounded-2xl border text-[0.68rem] font-bold">
          <div className="flex items-center gap-1"><Check className="size-4 text-emerald-500" /> Present: <span className="text-foreground">{presentCount}</span></div>
          <div className="flex items-center gap-1"><X className="size-4 text-rose-500" /> Absent: <span className="text-foreground">{absentCount}</span></div>
          <div className="text-primary">Ratio: {Math.round((presentCount / totalCount) * 100)}%</div>
        </div>
      </div>

      {/* Bulk action buttons */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-muted/20 p-3 rounded-2xl border">
        <div className="flex flex-wrap items-center gap-2">
          <Button
            onClick={() => handleMarkAll("P")}
            variant="outline"
            className="rounded-xl cursor-pointer hover:bg-muted text-[0.62rem] h-8"
          >
            <CheckSquare className="size-3.5 mr-1 text-emerald-600" /> Mark All Present
          </Button>
          <Button
            onClick={() => handleMarkAll("A")}
            variant="outline"
            className="rounded-xl cursor-pointer hover:bg-muted text-[0.62rem] h-8"
          >
            <X className="size-3.5 mr-1 text-rose-600" /> Mark All Absent
          </Button>
          <Button
            onClick={handleReset}
            variant="outline"
            className="rounded-xl cursor-pointer hover:bg-muted text-[0.62rem] h-8"
          >
            <RefreshCw className="size-3.5 mr-1 text-primary" /> Reset Selection
          </Button>
        </div>
      </div>

      {/* Student rows deck */}
      <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
        {students.map((stud) => {
          const currentChoice = choices[stud.rollNumber];
          return (
            <div
              key={stud.rollNumber}
              className={`flex flex-col sm:flex-row items-center justify-between p-3.5 rounded-2xl border transition-all duration-200 gap-3 ${currentChoice === "A" || currentChoice === "ML" ? "border-rose-500/20 bg-rose-500/5" : "bg-card hover:bg-muted/20"}`}
            >
              {/* Profile Block */}
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <Avatar className="size-9 rounded-xl shrink-0 border border-border">
                  <AvatarImage src="" />
                  <AvatarFallback className="rounded-xl font-bold bg-primary/10 text-primary text-[0.65rem]">
                    {stud.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <h5 className="font-extrabold text-[0.72rem] text-foreground leading-snug truncate">{stud.name}</h5>
                  <p className="font-mono text-[0.6rem] text-muted-foreground mt-0.5 font-bold">
                    {stud.rollNumber} &middot; Attendance Rate: <span className={stud.percentage < 75 ? "text-rose-600 font-bold" : "text-emerald-600 font-bold"}>{stud.percentage}%</span>
                  </p>
                </div>
              </div>

              {/* Status Radio Choice Selectors */}
              <div className="flex items-center gap-1 w-full sm:w-auto justify-end sm:justify-start">
                {[
                  { value: "P", label: "Present", color: "peer-checked:bg-emerald-500 peer-checked:text-white border-emerald-500/20 text-emerald-600" },
                  { value: "A", label: "Absent", color: "peer-checked:bg-rose-500 peer-checked:text-white border-rose-500/20 text-rose-600" },
                  { value: "L", label: "Late", color: "peer-checked:bg-amber-500 peer-checked:text-white border-amber-500/20 text-amber-600" },
                  { value: "OD", label: "OD", color: "peer-checked:bg-blue-500 peer-checked:text-white border-blue-500/20 text-blue-600" },
                  { value: "ML", label: "ML", color: "peer-checked:bg-purple-500 peer-checked:text-white border-purple-500/20 text-purple-600" },
                ].map((opt) => (
                  <label key={opt.value} className="relative cursor-pointer shrink-0">
                    <input
                      type="radio"
                      name={`attend-${stud.rollNumber}`}
                      value={opt.value}
                      checked={currentChoice === opt.value}
                      onChange={() => handleChoiceChange(stud.rollNumber, opt.value as AttendanceChoice)}
                      className="sr-only peer"
                    />
                    <div className={`px-2.5 py-1 rounded-xl border text-[0.62rem] font-extrabold transition-all duration-200 hover:bg-muted text-center min-w-[36px] select-none ${opt.color}`}>
                      {opt.value}
                    </div>
                  </label>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Submittal Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t border-border/40">
        <Button
          onClick={onCancel}
          variant="outline"
          className="rounded-xl cursor-pointer hover:bg-muted text-xs h-9 px-4 font-semibold"
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmitForm}
          className="rounded-xl bg-brand-gradient shadow-glow cursor-pointer text-xs h-9 px-5 font-bold"
        >
          Submit Attendance
        </Button>
      </div>
    </div>
  );
}
