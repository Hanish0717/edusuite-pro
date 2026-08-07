import { createFileRoute } from "@tanstack/react-router";
import { StudentLibraryModule } from "@/components/student-library";

import { LibraryStoreProvider } from "@/modules/library/LibraryStore";

export const Route = createFileRoute("/student/library")({
  head: () => ({
    meta: [{ title: "Library — EduSuite Pro" }],
  }),
  component: StudentLibraryRoute,
});

function StudentLibraryRoute() {
  return (
    <LibraryStoreProvider>
      <StudentLibraryModule />
    </LibraryStoreProvider>
  );
}
