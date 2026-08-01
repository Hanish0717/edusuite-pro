import api from "@/lib/api";

export interface CampusEvent {
  id: string;
  title: string;
  category: "Technical Symposium" | "Cultural Fest" | "Guest Lecture" | "Sports Tournament" | "Workshop";
  date: string;
  time: string;
  location: string;
  organizer: string;
  attendeesCount: number;
  maxCapacity: number;
  status: "Upcoming" | "Live Now" | "Completed";
  description: string;
}

export const INITIAL_CAMPUS_EVENTS: CampusEvent[] = [
  {
    id: "EVT-101",
    title: "National AI & Machine Learning Summit 2026",
    category: "Technical Symposium",
    date: "2026-08-15",
    time: "09:30 AM",
    location: "Main Auditorium (Block A)",
    organizer: "Dept of CSE & AI Society",
    attendeesCount: 450,
    maxCapacity: 500,
    status: "Upcoming",
    description: "Annual flagship summit bringing research leaders from Google, Microsoft, and IISc for keynotes on generative AI and robotics.",
  },
  {
    id: "EVT-102",
    title: "VLSI System Design Workshop by Qualcomm",
    category: "Workshop",
    date: "2026-08-10",
    time: "10:00 AM",
    location: "ECE VLSI Seminar Hall",
    organizer: "IEEE Student Branch",
    attendeesCount: 180,
    maxCapacity: 200,
    status: "Upcoming",
    description: "Hands-on chip design and FPGA synthesis laboratory workshop using Cadence tools.",
  },
  {
    id: "EVT-103",
    title: "Annual Inter-College Sports Meet 'SPARDHA 2026'",
    category: "Sports Tournament",
    date: "2026-08-01",
    time: "08:00 AM",
    location: "College Grounds & Indoor Stadium",
    organizer: "Physical Education Dept",
    attendeesCount: 800,
    maxCapacity: 1000,
    status: "Live Now",
    description: "3-day athletic meet with track events, basketball, badminton, and table tennis championships.",
  },
  {
    id: "EVT-104",
    title: "Innovations in Renewable Energy & EV Power Systems",
    category: "Guest Lecture",
    date: "2026-08-18",
    time: "02:00 PM",
    location: "EEE Lecture Hall 4",
    organizer: "Dept of EEE",
    attendeesCount: 120,
    maxCapacity: 150,
    status: "Upcoming",
    description: "Distinguished guest lecture by IEEE Fellow on smart grid architecture and electric mobility.",
  },
  {
    id: "EVT-105",
    title: "TARAANG 2026 - Inter-Department Cultural Evening",
    category: "Cultural Fest",
    date: "2026-07-25",
    time: "05:00 PM",
    location: "Open Air Amphitheatre",
    organizer: "Student Cultural Committee",
    attendeesCount: 1200,
    maxCapacity: 1200,
    status: "Completed",
    description: "Extravaganza featuring music bands, classical dance drama, and fashion showcase.",
  },
];

export async function fetchCampusEvents(): Promise<CampusEvent[]> {
  try {
    const res = await api.get("/api/events");
    if (res && Array.isArray(res.data) && res.data.length > 0) {
      return res.data;
    }
  } catch {}
  return INITIAL_CAMPUS_EVENTS;
}

export async function createCampusEvent(eventData: Partial<CampusEvent>): Promise<CampusEvent> {
  try {
    const res = await api.post("/api/events", eventData);
    if (res && res.data && res.data.id) return res.data;
  } catch {}

  const newEvent: CampusEvent = {
    id: `EVT-${Math.floor(106 + Math.random() * 900)}`,
    title: eventData.title || "Campus Event",
    category: eventData.category || "Technical Symposium",
    date: eventData.date || new Date().toISOString().split("T")[0],
    time: eventData.time || "10:00 AM",
    location: eventData.location || "Main Auditorium",
    organizer: eventData.organizer || "Student Activity Council",
    attendeesCount: 0,
    maxCapacity: Number(eventData.maxCapacity) || 200,
    status: "Upcoming",
    description: eventData.description || "Join us for an exciting campus event!",
  };

  return newEvent;
}

export async function updateEventStatus(
  id: string,
  status: "Upcoming" | "Live Now" | "Completed",
): Promise<Partial<CampusEvent>> {
  try {
    const res = await api.put(`/api/events/${id}`, { status });
    if (res && res.data) return res.data;
  } catch {}
  return { id, status };
}

export async function deleteEvent(id: string): Promise<boolean> {
  try {
    await api.delete(`/api/events/${id}`);
  } catch {}
  return true;
}
