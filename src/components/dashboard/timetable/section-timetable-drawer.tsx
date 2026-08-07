import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Search, Filter, RefreshCw, X, BookOpen, Layers } from "lucide-react";
import { toast } from "sonner";

import {
  fetchSectionTimetable,
  type SectionTimetableData,
  type SectionTimetableSlot,
} from "@/services/section-timetable-service";

import { SectionHeader } from "./section-header";
import { SectionSummaryCards } from "./section-summary-cards";
import { WeeklySectionTimetable } from "./weekly-section-timetable";
import { SubjectDetailsCard } from "./subject-details-card";
import { FacultyDetailsCard } from "./faculty-details-card";
import { DailySchedule } from "./daily-schedule";
import { QuickActions } from "./quick-actions";

interface SectionTimetableDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sectionId?: string;
  deptCode?: string;
  clickedSubject?: string;
  clickedDay?: string;
  clickedTimeSlot?: string;
}

export function SectionTimetableDrawer({
  open,
  onOpenChange,
  sectionId = "CSE-A",
  deptCode = "CSE",
  clickedSubject,
  clickedDay = "Wednesday",
  clickedTimeSlot,
}: SectionTimetableDrawerProps) {
  const [data, setData] = useState<SectionTimetableData>(() =>
    fetchSectionTimetable(sectionId, deptCode)
  );

  // Sync data when sectionId or deptCode changes
  useEffect(() => {
    if (open) {
      const fresh = fetchSectionTimetable(sectionId, deptCode);
      setData(fresh);

      // Select initial active slot matching clickedSubject if provided
      if (clickedSubject) {
        const match = fresh.weeklyTimetable.find(
          (s) =>
            s.subject.toLowerCase() === clickedSubject.toLowerCase() &&
            (!clickedDay || s.day.toLowerCase() === clickedDay.toLowerCase())
        );
        if (match) {
          setSelectedSlot(match);
        } else if (fresh.weeklyTimetable.length > 0) {
          setSelectedSlot(fresh.weeklyTimetable[0]);
        }
      } else if (fresh.weeklyTimetable.length > 0) {
        setSelectedSlot(fresh.weeklyTimetable[0]);
      }
    }
  }, [open, sectionId, deptCode, clickedSubject, clickedDay]);

  const [selectedSlot, setSelectedSlot] = useState<SectionTimetableSlot | null>(null);

  // Filter / Search states
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDay, setFilterDay] = useState("ALL");
  const [filterType, setFilterType] = useState("ALL");

  const filteredSlots = data.weeklyTimetable.filter((s) => {
    const matchesSearch =
      s.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.faculty.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.room.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.timeSlot.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDay = filterDay === "ALL" || s.day === filterDay;
    const matchesType = filterType === "ALL" || s.type === filterType;

    return matchesSearch && matchesDay && matchesType;
  });

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-3xl lg:max-w-[48vw] p-6 overflow-y-auto text-xs space-y-5 bg-background">
        <SheetHeader className="border-b border-border pb-3">
          <div className="flex items-center justify-between">
            <SheetTitle className="font-display text-lg font-extrabold text-foreground flex items-center gap-2">
              <Calendar className="size-5 text-primary" /> Section Master Timetable Viewer
            </SheetTitle>
          </div>
          <SheetDescription className="text-muted-foreground text-[0.72rem]">
            Complete academic timetable, subject topics, and instructor schedule for Section {sectionId}
          </SheetDescription>
        </SheetHeader>

        {/* 1. Section Information Header */}
        <SectionHeader sectionInfo={data.sectionInfo} />

        {/* 2. Student Schedule Overview Summary Cards */}
        <SectionSummaryCards summary={data.summary} />

        {/* 3. Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 bg-muted/30 p-3 rounded-2xl border border-border/70">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
            <Input
              placeholder="Search subject, faculty, room..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 bg-card rounded-xl h-8 text-xs"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Select value={filterDay} onValueChange={setFilterDay}>
              <SelectTrigger className="h-8 text-xs rounded-xl bg-card min-w-[100px]">
                <SelectValue placeholder="Day" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Days</SelectItem>
                <SelectItem value="Monday">Monday</SelectItem>
                <SelectItem value="Tuesday">Tuesday</SelectItem>
                <SelectItem value="Wednesday">Wednesday</SelectItem>
                <SelectItem value="Thursday">Thursday</SelectItem>
                <SelectItem value="Friday">Friday</SelectItem>
                <SelectItem value="Saturday">Saturday</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="h-8 text-xs rounded-xl bg-card min-w-[100px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Types</SelectItem>
                <SelectItem value="Theory">Theory</SelectItem>
                <SelectItem value="Lab">Lab</SelectItem>
                <SelectItem value="Tutorial">Tutorial</SelectItem>
                <SelectItem value="Project">Project</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* 4. Weekly Master Section Timetable Grid (Highlights clicked period) */}
        {filteredSlots.length > 0 ? (
          <WeeklySectionTimetable
            slots={filteredSlots}
            highlightedSlotId={selectedSlot?.id}
            highlightedSubject={clickedSubject}
            highlightedDay={clickedDay}
            highlightedTimeSlot={clickedTimeSlot}
            onSelectSlot={setSelectedSlot}
          />
        ) : (
          <div className="p-8 border border-dashed border-border rounded-2xl text-center space-y-3 bg-muted/10">
            <div className="size-10 rounded-2xl bg-amber-500/10 text-amber-600 grid place-items-center mx-auto">
              <Layers className="size-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-foreground">No section timetable available.</h4>
              <p className="text-[0.7rem] text-muted-foreground mt-0.5">
                No matching classes found for Section {sectionId} with current search and filters.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchQuery("");
                setFilterDay("ALL");
                setFilterType("ALL");
              }}
              className="text-xs rounded-xl"
            >
              Reset Filters
            </Button>
          </div>
        )}


        {/* 5. Subject & Faculty Details Cards Split */}
        {selectedSlot && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SubjectDetailsCard slot={selectedSlot} />
            <FacultyDetailsCard slot={selectedSlot} />
          </div>
        )}

        {/* 6. Today's Complete Daily Schedule */}
        <DailySchedule
          slots={data.weeklyTimetable}
          activeDay={clickedDay || "Wednesday"}
          onSelectSlot={setSelectedSlot}
        />

        {/* 7. Quick Navigation Actions */}
        <QuickActions
          onViewSubjectDetails={() => {
            if (selectedSlot) {
              toast.info(`Viewing details for ${selectedSlot.subject}`, {
                description: `Room: ${selectedSlot.room} | Instructor: ${selectedSlot.faculty}`,
              });
            }
          }}
        />
      </SheetContent>
    </Sheet>
  );
}
