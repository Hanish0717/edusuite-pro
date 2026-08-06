import React from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  LineChart,
  Line,
} from "recharts";
import { ChartCard } from "../cards/ChartCard";

// Unified Blue/Indigo Palette Matching Sidebar Theme
const COLOR_PALETTE = ["#2563EB", "#3B82F6", "#4D78FF", "#1D4ED8", "#1E40AF"];

const INDUSTRY_DATA = [
  { name: "Cloud & Software (SaaS)", value: 45 },
  { name: "Semiconductors & Hardware", value: 20 },
  { name: "AI Research & Quantum", value: 15 },
  { name: "Automotive & EV Motors", value: 12 },
  { name: "FinTech & Venture", value: 8 },
];

const GROWTH_DATA = [
  { year: "2020", totalAlumni: 3800, activeMentors: 210, totalDonationsCr: 1.2 },
  { year: "2021", totalAlumni: 4200, activeMentors: 280, totalDonationsCr: 1.9 },
  { year: "2022", totalAlumni: 4600, activeMentors: 340, totalDonationsCr: 2.6 },
  { year: "2023", totalAlumni: 4900, activeMentors: 400, totalDonationsCr: 3.2 },
  { year: "2024", totalAlumni: 5150, activeMentors: 440, totalDonationsCr: 3.8 },
  { year: "2025", totalAlumni: 5420, activeMentors: 480, totalDonationsCr: 4.2 },
];

const DEPT_PLACEMENT_DATA = [
  { dept: "CSE", placedPct: 96, avgPackage: 18.5 },
  { dept: "ECE", placedPct: 92, avgPackage: 15.2 },
  { dept: "ME", placedPct: 88, avgPackage: 12.0 },
  { dept: "IT", placedPct: 94, avgPackage: 16.8 },
];

export const AlumniGrowthAreaChart: React.FC = () => {
  return (
    <ChartCard title="Alumni Network Expansion & Mentorship (2020–2025)" subtitle="Cumulative registered alumni vs active mentors">
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={GROWTH_DATA}>
            <defs>
              <linearGradient id="colorAlumni" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563EB" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorMentors" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4D78FF" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#4D78FF" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="year" stroke="#888888" fontSize={11} />
            <YAxis stroke="#888888" fontSize={11} />
            <Tooltip
              contentStyle={{ backgroundColor: "#0F1B44", borderRadius: "12px", border: "1px solid #24356B", color: "#fff" }}
            />
            <Legend wrapperStyle={{ fontSize: "12px" }} />
            <Area type="monotone" dataKey="totalAlumni" stroke="#2563EB" fillOpacity={1} fill="url(#colorAlumni)" name="Total Alumni" />
            <Area type="monotone" dataKey="activeMentors" stroke="#4D78FF" fillOpacity={1} fill="url(#colorMentors)" name="Active Mentors" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
};

export const IndustryDonutChart: React.FC = () => {
  return (
    <ChartCard title="Industry Sector Distribution" subtitle="Alumni employment percentage across global sectors">
      <div className="h-64 w-full flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={INDUSTRY_DATA}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={85}
              paddingAngle={4}
              dataKey="value"
            >
              {INDUSTRY_DATA.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLOR_PALETTE[index % COLOR_PALETTE.length]} />
              ))}
            </Pie>
            <Tooltip contentStyle={{ backgroundColor: "#0F1B44", borderRadius: "12px", border: "1px solid #24356B", color: "#fff" }} />
            <Legend wrapperStyle={{ fontSize: "11px" }} layout="vertical" align="right" verticalAlign="middle" />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
};

export const PlacementBarChart: React.FC = () => {
  return (
    <ChartCard title="Placement Statistics by Department" subtitle="Average package (LPA) and placement rates">
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={DEPT_PLACEMENT_DATA}>
            <XAxis dataKey="dept" stroke="#888888" fontSize={11} />
            <YAxis stroke="#888888" fontSize={11} />
            <Tooltip contentStyle={{ backgroundColor: "#0F1B44", borderRadius: "12px", border: "1px solid #24356B", color: "#fff" }} />
            <Legend wrapperStyle={{ fontSize: "12px" }} />
            <Bar dataKey="placedPct" fill="#2563EB" name="Placement Rate (%)" radius={[6, 6, 0, 0]} />
            <Bar dataKey="avgPackage" fill="#4D78FF" name="Avg Package (LPA)" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
};

export const DonationTrendLineChart: React.FC = () => {
  return (
    <ChartCard title="Endowment Fund Growth Trend" subtitle="Total alumni contributions in ₹ Crores">
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={GROWTH_DATA}>
            <XAxis dataKey="year" stroke="#888888" fontSize={11} />
            <YAxis stroke="#888888" fontSize={11} />
            <Tooltip contentStyle={{ backgroundColor: "#0F1B44", borderRadius: "12px", border: "1px solid #24356B", color: "#fff" }} />
            <Line type="monotone" dataKey="totalDonationsCr" stroke="#2563EB" strokeWidth={3} dot={{ r: 5 }} name="Endowment (₹ Cr)" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
};
