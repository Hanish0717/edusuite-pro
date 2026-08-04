import { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { 
  CheckCircle2, 
  Calendar,
  ClipboardCheck,
  User,
  Clock,
  Check
} from "lucide-react";
import { useRole } from "@/context/role-context";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  getMockCourses,
  saveMockCourses,
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
  const { flags } = useRole();
  const isOfficer = flags.includes("isExamController");

  const [activeTab, setActiveTab] = useState<'courses' | 'exams'>('courses');
  const [courses, setCourses] = useState<MockCourseOffering[]>([]);
  const [exams, setExams] = useState<MockExamSchedule[]>([]);
  const [timetables, setTimetables] = useState<MockExamTimetable[]>([]);
  const [deadlineDates, setDeadlineDates] = useState<Record<string, string>>({});

  // Load from Mock State
  useEffect(() => {
    setCourses(getMockCourses());
    setExams(getMockExams());
    setTimetables(getMockTimetables());
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

  const pendingExams = exams.filter(e => e.status === 'Pending Approval');

  const handleApproveCourseGroup = (group: CourseGroup) => {
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

    // Mark all courses in this group as Approved
    const courseIdsToApprove = group.courses.map(c => c.id);
    const updatedCourses = courses.map(c => 
      courseIdsToApprove.includes(c.id) ? { ...c, status: 'Approved' as const } : c
    );
    
    setCourses(updatedCourses);
    saveMockCourses(updatedCourses);
    
    toast.success(`Approved & published B.Tech ${group.department} Sem ${group.semester} courses to students!`);
  };

  const handleApproveExam = (examId: string) => {
    if (!isOfficer) {
      toast.error("Access Denied: Only the Exam Officer can approve exam timetables.");
      return;
    }

    const updatedExams: MockExamSchedule[] = exams.map(e => 
      e.id === examId ? { ...e, status: 'Upcoming' as const, enrollmentDeadline: new Date().toISOString().split('T')[0] || "" } : e
    );
    
    setExams(updatedExams);
    saveMockExams(updatedExams);

    // ALSO approve the associated timetable
    const updatedTimetables = timetables.map(t => 
      t.examScheduleId === examId ? { ...t, status: 'Approved' as const } : t
    );
    setTimetables(updatedTimetables);
    saveMockTimetables(updatedTimetables);

    // ALSO publish notification to student notifications workspace
    const examObj = exams.find(e => e.id === examId);
    if (examObj) {
      const newNotification = {
        id: Date.now(),
        title: `Exam Timetable Approved: ${examObj.name}`,
        message: `The official examination schedule and timetable for B.Tech ${examObj.department} Year ${examObj.year} Sem ${examObj.semester} have been released. Check Student Portal.`,
        time: "Just now",
        type: "info"
      };

      // Load existing notifications
      const notifData = localStorage.getItem("mock_notifications_v3") || "[]";
      try {
        const parsed = JSON.parse(notifData);
        localStorage.setItem("mock_notifications_v3", JSON.stringify([newNotification, ...parsed]));
      } catch (err) {
        localStorage.setItem("mock_notifications_v3", JSON.stringify([newNotification]));
      }
    }
    
    toast.success("Exam schedule and timetable have been approved and published to student portals!");
  };

  return (
    <div className="space-y-6">
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
              <p className="text-xs text-muted-foreground mt-2 max-w-sm">
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
                      
                      <div className="pt-4">
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
                              <div className="flex items-center gap-1.5">
                                {c.sections.map(sec => (
                                  <span key={sec} className="bg-slate-100/80 border border-slate-200/60 text-slate-700 text-[10px] font-black px-2.5 py-1 rounded-md inline-flex items-center gap-1">
                                    <User className="size-3 text-slate-400" /> Sec {sec}: Dr. John Smith
                                  </span>
                                ))}
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
              <p className="text-xs text-muted-foreground mt-2 max-w-sm">
                There are no examination schedule approvals waiting for review at this moment.
              </p>
            </div>
          ) : (
            pendingExams.map((ex) => (
              <div key={ex.id} className="bg-card border border-border/70 rounded-2xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1 space-y-3">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[10px] font-black uppercase tracking-wider bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded">
                        {ex.type} Exam
                      </span>
                      <span className="text-[10px] font-bold text-muted-foreground">
                        {ex.department} • Year {ex.year} (Sem {ex.semester})
                      </span>
                    </div>
                    <h4 className="font-display text-sm font-extrabold text-slate-800">{ex.name}</h4>
                    <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1 font-semibold">
                      <Calendar className="size-3.5 text-muted-foreground" />
                      {ex.startDate} to {ex.endDate}
                    </p>
                  </div>

                  {/* Timetable slots details if present */}
                  {(() => {
                    const associatedTimetable = timetables.find(t => t.examScheduleId === ex.id);
                    if (!associatedTimetable || associatedTimetable.slots.length === 0) {
                      return (
                        <p className="text-[10px] text-amber-600 font-extrabold italic bg-amber-50 px-2.5 py-1 rounded-md w-fit">
                          No timetable slots configured yet.
                        </p>
                      );
                    }
                    return (
                      <div className="border-t border-border/60 pt-3 space-y-2">
                        <p className="text-[10px] font-black uppercase tracking-wider text-indigo-700">Timetable slots configured by Assistant:</p>
                        <div className="grid gap-2 sm:grid-cols-2 max-w-2xl">
                          {associatedTimetable.slots.map((slot: any, index: number) => (
                            <div key={index} className="p-2 rounded-xl bg-slate-50 border border-border/50 text-[10px] font-semibold text-slate-800">
                              <div className="font-extrabold text-slate-900">
                                Slot #{index + 1}: <span className="text-indigo-650 font-mono font-black">{slot.subjectCode}</span> - {slot.subjectName}
                              </div>
                              <div className="text-slate-500 font-medium mt-0.5">
                                Date: {slot.examDate} | {slot.sessionSlot} | Duration: {slot.duration}
                              </div>
                              <div className="text-indigo-600 font-bold">
                                Rooms: {slot.halls?.join(", ") || "No rooms assigned"}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })()}
                </div>

                <div className="flex items-center">
                  <Button 
                    onClick={() => handleApproveExam(ex.id)}
                    className="h-9 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-black px-4 rounded-xl flex items-center gap-1 shadow-xs transition duration-200 cursor-pointer whitespace-nowrap"
                  >
                    <ClipboardCheck className="size-4" /> Approve Timetable
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
