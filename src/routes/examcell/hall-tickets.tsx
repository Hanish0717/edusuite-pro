import { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { 
  Search, 
  CheckCircle2, 
  Calendar, 
  ShieldCheck, 
  DollarSign, 
  Percent, 
  Info,
  CalendarDays,
  FileCheck2,
  AlertCircle,
  Activity,
  FileText,
  UserCheck
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useRole } from "@/context/role-context";
import { 
  getMockStudents, 
  saveMockStudents, 
  getMockExams, 
  MockStudent, 
  MockExamSchedule 
} from "@/lib/mock-examcell-state";

export const Route = createFileRoute("/examcell/hall-tickets")({
  head: () => ({
    meta: [{ title: "Hall Ticket Authorization & Audit — EduSuite Pro" }],
  }),
  component: HallTicketControlPage,
});

function HallTicketControlPage() {
  const { role, flags, department: userDept } = useRole();
  const isOfficer = role === "staff" && flags.includes("isExamController");

  const [students, setStudents] = useState<MockStudent[]>([]);
  const [exams, setExams] = useState<MockExamSchedule[]>([]);
  
  // Filter states (defaults to user's department branch if available)
  const [department, setDepartment] = useState("AIML");
  const [semesterText, setSemesterText] = useState("Sem 3");
  const [search, setSearch] = useState("");
  const [feeLimitInput, setFeeLimitInput] = useState("0");
  const [feeLimit, setFeeLimit] = useState(0);

  // Officer-specific states
  const [officerTab, setOfficerTab] = useState<'eligible' | 'blocked'>('blocked');
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);

  // Sync state with logged-in user's department once loaded
  useEffect(() => {
    if (userDept) {
      setDepartment(userDept);
    }
  }, [userDept]);

  useEffect(() => {
    setStudents(getMockStudents());
    setExams(getMockExams());
  }, []);

  const semesterNumber = Number(semesterText.replace("Sem ", ""));
  
  // Check if active exam schedule exists
  const activeExam = exams.find(e => 
    e.department === department && 
    e.semester === semesterNumber &&
    (e.status === 'Upcoming' || e.status === 'Completed')
  );

  // Filter students
  const filteredStudents = students.filter(s => 
    s.department === department && 
    s.semester === semesterNumber &&
    (s.full_name.toLowerCase().includes(search.toLowerCase()) ||
     s.roll_number.toLowerCase().includes(search.toLowerCase()))
  );

  // Eligibility criteria check
  const isStudentEligible = (s: MockStudent) => {
    const attendanceOk = (s.attendance_percentage || 0) >= 75;
    const feesOk = (s.fee_balance || 0) <= feeLimit;
    const registeredOk = s.is_registered;
    return attendanceOk && feesOk && registeredOk;
  };

  const handleSetFeeLimit = () => {
    const limit = Number(feeLimitInput) || 0;
    setFeeLimit(limit);
    toast.success(`Maximum allowed fee due limit updated to INR ${limit.toLocaleString()}`);
  };

  const handleApproveSingle = (studentId: string) => {
    const updated = students.map(s => 
      s.id === studentId ? { ...s, hall_ticket_status: 'Generated' as const } : s
    );
    setStudents(updated);
    saveMockStudents(updated);
    toast.success("Hall ticket generated successfully!");
  };

  const handleApproveAllEligible = () => {
    let count = 0;
    const updated = students.map(s => {
      if (s.department === department && s.semester === semesterNumber) {
        if (isStudentEligible(s) && s.hall_ticket_status !== 'Generated') {
          count++;
          return { ...s, hall_ticket_status: 'Generated' as const };
        }
      }
      return s;
    });

    if (count === 0) {
      toast.info("No eligible students found awaiting hall ticket generation.");
      return;
    }

    setStudents(updated);
    saveMockStudents(updated);
    toast.success(`Successfully generated hall tickets for ${count} eligible students!`);
  };

  // Officer-specific splits
  const eligibleOfficerStudents = filteredStudents.filter(s => isStudentEligible(s) || s.hall_ticket_status === 'Generated');
  const blockedOfficerStudents = filteredStudents.filter(s => !isStudentEligible(s) && s.hall_ticket_status !== 'Generated');

  const selectedStudent = students.find(s => s.id === selectedStudentId);

  // Fallback selected student if current selection is cleared/empty
  useEffect(() => {
    if (blockedOfficerStudents.length > 0 && (!selectedStudentId || !blockedOfficerStudents.some(s => s.id === selectedStudentId))) {
      setSelectedStudentId(blockedOfficerStudents[0].id);
    }
  }, [selectedStudentId, blockedOfficerStudents]);

  // RENDERING OFFICER WORK-BOARD
  if (isOfficer) {
    return (
      <div className="space-y-6 pb-12">
        {/* Page Header */}
        <div className="border-b border-border pb-4">
          <div className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5 font-mono">
            Officer Portal <span className="text-[10px]">/</span> <span className="text-foreground font-bold">Hall Ticket Audit</span>
          </div>
          <h1 className="font-display text-2xl font-extrabold tracking-tight mt-2 text-slate-900">
            Hall Ticket Override & Dues Audit
          </h1>
          <p className="text-xs text-muted-foreground mt-1 font-medium">
            Review and clear students blocked by financial dues, shortage of attendance, or course registration deficits.
          </p>
        </div>

        {/* Filter Card */}
        <Card className="bg-card border border-border/70 p-5 rounded-2xl shadow-xs">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <label className="text-xs font-bold text-muted-foreground block mb-1">Department</label>
              <select
                value={department}
                disabled={!!userDept}
                onChange={e => setDepartment(e.target.value)}
                className="w-full bg-card border border-border text-foreground rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
              >
                {userDept ? (
                  <option value={userDept}>{userDept}</option>
                ) : (
                  <>
                    <option value="AIML">AIML</option>
                    <option value="CSE">CSE</option>
                    <option value="AIDS">AIDS</option>
                    <option value="ECE">ECE</option>
                    <option value="EEE">EEE</option>
                  </>
                )}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-muted-foreground block mb-1">Semester</label>
              <select
                value={semesterText}
                onChange={e => setSemesterText(e.target.value)}
                className="w-full bg-card border border-border text-foreground rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
              >
                <option value="Sem 1">Sem 1</option>
                <option value="Sem 2">Sem 2</option>
                <option value="Sem 3">Sem 3</option>
                <option value="Sem 4">Sem 4</option>
                <option value="Sem 5">Sem 5</option>
                <option value="Sem 6">Sem 6</option>
                <option value="Sem 7">Sem 7</option>
                <option value="Sem 8">Sem 8</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-muted-foreground block mb-1">Search Students</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name or roll number.."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="pl-9 h-9 text-xs rounded-xl bg-card border-border placeholder:text-muted-foreground/60"
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Master Details Split Grid */}
        <div className="grid lg:grid-cols-3 gap-6 items-start">
          {/* Left Column: Tabbed Lists */}
          <div className="lg:col-span-2 space-y-4">
            {/* Custom Tab Headers */}
            <div className="flex border-b border-border/80">
              <button
                onClick={() => setOfficerTab('blocked')}
                className={`px-5 py-3 text-xs font-black border-b-2 transition-all duration-200 cursor-pointer ${
                  officerTab === 'blocked'
                    ? 'border-rose-500 text-rose-700 font-extrabold'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                Blocked / Dues Pending ({blockedOfficerStudents.length})
              </button>
              <button
                onClick={() => setOfficerTab('eligible')}
                className={`px-5 py-3 text-xs font-black border-b-2 transition-all duration-200 cursor-pointer ${
                  officerTab === 'eligible'
                    ? 'border-indigo-650 text-indigo-700 font-extrabold'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                Eligible / Cleared ({eligibleOfficerStudents.length})
              </button>
            </div>

            {/* Content Roster */}
            <Card className="bg-card border border-border/70 rounded-2xl shadow-xs overflow-hidden p-0">
              {officerTab === 'blocked' ? (
                blockedOfficerStudents.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground font-semibold flex flex-col items-center justify-center gap-1.5">
                    <CheckCircle2 className="size-8 text-emerald-500" />
                    <span>No students are currently blocked for this cohort!</span>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 text-slate-600 font-extrabold border-b border-border/60 uppercase tracking-wider">
                        <tr>
                          <th className="px-4 py-3 text-[10px]">Student</th>
                          <th className="px-4 py-3 text-[10px] text-center">Registered</th>
                          <th className="px-4 py-3 text-[10px] text-center">Block Reason / Audit Indicators</th>
                          <th className="px-4 py-3 text-[10px] text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/50 font-semibold text-slate-700">
                        {blockedOfficerStudents.map(s => {
                          const isSelected = selectedStudentId === s.id;
                          const attendanceOk = (s.attendance_percentage || 0) >= 75;
                          const feesOk = (s.fee_balance || 0) <= feeLimit;

                          return (
                            <tr 
                              key={s.id} 
                              onClick={() => setSelectedStudentId(s.id)}
                              className={`hover:bg-slate-50/50 transition cursor-pointer ${
                                isSelected ? 'bg-indigo-50/30 ring-1 ring-inset ring-indigo-500/10' : ''
                              }`}
                            >
                              <td className="px-4 py-3.5">
                                <div className="font-extrabold text-slate-900">{s.full_name}</div>
                                <div className="text-[10px] font-bold text-slate-455 font-mono mt-0.5">{s.roll_number}</div>
                              </td>
                              <td className="px-4 py-3.5 text-center">
                                <span className={`font-mono font-bold ${s.is_registered ? 'text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded' : 'text-red-750 bg-rose-50 px-2 py-0.5 rounded'}`}>
                                  {s.is_registered ? 'Registered' : 'No Form'}
                                </span>
                              </td>
                              <td className="px-4 py-3.5">
                                <div className="flex flex-wrap items-center justify-center gap-1.5">
                                  {!attendanceOk && (
                                    <Badge variant="outline" className="bg-rose-50/20 text-rose-700 border-rose-200 text-[9px] font-bold">
                                      Attendance shortfall ({s.attendance_percentage}%)
                                    </Badge>
                                  )}
                                  {!feesOk && (
                                    <Badge variant="outline" className="bg-amber-50/20 text-amber-700 border-amber-200 text-[9px] font-bold">
                                      Fee Dues (₹{s.fee_balance?.toLocaleString()})
                                    </Badge>
                                  )}
                                  {!s.is_registered && (
                                    <Badge variant="outline" className="bg-rose-50/20 text-rose-700 border-rose-200 text-[9px] font-bold">
                                      Unregistered
                                    </Badge>
                                  )}
                                </div>
                              </td>
                              <td className="px-4 py-3.5 text-right">
                                <Button
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleApproveSingle(s.id);
                                  }}
                                  className="h-8 bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-black rounded-lg cursor-pointer px-4 shadow-xs"
                                >
                                  Generate
                                </Button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )
              ) : (
                eligibleOfficerStudents.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground font-semibold">
                    No eligible or cleared students in this cohort.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-55 text-slate-650 font-extrabold border-b border-border/60 uppercase tracking-wider">
                        <tr>
                          <th className="px-4 py-3 text-[10px]">Student</th>
                          <th className="px-4 py-3 text-[10px] text-center">Attendance</th>
                          <th className="px-4 py-3 text-[10px] text-center">Fee Balance</th>
                          <th className="px-4 py-3 text-[10px] text-center">Status</th>
                          <th className="px-4 py-3 text-[10px] text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/50 font-semibold text-slate-700">
                        {eligibleOfficerStudents.map(s => (
                          <tr key={s.id} className="hover:bg-slate-50/30 transition">
                            <td className="px-4 py-3.5">
                              <div className="font-extrabold text-slate-900">{s.full_name}</div>
                              <div className="text-[10px] font-bold text-slate-455 font-mono mt-0.5">{s.roll_number}</div>
                            </td>
                            <td className="px-4 py-3.5 text-center font-mono font-bold text-slate-750">
                              {s.attendance_percentage}%
                            </td>
                            <td className="px-4 py-3.5 text-center font-mono font-bold text-slate-750">
                              {s.fee_balance && s.fee_balance > 0 ? `₹${s.fee_balance.toLocaleString()}` : "₹0 Paid"}
                            </td>
                            <td className="px-4 py-3.5 text-center">
                              <Badge className="bg-emerald-50 text-emerald-855 border border-emerald-150 font-extrabold">
                                Authorized / Cleared
                              </Badge>
                            </td>
                            <td className="px-4 py-3.5 text-right">
                              <Button
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleApproveSingle(s.id);
                                }}
                                className="h-8 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-black rounded-lg cursor-pointer px-4 shadow-xs"
                              >
                                {s.hall_ticket_status === 'Generated' ? 'Regenerate' : 'Generate'}
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )
              )}
            </Card>
          </div>

          {/* Right Column: Audit Panel Card */}
          <div>
            <Card className="border border-slate-150 bg-white p-5 rounded-2xl shadow-xs space-y-5">
              <div className="border-b pb-3.5">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                  <Activity className="size-4.5 text-indigo-650" />
                  Dues Audit Summary & Override
                </h3>
              </div>

              {!selectedStudent ? (
                <div className="text-center py-12 text-muted-foreground font-semibold flex flex-col items-center justify-center gap-1">
                  <Info className="size-8 text-slate-350" />
                  <span>No student selected for audit.</span>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Selected student header */}
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-sm">{selectedStudent.full_name}</h4>
                    <p className="text-[10px] text-indigo-700 font-bold font-mono mt-0.5">{selectedStudent.roll_number}</p>
                    <p className="text-[10px] text-muted-foreground font-semibold mt-1">B.Tech {selectedStudent.department} Section {selectedStudent.section}</p>
                  </div>

                  {/* Checklist cards */}
                  <div className="space-y-3.5">
                    {/* 1. Fee Balance Audit */}
                    <div className="p-3 border border-slate-150 rounded-xl space-y-1 bg-slate-50/20">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-black uppercase text-slate-500">Financial Audit</span>
                        {selectedStudent.fee_balance && selectedStudent.fee_balance <= feeLimit ? (
                          <Badge className="bg-emerald-50 text-emerald-800 text-[9px] font-black">Passed</Badge>
                        ) : (
                          <Badge className="bg-rose-50 text-rose-800 text-[9px] font-black">Dues Pending</Badge>
                        )}
                      </div>
                      <div className="text-xs font-bold text-slate-800 pt-1">
                        Outstanding Fee: ₹{selectedStudent.fee_balance?.toLocaleString()}
                      </div>
                      <p className="text-[9px] text-muted-foreground font-semibold">
                        Maximum permitted fee balance: ₹{feeLimit.toLocaleString()}.
                      </p>
                    </div>

                    {/* 2. Attendance Audit */}
                    <div className="p-3 border border-slate-150 rounded-xl space-y-1 bg-slate-50/20">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-black uppercase text-slate-500">Attendance Audit</span>
                        {selectedStudent.attendance_percentage && selectedStudent.attendance_percentage >= 75 ? (
                          <Badge className="bg-emerald-50 text-emerald-800 text-[9px] font-black">Passed</Badge>
                        ) : (
                          <Badge className="bg-rose-50 text-rose-800 text-[9px] font-black">Shortage</Badge>
                        )}
                      </div>
                      <div className="text-xs font-bold text-slate-800 pt-1">
                        Attendance Rate: {selectedStudent.attendance_percentage}%
                      </div>
                      <p className="text-[9px] text-muted-foreground font-semibold">
                        Requires at least 75% to sit for end-semester theory evaluations.
                      </p>
                    </div>

                    {/* 3. Course Register */}
                    <div className="p-3 border border-slate-150 rounded-xl space-y-1 bg-slate-50/20">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-black uppercase text-slate-500">Registration Check</span>
                        {selectedStudent.is_registered ? (
                          <Badge className="bg-emerald-50 text-emerald-800 text-[9px] font-black">Registered</Badge>
                        ) : (
                          <Badge className="bg-rose-50 text-rose-800 text-[9px] font-black">Deficit</Badge>
                        )}
                      </div>
                      <div className="text-xs font-bold text-slate-800 pt-1 font-mono">
                        Status: {selectedStudent.is_registered ? "Registered (3 Courses Offered)" : "No registration records found"}
                      </div>
                    </div>
                  </div>

                  {/* Override Button */}
                  <div className="border-t pt-4">
                    <Button 
                      onClick={() => handleApproveSingle(selectedStudent.id)}
                      className="w-full h-10 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
                    >
                      <UserCheck className="size-4.5" /> Generate
                    </Button>
                    <p className="text-[9px] text-center text-muted-foreground font-medium mt-2 leading-relaxed">
                      Clears financial or attendance shortages manually and generates the hall ticket booklet for the student.
                    </p>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // STANDARD ASSISTANT VIEW RENDER
  const sortedStudents = [...filteredStudents].sort((a, b) => {
    const aEligible = isStudentEligible(a);
    const bEligible = isStudentEligible(b);
    if (aEligible === bEligible) return 0;
    return aEligible ? 1 : -1;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="border-b border-border pb-4">
        <div className="flex items-center justify-between">
          <div className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5 font-mono">
            Examcell <span className="text-[10px]">/</span> <span className="text-foreground font-bold">Hall-tickets</span>
          </div>
        </div>
        <h1 className="font-display text-2xl font-extrabold tracking-tight mt-2 text-slate-900">
          Hall Ticket & Eligibility Control
        </h1>
        <p className="text-xs text-muted-foreground mt-1 font-medium">
          Audit student fee dues and attendance logs to verify eligibility, override restrictions, and generate final hall tickets.
        </p>
      </div>

      {/* Filter Card */}
      <Card className="bg-card border border-border/70 p-5 rounded-2xl shadow-xs">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div>
            <label className="text-xs font-bold text-muted-foreground block mb-1">Department</label>
            <select
              value={department}
              disabled={!!userDept}
              onChange={e => setDepartment(e.target.value)}
              className="w-full bg-card border border-border text-foreground rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
            >
              {userDept ? (
                <option value={userDept}>{userDept}</option>
              ) : (
                <>
                  <option value="AIML">AIML</option>
                  <option value="CSE">CSE</option>
                  <option value="AIDS">AIDS</option>
                  <option value="ECE">ECE</option>
                  <option value="EEE">EEE</option>
                </>
              )}
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-muted-foreground block mb-1">Semester</label>
            <select
              value={semesterText}
              onChange={e => setSemesterText(e.target.value)}
              className="w-full bg-card border border-border text-foreground rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
            >
              <option value="Sem 1">Sem 1</option>
              <option value="Sem 2">Sem 2</option>
              <option value="Sem 3">Sem 3</option>
              <option value="Sem 4">Sem 4</option>
              <option value="Sem 5">Sem 5</option>
              <option value="Sem 6">Sem 6</option>
              <option value="Sem 7">Sem 7</option>
              <option value="Sem 8">Sem 8</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-muted-foreground block mb-1">Search Students</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or roll number.."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-9 h-9 text-xs rounded-xl bg-card border-border placeholder:text-muted-foreground/60"
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Eligibility Roster Dashboard */}
      <Card className="bg-card border border-border/70 rounded-2xl shadow-xs overflow-hidden p-0">
        {/* Roster Header */}
        <div className="p-4 border-b border-border/60 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Student Eligibility Roster</h3>
            <p className="text-[11px] font-semibold text-muted-foreground mt-0.5">
              Active Schedule: <span className="text-indigo-600 font-bold underline">
                {activeExam ? activeExam.name : `B.Tech ${department} ${semesterText} Exams (Draft)`}
              </span> (Non-Eligible shown first)
            </p>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black text-muted-foreground uppercase">Max Fee Due Limit:</span>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-muted-foreground">₹</span>
                <Input
                  type="number"
                  value={feeLimitInput}
                  onChange={e => setFeeLimitInput(e.target.value)}
                  className="h-8 w-20 text-xs font-bold text-center rounded-lg bg-card border-border px-1"
                />
                <Button 
                  size="sm" 
                  onClick={handleSetFeeLimit}
                  className="h-8 bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-black rounded-lg cursor-pointer px-3"
                >
                  Set
                </Button>
              </div>
            </div>

            <Button 
              onClick={handleApproveAllEligible}
              className="h-8 bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-black rounded-lg cursor-pointer px-4 flex items-center gap-1 shadow-xs"
            >
              <FileCheck2 className="size-4" /> Approve All Eligible
            </Button>
          </div>
        </div>

        {/* Roster Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-extrabold border-b border-border/60 uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3 text-[10px]">Student</th>
                <th className="px-4 py-3 text-[10px] text-center">Registered Exams</th>
                <th className="px-4 py-3 text-[10px] text-center">Attendance %</th>
                <th className="px-4 py-3 text-[10px] text-center">Fee Balance (INR)</th>
                <th className="px-4 py-3 text-[10px] text-center">Criteria Pass</th>
                <th className="px-4 py-3 text-[10px] text-center">Hall Ticket Status</th>
                <th className="px-4 py-3 text-[10px] text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50 font-semibold text-slate-700">
              {sortedStudents.map(s => {
                const eligible = isStudentEligible(s);
                const attendanceOk = (s.attendance_percentage || 0) >= 75;
                const feesOk = (s.fee_balance || 0) <= feeLimit;

                return (
                  <tr key={s.id} className="hover:bg-slate-50/30 transition">
                    <td className="px-4 py-3">
                      <div className="font-extrabold text-slate-900">{s.full_name}</div>
                      <div className="text-[10px] font-bold text-indigo-600 font-mono mt-0.5">{s.roll_number}</div>
                    </td>

                    <td className="px-4 py-3 text-center">
                      <span className={`font-mono font-bold ${s.is_registered ? 'text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded' : 'text-red-600 bg-red-50 px-2 py-0.5 rounded'}`}>
                        {s.is_registered ? '3 / 3' : '0 / 3'}
                      </span>
                    </td>

                    <td className={`px-4 py-3 text-center font-mono ${attendanceOk ? 'text-emerald-600' : 'text-red-600'}`}>
                      {s.attendance_percentage}%
                    </td>

                    <td className={`px-4 py-3 text-center font-mono ${feesOk ? 'text-emerald-600' : 'text-red-600'}`}>
                      {s.fee_balance && s.fee_balance > 0 
                        ? `₹${s.fee_balance.toLocaleString()} Due` 
                        : '₹0 Paid'}
                    </td>

                    <td className="px-4 py-3 text-center">
                      {eligible ? (
                        <span className="bg-indigo-50 border border-indigo-200 text-indigo-700 text-[10px] font-black px-2.5 py-1 rounded-md">
                          Passed
                        </span>
                      ) : (
                        <span className="bg-red-50 border border-red-200 text-red-700 text-[10px] font-black px-2.5 py-1 rounded-md">
                          Failed Criteria
                        </span>
                      )}
                    </td>

                    <td className="px-4 py-3 text-center">
                      {s.hall_ticket_status === 'Generated' ? (
                        <span className="text-emerald-600 font-black text-[10px] bg-emerald-50/60 border border-emerald-200 px-2 py-1 rounded-md">
                          Generated
                        </span>
                      ) : (
                        <span className="text-indigo-600 font-black text-[10px] bg-indigo-50/60 border border-indigo-200 px-2 py-1 rounded-md">
                          Not Generated
                        </span>
                      )}
                    </td>

                    <td className="px-4 py-3 text-center">
                      <Button
                        size="sm"
                        disabled={s.hall_ticket_status === 'Generated'}
                        onClick={() => handleApproveSingle(s.id)}
                        className="h-8 bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-black rounded-lg cursor-pointer px-3 shadow-xs disabled:opacity-50"
                      >
                        Generate
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
