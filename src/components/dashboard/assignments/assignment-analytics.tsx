import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { Panel } from "@/components/dashboard/panel";
import type { StudentSubmission } from "@/data/faculty-mock-data";

interface AssignmentAnalyticsProps {
  submissions: StudentSubmission[];
}

export function AssignmentAnalytics({ submissions }: AssignmentAnalyticsProps) {
  // Aggregate grade thresholds
  const grades = [
    { range: "90-100 (A+)", count: submissions.filter((s) => s.marks !== undefined && s.marks >= 90).length },
    { range: "80-89 (A)", count: submissions.filter((s) => s.marks !== undefined && s.marks >= 80 && s.marks < 90).length },
    { range: "70-79 (B)", count: submissions.filter((s) => s.marks !== undefined && s.marks >= 70 && s.marks < 80).length },
    { range: "60-69 (C)", count: submissions.filter((s) => s.marks !== undefined && s.marks >= 60 && s.marks < 70).length },
    { range: "< 60 (D/F)", count: submissions.filter((s) => s.marks !== undefined && s.marks < 60).length },
  ];

  // Submission trend logs
  const submissionTrend = [
    { day: "Day 1", count: 12 },
    { day: "Day 2", count: 24 },
    { day: "Day 3", count: 32 },
    { day: "Day 4 (Due)", count: 44 },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 text-xs">
      <Panel
        title="Marks Distribution"
        description="Roster percentage scoring distribution curves"
        className="border border-border bg-card rounded-2xl p-4"
      >
        <div className="h-44 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={grades}>
              <XAxis dataKey="range" stroke="#888888" fontSize={9} tickLine={false} axisLine={false} />
              <YAxis stroke="#888888" fontSize={9} tickLine={false} axisLine={false} />
              <Tooltip cursor={{ fill: "rgba(0, 0, 0, 0.05)" }} />
              <Bar dataKey="count" fill="url(#brandGrad)" radius={[4, 4, 0, 0]} />
              <defs>
                <linearGradient id="brandGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Panel>

      <Panel
        title="Submissions Trend"
        description="Daily upload volume timelines before due date"
        className="border border-border bg-card rounded-2xl p-4"
      >
        <div className="h-44 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={submissionTrend}>
              <XAxis dataKey="day" stroke="#888888" fontSize={9} tickLine={false} axisLine={false} />
              <YAxis stroke="#888888" fontSize={9} tickLine={false} axisLine={false} />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Panel>
    </div>
  );
}
