export interface StockItem {
  id: string;
  name: string;
  sku: string;
  category: "Medicine" | "Equipment";
  stock: number;
  location: string;
  unit: string;
  price: number;
}

const STORAGE_KEY = "billing-app-stock-items";

export const defaultStockItems: StockItem[] = [
  {
    id: "1",
    name: "Paracetamol 500mg",
    sku: "MED-001",
    category: "Medicine",
    stock: 250,
    location: "Shelf A1",
    unit: "Tablets",
    price: 0.15,
  },
  {
    id: "2",
    name: "Ibuprofen 400mg",
    sku: "MED-002",
    category: "Medicine",
    stock: 180,
    location: "Shelf A2",
    unit: "Tablets",
    price: 0.25,
  },
  {
    id: "3",
    name: "Amoxicillin 250mg Suspension",
    sku: "MED-003",
    category: "Medicine",
    stock: 95,
    location: "Fridge B",
    unit: "Bottles",
    price: 5.5,
  },
  {
    id: "4",
    name: "Surgical Masks (Box of 50)",
    sku: "EQP-001",
    category: "Equipment",
    stock: 45,
    location: "Cabinet C1",
    unit: "Boxes",
    price: 12.0,
  },
  {
    id: "5",
    name: "Sterile Gloves (Pairs)",
    sku: "EQP-002",
    category: "Equipment",
    stock: 350,
    location: "Cabinet C2",
    unit: "Pairs",
    price: 1.5,
  },
  {
    id: "6",
    name: "Syringes 5ml with needle",
    sku: "EQP-003",
    category: "Equipment",
    stock: 500,
    location: "Cabinet C3",
    unit: "Units",
    price: 0.4,
  },
  {
    id: "7",
    name: "Cetirizine 10mg",
    sku: "MED-004",
    category: "Medicine",
    stock: 320,
    location: "Shelf A3",
    unit: "Tablets",
    price: 0.2,
  },
  {
    id: "8",
    name: "Aspirin 75mg",
    sku: "MED-005",
    category: "Medicine",
    stock: 150,
    location: "Shelf A4",
    unit: "Tablets",
    price: 0.1,
  },
  {
    id: "9",
    name: "Digital Thermometer",
    sku: "EQP-004",
    category: "Equipment",
    stock: 24,
    location: "Cabinet D1",
    unit: "Units",
    price: 15.0,
  },
  {
    id: "10",
    name: "Blood Pressure Monitor",
    sku: "EQP-005",
    category: "Equipment",
    stock: 12,
    location: "Cabinet D2",
    unit: "Units",
    price: 45.0,
  },
  {
    id: "11",
    name: "Atorvastatin 20mg",
    sku: "MED-006",
    category: "Medicine",
    stock: 8,
    location: "Shelf B1",
    unit: "Tablets",
    price: 1.1,
  },
  {
    id: "12",
    name: "Metformin 500mg",
    sku: "MED-007",
    category: "Medicine",
    stock: 5,
    location: "Shelf B2",
    unit: "Tablets",
    price: 0.18,
  },
  {
    id: "13",
    name: "Stethoscope Premium",
    sku: "EQP-006",
    category: "Equipment",
    stock: 3,
    location: "Cabinet D3",
    unit: "Units",
    price: 85.0,
  },
];

export const loadStockItems = (): StockItem[] => {
  if (typeof window === "undefined") {
    return defaultStockItems;
  }

  try {
    const storedValue = window.localStorage.getItem(STORAGE_KEY);
    if (!storedValue) {
      return defaultStockItems;
    }

    const parsed = JSON.parse(storedValue) as StockItem[];
    return Array.isArray(parsed) && parsed.length > 0
      ? parsed
      : defaultStockItems;
  } catch {
    return defaultStockItems;
  }
};

export const saveStockItems = (items: StockItem[]) => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
};

const getNameTokens = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean);

export const reduceStockForInvoiceItems = (
  invoiceItems: Array<{
    name?: string;
    description?: string;
    quantity?: number;
  }>,
  currentItems: StockItem[] = loadStockItems(),
) => {
  const nextItems = currentItems.map((item) => ({ ...item }));

  invoiceItems.forEach(({ name, description, quantity }) => {
    const itemName = (name ?? description ?? "").trim();

    if (!itemName || !quantity || quantity <= 0) {
      return;
    }

    const itemNameTokens = getNameTokens(itemName);
    const matchedItem = nextItems.find((stockItem) => {
      if (stockItem.category !== "Medicine") {
        return false;
      }

      const stockTokens = getNameTokens(stockItem.name);
      return stockTokens.some(
        (token) => itemNameTokens.includes(token) && token.length > 2,
      );
    });

    if (!matchedItem) {
      return;
    }

    matchedItem.stock = Math.max(0, matchedItem.stock - quantity);
  });

  return nextItems;
};
