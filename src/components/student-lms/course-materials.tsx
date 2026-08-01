import React, { useState } from "react";
import { MaterialItem } from "./types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import {
  FileText,
  Download,
  Bookmark,
  Share2,
  Eye,
  Search,
  Filter,
  Video,
  FileCode,
  BookOpen,
} from "lucide-react";
import { toast } from "sonner";

interface CourseMaterialsProps {
  materials: MaterialItem[];
  searchQuery: string;
}

export function CourseMaterials({ materials, searchQuery }: CourseMaterialsProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedCourseFilter, setSelectedCourseFilter] = useState<string>("All");
  const [previewMaterial, setPreviewMaterial] = useState<MaterialItem | null>(null);
  const [bookmarkedIds, setBookmarkedIds] = useState<Record<string, boolean>>({});

  const categories = [
    "All",
    "Lecture Notes",
    "PPTs",
    "PDFs",
    "Lab Manuals",
    "Reference Books",
    "Recorded Videos",
    "Code Files",
    "Previous Papers",
  ];

  const courseCodes = ["All", "CS401", "CS402", "CS403", "CS404", "CS405", "CS406"];

  const filteredMaterials = materials.filter((m) => {
    const matchesSearch =
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.courseCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.faculty.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || m.category === selectedCategory;
    const matchesCourse = selectedCourseFilter === "All" || m.courseCode === selectedCourseFilter;
    return matchesSearch && matchesCategory && matchesCourse;
  });

  const toggleBookmark = (id: string) => {
    setBookmarkedIds((prev) => {
      const nextState = !prev[id];
      toast.success(nextState ? "Added to bookmarked learning resources!" : "Removed from bookmarks.");
      return { ...prev, [id]: nextState };
    });
  };

  const handleDownload = (mat: MaterialItem) => {
    toast.success(`Downloading ${mat.title} (${mat.size})...`);
  };

  const handleShare = (mat: MaterialItem) => {
    navigator.clipboard.writeText(`https://edusuite.pro/lms/materials/${mat.id}`);
    toast.success(`Resource share link copied to clipboard!`);
  };

  return (
    <div className="space-y-4">
      {/* TOOLBAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-purple-600" />
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Digital Course Materials Repository
            </h3>
            <p className="text-[11px] text-slate-500 font-medium">
              Access 200+ verified notes, lab manuals, past question papers & lecture slides.
            </p>
          </div>
        </div>

        {/* COURSE FILTER DROPDOWN */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-medium font-mono">Course:</span>
          <select
            value={selectedCourseFilter}
            onChange={(e) => setSelectedCourseFilter(e.target.value)}
            className="h-8 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 font-bold text-slate-700 dark:text-slate-200"
          >
            {courseCodes.map((c) => (
              <option key={c} value={c}>{c === "All" ? "All Courses" : c}</option>
            ))}
          </select>
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
                ? "bg-purple-600 text-white shadow-xs"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* MATERIALS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {filteredMaterials.slice(0, 30).map((mat) => {
          const isBookmarked = bookmarkedIds[mat.id] ?? mat.isBookmarked;

          return (
            <div
              key={mat.id}
              className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs hover:shadow-sm hover:border-purple-500/30 transition-all space-y-3 flex flex-col justify-between group overflow-hidden"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-[10px] font-mono font-bold text-purple-600 border-purple-200">
                    {mat.courseCode}
                  </Badge>

                  <div className="flex items-center gap-1.5">
                    <Badge className="text-[9px] px-2 py-0.5 font-mono bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      {mat.category}
                    </Badge>
                    <button
                      onClick={() => toggleBookmark(mat.id)}
                      className={`p-1 rounded-lg border transition-colors ${
                        isBookmarked
                          ? "bg-amber-50 text-amber-600 border-amber-300"
                          : "border-slate-200 dark:border-slate-700 text-slate-400 hover:text-amber-500"
                      }`}
                      title={isBookmarked ? "Remove Bookmark" : "Bookmark Material"}
                    >
                      <Bookmark className={`h-3.5 w-3.5 ${isBookmarked ? "fill-amber-500 text-amber-500" : ""}`} />
                    </button>
                  </div>
                </div>

                <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-purple-600 transition-colors leading-snug line-clamp-2">
                  {mat.title}
                </h4>

                <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono pt-1">
                  <span>{mat.faculty}</span>
                  <span>{mat.uploadDate}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-[10px] text-slate-500 font-mono">
                <span>{mat.fileType} • {mat.size}</span>
                <span>{mat.downloads} Downloads</span>
              </div>

              {/* ACTION BUTTONS */}
              <div className="grid grid-cols-3 gap-1.5 pt-2 border-t border-slate-100 dark:border-slate-800 w-full min-w-0 overflow-hidden">
                <Button
                  onClick={() => setPreviewMaterial(mat)}
                  size="sm"
                  variant="outline"
                  className="h-8 text-[11px] px-1 font-semibold rounded-xl border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 w-full min-w-0 overflow-hidden"
                  title="Preview document"
                >
                  <Eye className="h-3.5 w-3.5 text-purple-600 shrink-0" />
                  <span className="truncate">Preview</span>
                </Button>

                <Button
                  onClick={() => handleDownload(mat)}
                  size="sm"
                  variant="outline"
                  className="h-8 text-[11px] px-1 font-semibold rounded-xl border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 gap-1 hover:bg-slate-100 dark:hover:bg-slate-800 w-full min-w-0 overflow-hidden"
                  title="Download file"
                >
                  <Download className="h-3.5 w-3.5 text-blue-600 shrink-0" />
                  <span className="truncate">Save</span>
                </Button>

                <Button
                  onClick={() => handleShare(mat)}
                  size="sm"
                  variant="outline"
                  className="h-8 text-[11px] px-1 font-semibold rounded-xl border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 gap-1 hover:bg-slate-100 dark:hover:bg-slate-800 w-full min-w-0 overflow-hidden"
                  title="Share material link"
                >
                  <Share2 className="h-3.5 w-3.5 text-slate-600 shrink-0" />
                  <span className="truncate">Share</span>
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* PREVIEW MODAL */}
      {previewMaterial && (
        <Dialog open={!!previewMaterial} onOpenChange={() => setPreviewMaterial(null)}>
          <DialogContent className="max-w-xl rounded-2xl p-6 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
            <DialogHeader className="border-b pb-3 border-slate-100 dark:border-slate-800 text-left">
              <Badge variant="outline" className="w-fit mb-1 font-mono font-bold text-purple-600 border-purple-200">
                {previewMaterial.courseCode} • {previewMaterial.category}
              </Badge>
              <DialogTitle className="text-base font-bold">
                {previewMaterial.title}
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500">
                Uploaded by {previewMaterial.faculty} on {previewMaterial.uploadDate} ({previewMaterial.size})
              </DialogDescription>
            </DialogHeader>

            <div className="my-4 p-6 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-center space-y-3">
              <FileText className="h-12 w-12 text-purple-600 mx-auto" />
              <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                Document Preview Window ({previewMaterial.fileType})
              </p>
              <p className="text-[11px] text-slate-500">
                Simulated high-resolution canvas viewer for EduSuite LMS learning materials.
              </p>
            </div>

            <DialogFooter className="gap-2">
              <Button
                onClick={() => handleDownload(previewMaterial)}
                className="rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs gap-1.5 w-full"
              >
                <Download className="h-3.5 w-3.5" /> Download Full Document
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
