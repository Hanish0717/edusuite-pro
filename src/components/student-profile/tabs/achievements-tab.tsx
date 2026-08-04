import React, { useState } from "react";
import { StudentProfileData } from "../types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Award, Plus, Sparkles, Trophy, Briefcase, FileText, CheckCircle2, Star } from "lucide-react";

interface AchievementsTabProps {
  student: StudentProfileData;
  onAddAchievement: () => void;
}

export function AchievementsTab({ student, onAddAchievement }: AchievementsTabProps) {
  const [category, setCategory] = useState("All");

  const categories = [
    "All",
    "Hackathons",
    "Certifications",
    "Internships",
    "Research Papers",
    "Placement Offers",
    "Sports",
  ];

  const filtered = student.achievements.filter(
    (a) => category === "All" || a.category === category
  );

  return (
    <div className="space-y-6">
      
      {/* HEADER TOOLBAR */}
      <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Trophy className="h-5 w-5 text-amber-500 animate-bounce" /> Student Co-Curricular & Career Portfolio
            </h3>
            <p className="text-xs text-slate-500">Verified hackathon awards, internships, research publications, & placement offers</p>
          </div>

          <Button onClick={onAddAchievement} size="sm" className="rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs gap-1.5 shadow-sm">
            <Plus className="h-3.5 w-3.5" /> Add Achievement
          </Button>
        </div>

        <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3 py-1 rounded-xl text-xs font-semibold transition-colors ${
                category === cat
                  ? "bg-amber-500 text-white"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ACHIEVEMENTS CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((ach) => (
          <div key={ach.id} className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-3 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <Badge className={`text-[10px] uppercase font-bold border ${ach.badgeColor || "bg-blue-500/10 text-blue-600"}`}>
                  {ach.category}
                </Badge>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">{ach.title}</h4>
              </div>
              <span className="font-mono text-xs font-bold text-slate-400 shrink-0">{ach.date}</span>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {ach.description}
            </p>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
              <span className="text-slate-500">Authority: <strong className="text-slate-800 dark:text-slate-200">{ach.issuedBy}</strong></span>
              <span className="text-emerald-600 font-semibold flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5" /> Verified
              </span>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
