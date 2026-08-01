import api from "@/lib/api";

export interface PurchaseOrder {
  poNumber: string;
  vendorName: string;
  requestedBy: string;
  department: string;
  itemsDescription: string;
  totalAmount: number;
  requestDate: string;
  deliveryDate?: string;
  approvalStatus: "Submitted" | "HOD Approved" | "Finance Approved" | "Principal Approved" | "Rejected";
}

export const INITIAL_PURCHASE_ORDERS: PurchaseOrder[] = [
  {
    poNumber: "PO-2026-881",
    vendorName: "Dell India Pvt Ltd",
    requestedBy: "Dr. S. K. Gupta",
    department: "CSE",
    itemsDescription: "50 High-Performance GPU Workstations for AI Research Lab",
    totalAmount: 4250000,
    requestDate: "2026-07-28",
    deliveryDate: "2026-08-20",
    approvalStatus: "Finance Approved",
  },
  {
    poNumber: "PO-2026-882",
    vendorName: "Tektronix Instruments Ltd",
    requestedBy: "Dr. Meera Rao",
    department: "ECE",
    itemsDescription: "Signal Analyzers, VLSI Test Benches & High Frequency Probes",
    totalAmount: 1850000,
    requestDate: "2026-07-30",
    deliveryDate: "2026-08-15",
    approvalStatus: "HOD Approved",
  },
  {
    poNumber: "PO-2026-883",
    vendorName: "Godrej Campus Furniture",
    requestedBy: "Prof. V. K. Murthy",
    department: "Admin",
    itemsDescription: "Auditorium Ergonomic Seats & Seminar Hall Podiums",
    totalAmount: 950000,
    requestDate: "2026-08-01",
    deliveryDate: "2026-08-25",
    approvalStatus: "Submitted",
  },
  {
    poNumber: "PO-2026-884",
    vendorName: "Thermo Fisher Scientific",
    requestedBy: "Dr. K. Sai Teja",
    department: "Biotech",
    itemsDescription: "Spectrophotometers & Spectrometry Reagents",
    totalAmount: 1200000,
    requestDate: "2026-07-20",
    deliveryDate: "2026-08-10",
    approvalStatus: "Principal Approved",
  },
  {
    poNumber: "PO-2026-885",
    vendorName: "Universal Books Distributor",
    requestedBy: "Mrs. L. Subhashini",
    department: "Library",
    itemsDescription: "250 International Textbooks for IEEE & Springer Catalog",
    totalAmount: 340000,
    requestDate: "2026-07-22",
    deliveryDate: "2026-08-05",
    approvalStatus: "Rejected",
  },
];

export async function fetchPurchaseOrders(): Promise<PurchaseOrder[]> {
  try {
    const res = await api.get("/api/procurement");
    if (res && Array.isArray(res.data) && res.data.length > 0) {
      return res.data;
    }
  } catch {}
  return INITIAL_PURCHASE_ORDERS;
}

export async function createPurchaseOrder(poData: Partial<PurchaseOrder>): Promise<PurchaseOrder> {
  try {
    const res = await api.post("/api/procurement", poData);
    if (res && res.data && res.data.poNumber) return res.data;
  } catch {}

  const newPO: PurchaseOrder = {
    poNumber: `PO-2026-${Math.floor(886 + Math.random() * 100)}`,
    vendorName: poData.vendorName || "Approved Vendor",
    requestedBy: poData.requestedBy || "Dr. Rajesh Sharma",
    department: poData.department || "CSE",
    itemsDescription: poData.itemsDescription || "Equipment & Supplies Purchase",
    totalAmount: Number(poData.totalAmount) || 150000,
    requestDate: new Date().toISOString().split("T")[0],
    deliveryDate: poData.deliveryDate || "2026-08-30",
    approvalStatus: "Submitted",
  };

  return newPO;
}

export async function updatePOStatus(
  poNumber: string,
  approvalStatus: PurchaseOrder["approvalStatus"],
): Promise<Partial<PurchaseOrder>> {
  try {
    const res = await api.put(`/api/procurement/${poNumber}`, { approvalStatus });
    if (res && res.data) return res.data;
  } catch {}
  return { poNumber, approvalStatus };
}

export async function deletePO(poNumber: string): Promise<boolean> {
  try {
    await api.delete(`/api/procurement/${poNumber}`);
  } catch {}
  return true;
}
