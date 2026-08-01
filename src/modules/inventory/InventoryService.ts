import api from "@/lib/api";

export interface InventoryItem {
  id: string;
  name: string;
  category: "IT Hardware" | "Lab Equipment" | "Furniture" | "Stationery";
  quantity: number;
  minThreshold: number;
  unitCost: number;
  location: string;
  status: "In Stock" | "Low Stock" | "Out of Stock";
}

export async function fetchInventoryItems(): Promise<InventoryItem[]> {
  try {
    const { data } = await api.get("/api/inventory");
    return data;
  } catch {
    return [
      { id: "INV-101", name: "Dell OptiPlex Desktop Workstations", category: "IT Hardware", quantity: 45, minThreshold: 10, unitCost: 54000, location: "CSE Lab 3", status: "In Stock" },
      { id: "INV-102", name: "Tektronix Digital Storage Oscilloscopes", category: "Lab Equipment", quantity: 8, minThreshold: 12, unitCost: 85000, location: "ECE VLSI Lab", status: "Low Stock" },
      { id: "INV-103", name: "Ergonomic Faculty Chairs", category: "Furniture", quantity: 120, minThreshold: 20, unitCost: 6500, location: "Staff Rooms", status: "In Stock" },
      { id: "INV-104", name: "A4 Printing Paper Reams", category: "Stationery", quantity: 0, minThreshold: 30, unitCost: 320, location: "Central Stores", status: "Out of Stock" },
    ];
  }
}

export async function addInventoryItem(itemData: Partial<InventoryItem>): Promise<InventoryItem> {
  const { data } = await api.post("/api/inventory", itemData);
  return data;
}
