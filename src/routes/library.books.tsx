import { createFileRoute } from "@tanstack/react-router";
import { BookOpen } from "lucide-react";
import { ModulePage } from "@/components/dashboard/module-page";

export const Route = createFileRoute("/library/books")({
  head: () => ({
    meta: [{ title: "Library Catalogue — EduSuite Pro" }],
  }),
  component: LibraryBooksPage,
});

function LibraryBooksPage() {
  return (
    <ModulePage
      title="Library Catalogue"
      description="Search library books catalogue, manage editions, and stocks."
      icon={BookOpen}
      tabs={["Search Catalogue", "Add Book", "Stock Audit"]}
      highlights={[
        { label: "Total Books", value: "48,204" },
        { label: "Unique Titles", value: "12,180" },
        { label: "New Additions", value: "240" },
        { label: "Damaged / Lost", value: "14" },
      ]}
    />
  );
}
