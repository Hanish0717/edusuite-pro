// =============================================================================
// LIBRARY MODULE V2 TYPES
// =============================================================================

export * from "../LibraryTypes";

export interface LibraryModuleState {
  activeTab: "overview" | "catalog" | "circulation" | "members" | "fines" | "reading-hall";
  searchQuery: string;
  selectedCategory: string;
  isAddBookModalOpen: boolean;
  isIssueModalOpen: boolean;
  isReturnModalOpen: boolean;
  selectedBookId: string | null;
  selectedMemberId: string | null;
}

export interface BookIssuePayload {
  bookId: string;
  memberId: string;
  dueDate: string;
  notes?: string;
}

export interface BookReturnPayload {
  issueId: string;
  returnCondition: "Good" | "Damaged" | "Lost";
  fineAmount?: number;
  waiveFine?: boolean;
  remarks?: string;
}

export interface FinePaymentPayload {
  fineId: string;
  amountPaid: number;
  paymentMode: "Cash" | "Online" | "UPI" | "Card";
  transactionRef?: string;
}
