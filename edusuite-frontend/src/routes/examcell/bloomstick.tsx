import { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { 
  Award, 
  Layers, 
  HelpCircle, 
  Brain, 
  TrendingUp, 
  ChevronRight,
  BookOpen,
  Filter
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid
} from "recharts";

export const Route = createFileRoute("/examcell/bloomstick")({
  head: () => ({
    meta: [{ title: "Bloomstick OBE Analysis — EduSuite Pro" }],
  }),
  component: BloomstickAnalysisPage,
});

interface BloomLevelData {
  subject: string;
  A: number;
  fullMark: number;
}

// Generate deterministic static Bloom's taxonomy data based on filters to simulate dynamic calculations
const getBloomData = (
  regulation: string,
  year: string,
  branch: string,
  semester: string,
  section: string,
  student: string
): BloomLevelData[] => {
  // Let's create a seed or hash from selection values to vary numbers slightly
  const seed = (regulation.charCodeAt(2) || 0) + 
               (year.charCodeAt(0) || 0) + 
               (branch.charCodeAt(0) || 0) + 
               (semester.charCodeAt(4) || 0) + 
               (section.charCodeAt(4) || 0) + 
               (student ? student.charCodeAt(0) : 0);

  // Generate slightly adjusted data based on seed
  const factor = (seed % 10) / 20; // -0.25 to 0.25 variance

  return [
    { subject: "Remember (L1)", A: Math.max(1, Math.min(5, Number((4.1 + factor).toFixed(2)))), fullMark: 5 },
    { subject: "Understand (L2)", A: Math.max(1, Math.min(5, Number((3.8 - factor).toFixed(2)))), fullMark: 5 },
    { subject: "Apply (L3)", A: Math.max(1, Math.min(5, Number((3.5 + factor * 0.5).toFixed(2)))), fullMark: 5 },
    { subject: "Analyze (L4)", A: Math.max(1, Math.min(5, Number((3.2 - factor * 0.8).toFixed(2)))), fullMark: 5 },
    { subject: "Evaluate (L5)", A: Math.max(1, Math.min(5, Number((3.0 + factor).toFixed(2)))), fullMark: 5 },
    { subject: "Create (L6)", A: Math.max(1, Math.min(5, Number((2.8 - factor * 0.5).toFixed(2)))), fullMark: 5 },
  ];
};

const STUDENTS_BY_BRANCH: Record<string, string[]> = {
  CSE: ["K. Sai Teja (22CS101)", "Priya Sundaram (22CS102)", "Anish Kulkarni (22CS103)", "D. Manohar (22CS104)"],
  AIML: ["Rohan Sharma (22AL01)", "Nikita Reddy (22AL02)", "Vikranth Rao (22AL03)"],
  AIDS: ["Sneha Paul (22AD11)", "Tarun Sen (22AD12)", "S. Krithika (22AD13)"],
  ECE: ["Riya Sen (22EC01)", "Kabir Bedi (22EC02)", "T. Pawan (22EC03)"],
  MECH: ["Arjun Mehta (22ME51)", "Devendra Yadav (22ME52)", "R. Pranav (22ME53)"]
};

function BloomstickAnalysisPage() {
  // Filters state
  const [selectedReg, setSelectedReg] = useState("AR23");
  const [selectedYear, setSelectedYear] = useState("2026");
  const [selectedBranch, setSelectedBranch] = useState("CSE");
  const [selectedSem, setSelectedSem] = useState("Sem 5");
  const [selectedSection, setSelectedSection] = useState("Sec A");
  const [selectedStudent, setSelectedStudent] = useState("");

  const [bloomData, setBloomData] = useState<BloomLevelData[]>([]);

  // Trigger recalculation on filters change
  useEffect(() => {
    setBloomData(getBloomData(selectedReg, selectedYear, selectedBranch, selectedSem, selectedSection, selectedStudent));
  }, [selectedReg, selectedYear, selectedBranch, selectedSem, selectedSection, selectedStudent]);

  // Adjust student dropdown selection options when branch changes
  const studentsList = STUDENTS_BY_BRANCH[selectedBranch] || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-4">
        <div>
          <h2 className="font-display text-2xl font-extrabold tracking-tight text-slate-900">
            Bloomstick Analysis (OBE)
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Outcome Based Education (OBE) cognitive levels and curriculum attainment analysis.
          </p>
        </div>
        <Badge className="bg-brand-gradient text-white w-fit font-mono text-[10px] px-2.5 py-1">
          BLOOM'S TAXONOMY INDEX
        </Badge>
      </div>

      {/* Cascading Filter Card */}
      <Card className="bg-card border border-border/70 p-5 rounded-2xl shadow-xs">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5 mb-4">
          <Filter className="size-4 text-indigo-600" /> Filter OBE Attainment Level
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div>
            <label className="text-[10px] font-black text-muted-foreground uppercase block mb-1">Regulation</label>
            <select
              value={selectedReg}
              onChange={e => {
                setSelectedReg(e.target.value);
                setSelectedStudent(""); // Reset student
              }}
              className="w-full bg-card border border-border text-foreground rounded-xl px-2.5 py-2 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
            >
              <option value="AR23">AR23 (Latest)</option>
              <option value="AR21">AR21 (Current)</option>
              <option value="AR19">AR19 (Legacy)</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] font-black text-muted-foreground uppercase block mb-1">Passed Out Year</label>
            <select
              value={selectedYear}
              onChange={e => {
                setSelectedYear(e.target.value);
                setSelectedStudent("");
              }}
              className="w-full bg-card border border-border text-foreground rounded-xl px-2.5 py-2 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
            >
              <option value="2027">2027 Passout</option>
              <option value="2026">2026 Passout</option>
              <option value="2025">2025 Passout</option>
              <option value="2024">2024 Passout</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] font-black text-muted-foreground uppercase block mb-1">Branch / Dept</label>
            <select
              value={selectedBranch}
              onChange={e => {
                setSelectedBranch(e.target.value);
                setSelectedStudent(""); // Reset student
              }}
              className="w-full bg-card border border-border text-foreground rounded-xl px-2.5 py-2 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
            >
              <option value="CSE">CSE</option>
              <option value="AIML">AIML</option>
              <option value="AIDS">AIDS</option>
              <option value="ECE">ECE</option>
              <option value="MECH">MECH</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] font-black text-muted-foreground uppercase block mb-1">Semester</label>
            <select
              value={selectedSem}
              onChange={e => {
                setSelectedSem(e.target.value);
                setSelectedStudent("");
              }}
              className="w-full bg-card border border-border text-foreground rounded-xl px-2.5 py-2 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
            >
              <option value="Sem 1">Semester 1</option>
              <option value="Sem 2">Semester 2</option>
              <option value="Sem 3">Semester 3</option>
              <option value="Sem 4">Semester 4</option>
              <option value="Sem 5">Semester 5</option>
              <option value="Sem 6">Semester 6</option>
              <option value="Sem 7">Semester 7</option>
              <option value="Sem 8">Semester 8</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] font-black text-muted-foreground uppercase block mb-1">Section</label>
            <select
              value={selectedSection}
              onChange={e => {
                setSelectedSection(e.target.value);
                setSelectedStudent("");
              }}
              className="w-full bg-card border border-border text-foreground rounded-xl px-2.5 py-2 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
            >
              <option value="Sec A">Section A</option>
              <option value="Sec B">Section B</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] font-black text-muted-foreground uppercase block mb-1">Individual Student</label>
            <select
              value={selectedStudent}
              onChange={e => setSelectedStudent(e.target.value)}
              className="w-full bg-card border border-border text-foreground rounded-xl px-2.5 py-2 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
            >
              <option value="">-- View Cohort Average --</option>
              {studentsList.map((stud) => (
                <option key={stud} value={stud}>{stud}</option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* Visual Analytics Dashboard */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Radar Spider-web Chart */}
        <Card className="lg:col-span-1 p-5 bg-card border border-border/70 shadow-xs rounded-2xl flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
              <Brain className="size-4 text-indigo-600" /> Attainment Profile Radar
            </h3>
            <p className="text-[10px] text-muted-foreground mt-0.5">
              Attained cognitive scores distribution out of 5.0.
            </p>
          </div>
          
          <div className="h-64 w-full flex items-center justify-center pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={bloomData}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="subject" stroke="#64748b" fontSize={9} fontWeight="bold" />
                <PolarRadiusAxis angle={30} domain={[0, 5]} fontSize={8} stroke="#94a3b8" />
                <Radar
                  name="Attainment Level"
                  dataKey="A"
                  stroke="#4f46e5"
                  fill="#818cf8"
                  fillOpacity={0.4}
                />
                <Tooltip contentStyle={{ fontSize: "11px", fontWeight: "bold" }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Grouped Bar Chart */}
        <Card className="lg:col-span-2 p-5 bg-card border border-border/70 shadow-xs rounded-2xl flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
              <TrendingUp className="size-4 text-indigo-600" /> Cognitive Levels Attainment
            </h3>
            <p className="text-[10px] text-muted-foreground mt-0.5">
              Visualizing Remember to Create taxonomy dimensions comparison.
            </p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={bloomData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="subject" stroke="#64748b" fontSize={9} fontWeight="bold" />
                <YAxis stroke="#94a3b8" fontSize={10} domain={[0, 5]} />
                <Tooltip 
                  contentStyle={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "12px", fontSize: "11px", fontWeight: "bold" }} 
                />
                <Legend wrapperStyle={{ fontSize: "10px", fontWeight: "bold", paddingTop: "5px" }} />
                <Bar dataKey="A" name="Attained Score" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Target Attainment Details Panel */}
      <Card className="bg-card border border-border/70 p-5 rounded-2xl shadow-xs">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5 mb-4">
          <BookOpen className="size-4 text-indigo-600" /> Detailed Level Mapping & Action Log
        </h3>
        
        <div className="overflow-x-auto text-xs font-semibold text-slate-700">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-600 font-extrabold uppercase tracking-wider">
              <tr>
                <th className="px-4 py-2.5 text-[10px]">Bloom's Level</th>
                <th className="px-4 py-2.5 text-[10px]">Description</th>
                <th className="px-4 py-2.5 text-[10px] text-center">Score (out of 5.0)</th>
                <th className="px-4 py-2.5 text-[10px] text-center">Attainment Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {bloomData.map((d) => (
                <tr key={d.subject} className="hover:bg-slate-50/50">
                  <td className="px-4 py-3 font-bold text-slate-900">{d.subject}</td>
                  <td className="px-4 py-3 text-muted-foreground font-medium">
                    {d.subject.includes("L1") && "Recalling facts and basic concepts (Definitions, lists, retrieve)."}
                    {d.subject.includes("L2") && "Explaining ideas or concepts (Classify, describe, discuss)."}
                    {d.subject.includes("L3") && "Using information in new situations (Solve, demonstrate, operate)."}
                    {d.subject.includes("L4") && "Drawing connections among ideas (Differentiate, organize, relate)."}
                    {d.subject.includes("L5") && "Justifying a stand or decision (Appraise, defend, select, value)."}
                    {d.subject.includes("L6") && "Producing new or original work (Design, assemble, construct)."}
                  </td>
                  <td className="px-4 py-3 font-mono font-bold text-slate-900 text-center">{d.A}</td>
                  <td className="px-4 py-3 text-center">
                    <Badge className={
                      d.A >= 3.8 
                        ? "bg-emerald-50 text-emerald-800 border-emerald-250 font-black" 
                        : d.A >= 3.0 
                          ? "bg-indigo-50 text-indigo-850 border-indigo-200 font-black" 
                          : "bg-amber-50 text-amber-900 border-amber-250 font-black"
                    }>
                      {d.A >= 3.8 ? "Exceeded Target" : d.A >= 3.0 ? "Target Attained" : "Review Needed"}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
