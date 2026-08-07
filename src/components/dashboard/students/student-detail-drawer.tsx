import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, ClipboardList, BookOpen } from "lucide-react";

import { AttendanceSummary } from "./attendance-summary";
import { AcademicPerformance } from "./academic-performance";
import { AssignmentSummary } from "./assignment-summary";
import { CounsellingPanel } from "./counselling-panel";
import { StudentDocuments } from "./student-documents";
import { StudentTimeline } from "./student-timeline";
import { CommunicationPanel } from "./communication-panel";
import { QuickActions } from "./quick-actions";
import type { StudentDetails } from "@/data/faculty-mock-data";

interface StudentDetailDrawerProps {
  student: StudentDetails | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function StudentDetailDrawer({ student, open, onOpenChange }: StudentDetailDrawerProps) {
  if (!student) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-[650px] overflow-y-auto rounded-l-3xl p-6 text-xs">
        <SheetHeader className="border-b border-border pb-4 space-y-2">
          <div className="flex items-center gap-2 text-muted-foreground font-mono font-bold text-[0.65rem] uppercase">
            <span>Adm: {student.rollNumber}</span>
            <span>&middot;</span>
            <span>Reg: {student.registrationNumber}</span>
          </div>
          <SheetTitle className="font-display text-lg font-extrabold text-foreground leading-snug">
            {student.name}
          </SheetTitle>
          <SheetDescription className="font-medium text-muted-foreground text-[0.7rem] leading-normal">
            {student.program} &middot; {student.department} &middot; Sem {student.semester} &middot; Sec {student.section}
          </SheetDescription>
        </SheetHeader>

        {/* Modular details Tabs */}
        <Tabs defaultValue="academics" className="w-full mt-6 space-y-4">
          <TabsList className="grid w-full grid-cols-3 sm:grid-cols-6 h-auto gap-1 bg-muted p-1 rounded-2xl">
            <TabsTrigger value="academics" className="rounded-xl text-[0.65rem] py-2 cursor-pointer">Academics</TabsTrigger>
            <TabsTrigger value="attendance" className="rounded-xl text-[0.65rem] py-2 cursor-pointer">Attendance</TabsTrigger>
            <TabsTrigger value="performance" className="rounded-xl text-[0.65rem] py-2 cursor-pointer">Grades</TabsTrigger>
            <TabsTrigger value="mentoring" className="rounded-xl text-[0.65rem] py-2 cursor-pointer">Mentoring</TabsTrigger>
            <TabsTrigger value="docs" className="rounded-xl text-[0.65rem] py-2 cursor-pointer">Files</TabsTrigger>
            <TabsTrigger value="actions" className="rounded-xl text-[0.65rem] py-2 cursor-pointer">Actions</TabsTrigger>
          </TabsList>

          {/* TAB CONTENTS */}
          <div className="focus-visible:outline-none">
            {/* TAB 1: Academics & Personal details */}
            <TabsContent value="academics" className="space-y-4 focus-visible:outline-none">
              <div className="grid gap-4 sm:grid-cols-2">
                {/* Personal Card */}
                <div className="p-4 border rounded-2xl bg-muted/20 space-y-3">
                  <h5 className="font-extrabold text-[0.75rem] text-foreground flex items-center gap-1.5"><User className="size-4 text-primary" /> Personal Information</h5>
                  <div className="space-y-2 pt-1 border-t border-border/40 text-[0.68rem] text-muted-foreground font-medium">
                    <p className="flex justify-between"><span>Gender:</span> <span className="text-foreground">{student.gender}</span></p>
                    <p className="flex justify-between"><span>DOB:</span> <span className="text-foreground">{student.dob}</span></p>
                    <p className="flex justify-between"><span>Email:</span> <span className="text-foreground">{student.email}</span></p>
                    <p className="flex justify-between"><span>Mobile:</span> <span className="text-foreground">{student.mobile}</span></p>
                    <p className="flex justify-between"><span>Parent Name:</span> <span className="text-foreground">{student.parentName}</span></p>
                    <p className="flex justify-between"><span>Parent Mobile:</span> <span className="text-foreground">{student.parentMobile}</span></p>
                  </div>
                </div>

                {/* Academic Card */}
                <div className="p-4 border rounded-2xl bg-muted/20 space-y-3">
                  <h5 className="font-extrabold text-[0.75rem] text-foreground flex items-center gap-1.5"><BookOpen className="size-4 text-primary" /> Academic Information</h5>
                  <div className="space-y-2 pt-1 border-t border-border/40 text-[0.68rem] text-muted-foreground font-medium">
                    <p className="flex justify-between"><span>Batch:</span> <span className="text-foreground">{student.batch}</span></p>
                    <p className="flex justify-between"><span>Program:</span> <span className="text-foreground">{student.program}</span></p>
                    <p className="flex justify-between"><span>Section Advisor:</span> <span className="text-foreground">{student.mentorName}</span></p>
                    <p className="flex justify-between"><span>Status:</span> <span className="text-foreground font-bold">{student.status}</span></p>
                  </div>
                </div>
              </div>

              {/* Communication actions */}
              <CommunicationPanel studentEmail={student.email} parentMobile={student.parentMobile} />
              
              {/* Activity Timeline */}
              <StudentTimeline timeline={student.timeline} />
            </TabsContent>

            {/* TAB 2: AttendanceSummary */}
            <TabsContent value="attendance" className="space-y-4 focus-visible:outline-none">
              <AttendanceSummary attendance={student.attendance} />
            </TabsContent>

            {/* TAB 3: AcademicPerformance & AssignmentSummary */}
            <TabsContent value="performance" className="space-y-4 focus-visible:outline-none">
              <AcademicPerformance performance={student.performance} />
              <AssignmentSummary assignments={student.assignmentsList} />
            </TabsContent>

            {/* TAB 4: Counselling / Mentoring */}
            <TabsContent value="mentoring" className="space-y-4 focus-visible:outline-none">
              <CounsellingPanel student={student} />
            </TabsContent>

            {/* TAB 5: Documents list */}
            <TabsContent value="docs" className="space-y-4 focus-visible:outline-none">
              <StudentDocuments documents={student.documents} />
            </TabsContent>

            {/* TAB 6: Quick Actions redirects */}
            <TabsContent value="actions" className="space-y-4 focus-visible:outline-none">
              <QuickActions studentId={student.id} />
            </TabsContent>
          </div>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}
