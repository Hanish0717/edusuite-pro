import api from "@/lib/api";

export interface PurchaseOrder {
  poNumber: string;
  vendorName: string;
  requestedBy: string;
  department: string;
  itemsDescription: string;
  totalAmount: number;
  requestDate: string;
  approvalStatus: "Submitted" | "HOD Approved" | "Finance Approved" | "Principal Approved" | "Rejected";
}

export async function fetchPurchaseOrders(): Promise<PurchaseOrder[]> {
  const fallback: PurchaseOrder[] = [
    { poNumber: "PO-2026-881", vendorName: "Dell India Pvt Ltd", requestedBy: "Dr. S. K. Gupta", department: "CSE", itemsDescription: "50 High-Performance GPU Workstations for AI Lab", totalAmount: 4250000, requestDate: "2026-07-28", approvalStatus: "Finance Approved" },
    { poNumber: "PO-2026-882", vendorName: "Tektronix Instruments", requestedBy: "Dr. Meera Rao", department: "ECE", itemsDescription: "Signal Analyzers and VLSI Test Benches", totalAmount: 1850000, requestDate: "2026-07-30", approvalStatus: "HOD Approved" },
    { poNumber: "PO-2026-883", vendorName: "Godrej Campus Furniture", requestedBy: "Prof. V. K. Murthy", department: "Admin", itemsDescription: "Auditorium Chairs & Seminar Hall Podiums", totalAmount: 950000, requestDate: "2026-08-01", approvalStatus: "Submitted" },
  ];
  try {
    const res = await api.get("/api/procurement");
    if (res && Array.isArray(res.data) && res.data.length > 0) {
      return res.data;
    }
  } catch {}
  return fallback;
}

export async function createPurchaseOrder(poData: Partial<PurchaseOrder>): Promise<PurchaseOrder> {
  const { data } = await api.post("/api/procurement", poData);
  return data;
}
