import { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { 
  FileText, 
  UploadCloud, 
  CheckCircle2, 
  Eye, 
  UserPlus, 
  HelpCircle,
  FileCheck,
  PlusCircle,
  Plus
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  getMockExams,
  getMockCourses,
  MockExamSchedule,
  MockCourseOffering
} from "@/lib/mock-examcell-state";

export const Route = createFileRoute("/examcell/correction-requests")({
  head: () => ({
    meta: [{ title: "Correction Requests — EduSuite Pro" }],
  }),
  component: CorrectionRequestsPage,
});

interface AnswerCopyValuation {
  id: string;
  studentName: string;
  studentRoll: string;
  blindCode: string;
  examName: string;
  subjectName: string;
  assignedFaculty: string;
  status: 'Awaiting Correction' | 'Under Valuation' | 'Corrected / Evaluated';
  score: number;
}

const INITIAL_ROSTER: AnswerCopyValuation[] = [
  {
    id: "r1",
    studentName: "N/A",
    studentRoll: "CSE26001",
    blindCode: "COPY-848113",
    examName: "End Semester Exam",
    subjectName: "-- Sem",
    assignedFaculty: "Assigned Evaluator",
    status: 'Corrected / Evaluated',
    score: 63
  },
  {
    id: "r2",
    studentName: "N/A",
    studentRoll: "CSE26002",
    blindCode: "COPY-378474",
    examName: "End Semester Exam",
    subjectName: "-- Sem",
    assignedFaculty: "Assigned Evaluator",
    status: 'Corrected / Evaluated',
    score: 62
  }
];

const FACULTY_LIST = [
  { name: "Kanneganti Suresh", dept: "CSE" },
  { name: "Dr. K. Jyothi", dept: "AIML" },
  { name: "Dr. Suresh Babu", dept: "CSE" },
  { name: "Dr. Clara Oswald", dept: "ECE" },
  { name: "Dr. John Smith", dept: "AIDS" }
];

function CorrectionRequestsPage() {
  const [activeTab, setActiveTab] = useState<'allocations' | 'revaluations'>('allocations');
  const [roster, setRoster] = useState<AnswerCopyValuation[]>([]);
  const [exams, setExams] = useState<MockExamSchedule[]>([]);
  const [courses, setCourses] = useState<MockCourseOffering[]>([]);

  // Form states
  const [selectedExam, setSelectedExam] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [rollNumber, setRollNumber] = useState("");
  const [facultyDept, setFacultyDept] = useState("CSE");
  const [selectedFaculty, setSelectedFaculty] = useState("");
  const [pdfAttached, setPdfAttached] = useState(false);
  const [fileName, setFileName] = useState("");

  useEffect(() => {
    setExams(getMockExams());
    setCourses(getMockCourses());
    
    // Load roster from localStorage or initialize with seed data
    const saved = localStorage.getItem("mock_answer_copy_roster_v3");
    if (saved) {
      setRoster(JSON.parse(saved));
    } else {
      localStorage.setItem("mock_answer_copy_roster_v3", JSON.stringify(INITIAL_ROSTER));
      setRoster(INITIAL_ROSTER);
    }
  }, []);

  const handleAssignCopy = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedExam || !selectedSubject || !rollNumber || !selectedFaculty) {
      toast.error("Please fill out all required assignment fields.");
      return;
    }
    if (!pdfAttached) {
      toast.error("Please attach a scanned PDF answer copy first.");
      return;
    }

    const examObj = exams.find(ex => ex.id === selectedExam);
    const courseObj = courses.find(c => c.course_code === selectedSubject);

    const blindHash = `COPY-${Math.floor(100000 + Math.random() * 900000)}`;
    const newEntry: AnswerCopyValuation = {
      id: `copy-${Date.now()}`,
      studentName: "N/A", // Blind evaluation masks name
      studentRoll: rollNumber.trim().toUpperCase(),
      blindCode: blindHash,
      examName: examObj ? examObj.name : "End Semester Exam",
      subjectName: courseObj ? courseObj.course_name : selectedSubject,
      assignedFaculty: selectedFaculty,
      status: 'Awaiting Correction',
      score: 0
    };

    const updated = [newEntry, ...roster];
    setRoster(updated);
    localStorage.setItem("mock_answer_copy_roster_v3", JSON.stringify(updated));
    toast.success("PDF Answer copy assigned for blind evaluation successfully!");

    // Reset Form
    setRollNumber("");
    setSelectedFaculty("");
    setPdfAttached(false);
    setFileName("");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      setPdfAttached(true);
      toast.info(`Scanned PDF "${file.name}" attached successfully.`);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="border-b border-border pb-4">
        <h1 className="font-display text-2xl font-extrabold tracking-tight text-slate-900">
          Answer Sheet Corrections & Evaluation Control
        </h1>
        <p className="text-xs text-muted-foreground mt-0.5 font-medium">
          Upload scanned student PDF answer copies, assign faculty evaluators, monitor blind evaluation status, and review revaluation logs.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border/80">
        <button
          onClick={() => setActiveTab('allocations')}
          className={`px-6 py-3 text-xs font-black border-b-2 transition-all duration-200 cursor-pointer ${
            activeTab === 'allocations'
              ? 'border-indigo-600 text-indigo-700 font-extrabold'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <FileText className="size-4 inline mr-1.5" />
          Answer Copy Allocations & Evaluations
        </button>
        <button
          onClick={() => setActiveTab('revaluations')}
          className={`px-6 py-3 text-xs font-black border-b-2 transition-all duration-200 cursor-pointer ${
            activeTab === 'revaluations'
              ? 'border-indigo-600 text-indigo-700 font-extrabold'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <FileCheck className="size-4 inline mr-1.5" />
          Faculty Revaluation Requests (0)
        </button>
      </div>

      {activeTab === 'allocations' ? (
        <div className="space-y-6">
          {/* Assignment form card */}
          <Card className="p-5 border border-slate-100 bg-white shadow-xs rounded-2xl">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5 mb-4">
              <PlusCircle className="size-4.5 text-indigo-650" /> Upload Scanned Answer Sheet & Assign Faculty Evaluator
            </h3>

            <form onSubmit={handleAssignCopy} className="space-y-4 text-xs font-semibold">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                <div>
                  <label className="block text-[10px] font-bold text-slate-450 uppercase mb-1.5">Select Exam Schedule</label>
                  <select
                    value={selectedExam}
                    onChange={e => setSelectedExam(e.target.value)}
                    className="w-full bg-card border border-border text-foreground rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer h-9"
                  >
                    <option value="">-- Choose Exam --</option>
                    {exams.map(ex => (
                      <option key={ex.id} value={ex.id}>{ex.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-450 uppercase mb-1.5">Subject / Booklet</label>
                  <select
                    value={selectedSubject}
                    onChange={e => setSelectedSubject(e.target.value)}
                    className="w-full bg-card border border-border text-foreground rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer h-9"
                  >
                    <option value="">-- Select Subject --</option>
                    {courses.map(c => (
                      <option key={c.id} value={c.course_code}>{c.course_code} - {c.course_name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-450 uppercase mb-1.5">Student Roll Number</label>
                  <Input
                    placeholder="E.G. CSE26001"
                    value={rollNumber}
                    onChange={e => setRollNumber(e.target.value)}
                    className="h-9 rounded-xl text-xs font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-450 uppercase mb-1.5">Filter Faculty Dept</label>
                  <select
                    value={facultyDept}
                    onChange={e => setFacultyDept(e.target.value)}
                    className="w-full bg-card border border-border text-foreground rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer h-9"
                  >
                    <option value="CSE">CSE</option>
                    <option value="AIML">AIML</option>
                    <option value="AIDS">AIDS</option>
                    <option value="ECE">ECE</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-450 uppercase mb-1.5">Faculty Evaluator</label>
                  <select
                    value={selectedFaculty}
                    onChange={e => setSelectedFaculty(e.target.value)}
                    className="w-full bg-card border border-border text-foreground rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer h-9"
                  >
                    <option value="">-- Select Faculty --</option>
                    {FACULTY_LIST.filter(f => f.dept === facultyDept).map(f => (
                      <option key={f.name} value={f.name}>{f.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* PDF upload simulator dashed box */}
              <div className="border-2 border-dashed border-slate-200/80 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/50">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-indigo-55 text-indigo-650 rounded-xl">
                    <UploadCloud className="size-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-slate-800">
                      {pdfAttached && fileName ? `${fileName} (Attached)` : pdfAttached ? "answer_sheet_scanned.pdf (Attached)" : "Upload PDF Answer Sheet"}
                    </h4>
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                      Scanned PDF format required for digital correction workspace.
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <input
                    type="file"
                    accept="application/pdf"
                    id="pdf-file-input"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  <Button
                    type="button"
                    onClick={() => document.getElementById("pdf-file-input")?.click()}
                    variant="outline"
                    className="h-9 rounded-xl text-xs font-bold border-border bg-white"
                  >
                    <Plus className="size-4 mr-1.5" /> Select PDF File
                  </Button>
                  <Button
                    type="submit"
                    className="h-9 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black uppercase tracking-wider"
                  >
                    <CheckCircle2 className="size-4 mr-1.5" /> Assign Copy for Correction
                  </Button>
                </div>
              </div>
            </form>
          </Card>

          {/* Roster table card */}
          <Card className="p-5 border border-slate-100 bg-white shadow-xs rounded-2xl">
            <div className="flex items-center justify-between mb-4 border-b pb-3">
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-800">
                Answer Copies Evaluation Roster
              </h3>
              <Badge className="bg-indigo-50 text-indigo-700 hover:bg-indigo-50 font-black border-indigo-200">
                Total Uploads: {roster.length}
              </Badge>
            </div>

            <div className="overflow-x-auto border border-slate-100 rounded-xl">
              <table className="min-w-full divide-y divide-slate-100 text-xs">
                <thead className="bg-slate-55 text-slate-650 font-black uppercase text-[9px] tracking-wider">
                  <tr>
                    <th className="px-6 py-3 text-left">Student</th>
                    <th className="px-6 py-3 text-left">Evaluation Code (Blind)</th>
                    <th className="px-6 py-3 text-left">Exam & Subject</th>
                    <th className="px-6 py-3 text-left">Assigned Faculty</th>
                    <th className="px-6 py-3 text-center">Evaluation Status</th>
                    <th className="px-6 py-3 text-center">Total Score</th>
                    <th className="px-6 py-3 text-right">Answer Copy</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white font-semibold text-slate-700">
                  {roster.map((row) => (
                    <tr key={row.id} className="hover:bg-slate-50/50 transition">
                      <td className="px-6 py-3.5 text-slate-500 font-bold">{row.studentName}</td>
                      <td className="px-6 py-3.5 font-mono font-black text-indigo-650">
                        <Badge variant="outline" className="border-indigo-150 text-indigo-750 font-black bg-indigo-50/20">
                          {row.blindCode}
                        </Badge>
                      </td>
                      <td className="px-6 py-3.5">
                        <div className="font-bold text-slate-850">{row.examName}</div>
                        <div className="text-[10px] text-muted-foreground font-medium">{row.subjectName}</div>
                      </td>
                      <td className="px-6 py-3.5 text-slate-800 font-bold">{row.assignedFaculty}</td>
                      <td className="px-6 py-3.5 text-center">
                        <Badge className={
                          row.status === 'Corrected / Evaluated'
                            ? "bg-emerald-50 text-emerald-800 border-emerald-150 font-extrabold"
                            : row.status === 'Under Valuation'
                              ? "bg-indigo-50 text-indigo-800 border-indigo-150 font-extrabold"
                              : "bg-slate-100 text-slate-700 font-extrabold"
                        }>
                          {row.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-3.5 text-center font-mono font-black text-slate-900">
                        {row.status === 'Corrected / Evaluated' ? `${row.score}.00` : "--"} <span className="text-[10px] text-muted-foreground font-normal">/ 70</span>
                      </td>
                      <td className="px-6 py-3.5 text-right text-indigo-600 hover:text-indigo-800 transition">
                        <a href="#" onClick={(e) => { e.preventDefault(); toast.success("Opening digital answer copy copy..."); }} className="inline-flex items-center gap-1 font-bold">
                          <Eye className="size-3.5" /> View PDF
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      ) : (
        /* Revaluations empty view */
        <Card className="bg-card border border-border/70 rounded-2xl p-12 text-center flex flex-col items-center justify-center min-h-[300px]">
          <div className="size-12 rounded-full border-2 border-emerald-500 bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
            <CheckCircle2 className="size-6 stroke-[3px]" />
          </div>
          <h3 className="font-display text-sm font-bold text-slate-850 uppercase tracking-wider">All Clear!</h3>
          <p className="text-xs text-muted-foreground mt-2 max-w-sm leading-relaxed">
            There are no student revaluation requests currently submitted for evaluation.
          </p>
        </Card>
      )}
    </div>
  );
}
