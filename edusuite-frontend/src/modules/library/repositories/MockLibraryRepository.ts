// =============================================================================
// MOCK LIBRARY REPOSITORY IMPLEMENTATION
// =============================================================================

import { LibraryRepository } from "./LibraryRepository";
import { Book, LibraryMember, IssueRecord, FineRecord } from "../types";

export class MockLibraryRepository implements LibraryRepository {
  private books: Book[] = [
    {
      id: "BK-1001",
      accessionNo: "ACC-8901",
      isbn: "978-0134685991",
      title: "Effective Java",
      authors: ["Joshua Bloch"],
      publisher: "Addison-Wesley",
      publishedYear: 2018,
      edition: "3rd",
      language: "English",
      category: "Computer Science & Engineering",
      subject: "Java Programming",
      totalCopies: 10,
      availableCopies: 6,
      issuedCopies: 4,
      reservedCopies: 0,
      lostCopies: 0,
      damagedCopies: 0,
      location: { building: "Central Library", floor: "2nd Floor", rack: "CS-04", shelf: "B" },
      barcode: "890100123",
      qrCode: "QR890100123",
      callNumber: "005.133 BLO",
      price: 1250,
      status: "Active",
      source: "Acquisition",
      addedBy: "Head Librarian",
      addedAt: "2024-01-15",
      updatedAt: "2024-01-15",
      tags: ["java", "programming", "software-engineering"],
    },
    {
      id: "BK-1002",
      accessionNo: "ACC-8902",
      isbn: "978-0132350884",
      title: "Clean Code: A Handbook of Agile Software Craftsmanship",
      authors: ["Robert C. Martin"],
      publisher: "Prentice Hall",
      publishedYear: 2008,
      edition: "1st",
      language: "English",
      category: "Computer Science & Engineering",
      subject: "Software Engineering",
      totalCopies: 15,
      availableCopies: 9,
      issuedCopies: 6,
      reservedCopies: 0,
      lostCopies: 0,
      damagedCopies: 0,
      location: { building: "Central Library", floor: "2nd Floor", rack: "CS-02", shelf: "A" },
      barcode: "890100124",
      qrCode: "QR890100124",
      callNumber: "005.1 MAR",
      price: 1400,
      status: "Active",
      source: "Acquisition",
      addedBy: "Head Librarian",
      addedAt: "2024-01-18",
      updatedAt: "2024-01-18",
      tags: ["clean-code", "refactoring"],
    },
  ];

  private members: LibraryMember[] = [];
  private issues: IssueRecord[] = [];
  private fines: FineRecord[] = [];

  async getBooks(): Promise<Book[]> {
    return [...this.books];
  }

  async getBookById(id: string): Promise<Book | null> {
    return this.books.find((b) => b.id === id) || null;
  }

  async createBook(bookData: Omit<Book, "id" | "addedAt" | "updatedAt">): Promise<Book> {
    const newBook: Book = {
      ...bookData,
      id: `BK-${Date.now()}`,
      addedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.books.push(newBook);
    return newBook;
  }

  async updateBook(id: string, updates: Partial<Book>): Promise<Book> {
    const index = this.books.findIndex((b) => b.id === id);
    if (index === -1) throw new Error("Book not found");
    this.books[index] = { ...this.books[index], ...updates, updatedAt: new Date().toISOString() };
    return this.books[index];
  }

  async getMembers(): Promise<LibraryMember[]> {
    return [...this.members];
  }

  async getMemberById(id: string): Promise<LibraryMember | null> {
    return this.members.find((m) => m.id === id) || null;
  }

  async getIssueRecords(): Promise<IssueRecord[]> {
    return [...this.issues];
  }

  async issueBook(bookId: string, memberId: string, dueDate: string): Promise<IssueRecord> {
    const book = await this.getBookById(bookId);
    if (!book) throw new Error("Book not found");
    if (book.availableCopies <= 0) throw new Error("No copies available for issue");

    book.availableCopies -= 1;
    book.issuedCopies += 1;

    const issueRecord: IssueRecord = {
      id: `ISS-${Date.now()}`,
      issueNumber: `ISSUE-${Math.floor(1000 + Math.random() * 9000)}`,
      bookId: book.id,
      bookAccessionNo: book.accessionNo,
      bookTitle: book.title,
      isbn: book.isbn,
      callNumber: book.callNumber,
      copyBarcode: book.barcode,
      memberId,
      memberNumber: "MEM-001",
      memberName: "John Doe",
      memberType: "Student",
      department: "CSE",
      email: "john@institute.edu",
      phone: "9876543210",
      issueDate: new Date().toISOString().split("T")[0],
      dueDate,
      status: "Issued",
      issuedBy: "Librarian Desk",
      fineAmount: 0,
      finePaid: false,
      renewCount: 0,
      maxRenewals: 2,
    };

    this.issues.push(issueRecord);
    return issueRecord;
  }

  async returnBook(issueId: string, condition: string, fineAmount: number = 0): Promise<IssueRecord> {
    const issue = this.issues.find((i) => i.id === issueId);
    if (!issue) throw new Error("Issue record not found");

    issue.status = "Returned";
    issue.returnDate = new Date().toISOString().split("T")[0];
    issue.returnCondition = condition as any;
    issue.fineAmount = fineAmount;

    const book = await this.getBookById(issue.bookId);
    if (book) {
      book.availableCopies += 1;
      book.issuedCopies = Math.max(0, book.issuedCopies - 1);
    }

    return issue;
  }

  async getFineRecords(): Promise<FineRecord[]> {
    return [...this.fines];
  }

  async payFine(fineId: string, amount: number, mode: string): Promise<FineRecord> {
    const fine = this.fines.find((f) => f.id === fineId);
    if (!fine) throw new Error("Fine record not found");

    fine.amountPaid = (fine.amountPaid || 0) + amount;
    fine.balance = Math.max(0, fine.totalFine - fine.amountPaid);
    fine.status = fine.balance === 0 ? "Paid" : "Partially Paid";
    fine.paymentMode = mode as any;
    fine.paidAt = new Date().toISOString();

    return fine;
  }
}
