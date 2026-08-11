import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar, CheckCircle2, XCircle, Copy, Sparkles } from "lucide-react";
import { MealType, MealOption, saveWeeklyMealPlanner } from "./meal-service";
import { toast } from "sonner";

interface WeeklyMealPlannerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  studentId: string;
  studentName: string;
  todayConfirmations: Record<MealType, MealOption>;
  onPlannerSaved: () => void;
}

export function WeeklyMealPlannerModal({
  open,
  onOpenChange,
  studentId,
  studentName,
  todayConfirmations,
  onPlannerSaved,
}: WeeklyMealPlannerModalProps) {
  // Generate next 7 days dates starting from today
  const getNext7Days = () => {
    const days: { dateStr: string; dayName: string; formatted: string }[] = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      const dateStr = d.toISOString().split("T")[0];
      const dayName = d.toLocaleDateString("en-US", { weekday: "short" });
      const formatted = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      days.push({ dateStr, dayName: i === 0 ? "Today" : dayName, formatted });
    }
    return days;
  };

  const days = getNext7Days();

  // Initialize weekly preferences state
  const [weeklyState, setWeeklyState] = useState<Record<string, Record<MealType, MealOption>>>(() => {
    const initial: Record<string, Record<MealType, MealOption>> = {};
    days.forEach((d) => {
      initial[d.dateStr] = {
        Breakfast: "Will Eat",
        Lunch: "Will Eat",
        Snacks: "Will Eat",
        Dinner: "Will Eat",
      };
    });
    return initial;
  });

  const meals: MealType[] = ["Breakfast", "Lunch", "Snacks", "Dinner"];

  const handleToggleMeal = (dateStr: string, meal: MealType) => {
    setWeeklyState((prev) => {
      const current = prev[dateStr]?.[meal] || "Will Eat";
      const next: MealOption = current === "Will Eat" ? "Will Skip" : "Will Eat";
      return {
        ...prev,
        [dateStr]: {
          ...(prev[dateStr] || {}),
          [meal]: next,
        },
      };
    });
  };

  const handleSelectAll = () => {
    const next: typeof weeklyState = {};
    days.forEach((d) => {
      next[d.dateStr] = {
        Breakfast: "Will Eat",
        Lunch: "Will Eat",
        Snacks: "Will Eat",
        Dinner: "Will Eat",
      };
    });
    setWeeklyState(next);
    toast.success("Set all meals to 'Will Eat' for the next 7 days!");
  };

  const handleSkipAll = () => {
    const next: typeof weeklyState = {};
    days.forEach((d) => {
      next[d.dateStr] = {
        Breakfast: "Will Skip",
        Lunch: "Will Skip",
        Snacks: "Will Skip",
        Dinner: "Will Skip",
      };
    });
    setWeeklyState(next);
    toast.info("Set all meals to 'Will Skip' for the next 7 days.");
  };

  const handleCopyTodayPreference = () => {
    const next: typeof weeklyState = {};
    days.forEach((d) => {
      next[d.dateStr] = { ...todayConfirmations };
    });
    setWeeklyState(next);
    toast.success("Copied Today's preferences across the entire week!");
  };

  const handleSave = () => {
    saveWeeklyMealPlanner(studentId, studentName, weeklyState);
    onPlannerSaved();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl p-6 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white shadow-2xl">
        <DialogHeader className="space-y-1 text-left border-b pb-4 border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600">
                <Calendar className="h-5 w-5" />
              </div>
              <div>
                <DialogTitle className="text-base font-bold text-slate-900 dark:text-white font-display">
                  Weekly Meal Planner (Next 7 Days)
                </DialogTitle>
                <DialogDescription className="text-xs text-slate-500">
                  Pre-select your hostel mess choices in advance to help kitchen staff minimize food wastage.
                </DialogDescription>
              </div>
            </div>

            {/* QUICK ACTIONS ROW */}
            <div className="flex items-center gap-2 flex-wrap">
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={handleSelectAll}
                className="h-8 text-xs font-bold rounded-xl gap-1 border-emerald-300 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/40"
              >
                <CheckCircle2 className="h-3.5 w-3.5" /> Select All Meals
              </Button>

              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={handleSkipAll}
                className="h-8 text-xs font-bold rounded-xl gap-1 border-amber-300 text-amber-700 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-950/40"
              >
                <XCircle className="h-3.5 w-3.5" /> Skip All Meals
              </Button>

              <Button
                type="button"
                size="sm"
                onClick={handleCopyTodayPreference}
                className="h-8 text-xs font-bold rounded-xl gap-1 bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
              >
                <Copy className="h-3.5 w-3.5" /> Copy Today to Week
              </Button>
            </div>
          </div>
        </DialogHeader>

        {/* MATRIX GRID */}
        <div className="my-4 overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 font-bold">
                <th className="p-3">Day & Date</th>
                {meals.map((m) => (
                  <th key={m} className="p-3 text-center">
                    {m}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {days.map((d) => {
                const dayObj = weeklyState[d.dateStr] || {};

                return (
                  <tr key={d.dateStr} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="p-3">
                      <div className="font-bold text-slate-900 dark:text-white">{d.dayName}</div>
                      <div className="text-[11px] text-slate-400 font-mono">{d.formatted}</div>
                    </td>

                    {meals.map((m) => {
                      const status = dayObj[m] || "Will Eat";
                      const isEat = status === "Will Eat";

                      return (
                        <td key={m} className="p-2 text-center">
                          <button
                            type="button"
                            onClick={() => handleToggleMeal(d.dateStr, m)}
                            className={`w-full py-2 px-2 rounded-xl text-xs font-bold transition-all border flex items-center justify-center gap-1.5 cursor-pointer ${
                              isEat
                                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 hover:bg-emerald-500/20"
                                : "bg-amber-500/10 border-amber-500/30 text-amber-600 hover:bg-amber-500/20"
                            }`}
                          >
                            {isEat ? (
                              <>
                                <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                                <span>Eat</span>
                              </>
                            ) : (
                              <>
                                <XCircle className="h-3.5 w-3.5 shrink-0" />
                                <span>Skip</span>
                              </>
                            )}
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <DialogFooter className="pt-2 gap-2 border-t border-slate-100 dark:border-slate-800">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="rounded-xl text-xs h-9"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs h-9 px-5 shadow-sm"
          >
            Save 7-Day Meal Schedule
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
