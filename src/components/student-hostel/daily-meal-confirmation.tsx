import React, { useState, useEffect } from "react";
import {
  MealType,
  MealOption,
  MEAL_CUTOFF_TIMES,
  MEAL_SCHEDULE_TIMINGS,
  isMealCutoffPassed,
  getStudentDailyConfirmations,
  saveStudentMealConfirmation,
  getStudentMealAnalytics,
  MealConfirmationRecord,
} from "./meal-service";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Utensils,
  CheckCircle2,
  XCircle,
  Clock,
  Lock,
  AlertCircle,
  Calendar,
  Sparkles,
  TrendingUp,
  PieChart,
  Award,
} from "lucide-react";
import { toast } from "sonner";
import { WeeklyMealPlannerModal } from "./weekly-meal-planner-modal";

interface DailyMealConfirmationProps {
  studentId?: string;
  studentName?: string;
}

export function DailyMealConfirmation({
  studentId = "22CS101",
  studentName = "K. Sai Teja",
}: DailyMealConfirmationProps) {
  const todayStr = new Date().toISOString().split("T")[0];
  const formattedToday = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const meals: MealType[] = ["Breakfast", "Lunch", "Snacks", "Dinner"];

  const [confirmations, setConfirmations] = useState<Record<MealType, MealOption>>({
    Breakfast: "Will Eat",
    Lunch: "Will Eat",
    Snacks: "Will Eat",
    Dinner: "Will Eat",
  });

  const [records, setRecords] = useState<Record<MealType, MealConfirmationRecord | null>>({
    Breakfast: null,
    Lunch: null,
    Snacks: null,
    Dinner: null,
  });

  const [savingMap, setSavingMap] = useState<Record<MealType, boolean>>({
    Breakfast: false,
    Lunch: false,
    Snacks: false,
    Dinner: false,
  });

  const [isWeeklyModalOpen, setIsWeeklyModalOpen] = useState(false);
  const [analytics, setAnalytics] = useState(() => getStudentMealAnalytics(studentId));

  // Reload confirmations from local storage / service
  const loadConfirmations = () => {
    const dailyRecords = getStudentDailyConfirmations(studentId, todayStr);
    setRecords(dailyRecords);

    const nextConf: Record<MealType, MealOption> = {
      Breakfast: dailyRecords.Breakfast?.status || "Will Eat",
      Lunch: dailyRecords.Lunch?.status || "Will Eat",
      Snacks: dailyRecords.Snacks?.status || "Will Eat",
      Dinner: dailyRecords.Dinner?.status || "Will Eat",
    };
    setConfirmations(nextConf);
    setAnalytics(getStudentMealAnalytics(studentId));
  };

  useEffect(() => {
    loadConfirmations();
  }, [studentId, todayStr]);

  const handleSelection = (meal: MealType, option: MealOption) => {
    const existingRec = records[meal];

    if (existingRec?.isLocked) {
      toast.error(`Selection for ${meal} is already locked and cannot be changed!`);
      return;
    }

    if (isMealCutoffPassed(meal, todayStr)) {
      toast.error(`Selection for ${meal} is locked after cutoff time (${MEAL_CUTOFF_TIMES[meal].label})!`);
      return;
    }

    setSavingMap((prev) => ({ ...prev, [meal]: true }));

    setTimeout(() => {
      const savedRec = saveStudentMealConfirmation(studentId, studentName, todayStr, meal, option);
      setConfirmations((prev) => ({ ...prev, [meal]: option }));
      setRecords((prev) => ({ ...prev, [meal]: savedRec }));
      setSavingMap((prev) => ({ ...prev, [meal]: false }));

      if (option === "Will Eat") {
        toast.success("Your meal has been reserved. The hostel mess has been notified.");
      } else {
        toast.info("You have opted to skip this meal. The hostel mess has been notified.");
      }
      setAnalytics(getStudentMealAnalytics(studentId));
    }, 300);
  };

  // Check if any meal cutoff is approaching within 1 hour and unconfirmed
  const checkApproachingCutoffs = () => {
    const now = new Date();
    const currentMins = now.getHours() * 60 + now.getMinutes();

    return meals.find((m) => {
      const cutoffMins = MEAL_CUTOFF_TIMES[m].hour * 60 + MEAL_CUTOFF_TIMES[m].minute;
      const diff = cutoffMins - currentMins;
      const isUnconfirmed = !records[m];
      return diff > 0 && diff <= 60 && isUnconfirmed;
    });
  };

  const approachingMeal = checkApproachingCutoffs();

  return (
    <div className="space-y-6">

      {/* 1. SECTION HEADER BANNER & WEEKLY PLANNER TRIGGER */}
      <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 shrink-0">
            <Utensils className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base font-bold text-slate-900 dark:text-white font-display">
                Today's Meal Confirmation
              </h3>
              <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 font-mono text-[10px]">
                LIVE MESS SCHEDULER
              </Badge>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              {formattedToday} &bull; One-time meal submission before cutoff times to prevent food waste.
            </p>
          </div>
        </div>

        <Button
          onClick={() => setIsWeeklyModalOpen(true)}
          className="rounded-xl bg-[#0b193c] hover:bg-[#0b193c]/90 text-white font-bold text-xs h-9 px-4 gap-2 shadow-sm shrink-0"
        >
          <Calendar className="h-4 w-4 text-amber-400" />
          <span>Weekly Meal Planner</span>
        </Button>
      </div>

      {/* 2. REMINDER NOTIFICATION BANNER */}
      {approachingMeal && (
        <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 text-xs flex items-center justify-between gap-3 text-amber-800 dark:text-amber-200 animate-in fade-in duration-300">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-amber-600 shrink-0" />
            <span>
              <strong>Reminder:</strong> Please confirm today's <strong>{approachingMeal}</strong> before{" "}
              <strong>{MEAL_CUTOFF_TIMES[approachingMeal].label}</strong>.
            </span>
          </div>
          <Badge className="bg-amber-500/20 text-amber-800 dark:text-amber-200 text-[10px] font-bold">
            Cutoff Approaching
          </Badge>
        </div>
      )}

      {/* 3. MEALS CARDS GRID (4 MEALS) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {meals.map((meal) => {
          const record = records[meal];
          const hasRecord = !!record;
          const isSubmittedLocked = record?.isLocked === true;
          const isTimeLocked = isMealCutoffPassed(meal, todayStr);
          const isLocked = isSubmittedLocked || isTimeLocked;

          const selectedOption = confirmations[meal];
          const cutoffLabel = MEAL_CUTOFF_TIMES[meal].label;
          const scheduleTiming = MEAL_SCHEDULE_TIMINGS[meal];
          const isSaving = savingMap[meal];

          const isWillEat = selectedOption === "Will Eat";

          return (
            <div
              key={meal}
              className={`p-4 rounded-2xl border transition-all flex flex-col justify-between space-y-4 ${
                isLocked
                  ? "bg-slate-50/70 dark:bg-slate-800/30 border-slate-200 dark:border-slate-800 pointer-events-none select-none opacity-90 shadow-none"
                  : isWillEat
                  ? "bg-emerald-50/20 dark:bg-emerald-950/10 border-emerald-200 dark:border-emerald-900/40 shadow-sm"
                  : "bg-rose-50/20 dark:bg-rose-950/10 border-rose-200 dark:border-rose-900/40 shadow-sm"
              }`}
            >
              <div className="space-y-2.5">
                {/* Header Row */}
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">
                    {meal}
                  </span>
                  {isLocked ? (
                    <Badge variant="outline" className="text-[10px] bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30 font-mono gap-1 font-bold">
                      <Lock className="h-3 w-3 text-amber-600" /> Selection Locked
                    </Badge>
                  ) : (
                    <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                      <Clock className="h-3 w-3 text-amber-500" /> Cutoff: {cutoffLabel}
                    </span>
                  )}
                </div>

                <div className="text-[11px] text-slate-500 font-mono">
                  Serving: <strong className="text-slate-800 dark:text-slate-200">{scheduleTiming}</strong>
                </div>

                {/* Status Confirmation Card */}
                {hasRecord ? (
                  <div className="pt-1">
                    {record.status === "Will Eat" ? (
                      <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs space-y-1">
                        <div className="flex items-center gap-1.5 font-bold text-emerald-700 dark:text-emerald-300">
                          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                          <span>Selected: Will Eat</span>
                        </div>
                        <p className="text-[10px] text-emerald-600 dark:text-emerald-400 leading-tight">
                          Your meal has been reserved. The hostel mess has been notified.
                        </p>
                      </div>
                    ) : (
                      <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 text-xs space-y-1">
                        <div className="flex items-center gap-1.5 font-bold text-rose-700 dark:text-rose-300">
                          <XCircle className="h-4 w-4 text-rose-600 shrink-0" />
                          <span>Selected: Will Skip</span>
                        </div>
                        <p className="text-[10px] text-rose-600 dark:text-rose-400 leading-tight">
                          You have opted to skip this meal. The hostel mess has been notified.
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-500 text-[11px] font-medium text-center">
                    Please make a choice before cutoff
                  </div>
                )}
              </div>

              {/* ACTION BUTTONS vs LOCKED FOOTER */}
              <div className="space-y-1.5 pt-2">
                {isLocked ? (
                  <div className="space-y-1 text-center">
                    <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 p-2 rounded-xl bg-slate-200/60 dark:bg-slate-800/60 border border-slate-300/50 dark:border-slate-700/50 flex items-center justify-center gap-1.5">
                      <Lock className="h-3.5 w-3.5 text-amber-500" />
                      <span>Selection Locked</span>
                    </div>
                    {record?.submittedAt && (
                      <div className="text-[9.5px] text-slate-400 font-mono">
                        Submitted: {record.submittedAt}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      type="button"
                      disabled={isSaving}
                      onClick={() => handleSelection(meal, "Will Eat")}
                      className="h-9 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-600 shadow-sm gap-1 transition-all"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" /> Will Eat
                    </Button>

                    <Button
                      type="button"
                      disabled={isSaving}
                      onClick={() => handleSelection(meal, "Will Skip")}
                      className="h-9 text-xs font-bold rounded-xl bg-rose-600 hover:bg-rose-700 text-white border-rose-600 shadow-sm gap-1 transition-all"
                    >
                      <XCircle className="h-3.5 w-3.5" /> Will Skip
                    </Button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* 4. HOSTEL MEAL ANALYTICS & STATISTICS */}
      <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b pb-3 border-slate-100 dark:border-slate-800">
          <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-blue-600" /> Hostel Mess Participation Analytics
          </h4>
          <span className="text-xs text-slate-400 font-mono">Current Month Ledger</span>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-1">
            <span className="text-[11px] text-slate-500 block">Meals Taken This Month</span>
            <div className="text-xl font-bold text-emerald-600 font-mono">{analytics.takenThisMonth} Meals</div>
            <span className="text-[10px] text-slate-400">Regular mess attendance</span>
          </div>

          <div className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-1">
            <span className="text-[11px] text-slate-500 block">Meals Skipped</span>
            <div className="text-xl font-bold text-amber-600 font-mono">{analytics.skippedThisMonth} Meals</div>
            <span className="text-[10px] text-slate-400">Outing / Leave opt-outs</span>
          </div>

          <div className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-1">
            <span className="text-[11px] text-slate-500 block">Participation Rate</span>
            <div className="text-xl font-bold text-blue-600 font-mono">{analytics.participationRate}%</div>
            <span className="text-[10px] text-slate-400">Mess efficiency metric</span>
          </div>

          <div className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-1">
            <span className="text-[11px] text-slate-500 block">Current Week Summary</span>
            <div className="text-xl font-bold text-slate-900 dark:text-white font-mono">
              {analytics.currentWeekTaken} / {analytics.currentWeekTaken + analytics.currentWeekSkipped}
            </div>
            <span className="text-[10px] text-emerald-600 font-bold">22 Reserved &bull; 3 Skipped</span>
          </div>
        </div>
      </div>

      {/* WEEKLY MEAL PLANNER MODAL */}
      <WeeklyMealPlannerModal
        open={isWeeklyModalOpen}
        onOpenChange={setIsWeeklyModalOpen}
        studentId={studentId}
        studentName={studentName}
        todayConfirmations={confirmations}
        onPlannerSaved={loadConfirmations}
      />
    </div>
  );
}
