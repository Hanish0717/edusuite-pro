import React from "react";
import { BookItem } from "./types";
import { Heart, MapPin, BookOpen, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface WishlistTabProps {
  books: BookItem[];
  wishlistIds: string[];
  onOpenBookDetails: (book: BookItem) => void;
  onLocateBook: (book: BookItem) => void;
  onReadEBook: (book: BookItem) => void;
  onToggleWishlist: (bookId: string) => void;
}

export function WishlistTab({
  books,
  wishlistIds,
  onOpenBookDetails,
  onLocateBook,
  onReadEBook,
  onToggleWishlist,
}: WishlistTabProps) {
  const wishlistedBooks = books.filter((b) => wishlistIds.includes(b.id));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Heart className="h-5 w-5 text-amber-500 fill-amber-500" /> My Saved Wishlist ({wishlistedBooks.length})
          </h3>
          <p className="text-xs text-slate-500">
            Bookmarked library titles saved for future reading, reference, or physical borrowing.
          </p>
        </div>
      </div>

      {wishlistedBooks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {wishlistedBooks.map((book) => (
            <div
              key={book.id}
              className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs flex flex-col justify-between space-y-3"
            >
              <div className="flex gap-3">
                <img
                  src={book.coverImage}
                  alt={book.title}
                  className="w-20 h-28 rounded-xl object-cover shadow-sm bg-slate-100 shrink-0 cursor-pointer"
                  onClick={() => onOpenBookDetails(book)}
                />

                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <Badge
                      className={`text-[9px] font-bold ${
                        book.bookType === "E-Book"
                          ? "bg-indigo-600 text-white"
                          : "bg-amber-600 text-white"
                      }`}
                    >
                      {book.bookType}
                    </Badge>
                    <button
                      onClick={() => onToggleWishlist(book.id)}
                      className="text-slate-400 hover:text-rose-500 p-1"
                      title="Remove from wishlist"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <h4
                    onClick={() => onOpenBookDetails(book)}
                    className="font-bold text-xs text-slate-900 dark:text-white line-clamp-2 cursor-pointer hover:text-purple-600"
                  >
                    {book.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 truncate">{book.author}</p>
                  <p className="text-[10px] text-purple-600 font-mono font-bold">
                    Rack {book.rackNumber} • Shelf {book.shelfNumber}
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex gap-2">
                {book.bookType === "Hard Copy" ? (
                  <Button
                    onClick={() => onLocateBook(book)}
                    size="sm"
                    className="w-full rounded-xl text-xs h-8 bg-purple-600 hover:bg-purple-700 text-white font-bold gap-1"
                  >
                    <MapPin className="h-3.5 w-3.5" /> Locate in Library
                  </Button>
                ) : (
                  <Button
                    onClick={() => onReadEBook(book)}
                    size="sm"
                    className="w-full rounded-xl text-xs h-8 bg-indigo-600 hover:bg-indigo-700 text-white font-bold gap-1"
                  >
                    <BookOpen className="h-3.5 w-3.5" /> Read E-Book Online
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-12 text-center rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2">
          <Heart className="h-10 w-10 text-slate-400 mx-auto" />
          <h4 className="font-bold text-xs text-slate-700 dark:text-slate-300">
            Wishlist is empty
          </h4>
          <p className="text-xs text-slate-500 font-medium">
            Click the heart icon on any book card to save titles to your wishlist.
          </p>
        </div>
      )}
    </div>
  );
}
