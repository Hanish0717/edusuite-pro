import api from "@/lib/api";

export interface InventoryItem {
  id: string;
  name: string;
  category: "IT Hardware" | "Lab Equipment" | "Furniture" | "Stationery" | "Sports Gear";
  quantity: number;
  minThreshold: number;
  unitCost: number;
  location: string;
  serialNumber?: string;
  status: "In Stock" | "Low Stock" | "Out of Stock";
  lastRestockedOn?: string;
}

export const INITIAL_INVENTORY_ITEMS: InventoryItem[] = [
  {
    id: "INV-101",
    name: "Dell OptiPlex 7090 Desktop Workstations",
    category: "IT Hardware",
    quantity: 45,
    minThreshold: 10,
    unitCost: 54000,
    location: "CSE Lab 3 (Block A)",
    serialNumber: "SN-DELL-99821-X",
    status: "In Stock",
    lastRestockedOn: "2026-06-15",
  },
  {
    id: "INV-102",
    name: "Tektronix Digital Storage Oscilloscopes",
    category: "Lab Equipment",
    quantity: 8,
    minThreshold: 12,
    unitCost: 85000,
    location: "ECE VLSI Lab (Block B)",
    serialNumber: "SN-TEK-44102-Z",
    status: "Low Stock",
    lastRestockedOn: "2026-05-10",
  },
  {
    id: "INV-103",
    name: "Ergonomic Executive Faculty Chairs",
    category: "Furniture",
    quantity: 120,
    minThreshold: 20,
    unitCost: 6500,
    location: "Faculty Staff Rooms",
    serialNumber: "SN-FURN-1029",
    status: "In Stock",
    lastRestockedOn: "2026-07-01",
  },
  {
    id: "INV-104",
    name: "A4 Printing Paper Reams (80 GSM)",
    category: "Stationery",
    quantity: 0,
    minThreshold: 30,
    unitCost: 320,
    location: "Central Stores Basement",
    serialNumber: "STATIONERY-PAPER-01",
    status: "Out of Stock",
    lastRestockedOn: "2026-04-18",
  },
  {
    id: "INV-105",
    name: "Epson 4K Projectors & Ceiling Mounts",
    category: "IT Hardware",
    quantity: 18,
    minThreshold: 5,
    unitCost: 72000,
    location: "Seminar Halls 1 & 2",
    serialNumber: "SN-EPSON-7781-P",
    status: "In Stock",
    lastRestockedOn: "2026-06-28",
  },
  {
    id: "INV-106",
    name: "Cosco Leather Basketballs & Equipment Kit",
    category: "Sports Gear",
    quantity: 4,
    minThreshold: 10,
    unitCost: 2800,
    location: "Sports Complex Store",
    serialNumber: "SPORTS-BB-09",
    status: "Low Stock",
    lastRestockedOn: "2026-03-12",
  },
];

export async function fetchInventoryItems(): Promise<InventoryItem[]> {
  try {
    const res = await api.get("/api/inventory");
    if (res && Array.isArray(res.data) && res.data.length > 0) {
      return res.data;
    }
  } catch {}
  return INITIAL_INVENTORY_ITEMS;
}

export async function addInventoryItem(itemData: Partial<InventoryItem>): Promise<InventoryItem> {
  try {
    const res = await api.post("/api/inventory", itemData);
    if (res && res.data && res.data.id) return res.data;
  } catch {}

  const qty = Number(itemData.quantity) || 0;
  const min = Number(itemData.minThreshold) || 10;
  const computedStatus = qty === 0 ? "Out of Stock" : qty <= min ? "Low Stock" : "In Stock";

  const newItem: InventoryItem = {
    id: `INV-${Math.floor(100 + Math.random() * 900)}`,
    name: itemData.name || "New Asset Item",
    category: itemData.category || "IT Hardware",
    quantity: qty,
    minThreshold: min,
    unitCost: Number(itemData.unitCost) || 5000,
    location: itemData.location || "Central Stores",
    serialNumber: itemData.serialNumber || `SN-${Math.floor(10000 + Math.random() * 90000)}`,
    status: itemData.status || computedStatus,
    lastRestockedOn: new Date().toISOString().split("T")[0],
  };

  return newItem;
}

export async function updateInventoryItem(
  id: string,
  updates: Partial<InventoryItem>,
): Promise<Partial<InventoryItem>> {
  try {
    const res = await api.put(`/api/inventory/${id}`, updates);
    if (res && res.data) return res.data;
  } catch {}
  return { id, ...updates };
}

export async function deleteInventoryItem(id: string): Promise<boolean> {
  try {
    await api.delete(`/api/inventory/${id}`);
  } catch {}
  return true;
}
