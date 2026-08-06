import { useState, useCallback, useMemo } from "react";
import { GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import type { AssessmentModuleData, AssessmentItem, AssessmentStats } from "./types";
import { StatisticsCards } from "./statistics-cards";
import { AssessmentToolbar } from "./assessment-toolbar";
import { AssessmentCard } from "./assessment-card";
import { AssessmentDetailsDrawer } from "./assessment-details-drawer";
import { CreateAssessmentModal } from "./create-assessment-modal";
import { MarksEntryTable } from "./marks-entry-table";
import { EmptyState, SkeletonLoader } from "./empty-state";
import { QuickActions } from "./quick-actions";

interface AssessmentModuleProps {
  data: AssessmentModuleData;
  facultyName: string;
  academicYear: string;
  semester: string;
}

export function AssessmentModule({
  data,
  facultyName,
  academicYear,
  semester,
}: AssessmentModuleProps) {
  const [assessments, setAssessments] = useState<AssessmentItem[]>(data.assessments);
  const [filtered, setFiltered] = useState<AssessmentItem[]>(data.assessments);
  const [selected, setSelected] = useState<AssessmentItem | null>(null);
  const [marksEntryItem, setMarksEntryItem] = useState<AssessmentItem | null>(null);
  const [editingItem, setEditingItem] = useState<AssessmentItem | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [loading] = useState(false);

  // Compute stats dynamically from active assessments list
  const computedStats: AssessmentStats = useMemo(() => {
    const total = assessments.length;
    const published = assessments.filter((a) => a.status === "Published").length;
    const draft = assessments.filter((a) => a.status === "Draft").length;
    const marksPending = assessments.reduce((s, a) => s + (a.studentsAppeared - a.studentsEvaluated), 0);
    const studentsEvaluated = assessments.reduce((s, a) => s + a.studentsEvaluated, 0);
    const avgScores = assessments.map((a) => a.performance.average);
    const averageScore = avgScores.length ? Math.round(avgScores.reduce((a, b) => a + b, 0) / avgScores.length) : 0;
    const highestScore = assessments.length ? Math.max(...assessments.map((a) => a.performance.highest)) : 0;
    const lowestScore = assessments.length ? Math.min(...assessments.map((a) => a.performance.lowest)) : 0;

    return {
      total,
      published,
      draft,
      marksPending,
      studentsEvaluated,
      averageScore,
      highestScore,
      lowestScore,
    };
  }, [assessments]);

  const handleFilter = useCallback((list: AssessmentItem[]) => setFiltered(list), []);

  const handleCreateNew = () => {
    setEditingItem(null);
    setShowCreate(true);
  };

  const handleView = (a: AssessmentItem) => {
    setSelected(a);
  };

  const handleEnterMarksCard = (a: AssessmentItem) => {
    setMarksEntryItem(a);
  };

  const handleEdit = (a: AssessmentItem) => {
    setEditingItem(a);
    setShowCreate(true);
  };

  const handlePublish = (a: AssessmentItem) => {
    setAssessments((prev) =>
      prev.map((item) => (item.id === a.id ? { ...item, status: "Published" } : item))
    );
    setFiltered((prev) =>
      prev.map((item) => (item.id === a.id ? { ...item, status: "Published" } : item))
    );
    toast.success(`Assessment "${a.name}" published successfully!`);
  };

  const handleDelete = (a: AssessmentItem) => {
    setAssessments((prev) => prev.filter((item) => item.id !== a.id));
    setFiltered((prev) => prev.filter((item) => item.id !== a.id));
    toast.success(`Assessment "${a.name}" deleted.`);
  };

  const handleQuickEnterMarks = () => {
    const target = assessments.find((a) => a.studentsEvaluated < a.studentsAppeared) || assessments[0];
    if (target) {
      setMarksEntryItem(target);
    } else {
      toast.info("No assessments available for marks entry.");
    }
  };

  const handlePublishResults = () => {
    let count = 0;
    setAssessments((prev) =>
      prev.map((item) => {
        if (item.status === "Draft") {
          count++;
          return { ...item, status: "Published" };
        }
        return item;
      })
    );
    setFiltered((prev) =>
      prev.map((item) => (item.status === "Draft" ? { ...item, status: "Published" } : item))
    );
    if (count > 0) {
      toast.success(`Published ${count} draft assessment(s) successfully!`);
    } else {
      toast.info("All assessments are already published.");
    }
  };

  const handleExportMarks = () => {
    toast.success("Assessment marks exported successfully (CSV/Excel).");
  };

  const handleSaveForm = (formData: any, isEdit: boolean, publish: boolean) => {
    const maxM = parseInt(formData.maxMarks) || 100;
    if (isEdit && editingItem) {
      const updated: AssessmentItem = {
        ...editingItem,
        name: formData.name || editingItem.name,
        type: formData.type || editingItem.type,
        subject: formData.subject || editingItem.subject,
        section: formData.section || editingItem.section,
        maxMarks: maxM,
        date: formData.date || editingItem.date,
        duration: formData.duration || editingItem.duration,
        weightage: formData.weightage || editingItem.weightage,
        instructions: formData.instructions || editingItem.instructions,
        submissionMethod: formData.submissionMethod || editingItem.submissionMethod,
        status: publish ? "Published" : editingItem.status,
      };
      setAssessments((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
      setFiltered((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
      toast.success(`Updated "${updated.name}"`);
    } else {
      const newItem: AssessmentItem = {
        id: `asmnt-new-${Date.now()}`,
        name: formData.name || "Untitled Assessment",
        type: formData.type || "Internal 1",
        subject: formData.subject || "Subject",
        code: "SUB101",
        section: formData.section || "A",
        semester: semester,
        academicYear: academicYear,
        maxMarks: maxM,
        date: formData.date || new Date().toISOString().split("T")[0],
        duration: formData.duration || "2 Hours",
        weightage: formData.weightage || "20%",
        instructions: formData.instructions || "",
        submissionMethod: formData.submissionMethod || "Written Booklet",
        status: publish ? "Published" : "Draft",
        studentsAppeared: 60,
        studentsEvaluated: 0,
        marks: [],
        gradeDistribution: [],
        performance: {
          highest: 0,
          lowest: 0,
          average: 0,
          median: 0,
          passPercentage: 0,
          failPercentage: 0,
          topPerformers: [],
          needsImprovement: [],
        },
        workflow: [],
        timeline: [],
      };
      setAssessments((prev) => [newItem, ...prev]);
      setFiltered((prev) => [newItem, ...prev]);
      toast.success(`Created assessment "${newItem.name}"`);
    }
  };

  // Unique subjects + sections for forms
  const subjects = Array.from(new Set(assessments.map((a) => a.subject)));
  const sections = Array.from(new Set(assessments.map((a) => a.section)));

  return (
    <div className="space-y-6">
      {/* ── Page Header ─────────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="size-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
            <GraduationCap className="size-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-foreground leading-tight">
              Assessment & Internal Marks
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              {facultyName} · AY {academicYear} · Semester {semester}
            </p>
          </div>
        </div>

        <Button
          id="create-assessment-btn"
          onClick={handleCreateNew}
          className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 transition-all"
        >
          + Create Assessment
        </Button>
      </div>

      {/* ── Summary Statistics ──────────────────────────────────── */}
      <StatisticsCards stats={computedStats} />

      {/* ── Quick Actions ────────────────────────────────────────── */}
      <QuickActions
        onCreateAssessment={handleCreateNew}
        onEnterMarks={handleQuickEnterMarks}
        onPublishResults={handlePublishResults}
        onExportMarks={handleExportMarks}
      />

      {/* ── Search & Filters ────────────────────────────────────── */}
      <AssessmentToolbar
        academicYear={academicYear}
        semester={semester}
        assessments={assessments}
        onFilter={handleFilter}
        onExport={handleExportMarks}
      />

      {/* ── Assessment List (Primary Section) ───────────────────── */}
      {loading ? (
        <SkeletonLoader />
      ) : filtered.length === 0 ? (
        <EmptyState onCreateAssessment={handleCreateNew} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((a) => (
            <AssessmentCard
              key={a.id}
              assessment={a}
              onView={handleView}
              onEnterMarks={handleEnterMarksCard}
              onEdit={handleEdit}
              onPublish={handlePublish}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* ── Modals / Sheets ──────────────────────────────────────── */}
      <AssessmentDetailsDrawer
        assessment={selected}
        open={selected !== null}
        onClose={() => setSelected(null)}
      />

      {marksEntryItem && (
        <MarksEntryTable
          assessment={marksEntryItem}
          open={marksEntryItem !== null}
          onClose={() => setMarksEntryItem(null)}
        />
      )}

      <CreateAssessmentModal
        open={showCreate}
        onClose={() => {
          setShowCreate(false);
          setEditingItem(null);
        }}
        subjects={subjects}
        sections={sections}
        assessmentToEdit={editingItem}
        onSave={handleSaveForm}
      />
    </div>
  );
}
