import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useRole } from "@/context/role-context";
import {
  FACULTY_DASHBOARD_DATA_BY_DEPT,
  type FacultyDashboardData,
  type StudyMaterialItem,
} from "@/data/faculty-mock-data";
import {
  getCurrentFacultyUser,
  fetchFacultyCourseMaterials,
  uploadFacultyCourseMaterial,
  type MockFacultyUser,
} from "@/services/course-materials-service";

// Subcomponents imports
import { MaterialHeader } from "@/components/dashboard/materials/material-header";
import { SearchFilterBar } from "@/components/dashboard/materials/search-filter-bar";
import { StatisticsCards } from "@/components/dashboard/materials/statistics-cards";
import { MaterialDashboard } from "@/components/dashboard/materials/material-dashboard";
import { SubjectAccordion } from "@/components/dashboard/materials/subject-accordion";
import { VisibilityPanel } from "@/components/dashboard/materials/visibility-panel";
import { DownloadAnalytics } from "@/components/dashboard/materials/download-analytics";
import { MaterialLibrary } from "@/components/dashboard/materials/material-library";
import { UploadMaterialForm } from "@/components/dashboard/materials/upload-material-form";
import { UploadMaterialModal } from "@/components/dashboard/materials/upload-material-modal";
import { MaterialDetailDrawer } from "@/components/dashboard/materials/material-detail-drawer";
import { QuickActions } from "@/components/dashboard/materials/quick-actions";
import { SkeletonLoader } from "@/components/dashboard/materials/skeleton-loader";
import { toast } from "sonner";

export const Route = createFileRoute("/faculty/materials")({
  head: () => ({
    meta: [{ title: "Course Materials Repository — EduSuite Pro" }],
  }),
  component: FacultyMaterialsPage,
});

function FacultyMaterialsPage() {
  const { profile } = useRole();
  const deptCode = profile.department || "CSE";

  // Centralized login-aware faculty context
  const facultyUser: MockFacultyUser = getCurrentFacultyUser(deptCode);

  // Retrieve mock data dynamically based on active faculty context
  const dashboardData = (FACULTY_DASHBOARD_DATA_BY_DEPT[deptCode] || FACULTY_DASHBOARD_DATA_BY_DEPT["CSE"]) as FacultyDashboardData;
  const [materialsList, setMaterialsList] = useState<StudyMaterialItem[]>([]);
  const [loading, setLoading] = useState(false);

  // Sync state when faculty user / department changes
  useEffect(() => {
    const fetched = fetchFacultyCourseMaterials(facultyUser);
    setMaterialsList(fetched);
  }, [deptCode]);

  // Filters state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("ALL");
  const [selectedSection, setSelectedSection] = useState("ALL");
  const [selectedType, setSelectedType] = useState("ALL");
  const [selectedSemester, setSelectedSemester] = useState("ALL");
  const [selectedUnit, setSelectedUnit] = useState("ALL");
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [selectedYear, setSelectedYear] = useState("ALL");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Inline Upload Form toggle & Upload Modal toggle
  const [showInlineUpload, setShowInlineUpload] = useState(false);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);

  // Detail Drawer state
  const [selectedMaterial, setSelectedMaterial] = useState<StudyMaterialItem | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Extract unique filter fields restricted to faculty's assigned subjects ONLY
  const uniqueSubjects = facultyUser.assignedSubjects;
  const uniqueSections = facultyUser.assignedSections;

  const handleRefresh = () => {
    setLoading(true);
    toast.success(`Synchronizing ${facultyUser.department} study materials library...`, {
      description: `Fetching updated catalogue for ${facultyUser.name}.`,
    });
    setTimeout(() => {
      const fresh = fetchFacultyCourseMaterials(facultyUser);
      setMaterialsList(fresh);
      setLoading(false);
    }, 800);
  };

  const handleSelectMaterial = (item: StudyMaterialItem) => {
    setSelectedMaterial(item);
    setDrawerOpen(true);
  };

  // Add new material from upload wizard / form using centralized service
  const handleAddMaterial = (newMat: {
    title: string;
    subject: string;
    unit?: string;
    topic?: string;
    description?: string;
    fileType?: "PDF" | "PPT" | "Video" | "DOC" | "ZIP";
    fileSize?: string;
    visibility?: "Visible" | "Faculty Only" | "Scheduled" | "Draft";
    category?: any;
    allowDownload?: boolean;
    allowPreview?: boolean;
    section?: string;
    semester?: string;
  }) => {
    const freshMaterial = uploadFacultyCourseMaterial(
      {
        title: newMat.title,
        subject: newMat.subject,
        unit: newMat.unit || "Unit I",
        topic: newMat.topic,
        description: newMat.description,
        fileType: newMat.fileType,
        fileSize: newMat.fileSize,
        visibility: newMat.visibility,
        category: newMat.category,
        allowDownload: newMat.allowDownload,
        allowPreview: newMat.allowPreview,
        section: newMat.section,
        semester: newMat.semester,
      },
      facultyUser
    );

    setMaterialsList((prev) => [freshMaterial, ...prev]);
    setShowInlineUpload(false);
  };


  const handleDeleteMaterial = (id: string) => {
    setMaterialsList((prev) => prev.filter((m) => m.id !== id));
  };

  // Filter lists locally
  const filteredMaterials = materialsList.filter((mat) => {
    const matchesSearch =
      mat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mat.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (mat.keywords && mat.keywords.some((k) => k.toLowerCase().includes(searchQuery.toLowerCase())));

    const matchesSubject = selectedSubject === "ALL" || mat.subject === selectedSubject;
    const matchesSection = selectedSection === "ALL" || mat.section === selectedSection;
    const matchesType = selectedType === "ALL" || mat.fileType === selectedType;
    const matchesSemester = selectedSemester === "ALL" || mat.semester === selectedSemester;
    const matchesUnit = selectedUnit === "ALL" || mat.unit === selectedUnit;
    const matchesStatus = selectedStatus === "ALL" || mat.visibilityStatus === selectedStatus;
    const matchesYear = selectedYear === "ALL" || mat.academicYear === selectedYear;

    return (
      matchesSearch &&
      matchesSubject &&
      matchesSection &&
      matchesType &&
      matchesSemester &&
      matchesUnit &&
      matchesStatus &&
      matchesYear
    );
  });

  return (
    <div className="space-y-6 text-xs">
      {/* 1. Page Header */}
      <MaterialHeader
        academicYear={dashboardData.academicYear}
        semester={dashboardData.semester}
        onRefresh={handleRefresh}
        onUploadTrigger={() => setShowInlineUpload((prev) => !prev)}
      />

      {/* 2. Summary Cards (8 animated counter metrics) */}
      <StatisticsCards materials={materialsList} />

      {/* 3. Inline Upload Material Form (Collapsible/Triggered) */}
      {showInlineUpload && (
        <UploadMaterialForm
          uniqueSubjects={uniqueSubjects}
          uniqueSections={uniqueSections}
          facultyUser={facultyUser}
          onUploadMaterial={handleAddMaterial}
          onCancel={() => setShowInlineUpload(false)}
        />
      )}


      {/* 4. Subject & Unit-wise Organization Accordion */}
      <SubjectAccordion
        materials={materialsList}
        onSelectMaterial={handleSelectMaterial}
      />

      {/* 5. Search & Filters Toolbar */}
      <SearchFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedSubject={selectedSubject}
        onSubjectChange={setSelectedSubject}
        selectedSection={selectedSection}
        onSectionChange={setSelectedSection}
        selectedType={selectedType}
        onTypeChange={setSelectedType}
        selectedSemester={selectedSemester}
        onSemesterChange={setSelectedSemester}
        selectedUnit={selectedUnit}
        onUnitChange={setSelectedUnit}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
        selectedYear={selectedYear}
        onYearChange={setSelectedYear}
        uniqueSubjects={uniqueSubjects}
        uniqueSections={uniqueSections}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      {/* 6. Material Library Grid/List */}
      {loading ? (
        <SkeletonLoader />
      ) : (
        <MaterialLibrary
          materials={filteredMaterials}
          viewMode={viewMode}
          onSelectMaterial={handleSelectMaterial}
        />
      )}

      {/* 7. Download Analytics & Student Visibility Panel Split */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <DownloadAnalytics materials={materialsList} />
        <VisibilityPanel materials={materialsList} />
      </div>

      {/* 8. Quick Actions Cockpit */}
      <QuickActions onUploadClick={() => setShowInlineUpload(true)} />

      {/* 9. Upload Material Modal */}
      <UploadMaterialModal
        open={uploadModalOpen}
        onOpenChange={setUploadModalOpen}
        uniqueSubjects={uniqueSubjects}
        uniqueSections={uniqueSections}
        onUploadMaterial={handleAddMaterial}
      />

      {/* 10. Material Details & Preview Drawer Overlay */}
      <MaterialDetailDrawer
        material={selectedMaterial}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
      />
    </div>
  );
}

