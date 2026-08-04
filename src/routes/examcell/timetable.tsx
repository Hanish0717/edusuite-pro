import { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { 
  CalendarRange, 
  Plus, 
  Trash2, 
  Info, 
  Save, 
  X,
  FileText,
  MapPin
} from "lucide-react";
import { Panel } from "@/components/dashboard/panel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useRole } from "@/context/role-context";
import {
  getMockExams,
  getMockCourses,
  getMockTimetables,
  saveMockTimetables,
  MockExamSchedule,
  MockCourseOffering,
  MockExamTimetable,
  MockTimetableSlot
} from "@/lib/mock-examcell-state";

export const Route = createFileRoute("/examcell/timetable")({
  head: () => ({
    meta: [{ title: "Exam Timetable Builder — EduSuite Pro" }],
  }),
  component: TimetablePage,
});

function TimetablePage() {
  const { role, flags, department: assistantDept } = useRole();
  const isOfficer = flags.includes("isExamController") || role === "super-admin";
  const activeDeptCode = assistantDept || "CSE";

  // Filter states
  const [selectedDept, setSelectedDept] = useState(activeDeptCode);
  const [selectedYear, setSelectedYear] = useState("3");
  const [selectedSem, setSelectedSem] = useState("5");

  // Loaded database states
  const [exams, setExams] = useState<MockExamSchedule[]>([]);
  const [courses, setCourses] = useState<MockCourseOffering[]>([]);
  const [timetables, setTimetables] = useState<MockExamTimetable[]>([]);

  // Current building slots
  const [slots, setSlots] = useState<MockTimetableSlot[]>([]);
  const [currentHallInput, setCurrentHallInput] = useState<Record<number, string>>({});

  useEffect(() => {
    setExams(getMockExams());
    setCourses(getMockCourses());
    setTimetables(getMockTimetables());
  }, []);

  // Filter selection lock for assistants
  useEffect(() => {
    if (!isOfficer) {
      setSelectedDept(activeDeptCode);
    }
  }, [isOfficer, activeDeptCode]);

  // Find active exam schedule for the current cohort
  const activeSchedule = exams.find(e => 
    e.department === selectedDept && 
    e.year === Number(selectedYear) && 
    e.semester === Number(selectedSem)
  );

  // Find existing timetable draft
  const existingTimetable = activeSchedule 
    ? timetables.find(t => t.examScheduleId === activeSchedule.id)
    : null;

  // Initialize slots when schedule or existing timetable changes
  useEffect(() => {
    if (existingTimetable) {
      setSlots(existingTimetable.slots);
    } else {
      // Pre-fill slots with offered courses for this cohort
      const cohortCourses = courses.filter(c => 
        c.department === selectedDept && 
        c.year === Number(selectedYear) && 
        c.semester === Number(selectedSem)
      );
      
      const initialSlots: MockTimetableSlot[] = cohortCourses.map(c => ({
        subjectCode: c.course_code,
        subjectName: c.course_name,
        examDate: "",
        sessionSlot: "Morning (10:00 AM - 01:00 PM)",
        halls: ["Block A - Room 101"],
        duration: "3 Hours"
      }));

      setSlots(initialSlots);
    }
  }, [selectedDept, selectedYear, selectedSem, existingTimetable, courses]);

  // Filter offered courses to populate subject selection
  const cohortCourses = courses.filter(c => 
    c.department === selectedDept && 
    c.year === Number(selectedYear) && 
    c.semester === Number(selectedSem)
  );

  const handleAddSlot = () => {
    setSlots([
      ...slots,
      {
        subjectCode: "",
        subjectName: "",
        examDate: "",
        sessionSlot: "Morning (10:00 AM - 01:00 PM)",
        halls: [],
        duration: "3 Hours"
      }
    ]);
  };

  const handleDeleteSlot = (index: number) => {
    setSlots(slots.filter((_, i) => i !== index));
  };

  const handleSlotChange = (index: number, field: keyof MockTimetableSlot, value: any) => {
    setSlots(prev => prev.map((slot, idx) => {
      if (idx === index) {
        const updated = { ...slot, [field]: value };
        // Auto-fill subject name if subjectCode changed
        if (field === "subjectCode") {
          const matchingCourse = cohortCourses.find(c => c.course_code === value);
          if (matchingCourse) {
            updated.subjectName = matchingCourse.course_name;
          }
        }
        return updated;
      }
      return slot;
    }));
  };

  const handleAddHall = (slotIndex: number) => {
    const hallName = currentHallInput[slotIndex]?.trim();
    if (!hallName) return;

    const currentHalls = slots[slotIndex].halls || [];
    if (currentHalls.includes(hallName)) {
      toast.error("Hall already added to this slot.");
      return;
    }

    handleSlotChange(slotIndex, "halls", [...currentHalls, hallName]);
    setCurrentHallInput(prev => ({ ...prev, [slotIndex]: "" }));
  };

  const handleRemoveHall = (slotIndex: number, hallName: string) => {
    const currentHalls = slots[slotIndex].halls || [];
    handleSlotChange(slotIndex, "halls", currentHalls.filter(h => h !== hallName));
  };

  const handleSaveTimetable = () => {
    if (!activeSchedule) {
      toast.error("No active exam schedule to save timetable against.");
      return;
    }

    const invalidSlot = slots.find(s => !s.subjectCode || !s.examDate || s.halls.length === 0);
    if (invalidSlot) {
      toast.error("Please fill in subject, date, and assign at least one exam hall for all slots.");
      return;
    }

    // Save or update in localStorage list
    const otherTimetables = timetables.filter(t => t.examScheduleId !== activeSchedule.id);
    const updatedTimetable: MockExamTimetable = {
      id: existingTimetable?.id || `t-${Date.now()}`,
      examScheduleId: activeSchedule.id,
      department: selectedDept,
      year: Number(selectedYear),
      semester: Number(selectedSem),
      status: 'Submitted',
      slots
    };

    const nextTimetables = [...otherTimetables, updatedTimetable];
    setTimetables(nextTimetables);
    saveMockTimetables(nextTimetables);
    toast.success("Timetable saved and submitted to Officer for approval!");
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="border-b border-border pb-4">
        <h1 className="font-display text-2xl font-extrabold tracking-tight text-slate-900">
          Timetable Builder
        </h1>
        <p className="text-xs text-muted-foreground mt-0.5 font-medium">
          Schedule subject-wise theory exams, set examination sessions, and structure final timetables.
        </p>
      </div>

      {/* Cohort Selection Selectors */}
      <Card className="p-4 bg-slate-50/50 border border-slate-200 rounded-2xl shadow-2xs">
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="text-[10px] font-bold text-slate-450 uppercase block mb-1.5">Department</label>
            <select
              value={selectedDept}
              onChange={e => setSelectedDept(e.target.value)}
              disabled={!isOfficer}
              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs font-semibold outline-none cursor-pointer disabled:bg-slate-100 disabled:text-muted-foreground disabled:cursor-not-allowed font-bold"
            >
              <option value="CSE">CSE</option>
              <option value="AIML">AIML</option>
              <option value="AIDS">AIDS</option>
              <option value="ECE">ECE</option>
              <option value="EEE">EEE</option>
              <option value="MECH">MECH</option>
              <option value="CIVIL">CIVIL</option>
              <option value="IT">IT</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-450 uppercase block mb-1.5">Target Year</label>
            <select
              value={selectedYear}
              onChange={e => {
                const yr = e.target.value;
                setSelectedYear(yr);
                const sems = yr === "1" ? [1, 2] : yr === "2" ? [3, 4] : yr === "3" ? [5, 6] : [7, 8];
                setSelectedSem(String(sems[0]));
              }}
              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs font-semibold outline-none cursor-pointer font-bold"
            >
              <option value="1">1st Year</option>
              <option value="2">2nd Year</option>
              <option value="3">3rd Year</option>
              <option value="4">4th Year</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-450 uppercase block mb-1.5">Semester</label>
            <select
              value={selectedSem}
              onChange={e => setSelectedSem(e.target.value)}
              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs font-semibold outline-none cursor-pointer font-bold"
            >
              {(() => {
                const sems = selectedYear === "1" ? [1, 2] : selectedYear === "2" ? [3, 4] : selectedYear === "3" ? [5, 6] : [7, 8];
                return sems.map(s => (
                  <option key={s} value={String(s)}>Sem {s}</option>
                ));
              })()}
            </select>
          </div>
        </div>
      </Card>

      {/* Timetable Configuration Body */}
      {!activeSchedule ? (
        /* State A: No active exam schedule */
        <Card className="bg-card border border-border/70 rounded-2xl p-12 text-center flex flex-col items-center justify-center min-h-[300px] shadow-xs">
          <div className="size-12 rounded-full border-2 border-indigo-100 bg-indigo-50/50 text-indigo-650 flex items-center justify-center mb-4">
            <CalendarRange className="size-6 stroke-[2px]" />
          </div>
          <h3 className="font-display text-sm font-bold text-slate-800 uppercase tracking-wider">No Active Exam Schedule Found</h3>
          <p className="text-xs text-muted-foreground mt-2 max-w-md leading-relaxed">
            There is no exam scheduled for {selectedDept} - Year {selectedYear}, Sem {selectedSem} yet. Please configure the exam schedule under the <strong>"Schedule Exam"</strong> console first.
          </p>
        </Card>
      ) : (
        /* State B: Active schedule editor */
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl border bg-white shadow-xs font-bold text-xs">
            <div className="flex items-center gap-2">
              <span className="text-slate-450 uppercase text-[10px] font-black">Active Schedule:</span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700">
                {activeSchedule.name}
              </span>
              {existingTimetable && (
                <Badge variant="outline" className={`font-extrabold ${
                  existingTimetable.status === 'Approved' 
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                    : 'bg-amber-50 text-amber-800 border-amber-200'
                }`}>
                  Status: {existingTimetable.status === 'Approved' ? 'Approved & Live' : 'Submitted (Awaiting Approval)'}
                </Badge>
              )}
            </div>

            <div className="flex gap-3">
              {(!existingTimetable || existingTimetable.status !== 'Approved') && (
                <>
                  <button
                    onClick={handleAddSlot}
                    className="px-3.5 py-2 border border-indigo-600 text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all cursor-pointer flex items-center gap-1 font-bold"
                  >
                    <Plus className="size-4" /> Add Exam Slot
                  </button>
                  <button
                    onClick={handleSaveTimetable}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-all cursor-pointer flex items-center gap-1 shadow-md font-bold uppercase tracking-wider text-[10px]"
                  >
                    <Save className="size-3.5" /> Save & Submit Timetable
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Slots List */}
          <div className="space-y-6">
            {slots.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground border border-dashed rounded-2xl flex flex-col items-center justify-center gap-2 bg-slate-50/50">
                <FileText className="size-8 text-slate-400" />
                <p className="font-bold text-slate-700">No exam slots created for this timetable yet</p>
                <p className="text-[10px] text-muted-foreground max-w-[280px]">
                  Click <strong>"Add Exam Slot"</strong> above to configure timetables for subjects in this cohort.
                </p>
              </div>
            ) : (
              slots.map((slot, idx) => (
                <Card key={idx} className="p-5 border border-slate-100 bg-white shadow-xs rounded-2xl space-y-4">
                  <div className="flex items-center justify-between border-b pb-3">
                    <span className="text-[10px] font-black uppercase bg-indigo-50 text-indigo-700 px-3 py-1 rounded-md tracking-wider">
                      Exam Slot #{idx + 1}
                    </span>
                    {(!existingTimetable || existingTimetable.status !== 'Approved') && (
                      <button
                        onClick={() => handleDeleteSlot(idx)}
                        className="text-[10px] font-bold text-rose-600 hover:bg-rose-50 px-2.5 py-1.5 rounded-lg flex items-center gap-1 transition"
                      >
                        <Trash2 className="size-4" /> Delete Slot
                      </button>
                    )}
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 text-xs font-semibold text-slate-700">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Subject Code</label>
                      <select
                        value={slot.subjectCode}
                        onChange={e => handleSlotChange(idx, "subjectCode", e.target.value)}
                        disabled={existingTimetable?.status === 'Approved'}
                        className="w-full bg-card border border-border text-foreground rounded-xl px-3 py-2.5 text-xs font-bold focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer disabled:bg-slate-100 disabled:text-muted-foreground"
                      >
                        <option value="">-- Select Subject --</option>
                        {cohortCourses.map(c => (
                          <option key={c.id} value={c.course_code}>{c.course_code} - {c.course_name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Subject Name</label>
                      <Input
                        value={slot.subjectName}
                        onChange={e => handleSlotChange(idx, "subjectName", e.target.value)}
                        disabled={existingTimetable?.status === 'Approved'}
                        placeholder="Subject title"
                        className="h-10 text-xs font-semibold rounded-xl"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Exam Date</label>
                      <Input
                        type="date"
                        value={slot.examDate}
                        onChange={e => handleSlotChange(idx, "examDate", e.target.value)}
                        disabled={existingTimetable?.status === 'Approved'}
                        className="h-10 text-xs font-semibold rounded-xl"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Session Slot</label>
                      <select
                        value={slot.sessionSlot}
                        onChange={e => handleSlotChange(idx, "sessionSlot", e.target.value)}
                        disabled={existingTimetable?.status === 'Approved'}
                        className="w-full bg-card border border-border text-foreground rounded-xl px-3 py-2.5 text-xs font-bold focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer disabled:bg-slate-100 disabled:text-muted-foreground"
                      >
                        <option value="Morning (10:00 AM - 01:00 PM)">Morning (10:00 AM - 01:00 PM)</option>
                        <option value="Afternoon (02:00 PM - 05:00 PM)">Afternoon (02:00 PM - 05:00 PM)</option>
                      </select>
                    </div>

                    <div className="sm:col-span-2 lg:col-span-1">
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Exam Halls</label>
                      <div className="flex gap-2">
                        <Input
                          placeholder="e.g. Block A - Room 101"
                          value={currentHallInput[idx] || ""}
                          onChange={e => setCurrentHallInput(prev => ({ ...prev, [idx]: e.target.value }))}
                          disabled={existingTimetable?.status === 'Approved'}
                          className="h-10 text-xs font-semibold rounded-xl"
                          onKeyDown={e => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddHall(idx);
                            }
                          }}
                        />
                        {(!existingTimetable || existingTimetable.status !== 'Approved') && (
                          <Button 
                            type="button" 
                            onClick={() => handleAddHall(idx)}
                            className="bg-indigo-600 text-white rounded-xl h-10 hover:bg-indigo-700 cursor-pointer font-bold text-xs"
                          >
                            + Add Hall
                          </Button>
                        )}
                      </div>

                      {/* Halls Chip list */}
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {(slot.halls || []).map(hall => (
                          <span 
                            key={hall} 
                            className="bg-indigo-50 border border-indigo-200 text-indigo-750 text-[10px] font-black px-2 py-0.5 rounded-md inline-flex items-center gap-1"
                          >
                            <MapPin className="size-3" /> {hall}
                            {(!existingTimetable || existingTimetable.status !== 'Approved') && (
                              <button 
                                type="button" 
                                onClick={() => handleRemoveHall(idx, hall)}
                                className="hover:text-red-600 transition"
                              >
                                <X className="size-3" />
                              </button>
                            )}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Duration</label>
                      <Input
                        value={slot.duration}
                        onChange={e => handleSlotChange(idx, "duration", e.target.value)}
                        disabled={existingTimetable?.status === 'Approved'}
                        placeholder="3 Hours"
                        className="h-10 text-xs font-semibold rounded-xl"
                      />
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
