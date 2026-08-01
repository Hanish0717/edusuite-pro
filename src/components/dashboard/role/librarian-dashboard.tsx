import {
  Library,
  BookOpen,
  CheckCircle2,
  Clock,
  Plus,
  Search,
} from "lucide-react";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { Panel } from "@/components/dashboard/panel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function LibrarianDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-4">
        <div>
          <h2 className="font-display text-2xl font-extrabold tracking-tight">
            Central Library Control Desk
          </h2>
          <p className="text-sm text-muted-foreground">
            Scope: Library System, Book Cataloging, Issue & Return Desk, Digital Repository, Fine Collection.
          </p>
        </div>
        <Badge className="bg-brand-gradient text-white w-fit font-mono">
          LIBRARIAN
        </Badge>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Total Catalog Titles" value="45,820 Volumes" icon={Library} />
        <KpiCard label="Books Currently Issued" value="1,240 Active" icon={BookOpen} tone="info" />
        <KpiCard label="Overdue Returns" value="38 Books" icon={Clock} tone="warning" />
        <KpiCard label="Fine Collections (This Month)" value="Rs 12,450" icon={CheckCircle2} tone="success" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Panel title="Circulation Desk & Issue Logs">
            <div className="space-y-3">
              {[
                { title: "Introduction to Algorithms (Cormen)", borrower: "K. Sai Teja (22CS101)", due: "Aug 5, 2026", status: "Issued" },
                { title: "Digital Signal Processing (Proakis)", borrower: "Priya S. (22ECE044)", due: "Aug 8, 2026", status: "Issued" },
                { title: "Artificial Intelligence: A Modern Approach", borrower: "Prof. Ananya Sharma", due: "Today", status: "Due Today" },
              ].map((book) => (
                <div key={book.title} className="p-4 rounded-xl border border-border/70 bg-card flex items-center justify-between">
                  <div>
                    <h4 className="font-display text-sm font-bold">{book.title}</h4>
                    <p className="text-xs text-muted-foreground">Borrower: {book.borrower} | Due: {book.due}</p>
                  </div>
                  <Badge className="bg-primary/10 text-primary text-xs font-mono">
                    {book.status}
                  </Badge>
                </div>
              ))}
            </div>
          </Panel>
        </div>

        <div className="space-y-6">
          <Panel title="Library Desk Actions">
            <div className="space-y-2">
              <Button className="w-full justify-start bg-brand-gradient text-xs cursor-pointer">
                <Plus className="size-4 mr-2" /> Issue / Return Book
              </Button>
              <Button variant="outline" className="w-full justify-start text-xs cursor-pointer">
                <BookOpen className="size-4 mr-2" /> Add Digital E-Book / Journal
              </Button>
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}
