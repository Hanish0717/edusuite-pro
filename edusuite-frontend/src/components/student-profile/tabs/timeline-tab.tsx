import React, { useState } from "react";
import { StudentProfileData } from "../types";
import { Badge } from "@/components/ui/badge";
import { Calendar, GraduationCap, Award, Zap, Briefcase, CheckCircle2, Trophy, BookOpen } from "lucide-react";

interface TimelineTabProps {
  student: StudentProfileData;
}

export function TimelineTab({ student }: TimelineTabProps) {
  const [filter, setFilter] = useState("All");

  const categories = ["All", "Admission", "Exam Results", "Achievements", "Placement", "Semester Promotion"];

  const filtered = student.timeline.filter(
    (item) => filter === "All" || item.category === filter
  );

  return (
    <div className="space-y-6">
      
      {/* FILTER BAR */}
      <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-600" /> Student ERP Career Timeline & Milestone History
          </h3>
          <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/20">
            2022 &ndash; 2026 Batch
          </Badge>
        </div>

        <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-3 py-1 rounded-xl text-xs font-semibold transition-colors ${
                filter === cat
                  ? "bg-blue-600 text-white"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* VERTICAL TIMELINE CONTAINER */}
      <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
        {filtered.map((tl) => (
          <div key={tl.id} className="relative group">
            {/* Timeline Bullet Dot */}
            <div className="absolute -left-6 top-1.5 h-5 w-5 rounded-full border-2 border-white dark:border-slate-900 bg-blue-600 shadow-md flex items-center justify-center text-white text-[10px]">
              <CheckCircle2 className="h-3 w-3" />
            </div>

            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-1 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <Badge className="bg-blue-500/10 text-blue-600 text-[10px] uppercase font-bold">
                  {tl.category}
                </Badge>
                <span className="font-mono text-xs text-slate-400 font-bold">{tl.date}</span>
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white pt-1">{tl.title}</h4>
              <p className="text-xs text-slate-500">{tl.description}</p>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
