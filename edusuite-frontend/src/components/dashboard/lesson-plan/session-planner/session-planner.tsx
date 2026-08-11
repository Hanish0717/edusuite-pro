import React, { useState, useEffect } from "react";
import { Sparkles, RefreshCw, BookOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

import {
  fetchSessionPlannerData,
  type SessionPlannerFullData,
} from "./session-planner-service";
import { OverviewCards } from "./overview-cards";
import { UnitBreakdownCards } from "./unit-breakdown-cards";
import { TodaysTeachingPlan } from "./todays-teaching-plan";
import { TeachingHourCards } from "./teaching-hour-cards";
import { CoveredTopics } from "./covered-topics";
import { RemainingTopics } from "./remaining-topics";
import { TeachingTimeline } from "./teaching-timeline";
import { TeachingAnalytics } from "./teaching-analytics";
import { ResourcesPanel } from "./resources-panel";
import { SearchFilterBar } from "./search-filter-bar";
import { QuickActions } from "./quick-actions";

interface SessionPlannerProps {
  subjectName: string;
  subjectCode: string;
  department: string;
  semester: string;
  regulation?: string;
}

export function SessionPlanner({
  subjectName,
  subjectCode,
  department,
  semester,
  regulation = "R22",
}: SessionPlannerProps) {
  const [data, setData] = useState<SessionPlannerFullData | null>(null);
  const [loading, setLoading] = useState(true);

  // Search and Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUnit, setSelectedUnit] = useState("ALL");
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [timeFilter, setTimeFilter] = useState("ALL");

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    fetchSessionPlannerData(subjectName, subjectCode, department, semester, regulation).then(
      (res) => {
        if (isMounted) {
          setData(res);
          setLoading(false);
        }
      }
    );

    return () => {
      isMounted = false;
    };
  }, [subjectName, subjectCode, department, semester, regulation]);

  if (loading || !data) {
    return (
      <div className="p-8 text-center space-y-3 border rounded-2xl bg-card">
        <RefreshCw className="size-6 animate-spin text-primary mx-auto" />
        <p className="text-xs font-semibold text-muted-foreground">Loading Session Planner syllabus map...</p>
      </div>
    );
  }

  // Handle Mark Today's Topic Completed
  const handleMarkCompleted = () => {
    if (!data) return;
    const currentTopic = data.overview.todaysPlannedTopic.topic;
    toast.success(`Marked "${currentTopic}" as Completed!`, {
      description: "Progress analytics and hour completion index updated.",
    });

    setData((prev) => {
      if (!prev) return prev;
      const updatedHours = prev.teachingHours.map((h) =>
        h.hourNumber === prev.overview.todaysPlannedTopic.hourNumber
          ? { ...h, status: "Completed" as const, completionDate: "2026-08-05" }
          : h
      );

      const completedCount = updatedHours.filter((h) => h.status === "Completed").length;
      const newPct = Math.round((completedCount / prev.overview.totalTeachingHours) * 100);

      return {
        ...prev,
        overview: {
          ...prev.overview,
          completedHours: completedCount,
          remainingHours: prev.overview.totalTeachingHours - completedCount,
          syllabusCompletionPercentage: newPct,
          todaysPlannedTopic: {
            ...prev.overview.todaysPlannedTopic,
            status: "Completed"
          }
        },
        teachingHours: updatedHours
      };
    });
  };

  const handleViewNextTopic = () => {
    toast.info(`Next Planned Topic: "${data.overview.nextTopic.topic}"`, {
      description: `Scheduled for ${data.overview.nextTopic.estimatedDate}`,
    });
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedUnit("ALL");
    setSelectedStatus("ALL");
    setTimeFilter("ALL");
  };

  // Filter teaching hours locally
  const filteredHours = data.teachingHours.filter((h) => {
    const matchesSearch =
      h.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.subtopics.some((st) => st.toLowerCase().includes(searchQuery.toLowerCase())) ||
      `hour ${h.hourNumber}`.includes(searchQuery.toLowerCase()) ||
      h.status.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesUnit = selectedUnit === "ALL" || String(h.unitNumber) === selectedUnit;
    const matchesStatus = selectedStatus === "ALL" || h.status === selectedStatus;

    let matchesTime = true;
    if (timeFilter === "WEEK") {
      matchesTime = h.hourNumber <= 10;
    } else if (timeFilter === "MONTH") {
      matchesTime = h.hourNumber <= 25;
    }

    return matchesSearch && matchesUnit && matchesStatus && matchesTime;
  });

  return (
    <div className="space-y-6 text-xs">
      {/* Subject Header Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-md">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap text-[0.65rem] font-mono text-white/70">
            <span>{department} Department</span>
            <span>&middot;</span>
            <span>{subjectCode}</span>
            <span>&middot;</span>
            <span>Semester {semester}</span>
            <span>&middot;</span>
            <span>Regulation {regulation}</span>
          </div>
          <h2 className="text-lg md:text-xl font-extrabold font-display leading-tight flex items-center gap-2">
            <BookOpen className="size-5 text-indigo-400" /> {subjectName} Session Planner
          </h2>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Badge className="bg-white/10 text-white border-0 py-1 font-mono text-xs">
            {data.overview.syllabusCompletionPercentage}% Completed
          </Badge>
        </div>
      </div>

      {/* 1. Overview Cards */}
      <OverviewCards overview={data.overview} />

      {/* 2. Today's Teaching Plan */}
      <TodaysTeachingPlan
        todaysTopic={data.overview.todaysPlannedTopic}
        subjectName={subjectName}
        onMarkCompleted={handleMarkCompleted}
      />

      {/* 3. Search & Filter Bar */}
      <SearchFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedUnit={selectedUnit}
        onUnitChange={setSelectedUnit}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
        timeFilter={timeFilter}
        onTimeFilterChange={setTimeFilter}
        totalUnits={data.unitBreakdown.length}
        onReset={handleResetFilters}
      />

      {/* 4. Unit Breakdown */}
      <UnitBreakdownCards units={data.unitBreakdown} />

      {/* 5. Covered Topics */}
      <CoveredTopics topics={data.coveredTopics} />

      {/* 6. Remaining Topics */}
      <RemainingTopics topics={data.remainingTopics} />


      {/* 6. Hour-wise Teaching Plan */}
      <TeachingHourCards hours={filteredHours} />

      {/* 7. Teaching Timeline & Progress Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <TeachingTimeline timeline={data.timeline} />
        <TeachingAnalytics analytics={data.analytics} />
      </div>

      {/* 8. Teaching Resources */}
      <ResourcesPanel resources={data.teachingHours[0]?.resources || []} />

      {/* 9. Quick Actions */}
      <QuickActions
        onMarkCompleted={handleMarkCompleted}
        onViewNextTopic={handleViewNextTopic}
      />
    </div>
  );
}
