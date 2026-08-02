import React, { useState } from "react";
import { LmsTabType } from "./types";
import {
  MOCK_LMS_KPIS,
  MOCK_COURSES,
  MOCK_MATERIALS,
  MOCK_ASSIGNMENTS,
  MOCK_QUIZZES,
  MOCK_LIVE_CLASSES,
  MOCK_FORUM_POSTS,
  MOCK_CERTIFICATES,
} from "./mock-data";

import { LmsDashboardHeader } from "./lms-dashboard";
import { MyCourses } from "./my-courses";
import { CourseMaterials } from "./course-materials";
import { Assignments } from "./assignments";
import { Quizzes } from "./quizzes";
import { OnlineClasses } from "./online-classes";
import { ProgressAnalytics } from "./progress";
import { Certificates } from "./certificates";
import { AiLearningWidget } from "./ai-learning-widget";

import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import { RefreshCw, BookOpen } from "lucide-react";
import { toast } from "sonner";

export function StudentLmsModule() {
  const [activeTab, setActiveTab] = useState<LmsTabType>("my-courses");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isEmptyState, setIsEmptyState] = useState(false);

  const handleQuickAction = (actionId: string) => {
    switch (actionId) {
      case "upload-assignment":
        setActiveTab("assignments");
        toast.info("Navigated to Assignments tab to upload solution.");
        break;
      case "join-class":
        setActiveTab("online-classes");
        toast.info("Navigated to Online Classes tab.");
        break;
      case "download-notes":
        setActiveTab("course-materials");
        toast.info("Navigated to Course Materials repository.");
        break;
      case "open-library":
        toast.info("Opening EduSuite Digital Library...");
        break;
      case "ask-ai":
        toast.info("AI Tutor ready in sidebar!");
        break;
      case "take-quiz":
        setActiveTab("quizzes");
        toast.info("Navigated to Quizzes tab.");
        break;
      default:
        break;
    }
  };

  const toggleLoadingDemo = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 700);
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-12">


      {isLoading ? (
        <div className="space-y-6">
          <Skeleton className="h-36 w-full rounded-2xl" />
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-20 w-full rounded-2xl" />
            ))}
          </div>
          <Skeleton className="h-96 w-full rounded-2xl" />
        </div>
      ) : isEmptyState ? (
        <div className="p-12 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-center">
          <EmptyState
            title="No LMS Data Available"
            description="Your learning workspace currently has no registered courses or pending materials."
            actionLabel="Reset LMS Workspace"
            onAction={() => setIsEmptyState(false)}
          />
        </div>
      ) : (
        <>
          {/* HEADER & TOP KPIS */}
          <LmsDashboardHeader
            kpis={MOCK_LMS_KPIS}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onQuickAction={handleQuickAction}
          />

          {/* MAIN LMS CONTENT WITH SIDEBAR ASSISTANT */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            
            {/* MAIN TAB CONTENT (3 COLS) */}
            <div className="lg:col-span-3 space-y-6">
              {activeTab === "my-courses" && (
                <MyCourses courses={MOCK_COURSES} searchQuery={searchQuery} onSelectTab={setActiveTab} />
              )}

              {activeTab === "course-materials" && (
                <CourseMaterials materials={MOCK_MATERIALS} searchQuery={searchQuery} />
              )}

              {activeTab === "assignments" && (
                <Assignments assignments={MOCK_ASSIGNMENTS} searchQuery={searchQuery} />
              )}

              {activeTab === "quizzes" && (
                <Quizzes quizzes={MOCK_QUIZZES} searchQuery={searchQuery} />
              )}

              {activeTab === "online-classes" && (
                <OnlineClasses classes={MOCK_LIVE_CLASSES} searchQuery={searchQuery} />
              )}

              {activeTab === "progress" && (
                <ProgressAnalytics kpis={MOCK_LMS_KPIS} courses={MOCK_COURSES} />
              )}

              {activeTab === "certificates" && (
                <Certificates certificates={MOCK_CERTIFICATES} searchQuery={searchQuery} />
              )}
            </div>

            {/* SIDEBAR: AI LEARNING ASSISTANT (1 COL) */}
            <div className="space-y-6">
              <AiLearningWidget />
            </div>

          </div>
        </>
      )}
    </div>
  );
}
