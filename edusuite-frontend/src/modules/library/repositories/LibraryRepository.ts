// =============================================================================
// LIBRARY MODULE V2 REPOSITORY CONTRACT INTERFACE
// =============================================================================

import { Book, LibraryMember, IssueRecord, FineRecord } from "../types";

export interface LibraryRepository {
  getBooks(): Promise<Book[]>;
  getBookById(id: string): Promise<Book | null>;
  createBook(book: Omit<Book, "id" | "addedAt" | "updatedAt">): Promise<Book>;
  updateBook(id: string, updates: Partial<Book>): Promise<Book>;
  
  getMembers(): Promise<LibraryMember[]>;
  getMemberById(id: string): Promise<LibraryMember | null>;
  
  getIssueRecords(): Promise<IssueRecord[]>;
  issueBook(bookId: string, memberId: string, dueDate: string): Promise<IssueRecord>;
  returnBook(issueId: string, condition: string, fineAmount?: number): Promise<IssueRecord>;
  
  getFineRecords(): Promise<FineRecord[]>;
  payFine(fineId: string, amount: number, mode: string): Promise<FineRecord>;
}
