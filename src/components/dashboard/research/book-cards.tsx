import { BookOpen, Library, Landmark, Bookmark } from "lucide-react";
import type { BookItem } from "./types";

interface BookCardsProps {
  books: BookItem[];
}

export function BookCards({ books }: BookCardsProps) {
  if (books.length === 0) {
    return (
      <div className="rounded-2xl border border-border/40 bg-card p-6 text-center text-muted-foreground text-sm">
        No books or book chapters recorded.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {books.map((book) => (
        <div
          key={book.id}
          className="flex flex-col justify-between p-5 rounded-2xl border border-border/50 bg-card hover:shadow-md transition-all duration-200"
        >
          <div className="space-y-3">
            {/* Header tag */}
            <div className="flex items-center justify-between gap-3">
              <div className="size-9 rounded-lg bg-indigo-500/10 flex items-center justify-center shrink-0">
                <BookOpen className="size-4.5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <span className="text-[10px] font-bold bg-muted px-2 py-0.5 rounded text-muted-foreground uppercase tracking-wider">
                {book.edition}
              </span>
            </div>

            {/* Book Title */}
            <div>
              <h4 className="font-bold text-sm text-foreground leading-snug line-clamp-2">
                {book.title}
              </h4>
            </div>

            {/* Details panel */}
            <div className="grid grid-cols-2 gap-2 pt-3 border-t border-border/30 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Landmark className="size-3.5 text-muted-foreground/75" />
                <span>Publisher: <strong className="text-foreground">{book.publisher}</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <Bookmark className="size-3.5 text-muted-foreground/75" />
                <span>Year: <strong className="text-foreground">{book.year}</strong></span>
              </div>
              <div className="flex items-center gap-1.5 col-span-2 mt-1">
                <Library className="size-3.5 text-muted-foreground/75" />
                <span>ISBN: <strong className="text-foreground font-mono">{book.isbn}</strong></span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
