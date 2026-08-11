import { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { 
  UserCheck, 
  Search, 
  BookOpen, 
  DollarSign, 
  CheckCircle2, 
  AlertCircle,
  FileCheck2,
  Calendar,
  Layers
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRole } from "@/context/role-context";

export const Route = createFileRoute("/examcell/supplementary")({
  head: () => ({
    meta: [{ title: "Supplementary Registrations — EduSuite Pro" }],
  }),
  component: SupplementaryPage,
});

interface BacklogStudent {
  id: string;
  rollNumber: string;
  fullName: string;
  department: string;
  year: number;
  semester: number;
  failedSubjectCode: string;
  failedSubjectName: string;
  internalScore: number;
  externalScore: number;
  totalScore: number;
  feeStatus: "Paid" | "Pending";
}

const DEFAULT_BACKLOGS: BacklogStudent[] = [
  { id: "b1", rollNumber: '22CS102', fullName: 'J. Rahul', department: 'CSE', year: 3, semester: 5, failedSubjectCode: 'CS301', failedSubjectName: 'Formal Languages and Automata', internalScore: 12, externalScore: 22, totalScore: 34, feeStatus: 'Pending' },
  { id: "b2", rollNumber: '22CS115', fullName: 'B. Sravan', department: 'CSE', year: 3, semester: 5, failedSubjectCode: 'CS302', failedSubjectName: 'Computer Networks', internalScore: 10, externalScore: 18, totalScore: 28, feeStatus: 'Paid' },
  { id: "b3", rollNumber: 'AIML26002', fullName: 'Meka Krishna', department: 'AIML', year: 2, semester: 3, failedSubjectCode: 'ML03302', failedSubjectName: 'Introduction to Neural Networks', internalScore: 14, externalScore: 21, totalScore: 35, feeStatus: 'Pending' },
  { id: "b4", rollNumber: 'AIML26008', fullName: 'G. Akhil', department: 'AIML', year: 2, semester: 3, failedSubjectCode: 'ML03301', failedSubjectName: 'Probability and Statistics', internalScore: 11, externalScore: 19, totalScore: 30, feeStatus: 'Paid' },
  { id: "b5", rollNumber: '22EC067', fullName: 'R. Karthik', department: 'ECE', year: 3, semester: 5, failedSubjectCode: 'EC501', failedSubjectName: 'Digital Signal Processing', internalScore: 13, externalScore: 20, totalScore: 33, feeStatus: 'Pending' },
  { id: "b6", rollNumber: '22CS120', fullName: 'M. Harsha', department: 'CSE', year: 3, semester: 5, failedSubjectCode: 'CS301', failedSubjectName: 'Formal Languages and Automata', internalScore: 15, externalScore: 19, totalScore: 34, feeStatus: 'Pending' },
  { id: "b7", rollNumber: '22CS012', fullName: 'Y. Nikhila', department: 'CSE', year: 2, semester: 3, failedSubjectCode: 'CS201', failedSubjectName: 'Data Structures & Algorithms', internalScore: 14, externalScore: 20, totalScore: 34, feeStatus: 'Paid' }
];

function SupplementaryPage() {
  const { department: userDept } = useRole();

  // Local storage bound backlogs
  const [backlogs, setBacklogs] = useState<BacklogStudent[]>([]);
  
  // Filter states
  const [department, setDepartment] = useState("CSE");
  const [year, setYear] = useState<number>(3);
  const [semesterText, setSemesterText] = useState("Sem 5");
  const [search, setSearch] = useState("");

  // Sync state with logged-in user's department once loaded
  useEffect(() => {
    if (userDept) {
      setDepartment(userDept);
    }
  }, [userDept]);

  // Load backlogs from localStorage or use defaults
  useEffect(() => {
    const saved = localStorage.getItem("mock_backlogs_v3");
    if (saved) {
      setBacklogs(JSON.parse(saved));
    } else {
      localStorage.setItem("mock_backlogs_v3", JSON.stringify(DEFAULT_BACKLOGS));
      setBacklogs(DEFAULT_BACKLOGS);
    }
  }, []);

  const semesterNumber = Number(semesterText.replace("Sem ", ""));

  // Filter list
  const filteredBacklogs = backlogs.filter(b => 
    b.department === department &&
    b.year === year &&
    b.semester === semesterNumber &&
    (b.fullName.toLowerCase().includes(search.toLowerCase()) ||
     b.rollNumber.toLowerCase().includes(search.toLowerCase()) ||
     b.failedSubjectName.toLowerCase().includes(search.toLowerCase()) ||
     b.failedSubjectCode.toLowerCase().includes(search.toLowerCase()))
  );

  const handleRegisterSupply = (id: string) => {
    const updated = backlogs.map(b => 
      b.id === id ? { ...b, feeStatus: "Paid" as const } : b
    );
    setBacklogs(updated);
    localStorage.setItem("mock_backlogs_v3", JSON.stringify(updated));
    toast.success("Supplementary exam registration successful! Hall ticket clearance issued.");
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="border-b border-border pb-4">
        <div className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5 font-mono">
          Examcell <span className="text-[10px]">/</span> <span className="text-foreground font-bold">Supplementary</span>
        </div>
        <h1 className="font-display text-2xl font-extrabold tracking-tight mt-2 text-slate-900">
          Supplementary Registrations
        </h1>
        <p className="text-xs text-muted-foreground mt-1 font-medium">
          Manage backlogs and print supplementary registration tokens for failed students in your branch.
        </p>
      </div>

      {/* Filter Card */}
      <Card className="bg-card border border-border/70 p-5 rounded-2xl shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {/* Department */}
          <div>
            <label className="text-xs font-bold text-muted-foreground block mb-1">Department</label>
            <select
              value={department}
              disabled={!!userDept}
              onChange={e => setDepartment(e.target.value)}
              className="w-full bg-card border border-border text-foreground rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
            >
              {userDept ? (
                <option value={userDept}>{userDept}</option>
              ) : (
                <>
                  <option value="CSE">CSE</option>
                  <option value="AIML">AIML</option>
                  <option value="AIDS">AIDS</option>
                  <option value="ECE">ECE</option>
                  <option value="EEE">EEE</option>
                </>
              )}
            </select>
          </div>

          {/* Year */}
          <div>
            <label className="text-xs font-bold text-muted-foreground block mb-1">Year</label>
            <select
              value={year}
              onChange={e => {
                const nextYear = Number(e.target.value);
                setYear(nextYear);
                // Update default semester based on year
                setSemesterText(`Sem ${nextYear * 2 - 1}`);
              }}
              className="w-full bg-card border border-border text-foreground rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none cursor-pointer"
            >
              <option value={1}>1st Year</option>
              <option value={2}>2nd Year</option>
              <option value={3}>3rd Year</option>
              <option value={4}>4th Year</option>
            </select>
          </div>

          {/* Semester */}
          <div>
            <label className="text-xs font-bold text-muted-foreground block mb-1">Semester</label>
            <select
              value={semesterText}
              onChange={e => setSemesterText(e.target.value)}
              className="w-full bg-card border border-border text-foreground rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none cursor-pointer"
            >
              <option value={`Sem ${year * 2 - 1}`}>Sem {year * 2 - 1}</option>
              <option value={`Sem ${year * 2}`}>Sem {year * 2}</option>
            </select>
          </div>

          {/* Search */}
          <div>
            <label className="text-xs font-bold text-muted-foreground block mb-1">Search student / subject</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                placeholder="Name, Roll No, Code..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-9 h-9 text-xs rounded-xl bg-card border-border placeholder:text-muted-foreground/60"
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Roster of Failed Students */}
      <Card className="bg-card border border-border/70 rounded-2xl shadow-xs overflow-hidden p-0">
        <div className="p-4 border-b border-border/60 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Failed Students & Backlog Roster</h3>
            <p className="text-[11px] text-muted-foreground mt-0.5 font-semibold">
              Showing students with backlogs in {department} B.Tech Year {year} {semesterText} (Passing marks required: 36/100).
            </p>
          </div>
        </div>

        {filteredBacklogs.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground font-semibold flex flex-col items-center justify-center gap-1.5">
            <CheckCircle2 className="size-8 text-emerald-500" />
            <span>No backlog cases found for this cohort filter selection.</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-extrabold border-b border-border/60 uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3 text-[10px]">Student Info</th>
                  <th className="px-4 py-3 text-[10px]">Failed Subject</th>
                  <th className="px-4 py-3 text-[10px] text-center">Last Score</th>
                  <th className="px-4 py-3 text-[10px] text-center">Fee Status</th>
                  <th className="px-4 py-3 text-[10px] text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50 font-semibold text-slate-700">
                {filteredBacklogs.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/30 transition">
                    {/* Student Info */}
                    <td className="px-4 py-3.5">
                      <div className="font-extrabold text-slate-900">{b.fullName}</div>
                      <div className="text-[10px] font-bold text-slate-450 font-mono mt-0.5">{b.rollNumber}</div>
                    </td>

                    {/* Failed Subject */}
                    <td className="px-4 py-3.5">
                      <div className="font-bold text-slate-800">{b.failedSubjectName}</div>
                      <div className="text-[10px] font-bold text-indigo-600 font-mono mt-0.5">{b.failedSubjectCode}</div>
                    </td>

                    {/* Last Score */}
                    <td className="px-4 py-3.5 text-center font-mono font-bold text-rose-650">
                      <div>{b.totalScore} / 100</div>
                      <div className="text-[9px] text-slate-400 font-semibold">
                        (Int: {b.internalScore} | Ext: {b.externalScore})
                      </div>
                    </td>

                    {/* Fee Status */}
                    <td className="px-4 py-3.5 text-center">
                      <Badge className={
                        b.feeStatus === "Paid"
                          ? "bg-emerald-50 text-emerald-800 border border-emerald-150 font-extrabold"
                          : "bg-amber-50 text-amber-800 border border-amber-150 font-extrabold"
                      }>
                        {b.feeStatus}
                      </Badge>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3.5 text-right">
                      {b.feeStatus === "Pending" ? (
                        <Button
                          size="sm"
                          onClick={() => handleRegisterSupply(b.id)}
                          className="h-8 bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-black rounded-lg cursor-pointer px-3.5 shadow-xs"
                        >
                          Pay & Register
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          disabled
                          className="h-8 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-black rounded-lg px-3.5 opacity-80"
                        >
                          Registered
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
