import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Panel } from "@/components/dashboard/panel";

export function DownloadAnalytics() {
  const data = [
    { subject: "Operating Systems", downloads: 142 },
    { subject: "DBMS", downloads: 98 },
    { subject: "Compiler Design", downloads: 67 },
  ];

  return (
    <Panel
      title="Download & Student Access Curves"
      description="Roster download stats mapping worksheet access patterns"
      className="border border-border bg-card rounded-2xl p-4 text-xs"
    >
      <div className="h-44 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis dataKey="subject" stroke="#888888" fontSize={9} tickLine={false} axisLine={false} />
            <YAxis stroke="#888888" fontSize={9} tickLine={false} axisLine={false} />
            <Tooltip cursor={{ fill: "rgba(0, 0, 0, 0.05)" }} />
            <Bar dataKey="downloads" fill="url(#matGrad)" radius={[4, 4, 0, 0]} />
            <defs>
              <linearGradient id="matGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#8b5cf6" />
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Panel>
  );
}
