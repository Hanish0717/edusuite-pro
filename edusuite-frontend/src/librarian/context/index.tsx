// Centralized Librarian Navigation & Tab Context

import React, { createContext, useContext } from "react";
import { useLocation, useNavigate } from "@tanstack/react-router";

export type LibrarianTab =
  | "overview"
  | "books"
  | "issue"
  | "return"
  | "id-cards"
  | "members"
  | "digital"
  | "fines"
  | "reports"
  | "notifications"
  | "settings"
  | "search"
  | "reservations"
  | "acquisition"
  | "inventory"
  | "reading-hall"
  | "entry"
  | "audit-logs"
  | "catalog"
  | "circulation";

export const TAB_ROUTE_MAP: Record<LibrarianTab, string> = {
  overview: "/librarian",
  books: "/librarian/books",
  issue: "/librarian/issue-books",
  return: "/librarian/return-books",
  "id-cards": "/librarian/id-cards",
  members: "/librarian/members",
  digital: "/librarian/digital",
  fines: "/librarian/fines",
  reports: "/librarian/reports",
  notifications: "/librarian/notifications",
  settings: "/librarian/settings",
  search: "/librarian/search",
  reservations: "/librarian/reservations",
  acquisition: "/librarian/acquisition",
  inventory: "/librarian/inventory",
  "reading-hall": "/librarian/reading-hall",
  entry: "/librarian/entry",
  "audit-logs": "/librarian/audit-logs",
  catalog: "/librarian/catalog",
  circulation: "/librarian/circulation",
};

interface LibrarianContextType {
  activeTab: LibrarianTab;
  setActiveTab: (tab: LibrarianTab) => void;
}

const LibrarianContext = createContext<LibrarianContextType>({
  activeTab: "overview",
  setActiveTab: () => {},
});

export function getTabFromPathname(pathname: string): LibrarianTab {
  if (pathname.includes("/books")) return "books";
  if (pathname.includes("/issue")) return "issue";
  if (pathname.includes("/return")) return "return";
  if (pathname.includes("/id-cards")) return "id-cards";
  if (pathname.includes("/members")) return "members";
  if (pathname.includes("/digital")) return "digital";
  if (pathname.includes("/fines")) return "fines";
  if (pathname.includes("/reports")) return "reports";
  if (pathname.includes("/notifications")) return "notifications";
  if (pathname.includes("/settings")) return "settings";
  if (pathname.includes("/search")) return "search";
  if (pathname.includes("/reservations")) return "reservations";
  if (pathname.includes("/acquisition")) return "acquisition";
  if (pathname.includes("/inventory")) return "inventory";
  if (pathname.includes("/reading-hall")) return "reading-hall";
  if (pathname.includes("/entry")) return "entry";
  if (pathname.includes("/audit-logs")) return "audit-logs";
  if (pathname.includes("/catalog")) return "catalog";
  if (pathname.includes("/circulation")) return "circulation";
  return "overview";
}

export function LibrarianTabProvider({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();

  const activeTab = getTabFromPathname(location.pathname);

  const setActiveTab = (tab: LibrarianTab) => {
    const targetUrl = TAB_ROUTE_MAP[tab] || "/librarian";
    navigate({ to: targetUrl });
  };

  return (
    <LibrarianContext.Provider value={{ activeTab, setActiveTab }}>
      {children}
    </LibrarianContext.Provider>
  );
}

export function useLibrarianTab() {
  return useContext(LibrarianContext);
}
