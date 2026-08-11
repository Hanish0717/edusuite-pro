import { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Award, 
  Download, 
  Layers,
  Filter,
  CheckCircle2
} from "lucide-react";
import { Panel } from "@/components/dashboard/panel";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { GroupedBarChart } from "@/components/dashboard/charts";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useRole } from "@/context/role-context";
import { getMockStudents } from "@/lib/mock-examcell-state";

export const Route = createFileRoute("/examcell/analytics")({
  head: () => ({
    meta: [{ title: "Exam Cell Analytics — EduSuite Pro" }],
  }),
  component: AnalyticsPage,
});

// Branch specific stats
const STATS_MAP: Record<string, { passRate: string; candidates: string; distinctions: string; evaluators: string }> = {
  Overall: { passRate: "93.3%", candidates: "2,980", distinctions: "242", evaluators: "90" },
  CSE: { passRate: "95.5%", candidates: "850", distinctions: "86", evaluators: "28" },
  AIML: { passRate: "94.2%", candidates: "450", distinctions: "42", evaluators: "16" },
  AIDS: { passRate: "94.6%", candidates: "400", distinctions: "38", evaluators: "14" },
  EEE: { passRate: "90.2%", candidates: "320", distinctions: "22", evaluators: "12" },
  ECE: { passRate: "92.1%", candidates: "580", distinctions: "54", evaluators: "20" },
};

function AnalyticsPage() {
  const { department: userDept, flags } = useRole();
  const isOfficer = flags.includes("isExamController") || flags.includes("isSystemAdmin");

  // Selection filters
  const [selectedBranch, setSelectedBranch] = useState("Overall");
  const [selectedSem, setSelectedSem] = useState("All Semesters");

  // Lock branch choice for Exam Assistants
  useEffect(() => {
    if (!isOfficer && userDept) {
      setSelectedBranch(userDept);
    }
  }, [userDept, isOfficer]);

  const activeStats = STATS_MAP[selectedBranch] || STATS_MAP["Overall"];

  // Helper: Get chart title depending on selections
  const getChartTitle = () => {
    if (selectedBranch === "Overall") {
      return selectedSem === "All Semesters" 
        ? "Overall Branch-Wise Pass Rates" 
        : `Overall Branch-Wise Pass Rates for ${selectedSem}`;
    } else {
      return selectedSem === "All Semesters"
        ? `${selectedBranch} Semester-Wise Pass & Fail Ratios`
        : `${selectedBranch} ${selectedSem} Sections Performance`;
    }
  };

  // Dynamic Chart Data mapping based on filters
  const getChartData = () => {
    if (selectedBranch === "Overall") {
      // Comparison across all branches
      if (selectedSem === "All Semesters") {
        return [
          { term: "CSE", "Pass %": 95.5, "Fail %": 4.5 },
          { term: "AIML", "Pass %": 94.2, "Fail %": 5.8 },
          { term: "AIDS", "Pass %": 94.6, "Fail %": 5.4 },
          { term: "ECE", "Pass %": 92.1, "Fail %": 7.9 },
          { term: "EEE", "Pass %": 90.2, "Fail %": 9.8 }
        ];
      } else {
        // Specific semester, compare branches
        return [
          { term: "CSE", "Pass %": 96.8, "Fail %": 3.2 },
          { term: "AIML", "Pass %": 95.4, "Fail %": 4.6 },
          { term: "AIDS", "Pass %": 94.8, "Fail %": 5.2 },
          { term: "ECE", "Pass %": 91.5, "Fail %": 8.5 },
          { term: "EEE", "Pass %": 89.6, "Fail %": 10.4 }
        ];
      }
    } else {
      // Specific branch analytics
      if (selectedSem === "All Semesters") {
        // Sem 1 to Sem 8 breakdown
        return [
          { term: "Sem 1", "Pass %": 92.4, "Fail %": 7.6 },
          { term: "Sem 2", "Pass %": 94.1, "Fail %": 5.9 },
          { term: "Sem 3", "Pass %": 93.6, "Fail %": 6.4 },
          { term: "Sem 4", "Pass %": 95.2, "Fail %": 4.8 },
          { term: "Sem 5", "Pass %": selectedBranch === "CSE" ? 96.8 : 95.4, "Fail %": selectedBranch === "CSE" ? 3.2 : 4.6 },
          { term: "Sem 6", "Pass %": 96.1, "Fail %": 3.9 },
          { term: "Sem 7", "Pass %": 97.5, "Fail %": 2.5 },
          { term: "Sem 8", "Pass %": 98.2, "Fail %": 1.8 }
        ];
      } else {
        // Specific semester section-wise breakdown
        return [
          { term: "Sec A", "Pass %": 95.8, "Fail %": 4.2 },
          { term: "Sec B", "Pass %": 97.2, "Fail %": 2.8 },
          { term: "Sec C", "Pass %": 94.5, "Fail %": 5.5 }
        ];
      }
    }
  };

  const chartData = getChartData();

  // PDF Report Download (Downloads a valid, pre-compiled PDF page)
  const handleDownloadPDF = () => {
    try {
      // Pre-compiled base64 encoding of a valid 1-page PDF showing "Student Records Analytics Dummy Report"
      const DUMMY_PDF_BASE64 = "JVBERi0xLjQKMSAwIG9iago8PCAvVHlwZSAvQ2F0YWxvZyAvUGFnZXMgMiAwIFIgPj4KZW5kb2JqCjIgMCBvYmoKPDwgL1R5cGUgL1BhZ2VzIC9LaWRzIFsgMyAwIFIgXSAvQ291bnQgMSA+PgplbmRvYmoKMyAwIG9iago8PCAvVHlwZSAvUGFnZSAvUGFyZW50IDIgMCBSIC9SZXNvdXJjZXMgPDwgL0ZvbnQgPDwgL0YxIDw8IC9UeXBlIC9Gb250IC9TdWJ0eXBlIC9UeXBlMSAvQmFzZUZvbnQgL0hlbHZldGljYSA+PiA+PiA+PiAvTWVkaWFCb3ggWyAwIDAgNTk1IDg0MiBdIC9Db250ZW50cyA0IDAgUiA+PgplbmRvYmoKNCAwIG9iago8PCAvTGVuZ3RoIDE3NSA+PgpzdHJlYW0KQlQKL0YxIDE0IFRmCjUwIDgwMCBUZAooQ0FNUFVTIEXYQU1JTkFUSU9OIFBPUlRBTCAtIFNUVURFTlQgUkVDT1JEUykgVGoKRVQgCkJUCi9GMSAxMiBUZgo1MCA3NzAgVGQKKFN0dWRlbnQgUmVjb3JkcyBBbmFseXRpY3MgRHVtbXkgUmVwb3J0KSBUagpFVAogCkJUCi9GMSAxMCBUZgo1MCA3NDAgVGQKKFBhcmFtZXRlcnM6IEJyYW5jaDogT3ZlcmFsbCB8IFNlbWVzdGVyOiBBbGwgU2VtZXN0ZXJzKSBUagpFVAplbmRzdHJlYW0KZW5kb2J4cmVmCjAgNQowMDAwMDAwMDAwIDY1NTM1IGYgCjAwMDAwMDAwMDkgMDAwMDAgbiAKMDAwMDAwMDA1OCAwMDAwMCBuIAowMDAwMDAwMTE1IDAwMDAwIG4gCjAwMDAwMDAyODQgMDAwMDAgbiAKdHJhaWxlcgo8PCAvU2l6ZSA1IC9Sb290IDEgMCBSID4+CnN0YXJ0eHJlZgozODAKJSVFT0Y=";
      
      const byteCharacters = atob(DUMMY_PDF_BASE64);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: "application/pdf" });
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `student_records_${selectedBranch.toLowerCase()}_${selectedSem.toLowerCase().replace(/ /g, "_")}.pdf`;
      link.click();
      window.URL.revokeObjectURL(url);
      
      toast.success("Dummy PDF records page downloaded successfully!");
    } catch (e) {
      toast.error("Failed to download dummy PDF page.");
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header and Controls */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-4">
        <div>
          <div className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5 font-mono">
            Examcell <span className="text-[10px]">/</span> <span className="text-foreground font-bold">Analytics</span>
          </div>
          <h1 className="font-display text-2xl font-extrabold tracking-tight mt-2 text-slate-900">
            {selectedBranch === "Overall" ? "Overall" : selectedBranch} Examination Analytics
          </h1>
          <p className="text-xs text-muted-foreground mt-1 font-medium">
            Academic pass ratios, candidate distributions, and evaluation progress for {selectedBranch === "Overall" ? "all branches" : `the ${selectedBranch} Department`}.
          </p>
        </div>

        {/* Action Controls: PDF download button */}
        <div className="flex items-center gap-2 shrink-0">
          <Button
            onClick={handleDownloadPDF}
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black uppercase tracking-wider h-9 rounded-xl flex items-center gap-1.5 px-4 shadow-sm cursor-pointer"
          >
            <Download className="size-4" /> Download Records
          </Button>
        </div>
      </div>

      {/* Interactive Filter panel */}
      <Card className="bg-card border border-border/70 p-4 rounded-2xl shadow-xs">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700 shrink-0">
            <Filter className="size-4 text-indigo-600" />
            <span>Filter Report:</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1 w-full">
            {/* Branch Select */}
            <div>
              <select
                value={selectedBranch}
                disabled={!isOfficer}
                onChange={e => setSelectedBranch(e.target.value)}
                className="w-full bg-card border border-border text-foreground rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
              >
                {isOfficer ? (
                  <>
                    <option value="Overall">Overall (All Branches)</option>
                    <option value="CSE">CSE (Computer Science)</option>
                    <option value="AIML">AIML (Neural Networks)</option>
                    <option value="AIDS">AIDS (Data Science)</option>
                    <option value="ECE">ECE (Electronics)</option>
                    <option value="EEE">EEE (Electrical)</option>
                  </>
                ) : (
                  <option value={selectedBranch}>{selectedBranch} Department</option>
                )}
              </select>
            </div>

            {/* Semester Select */}
            <div>
              <select
                value={selectedSem}
                onChange={e => setSelectedSem(e.target.value)}
                className="w-full bg-card border border-border text-foreground rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none cursor-pointer"
              >
                <option value="All Semesters">All Semesters</option>
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
          </div>
        </div>
      </Card>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label={`${selectedBranch} Pass Percentage`} value={activeStats.passRate} icon={TrendingUp} tone="success" />
        <KpiCard label="Branch Candidates" value={activeStats.candidates} icon={Users} tone="info" />
        <KpiCard label="Distinctions Mapped" value={activeStats.distinctions} icon={Award} tone="purple" />
        <KpiCard label="Active Evaluators" value={activeStats.evaluators} icon={BarChart3} tone="warning" />
      </div>

      {/* Semester Wise Pass & Fail Ratio Analytics Graph */}
      <Panel title={getChartTitle()}>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Chart Display (2/3 width) */}
          <div className="lg:col-span-2 bg-card border border-border/40 rounded-2xl p-4">
            <h4 className="text-[10px] font-black text-slate-500 mb-4 uppercase tracking-wider">
              {selectedBranch} {selectedSem === "All Semesters" ? "Branches Comparison" : selectedSem} Ratios (%)
            </h4>
            <div className="h-[280px]">
              <GroupedBarChart
                data={chartData}
                xKey="term"
                series={[
                  { key: "Pass %", label: "Pass Percentage" },
                  { key: "Fail %", label: "Fail Percentage" }
                ]}
                height={260}
              />
            </div>
          </div>

          {/* Text Roster Breakdown (1/3 width) */}
          <div className="flex flex-col justify-center space-y-3">
            <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider border-b border-border pb-2">
              Performance Summary
            </h4>
            <div className="space-y-2 max-h-[260px] overflow-y-auto pr-1">
              {chartData.map((d) => (
                <div key={d.term} className="flex items-center justify-between text-xs font-semibold py-1 border-b border-slate-100/50">
                  <span className="text-muted-foreground">{selectedBranch === "Overall" ? "" : `${selectedBranch} `}{d.term}</span>
                  <div className="flex items-center gap-1.5 font-mono">
                    <span className="font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded text-[10px]">
                      {d["Pass %"]}% Pass
                    </span>
                    <span className="font-extrabold text-red-600 bg-red-50 px-2 py-0.5 rounded text-[10px]">
                      {d["Fail %"]}% Fail
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Panel>
    </div>
  );
}
