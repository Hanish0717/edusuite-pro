import React, { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { BadgeCheck, Sparkles, BookOpen, ShieldCheck, Clock, History, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  MOCK_STUDENT_ID_CARD,
  MOCK_ID_CARD_REQUESTS,
  MOCK_ID_CARD_HISTORY,
} from "@/components/student-id-card/mock-data";
import { DigitalIdCard } from "@/components/student-id-card/digital-id-card";
import { ActionButtonsToolbar } from "@/components/student-id-card/action-buttons";
import { RequestStatusTracker } from "@/components/student-id-card/request-status-tracker";
import { IdCardHistoryTimeline } from "@/components/student-id-card/id-card-history";
import { CorrectionModal } from "@/components/student-id-card/modals/correction-modal";
import { LostCardModal } from "@/components/student-id-card/modals/lost-card-modal";
import { ReprintModal } from "@/components/student-id-card/modals/reprint-modal";
import { IdCardRequest } from "@/components/student-id-card/types";

export const Route = createFileRoute("/student/id-card")({
  head: () => ({
    meta: [{ title: "Student ID Card Management — EduSuite Pro" }],
  }),
  component: StudentIdCardPage,
});

function StudentIdCardPage() {
  const [cardData, setCardData] = useState(MOCK_STUDENT_ID_CARD);
  const [requests, setRequests] = useState<IdCardRequest[]>(MOCK_ID_CARD_REQUESTS);
  const [history, setHistory] = useState(MOCK_ID_CARD_HISTORY);

  // Modals state
  const [correctionModalOpen, setCorrectionModalOpen] = useState(false);
  const [lostModalOpen, setLostModalOpen] = useState(false);
  const [reprintModalOpen, setReprintModalOpen] = useState(false);

  const handleAddRequest = (newReq: IdCardRequest) => {
    setRequests((prev) => [newReq, ...prev]);

    // Add corresponding history log entry
    const newHist = {
      id: `hist-${Date.now()}`,
      title: `${newReq.requestType} Submitted`,
      date: newReq.submittedDate,
      actor: "Student (Sai Teja Varma)",
      statusBadge: "Pending Librarian Review",
      description: newReq.details,
    };
    setHistory((prev) => [newHist, ...prev]);
  };

  const statusBadgeColors = {
    Active: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    Lost: "bg-rose-500/10 text-rose-600 border-rose-500/20",
    "Under Verification": "bg-amber-500/10 text-amber-600 border-amber-500/20",
    Reprinting: "bg-purple-500/10 text-purple-600 border-purple-500/20",
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      
      {/* 1. PAGE HEADER */}
      <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-blue-600/10 text-blue-600">
              <BadgeCheck className="h-6 w-6" />
            </div>
            <h1 className="text-2xl font-bold font-display text-slate-900 dark:text-white">
              Student ID Card
            </h1>
            <Badge className={statusBadgeColors[cardData.status] || "bg-emerald-500/10 text-emerald-600"}>
              ✅ {cardData.status}
            </Badge>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xl">
            View, download, manage and request updates for your official college identity card.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-2xl border border-slate-200/80 dark:border-slate-800 text-xs">
          <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
          <div>
            <span className="font-bold text-slate-800 dark:text-slate-200 block">Verified Student Identity</span>
            <span className="text-[11px] text-slate-500">Roll No: {cardData.rollNumber} &middot; {cardData.departmentCode}</span>
          </div>
        </div>
      </div>

      {/* 2. ACTION BUTTONS TOOLBAR */}
      <ActionButtonsToolbar
        onViewIdCard={() => {
          // Scroll or focus on card
          const cardEl = document.getElementById("digital-id-card-view");
          cardEl?.scrollIntoView({ behavior: "smooth" });
        }}
        onOpenLostModal={() => setLostModalOpen(true)}
        onOpenCorrectionModal={() => setCorrectionModalOpen(true)}
        onOpenReprintModal={() => setReprintModalOpen(true)}
        student={cardData}
      />

      {/* 3. MAIN SECTION: DIGITAL ID CARD & REQUEST WORKFLOW TRACKER */}
      <div id="digital-id-card-view" className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT (5 COLS): DIGITAL ID PASS DISPLAY */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <BadgeCheck className="h-4 w-4 text-blue-600" /> Digital Identity Pass
            </h3>
            <p className="text-xs text-slate-500">
              Interactive 3D identity card simulator. Flip to view emergency contacts & instructions.
            </p>
          </div>

          <DigitalIdCard cardData={cardData} />
        </div>

        {/* RIGHT (7 COLS): REQUEST WORKFLOW & HISTORY */}
        <div className="lg:col-span-7 space-y-6">
          <RequestStatusTracker requests={requests} />
          <IdCardHistoryTimeline history={history} />
        </div>

      </div>

      {/* 4. MODALS */}
      <CorrectionModal
        open={correctionModalOpen}
        onOpenChange={setCorrectionModalOpen}
        onSubmitRequest={handleAddRequest}
        student={cardData}
      />

      <LostCardModal
        open={lostModalOpen}
        onOpenChange={setLostModalOpen}
        onSubmitRequest={handleAddRequest}
        student={cardData}
      />

      <ReprintModal
        open={reprintModalOpen}
        onOpenChange={setReprintModalOpen}
        onSubmitRequest={handleAddRequest}
        student={cardData}
      />

    </div>
  );
}
