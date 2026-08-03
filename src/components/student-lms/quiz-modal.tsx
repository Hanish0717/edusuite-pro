import React, { useState, useEffect } from "react";
import { QuizItem, LeaderboardUser } from "./types";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { HelpCircle, Clock, CheckCircle2, XCircle, Award, Trophy } from "lucide-react";
import { toast } from "sonner";

interface QuizPlayerModalProps {
  quiz: QuizItem | null;
  onClose: () => void;
  onQuizComplete: (quizId: string, score: number) => void;
}

export function QuizPlayerModal({ quiz, onClose, onQuizComplete }: QuizPlayerModalProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [timeLeftMins, setTimeLeftMins] = useState(20);

  useEffect(() => {
    if (quiz) {
      setTimeLeftMins(quiz.durationMins);
      setCurrentQuestionIndex(0);
      setSelectedAnswers({});
    }
  }, [quiz]);

  if (!quiz) return null;

  const currentQ = quiz.questions[currentQuestionIndex];

  const handleSelectOption = (optIdx: number) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQuestionIndex]: optIdx,
    }));
  };

  const handleSubmitQuiz = () => {
    let score = 0;
    quiz.questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctAnswer) {
        score += 2;
      }
    });

    toast.success(`Quiz Completed! You scored ${score} / ${quiz.totalMarks}`);
    onQuizComplete(quiz.id, score);
    onClose();
  };

  return (
    <Dialog open={!!quiz} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl rounded-2xl p-6 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
        <DialogHeader className="border-b pb-3 border-slate-100 dark:border-slate-800 text-left flex flex-row items-center justify-between">
          <div>
            <Badge variant="outline" className="font-mono font-bold text-amber-600 border-amber-200 text-[10px] mb-1">
              {quiz.courseCode} • Online Assessment
            </Badge>
            <DialogTitle className="text-base font-bold">
              {quiz.name}
            </DialogTitle>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 border border-rose-200 font-mono text-xs font-bold">
            <Clock className="h-3.5 w-3.5 animate-pulse" /> {timeLeftMins}:00 Mins Left
          </div>
        </DialogHeader>

        {currentQ ? (
          <div className="space-y-4 my-3 text-xs">
            <div className="flex items-center justify-between font-mono text-slate-400">
              <span>Question {currentQuestionIndex + 1} of {quiz.questions.length}</span>
              <span>Marks: 2.0</span>
            </div>

            <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-relaxed">
              {currentQ.question}
            </h4>

            <div className="space-y-2">
              {currentQ.options.map((opt, optIdx) => {
                const isSelected = selectedAnswers[currentQuestionIndex] === optIdx;
                return (
                  <button
                    key={optIdx}
                    onClick={() => handleSelectOption(optIdx)}
                    className={`w-full p-3 rounded-xl border text-left font-medium transition-all flex items-center justify-between ${
                      isSelected
                        ? "border-amber-500 bg-amber-50/50 dark:bg-amber-950/30 text-amber-900 dark:text-amber-200 ring-1 ring-amber-500"
                        : "border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                    }`}
                  >
                    <span>{optIdx + 1}. {opt}</span>
                    <span className={`h-4 w-4 rounded-full border ${isSelected ? "border-amber-600 bg-amber-600" : "border-slate-300"}`} />
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <p className="text-xs text-slate-500 my-4">All questions completed.</p>
        )}

        <DialogFooter className="gap-2 flex justify-between items-center w-full">
          <div className="flex gap-2">
            <Button
              onClick={() => setCurrentQuestionIndex((i) => Math.max(0, i - 1))}
              disabled={currentQuestionIndex === 0}
              variant="outline"
              size="sm"
              className="rounded-xl text-xs"
            >
              Previous
            </Button>
            <Button
              onClick={() => setCurrentQuestionIndex((i) => Math.min(quiz.questions.length - 1, i + 1))}
              disabled={currentQuestionIndex === quiz.questions.length - 1}
              variant="outline"
              size="sm"
              className="rounded-xl text-xs"
            >
              Next Question
            </Button>
          </div>

          <Button
            onClick={handleSubmitQuiz}
            size="sm"
            className="rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold"
          >
            Submit Quiz
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

interface LeaderboardModalProps {
  quizName: string;
  isOpen: boolean;
  onClose: () => void;
}

export function LeaderboardModal({ quizName, isOpen, onClose }: LeaderboardModalProps) {
  const leaderboards: LeaderboardUser[] = [
    { rank: 1, name: "Aditya Verma", rollNo: "2021CSE084", score: 20, timeSpent: "08m 12s" },
    { rank: 2, name: "Siddharth Rao", rollNo: "2021CSE091", score: 20, timeSpent: "09m 45s" },
    { rank: 3, name: "Meera Nair", rollNo: "2021CSE072", score: 18, timeSpent: "11m 02s" },
    { rank: 4, name: "Karthik Raja", rollNo: "2021CSE055", score: 18, timeSpent: "12m 30s" },
    { rank: 5, name: "Pooja Sharma", rollNo: "2021CSE089", score: 16, timeSpent: "14m 10s" },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md rounded-2xl p-6 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
        <DialogHeader className="border-b pb-3 border-slate-100 dark:border-slate-800 text-left">
          <DialogTitle className="text-base font-bold flex items-center gap-2">
            <Trophy className="h-4 w-4 text-amber-500" /> Quiz Leaderboard
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500">
            Top performers for {quizName}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2 my-2 text-xs">
          {leaderboards.map((user) => (
            <div
              key={user.rank}
              className={`p-3 rounded-xl border flex items-center justify-between ${
                user.rank === 1
                  ? "bg-amber-50 dark:bg-amber-950/40 border-amber-500/30 font-bold"
                  : "bg-slate-50/50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={`w-6 h-6 rounded-full font-mono text-xs flex items-center justify-center font-bold ${
                  user.rank === 1 ? "bg-amber-500 text-white" : "bg-slate-200 text-slate-700"
                }`}>
                  #{user.rank}
                </span>
                <div>
                  <span className="text-slate-900 dark:text-white block">{user.name}</span>
                  <span className="text-[10px] font-mono text-slate-400">{user.rollNo}</span>
                </div>
              </div>

              <div className="text-right font-mono">
                <span className="font-bold text-amber-600 text-sm block">{user.score} pts</span>
                <span className="text-[10px] text-slate-400">{user.timeSpent}</span>
              </div>
            </div>
          ))}
        </div>

        <DialogFooter>
          <Button onClick={onClose} className="rounded-xl text-xs w-full">
            Close Leaderboard
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
