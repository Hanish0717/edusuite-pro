import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useRole } from "@/context/role-context";
import {
  FACULTY_DASHBOARD_DATA_BY_DEPT,
  type FacultyDashboardData,
  type StudyMaterialItem,
} from "@/data/faculty-mock-data";

// Subcomponents imports
import { MaterialHeader } from "@/components/dashboard/materials/material-header";
import { SearchFilterBar } from "@/components/dashboard/materials/search-filter-bar";
import { StatisticsCards } from "@/components/dashboard/materials/statistics-cards";
import { MaterialDashboard } from "@/components/dashboard/materials/material-dashboard";
import { MaterialLibrary } from "@/components/dashboard/materials/material-library";
import { UploadMaterialModal } from "@/components/dashboard/materials/upload-material-modal";
import { MaterialDetailDrawer } from "@/components/dashboard/materials/material-detail-drawer";
import { QuickActions } from "@/components/dashboard/materials/quick-actions";
import { SkeletonLoader } from "@/components/dashboard/materials/skeleton-loader";
import { toast } from "sonner";

export const Route = createFileRoute("/faculty/materials")({
  head: () => ({
    meta: [{ title: "Study Materials — EduSuite Pro" }],
  }),
  component: FacultyMaterialsPage,
});

function FacultyMaterialsPage() {
  const { profile } = useRole();
  const deptCode = profile.department || "CSE";

  // Retrieve mock data dynamically based on active department
  const dashboardData = (FACULTY_DASHBOARD_DATA_BY_DEPT[deptCode] || FACULTY_DASHBOARD_DATA_BY_DEPT["CSE"]) as FacultyDashboardData;
  const [materialsList, setMaterialsList] = useState<StudyMaterialItem[]>([]);
  const [loading, setLoading] = useState(false);

  // Sync state when department changes
  useEffect(() => {
    setMaterialsList(dashboardData.studyMaterialsList || []);
  }, [deptCode]);

  // Filters state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("ALL");
  const [selectedSection, setSelectedSection] = useState("ALL");
  const [selectedType, setSelectedType] = useState("ALL");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Upload Modal toggles
  const [uploadModalOpen, setUploadModalOpen] = useState(false);

  // Detail Drawer state
  const [selectedMaterial, setSelectedMaterial] = useState<StudyMaterialItem | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Extract unique filter fields
  const uniqueSubjects = Array.from(new Set(materialsList.map((m) => m.subject)));
  const uniqueSections = Array.from(new Set(materialsList.map((m) => m.section)));

  const handleRefresh = () => {
    setLoading(true);
    toast.success("Synchronizing study materials library...", {
      description: "Fetching updated files catalogue.",
    });
    setTimeout(() => {
      setLoading(false);
    }, 800);
  };

  const handleSelectMaterial = (item: StudyMaterialItem) => {
    setSelectedMaterial(item);
    setDrawerOpen(true);
  };

  // Add new material from upload wizard
  const handleAddMaterial = (newMat: {
    title: string;
    subject: string;
    code: string;
    section: string;
    fileSize: string;
    fileType: "PDF" | "PPT" | "Video" | "DOC" | "ZIP";
    unit: string;
    topic: string;
    visibility: "Visible" | "Faculty Only" | "Scheduled";
    description: string;
  }) => {
    const freshMaterial: StudyMaterialItem = {
      id: `mat-${deptCode}-${Date.now()}`,
      title: newMat.title,
      description: newMat.description,
      subject: newMat.subject,
      code: newMat.code,
      section: newMat.section,
      semester: dashboardData.semester,
      academicYear: dashboardData.academicYear,
      uploadDate: "Today",
      lastUpdated: "Today",
      downloadCount: 0,
      visibilityStatus: newMat.visibility,
      fileType: newMat.fileType,
      fileSize: newMat.fileSize,
      unit: newMat.unit,
      topic: newMat.topic,
      keywords: [newMat.topic],
      category: newMat.fileType === "PDF" ? "Lecture Notes" : "PPT",
      versions: [
        { versionNum: "v1.0", updatedBy: "System sync", updatedDate: "Today", changeSummary: "Initial publication release" },
      ],
      timeline: [
        { event: "Material Uploaded successfully", date: "Today", status: "Completed" },
        { event: "Material Visibility Configured", date: "Today", status: "Completed" },
      ],
    };

    setMaterialsList((prev) => [freshMaterial, ...prev]);
  };

  // Filter lists locally
  const filteredMaterials = materialsList.filter((mat) => {
    const matchesSearch =
      mat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mat.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mat.keywords.some((k) => k.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesSubject = selectedSubject === "ALL" || mat.subject === selectedSubject;
    const matchesSection = selectedSection === "ALL" || mat.section === selectedSection;
    const matchesType = selectedType === "ALL" || mat.fileType === selectedType;

    return matchesSearch && matchesSubject && matchesSection && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* 1. Page Header */}
      <MaterialHeader
        academicYear={dashboardData.academicYear}
        semester={dashboardData.semester}
        onRefresh={handleRefresh}
        onUploadTrigger={() => setUploadModalOpen(true)}
      />

      {/* 2. Statistics Counter cards */}
      <StatisticsCards materials={materialsList} />

      {/* 3. Dashboard KPI metrics */}
      <MaterialDashboard materials={materialsList} />

      {/* 4. Toolbar Filters */}
      <SearchFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedSubject={selectedSubject}
        onSubjectChange={setSelectedSubject}
        selectedSection={selectedSection}
        onSectionChange={setSelectedSection}
        selectedType={selectedType}
        onTypeChange={setSelectedType}
        uniqueSubjects={uniqueSubjects}
        uniqueSections={uniqueSections}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      {/* 5. Material Library list / grid */}
      {loading ? (
        <SkeletonLoader />
      ) : (
        <MaterialLibrary
          materials={filteredMaterials}
          viewMode={viewMode}
          onSelectMaterial={handleSelectMaterial}
        />
      )}

      {/* 6. Stepper Wizard creation modal */}
      <UploadMaterialModal
        open={uploadModalOpen}
        onOpenChange={setUploadModalOpen}
        uniqueSubjects={uniqueSubjects}
        uniqueSections={uniqueSections}
        onUploadMaterial={handleAddMaterial}
      />

      {/* 7. Details Sheet Drawer Overlay */}
      <MaterialDetailDrawer
        material={selectedMaterial}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
      />

      {/* 8. Bottom Quick Actions cockpit shortcuts */}
      <div className="pt-4 border-t">
        <QuickActions onUploadClick={() => setUploadModalOpen(true)} />
      </div>
    </div>
  );
}
