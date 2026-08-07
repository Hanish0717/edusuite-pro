import React from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AvailableCourseItem } from "../types";
import { BookOpen, User, Clock, MapPin, CheckCircle2, AlertCircle, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

interface CourseDetailsDrawerProps {
  open?: boolean;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  onClose?: () => void;
  course: AvailableCourseItem | null;
  onRegister?: (course: AvailableCourseItem) => void;
  onRegisterCourse?: (courseId: string) => void;
  onDrop?: (course: AvailableCourseItem) => void;
}

export function CourseDetailsDrawer({ open, isOpen, onOpenChange, onClose, course, onRegister, onRegisterCourse, onDrop }: CourseDetailsDrawerProps) {
  const actualOpen = open ?? isOpen ?? false;
  const actualOnOpenChange = onOpenChange || ((o: boolean) => { if (!o && onClose) onClose(); });

  if (!course) return null;

  return (
    <Sheet open={actualOpen} onOpenChange={actualOnOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md p-6 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white space-y-6 overflow-y-auto">
        <SheetHeader className="text-left space-y-1 border-b pb-4 border-slate-100 dark:border-slate-800">
          <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/20 text-[10px] w-fit">
            {course.category}
          </Badge>
          <SheetTitle className="text-base font-bold flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-blue-600" /> {course.code}: {course.name}
          </SheetTitle>
          <SheetDescription className="text-xs text-slate-500">
            {course.credits} Credits &middot; {course.availableSeats} of {course.totalSeats} seats available
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-4 text-xs">
          
          {/* FACULTY & TIMINGS */}
          <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-slate-500 flex items-center gap-1.5"><User className="h-3.5 w-3.5 text-blue-600" /> Faculty:</span>
              <strong className="text-slate-900 dark:text-white">{course.faculty}</strong>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500 flex items-center gap-1.5"><Clock className="h-3.5 w-3.5 text-purple-600" /> Timings:</span>
              <strong className="text-slate-900 dark:text-white font-mono">{course.timings}</strong>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500 flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-emerald-600" /> Lecture Hall:</span>
              <strong className="text-slate-900 dark:text-white font-mono">{course.room}</strong>
            </div>
          </div>

          {/* PREREQUISITES */}
          <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-1.5">
            <span className="font-bold text-slate-900 dark:text-white block">Prerequisites Check</span>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">{course.prerequisite}</span>
              <Badge className="bg-emerald-500/10 text-emerald-600 text-[10px]">VERIFIED PASSED</Badge>
            </div>
          </div>

          {/* COURSE SYLLABUS HIGHLIGHTS */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-900 dark:text-white">Curriculum Modules Overview</h4>
            <ul className="space-y-1.5 text-slate-600 dark:text-slate-400 text-[11px] list-disc list-inside">
              <li>Module I: Foundations & Theoretical Framework</li>
              <li>Module II: Practical Implementation & Problem Solving</li>
              <li>Module III: Advanced Optimization & Industry Case Studies</li>
              <li>Module IV: Project Design & Term Assessment</li>
            </ul>
          </div>

        </div>

        <SheetFooter className="pt-4 border-t border-slate-100 dark:border-slate-800 flex gap-2">
          {course.isRegistered ? (
            <Button
              onClick={() => {
                onDrop(course);
                onOpenChange(false);
              }}
              variant="outline"
              className="w-full rounded-xl text-xs border-rose-300 text-rose-600 hover:bg-rose-50"
            >
              Drop Course
            </Button>
          ) : (
            <Button
              onClick={() => {
                onRegister(course);
                onOpenChange(false);
              }}
              disabled={course.status === "Full"}
              className="w-full rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs"
            >
              {course.status === "Full" ? "Seat Full (Join Waitlist)" : "Register Course"}
            </Button>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
