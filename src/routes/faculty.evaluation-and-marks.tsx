import { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { 
  FileText, 
  CheckCircle2, 
  Clock, 
  Award, 
  Eye, 
  X,
  FileDown,
  AlertCircle,
  Users,
  CheckCircle,
  Save,
  Search,
  BookMarked,
  Layers,
  FileSpreadsheet
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { 
  getMockStudents, 
  saveMockStudents, 
  MockStudent 
} from "@/lib/mock-examcell-state";

export const Route = createFileRoute("/faculty/evaluation-and-marks")({
  head: () => ({
    meta: [{ title: "Evaluations & Marks — EduSuite Pro" }],
  }),
  component: FacultyEvaluationAndMarksPage,
});

// TYPES
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

interface TaughtSection {
  id: string;
  name: string;
  dept: string;
  year: number;
  semester: number;
  subjectCode: string;
  subjectName: string;
  strength: number;
}

// SEED DATA
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

const TAUGHT_SECTIONS: TaughtSection[] = [
  {
    id: "sec-1",
    name: "Section A",
    dept: "CSE",
    year: 3,
    semester: 5,
    subjectCode: "CS302",
    subjectName: "Computer Networks",
    strength: 5
  },
  {
    id: "sec-2",
    name: "Section B",
    dept: "CSE",
    year: 3,
    semester: 5,
    subjectCode: "CS302",
    subjectName: "Computer Networks",
    strength: 5
  },
  {
    id: "sec-3",
    name: "Section A",
    dept: "AIML",
    year: 2,
    semester: 3,
    subjectCode: "ML03301",
    subjectName: "Probability and Statistics",
    strength: 5
  }
];

function FacultyEvaluationAndMarksPage() {
  const [activeTab, setActiveTab] = useState<'evaluations' | 'marks'>('evaluations');

  // DATABASE STATES
  const [roster, setRoster] = useState<AnswerCopyValuation[]>([]);
  const [students, setStudents] = useState<MockStudent[]>([]);

  // 1. EVALUATIONS STATES
  const [selectedCopy, setSelectedCopy] = useState<AnswerCopyValuation | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Rubrics
  const [q1, setQ1] = useState("2");
  const [q2, setQ2] = useState("2");
  const [q3, setQ3] = useState("2");
  const [q4, setQ4] = useState("2");
  const [q5, setQ5] = useState("2");
  const [q6, setQ6] = useState("2");
  const [q7, setQ7] = useState("2");
  const [q8a, setQ8a] = useState("5");
  const [q8b, setQ8b] = useState("6");
  const [q9a, setQ9a] = useState("0");
  const [q9b, setQ9b] = useState("0");
  const [q10a, setQ10a] = useState("7");
  const [q10b, setQ10b] = useState("6");
  const [q11a, setQ11a] = useState("0");
  const [q11b, setQ11b] = useState("0");
  const [q12a, setQ12a] = useState("6");
  const [q12b, setQ12b] = useState("5");
  const [q13a, setQ13a] = useState("0");
  const [q13b, setQ13b] = useState("0");
  const [q14a, setQ14a] = useState("7");
  const [q14b, setQ14b] = useState("4");
  const [q15a, setQ15a] = useState("0");
  const [q15b, setQ15b] = useState("0");

  // 2. MID MARKS STATES
  const [selectedSecId, setSelectedSecId] = useState("");
  const [cohortStudents, setCohortStudents] = useState<MockStudent[]>([]);
  const [marksSearch, setMarksSearch] = useState("");
  const [midScores, setMidScores] = useState<Record<string, string>>({});
  const [assignmentScores, setAssignmentScores] = useState<Record<string, string>>({});

  useEffect(() => {
    setStudents(getMockStudents());
    
    // Load roster
    const saved = localStorage.getItem("mock_answer_copy_roster_v3");
    if (saved) {
      setRoster(JSON.parse(saved));
    } else {
      localStorage.setItem("mock_answer_copy_roster_v3", JSON.stringify(INITIAL_ROSTER));
      setRoster(INITIAL_ROSTER);
    }
  }, []);

  // Filter students when taught section card changes
  const activeSection = TAUGHT_SECTIONS.find(s => s.id === selectedSecId);

  useEffect(() => {
    if (activeSection) {
      const filtered = students.filter(s => 
        s.department === activeSection.dept && 
        s.year === activeSection.year && 
        s.semester === activeSection.semester
      );
      setCohortStudents(filtered);

      const newMids: Record<string, string> = {};
      const newAssigns: Record<string, string> = {};
      filtered.forEach(s => {
        newMids[s.roll_number] = String(s.mid1_marks || 0);
        newAssigns[s.roll_number] = String(s.assignment_marks || 0);
      });
      setMidScores(newMids);
      setAssignmentScores(newAssigns);
    } else {
      setCohortStudents([]);
    }
  }, [selectedSecId, students, activeSection]);

  // Score validation helpers
  const validateQ = (val: string, max: number) => {
    const num = Number(val);
    return isNaN(num) || num < 0 || num > max;
  };

  const validateMid = (val: string) => {
    const n = Number(val);
    return isNaN(n) || n < 0 || n > 20;
  };

  const validateAssign = (val: string) => {
    const n = Number(val);
    return isNaN(n) || n < 0 || n > 10;
  };

  // 1. EVALUATION ACTIONS
  const handleOpenCorrection = (copy: AnswerCopyValuation) => {
    setSelectedCopy(copy);
    setIsModalOpen(true);

    if (copy.status === 'Corrected / Evaluated') {
      if (copy.blindCode === 'COPY-848113') {
        setQ1("1"); setQ2("2"); setQ3("2"); setQ4("2"); setQ5("2"); setQ6("2"); setQ7("2");
        setQ8a("5"); setQ8b("6"); setQ9a("0"); setQ9b("0");
        setQ10a("7"); setQ10b("6"); setQ11a("0"); setQ11b("0");
        setQ12a("6"); setQ12b("5"); setQ13a("0"); setQ13b("0");
        setQ14a("7"); setQ14b("4"); setQ15a("0"); setQ15b("0");
      } else if (copy.blindCode === 'COPY-378474') {
        setQ1("2"); setQ2("2"); setQ3("2"); setQ4("2"); setQ5("2"); setQ6("2"); setQ7("2");
        setQ8a("4"); setQ8b("5"); setQ9a("0"); setQ9b("0");
        setQ10a("6"); setQ10b("6"); setQ11a("0"); setQ11b("0");
        setQ12a("7"); setQ12b("4"); setQ13a("0"); setQ13b("0");
        setQ14a("6"); setQ14b("4"); setQ15a("0"); setQ15b("0");
      }
    } else {
      setQ1("0"); setQ2("0"); setQ3("0"); setQ4("0"); setQ5("0"); setQ6("0"); setQ7("0");
      setQ8a("0"); setQ8b("0"); setQ9a("0"); setQ9b("0");
      setQ10a("0"); setQ10b("0"); setQ11a("0"); setQ11b("0");
      setQ12a("0"); setQ12b("0"); setQ13a("0"); setQ13b("0");
      setQ14a("0"); setQ14b("0"); setQ15a("0"); setQ15b("0");
    }
  };

  const hasEvalErrors = 
    validateQ(q1, 2) || validateQ(q2, 2) || validateQ(q3, 2) || validateQ(q4, 2) || 
    validateQ(q5, 2) || validateQ(q6, 2) || validateQ(q7, 2) ||
    validateQ(q8a, 8) || validateQ(q8b, 6) || validateQ(q9a, 8) || validateQ(q9b, 6) ||
    validateQ(q10a, 8) || validateQ(q10b, 6) || validateQ(q11a, 8) || validateQ(q11b, 6) ||
    validateQ(q12a, 8) || validateQ(q12b, 6) || validateQ(q13a, 8) || validateQ(q13b, 6) ||
    validateQ(q14a, 8) || validateQ(q14b, 6) || validateQ(q15a, 8) || validateQ(q15b, 6);

  const partAScore = 
    (validateQ(q1, 2) ? 0 : Number(q1)) +
    (validateQ(q2, 2) ? 0 : Number(q2)) +
    (validateQ(q3, 2) ? 0 : Number(q3)) +
    (validateQ(q4, 2) ? 0 : Number(q4)) +
    (validateQ(q5, 2) ? 0 : Number(q5)) +
    (validateQ(q6, 2) ? 0 : Number(q6)) +
    (validateQ(q7, 2) ? 0 : Number(q7));

  const getChoiceBest = (a1: string, b1: string, a2: string, b2: string) => {
    const score1 = (validateQ(a1, 8) ? 0 : Number(a1)) + (validateQ(b1, 6) ? 0 : Number(b1));
    const score2 = (validateQ(a2, 8) ? 0 : Number(a2)) + (validateQ(b2, 6) ? 0 : Number(b2));
    return {
      best: Math.max(score1, score2),
      isFirstBest: score1 >= score2,
      score1,
      score2
    };
  };

  const choice1 = getChoiceBest(q8a, q8b, q9a, q9b);
  const choice2 = getChoiceBest(q10a, q10b, q11a, q11b);
  const choice3 = getChoiceBest(q12a, q12b, q13a, q13b);
  const choice4 = getChoiceBest(q14a, q14b, q15a, q15b);

  const evaluatedTotal = partAScore + choice1.best + choice2.best + choice3.best + choice4.best;

  const handleSubmitEvaluation = () => {
    if (!selectedCopy) return;
    if (hasEvalErrors) return;

    const updatedRoster = roster.map(r => 
      r.id === selectedCopy.id 
        ? { ...r, score: evaluatedTotal, status: 'Corrected / Evaluated' as const }
        : r
    );

    setRoster(updatedRoster);
    localStorage.setItem("mock_answer_copy_roster_v3", JSON.stringify(updatedRoster));
    toast.success(`Marks synced successfully for ${selectedCopy.blindCode}! Evaluated Score: ${evaluatedTotal}/70`);
    setIsModalOpen(false);
  };

  // 2. MID MARKS ACTIONS
  const handleScoreChange = (roll: string, field: 'mid' | 'assign', value: string) => {
    if (field === 'mid') {
      setMidScores(prev => ({ ...prev, [roll]: value }));
    } else {
      setAssignmentScores(prev => ({ ...prev, [roll]: value }));
    }
  };

    const hasMarksErrors = cohortStudents.some(s => 
      validateMid(midScores[s.roll_number] || "") || 
      validateAssign(assignmentScores[s.roll_number] || "")
    );

    if (!activeSection) return;
    if (hasMarksErrors) {
      toast.error("Please fix all red out-of-range errors before saving marks.");
      return;
    }

    const updatedStudents = students.map(s => {
      const isMatch = s.department === activeSection.dept && 
                      s.year === activeSection.year && 
                      s.semester === activeSection.semester;
      if (isMatch) {
        const midVal = Number(midScores[s.roll_number] || 0);
        const assignVal = Number(assignmentScores[s.roll_number] || 0);

        return {
          ...s,
          mid1_marks: midVal,
          assignment_marks: assignVal,
        };
      }
      return s;
    });

    setStudents(updatedStudents);
    saveMockStudents(updatedStudents);
    toast.success(`Internal mid & assignment marks saved successfully for ${activeSection.subjectName} (${activeSection.name})!`);
  };

  // KPI Calculations
  const totalAssigned = roster.length;
  const completed = roster.filter(r => r.status === 'Corrected / Evaluated').length;
  const pending = totalAssigned - completed;
  const rate = totalAssigned > 0 ? Math.round((completed / totalAssigned) * 100) : 100;

  const totalEnrolled = cohortStudents.length;
  const submittedCount = cohortStudents.filter(s => {
    const mid = Number(midScores[s.roll_number] || 0);
    const assign = Number(assignmentScores[s.roll_number] || 0);
    return mid > 0 || assign > 0;
  }).length;
  const pendingCount = totalEnrolled - submittedCount;

  const filteredStudents = cohortStudents.filter(s => 
    s.full_name.toLowerCase().includes(marksSearch.toLowerCase()) || 
    s.roll_number.toLowerCase().includes(marksSearch.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="border-b border-border pb-4">
        <h1 className="font-display text-2xl font-extrabold tracking-tight text-slate-900">
          Evaluations & Marks Entry
        </h1>
        <p className="text-xs text-muted-foreground mt-0.5 font-medium">
          Access evaluations and internal mid-term score input consoles assigned to your classes.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border/80">
        <button
          onClick={() => setActiveTab('evaluations')}
          className={`px-6 py-3 text-xs font-black border-b-2 transition-all duration-200 cursor-pointer ${
            activeTab === 'evaluations'
              ? 'border-indigo-650 text-indigo-700 font-extrabold'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <FileText className="size-4 inline mr-1.5" />
          Evaluations
        </button>
        <button
          onClick={() => setActiveTab('marks')}
          className={`px-6 py-3 text-xs font-black border-b-2 transition-all duration-200 cursor-pointer ${
            activeTab === 'marks'
              ? 'border-indigo-650 text-indigo-700 font-extrabold'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <Layers className="size-4 inline mr-1.5" />
          Mid Marks Assignments
        </button>
      </div>

      {/* TAB 1: EVALUATIONS */}
      {activeTab === 'evaluations' && (
        <div className="space-y-6">
          {/* Stats Cards */}
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <KpiCard label="Total Assigned Copies" value={String(totalAssigned)} icon={FileText} tone="primary" />
            <KpiCard label="Pending Evaluation" value={String(pending)} icon={Clock} tone="warning" />
            <KpiCard label="Completed & Corrected" value={String(completed)} icon={CheckCircle2} tone="success" />
            <KpiCard label="Completion Rate" value={`${rate}%`} icon={Award} tone="info" />
          </div>

          <Card className="p-5 border border-slate-100 bg-white shadow-xs rounded-2xl">
            <div className="flex items-center justify-between border-b pb-3 mb-4">
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-800">
                Assigned Answer Copies for Evaluation (Blind Grading)
              </h3>
              <span className="text-[10px] text-muted-foreground font-semibold">Anonymized to ensure unbiased evaluation.</span>
            </div>

            {roster.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground font-semibold flex flex-col items-center justify-center gap-2">
                <Clock className="size-8 text-slate-350" />
                <span>No answer copies have been assigned for grading yet.</span>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {roster.map(copy => (
                  <Card key={copy.id} className="p-4 border border-slate-100 shadow-2xs hover:shadow-xs transition duration-200 space-y-4 rounded-xl">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="border-indigo-150 text-indigo-750 font-black bg-indigo-50/20">
                        {copy.blindCode}
                      </Badge>
                      <Badge className={
                        copy.status === 'Corrected / Evaluated' 
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-150 font-extrabold'
                          : 'bg-amber-50 text-amber-800 border-amber-150 font-extrabold'
                      }>
                        {copy.status === 'Corrected / Evaluated' ? 'Corrected' : 'Pending'}
                      </Badge>
                    </div>

                    <div>
                      <h4 className="font-bold text-xs text-slate-800">{copy.examName || "End Semester Theory Exam"}</h4>
                      <p className="text-[10px] text-muted-foreground mt-0.5 font-medium">Subject: {copy.subjectName}</p>
                    </div>

                    <div className="flex justify-between items-center border-t pt-3">
                      <div className="text-[10px] font-semibold text-slate-550">
                        Evaluated Score: <span className="font-black text-slate-900 text-xs">{copy.status === 'Corrected / Evaluated' ? `${copy.score}.00` : "--"}</span> <span className="text-[9px] text-muted-foreground font-normal">/ 70</span>
                      </div>
                      <Button
                        onClick={() => handleOpenCorrection(copy)}
                        className="h-7 text-[10px] font-bold px-3 rounded-lg border-border hover:bg-slate-50 cursor-pointer"
                        variant="outline"
                      >
                        <Eye className="size-3.5 mr-1" /> Review / Edit Marks
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </Card>
        </div>
      )}

      {/* TAB 2: MID MARKS ASSIGNMENTS */}
      {activeTab === 'marks' && (
        <div className="space-y-6">
          {/* Stats Cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <KpiCard label="Enrolled Cohort" value={`${totalEnrolled} Students`} icon={Users} tone="primary" />
            <KpiCard label="Marks Submitted" value={`${submittedCount} / ${totalEnrolled}`} icon={CheckCircle} tone="success" />
            <KpiCard label="Pending Submission" value={`${pendingCount}`} icon={AlertCircle} tone={pendingCount > 0 ? "warning" : "info"} />
          </div>

          {/* Taught Sections Cards Selector */}
          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-450 uppercase block tracking-wider">
              Your Taught Course Sections (Select a card to view enrolled students)
            </label>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {TAUGHT_SECTIONS.map((sec) => {
                const isSelected = selectedSecId === sec.id;
                return (
                  <Card 
                    key={sec.id}
                    onClick={() => setSelectedSecId(sec.id)}
                    className={`p-4 border transition-all duration-200 cursor-pointer rounded-2xl relative overflow-hidden flex flex-col justify-between ${
                      isSelected 
                        ? 'border-indigo-650 bg-indigo-50/20 ring-2 ring-indigo-600/10' 
                        : 'border-slate-100 hover:border-slate-200 bg-white hover:bg-slate-50/30'
                    }`}
                  >
                    <div>
                      <div className="flex justify-between items-start gap-2 mb-2">
                        <Badge variant="outline" className={`font-black text-[9px] tracking-wider uppercase ${
                          isSelected ? 'border-indigo-200 bg-indigo-50 text-indigo-750' : 'border-slate-200 text-slate-500 bg-slate-50'
                        }`}>
                          {sec.subjectCode}
                        </Badge>
                        {isSelected && (
                          <span className="size-4.5 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                            <CheckCircle className="size-3.5 fill-indigo-600 stroke-white" />
                          </span>
                        )}
                      </div>
                      
                      <h4 className="font-extrabold text-xs text-slate-800 line-clamp-1">{sec.subjectName}</h4>
                      <p className="text-[10px] text-muted-foreground font-medium mt-1">
                        B.Tech {sec.dept} • Year {sec.year} Sem {sec.semester}
                      </p>
                    </div>

                    <div className="border-t border-slate-100/80 pt-2.5 mt-3 flex items-center justify-between text-[10px] font-bold text-slate-550">
                      <span className="flex items-center gap-1">
                        <Users className="size-3.5 text-slate-400" />
                        {sec.strength} Enrolled Students
                      </span>
                      <span className="inline-flex items-center gap-1 font-black text-indigo-700 bg-indigo-50/40 px-2 py-0.5 rounded-md text-[9px]">
                        {sec.name}
                      </span>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Student grading Roster grid */}
          <Card className="p-5 border border-slate-100 bg-white shadow-xs rounded-2xl">
            {!activeSection ? (
              <div className="text-center py-12 text-muted-foreground font-semibold flex flex-col items-center justify-center gap-2">
                <BookMarked className="size-8 text-slate-350" />
                <span>No course-section selected. Please click on one of your taught section cards above.</span>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b pb-3">
                  <div>
                    <h3 className="font-bold text-xs uppercase tracking-wider text-slate-800 flex items-center gap-1">
                      <Layers className="size-4 text-indigo-650" />
                      Enrolled Students: {activeSection.subjectName} ({activeSection.name})
                    </h3>
                  </div>

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
                    <div className="relative w-full sm:w-64">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                      <Input
                        placeholder="Search by student name or roll..."
                        value={marksSearch}
                        onChange={e => setMarksSearch(e.target.value)}
                        className="pl-9 h-9 text-xs rounded-xl bg-card border-border placeholder:text-muted-foreground/60 w-full"
                      />
                    </div>

                    <Button
                      onClick={handleSaveMarks}
                      disabled={hasMarksErrors}
                      className="h-9 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-md cursor-pointer whitespace-nowrap"
                    >
                      <Save className="size-4 mr-1.5" /> Save Mid Marks (30M)
                    </Button>
                  </div>
                </div>

                {filteredStudents.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground font-semibold">
                    No students found for this cohort matching the filter.
                  </div>
                ) : (
                  <div className="overflow-x-auto border border-slate-100 rounded-xl">
                    <table className="min-w-full divide-y divide-slate-100 text-xs">
                      <thead className="bg-slate-55 text-slate-650 font-black uppercase text-[9px] tracking-wider">
                        <tr>
                          <th className="px-6 py-3 text-left">Roll No.</th>
                          <th className="px-6 py-3 text-left">Student Name</th>
                          <th className="px-6 py-3 text-center">Reg. Status</th>
                          <th className="px-6 py-3 text-center w-40">Mid Marks (Max 20)</th>
                          <th className="px-6 py-3 text-center w-40">Assignment (Max 10)</th>
                          <th className="px-6 py-3 text-center">Internal Score (Max 30)</th>
                          <th className="px-6 py-3 text-right">Status / Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 bg-white font-semibold text-slate-700">
                        {filteredStudents.map((stud) => {
                          const roll = stud.roll_number;
                          const mid = midScores[roll] || "0";
                          const assign = assignmentScores[roll] || "0";
                          const totalInternal = (validateMid(mid) ? 0 : Number(mid)) + (validateAssign(assign) ? 0 : Number(assign));
                          
                          const isMidErr = validateMid(mid);
                          const isAssignErr = validateAssign(assign);
                          const isSubmitted = Number(mid) > 0 || Number(assign) > 0;

                          return (
                            <tr key={roll} className="hover:bg-slate-50/50 transition">
                              <td className="px-6 py-3.5 font-mono font-bold text-slate-850">{roll}</td>
                              <td className="px-6 py-3.5 text-slate-800 font-bold">{stud.full_name}</td>
                              <td className="px-6 py-3.5 text-center">
                                <Badge className="bg-emerald-50 border border-emerald-150 text-emerald-800 font-extrabold">Active</Badge>
                              </td>
                              <td className="px-6 py-3.5">
                                <div className="flex flex-col items-center justify-center">
                                  <Input
                                    value={mid}
                                    onChange={e => handleScoreChange(roll, 'mid', e.target.value)}
                                    className={`h-8 w-24 text-center font-bold font-mono rounded-lg text-xs ${
                                      isMidErr ? "border-rose-500 bg-rose-50/30 focus:ring-rose-500 focus:border-rose-500" : ""
                                    }`}
                                  />
                                  {isMidErr && (
                                    <span className="text-[8px] font-bold text-rose-500 mt-1 block">Out of range (0-20)</span>
                                  )}
                                </div>
                              </td>
                              <td className="px-6 py-3.5">
                                <div className="flex flex-col items-center justify-center">
                                  <Input
                                    value={assign}
                                    onChange={e => handleScoreChange(roll, 'assign', e.target.value)}
                                    className={`h-8 w-24 text-center font-bold font-mono rounded-lg text-xs ${
                                      isAssignErr ? "border-rose-500 bg-rose-50/30 focus:ring-rose-500 focus:border-rose-500" : ""
                                    }`}
                                  />
                                  {isAssignErr && (
                                    <span className="text-[8px] font-bold text-rose-500 mt-1 block">Out of range (0-10)</span>
                                  )}
                                </div>
                              </td>
                              <td className="px-6 py-3.5 text-center font-mono font-black text-slate-900 text-sm">
                                {totalInternal}.00
                              </td>
                              <td className="px-6 py-3.5 text-right">
                                <Badge className={
                                  isSubmitted
                                    ? "bg-emerald-50 text-emerald-800 border-emerald-150 font-extrabold"
                                    : "bg-amber-50 text-amber-800 border-amber-150 font-extrabold"
                                }>
                                  {isSubmitted ? "Marks Entered" : "Requires Input"}
                                </Badge>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </Card>
        </div>
      )}

      {/* Digital Correction Studio Modal */}
      {isModalOpen && selectedCopy && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
          <div className="bg-white text-slate-800 w-full max-w-6xl rounded-2xl shadow-2xl flex flex-col h-[85vh] max-h-[85vh] overflow-hidden border border-slate-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50 rounded-t-2xl">
              <div className="flex items-center gap-3">
                <span className="p-2 bg-indigo-50 text-indigo-750 rounded-lg font-black text-xs">PDF</span>
                <div>
                  <h3 className="font-display text-sm font-bold flex items-center gap-2 text-slate-900">
                    Digital Correction Studio
                    <Badge variant="outline" className="border-indigo-200 text-indigo-750 bg-indigo-50/50">
                      {selectedCopy.blindCode}
                    </Badge>
                  </h3>
                  <p className="text-[10px] text-slate-500 font-medium mt-0.5">Subject: {selectedCopy.subjectName}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-[10px] font-bold text-emerald-700 uppercase flex items-center gap-1.5 font-mono">
                  <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                  Identity Anonymized
                </span>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-700 transition cursor-pointer">
                  <X className="size-5" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="flex-1 min-h-0 grid lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-slate-200 overflow-hidden">
              {/* Left Column: PDF Answer Sheet */}
              <div className="p-5 flex flex-col h-full overflow-hidden bg-slate-50/30">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2 mb-3">
                  <span className="text-[10px] font-black uppercase text-slate-455">Scanned Student Answer Sheet PDF</span>
                  <a 
                    href="https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf" 
                    target="_blank" 
                    className="text-[10px] font-bold text-indigo-650 hover:underline flex items-center gap-1"
                  >
                    Open in New Tab <FileDown className="size-3.5" />
                  </a>
                </div>

                <div className="flex-1 min-h-[300px] bg-slate-100 rounded-xl border border-slate-200 overflow-hidden relative shadow-inner">
                  <iframe 
                    src="https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf" 
                    className="w-full h-full border-none absolute inset-0"
                    title="Answer Copy PDF"
                  />
                </div>
              </div>

              {/* Right Column: Question Rubric Input */}
              <div className="p-5 overflow-y-auto h-full space-y-6 bg-white min-h-0">
                {/* Part A: Q1 - Q7 */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                    <h4 className="text-[10px] font-black uppercase text-slate-455 tracking-wider">
                      PART A: SHORT QUESTIONS (Q1 - Q7)
                    </h4>
                    <span className="text-[9px] text-slate-500 uppercase font-black font-mono">MAX 2 MARKS EACH</span>
                  </div>

                  <div className="grid gap-3 grid-cols-2 sm:grid-cols-4">
                    {[
                      { label: "Question 1", val: q1, set: setQ1 },
                      { label: "Question 2", val: q2, set: setQ2 },
                      { label: "Question 3", val: q3, set: setQ3 },
                      { label: "Question 4", val: q4, set: setQ4 },
                      { label: "Question 5", val: q5, set: setQ5 },
                      { label: "Question 6", val: q6, set: setQ6 },
                      { label: "Question 7", val: q7, set: setQ7 },
                    ].map((q, i) => {
                      const isErr = validateQ(q.val, 2);
                      return (
                        <div key={i} className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-500 block">{q.label}</label>
                          <Input
                            value={q.val}
                            onChange={e => q.set(e.target.value)}
                            className={`h-9 bg-white border-slate-350 text-slate-800 text-xs font-bold rounded-xl focus:ring-indigo-650 focus:border-indigo-650 ${
                              isErr ? "border-rose-500 bg-rose-50/20 focus:ring-rose-500 focus:border-rose-500" : ""
                            }`}
                          />
                          {isErr && (
                            <span className="text-[9px] font-bold text-rose-600 block mt-0.5">Out of range! Max 2 marks.</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Part B: Q8 - Q15 Choice Groups */}
                <div className="space-y-6">
                  <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                    <h4 className="text-[10px] font-black uppercase text-slate-455 tracking-wider">
                      PART B: LONG QUESTIONS (Q8 - Q15)
                    </h4>
                    <span className="text-[9px] text-slate-500 uppercase font-black font-mono">EITHER/OR CHOICE (A: MAX 8, B: MAX 6)</span>
                  </div>

                  {/* Choice 1: Q8 vs Q9 */}
                  <div className="space-y-3 bg-slate-50 border border-slate-200 p-4 rounded-xl">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
                      <span className="text-[10px] font-black text-indigo-700">Choice 1 Block</span>
                      <span className="text-[9px] font-bold text-slate-400">Best Attempt Max 14 marks</span>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      {/* Q8 */}
                      <div className="space-y-2 p-2 border border-slate-200 bg-white rounded-lg">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] font-bold text-slate-700">Question 8 (Choice 1A)</span>
                          {choice1.isFirstBest ? (
                            <Badge className="bg-emerald-50 text-emerald-855 border border-emerald-200 text-[9px] font-black">
                              ✓ Best Attempt ({choice1.score1} Marks)
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="border-slate-200 text-slate-400 text-[9px] font-bold bg-slate-50">
                              Ignored: Lower Attempt (0 M)
                            </Badge>
                          )}
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-[9px] text-slate-400 font-bold block mb-1">Subpart (a) (max 8)</label>
                            <Input value={q8a} onChange={e => setQ8a(e.target.value)} className="h-8 text-xs font-black bg-white border-slate-350 text-slate-800 rounded-lg" />
                            {validateQ(q8a, 8) && <span className="text-[8px] font-bold text-rose-500">Out of range (0-8)</span>}
                          </div>
                          <div>
                            <label className="text-[9px] text-slate-400 font-bold block mb-1">Subpart (b) (max 6)</label>
                            <Input value={q8b} onChange={e => setQ8b(e.target.value)} className="h-8 text-xs font-black bg-white border-slate-350 text-slate-800 rounded-lg" />
                            {validateQ(q8b, 6) && <span className="text-[8px] font-bold text-rose-500">Out of range (0-6)</span>}
                          </div>
                        </div>
                      </div>

                      {/* Q9 */}
                      <div className="space-y-2 p-2 border border-slate-200 bg-white rounded-lg">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] font-bold text-slate-700">Question 9 (Choice 1B)</span>
                          {!choice1.isFirstBest ? (
                            <Badge className="bg-emerald-50 text-emerald-855 border border-emerald-200 text-[9px] font-black">
                              ✓ Best Attempt ({choice1.score2} Marks)
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="border-slate-200 text-slate-400 text-[9px] font-bold bg-slate-50">
                              Ignored: Lower Attempt (0 M)
                            </Badge>
                          )}
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-[9px] text-slate-400 font-bold block mb-1">Subpart (a) (max 8)</label>
                            <Input value={q9a} onChange={e => setQ9a(e.target.value)} className="h-8 text-xs font-black bg-white border-slate-350 text-slate-800 rounded-lg" />
                            {validateQ(q9a, 8) && <span className="text-[8px] font-bold text-rose-500">Out of range (0-8)</span>}
                          </div>
                          <div>
                            <label className="text-[9px] text-slate-400 font-bold block mb-1">Subpart (b) (max 6)</label>
                            <Input value={q9b} onChange={e => setQ9b(e.target.value)} className="h-8 text-xs font-black bg-white border-slate-350 text-slate-800 rounded-lg" />
                            {validateQ(q9b, 6) && <span className="text-[8px] font-bold text-rose-500">Out of range (0-6)</span>}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Choice 2: Q10 vs Q11 */}
                  <div className="space-y-3 bg-slate-50 border border-slate-200 p-4 rounded-xl">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
                      <span className="text-[10px] font-black text-indigo-700">Choice 2 Block</span>
                      <span className="text-[9px] font-bold text-slate-400">Best Attempt Max 14 marks</span>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      {/* Q10 */}
                      <div className="space-y-2 p-2 border border-slate-200 bg-white rounded-lg">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] font-bold text-slate-700">Question 10 (Choice 2A)</span>
                          {choice2.isFirstBest ? (
                            <Badge className="bg-emerald-50 text-emerald-855 border border-emerald-200 text-[9px] font-black">
                              ✓ Best Attempt ({choice2.score1} Marks)
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="border-slate-200 text-slate-400 text-[9px] font-bold bg-slate-50">
                              Ignored: Lower Attempt (0 M)
                            </Badge>
                          )}
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-[9px] text-slate-400 font-bold block mb-1">Subpart (a) (max 8)</label>
                            <Input value={q10a} onChange={e => setQ10a(e.target.value)} className="h-8 text-xs font-black bg-white border-slate-300 text-slate-800 rounded-lg" />
                            {validateQ(q10a, 8) && <span className="text-[8px] font-bold text-rose-500">Out of range (0-8)</span>}
                          </div>
                          <div>
                            <label className="text-[9px] text-slate-400 font-bold block mb-1">Subpart (b) (max 6)</label>
                            <Input value={q10b} onChange={e => setQ10b(e.target.value)} className="h-8 text-xs font-black bg-white border-slate-300 text-slate-800 rounded-lg" />
                            {validateQ(q10b, 6) && <span className="text-[8px] font-bold text-rose-500">Out of range (0-6)</span>}
                          </div>
                        </div>
                      </div>

                      {/* Q11 */}
                      <div className="space-y-2 p-2 border border-slate-200 bg-white rounded-lg">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] font-bold text-slate-700">Question 11 (Choice 2B)</span>
                          {!choice2.isFirstBest ? (
                            <Badge className="bg-emerald-50 text-emerald-855 border border-emerald-200 text-[9px] font-black">
                              ✓ Best Attempt ({choice2.score2} Marks)
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="border-slate-200 text-slate-400 text-[9px] font-bold bg-slate-50">
                              Ignored: Lower Attempt (0 M)
                            </Badge>
                          )}
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-[9px] text-slate-400 font-bold block mb-1">Subpart (a) (max 8)</label>
                            <Input value={q11a} onChange={e => setQ11a(e.target.value)} className="h-8 text-xs font-black bg-white border-slate-300 text-slate-800 rounded-lg" />
                            {validateQ(q11a, 8) && <span className="text-[8px] font-bold text-rose-500">Out of range (0-8)</span>}
                          </div>
                          <div>
                            <label className="text-[9px] text-slate-400 font-bold block mb-1">Subpart (b) (max 6)</label>
                            <Input value={q11b} onChange={e => setQ11b(e.target.value)} className="h-8 text-xs font-black bg-white border-slate-300 text-slate-800 rounded-lg" />
                            {validateQ(q11b, 6) && <span className="text-[8px] font-bold text-rose-500">Out of range (0-6)</span>}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Choice 3: Q12 vs Q13 */}
                  <div className="space-y-3 bg-slate-50 border border-slate-200 p-4 rounded-xl">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
                      <span className="text-[10px] font-black text-indigo-700">Choice 3 Block</span>
                      <span className="text-[9px] font-bold text-slate-400">Best Attempt Max 14 marks</span>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      {/* Q12 */}
                      <div className="space-y-2 p-2 border border-slate-200 bg-white rounded-lg">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] font-bold text-slate-700">Question 12 (Choice 3A)</span>
                          {choice3.isFirstBest ? (
                            <Badge className="bg-emerald-50 text-emerald-855 border border-emerald-200 text-[9px] font-black">
                              ✓ Best Attempt ({choice3.score1} Marks)
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="border-slate-200 text-slate-400 text-[9px] font-bold bg-slate-50">
                              Ignored: Lower Attempt (0 M)
                            </Badge>
                          )}
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-[9px] text-slate-400 font-bold block mb-1">Subpart (a) (max 8)</label>
                            <Input value={q12a} onChange={e => setQ12a(e.target.value)} className="h-8 text-xs font-black bg-white border-slate-350 text-slate-800 rounded-lg" />
                            {validateQ(q12a, 8) && <span className="text-[8px] font-bold text-rose-500">Out of range (0-8)</span>}
                          </div>
                          <div>
                            <label className="text-[9px] text-slate-400 font-bold block mb-1">Subpart (b) (max 6)</label>
                            <Input value={q12b} onChange={e => setQ12b(e.target.value)} className="h-8 text-xs font-black bg-white border-slate-350 text-slate-800 rounded-lg" />
                            {validateQ(q12b, 6) && <span className="text-[8px] font-bold text-rose-500">Out of range (0-6)</span>}
                          </div>
                        </div>
                      </div>

                      {/* Q13 */}
                      <div className="space-y-2 p-2 border border-slate-200 bg-white rounded-lg">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] font-bold text-slate-700">Question 13 (Choice 3B)</span>
                          {!choice3.isFirstBest ? (
                            <Badge className="bg-emerald-50 text-emerald-855 border border-emerald-200 text-[9px] font-black">
                              ✓ Best Attempt ({choice3.score2} Marks)
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="border-slate-200 text-slate-400 text-[9px] font-bold bg-slate-50">
                              Ignored: Lower Attempt (0 M)
                            </Badge>
                          )}
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-[9px] text-slate-400 font-bold block mb-1">Subpart (a) (max 8)</label>
                            <Input value={q13a} onChange={e => setQ13a(e.target.value)} className="h-8 text-xs font-black bg-white border-slate-355 text-slate-800 rounded-lg" />
                            {validateQ(q13a, 8) && <span className="text-[8px] font-bold text-rose-500">Out of range (0-8)</span>}
                          </div>
                          <div>
                            <label className="text-[9px] text-slate-400 font-bold block mb-1">Subpart (b) (max 6)</label>
                            <Input value={q13b} onChange={e => setQ13b(e.target.value)} className="h-8 text-xs font-black bg-white border-slate-355 text-slate-800 rounded-lg" />
                            {validateQ(q13b, 6) && <span className="text-[8px] font-bold text-rose-500">Out of range (0-6)</span>}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Choice 4: Q14 vs Q15 */}
                  <div className="space-y-3 bg-slate-55 border border-slate-200 p-4 rounded-xl">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
                      <span className="text-[10px] font-black text-indigo-700">Choice 4 Block</span>
                      <span className="text-[9px] font-bold text-slate-400">Best Attempt Max 14 marks</span>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      {/* Q14 */}
                      <div className="space-y-2 p-2 border border-slate-200 bg-white rounded-lg">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] font-bold text-slate-700">Question 14 (Choice 4A)</span>
                          {choice4.isFirstBest ? (
                            <Badge className="bg-emerald-50 text-emerald-855 border border-emerald-200 text-[9px] font-black">
                              ✓ Best Attempt ({choice4.score1} Marks)
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="border-slate-200 text-slate-400 text-[9px] font-bold bg-slate-50">
                              Ignored: Lower Attempt (0 M)
                            </Badge>
                          )}
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-[9px] text-slate-400 font-bold block mb-1">Subpart (a) (max 8)</label>
                            <Input value={q14a} onChange={e => setQ14a(e.target.value)} className="h-8 text-xs font-black bg-white border-slate-300 text-slate-800 rounded-lg" />
                            {validateQ(q14a, 8) && <span className="text-[8px] font-bold text-rose-500">Out of range (0-8)</span>}
                          </div>
                          <div>
                            <label className="text-[9px] text-slate-400 font-bold block mb-1">Subpart (b) (max 6)</label>
                            <Input value={q14b} onChange={e => setQ14b(e.target.value)} className="h-8 text-xs font-black bg-white border-slate-300 text-slate-800 rounded-lg" />
                            {validateQ(q14b, 6) && <span className="text-[8px] font-bold text-rose-500">Out of range (0-6)</span>}
                          </div>
                        </div>
                      </div>

                      {/* Q15 */}
                      <div className="space-y-2 p-2 border border-slate-200 bg-white rounded-lg">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] font-bold text-slate-700">Question 15 (Choice 4B)</span>
                          {!choice4.isFirstBest ? (
                            <Badge className="bg-emerald-50 text-emerald-855 border border-emerald-200 text-[9px] font-black">
                              ✓ Best Attempt ({choice4.score2} Marks)
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="border-slate-200 text-slate-400 text-[9px] font-bold bg-slate-50">
                              Ignored: Lower Attempt (0 M)
                            </Badge>
                          )}
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-[9px] text-slate-400 font-bold block mb-1">Subpart (a) (max 8)</label>
                            <Input value={q15a} onChange={e => setQ15a(e.target.value)} className="h-8 text-xs font-black bg-white border-slate-300 text-slate-800 rounded-lg" />
                            {validateQ(q15a, 8) && <span className="text-[8px] font-bold text-rose-500">Out of range (0-8)</span>}
                          </div>
                          <div>
                            <label className="text-[9px] text-slate-400 font-bold block mb-1">Subpart (b) (max 6)</label>
                            <Input value={q15b} onChange={e => setQ15b(e.target.value)} className="h-8 text-xs font-black bg-white border-slate-300 text-slate-800 rounded-lg" />
                            {validateQ(q15b, 6) && <span className="text-[8px] font-bold text-rose-500">Out of range (0-6)</span>}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-slate-55 border-t border-slate-200 rounded-b-2xl flex flex-col sm:flex-row justify-between items-center gap-4">
              {hasEvalErrors ? (
                <div className="flex items-center gap-2 text-rose-700 text-xs font-black bg-rose-50 px-3 py-1.5 rounded-xl border border-rose-250">
                  <AlertCircle className="size-4 animate-bounce" />
                  Fix red out-of-range errors before submitting evaluation!
                </div>
              ) : (
                <div className="text-xs font-bold text-slate-600">
                  Evaluated Total Score: <span className="text-sm font-black text-indigo-700 font-mono">{evaluatedTotal}.00</span> / 70 Marks
                </div>
              )}

              <div className="flex gap-2">
                <Button 
                  onClick={() => setIsModalOpen(false)} 
                  variant="outline" 
                  className="h-9 border-slate-300 hover:bg-slate-100 hover:text-slate-900 text-xs font-extrabold rounded-xl"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleSubmitEvaluation}
                  disabled={hasEvalErrors}
                  className="h-9 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black px-4 rounded-xl flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <CheckCircle2 className="size-4" /> Submit Evaluation & Sync Marks
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
