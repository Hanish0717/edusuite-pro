import { useState, useCallback } from "react";
import { GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { AssessmentModuleData, AssessmentItem } from "./types";
import { StatisticsCards } from "./statistics-cards";
import { AssessmentToolbar } from "./assessment-toolbar";
import { AssessmentDashboard } from "./assessment-dashboard";
import { AssessmentCard } from "./assessment-card";
import { AssessmentDetailsDrawer } from "./assessment-details-drawer";
import { CreateAssessmentModal } from "./create-assessment-modal";
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
  const [filtered, setFiltered] = useState<AssessmentItem[]>(data.assessments);
  const [selected, setSelected] = useState<AssessmentItem | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [loading, _setLoading] = useState(false);

  const handleFilter = useCallback((list: AssessmentItem[]) => setFiltered(list), []);
  const handleCardClick = (a: AssessmentItem) => setSelected(a);
  const handleCloseDrawer = () => setSelected(null);
  const handleEnterMarks = () => {
    if (data.assessments[0]) setSelected(data.assessments[0]);
  };

  // Unique subjects + sections for forms
  const subjects = Array.from(new Set(data.assessments.map((a) => a.subject)));
  const sections = Array.from(new Set(data.assessments.map((a) => a.section)));

  return (
    <div className="space-y-6">
      {/* ── Header ──────────────────────────────────────────────── */}
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
          onClick={() => setShowCreate(true)}
          className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 transition-all"
        >
          + Create Assessment
        </Button>
      </div>

      {/* ── Statistics ───────────────────────────────────────────── */}
      <StatisticsCards stats={data.stats} />

      {/* ── Quick Actions ────────────────────────────────────────── */}
      <QuickActions onCreateAssessment={() => setShowCreate(true)} onEnterMarks={handleEnterMarks} />

      {/* ── Dashboard Widget ─────────────────────────────────────── */}
      <AssessmentDashboard assessments={data.assessments} />

      {/* ── Toolbar ──────────────────────────────────────────────── */}
      <AssessmentToolbar
        academicYear={academicYear}
        semester={semester}
        assessments={data.assessments}
        onFilter={handleFilter}
      />

      {/* ── Assessment List ──────────────────────────────────────── */}
      {loading ? (
        <SkeletonLoader />
      ) : filtered.length === 0 ? (
        <EmptyState onCreateAssessment={() => setShowCreate(true)} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((a) => (
            <AssessmentCard key={a.id} assessment={a} onClick={handleCardClick} />
          ))}
        </div>
      )}

      {/* ── Modals / Sheets ──────────────────────────────────────── */}
      <AssessmentDetailsDrawer
        assessment={selected}
        open={selected !== null}
        onClose={handleCloseDrawer}
      />

      <CreateAssessmentModal
        open={showCreate}
        onClose={() => setShowCreate(false)}
        subjects={subjects}
        sections={sections}
      />
    </div>
  );
}
