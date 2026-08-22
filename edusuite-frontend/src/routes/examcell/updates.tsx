import { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import api from "@/lib/api";
import { toast } from "sonner";
import { 
  CheckCircle2, 
  Calendar,
  ClipboardCheck,
  User,
  Clock,
  Check,
  Eye,
  XCircle,
  AlertTriangle
} from "lucide-react";
import { useRole } from "@/context/role-context";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import {
  getMockCourses,
  getMockExams,
  saveMockExams,
  getMockTimetables,
  saveMockTimetables,
  MockCourseOffering,
  MockExamSchedule,
  MockExamTimetable
} from "@/lib/mock-examcell-state";

export const Route = createFileRoute("/examcell/updates")({
  head: () => ({
    meta: [{ title: "Exam Cell Updates & Approvals — EduSuite Pro" }],
  }),
  component: ExamCellUpdatesPage,
});

interface CourseGroup {
  department: string;
  year: number;
  semester: number;
  courses: MockCourseOffering[];
}

function ExamCellUpdatesPage() {
  const { flags, role } = useRole();
  const isOfficer = flags.includes("isExamController") || role === "super-admin";

  const [activeTab, setActiveTab] = useState<'courses' | 'exams'>('courses');
  const [courses, setCourses] = useState<MockCourseOffering[]>([]);
  const [exams, setExams] = useState<MockExamSchedule[]>([]);
  const [timetables, setTimetables] = useState<MockExamTimetable[]>([]);
  const [deadlineDates, setDeadlineDates] = useState<Record<string, string>>({});

  // Review & Approval modal states
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedExamForReview, setSelectedExamForReview] = useState<MockExamSchedule | null>(null);
  const [selectedTimetableForReview, setSelectedTimetableForReview] = useState<MockExamTimetable | null>(null);

  // Approve Confirm Dialog
  const [approveConfirmOpen, setApproveConfirmOpen] = useState(false);
  const [isApproving, setIsApproving] = useState(false);

  // Reject Reason Dialog
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectionReasonInput, setRejectionReasonInput] = useState("");
  const [isRejecting, setIsRejecting] = useState(false);

  const loadAllData = async () => {
    try {
      const res = await api.get("/api/exams/courses");
      if (res.data) setCourses(res.data);
    } catch (err) {}

    // Load timetables from API & Fallback
    try {
      const tRes = await api.get("/api/exams/timetables?department=CSE&semester=5");
      if (tRes.data && tRes.data.id) {
        const currentTs = getMockTimetables();
        const nextList = currentTs.filter(t => t.id !== tRes.data.id);
        nextList.push(tRes.data);
        saveMockTimetables(nextList);
        setTimetables(nextList);
      } else {
        setTimetables(getMockTimetables());
      }
    } catch (e) {
      setTimetables(getMockTimetables());
    }

    setExams(getMockExams());
  };

  useEffect(() => {
    loadAllData();
  }, []);

  // Group pending courses by Department + Semester cohort
  const pendingCourses = courses.filter(c => c.status === 'Pending');
  
  const courseGroupsMap: Record<string, CourseGroup> = {};
  pendingCourses.forEach(c => {
    const key = `${c.department}-${c.year}-${c.semester}`;
    if (!courseGroupsMap[key]) {
      courseGroupsMap[key] = {
        department: c.department,
        year: c.year,
        semester: c.semester,
        courses: []
      };
    }
    courseGroupsMap[key].courses.push(c);
  });
  
  const courseGroups = Object.values(courseGroupsMap);

  // Pending exam schedule / timetables awaiting approval
  const pendingExams = exams.filter(e => {
    const associatedTimetable = timetables.find(t => 
      t.examScheduleId === e.id || (t.department === e.department && Number(t.semester) === Number(e.semester))
    );
    return e.status === 'Pending Approval' || (associatedTimetable && (associatedTimetable.status === 'Pending Approval' || associatedTimetable.status === 'Submitted'));
  });

  const handleApproveCourseGroup = async (group: CourseGroup) => {
    if (!isOfficer) {
      toast.error("Access Denied: Only the Exam Officer can approve course offerings.");
      return;
    }
    
    const key = `${group.department}-${group.year}-${group.semester}`;
    const deadline = deadlineDates[key];
    
    if (!deadline) {
      toast.error("Please select an enrollment deadline date first.");
      return;
    }

    try {
      const res = await api.post("/api/exams/courses/approve", {
        department: group.department,
        semester: Number(group.semester),
        deadline
      });
      if (res.status === 200) {
        toast.success(`Approved & published B.Tech ${group.department} Sem ${group.semester} courses to students!`);
        loadAllData();
      }
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to approve course group.");
    }
  };

  const handleDeclineCourseGroup = async (group: CourseGroup) => {
    if (!isOfficer) {
      toast.error("Access Denied: Only the Exam Officer can decline course offerings.");
    }

    try {
      const res = await api.post("/api/exams/courses/decline", {
        department: group.department,
        semester: Number(group.semester)
      });
      if (res.status === 200) {
        toast.success(`Declined and returned B.Tech ${group.department} Sem ${group.semester} courses to drafting.`);
        loadAllData();
      }
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to decline course group.");
    }
  };

  // Open Timetable Review Modal
  const handleOpenReviewModal = (exam: MockExamSchedule) => {
    const associatedTimetable = timetables.find(t => 
      t.examScheduleId === exam.id || (t.department === exam.department && Number(t.semester) === Number(exam.semester))
    );

    setSelectedExamForReview(exam);
    setSelectedTimetableForReview(associatedTimetable || null);
    setReviewModalOpen(true);
  };

  // Execute Officer Approval
  const handleExecuteApproval = async () => {
    if (!selectedExamForReview) return;
    setIsApproving(true);

    try {
      const timetableId = selectedTimetableForReview?.id || `t-${selectedExamForReview.id}`;
      
      // Call backend API
      try {
        await api.post(`/api/exams/timetables/${timetableId}/approve`);
      } catch (e) {}

      // Update local state
      const updatedExams = exams.map(e => 
        e.id === selectedExamForReview.id ? { ...e, status: 'Upcoming' as const } : e
      );
      setExams(updatedExams);
      saveMockExams(updatedExams);

      const updatedTimetables = timetables.map(t => 
        t.id === timetableId || t.examScheduleId === selectedExamForReview.id
          ? { ...t, status: 'Approved' as const, approvedBy: 'Exam Officer', approvedAt: new Date().toISOString() }
          : t
      );
      setTimetables(updatedTimetables);
      saveMockTimetables(updatedTimetables);

      toast.success("Timetable approved and published successfully.");
      setApproveConfirmOpen(false);
      setReviewModalOpen(false);
      loadAllData();
    } catch (err: any) {
      toast.error("Failed to approve timetable.");
    } finally {
      setIsApproving(false);
    }
  };

  // Execute Officer Rejection
  const handleExecuteRejection = async () => {
    if (!selectedExamForReview || !rejectionReasonInput.trim()) {
      toast.error("Please provide a reason for rejection.");
      return;
    }

    setIsRejecting(true);
    try {
      const timetableId = selectedTimetableForReview?.id || `t-${selectedExamForReview.id}`;

      // Call backend API
      try {
        await api.post(`/api/exams/timetables/${timetableId}/reject`, {
          rejectionReason: rejectionReasonInput.trim()
        });
      } catch (e) {}

      // Update local state
      const updatedTimetables = timetables.map(t => 
        t.id === timetableId || t.examScheduleId === selectedExamForReview.id
          ? { 
              ...t, 
              status: 'Rejected' as const, 
              rejectionReason: rejectionReasonInput.trim(),
              rejectedBy: 'Exam Officer', 
              rejectedAt: new Date().toISOString() 
            }
          : t
      );
      setTimetables(updatedTimetables);
      saveMockTimetables(updatedTimetables);

      toast.success("Timetable rejected and returned to assistant for revision.");
      setRejectModalOpen(false);
      setReviewModalOpen(false);
      setRejectionReasonInput("");
      loadAllData();
    } catch (err: any) {
      toast.error("Failed to reject timetable.");
    } finally {
      setIsRejecting(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Title Header */}
      <div className="border-b border-border pb-4">
        <div className="flex items-center justify-between">
          <div className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5 font-mono">
            Examcell <span className="text-[10px]">/</span> <span className="text-foreground font-bold">Updates</span>
          </div>
        </div>
        <h1 className="font-display text-2xl font-extrabold tracking-tight mt-2 text-slate-900">
          Exam Cell Updates & Approvals
        </h1>
        <p className="text-xs text-muted-foreground mt-1 font-medium">
          Review, approve and publish draft course curriculums or scheduled exams waiting for student release.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border/80">
        <button
          onClick={() => setActiveTab('courses')}
          className={`px-4 py-2.5 text-xs font-black border-b-2 transition-all duration-200 cursor-pointer ${
            activeTab === 'courses'
              ? 'border-indigo-600 text-indigo-700 font-extrabold'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          Course Offerings Approvals ({courseGroups.length})
        </button>
        <button
          onClick={() => setActiveTab('exams')}
          className={`px-4 py-2.5 text-xs font-black border-b-2 transition-all duration-200 cursor-pointer ${
            activeTab === 'exams'
              ? 'border-indigo-600 text-indigo-700 font-extrabold'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          Exam Schedule Approvals ({pendingExams.length})
        </button>
      </div>

      {/* Tab Contents */}
      {activeTab === 'courses' && (
        <div className="space-y-6">
          {courseGroups.length === 0 ? (
            <div className="bg-card border border-border/70 rounded-2xl p-12 text-center flex flex-col items-center justify-center min-h-[300px]">
              <div className="size-12 rounded-full border-2 border-emerald-500 bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                <Check className="size-6 stroke-[3px]" />
              </div>
              <h3 className="font-display text-base font-extrabold text-slate-800">All Caught Up!</h3>
              <p className="text-xs text-muted-foreground mt-2 max-w-sm font-semibold">
                There are no course offering approvals pending review from the Assistant at this moment.
              </p>
            </div>
          ) : (
            courseGroups.map((group) => {
              const groupKey = `${group.department}-${group.year}-${group.semester}`;
              return (
                <div key={groupKey} className="bg-card border border-border/70 rounded-2xl shadow-xs p-5 space-y-4">
                  {/* Approval Group Header */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/60 pb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-[10px] font-black uppercase tracking-wider bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-md">
                          {group.department}
                        </span>
                        <span className="text-[10px] font-black uppercase tracking-wider bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md">
                          Sem {group.semester} (Year {group.year})
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-muted-foreground">
                        Drafted {group.courses.length} subjects waiting for release to students.
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                      <div>
                        <label className="text-[9px] font-black text-muted-foreground uppercase tracking-wider block mb-1">
                          Enrollment Deadline <span className="text-red-500">*</span>
                        </label>
                        <Input
                          type="date"
                          value={deadlineDates[groupKey] || ""}
                          onChange={e => setDeadlineDates(prev => ({ ...prev, [groupKey]: e.target.value }))}
                          className="h-9 w-44 text-xs font-semibold rounded-xl bg-card border-border"
                        />
                      </div>
                      
                      <div className="pt-4 flex items-center gap-2">
                        <Button 
                          onClick={() => handleDeclineCourseGroup(group)}
                          className="h-9 bg-white border border-rose-200 hover:bg-rose-50 text-rose-600 text-xs font-extrabold px-4 rounded-xl flex items-center gap-1.5 shadow-xs transition duration-200 cursor-pointer"
                        >
                          Decline & Return to Draft
                        </Button>
                        <Button 
                          onClick={() => handleApproveCourseGroup(group)}
                          className="h-9 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-extrabold px-4 rounded-xl flex items-center gap-1.5 shadow-xs transition duration-200 cursor-pointer"
                        >
                          <ClipboardCheck className="size-4" /> Approve & Publish to Students
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Roster Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50/60 text-slate-500 font-extrabold border-b border-border uppercase tracking-wider">
                        <tr>
                          <th className="px-4 py-3 text-[10px]">Code</th>
                          <th className="px-4 py-3 text-[10px]">Subject Name</th>
                          <th className="px-4 py-3 text-[10px]">Type</th>
                          <th className="px-4 py-3 text-[10px]">Credits</th>
                          <th className="px-4 py-3 text-[10px]">Mentors / Instructors by Section</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/50 font-semibold text-slate-700">
                        {group.courses.map((c) => (
                          <tr key={c.id} className="hover:bg-slate-50/30 transition">
                            <td className="px-4 py-3.5 font-mono font-bold text-slate-900">{c.course_code}</td>
                            <td className="px-4 py-3.5 text-slate-800">{c.course_name}</td>
                            <td className="px-4 py-3.5 text-muted-foreground">Normal Subject</td>
                            <td className="px-4 py-3.5 font-black text-slate-900">{c.credits}.0</td>
                            <td className="px-4 py-3.5">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                {Array.isArray(c.sections) ? c.sections.map((s: any) => (
                                  <span key={s.section} className="bg-slate-100/80 border border-slate-200/60 text-slate-700 text-[10px] font-black px-2.5 py-1 rounded-md inline-flex items-center gap-1">
                                    <User className="size-3 text-slate-400" /> Sec {s.section}: {s.mentor_name}
                                  </span>
                                )) : null}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {activeTab === 'exams' && (
        <div className="space-y-6">
          {pendingExams.length === 0 ? (
            <div className="bg-card border border-border/70 rounded-2xl p-12 text-center flex flex-col items-center justify-center min-h-[300px]">
              <div className="size-12 rounded-full border-2 border-emerald-500 bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                <Check className="size-6 stroke-[3px]" />
              </div>
              <h3 className="font-display text-base font-extrabold text-slate-800">All Timetables Approved</h3>
              <p className="text-xs text-muted-foreground mt-2 max-w-sm font-semibold">
                There are no examination schedule approvals waiting for review at this moment.
              </p>
            </div>
          ) : (
            pendingExams.map((ex) => {
              const associatedTimetable = timetables.find(t => 
                t.examScheduleId === ex.id || (t.department === ex.department && Number(t.semester) === Number(ex.semester))
              );

              return (
                <div key={ex.id} className="bg-card border border-border/70 rounded-2xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1 space-y-3">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-[10px] font-black uppercase tracking-wider bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded">
                          {ex.type} Exam
                        </span>
                        <span className="text-[10px] font-extrabold text-muted-foreground">
                          {ex.department} • B.Tech Year {ex.year} (Sem {ex.semester})
                        </span>
                        <Badge className="bg-amber-50 text-amber-800 border-amber-200 text-[10px] font-black">
                          Pending Timetable Approval
                        </Badge>
                      </div>
                      <h4 className="font-display text-sm font-extrabold text-slate-800">{ex.name}</h4>
                      <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1 font-semibold">
                        <Calendar className="size-3.5 text-muted-foreground" />
                        {ex.startDate} to {ex.endDate}
                      </p>
                    </div>

                    {/* Timetable slots summary */}
                    {(!associatedTimetable || associatedTimetable.slots.length === 0) ? (
                      <p className="text-[10px] text-amber-600 font-extrabold italic bg-amber-50 px-2.5 py-1 rounded-md w-fit">
                        No timetable slots configured yet.
                      </p>
                    ) : (
                      <div className="border-t border-border/60 pt-3 space-y-2">
                        <p className="text-[10px] font-black uppercase tracking-wider text-indigo-700">
                          Timetable slots submitted by Exam Assistant ({associatedTimetable.slots.length} subjects):
                        </p>
                        <div className="grid gap-2 sm:grid-cols-2 max-w-2xl">
                          {associatedTimetable.slots.slice(0, 4).map((slot: any, index: number) => (
                            <div key={index} className="p-2 rounded-xl bg-slate-50 border border-border/50 text-[10px] font-semibold text-slate-800">
                              <div className="font-extrabold text-slate-900">
                                <span className="text-indigo-700 font-mono font-black">{slot.subjectCode}</span>: {slot.subjectName}
                              </div>
                              <div className="text-slate-500 font-medium mt-0.5">
                                {slot.examDate} • {slot.sessionSlot}
                              </div>
                              <div className="text-indigo-600 font-bold">
                                Halls: {slot.halls?.join(", ") || "Block A - Room 101"}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <Button 
                      onClick={() => handleOpenReviewModal(ex)}
                      className="h-9.5 bg-[#6366f1] hover:bg-indigo-700 text-white text-xs font-black px-4 rounded-xl flex items-center gap-1.5 shadow-xs transition duration-200 cursor-pointer whitespace-nowrap"
                    >
                      <Eye className="size-4" /> Review Timetable
                    </Button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* 1. OFFICER REVIEW TIMETABLE MODAL */}
      <Dialog open={reviewModalOpen} onOpenChange={setReviewModalOpen}>
        <DialogContent className="max-w-4xl rounded-2xl p-6">
          <DialogHeader className="border-b pb-3">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-black uppercase tracking-wider bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded">
                OFFICER REVIEW
              </span>
              <Badge className="bg-amber-50 text-amber-800 border-amber-200 text-[10px] font-black">
                Pending Approval
              </Badge>
            </div>
            <DialogTitle className="text-base font-extrabold text-slate-900">
              {selectedExamForReview?.name}
            </DialogTitle>
            <DialogDescription className="text-xs font-semibold text-muted-foreground">
              Review exam timetable dates, session timings, duration, and room allocations submitted by the Exam Assistant.
            </DialogDescription>
          </DialogHeader>

          {/* Timetable Slots Table Matrix */}
          <div className="py-3">
            {!selectedTimetableForReview || selectedTimetableForReview.slots.length === 0 ? (
              <p className="text-xs text-amber-600 font-bold py-4 text-center">No timetable slots configured for this exam schedule.</p>
            ) : (
              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="min-w-full divide-y divide-slate-100 text-xs">
                  <thead className="bg-slate-50 text-slate-650 font-black uppercase text-[9px] tracking-wider">
                    <tr>
                      <th className="px-4 py-3 text-left">Subject Code</th>
                      <th className="px-4 py-3 text-left">Subject Name</th>
                      <th className="px-4 py-3 text-center">Exam Date</th>
                      <th className="px-4 py-3 text-center">Timing / Session</th>
                      <th className="px-4 py-3 text-center">Duration</th>
                      <th className="px-4 py-3 text-left">Halls Allocated</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white font-semibold text-slate-700">
                    {selectedTimetableForReview.slots.map((slot, index) => (
                      <tr key={index} className="hover:bg-slate-50/50 transition">
                        <td className="px-4 py-3 font-mono font-black text-indigo-700">{slot.subjectCode}</td>
                        <td className="px-4 py-3 font-bold text-slate-900">{slot.subjectName}</td>
                        <td className="px-4 py-3 text-center font-mono font-bold">{slot.examDate}</td>
                        <td className="px-4 py-3 text-center font-semibold text-slate-600">{slot.sessionSlot}</td>
                        <td className="px-4 py-3 text-center font-bold">{slot.duration || "3 Hours"}</td>
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap gap-1">
                            {(slot.halls || ["Block A - Room 101"]).map(h => (
                              <span key={h} className="bg-indigo-50 text-indigo-800 text-[10px] font-black px-2 py-0.5 rounded border border-indigo-200">
                                {h}
                              </span>
                            ))}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <DialogFooter className="border-t pt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setReviewModalOpen(false)}
              className="text-xs font-bold rounded-xl"
            >
              Cancel
            </Button>
            
            <div className="flex items-center gap-2">
              <Button
                type="button"
                onClick={() => setRejectModalOpen(true)}
                className="bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 text-xs font-extrabold rounded-xl h-9.5 px-4 cursor-pointer"
              >
                <XCircle className="size-4 mr-1" /> Reject Timetable
              </Button>
              <Button
                type="button"
                onClick={() => setApproveConfirmOpen(true)}
                className="bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-extrabold rounded-xl h-9.5 px-4 shadow-sm cursor-pointer"
              >
                <ClipboardCheck className="size-4 mr-1" /> Approve Timetable
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 2. APPROVE CONFIRMATION DIALOG */}
      <Dialog open={approveConfirmOpen} onOpenChange={setApproveConfirmOpen}>
        <DialogContent className="max-w-md rounded-2xl p-6">
          <DialogHeader className="border-b pb-3">
            <DialogTitle className="text-base font-extrabold text-emerald-700 flex items-center gap-2">
              <CheckCircle2 className="size-5 text-emerald-600" /> Approve & Publish Timetable?
            </DialogTitle>
          </DialogHeader>
          <DialogDescription className="py-2 text-xs font-semibold text-slate-700 leading-relaxed">
            Are you sure you want to approve and publish this examination timetable?
            <br /><br />
            Publishing will make the exam schedule and room allocations immediately available to students in <strong>{selectedExamForReview?.department} Sem {selectedExamForReview?.semester}</strong>.
          </DialogDescription>
          <DialogFooter className="pt-2 gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setApproveConfirmOpen(false)}
              className="text-xs font-bold rounded-xl"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleExecuteApproval}
              disabled={isApproving}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold rounded-xl px-4 cursor-pointer"
            >
              {isApproving ? "Publishing..." : "Approve & Publish"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 3. REJECTION REASON MODAL */}
      <Dialog open={rejectModalOpen} onOpenChange={setRejectModalOpen}>
        <DialogContent className="max-w-md rounded-2xl p-6">
          <DialogHeader className="border-b pb-3">
            <DialogTitle className="text-base font-extrabold text-rose-600 flex items-center gap-2">
              <AlertTriangle className="size-5" /> Reject Examination Timetable
            </DialogTitle>
          </DialogHeader>
          <div className="py-3 space-y-2">
            <label className="text-xs font-bold text-slate-700 block">
              Reason for rejection <span className="text-red-500">*</span>
            </label>
            <textarea
              value={rejectionReasonInput}
              onChange={e => setRejectionReasonInput(e.target.value)}
              placeholder="e.g. Hall allocation conflict on 14-Aug-2026 for CS302. Please re-assign to Block B."
              className="w-full h-24 p-3 text-xs font-semibold border rounded-xl bg-card focus:outline-none focus:ring-1 focus:ring-rose-500"
              required
            />
          </div>
          <DialogFooter className="pt-2 gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setRejectModalOpen(false)}
              className="text-xs font-bold rounded-xl"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleExecuteRejection}
              disabled={isRejecting}
              className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-extrabold rounded-xl px-4 cursor-pointer"
            >
              {isRejecting ? "Submitting..." : "Submit Rejection"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}
