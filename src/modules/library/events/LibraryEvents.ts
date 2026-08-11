// =============================================================================
// LIBRARY MODULE V2 EVENT BUS PUBLISHER
// =============================================================================

export interface LibraryEventMap {
  "library:book_added": { bookId: string; title: string; accessionNo: string };
  "library:book_issued": { issueId: string; bookId: string; memberId: string; dueDate: string };
  "library:book_returned": { issueId: string; bookId: string; returnDate: string; fineAmount: number };
  "library:fine_generated": { fineId: string; memberId: string; amount: number; reason: string };
  "library:reservation_created": { reservationId: string; bookId: string; memberId: string };
}

export class LibraryEvents {
  static publish<K extends keyof LibraryEventMap>(event: K, payload: LibraryEventMap[K]): void {
    if (typeof window !== "undefined") {
      const customEvent = new CustomEvent(event, { detail: payload });
      window.dispatchEvent(customEvent);
    }
  }

  static subscribe<K extends keyof LibraryEventMap>(
    event: K,
    callback: (payload: LibraryEventMap[K]) => void
  ): () => void {
    if (typeof window !== "undefined") {
      const handler = (e: Event) => callback((e as CustomEvent).detail);
      window.addEventListener(event, handler);
      return () => window.removeEventListener(event, handler);
    }
    return () => {};
  }
}
