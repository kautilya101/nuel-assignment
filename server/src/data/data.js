const products = [
  { id: "P-1001", name: "12mm Hex Bolt", sku: "HEX-12-100", warehouse: "BLR-A", stock: 180, demand: 120 },
  { id: "P-1002", name: "Steel Washer", sku: "WSR-08-500", warehouse: "BLR-A", stock: 50, demand: 80 },
  { id: "P-1003", name: "M8 Nut", sku: "NUT-08-200", warehouse: "PNQ-C", stock: 80, demand: 80 },
  { id: "P-1004", name: "Bearing 608ZZ", sku: "BRG-608-50", warehouse: "DEL-B", stock: 24, demand: 120 },
  { id: "P-1005", name: "Aluminium Spacer", sku: "SPC-12-150", warehouse: "PNQ-C", stock: 200, demand: 180 },
];

const warehouses = [
  { code: "BLR-A", name: "Bangalore Main", city: "Bangalore", country: "India" },
  { code: "PNQ-C", name: "Pune Central", city: "Pune", country: "India" },
  { code: "DEL-B", name: "Delhi Branch", city: "Delhi", country: "India" },
];

const kpis = [
  { date: "2025-08-20", stock: 300, demand: 280 },
  { date: "2025-08-21", stock: 350, demand: 300 },
  { date: "2025-08-22", stock: 320, demand: 310 },
  { date: "2025-08-23", stock: 310, demand: 290 },
  { date: "2025-08-24", stock: 330, demand: 300 },
  { date: "2025-08-25", stock: 360, demand: 320 },
  { date: "2025-08-26", stock: 340, demand: 330 },
];

export { products, warehouses, kpis };
