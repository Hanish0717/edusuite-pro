import React, { useState, useMemo } from "react";
import { BookItem, CatalogFilterState } from "./types";
import { 
  Search, 
  Filter, 
  MapPin, 
  BookOpen, 
  BookmarkCheck, 
  CheckCircle2, 
  X, 
  RotateCcw, 
  Layers, 
  Calendar 
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface CatalogTabProps {
  books: BookItem[];
  onOpenBookDetails: (book: BookItem) => void;
  onOpenReserveModal: (book: BookItem) => void;
}

export function CatalogTab({ books, onOpenBookDetails, onOpenReserveModal }: CatalogTabProps) {
  const [filters, setFilters] = useState<CatalogFilterState>({
    searchQuery: "",
    department: "All",
    semester: "All",
    availability: "All",
    category: "All",
    language: "All",
    publicationYear: "All",
  });

  const [visibleCount, setVisibleCount] = useState(24);

  const filteredBooks = useMemo(() => {
    return books.filter((b) => {
      // Search
      const query = filters.searchQuery.toLowerCase().trim();
      if (query) {
        const matchesSearch =
          b.title.toLowerCase().includes(query) ||
          b.author.toLowerCase().includes(query) ||
          b.isbn.toLowerCase().includes(query) ||
          b.publisher.toLowerCase().includes(query) ||
          b.category.toLowerCase().includes(query) ||
          b.rackNumber.toLowerCase().includes(query);
        if (!matchesSearch) return false;
      }

      // Department / Category
      if (filters.department !== "All" && b.department !== filters.department) return false;
      if (filters.category !== "All" && b.category !== filters.category) return false;

      // Availability
      if (filters.availability !== "All" && b.status !== filters.availability) return false;

      // Language
      if (filters.language !== "All" && !b.language.includes(filters.language)) return false;

      return true;
    });
  }, [books, filters]);

  const resetFilters = () => {
    setFilters({
      searchQuery: "",
      department: "All",
      semester: "All",
      availability: "All",
      category: "All",
      language: "All",
      publicationYear: "All",
    });
  };

  return (
    <div className="space-y-6">
      {/* SEARCH BAR & FILTER ROW */}
      <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              value={filters.searchQuery}
              onChange={(e) => setFilters((prev) => ({ ...prev, searchQuery: e.target.value }))}
              placeholder="Search by Book Name, ISBN, Author, Publisher, Category or Rack Number..."
              className="pl-10 h-11 rounded-xl border-slate-200 dark:border-slate-800 text-xs focus-visible:ring-purple-500 font-medium"
            />
            {filters.searchQuery && (
              <button
                onClick={() => setFilters((prev) => ({ ...prev, searchQuery: "" }))}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <Button
            onClick={resetFilters}
            variant="outline"
            className="rounded-xl h-11 text-xs font-semibold gap-1.5 shrink-0"
          >
            <RotateCcw className="h-4 w-4 text-slate-500" /> Reset Filters
          </Button>
        </div>

        {/* FILTERS SELECTORS */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3 pt-1">
          {/* Department Filter */}
          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Department
            </label>
            <select
              value={filters.department}
              onChange={(e) => setFilters((prev) => ({ ...prev, department: e.target.value }))}
              className="w-full h-9 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs px-2.5 font-medium text-slate-800 dark:text-slate-200"
            >
              <option value="All">All Departments</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Electronics & Comm">Electronics & Comm</option>
              <option value="Mechanical Engineering">Mechanical Engineering</option>
              <option value="Civil Engineering">Civil Engineering</option>
              <option value="Artificial Intelligence">AI & Data Science</option>
              <option value="Management">Management</option>
            </select>
          </div>

          {/* Availability Filter */}
          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Availability
            </label>
            <select
              value={filters.availability}
              onChange={(e) => setFilters((prev) => ({ ...prev, availability: e.target.value }))}
              className="w-full h-9 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs px-2.5 font-medium text-slate-800 dark:text-slate-200"
            >
              <option value="All">All Statuses</option>
              <option value="Available">Available Now</option>
              <option value="Issued">Currently Issued</option>
              <option value="Reserved">Reserved</option>
              <option value="Reference Only">Reference Only</option>
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Category
            </label>
            <select
              value={filters.category}
              onChange={(e) => setFilters((prev) => ({ ...prev, category: e.target.value }))}
              className="w-full h-9 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs px-2.5 font-medium text-slate-800 dark:text-slate-200"
            >
              <option value="All">All Categories</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Artificial Intelligence">Artificial Intelligence</option>
              <option value="Data Science">Data Science</option>
              <option value="Electronics">Electronics</option>
              <option value="Mathematics">Mathematics</option>
              <option value="Physics">Physics</option>
            </select>
          </div>

          {/* Language Filter */}
          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Language
            </label>
            <select
              value={filters.language}
              onChange={(e) => setFilters((prev) => ({ ...prev, language: e.target.value }))}
              className="w-full h-9 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs px-2.5 font-medium text-slate-800 dark:text-slate-200"
            >
              <option value="All">All Languages</option>
              <option value="English">English</option>
              <option value="German">German / English</option>
            </select>
          </div>

          {/* Results Counter */}
          <div className="flex flex-col justify-end">
            <span className="text-[11px] font-mono text-purple-600 font-bold bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-900/40 p-2 rounded-xl text-center">
              Showing {filteredBooks.length} / 500 Books
            </span>
          </div>
        </div>
      </div>

      {/* CATALOG GRID CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredBooks.slice(0, visibleCount).map((book) => (
          <div
            key={book.id}
            className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs hover:shadow-lg transition-all flex flex-col justify-between space-y-3 group relative overflow-hidden"
          >
            <div className="space-y-3">
              <div className="relative">
                <img
                  src={book.coverImage}
                  alt={book.title}
                  className="w-full h-44 object-cover rounded-xl shadow-xs border border-slate-200 dark:border-slate-700 group-hover:scale-102 transition-transform duration-300"
                />
                <Badge
                  className={`absolute top-2 right-2 text-[9px] font-mono shadow-md ${
                    book.status === "Available"
                      ? "bg-emerald-500 text-white"
                      : book.status === "Reserved"
                      ? "bg-amber-500 text-white"
                      : "bg-rose-500 text-white"
                  }`}
                >
                  {book.status}
                </Badge>
              </div>

              <div>
                <Badge variant="outline" className="text-[9px] font-mono text-purple-600 border-purple-200 mb-1">
                  {book.category}
                </Badge>
                <h4 className="font-black text-xs text-slate-900 dark:text-white line-clamp-2 leading-snug group-hover:text-purple-600 transition-colors">
                  {book.title}
                </h4>
                <p className="text-[11px] text-slate-500 truncate mt-0.5">{book.author}</p>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-1 text-[10px] font-mono">
                <div className="flex justify-between text-slate-500">
                  <span>Rack Location:</span>
                  <strong className="text-purple-600 flex items-center gap-0.5">
                    <MapPin className="h-2.5 w-2.5" /> {book.rackNumber}
                  </strong>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>ISBN:</span>
                  <strong className="text-slate-800 dark:text-slate-200 truncate max-w-[110px]">{book.isbn}</strong>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Copies Available:</span>
                  <strong className="text-emerald-600">{book.availableCopies} / {book.totalCopies}</strong>
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <Button
                onClick={() => onOpenBookDetails(book)}
                size="sm"
                variant="outline"
                className="flex-1 rounded-xl text-[11px] font-semibold h-8"
              >
                View Details
              </Button>
              {book.availableCopies > 0 ? (
                <Button
                  onClick={() => {
                    toast.success(`Checkout code generated for "${book.title}". Visit Counter 2.`);
                  }}
                  size="sm"
                  className="rounded-xl text-[11px] font-semibold h-8 bg-emerald-600 hover:bg-emerald-700 text-white gap-1"
                >
                  <CheckCircle2 className="h-3 w-3" /> Borrow
                </Button>
              ) : (
                <Button
                  onClick={() => onOpenReserveModal(book)}
                  size="sm"
                  className="rounded-xl text-[11px] font-semibold h-8 bg-purple-600 hover:bg-purple-700 text-white gap-1"
                >
                  <BookmarkCheck className="h-3 w-3" /> Reserve
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      {visibleCount < filteredBooks.length && (
        <div className="text-center pt-4">
          <Button
            onClick={() => setVisibleCount((prev) => prev + 24)}
            className="rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs px-6 h-10 shadow-md"
          >
            Load More Books ({filteredBooks.length - visibleCount} remaining)
          </Button>
        </div>
      )}
    </div>
  );
}
