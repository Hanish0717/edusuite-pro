import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { 
  FileText, 
  Upload, 
  Download, 
  Check, 
  BookOpen, 
  Award, 
  AlertCircle,
  HelpCircle
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRole } from "@/context/role-context";

export const Route = createFileRoute("/examcell/questions")({
  head: () => ({
    meta: [{ title: "Question Bank Repository — EduSuite Pro" }],
  }),
  component: QuestionBankPage,
});

interface QuestionPaper {
  id: string;
  subjectName: string;
  subjectCode: string;
  department: string;
  uploader: string;
  diffLevel: "Easy" | "Medium" | "Hard";
  status: "Approved" | "Pending Review";
  fileName: string;
}

function QuestionBankPage() {
  const { department: userDept } = useRole();
  const activeBranch = userDept || "CSE";

  // Default Mock Question Papers matching the UI layout
  const [papers, setPapers] = useState<QuestionPaper[]>([
    {
      id: "qp1",
      subjectName: "Data Structures & Algorithms",
      subjectCode: "CS-301",
      department: "CSE",
      uploader: "Dr. John Smith",
      diffLevel: "Medium",
      status: "Approved",
      fileName: "CS301_DSA_EndSem_2026.pdf"
    },
    {
      id: "qp2",
      subjectName: "Database Management Systems",
      subjectCode: "CS-382",
      department: "CSE",
      uploader: "Dr. Rajesh Kumar",
      diffLevel: "Medium",
      status: "Approved",
      fileName: "CS382_DBMS_EndSem_2026.pdf"
    },
    {
      id: "qp3",
      subjectName: "Microprocessors & Interfacing",
      subjectCode: "EC-385",
      department: "ECE",
      uploader: "Dr. Vikram Rao",
      diffLevel: "Hard",
      status: "Pending Review",
      fileName: "EC385_MP_EndSem_Draft.pdf"
    }
  ]);

  // Form input states
  const [subjectName, setSubjectName] = useState("");
  const [subjectCode, setSubjectCode] = useState("");
  const [department, setDepartment] = useState(activeBranch);
  const [diffLevel, setDiffLevel] = useState<"Easy" | "Medium" | "Hard">("Medium");
  const [uploader, setUploader] = useState("Dr. John Smith");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUploadPaper = (e: React.FormEvent) => {
    e.preventDefault();

    if (!subjectName || !subjectCode) {
      toast.error("Please fill in the Subject Name and Code.");
      return;
    }

    if (!selectedFile) {
      toast.error("Please select a question paper document/PDF file to upload.");
      return;
    }

    const newPaper: QuestionPaper = {
      id: `qp_${Date.now()}`,
      subjectName,
      subjectCode,
      department,
      uploader,
      diffLevel,
      status: "Pending Review",
      fileName: selectedFile.name
    };

    setPapers([...papers, newPaper]);
    toast.success(`Question Paper for ${subjectCode} uploaded successfully! Added to verification roster.`);
    
    // Clear form inputs
    setSubjectName("");
    setSubjectCode("");
    setSelectedFile(null);
    // Reset file input element
    const fileInput = document.getElementById("qp-file-input") as HTMLInputElement;
    if (fileInput) fileInput.value = "";
  };

  const handleApprovePaper = (id: string) => {
    const updated = papers.map(p => 
      p.id === id ? { ...p, status: "Approved" as const } : p
    );
    setPapers(updated);
    toast.success("Question paper approved and sealed for printing!");
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="border-b border-border pb-4">
        <div className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5 font-mono">
          Examcell <span className="text-[10px]">/</span> <span className="text-foreground font-bold">Questions</span>
        </div>
        <h1 className="font-display text-2xl font-extrabold tracking-tight mt-2 text-slate-900">
          Question Bank Repository
        </h1>
        <p className="text-xs text-muted-foreground mt-1 font-medium">
          Audit submitted faculty question papers, verify syllabus coverage, and approve files for final printing.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 items-start">
        {/* Left Column: Question Paper Submissions list */}
        <div className="lg:col-span-2">
          <Card className="bg-card border border-border/70 rounded-2xl shadow-xs overflow-hidden p-0">
            <div className="p-4 border-b border-border/60">
              <h3 className="text-sm font-bold text-slate-900">Question Paper Submissions</h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-650 font-extrabold border-b border-border/60 uppercase tracking-wider">
                  <tr>
                    <th className="px-4 py-3 text-[10px]">Subject & Code</th>
                    <th className="px-4 py-3 text-[10px]">Uploader / Faculty</th>
                    <th className="px-4 py-3 text-[10px] text-center">Diff Level</th>
                    <th className="px-4 py-3 text-[10px] text-center">Status</th>
                    <th className="px-4 py-3 text-[10px] text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50 font-semibold text-slate-700">
                  {papers.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/30 transition">
                      <td className="px-4 py-3.5">
                        <div className="font-extrabold text-slate-900">{p.subjectName}</div>
                        <div className="text-[10px] font-bold text-indigo-600 font-mono mt-0.5">
                          {p.subjectCode} | <span className="text-muted-foreground">{p.department}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-slate-800 font-bold">{p.uploader}</td>
                      <td className="px-4 py-3.5 text-center">
                        <Badge className={`
                          text-[9px] font-black uppercase px-2 py-0.5 border
                          ${p.diffLevel === "Hard" ? "bg-rose-50 text-rose-800 border-rose-200" : ""}
                          ${p.diffLevel === "Medium" ? "bg-indigo-50 text-indigo-800 border-indigo-200" : ""}
                          ${p.diffLevel === "Easy" ? "bg-emerald-50 text-emerald-800 border-emerald-200" : ""}
                        `}>
                          {p.diffLevel}
                        </Badge>
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        <Badge className={
                          p.status === "Approved" 
                            ? "bg-emerald-50 text-emerald-800 border border-emerald-150 font-extrabold"
                            : "bg-amber-50 text-amber-800 border border-amber-150 font-extrabold"
                        }>
                          {p.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center justify-end gap-2">
                          {p.status === "Pending Review" && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleApprovePaper(p.id)}
                              className="size-7 p-0 border-emerald-250 text-emerald-700 bg-emerald-50/20 hover:bg-emerald-50 hover:text-emerald-800 rounded-lg cursor-pointer"
                              title="Approve Paper"
                            >
                              <Check className="size-4" />
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => toast.success(`Simulated downloading paper: ${p.fileName}`)}
                            className="size-7 p-0 border-slate-200 hover:bg-slate-50 text-slate-600 hover:text-slate-900 rounded-lg cursor-pointer"
                            title={`Download ${p.fileName}`}
                          >
                            <Download className="size-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Right Column: Submit Form Card */}
        <div>
          <Card className="border border-slate-150 bg-white p-5 rounded-2xl shadow-xs space-y-4">
            <div className="border-b pb-3 flex items-center gap-1.5 text-slate-800">
              <Upload className="size-4 text-indigo-650" />
              <h3 className="text-xs font-black uppercase tracking-wider">
                + Submit Question Paper
              </h3>
            </div>

            <form onSubmit={handleUploadPaper} className="space-y-4 text-xs">
              {/* Subject Name */}
              <div>
                <label className="text-[10px] font-black uppercase text-muted-foreground block mb-1">
                  Subject Name
                </label>
                <Input
                  placeholder="e.g. Design of Machine Elements"
                  value={subjectName}
                  onChange={e => setSubjectName(e.target.value)}
                  className="h-9 text-xs rounded-xl bg-card border-border placeholder:text-muted-foreground/60"
                />
              </div>

              {/* Subject Code */}
              <div>
                <label className="text-[10px] font-black uppercase text-muted-foreground block mb-1">
                  Subject Code
                </label>
                <Input
                  placeholder="e.g. ME-402"
                  value={subjectCode}
                  onChange={e => setSubjectCode(e.target.value)}
                  className="h-9 text-xs rounded-xl bg-card border-border placeholder:text-muted-foreground/60"
                />
              </div>

              {/* Department */}
              <div>
                <label className="text-[10px] font-black uppercase text-muted-foreground block mb-1">
                  Department
                </label>
                <select
                  value={department}
                  onChange={e => setDepartment(e.target.value)}
                  className="w-full bg-card border border-border text-foreground rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none cursor-pointer"
                >
                  <option value="CSE">CSE</option>
                  <option value="AIML">AIML</option>
                  <option value="AIDS">AIDS</option>
                  <option value="ECE">ECE</option>
                  <option value="EEE">EEE</option>
                </select>
              </div>

              {/* Difficulty Level */}
              <div>
                <label className="text-[10px] font-black uppercase text-muted-foreground block mb-1">
                  Difficulty Level
                </label>
                <select
                  value={diffLevel}
                  onChange={e => setDiffLevel(e.target.value as any)}
                  className="w-full bg-card border border-border text-foreground rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none cursor-pointer"
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>

              {/* Author / Reviewer */}
              <div>
                <label className="text-[10px] font-black uppercase text-muted-foreground block mb-1">
                  Author / Reviewer
                </label>
                <select
                  value={uploader}
                  onChange={e => setUploader(e.target.value)}
                  className="w-full bg-card border border-border text-foreground rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none cursor-pointer"
                >
                  <option value="Dr. John Smith">Dr. John Smith</option>
                  <option value="Dr. Rajesh Kumar">Dr. Rajesh Kumar</option>
                  <option value="Dr. Vikram Rao">Dr. Vikram Rao</option>
                </select>
              </div>

              {/* Question Paper PDF/Doc file upload input */}
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-muted-foreground block">
                  Question Paper File (PDF/Doc)
                </label>
                <div className="border border-dashed border-slate-200 rounded-xl p-3 bg-slate-50/50 hover:bg-slate-50 transition cursor-pointer relative flex flex-col items-center justify-center text-center">
                  <input
                    type="file"
                    id="qp-file-input"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <Upload className="size-6 text-indigo-500 mb-1.5" />
                  <span className="text-[10px] text-slate-700 font-extrabold">
                    {selectedFile ? selectedFile.name : "Select or Drop PDF/Doc file"}
                  </span>
                  <span className="text-[9px] text-slate-400 font-semibold mt-0.5">
                    {selectedFile ? `${(selectedFile.size / 1024).toFixed(1)} KB` : "Max file size: 10MB"}
                  </span>
                </div>
              </div>

              {/* Upload Button */}
              <div className="pt-2">
                <Button 
                  type="submit"
                  className="w-full h-9 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <Upload className="size-4" /> + Upload Paper
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
