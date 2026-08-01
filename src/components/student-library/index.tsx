import React, { useState } from "react";
import { 
  mockSummaryMetrics, 
  mockIssuedBooks, 
  mockReservedBooks, 
  mockFineRecords, 
  mockBorrowHistory, 
  mockDigitalResources, 
  mock500Books 
} from "./mock-data";
import { SummaryCards } from "./summary-cards";
import { OverviewTab } from "./overview-tab";
import { CatalogTab } from "./catalog-tab";
import { IssuedTab } from "./issued-tab";
import { HistoryTab } from "./history-tab";
import { ReservationTab } from "./reservation-tab";
import { DigitalResourcesTab } from "./digital-resources-tab";
import { FineTab } from "./fine-tab";
import { LibraryRightSidebar } from "./sidebar";

// Modals
import { BookDetailsModal } from "./modals/book-modal";
import { RenewModal } from "./modals/renew-modal";
import { ReserveModal } from "./modals/reserve-modal";
import { FinePaymentModal } from "./modals/fine-payment-modal";
import { LibraryCardModal } from "./modals/library-card-modal";
import { ResourcePreviewModal } from "./modals/preview-modal";

import { 
  BookOpen, 
  Search, 
  RefreshCw, 
  History, 
  BookmarkCheck, 
  Globe, 
  CreditCard, 
  Layers, 
  Download, 
  Home, 
  ChevronRight 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { BookItem, IssuedBookItem, FineRecordItem, DigitalResourceItem } from "./types";
import { toast } from "sonner";

export function StudentLibraryModule() {
  const [activeTab, setActiveTab] = useState("overview");

  // Datasets State
  const [issuedBooks, setIssuedBooks] = useState(mockIssuedBooks);
  const [reservedBooks, setReservedBooks] = useState(mockReservedBooks);
  const [fines, setFines] = useState(mockFineRecords);

  // Modal States
  const [selectedBookModal, setSelectedBookModal] = useState<BookItem | null>(null);
  const [selectedRenewModal, setSelectedRenewModal] = useState<IssuedBookItem | null>(null);
  const [selectedReserveModal, setSelectedReserveModal] = useState<BookItem | null>(null);
  const [selectedFineModal, setSelectedFineModal] = useState<FineRecordItem | null>(null);
  const [libraryCardModalOpen, setLibraryCardModalOpen] = useState(false);
  const [previewResourceModal, setPreviewResourceModal] = useState<DigitalResourceItem | null>(null);

  // Actions
  const handleConfirmRenew = (issuedId: string) => {
    setIssuedBooks((prev) =>
      prev.map((b) =>
        b.id === issuedId
          ? {
              ...b,
              renewalsCount: b.renewalsCount + 1,
              dueDate: "2026-08-19",
              daysRemaining: 14,
            }
          : b
      )
    );
  };

  const handleConfirmReserve = (book: BookItem) => {
    const newRes = {
      id: `RES-${Date.now()}`,
      bookId: book.id,
      title: book.title,
      author: book.author,
      reservedDate: new Date().toISOString().split("T")[0],
      queuePosition: 3,
      availabilityDate: "2026-08-09",
      status: "In Queue" as const,
    };
    setReservedBooks((prev) => [newRes, ...prev]);
  };

  const handleCancelReservation = (resId: string) => {
    setReservedBooks((prev) => prev.filter((r) => r.id !== resId));
  };

  const handleConfirmFinePayment = (fineId: string) => {
    setFines((prev) =>
      prev.map((f) =>
        f.id === fineId ? { ...f, status: "Paid" as const, transactionId: `TXN-LIB-${Date.now()}` } : f
      )
    );
  };

  const handleOpenBookDetailsById = (bookId: string) => {
    const found = mock500Books.find((b) => b.id === bookId) || mock500Books[0];
    setSelectedBookModal(found);
  };

  const pendingFines = fines.filter((f) => f.status === "Pending");

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-[1600px] mx-auto min-h-screen">
      {/* PAGE HEADER */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-4 border-slate-200 dark:border-slate-800">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
              Library (OPAC)
            </h1>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Search books, manage issued books, digital resources and library services.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              onClick={() => setActiveTab("catalog")}
              className="rounded-xl text-xs bg-purple-600 hover:bg-purple-700 text-white font-bold h-9 gap-1.5 shadow-sm"
            >
              <Search className="h-4 w-4" /> Search Catalogue
            </Button>
            <Button
              onClick={() => {
                toast.success("Library catalogue database synced!");
              }}
              variant="outline"
              className="rounded-xl text-xs font-semibold h-9 gap-1.5"
            >
              <RefreshCw className="h-4 w-4 text-slate-500" /> Refresh
            </Button>
          </div>
        </div>
      </div>

      {/* TOP SUMMARY CARDS */}
      <SummaryCards metrics={mockSummaryMetrics} />

      {/* MAIN CONTENT + RIGHT SIDEBAR GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* LEFT MAIN MODULE AREA (3 COLS) */}
        <div className="lg:col-span-3 space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-5">
            <TabsList className="flex flex-wrap h-auto p-1 bg-slate-100 dark:bg-slate-800/60 rounded-xl gap-1 border border-slate-200 dark:border-slate-800">
              <TabsTrigger
                value="overview"
                className="rounded-lg text-xs font-bold py-2 px-3 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:text-purple-600 shadow-2xs gap-1.5"
              >
                <BookOpen className="h-3.5 w-3.5" /> Overview
              </TabsTrigger>

              <TabsTrigger
                value="catalog"
                className="rounded-lg text-xs font-bold py-2 px-3 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:text-purple-600 shadow-2xs gap-1.5"
              >
                <Search className="h-3.5 w-3.5" /> Book Catalog (500)
              </TabsTrigger>

              <TabsTrigger
                value="issued"
                className="rounded-lg text-xs font-bold py-2 px-3 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:text-purple-600 shadow-2xs gap-1.5"
              >
                <Layers className="h-3.5 w-3.5" /> Issued ({issuedBooks.length})
              </TabsTrigger>

              <TabsTrigger
                value="history"
                className="rounded-lg text-xs font-bold py-2 px-3 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:text-purple-600 shadow-2xs gap-1.5"
              >
                <History className="h-3.5 w-3.5" /> History (30)
              </TabsTrigger>

              <TabsTrigger
                value="reservations"
                className="rounded-lg text-xs font-bold py-2 px-3 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:text-purple-600 shadow-2xs gap-1.5"
              >
                <BookmarkCheck className="h-3.5 w-3.5" /> Holds ({reservedBooks.length})
              </TabsTrigger>

              <TabsTrigger
                value="digital"
                className="rounded-lg text-xs font-bold py-2 px-3 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:text-purple-600 shadow-2xs gap-1.5"
              >
                <Globe className="h-3.5 w-3.5" /> Digital Repository (150)
              </TabsTrigger>

              <TabsTrigger
                value="fines"
                className="rounded-lg text-xs font-bold py-2 px-3 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:text-rose-600 shadow-2xs gap-1.5"
              >
                <CreditCard className="h-3.5 w-3.5" /> Fines ({pendingFines.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <OverviewTab
                issuedBooks={issuedBooks}
                reservedBooks={reservedBooks}
                pendingFines={pendingFines}
                onOpenRenewModal={(b) => setSelectedRenewModal(b)}
                onOpenBookDetails={(id) => handleOpenBookDetailsById(id)}
                onOpenFineModal={(f) => setSelectedFineModal(f)}
                onSwitchTab={setActiveTab}
              />
            </TabsContent>

            <TabsContent value="catalog">
              <CatalogTab
                books={mock500Books}
                onOpenBookDetails={(b) => setSelectedBookModal(b)}
                onOpenReserveModal={(b) => setSelectedReserveModal(b)}
              />
            </TabsContent>

            <TabsContent value="issued">
              <IssuedTab
                issuedBooks={issuedBooks}
                onOpenRenewModal={(b) => setSelectedRenewModal(b)}
                onOpenBookDetails={(id) => handleOpenBookDetailsById(id)}
              />
            </TabsContent>

            <TabsContent value="history">
              <HistoryTab history={mockBorrowHistory} />
            </TabsContent>

            <TabsContent value="reservations">
              <ReservationTab
                reservations={reservedBooks}
                onCancelReservation={handleCancelReservation}
              />
            </TabsContent>

            <TabsContent value="digital">
              <DigitalResourcesTab
                resources={mockDigitalResources}
                onPreviewResource={(r) => setPreviewResourceModal(r)}
              />
            </TabsContent>

            <TabsContent value="fines">
              <FineTab
                fines={fines}
                onOpenFinePaymentModal={(f) => setSelectedFineModal(f)}
              />
            </TabsContent>
          </Tabs>
        </div>

        {/* RIGHT SIDEBAR (1 COL) */}
        <div className="lg:col-span-1">
          <LibraryRightSidebar
            onOpenLibraryCard={() => setLibraryCardModalOpen(true)}
            onSelectQuickAction={(action) => {
              if (action === "search") setActiveTab("catalog");
              if (action === "fines") setActiveTab("fines");
              if (action === "digital") setActiveTab("digital");
            }}
          />
        </div>
      </div>

      {/* ALL MODALS */}
      <BookDetailsModal
        book={selectedBookModal}
        onClose={() => setSelectedBookModal(null)}
        onReserve={(b) => setSelectedReserveModal(b)}
      />

      <RenewModal
        book={selectedRenewModal}
        onClose={() => setSelectedRenewModal(null)}
        onConfirmRenew={(id) => handleConfirmRenew(id)}
      />

      <ReserveModal
        book={selectedReserveModal}
        onClose={() => setSelectedReserveModal(null)}
        onConfirmReserve={handleConfirmReserve}
      />

      <FinePaymentModal
        fine={selectedFineModal}
        onClose={() => setSelectedFineModal(null)}
        onConfirmPayment={handleConfirmFinePayment}
      />

      <LibraryCardModal
        open={libraryCardModalOpen}
        onClose={() => setLibraryCardModalOpen(false)}
      />

      <ResourcePreviewModal
        resource={previewResourceModal}
        onClose={() => setPreviewResourceModal(null)}
      />
    </div>
  );
}
