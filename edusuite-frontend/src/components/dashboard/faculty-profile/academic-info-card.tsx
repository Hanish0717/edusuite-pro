import { BookOpen, Calendar, Users, Clock, Compass } from "lucide-react";
import { Panel } from "@/components/dashboard/panel";
import { Badge } from "@/components/ui/badge";
import type { AcademicInfo } from "@/data/faculty-mock-data";

interface AcademicInfoCardProps {
  academicInfo: AcademicInfo;
}

export function AcademicInfoCard({ academicInfo }: AcademicInfoCardProps) {
  return (
    <Panel
      title="Academic Assignments"
      description="Teaching load, sections, and mentorship duties for the current term"
      className="h-full border border-border bg-card rounded-2xl p-5 shadow-card"
    >
      <div className="space-y-6 text-xs">
        {/* Core Stats */}
        <div className="grid grid-cols-3 gap-4 p-4 rounded-xl bg-muted/40 text-center">
          <div>
            <p className="text-[0.6rem] uppercase font-extrabold tracking-wider text-muted-foreground">Teaching Load</p>
            <p className="text-xl font-black mt-0.5 text-primary flex items-center justify-center gap-1">
              <Clock className="size-4 text-primary/60" /> {academicInfo.totalTeachingHours} <span className="text-xs font-normal">hrs/wk</span>
            </p>
          </div>
          <div>
            <p className="text-[0.6rem] uppercase font-extrabold tracking-wider text-muted-foreground">Term Scope</p>
            <p className="text-sm font-extrabold mt-1 text-foreground">{academicInfo.currentSemester}</p>
          </div>
          <div>
            <p className="text-[0.6rem] uppercase font-extrabold tracking-wider text-muted-foreground">Sections</p>
            <p className="text-sm font-extrabold mt-1 text-foreground">{academicInfo.sections.join(", ")}</p>
          </div>
        </div>

        {/* Dynamic Lists */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Subjects Grid */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <BookOpen className="size-4 text-primary" /> Active Syllabus Classes
            </h4>
            <div className="space-y-2">
              {academicInfo.assignedSubjects.map((sub, idx) => (
                <div key={idx} className="flex justify-between items-center p-3 rounded-xl border bg-muted/20">
                  <span className="font-semibold">{sub}</span>
                  <Badge variant="outline" className="text-[0.65rem] border-primary/20 bg-primary/5 text-primary">
                    Core Subject
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          {/* Mentorship & Scope */}
          <div className="space-y-6">
            {/* Mentorship */}
            <div className="space-y-3">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Users className="size-4 text-emerald-500" /> Mentee advisor scopes
              </h4>
              <div className="p-3 rounded-xl border bg-muted/20 space-y-1">
                {academicInfo.mentorSections.map((sec, idx) => (
                  <p key={idx} className="font-bold text-foreground">
                    {sec}
                  </p>
                ))}
                <p className="text-[0.65rem] text-muted-foreground mt-1">
                  Responsible for academic counseling, attendance tracking, and parent communication.
                </p>
              </div>
            </div>

            {/* Courses Handled */}
            <div className="space-y-3">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Compass className="size-4 text-indigo-500" /> Academic programs handled
              </h4>
              <div className="flex flex-wrap gap-2">
                {academicInfo.coursesHandled.map((course, idx) => (
                  <Badge key={idx} variant="secondary" className="rounded-lg bg-indigo-500/5 text-indigo-600 border border-indigo-500/10 py-1 px-2.5 font-semibold">
                    {course}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Panel>
  );
}
