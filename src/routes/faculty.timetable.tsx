import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { useRole } from "@/context/role-context";
import {
  getFacultyTimetable,
  getCentralizedMasterTimetable,
  validateTimetableConflicts,
  type TimetableEntry,
} from "@/services/master-timetable-service";

// Subcomponents imports
import { TimetableHeader } from "@/components/dashboard/timetable/timetable-header";
import { FilterPanel } from "@/components/dashboard/timetable/filter-panel";
import { TodaySchedule } from "@/components/dashboard/timetable/today-schedule";
import { WeeklyGrid } from "@/components/dashboard/timetable/weekly-grid-master";
import { MonthlyCalendar } from "@/components/dashboard/timetable/monthly-calendar";
import { UpcomingClasses } from "@/components/dashboard/timetable/upcoming-classes";
import { SubjectSummary } from "@/components/dashboard/timetable/subject-summary";
import { RoomAllocationTable } from "@/components/dashboard/timetable/room-allocation-table";
import { TeachingLoadCards } from "@/components/dashboard/timetable/teaching-load-cards";
import { FreePeriodCards } from "@/components/dashboard/timetable/free-period-cards";
import { ConflictPanel } from "@/components/dashboard/timetable/conflict-panel";
import { Legend } from "@/components/dashboard/timetable/legend";
import { SectionTimetableDrawer } from "@/components/dashboard/timetable/section-timetable-drawer";
import { SkeletonLoader } from "@/components/dashboard/timetable/skeleton-loader";
import { toast } from "sonner";

export const Route = createFileRoute("/faculty/timetable")({
  head: () => ({
    meta: [{ title: "Timetable — EduSuite Pro" }],
  }),
  component: FacultyTimetablePage,
});

function FacultyTimetablePage() {
  const { profile } = useRole();
  const deptCode = profile.department || "CSE";
  const facultyId = profile.employeeId || "EMP-CSE-2041";
  const facultyName = profile.personaName || "Dr. Ananya Sharma";

  const [loading, setLoading] = useState(false);
  const [activeWeek, setActiveWeek] = useState("Week 5 (Active)");

  // Derive faculty personal schedule dynamically from master timetable source
  const masterFacultyEntries = useMemo(() => {
    return getFacultyTimetable(facultyId).length > 0
      ? getFacultyTimetable(facultyId)
      : getFacultyTimetable(facultyName);
  }, [facultyId, facultyName]);

  // Compute conflict alerts dynamically
  const conflicts = useMemo(() => {
    return validateTimetableConflicts(masterFacultyEntries);
  }, [masterFacultyEntries]);

  // Map master entries to Today's schedule widget format
  const todayScheduleFormatted = useMemo(() => {
    return masterFacultyEntries
      .filter((e) => e.day === "Monday" || e.day === "Wednesday" || e.day === "Friday")
      .map((e) => ({
        id: e.id,
        timeSlot: `${e.startTime} - ${e.endTime}`,
        subject: e.subjectName,
        code: e.subjectCode,
        section: e.section,
        room: e.room,
        building: e.building,
        type: e.lectureType,
        day: e.day,
        status: e.status,
      }));
  }, [masterFacultyEntries]);

  // Map teaching load stats
  const teachingLoad = useMemo(() => {
    const totalWeeklyHours = masterFacultyEntries.length * 1.5;
    const theoryHours = masterFacultyEntries.filter((e) => e.lectureType === "Lecture").length * 1;
    const labHours = masterFacultyEntries.filter((e) => e.lectureType === "Lab").length * 2;
    return {
      weeklyHours: `${totalWeeklyHours} hrs`,
      theoryHours: `${theoryHours} hrs`,
      labHours: `${labHours} hrs`,
      freePeriods: `${Math.max(0, 30 - masterFacultyEntries.length)} periods`,
    };
  }, [masterFacultyEntries]);

  // Section Timetable Viewer Selected Class State
  const [selectedClass, setSelectedClass] = useState<{
    subjectId?: string;
    subjectName: string;
    sectionId: string;
    sectionName: string;
    department: string;
    semester: string;
    facultyId?: string;
    room: string;
    day: string;
    startTime: string;
    endTime: string;
  } | null>(null);

  const handleRefresh = () => {
    setLoading(true);
    toast.success("Synchronizing timetable with Master Institutional Schedule...", {
      description: "Fetching updated slots from Academic Management.",
    });
    setTimeout(() => {
      setLoading(false);
    }, 600);
  };

  const handleFilterChange = (filters: Record<string, string>) => {
    setLoading(true);
    setActiveWeek(filters["week"] || "Week 5 (Active)");
    toast.success(`Filter applied: ${filters["week"] || "Current Week"}`, {
      description: `Loading schedules for AY ${filters["ay"] || "2025-26"}.`,
    });
    setTimeout(() => {
      setLoading(false);
    }, 450);
  };

  const handleSelectSlot = (entry: TimetableEntry) => {
    setSelectedClass({
      subjectId: entry.subjectCode,
      subjectName: entry.subjectName,
      sectionId: entry.section,
      sectionName: entry.section,
      department: entry.department,
      semester: entry.semester,
      facultyId: entry.facultyName,
      room: entry.room,
      day: entry.day,
      startTime: entry.startTime,
      endTime: entry.endTime,
    });

    toast.info(`Viewing Master Schedule Slot for ${entry.section}`, {
      description: `${entry.subjectName} (${entry.startTime} - ${entry.endTime}) at ${entry.room}`,
    });
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Toolbar */}
      <TimetableHeader
        academicYear="2025-26"
        semester="Semester 6"
        onRefresh={handleRefresh}
      />

      {/* 2. Loading state vs Content */}
      {loading ? (
        <SkeletonLoader />
      ) : (
        <div className="space-y-6">
          {/* Today's Schedule horizontal cards */}
          <TodaySchedule schedule={todayScheduleFormatted as any} onCardClick={handleSelectSlot as any} />

          {/* Load Summary Statistics Cards */}
          <TeachingLoadCards load={teachingLoad as any} />

          {/* Grid filter options */}
          <FilterPanel onFilterChange={handleFilterChange} />

          {/* Master Weekly Grid */}
          <WeeklyGrid
            entries={masterFacultyEntries}
            conflicts={conflicts}
            onSelectSlot={handleSelectSlot}
            readOnly={true}
          />
        </div>
      )}

      {/* Section Timetable Drawer Viewer Overlay */}
      <SectionTimetableDrawer
        open={Boolean(selectedClass)}
        onOpenChange={(open) => !open && setSelectedClass(null)}
        sectionId={selectedClass?.sectionId}
        deptCode={deptCode}
        clickedSubject={selectedClass?.subjectName}
        clickedDay={selectedClass?.day}
        clickedTimeSlot={selectedClass ? `${selectedClass.startTime} - ${selectedClass.endTime}` : undefined}
      />
    </div>
  );
}

