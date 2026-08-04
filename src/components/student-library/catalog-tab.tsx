import React, { useState, useMemo } from "react";
import { BookItem, CatalogFilterState } from "./types";
import {
  Search,
  SlidersHorizontal,
  RefreshCw,
  BookOpen,
  CheckCircle2,
  XCircle,
  Building2,
  Tag,
  Hash,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface CatalogTabProps {
  books: BookItem[];
}

export function CatalogTab({ books }: CatalogTabProps) {
  const [filters, setFilters] = useState<CatalogFilterState>({
    searchQuery: "",
    department: "All",
    subject: "All",
    availability: "All",
    bookType: "All",
    category: "All",
  });

  // Filter computation - search across name, author, isbn, call number, subject, department, category
  const filteredBooks = useMemo(() => {
    return books.filter((book) => {
      if (filters.searchQuery.trim()) {
        const query = filters.searchQuery.toLowerCase();
        const matchTitle = book.title.toLowerCase().includes(query);
        const matchAuthor = book.author.toLowerCase().includes(query);
        const matchIsbn = book.isbn.toLowerCase().includes(query);
        const matchCallNo = (book.callNumber || "").toLowerCase().includes(query);
        const matchId = book.id.toLowerCase().includes(query);
        const matchSubject = book.subject.toLowerCase().includes(query);
        const matchDepartment = book.department.toLowerCase().includes(query);
        const matchCategory = book.category.toLowerCase().includes(query);

        if (
          !matchTitle &&
          !matchAuthor &&
          !matchIsbn &&
          !matchCallNo &&
          !matchId &&
          !matchSubject &&
          !matchDepartment &&
          !matchCategory
        ) {
          return false;
        }
      }

      // Department Filter
      if (filters.department !== "All" && book.department !== filters.department) {
        return false;
      }

      // Availability Filter
      if (filters.availability !== "All") {
        const isAvail = book.status === "Available" && book.availableCopies > 0;
        if (filters.availability === "Available" && !isAvail) return false;
        if (filters.availability === "Not Available" && isAvail) return false;
      }

      // Book Type Filter
      if (filters.bookType !== "All" && book.bookType !== filters.bookType) {
        return false;
      }

      return true;
    });
  }, [books, filters]);

  const departments = Array.from(new Set(books.map((b) => b.department)));

  const handleResetFilters = () => {
    setFilters({
      searchQuery: "",
      department: "All",
      subject: "All",
      availability: "All",
      bookType: "All",
      category: "All",
    });
  };

  return (
    <div className="space-y-6">
      {/* SEARCH AND FILTERS BAR */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              value={filters.searchQuery}
              onChange={(e) => setFilters((prev) => ({ ...prev, searchQuery: e.target.value }))}
              placeholder="Search by Book Name, Author, ISBN, Call Number, or Accession No..."
              className="pl-10 h-10 rounded-xl border-slate-200 dark:border-slate-800 text-xs shadow-2xs"
            />
            {filters.searchQuery && (
              <button
                onClick={() => setFilters((prev) => ({ ...prev, searchQuery: "" }))}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
              >
                Clear
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              onClick={handleResetFilters}
              variant="outline"
              size="sm"
              className="rounded-xl text-xs h-10 gap-1.5 border-slate-200 text-slate-600 dark:text-slate-300"
            >
              <RefreshCw className="h-3.5 w-3.5" /> Reset Filters
            </Button>
          </div>
        </div>

        {/* FILTERS & STATUS SELECTORS */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-bold text-slate-500 text-[11px] uppercase tracking-wider flex items-center gap-1">
              <SlidersHorizontal className="h-3.5 w-3.5" /> Filters:
            </span>

            {/* Book Type */}
            <div className="flex gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
              {["All", "Hard Copy", "E-Book"].map((type) => (
                <button
                  key={type}
                  onClick={() => setFilters((prev) => ({ ...prev, bookType: type }))}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                    filters.bookType === type
                      ? "bg-white dark:bg-slate-900 text-purple-600 shadow-2xs"
                      : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>

            {/* Availability */}
            <div className="flex gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
              {["All", "Available", "Not Available"].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilters((prev) => ({ ...prev, availability: status }))}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                    filters.availability === status
                      ? "bg-white dark:bg-slate-900 text-purple-600 shadow-2xs"
                      : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>

            {/* Department Selector */}
            <select
              value={filters.department}
              onChange={(e) => setFilters((prev) => ({ ...prev, department: e.target.value }))}
              className="h-8 px-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-700 dark:text-slate-300"
            >
              <option value="All">All Departments</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

          <span className="font-mono text-xs font-bold text-slate-500">
            Showing <strong className="text-purple-600">{filteredBooks.length}</strong> of {books.length} Titles
          </span>
        </div>
      </div>

      {/* BOOKS CATALOG GRID - PURE AVAILABILITY LOOKUP */}
      {filteredBooks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredBooks.map((book) => {
            const isAvailable = book.status === "Available" && book.availableCopies > 0;

            return (
              <div
                key={book.id}
                className="p-4.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  {/* Top Cover & Essential Metadata */}
                  <div className="flex gap-3.5">
                    <div className="relative w-24 h-32 rounded-xl overflow-hidden shadow-sm bg-slate-100 shrink-0">
                      <img
                        src={book.coverImage}
                        alt={book.title}
                        className="w-full h-full object-cover"
                      />
                      <Badge
                        className={`absolute top-1 left-1 text-[9px] font-bold px-1.5 py-0.5 rounded-md ${
                          book.bookType === "E-Book"
                            ? "bg-indigo-600 text-white"
                            : "bg-amber-600 text-white"
                        }`}
                      >
                        {book.bookType}
                      </Badge>
                    </div>

                    <div className="flex-1 space-y-1 min-w-0">
                      {/* Availability Badge */}
                      {isAvailable ? (
                        <Badge className="bg-emerald-500/10 text-emerald-700 border border-emerald-300 dark:text-emerald-400 text-[10px] font-bold gap-1 px-2 py-0.5">
                          <CheckCircle2 className="h-3 w-3 text-emerald-600 shrink-0" /> Available in Library
                        </Badge>
                      ) : (
                        <Badge className="bg-rose-500/10 text-rose-700 border border-rose-300 dark:text-rose-400 text-[10px] font-bold gap-1 px-2 py-0.5">
                          <XCircle className="h-3 w-3 text-rose-600 shrink-0" /> Book is currently unavailable.
                        </Badge>
                      )}

                      <h3 className="font-black text-sm text-slate-900 dark:text-white line-clamp-2 mt-1">
                        {book.title}
                      </h3>
                      <p className="text-xs text-slate-600 dark:text-slate-300 font-medium truncate">
                        Author: <strong className="text-slate-900 dark:text-white">{book.author}</strong>
                      </p>
                      <p className="text-[11px] text-slate-400 font-mono">ISBN: {book.isbn}</p>
                    </div>
                  </div>

                  {/* READ ONLY METADATA & LOCATION BOX */}
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-2 text-[11px] font-mono">
                    <div>
                      <span className="text-slate-400 text-[9px] block uppercase font-sans">Copies Available</span>
                      <strong className={`text-xs ${isAvailable ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600"}`}>
                        {book.availableCopies} / {book.totalCopies}
                      </strong>
                    </div>

                    <div>
                      <span className="text-slate-400 text-[9px] block uppercase font-sans">Rack & Shelf</span>
                      <strong className="text-purple-600 dark:text-purple-400 text-xs truncate block">
                        {book.rackNumber} • {book.shelfNumber}
                      </strong>
                    </div>

                    <div>
                      <span className="text-slate-400 text-[9px] block uppercase font-sans">Library Section</span>
                      <strong className="text-slate-700 dark:text-slate-300 text-xs truncate block">
                        {book.category} ({book.department})
                      </strong>
                    </div>

                    <div>
                      <span className="text-slate-400 text-[9px] block uppercase font-sans">Call Number</span>
                      <strong className="text-indigo-600 dark:text-indigo-400 text-xs truncate block">
                        {book.callNumber || "005.43 SIL/O"}
                      </strong>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-12 text-center rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3">
          <BookOpen className="h-10 w-10 text-slate-400 mx-auto" />
          <h4 className="font-bold text-sm text-slate-700 dark:text-slate-300">Book is currently unavailable.</h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto font-medium">
            No library resources matched your search query or criteria. Please refine your query or contact the circulation counter.
          </p>
          <Button
            onClick={handleResetFilters}
            variant="outline"
            className="rounded-xl text-xs font-bold"
          >
            Reset Search & Filters
          </Button>
        </div>
      )}
    </div>
  );
}
