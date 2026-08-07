import React, { useState } from "react";
import { MaterialItem } from "./types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { useRole } from "@/context/role-context";
import {
  getCurrentStudentUser,
  fetchStudentCourseMaterials,
  type MockStudentUser,
} from "@/services/course-materials-service";
import {
  FileText,
  Download,
  Bookmark,
  Share2,
  Eye,
  BookOpen,
  CheckCircle2,
  Lock,
  ShieldCheck,
  User,
  Calendar,
  Building,
  GraduationCap,
} from "lucide-react";
import { toast } from "sonner";

interface CourseMaterialsProps {
  materials: MaterialItem[];
  searchQuery: string;
}

export function CourseMaterials({ materials, searchQuery }: CourseMaterialsProps) {
  const { profile } = useRole();
  const studentDept = profile.department || "CSE";

  // Login-aware Student Context (Department, Semester, Section, Enrolled Subjects)
  const studentUser: MockStudentUser = getCurrentStudentUser(studentDept, "5", "A");

  // Retrieve published materials matching student's assigned academic profile
  const rawPublishedMaterials = fetchStudentCourseMaterials(studentUser);

  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedCourseFilter, setSelectedCourseFilter] = useState<string>("All");
  const [previewMaterial, setPreviewMaterial] = useState<any | null>(null);
  const [bookmarkedIds, setBookmarkedIds] = useState<Record<string, boolean>>({});

  const categories = [
    "All",
    "Lecture Notes",
    "PPTs",
    "PDFs",
    "Lab Manuals",
    "Reference Books",
    "Recorded Videos",
    "Previous Papers",
  ];

  const courseCodes = ["All", ...studentUser.enrolledSubjects];

  // Map raw StudyMaterialItem to Student MaterialItem format
  const mappedStudentMaterials = rawPublishedMaterials.map((m) => ({
    id: m.id,
    courseCode: m.code,
    courseName: m.subject,
    title: m.title,
    description: m.description,
    category: m.category || "Lecture Notes",
    fileType: m.fileType,
    type: m.fileType.toLowerCase(),
    size: m.fileSize,
    uploadDate: m.uploadDate,
    faculty: m.uploadedBy || `Prof. ${studentUser.department} Faculty`,
    downloads: m.downloadCount,
    isBookmarked: false,
    unit: m.unit || "Unit I",
    visibilityStatus: m.visibilityStatus,
  }));

  // Combine with props materials ensuring strictly NO draft/hidden or wrong department items
  const combinedList = [...mappedStudentMaterials];
  materials.forEach((m) => {
    const isVisible = (m as any).visibilityStatus === undefined || (m as any).visibilityStatus === "Visible" || (m as any).status === "Published";
    if (isVisible && !combinedList.some((existing) => existing.id === m.id)) {
      combinedList.push(m as any);
    }
  });

  // Filter ONLY published materials visible to students matching searchQuery & category
  const filteredMaterials = combinedList.filter((m) => {
    const matchesSearch =
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.courseCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.faculty.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || m.category === selectedCategory || (selectedCategory === "PPTs" && m.fileType === "PPT") || (selectedCategory === "PDFs" && m.fileType === "PDF");
    const matchesCourse = selectedCourseFilter === "All" || m.courseCode === selectedCourseFilter || m.courseName === selectedCourseFilter;
    return matchesSearch && matchesCategory && matchesCourse;
  });


  // Group materials by Subject (courseName / courseCode) -> Unit
  const subjectsMap: Record<string, Record<string, MaterialItem[]>> = {};

  filteredMaterials.forEach((mat) => {
    const subjKey = mat.courseName ? `${mat.courseCode} - ${mat.courseName}` : mat.courseCode;
    const unitKey = (mat as any).unit || "Unit 1: Core Fundamentals";

    if (!subjectsMap[subjKey]) {
      subjectsMap[subjKey] = {};
    }
    if (!subjectsMap[subjKey][unitKey]) {
      subjectsMap[subjKey][unitKey] = [];
    }
    subjectsMap[subjKey][unitKey].push(mat);
  });

  const subjectKeys = Object.keys(subjectsMap);

  const toggleBookmark = (id: string) => {
    setBookmarkedIds((prev) => {
      const nextState = !prev[id];
      toast.success(nextState ? "Bookmarked learning resource!" : "Removed from bookmarks.");
      return { ...prev, [id]: nextState };
    });
  };

  const handleDownload = (mat: MaterialItem) => {
    const content = `EDUSUITE PRO LMS DIGITAL MATERIAL
=====================================================
Title: ${mat.title}
Course Code: ${mat.courseCode} (${mat.courseName})
Category: ${mat.category}
Faculty Name: ${mat.faculty}
Upload Date: ${mat.uploadDate}

RESOURCE DESCRIPTION:
${mat.description || "Official course notes and study resources published by faculty."}

=====================================================
Verified Official Academic Resource — EduSuite ERP`;

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${mat.title.replace(/[\s,]+/g, "_")}.${mat.type || "pdf"}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success(`Downloaded ${mat.title} (${mat.size})`);
  };

  return (
    <div className="space-y-4 text-xs">
      {/* TOOLBAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Student Study Materials Hub
            </h3>
            <p className="text-[11px] text-slate-500 font-medium">
              Verified lecture notes, lab manuals, slides & question banks for assigned semester subjects
            </p>
          </div>
        </div>

        {/* COURSE FILTER DROPDOWN */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-medium font-mono">Course Filter:</span>
          <select
            value={selectedCourseFilter}
            onChange={(e) => setSelectedCourseFilter(e.target.value)}
            className="h-8 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 font-bold text-slate-700 dark:text-slate-200"
          >
            {courseCodes.map((c) => (
              <option key={c} value={c}>{c === "All" ? "All Enrolled Courses" : c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* STUDENT CONTEXT METADATA BANNER */}
      <div className="p-3 rounded-2xl border border-primary/20 bg-primary/5 flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
        <div className="flex items-center gap-2">
          <User className="size-4 text-primary" />
          <span className="font-sans font-bold text-foreground">
            Student: {studentUser.name} ({studentUser.rollNumber})
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-3 text-muted-foreground text-[0.68rem]">
          <span className="flex items-center gap-1"><Building className="size-3 text-primary" /> Dept: <strong className="text-foreground font-sans">{studentUser.department} ({studentUser.program})</strong></span>
          <span className="flex items-center gap-1"><GraduationCap className="size-3 text-primary" /> Sem: <strong className="text-foreground font-sans">{studentUser.semester}</strong> &middot; Sec: <strong className="text-foreground font-sans">{studentUser.section}</strong></span>
          <Badge variant="outline" className="font-mono text-[0.62rem] text-emerald-600 border-emerald-500/30 bg-emerald-500/10">
            {studentUser.enrolledSubjects.length} Courses Enrolled
          </Badge>
        </div>
      </div>


      {/* CATEGORY CHIPS */}
      <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all ${
              selectedCategory === cat
                ? "bg-primary text-primary-foreground shadow-xs"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* SUBJECT -> UNIT ACCORDION VIEW */}
      {subjectKeys.length === 0 ? (
        <div className="p-8 text-center border border-dashed rounded-2xl text-muted-foreground text-xs">
          No published study materials available matching your filters.
        </div>
      ) : (
        <Accordion type="multiple" defaultValue={[subjectKeys[0] || ""]} className="w-full space-y-3">
          {subjectKeys.map((subjName) => {
            const unitsMap = subjectsMap[subjName] || {};
            const unitNames = Object.keys(unitsMap);
            const totalCount = unitNames.reduce((acc, u) => acc + (unitsMap[u]?.length || 0), 0);

            return (
              <AccordionItem
                key={subjName}
                value={subjName}
                className="border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900 overflow-hidden px-4"
              >
                <AccordionTrigger className="hover:no-underline py-3.5 text-xs font-bold text-slate-900 dark:text-white flex items-center justify-between cursor-pointer">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <BookOpen className="size-4 text-primary shrink-0" />
                    <span className="font-extrabold text-sm tracking-tight text-slate-900 dark:text-white truncate">
                      {subjName}
                    </span>
                    <Badge variant="secondary" className="font-mono text-[0.65rem] px-2 py-0.5 shrink-0">
                      {totalCount} Materials
                    </Badge>
                  </div>
                </AccordionTrigger>

                <AccordionContent className="pt-2 pb-4 space-y-4 border-t border-slate-100 dark:border-slate-800">
                  {unitNames.map((unitName) => {
                    const unitItems = unitsMap[unitName] || [];

                    return (
                      <div key={unitName} className="space-y-2.5 pl-1">
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase font-mono tracking-wider pt-1">
                          <span className="p-1 rounded bg-primary/10 text-primary text-[0.62rem]">
                            {unitName}
                          </span>
                          <span>({unitItems.length} Available Resources)</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                          {unitItems.map((mat) => (
                            <div
                              key={mat.id}
                              className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs hover:shadow-sm hover:border-primary/40 transition-all space-y-3 flex flex-col justify-between group overflow-hidden"
                            >
                              <div className="space-y-1.5">
                                <div className="flex items-center justify-between">
                                  <Badge variant="outline" className="text-[10px] font-mono font-bold text-primary border-primary/30">
                                    {mat.courseCode}
                                  </Badge>

                                  <Badge className="text-[9px] px-2 py-0.5 font-mono bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                                    {mat.category || mat.fileType}
                                  </Badge>
                                </div>

                                <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors leading-snug break-words">
                                  {mat.title}
                                </h4>

                                <p className="text-[0.68rem] text-slate-500 line-clamp-2">
                                  {mat.description || "Official study notes provided by department faculty."}
                                </p>

                                <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono pt-1">
                                  <span className="flex items-center gap-1 font-sans"><User className="size-3 text-primary" /> {mat.faculty}</span>
                                  <span className="flex items-center gap-1"><Calendar className="size-3" /> {mat.uploadDate}</span>
                                </div>
                              </div>

                              <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-[10px] text-slate-500 font-mono">
                                <span>{mat.fileType} • {mat.size}</span>
                                <span className="text-emerald-600 font-bold">{mat.downloads || 45} Downloads</span>
                              </div>

                              {/* ACTION BUTTONS (NO UPLOAD OPTION FOR STUDENTS) */}
                              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                                <Button
                                  onClick={() => setPreviewMaterial(mat)}
                                  size="sm"
                                  variant="outline"
                                  className="h-8 text-[11px] font-semibold rounded-xl border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 cursor-pointer"
                                >
                                  <Eye className="h-3.5 w-3.5 text-primary mr-1" />
                                  <span>Preview</span>
                                </Button>

                                <Button
                                  onClick={() => handleDownload(mat)}
                                  size="sm"
                                  className="h-8 text-[11px] font-semibold rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer"
                                >
                                  <Download className="h-3.5 w-3.5 mr-1" />
                                  <span>Download</span>
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      )}

      {/* PREVIEW MODAL */}
      {previewMaterial && (
        <Dialog open={!!previewMaterial} onOpenChange={() => setPreviewMaterial(null)}>
          <DialogContent className="max-w-xl rounded-2xl p-6 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-xs">
            <DialogHeader className="border-b pb-3 border-slate-100 dark:border-slate-800 text-left">
              <Badge variant="outline" className="w-fit mb-1 font-mono font-bold text-primary border-primary/30">
                {previewMaterial.courseCode} &middot; {previewMaterial.category}
              </Badge>
              <DialogTitle className="text-base font-bold text-foreground">
                {previewMaterial.title}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Uploaded by {previewMaterial.faculty} on {previewMaterial.uploadDate} ({previewMaterial.size})
              </DialogDescription>
            </DialogHeader>

            <div className="my-4 p-6 rounded-2xl bg-muted/40 border border-border text-center space-y-3">
              <FileText className="h-12 w-12 text-primary mx-auto" />
              <p className="text-xs font-semibold text-foreground">
                Student Document Preview Viewer ({previewMaterial.fileType})
              </p>
              <p className="text-[11px] text-muted-foreground">
                {previewMaterial.description || "Official lecture notes & study resources published for course syllabus."}
              </p>
            </div>

            <DialogFooter className="gap-2">
              <Button
                onClick={() => handleDownload(previewMaterial)}
                className="rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 text-xs gap-1.5 w-full cursor-pointer font-bold"
              >
                <Download className="h-3.5 w-3.5" /> Download Study File ({previewMaterial.size})
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

