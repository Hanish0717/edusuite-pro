import { useState } from "react";
import { Panel } from "@/components/dashboard/panel";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CalendarRange,
  CheckCircle2,
  Clock,
  UserCheck,
  UserX,
  UserPlus,
  History,
  Users,
  Search,
  BookOpen,
  Calendar,
} from "lucide-react";
import { toast } from "sonner";
import {
  INITIAL_DEAN_TIMETABLE,
  DEPARTMENT_FACULTY_LIST,
  INITIAL_SUBSTITUTIONS,
  MOCK_STUDENTS_CLASS,
  type DeanTimetableSlot,
  type SubstitutionRecord,
} from "../services/deanFacultyService";

interface DeanFacultyOperationsProps {
  deanTitle: string;
  activeSubTab?: "timetable" | "classes" | "attendance" | "dept-timetables" | "substitute" | "history";
}

export function DeanFacultyOperations({ deanTitle, activeSubTab = "timetable" }: DeanFacultyOperationsProps) {
  const [tab, setTab] = useState<string>(activeSubTab);
  const [mySlots, setMySlots] = useState<DeanTimetableSlot[]>(INITIAL_DEAN_TIMETABLE);
  const [substitutions, setSubstitutions] = useState<SubstitutionRecord[]>(INITIAL_SUBSTITUTIONS);

  // Attendance state
  const [selectedClassForAttendance, setSelectedClassForAttendance] = useState<DeanTimetableSlot | null>(
    mySlots[0] || null
  );
  const [studentList, setStudentList] = useState(MOCK_STUDENTS_CLASS);

  // Substitution Modal State
  const [isSubModalOpen, setIsSubModalOpen] = useState(false);
  const [selectedSlotForSub, setSelectedSlotForSub] = useState<DeanTimetableSlot | null>(null);
  const [substituteFaculty, setSubstituteFaculty] = useState("");
  const [subReason, setSubReason] = useState("");
  const [subDate, setSubDate] = useState("2026-08-05");

  // Selected faculty for Department Timetable viewer
  const [selectedDeptFaculty, setSelectedDeptFaculty] = useState("fac-1");
  const [deptSearch, setDeptSearch] = useState("");

  const handleMarkStatus = (studentId: string, newStatus: "Present" | "Absent" | "Late") => {
    setStudentList((prev) =>
      prev.map((s) => (s.id === studentId ? { ...s, status: newStatus } : s))
    );
  };

  const handleSaveAttendance = () => {
    if (!selectedClassForAttendance) return;
    const presentCount = studentList.filter((s) => s.status === "Present" || s.status === "Late").length;
    toast.success(
      `Attendance Saved! Class: ${selectedClassForAttendance.subjectCode} (${presentCount}/${studentList.length} present)`
    );
  };

  const handleOpenAssignSub = (slot?: DeanTimetableSlot) => {
    if (slot) setSelectedSlotForSub(slot);
    else setSelectedSlotForSub(mySlots[0] || null);
    setIsSubModalOpen(true);
  };

  const handleConfirmSubstitution = () => {
    if (!selectedSlotForSub) {
      toast.error("Please select a timetable slot");
      return;
    }
    if (!substituteFaculty) {
      toast.error("Please select a substitute faculty");
      return;
    }
    if (!subReason.trim()) {
      toast.error("Please enter a reason for substitution");
      return;
    }

    const facultyObj = DEPARTMENT_FACULTY_LIST.find((f) => f.id === substituteFaculty);
    const subName = facultyObj ? facultyObj.name : substituteFaculty;

    const newRecord: SubstitutionRecord = {
      id: `SUB-${1000 + substitutions.length + 1}`,
      originalFaculty: `${deanTitle} (You)`,
      substituteFaculty: subName,
      date: subDate,
      period: selectedSlotForSub.period,
      subject: `${selectedSlotForSub.subjectCode} - ${selectedSlotForSub.subjectName}`,
      branchSection: `${selectedSlotForSub.branch} Sem ${selectedSlotForSub.semester} - ${selectedSlotForSub.section}`,
      reason: subReason,
      status: "Assigned",
      createdAt: new Date().toISOString().replace("T", " ").substring(0, 16),
    };

    // Update timetable slot state
    setMySlots((prev) =>
      prev.map((s) =>
        s.id === selectedSlotForSub.id
          ? { ...s, assignedFaculty: subName, isSubstituted: true }
          : s
      )
    );

    setSubstitutions([newRecord, ...substitutions]);
    setIsSubModalOpen(false);
    setSubReason("");
    toast.success(
      `Class substitute assigned! ${subName} will take ${selectedSlotForSub.subjectCode} on ${subDate}`
    );
  };

  const activeDeptFacultyObj = DEPARTMENT_FACULTY_LIST.find((f) => f.id === selectedDeptFaculty);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <BookOpen className="size-5 text-primary" />
            Dean as Faculty Operational Console
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Teaching duties, class scheduling, attendance tracking & substitute faculty management for {deanTitle}
          </p>
        </div>
        <Button onClick={() => handleOpenAssignSub()} className="gap-2 shadow-sm">
          <UserPlus className="size-4" />
          Assign Substitute Faculty
        </Button>
      </div>

      <Tabs value={tab} onValueChange={setTab} className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-6 w-full h-auto p-1 bg-muted/60">
          <TabsTrigger value="timetable" className="text-xs py-2 gap-1.5">
            <CalendarRange className="size-3.5" />
            My Timetable
          </TabsTrigger>
          <TabsTrigger value="classes" className="text-xs py-2 gap-1.5">
            <Clock className="size-3.5" />
            My Classes
          </TabsTrigger>
          <TabsTrigger value="attendance" className="text-xs py-2 gap-1.5">
            <UserCheck className="size-3.5" />
            Take Attendance
          </TabsTrigger>
          <TabsTrigger value="dept-timetables" className="text-xs py-2 gap-1.5">
            <Users className="size-3.5" />
            Faculty Timetables
          </TabsTrigger>
          <TabsTrigger value="substitute" className="text-xs py-2 gap-1.5">
            <UserPlus className="size-3.5" />
            Assign Substitute
          </TabsTrigger>
          <TabsTrigger value="history" className="text-xs py-2 gap-1.5">
            <History className="size-3.5" />
            Assignment History
          </TabsTrigger>
        </TabsList>

        {/* 1. MY TIMETABLE */}
        <TabsContent value="timetable" className="mt-4 space-y-4">
          <Panel
            title={`${deanTitle} — Personal Faculty Weekly Timetable`}
            description="Your assigned teaching schedule across branches and sections"
          >
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30">
                    <TableHead className="font-semibold text-xs">Day</TableHead>
                    <TableHead className="font-semibold text-xs">Time Period</TableHead>
                    <TableHead className="font-semibold text-xs">Subject & Code</TableHead>
                    <TableHead className="font-semibold text-xs">Class / Section</TableHead>
                    <TableHead className="font-semibold text-xs">Venue</TableHead>
                    <TableHead className="font-semibold text-xs">Status / Faculty</TableHead>
                    <TableHead className="font-semibold text-xs text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mySlots.map((slot) => (
                    <TableRow key={slot.id} className="hover:bg-muted/20">
                      <TableCell className="font-bold text-xs">{slot.day}</TableCell>
                      <TableCell className="text-xs font-mono text-muted-foreground">{slot.period}</TableCell>
                      <TableCell>
                        <div className="font-semibold text-xs text-foreground">{slot.subjectName}</div>
                        <span className="text-[0.65rem] font-mono text-primary">{slot.subjectCode}</span>
                      </TableCell>
                      <TableCell className="text-xs">
                        {slot.branch} Sem {slot.semester} ({slot.section})
                      </TableCell>
                      <TableCell className="text-xs font-medium text-muted-foreground">{slot.room}</TableCell>
                      <TableCell>
                        {slot.isSubstituted ? (
                          <Badge variant="outline" className="border-warning text-warning text-[0.68rem]">
                            Substituted to {slot.assignedFaculty}
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[0.68rem]">
                            Taking (Primary)
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleOpenAssignSub(slot)}
                          className="h-7 text-xs text-primary hover:bg-primary/10 gap-1"
                        >
                          <UserPlus className="size-3" /> Substitute
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Panel>
        </TabsContent>

        {/* 2. MY CLASSES */}
        <TabsContent value="classes" className="mt-4 space-y-4">
          <Panel
            title="Today's Scheduled Classes"
            description="Your active teaching sessions for today"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mySlots.slice(0, 3).map((cls, idx) => (
                <div
                  key={cls.id}
                  className="p-4 rounded-xl border border-border bg-card shadow-sm space-y-3 flex flex-col justify-between"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <Badge className="mb-1 text-[0.65rem] bg-primary/10 text-primary border-primary/20">
                        Class #{idx + 1} &middot; {cls.period}
                      </Badge>
                      <h4 className="font-bold text-sm text-foreground">{cls.subjectName}</h4>
                      <p className="text-xs text-muted-foreground">
                        {cls.subjectCode} &bull; {cls.branch} Sem {cls.semester} ({cls.section})
                      </p>
                    </div>
                    <Badge variant="outline" className="text-xs font-mono">
                      {cls.room}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t text-xs">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <Users className="size-3.5" /> 60 Registered Students
                    </span>
                    <Button
                      size="sm"
                      onClick={() => {
                        setSelectedClassForAttendance(cls);
                        setTab("attendance");
                      }}
                      className="h-8 text-xs gap-1.5"
                    >
                      <UserCheck className="size-3.5" /> Open & Mark Attendance
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Panel>
        </TabsContent>

        {/* 3. TAKE ATTENDANCE */}
        <TabsContent value="attendance" className="mt-4 space-y-4">
          <Panel
            title="Class Attendance Marker"
            description={
              selectedClassForAttendance
                ? `Marking attendance for ${selectedClassForAttendance.subjectCode} — ${selectedClassForAttendance.branch} (${selectedClassForAttendance.section})`
                : "Select a class to mark attendance"
            }
          >
            {selectedClassForAttendance && (
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-lg bg-muted/40 text-xs">
                  <div>
                    <span className="font-semibold text-foreground">{selectedClassForAttendance.subjectName}</span>
                    <span className="text-muted-foreground ml-2">({selectedClassForAttendance.period})</span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 text-[0.7rem]"
                      onClick={() => setStudentList((prev) => prev.map((s) => ({ ...s, status: "Present" })))}
                    >
                      Mark All Present
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 text-[0.7rem]"
                      onClick={() => setStudentList((prev) => prev.map((s) => ({ ...s, status: "Absent" })))}
                    >
                      Mark All Absent
                    </Button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/30">
                        <TableHead className="w-16">#</TableHead>
                        <TableHead>Roll Number</TableHead>
                        <TableHead>Student Name</TableHead>
                        <TableHead className="text-right">Attendance Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {studentList.map((std, idx) => (
                        <TableRow key={std.id} className="hover:bg-muted/20">
                          <TableCell className="text-xs text-muted-foreground">{idx + 1}</TableCell>
                          <TableCell className="text-xs font-mono font-bold">{std.rollNo}</TableCell>
                          <TableCell className="text-xs font-medium">{std.name}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-1.5">
                              <Button
                                size="sm"
                                variant={std.status === "Present" ? "default" : "outline"}
                                className={`h-7 px-2.5 text-xs ${std.status === "Present" ? "bg-emerald-600 hover:bg-emerald-700 text-white" : ""}`}
                                onClick={() => handleMarkStatus(std.id, "Present")}
                              >
                                <UserCheck className="size-3 mr-1" /> Present
                              </Button>
                              <Button
                                size="sm"
                                variant={std.status === "Absent" ? "destructive" : "outline"}
                                className="h-7 px-2.5 text-xs"
                                onClick={() => handleMarkStatus(std.id, "Absent")}
                              >
                                <UserX className="size-3 mr-1" /> Absent
                              </Button>
                              <Button
                                size="sm"
                                variant={std.status === "Late" ? "secondary" : "outline"}
                                className={`h-7 px-2.5 text-xs ${std.status === "Late" ? "bg-amber-500 text-white" : ""}`}
                                onClick={() => handleMarkStatus(std.id, "Late")}
                              >
                                Late
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                <div className="flex justify-end pt-2">
                  <Button onClick={handleSaveAttendance} className="gap-2 bg-emerald-600 hover:bg-emerald-700">
                    <CheckCircle2 className="size-4" /> Save Class Attendance
                  </Button>
                </div>
              </div>
            )}
          </Panel>
        </TabsContent>

        {/* 4. FACULTY TIMETABLES */}
        <TabsContent value="dept-timetables" className="mt-4 space-y-4">
          <Panel
            title="Department Faculty Timetable Inspector"
            description="View full weekly timetables for all department faculty members"
          >
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                  <Label className="text-xs text-muted-foreground mb-1 block">Select Faculty Member</Label>
                  <Select value={selectedDeptFaculty} onValueChange={setSelectedDeptFaculty}>
                    <SelectTrigger className="h-9 text-xs">
                      <SelectValue placeholder="Select faculty..." />
                    </SelectTrigger>
                    <SelectContent>
                      {DEPARTMENT_FACULTY_LIST.map((fac) => (
                        <SelectItem key={fac.id} value={fac.id} className="text-xs">
                          {fac.name} ({fac.designation} &middot; {fac.dept})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {activeDeptFacultyObj && (
                <div className="p-3 rounded-xl border bg-card/60 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-foreground">{activeDeptFacultyObj.name}</h4>
                      <p className="text-xs text-muted-foreground">
                        {activeDeptFacultyObj.designation} &bull; Dept of {activeDeptFacultyObj.dept}
                      </p>
                    </div>
                    <Badge variant="outline" className="text-xs bg-primary/5 border-primary/20 text-primary font-mono">
                      Total Load: 14 Hrs/Wk
                    </Badge>
                  </div>

                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/40">
                        <TableHead className="text-xs font-semibold">Day</TableHead>
                        <TableHead className="text-xs font-semibold">09:00 - 10:00</TableHead>
                        <TableHead className="text-xs font-semibold">10:15 - 11:15</TableHead>
                        <TableHead className="text-xs font-semibold">11:15 - 12:15</TableHead>
                        <TableHead className="text-xs font-semibold">02:00 - 03:00</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map((day, di) => (
                        <TableRow key={day} className="hover:bg-muted/10">
                          <TableCell className="text-xs font-bold">{day}</TableCell>
                          <TableCell className="text-xs">
                            {di % 2 === 0 ? (
                              <div>
                                <div className="font-medium text-foreground">CS501 (Sec A)</div>
                                <div className="text-[0.65rem] text-muted-foreground">CR-201</div>
                              </div>
                            ) : (
                              <span className="text-muted-foreground/50 text-[0.7rem]">&mdash; Free &mdash;</span>
                            )}
                          </TableCell>
                          <TableCell className="text-xs">
                            {di % 3 === 0 ? (
                              <div>
                                <div className="font-medium text-foreground">CS503 (Sec B)</div>
                                <div className="text-[0.65rem] text-muted-foreground">Lab-102</div>
                              </div>
                            ) : (
                              <span className="text-muted-foreground/50 text-[0.7rem]">&mdash; Free &mdash;</span>
                            )}
                          </TableCell>
                          <TableCell className="text-xs">
                            {di === 1 || di === 4 ? (
                              <div>
                                <div className="font-medium text-foreground">CS502 (Sec A)</div>
                                <div className="text-[0.65rem] text-muted-foreground">CR-104</div>
                              </div>
                            ) : (
                              <span className="text-muted-foreground/50 text-[0.7rem]">&mdash; Free &mdash;</span>
                            )}
                          </TableCell>
                          <TableCell className="text-xs">
                            {di === 2 ? (
                              <div>
                                <div className="font-medium text-foreground">CS505 (Lab)</div>
                                <div className="text-[0.65rem] text-muted-foreground">Lab-301</div>
                              </div>
                            ) : (
                              <span className="text-muted-foreground/50 text-[0.7rem]">&mdash; Free &mdash;</span>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
          </Panel>
        </TabsContent>

        {/* 5. ASSIGN SUBSTITUTE */}
        <TabsContent value="substitute" className="mt-4 space-y-4">
          <Panel
            title="Assign Substitute Faculty"
            description="Reassign your class slot to another available faculty member"
          >
            <div className="max-w-xl space-y-4">
              <div>
                <Label className="text-xs font-medium text-foreground mb-1 block">Select Class Slot to Substitute</Label>
                <Select
                  value={selectedSlotForSub?.id || ""}
                  onValueChange={(val) => setSelectedSlotForSub(mySlots.find((s) => s.id === val) || null)}
                >
                  <SelectTrigger className="h-9 text-xs">
                    <SelectValue placeholder="Choose a slot..." />
                  </SelectTrigger>
                  <SelectContent>
                    {mySlots.map((s) => (
                      <SelectItem key={s.id} value={s.id} className="text-xs">
                        {s.day} ({s.period}) — {s.subjectCode} {s.subjectName} ({s.branch} {s.section})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-xs font-medium text-foreground mb-1 block">Substitution Date</Label>
                <Input
                  type="date"
                  value={subDate}
                  onChange={(e) => setSubDate(e.target.value)}
                  className="h-9 text-xs"
                />
              </div>

              <div>
                <Label className="text-xs font-medium text-foreground mb-1 block">Select Substitute Faculty Member</Label>
                <Select value={substituteFaculty} onValueChange={setSubstituteFaculty}>
                  <SelectTrigger className="h-9 text-xs">
                    <SelectValue placeholder="Select faculty..." />
                  </SelectTrigger>
                  <SelectContent>
                    {DEPARTMENT_FACULTY_LIST.map((fac) => (
                      <SelectItem key={fac.id} value={fac.id} className="text-xs">
                        {fac.name} ({fac.designation} &middot; {fac.dept})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-xs font-medium text-foreground mb-1 block">Reason for Substitution</Label>
                <Input
                  placeholder="e.g. Official Dean Meeting, Academic Senate Session"
                  value={subReason}
                  onChange={(e) => setSubReason(e.target.value)}
                  className="h-9 text-xs"
                />
              </div>

              <Button onClick={handleConfirmSubstitution} className="w-full gap-2 mt-2">
                <UserPlus className="size-4" /> Save Substitution Assignment
              </Button>
            </div>
          </Panel>
        </TabsContent>

        {/* 6. ASSIGNMENT HISTORY */}
        <TabsContent value="history" className="mt-4 space-y-4">
          <Panel
            title="Substitution Assignment History"
            description="Log of all faculty class substitution requests and assignments"
          >
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30">
                    <TableHead className="font-semibold text-xs">Record ID</TableHead>
                    <TableHead className="font-semibold text-xs">Original Faculty</TableHead>
                    <TableHead className="font-semibold text-xs">Substitute Faculty</TableHead>
                    <TableHead className="font-semibold text-xs">Date & Period</TableHead>
                    <TableHead className="font-semibold text-xs">Subject & Class</TableHead>
                    <TableHead className="font-semibold text-xs">Reason</TableHead>
                    <TableHead className="font-semibold text-xs">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {substitutions.map((sub) => (
                    <TableRow key={sub.id} className="hover:bg-muted/20">
                      <TableCell className="font-mono text-xs font-bold text-primary">{sub.id}</TableCell>
                      <TableCell className="text-xs font-medium">{sub.originalFaculty}</TableCell>
                      <TableCell className="text-xs font-semibold text-foreground">{sub.substituteFaculty}</TableCell>
                      <TableCell className="text-xs">
                        <div>{sub.date}</div>
                        <span className="text-[0.65rem] text-muted-foreground font-mono">{sub.period}</span>
                      </TableCell>
                      <TableCell className="text-xs">
                        <div className="font-medium text-foreground">{sub.subject}</div>
                        <span className="text-[0.65rem] text-muted-foreground">{sub.branchSection}</span>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground italic max-w-xs truncate">
                        {sub.reason}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            sub.status === "Completed"
                              ? "secondary"
                              : sub.status === "Active"
                              ? "default"
                              : "outline"
                          }
                          className="text-[0.68rem]"
                        >
                          {sub.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Panel>
        </TabsContent>
      </Tabs>

      {/* Quick Substitute Dialog */}
      <Dialog open={isSubModalOpen} onOpenChange={setIsSubModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold">Assign Substitute Faculty</DialogTitle>
            <DialogDescription className="text-xs">
              Reassign class slot to another department faculty member
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            {selectedSlotForSub && (
              <div className="p-2.5 rounded-lg bg-muted/40 text-xs space-y-1 border">
                <p className="font-bold text-foreground">{selectedSlotForSub.subjectName}</p>
                <p className="text-muted-foreground">
                  {selectedSlotForSub.day} &middot; {selectedSlotForSub.period} &middot; {selectedSlotForSub.branch} Sem {selectedSlotForSub.semester}
                </p>
              </div>
            )}

            <div>
              <Label className="text-xs text-muted-foreground mb-1 block">Date</Label>
              <Input
                type="date"
                value={subDate}
                onChange={(e) => setSubDate(e.target.value)}
                className="h-8 text-xs"
              />
            </div>

            <div>
              <Label className="text-xs text-muted-foreground mb-1 block">Substitute Faculty</Label>
              <Select value={substituteFaculty} onValueChange={setSubstituteFaculty}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue placeholder="Select faculty..." />
                </SelectTrigger>
                <SelectContent>
                  {DEPARTMENT_FACULTY_LIST.map((fac) => (
                    <SelectItem key={fac.id} value={fac.id} className="text-xs">
                      {fac.name} ({fac.designation})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-xs text-muted-foreground mb-1 block">Reason</Label>
              <Input
                placeholder="e.g. Official Meeting"
                value={subReason}
                onChange={(e) => setSubReason(e.target.value)}
                className="h-8 text-xs"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setIsSubModalOpen(false)}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleConfirmSubstitution}>
              Confirm Substitution
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
