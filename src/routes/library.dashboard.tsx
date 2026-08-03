import { createFileRoute } from "@tanstack/react-router";
import { LibraryModuleView } from "@/modules/library";

export const Route = createFileRoute("/library/dashboard")({
  head: () => ({
    meta: [{ title: "Library Dashboard — EduSuite Pro" }],
  }),
  component: LibraryModuleView,
});
