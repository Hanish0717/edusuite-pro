import React, { useState } from "react";
import { QuizItem } from "./types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { HelpCircle, Clock, CheckCircle2, Award, Trophy, Play } from "lucide-react";
import { QuizPlayerModal, LeaderboardModal } from "./quiz-modal";
import { toast } from "sonner";

interface QuizzesProps {
  quizzes: QuizItem[];
  searchQuery: string;
}

export function Quizzes({ quizzes: initialQuizzes, searchQuery }: QuizzesProps) {
  const [quizzesList, setQuizzesList] = useState<QuizItem[]>(initialQuizzes);
  const [selectedQuizForPlayer, setSelectedQuizForPlayer] = useState<QuizItem | null>(null);
  const [leaderboardQuizName, setLeaderboardQuizName] = useState<string | null>(null);

  const filteredQuizzes = quizzesList.filter(
    (q) =>
      q.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.courseCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.faculty.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleQuizComplete = (id: string, score: number) => {
    setQuizzesList((prev) =>
      prev.map((q) =>
        q.id === id
          ? {
              ...q,
              status: "Passed",
              scoreObtained: score,
              attemptsUsed: q.attemptsUsed + 1,
            }
          : q
      )
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <HelpCircle className="h-5 w-5 text-amber-500" />
          <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Online Quiz Assessments ({filteredQuizzes.length})
          </h2>
        </div>
        <span className="text-xs text-slate-500 font-mono">Real-time MCQ Evaluations</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredQuizzes.map((quiz) => {
          const isAvailable = quiz.status === "Available";
          const isPassed = quiz.status === "Passed";

          return (
            <div
              key={quiz.id}
              className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-md hover:border-amber-500/30 transition-all flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="font-mono font-bold text-amber-600 border-amber-200 text-[11px]">
                    {quiz.courseCode}
                  </Badge>

                  <Badge
                    className={`text-[9px] px-2 py-0.5 font-mono ${
                      isAvailable
                        ? "bg-amber-500/10 text-amber-600 border-amber-500/20"
                        : isPassed
                        ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                        : "bg-slate-500/10 text-slate-600 border-slate-500/20"
                    }`}
                  >
                    {quiz.status}
                  </Badge>
                </div>

                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white group-hover:text-amber-600 transition-colors leading-snug">
                  {quiz.name}
                </h3>

                <p className="text-xs text-slate-500 font-medium">Faculty: {quiz.faculty}</p>
              </div>

              <div className="space-y-2 text-xs">
                <div className="grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 font-mono text-[11px]">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Duration</span>
                    <strong className="text-slate-900 dark:text-white">{quiz.durationMins} Mins</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Questions</span>
                    <strong className="text-slate-900 dark:text-white">{quiz.questionsCount} Qs ({quiz.totalMarks} pts)</strong>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono pt-1">
                  <span>Attempts: {quiz.attemptsUsed} / {quiz.maxAttempts}</span>
                  <span>Deadline: {quiz.deadline}</span>
                </div>

                {quiz.scoreObtained !== undefined && (
                  <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-mono text-[11px] font-bold flex items-center justify-between">
                    <span>Score Achieved:</span>
                    <span>{quiz.scoreObtained} / {quiz.totalMarks} Marks</span>
                  </div>
                )}
              </div>

              {/* ACTIONS */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 w-full min-w-0 overflow-hidden">
                {isAvailable ? (
                  <Button
                    onClick={() => setSelectedQuizForPlayer(quiz)}
                    size="sm"
                    className="h-8 text-xs rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold gap-1 col-span-2 w-full min-w-0 overflow-hidden"
                  >
                    <Play className="h-3.5 w-3.5 fill-current shrink-0" />
                    <span className="truncate">Start Quiz Now</span>
                  </Button>
                ) : (
                  <>
                    <Button
                      onClick={() => toast.info(`Reviewing answers for ${quiz.name}...`)}
                      size="sm"
                      variant="outline"
                      className="h-8 text-[11px] px-1 font-semibold rounded-xl border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 w-full min-w-0 overflow-hidden"
                    >
                      <span className="truncate">Review Answers</span>
                    </Button>
                    <Button
                      onClick={() => setLeaderboardQuizName(quiz.name)}
                      size="sm"
                      variant="outline"
                      className="h-8 text-[11px] px-1 font-semibold rounded-xl border-amber-500/30 text-amber-700 dark:text-amber-300 gap-1 font-mono w-full min-w-0 overflow-hidden"
                    >
                      <Trophy className="h-3 w-3 text-amber-500 shrink-0" />
                      <span className="truncate">Leaderboard</span>
                    </Button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* QUIZ PLAYER MODAL */}
      <QuizPlayerModal
        quiz={selectedQuizForPlayer}
        onClose={() => setSelectedQuizForPlayer(null)}
        onQuizComplete={handleQuizComplete}
      />

      {/* LEADERBOARD MODAL */}
      <LeaderboardModal
        quizName={leaderboardQuizName || ""}
        isOpen={!!leaderboardQuizName}
        onClose={() => setLeaderboardQuizName(null)}
      />
    </div>
  );
}
