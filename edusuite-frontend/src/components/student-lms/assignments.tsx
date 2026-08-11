import React, { useState } from "react";
import { AssignmentItem } from "./types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import {
  FileCheck,
  Calendar,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  UploadCloud,
  FileText,
  CheckCircle2,
  Clock,
  ArrowUpDown,
} from "lucide-react";
import { AssignmentModal } from "./assignment-modal";

interface AssignmentsProps {
  assignments: AssignmentItem[];
  searchQuery: string;
}

export function Assignments({ assignments: initialAssignments, searchQuery }: AssignmentsProps) {
  const [assignmentsList, setAssignmentsList] = useState<AssignmentItem[]>(initialAssignments);
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [selectedAssignmentForModal, setSelectedAssignmentForModal] = useState<AssignmentItem | null>(null);
  const [detailsDrawerAssignment, setDetailsDrawerAssignment] = useState<AssignmentItem | null>(null);

  const itemsPerPage = 8;

  const handleSubmissionSuccess = (id: string) => {
    setAssignmentsList((prev) =>
      prev.map((a) =>
        a.id === id
          ? {
              ...a,
              status: "Submitted",
              submissionDate: new Date().toLocaleString(),
            }
          : a
      )
    );
  };

  const filteredAssignments = assignmentsList
    .filter((a) => {
      const matchesSearch =
        a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.courseCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.faculty.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "All" || a.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (sortOrder === "asc") return a.dueDate.localeCompare(b.dueDate);
      return b.dueDate.localeCompare(a.dueDate);
    });

  const totalPages = Math.ceil(filteredAssignments.length / itemsPerPage) || 1;
  const paginatedAssignments = filteredAssignments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-4">
      {/* STATUS CHIPS & SORT */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1.5">
          {["All", "Pending", "Submitted", "Graded", "Overdue", "In Review"].map((st) => (
            <button
              key={st}
              onClick={() => {
                setStatusFilter(st);
                setCurrentPage(1);
              }}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all ${
                statusFilter === st
                  ? "bg-purple-600 text-white shadow-xs"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        <Button
          onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
          size="sm"
          variant="outline"
          className="h-8 text-xs rounded-xl border-slate-200 dark:border-slate-700 gap-1 font-mono"
        >
          <ArrowUpDown className="h-3 w-3" /> Due Date ({sortOrder.toUpperCase()})
        </Button>
      </div>

      {/* ASSIGNMENTS TABLE */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-400 uppercase font-mono">
              <tr>
                <th className="p-3.5">Course</th>
                <th className="p-3.5">Assignment Title</th>
                <th className="p-3.5">Faculty</th>
                <th className="p-3.5">Assigned</th>
                <th className="p-3.5">Due Date</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5">Marks</th>
                <th className="p-3.5">Submission Type</th>
                <th className="p-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {paginatedAssignments.map((asg) => {
                const isPending = asg.status === "Pending";
                const isGraded = asg.status === "Graded";
                const isOverdue = asg.status === "Overdue";

                return (
                  <tr
                    key={asg.id}
                    className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="p-3.5">
                      <Badge variant="outline" className="font-mono font-bold text-purple-600 border-purple-200 text-[10px]">
                        {asg.courseCode}
                      </Badge>
                    </td>

                    <td className="p-3.5">
                      <button
                        onClick={() => setDetailsDrawerAssignment(asg)}
                        className="font-bold text-slate-900 dark:text-white hover:text-purple-600 transition-colors text-left block max-w-xs truncate"
                      >
                        {asg.title}
                      </button>
                    </td>

                    <td className="p-3.5 text-slate-500 font-medium">{asg.faculty}</td>
                    <td className="p-3.5 font-mono text-slate-400 text-[11px]">{asg.assignedDate}</td>
                    
                    <td className="p-3.5">
                      <span className={`font-mono text-[11px] font-bold ${isOverdue ? "text-rose-600" : "text-slate-700 dark:text-slate-300"}`}>
                        {asg.dueDate}
                      </span>
                    </td>

                    <td className="p-3.5">
                      <Badge
                        className={`text-[9px] px-2 py-0.5 font-mono ${
                          isGraded
                            ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                            : isPending
                            ? "bg-amber-500/10 text-amber-600 border-amber-500/20"
                            : isOverdue
                            ? "bg-rose-500/10 text-rose-600 border-rose-500/20"
                            : "bg-blue-500/10 text-blue-600 border-blue-500/20"
                        }`}
                      >
                        {asg.status}
                      </Badge>
                    </td>

                    <td className="p-3.5 font-mono font-bold text-slate-900 dark:text-white">
                      {asg.marks}
                    </td>

                    <td className="p-3.5 text-slate-500 font-mono text-[11px]">{asg.submissionType}</td>

                    <td className="p-3.5 text-right">
                      {isPending || isOverdue ? (
                        <Button
                          onClick={() => setSelectedAssignmentForModal(asg)}
                          size="sm"
                          className="h-7 text-[10px] rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-semibold gap-1"
                        >
                          <UploadCloud className="h-3 w-3" /> Submit
                        </Button>
                      ) : (
                        <Button
                          onClick={() => setDetailsDrawerAssignment(asg)}
                          size="sm"
                          variant="outline"
                          className="h-7 text-[10px] rounded-lg border-slate-200 text-slate-700 dark:text-slate-300"
                        >
                          View Details
                        </Button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* PAGINATION FOOTER */}
        <div className="p-3 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs font-mono text-slate-500">
          <span>
            Page {currentPage} of {totalPages} ({filteredAssignments.length} Assignments)
          </span>

          <div className="flex items-center gap-1">
            <Button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              size="sm"
              variant="outline"
              className="h-7 px-2 text-xs rounded-lg"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </Button>
            <Button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              size="sm"
              variant="outline"
              className="h-7 px-2 text-xs rounded-lg"
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>

      {/* ASSIGNMENT DETAILS DRAWER DIALOG */}
      {detailsDrawerAssignment && (
        <Dialog open={!!detailsDrawerAssignment} onOpenChange={() => setDetailsDrawerAssignment(null)}>
          <DialogContent className="max-w-md rounded-2xl p-6 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
            <DialogHeader className="border-b pb-3 border-slate-100 dark:border-slate-800 text-left">
              <Badge variant="outline" className="w-fit mb-1 font-mono font-bold text-purple-600 border-purple-200">
                {detailsDrawerAssignment.courseCode} • {detailsDrawerAssignment.submissionType}
              </Badge>
              <DialogTitle className="text-base font-bold">
                {detailsDrawerAssignment.title}
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500">
                Assigned by {detailsDrawerAssignment.faculty} on {detailsDrawerAssignment.assignedDate}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 my-2 text-xs text-slate-600 dark:text-slate-300">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 space-y-1 font-mono text-[11px]">
                <p>🗓️ Due Date: {detailsDrawerAssignment.dueDate}</p>
                <p>⚡ Marks Secured: {detailsDrawerAssignment.marks}</p>
                <p>📌 Status: {detailsDrawerAssignment.status}</p>
              </div>

              <div className="space-y-1">
                <span className="font-bold text-slate-900 dark:text-white">Instructions:</span>
                <p className="leading-relaxed">{detailsDrawerAssignment.instructions}</p>
              </div>

              {detailsDrawerAssignment.gradeFeedback && (
                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 space-y-1">
                  <span className="font-bold block">Faculty Feedback:</span>
                  <p className="text-[11px]">{detailsDrawerAssignment.gradeFeedback}</p>
                </div>
              )}
            </div>

            <DialogFooter>
              <Button onClick={() => setDetailsDrawerAssignment(null)} className="rounded-xl text-xs w-full">
                Close Drawer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* SUBMISSION MODAL */}
      <AssignmentModal
        assignment={selectedAssignmentForModal}
        onClose={() => setSelectedAssignmentForModal(null)}
        onSubmitSuccess={handleSubmissionSuccess}
      />
    </div>
  );
}
