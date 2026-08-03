import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useRole } from "@/context/role-context";
import {
  FACULTY_DASHBOARD_DATA_BY_DEPT,
  type FacultyDashboardData,
  type AssignmentItem,
  type StudentSubmission,
} from "@/data/faculty-mock-data";

// Subcomponents imports
import { AssignmentHeader } from "@/components/dashboard/assignments/assignment-header";
import { SearchFilterBar } from "@/components/dashboard/assignments/search-filter-bar";
import { StatisticsCards } from "@/components/dashboard/assignments/statistics-cards";
import { AssignmentDashboard } from "@/components/dashboard/assignments/assignment-dashboard";
import { AssignmentList } from "@/components/dashboard/assignments/assignment-list";
import { CreateAssignmentModal } from "@/components/dashboard/assignments/create-assignment-modal";
import { AssignmentDetailDrawer } from "@/components/dashboard/assignments/assignment-detail-drawer";
import { EvaluationWorkspace } from "@/components/dashboard/assignments/evaluation-workspace";
import { QuickActions } from "@/components/dashboard/assignments/quick-actions";
import { SkeletonLoader } from "@/components/dashboard/assignments/skeleton-loader";
import { toast } from "sonner";

export const Route = createFileRoute("/faculty/assignments")({
  head: () => ({
    meta: [{ title: "Assignments — EduSuite Pro" }],
  }),
  component: FacultyAssignmentsPage,
});

function FacultyAssignmentsPage() {
  const { profile } = useRole();
  const deptCode = profile.department || "CSE";

  // Retrieve mock data dynamically based on active department
  const dashboardData = (FACULTY_DASHBOARD_DATA_BY_DEPT[deptCode] || FACULTY_DASHBOARD_DATA_BY_DEPT["CSE"]) as FacultyDashboardData;
  const [assignmentsList, setAssignmentsList] = useState<AssignmentItem[]>([]);
  const [loading, setLoading] = useState(false);

  // Sync state when department changes
  useEffect(() => {
    setAssignmentsList(dashboardData.assignmentsDetailsList || []);
  }, [deptCode]);

  // Filters state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("ALL");
  const [selectedSection, setSelectedSection] = useState("ALL");
  const [selectedStatus, setSelectedStatus] = useState("ALL");

  // Create Modal toggles
  const [createModalOpen, setCreateModalOpen] = useState(false);

  // Detail Drawer state
  const [selectedAssignment, setSelectedAssignment] = useState<AssignmentItem | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Evaluation state
  const [evaluatingSubmission, setEvaluatingSubmission] = useState<StudentSubmission | null>(null);
  const [evaluationWorkspaceOpen, setEvaluationWorkspaceOpen] = useState(false);

  // Extract unique filter fields
  const uniqueSubjects = Array.from(new Set(assignmentsList.map((a) => a.subject)));
  const uniqueSections = Array.from(new Set(assignmentsList.map((a) => a.section)));

  const handleRefresh = () => {
    setLoading(true);
    toast.success("Synchronizing assignments roster...", {
      description: "Fetching updated class details.",
    });
    setTimeout(() => {
      setLoading(false);
    }, 800);
  };

  const handleSelectAssignment = (item: AssignmentItem) => {
    setSelectedAssignment(item);
    setDrawerOpen(true);
  };

  // Callback to evaluate a specific student from the submission panel
  const handleOpenEvaluation = (sub: StudentSubmission) => {
    setEvaluatingSubmission(sub);
    setEvaluationWorkspaceOpen(true);
  };

  // Callback to save grades
  const handleSaveEvaluation = (
    rollNumber: string,
    marks: number,
    feedback: string,
    evalStatus: "Evaluated" | "Draft"
  ) => {
    if (!selectedAssignment) return;

    // Update locally
    const updatedSubmissions = selectedAssignment.submissions.map((sub) => {
      if (sub.rollNumber === rollNumber) {
        return {
          ...sub,
          marks,
          feedback,
          evaluationStatus: evalStatus,
        };
      }
      return sub;
    });

    const updatedAsg = {
      ...selectedAssignment,
      submissions: updatedSubmissions,
      evaluationStatus:
        updatedSubmissions.every((sub) => sub.evaluationStatus === "Evaluated")
          ? ("Completed" as const)
          : ("In-Progress" as const),
    };

    // Update assignment list state
    setAssignmentsList((prev) =>
      prev.map((a) => (a.id === selectedAssignment.id ? updatedAsg : a))
    );
    setSelectedAssignment(updatedAsg);
  };

  // Add new assignment from multi-step wizard
  const handleAddAssignment = (newAsg: {
    title: string;
    subject: string;
    code: string;
    section: string;
    dueDate: string;
    maxMarks: number;
    description: string;
    status: "Active" | "Draft";
  }) => {
    const freshAssignment: AssignmentItem = {
      id: `asg-${deptCode}-${Date.now()}`,
      title: newAsg.title,
      description: newAsg.description,
      subject: newAsg.subject,
      code: newAsg.code,
      section: newAsg.section,
      semester: dashboardData.semester,
      academicYear: dashboardData.academicYear,
      dueDate: newAsg.dueDate,
      maxMarks: newAsg.maxMarks,
      totalStudents: 66,
      submittedCount: 0,
      evaluationStatus: "Pending",
      status: newAsg.status,
      submissions: [
        { rollNumber: `24${deptCode}001`, studentName: "Aarav Sharma", submissionTime: "", status: "Pending", fileIndicator: false, evaluationStatus: "Pending" },
        { rollNumber: `24${deptCode}002`, studentName: "Bhavna Patel", submissionTime: "", status: "Pending", fileIndicator: false, evaluationStatus: "Pending" },
      ],
      timeline: [
        { event: "Draft Created & Configured", date: "Today", status: "Completed" },
        { event: "Assignment Published to Roster", date: "Today", status: "Completed" },
      ],
    };

    setAssignmentsList((prev) => [freshAssignment, ...prev]);
  };

  // Filter lists locally
  const filteredAssignments = assignmentsList.filter((asg) => {
    const matchesSearch =
      asg.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asg.code.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSubject = selectedSubject === "ALL" || asg.subject === selectedSubject;
    const matchesSection = selectedSection === "ALL" || asg.section === selectedSection;
    const matchesStatus = selectedStatus === "ALL" || asg.status === selectedStatus;

    return matchesSearch && matchesSubject && matchesSection && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* 1. Page Header */}
      <AssignmentHeader
        academicYear={dashboardData.academicYear}
        semester={dashboardData.semester}
        onRefresh={handleRefresh}
        onCreateTrigger={() => setCreateModalOpen(true)}
      />

      {/* 2. Statistics Counter cards */}
      <StatisticsCards assignments={assignmentsList} />

      {/* 3. Dashboard KPI metrics */}
      <AssignmentDashboard assignments={assignmentsList} />

      {/* 4. Toolbar Filters */}
      <SearchFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedSubject={selectedSubject}
        onSubjectChange={setSelectedSubject}
        selectedSection={selectedSection}
        onSectionChange={setSelectedSection}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
        uniqueSubjects={uniqueSubjects}
        uniqueSections={uniqueSections}
      />

      {/* 5. Assignment Lists */}
      {loading ? (
        <SkeletonLoader />
      ) : (
        <AssignmentList
          assignments={filteredAssignments}
          onSelectAssignment={handleSelectAssignment}
        />
      )}

      {/* 6. Stepper Wizard creation modal */}
      <CreateAssignmentModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
        uniqueSubjects={uniqueSubjects}
        uniqueSections={uniqueSections}
        onAddAssignment={handleAddAssignment}
      />

      {/* 7. Details Sheet Drawer Overlay */}
      <AssignmentDetailDrawer
        assignment={selectedAssignment}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        onOpenEvaluation={handleOpenEvaluation}
      />

      {/* 8. Nested evaluation workspace dialog */}
      <EvaluationWorkspace
        submission={evaluatingSubmission}
        open={evaluationWorkspaceOpen}
        onOpenChange={setEvaluationWorkspaceOpen}
        onSaveEvaluation={handleSaveEvaluation}
      />

      {/* 9. Bottom Quick Actions cockpit shortcuts */}
      <div className="pt-4 border-t">
        <QuickActions onCreateClick={() => setCreateModalOpen(true)} />
      </div>
    </div>
  );
}
