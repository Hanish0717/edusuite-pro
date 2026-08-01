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
  status: "Upcoming" | "Live Now" | "Completed";
}

export async function fetchCampusEvents(): Promise<CampusEvent[]> {
  try {
    const { data } = await api.get("/api/events");
    return data;
  } catch {
    return [
      { id: "EVT-101", title: "National AI & Machine Learning Summit 2026", category: "Technical Symposium", date: "2026-08-15", time: "09:30 AM", location: "Main Auditorium", organizer: "Dept of CSE", attendeesCount: 450, status: "Upcoming" },
      { id: "EVT-102", title: "VLSI System Design Workshop by Qualcomm", category: "Workshop", date: "2026-08-10", time: "10:00 AM", location: "ECE Seminar Hall", organizer: "IEEE Student Branch", attendeesCount: 180, status: "Upcoming" },
      { id: "EVT-103", title: "Annual Inter-College Sports Meet 'SPARDHA'", category: "Sports Tournament", date: "2026-08-01", time: "08:00 AM", location: "College Grounds & Indoor Stadium", organizer: "Physical Education Dept", attendeesCount: 800, status: "Live Now" },
    ];
  }
}

export async function createCampusEvent(eventData: Partial<CampusEvent>): Promise<CampusEvent> {
  const { data } = await api.post("/api/events", eventData);
  return data;
}
