import React from "react";
import { BookItem } from "../types";
import { X, MapPin, BookOpen, Download, BookmarkCheck, Heart, Building2, Layers, Calendar, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface BookDetailsModalProps {
  book: BookItem | null;
  onClose: () => void;
  onLocateBook: (book: BookItem) => void;
  onReadEBook: (book: BookItem) => void;
  onDownloadEBook: (book: BookItem) => void;
  onReserveBook: (book: BookItem) => void;
  onToggleWishlist: (bookId: string) => void;
  isWishlisted: boolean;
}

export function BookDetailsModal({
  book,
  onClose,
  onLocateBook,
  onReadEBook,
  onDownloadEBook,
  onReserveBook,
  onToggleWishlist,
  isWishlisted,
}: BookDetailsModalProps) {
  if (!book) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-2xl w-full overflow-hidden space-y-4 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-5 bg-slate-900 text-white flex items-start justify-between border-b border-slate-800">
          <div className="flex gap-4">
            <img
              src={book.coverImage}
              alt={book.title}
              className="w-20 h-28 rounded-xl object-cover shadow-md shrink-0 bg-slate-800"
            />
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Badge className="bg-purple-600 text-white text-[9px] font-bold">
                  {book.bookType}
                </Badge>
                <Badge
                  className={`text-[9px] font-mono ${
                    book.status === "Available"
                      ? "bg-emerald-500 text-white"
                      : "bg-rose-500 text-white"
                  }`}
                >
                  {book.status}
                </Badge>
              </div>

              <h3 className="font-black text-lg leading-snug text-white">{book.title}</h3>
              <p className="text-xs text-purple-300 font-medium">{book.author}</p>
              <p className="text-[11px] text-slate-400 font-mono">ISBN: {book.isbn}</p>
            </div>
          </div>

          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Specs Table */}
        <div className="px-6 space-y-4 max-h-[50vh] overflow-y-auto text-xs">
          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500 mb-1">
              Book Overview & Synopsis
            </h4>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
              {book.description}
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
            <div>
              <span className="text-[10px] text-slate-400 block uppercase font-mono">Publisher</span>
              <strong className="text-slate-900 dark:text-white font-bold">{book.publisher}</strong>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block uppercase font-mono">Edition / Year</span>
              <strong className="text-slate-900 dark:text-white font-bold">
                {book.edition} ({book.publicationYear})
              </strong>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block uppercase font-mono">Language & Pages</span>
              <strong className="text-slate-900 dark:text-white font-bold">
                {book.language} • {book.pages} Pages
              </strong>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block uppercase font-mono">Department</span>
              <strong className="text-slate-900 dark:text-white font-bold">{book.department}</strong>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block uppercase font-mono">Category / Subject</span>
              <strong className="text-slate-900 dark:text-white font-bold">{book.category}</strong>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block uppercase font-mono">Rack & Shelf</span>
              <strong className="text-purple-600 dark:text-purple-400 font-bold">
                {book.rackNumber} • {book.shelfNumber}
              </strong>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex flex-col sm:flex-row items-center justify-between gap-3">
          <Button
            onClick={() => onToggleWishlist(book.id)}
            variant="outline"
            size="sm"
            className={`rounded-xl text-xs font-bold h-9 gap-1.5 w-full sm:w-auto ${
              isWishlisted ? "text-rose-500 border-rose-200" : ""
            }`}
          >
            <Heart className={`h-4 w-4 ${isWishlisted ? "fill-rose-500" : ""}`} />
            {isWishlisted ? "Wishlisted" : "Add to Wishlist"}
          </Button>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {book.bookType === "Hard Copy" ? (
              <>
                <Button
                  onClick={() => {
                    onClose();
                    onLocateBook(book);
                  }}
                  size="sm"
                  className="rounded-xl text-xs bg-purple-600 hover:bg-purple-700 text-white font-bold h-9 gap-1.5 flex-1 sm:flex-initial"
                >
                  <MapPin className="h-4 w-4" /> Locate Book
                </Button>

                {book.availableCopies === 0 && (
                  <Button
                    onClick={() => {
                      onClose();
                      onReserveBook(book);
                    }}
                    variant="outline"
                    size="sm"
                    className="rounded-xl text-xs text-amber-600 border-amber-200 hover:bg-amber-50 font-bold h-9 gap-1.5 flex-1 sm:flex-initial"
                  >
                    <BookmarkCheck className="h-4 w-4" /> Hold Queue
                  </Button>
                )}
              </>
            ) : (
              <>
                <Button
                  onClick={() => {
                    onClose();
                    onReadEBook(book);
                  }}
                  size="sm"
                  className="rounded-xl text-xs bg-indigo-600 hover:bg-indigo-700 text-white font-bold h-9 gap-1.5 flex-1 sm:flex-initial"
                >
                  <BookOpen className="h-4 w-4" /> Read Online
                </Button>
                <Button
                  onClick={() => {
                    onClose();
                    onDownloadEBook(book);
                  }}
                  variant="outline"
                  size="sm"
                  className="rounded-xl text-xs text-indigo-600 border-indigo-200 hover:bg-indigo-50 font-semibold h-9 gap-1.5 flex-1 sm:flex-initial"
                >
                  <Download className="h-4 w-4" /> Download PDF
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
