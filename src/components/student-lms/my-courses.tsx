import React, { useState } from "react";
import { CourseItem } from "./types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { BookOpen, User, Download, ExternalLink, Calendar, CheckCircle2, FileText } from "lucide-react";
import { toast } from "sonner";

interface MyCoursesProps {
  courses: CourseItem[];
  searchQuery: string;
}

export function MyCourses({ courses, searchQuery }: MyCoursesProps) {
  const [selectedCourse, setSelectedCourse] = useState<CourseItem | null>(null);

  const filteredCourses = courses.filter(
    (c) =>
      c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.faculty.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDownloadSyllabus = (courseCode: string) => {
    toast.success(`Official Syllabus for ${courseCode} downloaded!`);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
          Enrolled Courses ({filteredCourses.length})
        </h2>
        <span className="text-xs text-slate-500 font-mono">B.Tech Computer Science & Engineering</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCourses.map((course) => (
          <div
            key={course.id}
            className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-md hover:border-purple-500/30 transition-all flex flex-col justify-between space-y-4 group"
          >
            {/* CARD TOP HEADER */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="font-mono font-bold text-purple-600 border-purple-200 text-[11px]">
                  {course.code}
                </Badge>
                <Badge
                  className={`text-[9px] px-2 py-0.5 font-mono ${
                    course.status === "Active"
                      ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                      : "bg-blue-500/10 text-blue-600 border-blue-500/20"
                  }`}
                >
                  {course.status}
                </Badge>
              </div>

              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white group-hover:text-purple-600 transition-colors leading-snug">
                {course.name}
              </h3>

              <div className="flex items-center gap-2 pt-1 text-xs text-slate-500">
                <img
                  src={course.facultyAvatar}
                  alt={course.faculty}
                  className="w-6 h-6 rounded-full object-cover border border-slate-200"
                />
                <span className="font-medium text-slate-700 dark:text-slate-300">{course.faculty}</span>
              </div>
            </div>

            {/* PROGRESS & METRICS */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-500 font-semibold">Course Completion</span>
                <span className="font-mono font-bold text-purple-600">{course.completionPct}%</span>
              </div>
              <Progress value={course.completionPct} className="h-2 bg-slate-100 dark:bg-slate-800" />

              <div className="flex flex-wrap items-center justify-between gap-1 text-[11px] text-slate-400 font-mono pt-1">
                <span>Credits: {course.credits}</span>
                <span>Sem {course.semester}</span>
                <span>Modules: {course.completedModules}/{course.totalModules}</span>
              </div>

              <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-purple-600 shrink-0" />
                <span className="truncate">{course.nextClass}</span>
              </div>
            </div>

            {/* BUTTONS */}
            <div className="grid grid-cols-3 gap-1.5 pt-2 border-t border-slate-100 dark:border-slate-800 w-full min-w-0 overflow-hidden">
              <Button
                onClick={() => setSelectedCourse(course)}
                size="sm"
                variant="outline"
                className="h-8 text-[11px] px-1 font-semibold rounded-xl border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 w-full min-w-0 overflow-hidden"
              >
                <span className="truncate">Details</span>
              </Button>

              <Button
                onClick={() => handleDownloadSyllabus(course.code)}
                size="sm"
                variant="outline"
                className="h-8 text-[11px] px-1 font-semibold rounded-xl border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 gap-1 hover:bg-slate-100 dark:hover:bg-slate-800 w-full min-w-0 overflow-hidden"
              >
                <Download className="h-3 w-3 shrink-0" />
                <span className="truncate">Syllabus</span>
              </Button>

              <Button
                onClick={() => toast.info(`Opening ${course.code} learning portal...`)}
                size="sm"
                className="h-8 text-[11px] px-1 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold gap-1 w-full min-w-0 overflow-hidden"
              >
                <span className="truncate">Open</span> <ExternalLink className="h-3 w-3 shrink-0" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* COURSE DETAILS MODAL */}
      {selectedCourse && (
        <Dialog open={!!selectedCourse} onOpenChange={() => setSelectedCourse(null)}>
          <DialogContent className="max-w-lg rounded-2xl p-6 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
            <DialogHeader className="border-b pb-3 border-slate-100 dark:border-slate-800 text-left">
              <Badge variant="outline" className="w-fit mb-1 font-mono font-bold text-purple-600 border-purple-200">
                {selectedCourse.code} • Sem {selectedCourse.semester}
              </Badge>
              <DialogTitle className="text-base font-bold">
                {selectedCourse.name}
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500">
                Faculty: {selectedCourse.faculty} ({selectedCourse.credits} Academic Credits)
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 my-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              <p>{selectedCourse.description}</p>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 space-y-1 font-mono text-[11px]">
                <p>⚡ Status: {selectedCourse.status}</p>
                <p>📚 Modules Completed: {selectedCourse.completedModules} / {selectedCourse.totalModules}</p>
                <p>🗓️ Schedule: {selectedCourse.nextClass}</p>
              </div>
            </div>

            <DialogFooter className="gap-2">
              <Button
                onClick={() => handleDownloadSyllabus(selectedCourse.code)}
                variant="outline"
                className="rounded-xl text-xs gap-1"
              >
                <FileText className="h-3.5 w-3.5" /> Download Full Syllabus PDF
              </Button>
              <Button
                onClick={() => {
                  toast.success(`Entered ${selectedCourse.code} online workspace!`);
                  setSelectedCourse(null);
                }}
                className="rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs gap-1"
              >
                Go to Workspace <ExternalLink className="h-3.5 w-3.5" />
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
