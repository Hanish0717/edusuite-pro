import { useState } from "react";
import { Search, MapPin, Grid, Shield, LayoutGrid } from "lucide-react";
import type { SeatingArrangementItem } from "./types";
import { Input } from "@/components/ui/input";

interface SeatingPlanProps {
  arrangements: SeatingArrangementItem[];
}

export function SeatingPlan({ arrangements }: SeatingPlanProps) {
  const [search, setSearch] = useState("");

  const filtered = arrangements.filter(
    (a) =>
      a.rollNumber.toLowerCase().includes(search.toLowerCase()) ||
      a.studentName.toLowerCase().includes(search.toLowerCase())
  );

  // Group seating layout by rows and columns (e.g. 3 rows, 3 columns)
  // Hall layout is typically structured by rows (1 to 4) and columns (1 to 3)
  const rows = [1, 2, 3, 4];
  const cols = [1, 2, 3];

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-muted/30 p-4 rounded-2xl border border-border/40">
        <div>
          <h3 className="font-bold text-sm text-foreground">Interactive Seating Grid</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Hall: Hall 302 · Bench Layout: 2 students per bench.</p>
        </div>
        <div className="relative w-full max-w-[280px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
          <Input
            placeholder="Search student or roll number..."
            className="pl-9 h-8 text-xs bg-background"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Visual Seating Arrangement Grid */}
        <div className="lg:col-span-2 space-y-4">
          <div className="text-center font-bold text-[10px] tracking-wider text-muted-foreground uppercase bg-muted/40 py-1.5 rounded-lg border border-border/30">
            Exam Supervisor Desk / Blackboard Front
          </div>

          <div className="grid gap-3 p-4 bg-muted/10 rounded-2xl border border-border/40">
            {rows.map((row) => (
              <div key={row} className="flex gap-3 justify-center">
                {cols.map((col) => {
                  // Find students assigned to Row X, Col Y in this hall
                  const seatStudents = arrangements.filter(
                    (a) => a.row === row && a.column === col
                  );

                  const isAnySearchMatch = seatStudents.some(
                    (s) =>
                      search !== "" &&
                      (s.rollNumber.toLowerCase().includes(search.toLowerCase()) ||
                        s.studentName.toLowerCase().includes(search.toLowerCase()))
                  );

                  return (
                    <div
                      key={`${row}-${col}`}
                      className={`flex-1 min-h-[70px] rounded-xl border p-2 flex flex-col justify-between transition-all duration-300 ${
                        isAnySearchMatch
                          ? "bg-primary/20 border-primary shadow-glow scale-[1.02]"
                          : "bg-card border-border/55 hover:border-border-foreground/20"
                      }`}
                    >
                      <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wide">
                        Row {row} · Col {col}
                      </span>
                      {seatStudents.length > 0 ? (
                        <div className="space-y-1 mt-1">
                          {seatStudents.map((stud) => {
                            const isIndividualMatch =
                              search !== "" &&
                              (stud.rollNumber.toLowerCase().includes(search.toLowerCase()) ||
                                stud.studentName.toLowerCase().includes(search.toLowerCase()));

                            return (
                              <div
                                key={stud.id}
                                className={`text-[10px] px-1.5 py-0.5 rounded font-semibold truncate leading-normal ${
                                  isIndividualMatch
                                    ? "bg-primary text-primary-foreground font-extrabold"
                                    : "bg-muted text-foreground"
                                }`}
                              >
                                {stud.studentName.split(" ")[0]} ({stud.seatNumber})
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <span className="text-[10px] text-muted-foreground/40 italic">Empty</span>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          <div className="text-center font-bold text-[10px] tracking-wider text-muted-foreground uppercase bg-muted/40 py-1.5 rounded-lg border border-border/30">
            Classroom Entrance / Back
          </div>
        </div>

        {/* Search List Details */}
        <div className="rounded-2xl border border-border/50 bg-card p-4 space-y-4">
          <div className="flex items-center justify-between border-b border-border/40 pb-2">
            <h4 className="font-bold text-xs text-foreground uppercase tracking-wider flex items-center gap-1.5">
              <LayoutGrid className="size-4 text-primary" /> Seating Register
            </h4>
            <span className="text-[10px] bg-muted px-2 py-0.5 rounded font-bold text-muted-foreground">
              {filtered.length} matches
            </span>
          </div>

          <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
            {filtered.map((item) => {
              const isMatch =
                search !== "" &&
                (item.rollNumber.toLowerCase().includes(search.toLowerCase()) ||
                  item.studentName.toLowerCase().includes(search.toLowerCase()));

              return (
                <div
                  key={item.id}
                  className={`p-3 rounded-xl border text-xs flex justify-between items-center transition-all ${
                    isMatch
                      ? "bg-primary/10 border-primary"
                      : "bg-muted/10 border-border/40 hover:bg-muted/20"
                  }`}
                >
                  <div>
                    <p className="font-bold text-foreground">{item.studentName}</p>
                    <p className="text-[10px] text-muted-foreground font-semibold mt-0.5">
                      Roll: {item.rollNumber} · Seat: <strong className="text-foreground">{item.seatNumber}</strong>
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-primary">{item.hall}</p>
                    <p className="text-[9px] text-muted-foreground uppercase tracking-wide mt-0.5">
                      {item.bench} · R{item.row}C{item.column}
                    </p>
                  </div>
                </div>
              );
            })}
            {filtered.length === 0 && (
              <p className="text-center text-xs text-muted-foreground py-6 italic">No matching students found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
