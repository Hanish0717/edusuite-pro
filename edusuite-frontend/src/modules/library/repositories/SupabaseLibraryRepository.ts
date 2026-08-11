// =============================================================================
// SUPABASE LIBRARY REPOSITORY IMPLEMENTATION
// =============================================================================

import { LibraryRepository } from "./LibraryRepository";
import { MockLibraryRepository } from "./MockLibraryRepository";
import { Book, LibraryMember, IssueRecord, FineRecord } from "../types";

export class SupabaseLibraryRepository implements LibraryRepository {
  private fallback: MockLibraryRepository = new MockLibraryRepository();

  async getBooks(): Promise<Book[]> {
    return this.fallback.getBooks();
  }

  async getBookById(id: string): Promise<Book | null> {
    return this.fallback.getBookById(id);
  }

  async createBook(book: Omit<Book, "id" | "addedAt" | "updatedAt">): Promise<Book> {
    return this.fallback.createBook(book);
  }

  async updateBook(id: string, updates: Partial<Book>): Promise<Book> {
    return this.fallback.updateBook(id, updates);
  }

  async getMembers(): Promise<LibraryMember[]> {
    return this.fallback.getMembers();
  }

  async getMemberById(id: string): Promise<LibraryMember | null> {
    return this.fallback.getMemberById(id);
  }

  async getIssueRecords(): Promise<IssueRecord[]> {
    return this.fallback.getIssueRecords();
  }

  async issueBook(bookId: string, memberId: string, dueDate: string): Promise<IssueRecord> {
    return this.fallback.issueBook(bookId, memberId, dueDate);
  }

  async returnBook(issueId: string, condition: string, fineAmount?: number): Promise<IssueRecord> {
    return this.fallback.returnBook(issueId, condition, fineAmount);
  }

  async getFineRecords(): Promise<FineRecord[]> {
    return this.fallback.getFineRecords();
  }

  async payFine(fineId: string, amount: number, mode: string): Promise<FineRecord> {
    return this.fallback.payFine(fineId, amount, mode);
  }
}
