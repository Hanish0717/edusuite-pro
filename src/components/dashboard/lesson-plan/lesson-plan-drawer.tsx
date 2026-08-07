import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, BookOpen, GitBranch } from "lucide-react";

import { UnitPlanner } from "./unit-planner";
import { WeeklyPlanner } from "./weekly-planner";
import { MonthlyPlanner } from "./monthly-planner";
import { AcademicProgress } from "./academic-progress";
import { TeachingTimeline } from "./teaching-timeline";
import { LearningOutcomeCards } from "./learning-outcome-cards";
import { TeachingMethodTags } from "./teaching-method-tags";
import { LessonResources } from "./lesson-resources";
import { QuickActions } from "./quick-actions";
import { SessionPlanner } from "./session-planner/session-planner";
import type { LessonPlanItem } from "@/data/faculty-mock-data";

interface LessonPlanDrawerProps {
  plan: LessonPlanItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultTab?: string;
}

export function LessonPlanDrawer({ plan, open, onOpenChange, defaultTab = "progress" }: LessonPlanDrawerProps) {
  if (!plan) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-[750px] overflow-y-auto rounded-l-3xl p-6 text-xs">
        <SheetHeader className="border-b border-border pb-4 space-y-2">
          <div className="flex items-center gap-2 text-muted-foreground font-mono font-bold text-[0.65rem] uppercase">
            <span>{plan.code}</span>
            <span>&middot;</span>
            <span>{plan.teachingMode} Mode</span>
            <span>&middot;</span>
            <span>Regulation {plan.regulation}</span>
          </div>
          <SheetTitle className="font-display text-lg font-extrabold text-foreground leading-snug">
            {plan.name} Lesson Plan
          </SheetTitle>
          <SheetDescription className="font-medium text-muted-foreground text-[0.7rem] leading-normal">
            Assigned Sections: {plan.assignedSections.join(", ")} &middot; Classroom: {plan.classroom} &middot; Credits: {plan.credits}
          </SheetDescription>
        </SheetHeader>

        {/* Modular details Tabs */}
        <Tabs defaultValue={defaultTab} className="w-full mt-6 space-y-4">
          <TabsList className="grid w-full grid-cols-4 sm:grid-cols-7 h-auto gap-1 bg-muted p-1 rounded-2xl overflow-x-auto">
            <TabsTrigger value="progress" className="rounded-xl text-[0.65rem] py-2 cursor-pointer">Progress</TabsTrigger>
            <TabsTrigger value="units" className="rounded-xl text-[0.65rem] py-2 cursor-pointer">Units</TabsTrigger>
            <TabsTrigger value="weekly" className="rounded-xl text-[0.65rem] py-2 cursor-pointer">Weekly</TabsTrigger>
            <TabsTrigger value="monthly" className="rounded-xl text-[0.65rem] py-2 cursor-pointer">Monthly</TabsTrigger>
            <TabsTrigger value="session-planner" className="rounded-xl text-[0.65rem] py-2 cursor-pointer font-bold text-primary">Session Planner</TabsTrigger>
            <TabsTrigger value="outcomes" className="rounded-xl text-[0.65rem] py-2 cursor-pointer">Outcomes</TabsTrigger>
            <TabsTrigger value="actions" className="rounded-xl text-[0.65rem] py-2 cursor-pointer">Actions</TabsTrigger>
          </TabsList>

          {/* TAB CONTENTS */}
          <div className="focus-visible:outline-none">
            <TabsContent value="progress" className="space-y-4 focus-visible:outline-none">
              {/* Progress charts */}
              <AcademicProgress plan={plan} />
              
              {/* Teaching methods */}
              <TeachingMethodTags methods={plan.teachingMethods} />
              
              {/* Milestones timeline */}
              <TeachingTimeline timeline={plan.timeline} />
            </TabsContent>

            <TabsContent value="units" className="space-y-4 focus-visible:outline-none">
              {/* Unit planning details */}
              <UnitPlanner units={plan.units} weeklyHours={plan.weeklyHours} />
            </TabsContent>

            <TabsContent value="weekly" className="space-y-4 focus-visible:outline-none">
              {/* Weekly Planner grid */}
              <WeeklyPlanner weeklyPlan={plan.weeklyPlan} />
            </TabsContent>

            <TabsContent value="monthly" className="space-y-4 focus-visible:outline-none">
              {/* Monthly calendar format */}
              <MonthlyPlanner monthlyPlan={plan.monthlyPlan} />
            </TabsContent>

            <TabsContent value="session-planner" className="space-y-4 focus-visible:outline-none">
              {/* Session Planner detailed view */}
              <SessionPlanner
                subjectName={plan.name}
                subjectCode={plan.code}
                department={(plan as any).department || "CSE"}
                semester={plan.semester}
                regulation={plan.regulation}
              />
            </TabsContent>

            <TabsContent value="outcomes" className="space-y-4 focus-visible:outline-none">
              {/* Learning Outcomes Bloom level */}
              <LearningOutcomeCards outcomes={plan.learningOutcomes} />
              
              {/* Resources list */}
              <LessonResources resources={plan.resources} />
            </TabsContent>

            <TabsContent value="actions" className="space-y-4 focus-visible:outline-none">
              {/* Quick Actions Cockpit */}
              <QuickActions planId={plan.id} />
            </TabsContent>
          </div>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}

