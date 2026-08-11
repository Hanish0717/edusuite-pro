// =============================================================================
// LIBRARY MODULE V2 MAIN REACT HOOK
// =============================================================================

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { RepositoryFactory } from "../repositories/RepositoryFactory";
import { LibraryValidator } from "../validators/LibraryValidator";
import { LibraryEvents } from "../events/LibraryEvents";
import { Book, LibraryMember, IssueRecord, FineRecord, BookIssuePayload, BookReturnPayload } from "../types";

export function useLibrary() {
  const repository = RepositoryFactory.getRepository(true);

  const [books, setBooks] = useState<Book[]>([]);
  const [members, setMembers] = useState<LibraryMember[]>([]);
  const [issues, setIssues] = useState<IssueRecord[]>([]);
  const [fines, setFines] = useState<FineRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All Categories");

  const loadData = async () => {
    try {
      setLoading(true);
      const [fetchedBooks, fetchedMembers, fetchedIssues, fetchedFines] = await Promise.all([
        repository.getBooks(),
        repository.getMembers(),
        repository.getIssueRecords(),
        repository.getFineRecords(),
      ]);
      setBooks(fetchedBooks);
      setMembers(fetchedMembers);
      setIssues(fetchedIssues);
      setFines(fetchedFines);
    } catch (error) {
      toast.error("Failed to load Library data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleIssueBook = async (payload: BookIssuePayload) => {
    const { isValid, errors } = LibraryValidator.validateIssuePayload(payload);
    if (!isValid) {
      errors.forEach((err) => toast.error(err));
      return false;
    }

    try {
      const newIssue = await repository.issueBook(payload.bookId, payload.memberId, payload.dueDate);
      setIssues((prev) => [newIssue, ...prev]);
      LibraryEvents.publish("library:book_issued", {
        issueId: newIssue.id,
        bookId: payload.bookId,
        memberId: payload.memberId,
        dueDate: payload.dueDate,
      });
      toast.success("Book issued successfully!");
      await loadData();
      return true;
    } catch (error: any) {
      toast.error(error.message || "Failed to issue book.");
      return false;
    }
  };

  const handleReturnBook = async (payload: BookReturnPayload) => {
    const { isValid, errors } = LibraryValidator.validateReturnPayload(payload);
    if (!isValid) {
      errors.forEach((err) => toast.error(err));
      return false;
    }

    try {
      const updatedIssue = await repository.returnBook(payload.issueId, payload.returnCondition, payload.fineAmount);
      setIssues((prev) => prev.map((item) => (item.id === payload.issueId ? updatedIssue : item)));
      LibraryEvents.publish("library:book_returned", {
        issueId: payload.issueId,
        bookId: updatedIssue.bookId,
        returnDate: new Date().toISOString(),
        fineAmount: payload.fineAmount || 0,
      });
      toast.success("Book returned successfully!");
      await loadData();
      return true;
    } catch (error: any) {
      toast.error(error.message || "Failed to return book.");
      return false;
    }
  };

  const filteredBooks = books.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.accessionNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.isbn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.authors.some((a) => a.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === "All Categories" || book.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return {
    books: filteredBooks,
    allBooks: books,
    members,
    issues,
    fines,
    loading,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    issueBook: handleIssueBook,
    returnBook: handleReturnBook,
    refresh: loadData,
  };
}
