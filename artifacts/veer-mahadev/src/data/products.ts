export const categories = [
  "All",
  "Cornstarch Meal Trays",
  "Cornstarch Containers",
  "Cornstarch Plates & Cutlery",
  "Biodegradable Glasses",
  "Meal Trays (PP)",
  "Hinged Boxes",
  "Bakery Boxes",
  "PP Containers",
];

export interface Product {
  id: string;
  sku: string;
  name: string;
  category: string;
  image: string;
  packSize: number;   // pieces per box
  boxRate: number;    // ₹ per box (standard wholesale, 1+ box)
  pcsRate: number;    // ₹ per piece (retail / reference rate)
}

// Tier pricing thresholds
export const TIER_FACTORY_MIN_BOXES = 5;
export const TIER_FACTORY_DISCOUNT = 0.92; // 8% off box rate

export function getTierPrice(product: Product, boxes: number) {
  const retailPerBox = +(product.pcsRate * product.packSize).toFixed(2);
  const bulkPerBox = product.boxRate;
  const factoryPerBox = Math.round(product.boxRate * TIER_FACTORY_DISCOUNT);
  const totalPcs = boxes * product.packSize;

  if (boxes >= TIER_FACTORY_MIN_BOXES) {
    const saving = Math.round((1 - factoryPerBox / retailPerBox) * 100);
    return { pricePerBox: factoryPerBox, tier: "factory" as const, label: `Factory Rate (${TIER_FACTORY_MIN_BOXES}+ boxes)`, totalPcs, saving };
  }
  const saving = Math.round((1 - bulkPerBox / retailPerBox) * 100);
  return { pricePerBox: bulkPerBox, tier: "bulk" as const, label: "Box Rate (1+ box)", totalPcs, saving };
}

export const products: Product[] = [
  // ─── CORNSTARCH MEAL TRAYS ───────────────────────────────────────────────
  { id: "7041", sku: "7041", name: "3CP MEAL TRAY WITH LID", category: "Cornstarch Meal Trays", image: "https://i.postimg.cc/HnYSDKKj/3CP-MEAL-TRAY-WITH-LID.jpg", packSize: 400, boxRate: 4600, pcsRate: 12.5 },
  { id: "7043", sku: "7043", name: "4CP MEAL TRAY WITH LID", category: "Cornstarch Meal Trays", image: "https://i.postimg.cc/HnYSDKKj/3CP-MEAL-TRAY-WITH-LID.jpg", packSize: 300, boxRate: 4890, pcsRate: 17.3 },
  { id: "7045", sku: "7045", name: "5CP MEAL TRAY WITH LID", category: "Cornstarch Meal Trays", image: "https://i.postimg.cc/HnYSDKKj/3CP-MEAL-TRAY-WITH-LID.jpg", packSize: 300, boxRate: 5055, pcsRate: 17.85 },
  { id: "7048", sku: "7048", name: "8CP MEAL TRAY WITH LID", category: "Cornstarch Meal Trays", image: "https://i.postimg.cc/HnYSDKKj/3CP-MEAL-TRAY-WITH-LID.jpg", packSize: 200, boxRate: 4700, pcsRate: 25.5 },

  // ─── CORNSTARCH CONTAINERS ───────────────────────────────────────────────
  { id: "7063", sku: "7063", name: "350ML ROUND CONTAINER WITH LID", category: "Cornstarch Containers", image: "https://i.postimg.cc/N0pJSSrf/CORNSTARCH-ROUND.jpg", packSize: 800, boxRate: 3760, pcsRate: 5.7 },
  { id: "7065", sku: "7065", name: "500ML ROUND CONTAINER WITH LID", category: "Cornstarch Containers", image: "https://i.postimg.cc/N0pJSSrf/CORNSTARCH-ROUND.jpg", packSize: 800, boxRate: 4800, pcsRate: 7 },
  { id: "7084", sku: "7084", name: "500ML RECTANGLE CONTAINER WITH LID", category: "Cornstarch Containers", image: "https://i.postimg.cc/N0pJSSrf/CORNSTARCH-ROUND.jpg", packSize: 600, boxRate: 4170, pcsRate: 7.95 },
  { id: "7086", sku: "7086", name: "750ML RECTANGLE CONTAINER WITH LID", category: "Cornstarch Containers", image: "https://i.postimg.cc/N0pJSSrf/CORNSTARCH-ROUND.jpg", packSize: 600, boxRate: 4650, pcsRate: 8.75 },
  { id: "7087", sku: "7087", name: "1000ML RECTANGLE CONTAINER WITH LID", category: "Cornstarch Containers", image: "https://i.postimg.cc/N0pJSSrf/CORNSTARCH-ROUND.jpg", packSize: 600, boxRate: 5130, pcsRate: 9.55 },

  // ─── CORNSTARCH PLATES & CUTLERY ─────────────────────────────────────────
  { id: "7055", sku: "7055", name: "160MM SPOON", category: "Cornstarch Plates & Cutlery", image: "https://i.postimg.cc/T3gX4DNX/spoon_boidegrade.jpg", packSize: 3000, boxRate: 3900, pcsRate: 2.3 },
  { id: "7001E", sku: "7001E", name: "180ML BOWL ECO", category: "Cornstarch Plates & Cutlery", image: "https://i.postimg.cc/gk2vBjHZ/eco-bowl.jpg", packSize: 2400, boxRate: 3072, pcsRate: 3.28 },
  { id: "7003", sku: "7003", name: "250ML BOWL", category: "Cornstarch Plates & Cutlery", image: "https://i.postimg.cc/gk2vBjHZ/eco-bowl.jpg", packSize: 1800, boxRate: 4356, pcsRate: 3.60 },
  { id: "7016", sku: "7016", name: "6\" ROUND PLATE", category: "Cornstarch Plates & Cutlery", image: "https://i.postimg.cc/1RWyXxZh/boidgrade_plate.jpg", packSize: 2000, boxRate: 3760, pcsRate: 2.88 },
  { id: "7018", sku: "7018", name: "9\" ROUND PLATE", category: "Cornstarch Plates & Cutlery", image: "https://i.postimg.cc/1RWyXxZh/boidgrade_plate.jpg", packSize: 800, boxRate: 3640, pcsRate: 5.55 },
  { id: "7019", sku: "7019", name: "9\" 3CP ROUND PLATE", category: "Cornstarch Plates & Cutlery", image: "https://i.postimg.cc/7LLjdSyd/3_compartment_plate_round.png", packSize: 800, boxRate: 3640, pcsRate: 5.55 },
  { id: "7021", sku: "7021", name: "10\" ROUND PLATE", category: "Cornstarch Plates & Cutlery", image: "https://i.postimg.cc/1RWyXxZh/boidgrade_plate.jpg", packSize: 600, boxRate: 3510, pcsRate: 6.85 },
  { id: "7022", sku: "7022", name: "10\" 3CP ROUND PLATE", category: "Cornstarch Plates & Cutlery", image: "https://i.postimg.cc/7LLjdSyd/3_compartment_plate_round.png", packSize: 600, boxRate: 3510, pcsRate: 6.85 },
  { id: "7023", sku: "7023", name: "11\" ROUND PLATE", category: "Cornstarch Plates & Cutlery", image: "https://i.postimg.cc/1RWyXxZh/boidgrade_plate.jpg", packSize: 500, boxRate: 3550, pcsRate: 8.1 },
  { id: "7025", sku: "7025", name: "11\" 4CP ROUND PLATE", category: "Cornstarch Plates & Cutlery", image: "https://i.postimg.cc/Y2GDCmmh/bio_plate_4cp.jpg", packSize: 500, boxRate: 3550, pcsRate: 8.1 },
  { id: "7026", sku: "7026", name: "12\" ROUND PLATE", category: "Cornstarch Plates & Cutlery", image: "https://i.postimg.cc/1RWyXxZh/boidgrade_plate.jpg", packSize: 500, boxRate: 4275, pcsRate: 9.55 },
  { id: "7027", sku: "7027", name: "12\" 4CP ROUND PLATE", category: "Cornstarch Plates & Cutlery", image: "https://i.postimg.cc/Y2GDCmmh/bio_plate_4cp.jpg", packSize: 500, boxRate: 4275, pcsRate: 9.55 },
  { id: "7032E", sku: "7032E", name: "3CP TRAY ECO", category: "Cornstarch Plates & Cutlery", image: "https://i.postimg.cc/7LLjdSyd/3_compartment_plate_round.png", packSize: 500, boxRate: 3010, pcsRate: 7.02 },
  { id: "7034E", sku: "7034E", name: "4CP TRAY ECO", category: "Cornstarch Plates & Cutlery", image: "https://i.postimg.cc/Y2GDCmmh/bio_plate_4cp.jpg", packSize: 500, boxRate: 4550, pcsRate: 10.1 },
  { id: "7034", sku: "7034", name: "4CP TRAY", category: "Cornstarch Plates & Cutlery", image: "https://i.postimg.cc/7LLjdSyd/3_compartment_plate_round.png", packSize: 400, boxRate: 3800, pcsRate: 10.5 },
  { id: "7038E", sku: "7038E", name: "6CP TRAY ECO", category: "Cornstarch Plates & Cutlery", image: "https://i.postimg.cc/wvGbqs05/6CP-PLATE-TRAY-ECO.jpg", packSize: 400, boxRate: 4120, pcsRate: 11.3 },
  { id: "7038", sku: "7038", name: "6CP TRAY", category: "Cornstarch Plates & Cutlery", image: "https://i.postimg.cc/wvGbqs05/6CP-PLATE-TRAY-ECO.jpg", packSize: 400, boxRate: 4240, pcsRate: 11.6 },

  // ─── BIODEGRADABLE GLASSES & BOWLS ───────────────────────────────────────
  { id: "7201", sku: "7201", name: "100ML BIODEGRADABLE ICECUP MILKY", category: "Biodegradable Glasses", image: "https://i.postimg.cc/nhT88Mbd/BIODEGRADABLE-ICECUP-MILKY.jpg", packSize: 6200, boxRate: 4092, pcsRate: 1.66 },
  { id: "7202", sku: "7202", name: "200ML BIODEGRADABLE GLASS MILKY", category: "Biodegradable Glasses", image: "https://i.postimg.cc/nhT88Mbd/BIODEGRADABLE-ICECUP-MILKY.jpg", packSize: 5000, boxRate: 3300, pcsRate: 1.66 },
  { id: "7203", sku: "7203", name: "250ML BIODEGRADABLE GLASS MILKY", category: "Biodegradable Glasses", image: "https://i.postimg.cc/nhT88Mbd/BIODEGRADABLE-ICECUP-MILKY.jpg", packSize: 5000, boxRate: 4100, pcsRate: 1.82 },
  { id: "7204", sku: "7204", name: "300ML BIODEGRADABLE GLASS MILKY", category: "Biodegradable Glasses", image: "https://i.postimg.cc/nhT88Mbd/BIODEGRADABLE-ICECUP-MILKY.jpg", packSize: 5000, boxRate: 4900, pcsRate: 1.98 },
  { id: "7213", sku: "7213", name: "350ML BIODEGRADABLE GLASS 91DIA", category: "Biodegradable Glasses", image: "https://i.postimg.cc/nhT88Mbd/BIODEGRADABLE-ICECUP-MILKY.jpg", packSize: 3600, boxRate: 5580, pcsRate: 2.55 },
  { id: "7202N", sku: "7202N", name: "200ML COMPOSTABLE SPIRAL GLASS TRANS", category: "Biodegradable Glasses", image: "https://i.postimg.cc/vBf3sSxt/COMPOSTABLE-SPIRAL-TRANS.jpg", packSize: 5000, boxRate: 3650, pcsRate: 1.73 },
  { id: "7203N", sku: "7203N", name: "250ML COMPOSTABLE SPIRAL GLASS TRANS", category: "Biodegradable Glasses", image: "https://i.postimg.cc/vBf3sSxt/COMPOSTABLE-SPIRAL-TRANS.jpg", packSize: 5000, boxRate: 4650, pcsRate: 1.93 },
  { id: "7204N", sku: "7204N", name: "300ML COMPOSTABLE SPIRAL GLASS TRANS", category: "Biodegradable Glasses", image: "https://i.postimg.cc/vBf3sSxt/COMPOSTABLE-SPIRAL-TRANS.jpg", packSize: 5000, boxRate: 5500, pcsRate: 2.1 },
  { id: "7202N2", sku: "7202N2", name: "300ML COMPOSTABLE PLAIN GLASS TRANS 5G", category: "Biodegradable Glasses", image: "https://i.postimg.cc/vBf3sSxt/COMPOSTABLE-SPIRAL-TRANS.jpg", packSize: 3200, boxRate: 6170, pcsRate: 2.19 },
  { id: "7221", sku: "7221", name: "350ML BIODEGRADABLE GLASS 95DIA", category: "Biodegradable Glasses", image: "https://i.postimg.cc/vBf3sSxt/COMPOSTABLE-SPIRAL-TRANS.jpg", packSize: 3600, boxRate: 5940, pcsRate: 2.65 },
  { id: "7221N", sku: "7221N", name: "350ML BIODEGRADABLE GLASS TRANS 95DIA", category: "Biodegradable Glasses", image: "https://i.postimg.cc/vBf3sSxt/COMPOSTABLE-SPIRAL-TRANS.jpg", packSize: 3600, boxRate: 6480, pcsRate: 2.8 },
  { id: "7222", sku: "7222", name: "400ML BIODEGRADABLE GLASS WINE", category: "Biodegradable Glasses", image: "https://i.postimg.cc/vBf3sSxt/COMPOSTABLE-SPIRAL-TRANS.jpg", packSize: 3600, boxRate: 4932, pcsRate: 2.37 },

  // ─── MEAL TRAYS (PP) ─────────────────────────────────────────────────────
  { id: "5601", sku: "5601", name: "2CP MEAL TREY BLACK / MILKY", category: "Meal Trays (PP)", image: "https://i.postimg.cc/Wzs6PpP7/2CP-MEAL-TREY-BLACK.jpg", packSize: 1000, boxRate: 7650, pcsRate: 8.65 },
  { id: "5602", sku: "5602", name: "3CP MEAL TREY BLACK / MILKY", category: "Meal Trays (PP)", image: "https://i.postimg.cc/mzn37dTG/3CP-MEAL-TRAY-WITH-LID.jpg", packSize: 1200, boxRate: 9180, pcsRate: 8.65 },
  { id: "5602R", sku: "5602R", name: "3CP MEAL TRAY RED / BLACK", category: "Meal Trays (PP)", image: "https://i.postimg.cc/26GvP2pz/3CP-MEAL-TRAY-red.jpg", packSize: 1200, boxRate: 9180, pcsRate: 8.65 },
  { id: "5612", sku: "5612", name: "3CP MEAL TREY LARGE BLACK / MILKY", category: "Meal Trays (PP)", image: "https://i.postimg.cc/mzn37dTG/3CP-MEAL-TRAY-WITH-LID.jpg", packSize: 800, boxRate: 7200, pcsRate: 10 },
  { id: "5610", sku: "5610", name: "3CP MEAL TRAY XL BLACK / MILKY", category: "Meal Trays (PP)", image: "https://i.postimg.cc/mzn37dTG/3CP-MEAL-TRAY-WITH-LID.jpg", packSize: 800, boxRate: 8240, pcsRate: 11.3 },
  { id: "5604", sku: "5604", name: "4CP MEAL TREY BLACK / MILKY", category: "Meal Trays (PP)", image: "https://i.postimg.cc/8kWYt9Pf/5-compartment-plastic-container.png", packSize: 800, boxRate: 8000, pcsRate: 11 },
  { id: "5631A", sku: "5631A", name: "5CP PLATTER MEAL TRAY (450 pcs)", category: "Meal Trays (PP)", image: "https://i.postimg.cc/8kWYt9Pf/5-compartment-plastic-container.png", packSize: 450, boxRate: 4185, pcsRate: 10.3 },
  { id: "5631B", sku: "5631B", name: "5CP PLATTER MEAL TRAY (900 pcs)", category: "Meal Trays (PP)", image: "https://i.postimg.cc/8kWYt9Pf/5-compartment-plastic-container.png", packSize: 900, boxRate: 8370, pcsRate: 10.3 },
  { id: "5613", sku: "5613", name: "5CP MINI MEAL TREY BLACK / MILKY", category: "Meal Trays (PP)", image: "https://i.postimg.cc/8kWYt9Pf/5-compartment-plastic-container.png", packSize: 800, boxRate: 8560, pcsRate: 11.7 },
  { id: "5606", sku: "5606", name: "5CP MEAL TREY BLACK / MILKY", category: "Meal Trays (PP)", image: "https://i.postimg.cc/8kWYt9Pf/5-compartment-plastic-container.png", packSize: 900, boxRate: 9720, pcsRate: 11.8 },
  { id: "5619", sku: "5619", name: "5CP MEAL TREY BLACK / MILKY STAR NEW", category: "Meal Trays (PP)", image: "https://i.postimg.cc/8kWYt9Pf/5-compartment-plastic-container.png", packSize: 800, boxRate: 8640, pcsRate: 11.8 },
  { id: "5615", sku: "5615", name: "6CP MEAL TREY BLACK / MILKY", category: "Meal Trays (PP)", image: "https://i.postimg.cc/8kWYt9Pf/5-compartment-plastic-container.png", packSize: 800, boxRate: 9760, pcsRate: 13.2 },
  { id: "5621", sku: "5621", name: "5CP MEAL TREY BOTTOM SEALABLE", category: "Meal Trays (PP)", image: "https://i.postimg.cc/8kWYt9Pf/5-compartment-plastic-container.png", packSize: 750, boxRate: 4950, pcsRate: 7.6 },
  { id: "5627", sku: "5627", name: "HINGED BOX PP 500ML", category: "Meal Trays (PP)", image: "https://i.postimg.cc/fyDvCkBs/transperent-box.png", packSize: 800, boxRate: 5520, pcsRate: 7.9 },
  { id: "5628", sku: "5628", name: "HINGED BOX PP 800ML", category: "Meal Trays (PP)", image: "https://i.postimg.cc/fyDvCkBs/transperent-box.png", packSize: 800, boxRate: 6240, pcsRate: 8.8 },
  { id: "5629", sku: "5629", name: "HINGED BOX PP 1000ML", category: "Meal Trays (PP)", image: "https://i.postimg.cc/fyDvCkBs/transperent-box.png", packSize: 800, boxRate: 7040, pcsRate: 9.8 },

  // ─── HINGED BOXES ────────────────────────────────────────────────────────
  { id: "1406", sku: "1406", name: "HINGED SAUCE CUP SQUARE 35ML", category: "Hinged Boxes", image: "https://i.postimg.cc/C1R0mB7t/HINGED-SAUCE-CUP-SQUARE.jpg", packSize: 7500, boxRate: 4125, pcsRate: 1.55 },
  { id: "1407", sku: "1407", name: "HINGED SAUCE CUP SQUARE 70ML", category: "Hinged Boxes", image: "https://i.postimg.cc/C1R0mB7t/HINGED-SAUCE-CUP-SQUARE.jpg", packSize: 5400, boxRate: 4536, pcsRate: 1.84 },
  { id: "1408", sku: "1408", name: "HINGED SAUCE CUP OVAL 35ML", category: "Hinged Boxes", image: "https://i.postimg.cc/XvXtbM5q/HINGED-SAUCE-CUP-OVAL.jpg", packSize: 7200, boxRate: 4248, pcsRate: 1.59 },
  { id: "1409", sku: "1409", name: "HINGED SAUCE CUP OVAL 70ML", category: "Hinged Boxes", image: "https://i.postimg.cc/XvXtbM5q/HINGED-SAUCE-CUP-OVAL.jpg", packSize: 4800, boxRate: 3792, pcsRate: 1.79 },
  { id: "1416", sku: "1416", name: "HINGED SAUCE CUP ROUND 2OZ", category: "Hinged Boxes", image: "https://i.postimg.cc/cCWD6Pv3/HINGED-SAUCE-CUP-round.jpg", packSize: 5400, boxRate: 5562, pcsRate: 2.03 },
  { id: "1417", sku: "1417", name: "HINGED SAUCE CUP ROUND 3OZ", category: "Hinged Boxes", image: "https://i.postimg.cc/cCWD6Pv3/HINGED-SAUCE-CUP-round.jpg", packSize: 3500, boxRate: 5005, pcsRate: 2.43 },
  { id: "1418", sku: "1418", name: "HINGED SAUCE CUP OVAL 85ML", category: "Hinged Boxes", image: "https://i.postimg.cc/XvXtbM5q/HINGED-SAUCE-CUP-OVAL.jpg", packSize: 4050, boxRate: 4253, pcsRate: 2.05 },
  { id: "1410", sku: "1410", name: "HINGED ROUND CONTAINER 120ML", category: "Hinged Boxes", image: "https://i.postimg.cc/cCWD6Pv3/HINGED-SAUCE-CUP-round.jpg", packSize: 3150, boxRate: 4788, pcsRate: 2.52 },
  { id: "1405", sku: "1405", name: "HINGED SAUCE CUP 2CP", category: "Hinged Boxes", image: "https://i.postimg.cc/3xpcBfDC/Sauce-Cup-2cp.webp", packSize: 2500, boxRate: 4400, pcsRate: 2.76 },
  { id: "1411", sku: "1411", name: "HINGED BOX 80X60MM", category: "Hinged Boxes", image: "https://i.postimg.cc/fyDvCkBs/transperent-box.png", packSize: 6000, boxRate: 3660, pcsRate: 1.61 },
  { id: "1412", sku: "1412", name: "HINGED BOX 80X80MM", category: "Hinged Boxes", image: "https://i.postimg.cc/fyDvCkBs/transperent-box.png", packSize: 5100, boxRate: 4896, pcsRate: 1.96 },
  { id: "1413", sku: "1413", name: "HINGED BOX 100ML", category: "Hinged Boxes", image: "https://i.postimg.cc/fyDvCkBs/transperent-box.png", packSize: 2700, boxRate: 3780, pcsRate: 2.4 },
  { id: "1420", sku: "1420", name: "HINGED BOX 150ML", category: "Hinged Boxes", image: "https://i.postimg.cc/fyDvCkBs/transperent-box.png", packSize: 1800, boxRate: 3870, pcsRate: 3.15 },
  { id: "1421", sku: "1421", name: "HINGED BOX 250ML", category: "Hinged Boxes", image: "https://i.postimg.cc/fyDvCkBs/transperent-box.png", packSize: 1500, boxRate: 4500, pcsRate: 4 },
  { id: "1422", sku: "1422", name: "HINGED BOX 375ML", category: "Hinged Boxes", image: "https://i.postimg.cc/fyDvCkBs/transperent-box.png", packSize: 1500, boxRate: 5055, pcsRate: 4.37 },
  { id: "1423", sku: "1423", name: "HINGED BOX 500ML", category: "Hinged Boxes", image: "https://i.postimg.cc/fyDvCkBs/transperent-box.png", packSize: 1500, boxRate: 5625, pcsRate: 4.75 },
  { id: "1425", sku: "1425", name: "HINGED BOX 500ML FLAT", category: "Hinged Boxes", image: "https://i.postimg.cc/fyDvCkBs/transperent-box.png", packSize: 900, boxRate: 4374, pcsRate: 5.86 },
  { id: "1427", sku: "1427", name: "HINGED BOX 600ML", category: "Hinged Boxes", image: "https://i.postimg.cc/fyDvCkBs/transperent-box.png", packSize: 900, boxRate: 4725, pcsRate: 6.25 },
  { id: "1428", sku: "1428", name: "HINGED BOX 750ML", category: "Hinged Boxes", image: "https://i.postimg.cc/fyDvCkBs/transperent-box.png", packSize: 900, boxRate: 5400, pcsRate: 7 },
  { id: "1429", sku: "1429", name: "HINGED BOX 1000ML", category: "Hinged Boxes", image: "https://i.postimg.cc/fyDvCkBs/transperent-box.png", packSize: 900, boxRate: 6075, pcsRate: 7.75 },
  { id: "1430", sku: "1430", name: "HINGED BOX 1000ML FLAT", category: "Hinged Boxes", image: "https://i.postimg.cc/fyDvCkBs/transperent-box.png", packSize: 720, boxRate: 5940, pcsRate: 9.25 },
  { id: "1419", sku: "1419", name: "HINGED BOX 1000ML FLAT (1419)", category: "Hinged Boxes", image: "https://i.postimg.cc/fyDvCkBs/transperent-box.png", packSize: 600, boxRate: 4560, pcsRate: 8.6 },
  { id: "1431", sku: "1431", name: "HINGED BOX 1250ML", category: "Hinged Boxes", image: "https://i.postimg.cc/fyDvCkBs/transperent-box.png", packSize: 600, boxRate: 5238, pcsRate: 9.73 },
  { id: "1432", sku: "1432", name: "HINGED BOX 1500ML", category: "Hinged Boxes", image: "https://i.postimg.cc/fyDvCkBs/transperent-box.png", packSize: 600, boxRate: 5700, pcsRate: 10.5 },
  { id: "1434", sku: "1434", name: "HINGED BOX 2000ML", category: "Hinged Boxes", image: "https://i.postimg.cc/fyDvCkBs/transperent-box.png", packSize: 480, boxRate: 5640, pcsRate: 12.75 },
  { id: "1435", sku: "1435", name: "HINGED BOX 2250ML", category: "Hinged Boxes", image: "https://i.postimg.cc/fyDvCkBs/transperent-box.png", packSize: 480, boxRate: 6240, pcsRate: 14 },
  { id: "1421A", sku: "1421A", name: "HINGED BOX 250ML HI LID", category: "Hinged Boxes", image: "https://i.postimg.cc/J7TJs9Dp/HINGED-BOX-HI-LID.jpg", packSize: 1500, boxRate: 4500, pcsRate: 4 },
  { id: "1422A", sku: "1422A", name: "HINGED BOX 375ML HI LID", category: "Hinged Boxes", image: "https://i.postimg.cc/J7TJs9Dp/HINGED-BOX-HI-LID.jpg", packSize: 1500, boxRate: 5055, pcsRate: 4.37 },
  { id: "1423A", sku: "1423A", name: "HINGED BOX 500ML HI LID", category: "Hinged Boxes", image: "https://i.postimg.cc/J7TJs9Dp/HINGED-BOX-HI-LID.jpg", packSize: 1500, boxRate: 5625, pcsRate: 4.75 },
  { id: "1427A", sku: "1427A", name: "HINGED BOX 600ML HI LID", category: "Hinged Boxes", image: "https://i.postimg.cc/J7TJs9Dp/HINGED-BOX-HI-LID.jpg", packSize: 900, boxRate: 4950, pcsRate: 6.5 },
  { id: "1428A", sku: "1428A", name: "HINGED BOX 750ML HI LID", category: "Hinged Boxes", image: "https://i.postimg.cc/J7TJs9Dp/HINGED-BOX-HI-LID.jpg", packSize: 900, boxRate: 5400, pcsRate: 7 },
  { id: "1429A", sku: "1429A", name: "HINGED BOX 1000ML HI LID", category: "Hinged Boxes", image: "https://i.postimg.cc/J7TJs9Dp/HINGED-BOX-HI-LID.jpg", packSize: 900, boxRate: 6300, pcsRate: 8 },
  { id: "1431A", sku: "1431A", name: "HINGED BOX 1250ML HI LID", category: "Hinged Boxes", image: "https://i.postimg.cc/J7TJs9Dp/HINGED-BOX-HI-LID.jpg", packSize: 600, boxRate: 5550, pcsRate: 10.25 },
  { id: "1432A", sku: "1432A", name: "HINGED BOX 1500ML HI LID", category: "Hinged Boxes", image: "https://i.postimg.cc/J7TJs9Dp/HINGED-BOX-HI-LID.jpg", packSize: 600, boxRate: 5700, pcsRate: 10.5 },
  { id: "1434A", sku: "1434A", name: "HINGED BOX 2000ML HI LID", category: "Hinged Boxes", image: "https://i.postimg.cc/J7TJs9Dp/HINGED-BOX-HI-LID.jpg", packSize: 480, boxRate: 5640, pcsRate: 12.75 },
  { id: "1435A", sku: "1435A", name: "HINGED BOX 2250ML HI LID", category: "Hinged Boxes", image: "https://i.postimg.cc/J7TJs9Dp/HINGED-BOX-HI-LID.jpg", packSize: 480, boxRate: 6240, pcsRate: 14 },
  { id: "1436", sku: "1436", name: "HINGED BOX 4CP 35H DRY FRUIT", category: "Hinged Boxes", image: "https://i.postimg.cc/FFndr3wX/transperent-box-packing-of-dry-fruits-4cp.jpg", packSize: 600, boxRate: 7050, pcsRate: 12.75 },
  { id: "1437", sku: "1437", name: "HINGED BOX 4CP 52H DRY FRUIT", category: "Hinged Boxes", image: "https://i.postimg.cc/FFndr3wX/transperent-box-packing-of-dry-fruits-4cp.jpg", packSize: 600, boxRate: 7710, pcsRate: 13.85 },
  { id: "1481", sku: "1481", name: "HINGED BOX 190X140X42MM", category: "Hinged Boxes", image: "https://i.postimg.cc/FFndr3wX/transperent-box-packing-of-dry-fruits-4cp.jpg", packSize: 600, boxRate: 3900, pcsRate: 7.5 },
  { id: "1482", sku: "1482", name: "HINGED BOX 190X140X52MM", category: "Hinged Boxes", image: "https://i.postimg.cc/FFndr3wX/transperent-box-packing-of-dry-fruits-4cp.jpg", packSize: 600, boxRate: 4170, pcsRate: 7.95 },
  { id: "1483", sku: "1483", name: "HINGED BOX 190X140X63MM", category: "Hinged Boxes", image: "https://i.postimg.cc/FFndr3wX/transperent-box-packing-of-dry-fruits-4cp.jpg", packSize: 600, boxRate: 4452, pcsRate: 8.42 },
  { id: "1485", sku: "1485", name: "HINGED BOX 190X140X90MM", category: "Hinged Boxes", image: "https://i.postimg.cc/FFndr3wX/transperent-box-packing-of-dry-fruits-4cp.jpg", packSize: 600, boxRate: 4860, pcsRate: 9.1 },

  // ─── BAKERY BOXES ────────────────────────────────────────────────────────
  { id: "1404", sku: "1404", name: "SANDWICH BOX MED", category: "Bakery Boxes", image: "https://i.postimg.cc/Rh5Bhxcj/SANDWICH-BOX.jpg", packSize: 1260, boxRate: 4410, pcsRate: 4.5 },
  { id: "1402", sku: "1402", name: "BURGER BOX", category: "Bakery Boxes", image: "https://i.postimg.cc/Rh5Bhxcj/SANDWICH-BOX.jpg", packSize: 1500, boxRate: 5250, pcsRate: 4.5 },
  { id: "1414", sku: "1414", name: "HINGED BOX CUP CAKE DOME", category: "Bakery Boxes", image: "https://i.postimg.cc/vm4FvZh2/HINGED-BOX-CUP-CAKE-DOME.jpg", packSize: 2850, boxRate: 4560, pcsRate: 2.6 },
  { id: "1415", sku: "1415", name: "HINGED BOX BROWNIE", category: "Bakery Boxes", image: "https://i.postimg.cc/gjT3840z/HINGED-BOX-BROWNIE.jpg", packSize: 2250, boxRate: 5288, pcsRate: 3.35 },
  { id: "1438", sku: "1438", name: "HINGED BOX 200X110X10", category: "Bakery Boxes", image: "https://i.postimg.cc/V67tP4nk/HINGED-BOX.jpg", packSize: 900, boxRate: 6120, pcsRate: 7.8 },
  { id: "1439", sku: "1439", name: "HINGED BOX 234X114X40 CAKE", category: "Bakery Boxes", image: "https://i.postimg.cc/jjtnWBhJ/HINGED-BOX-CAKE.jpg", packSize: 900, boxRate: 4950, pcsRate: 6.5 },
  { id: "1440", sku: "1440", name: "HINGED BOX 200X110X65 CAKE", category: "Bakery Boxes", image: "https://i.postimg.cc/jjtnWBhJ/HINGED-BOX-CAKE.jpg", packSize: 1200, boxRate: 5100, pcsRate: 5.25 },
  { id: "1441", sku: "1441", name: "HINGED BOX 190X110X60 CAKE", category: "Bakery Boxes", image: "https://i.postimg.cc/jjtnWBhJ/HINGED-BOX-CAKE.jpg", packSize: 1400, boxRate: 5320, pcsRate: 4.8 },
  { id: "1442", sku: "1442", name: "HINGED BOX 195X110X67 CAKE TRIANGLE", category: "Bakery Boxes", image: "https://i.postimg.cc/C5qxr4Ng/HINGED-BOX-CAKE-TRINGLE.jpg", packSize: 1200, boxRate: 5100, pcsRate: 5.25 },
  { id: "1443", sku: "1443", name: "HINGED BOX 235X110X60 BIG CAKE", category: "Bakery Boxes", image: "https://i.postimg.cc/jjtnWBhJ/HINGED-BOX-CAKE.jpg", packSize: 900, boxRate: 4203, pcsRate: 5.67 },
  { id: "1444", sku: "1444", name: "HINGED BOX 180X150X60 2 CUP CAKE", category: "Bakery Boxes", image: "https://i.postimg.cc/RCW5tRGY/HINGED-BOX-2-CUP-CAKE.webp", packSize: 1500, boxRate: 4425, pcsRate: 3.95 },
  { id: "1445", sku: "1445", name: "HINGED BOX 155X155X60 4 CUP CAKE", category: "Bakery Boxes", image: "https://i.postimg.cc/kGKTcB2b/HINGED-BOX-4-CUP-CAKE.jpg", packSize: 900, boxRate: 5265, pcsRate: 6.85 },
  { id: "1446", sku: "1446", name: "HINGED BOX 215X160X60 6 CUP CAKE", category: "Bakery Boxes", image: "https://i.postimg.cc/cJzTGQYv/6cp-cup-cake-hinged-container.webp", packSize: 500, boxRate: 4000, pcsRate: 9 },

  // ─── PP CONTAINERS ───────────────────────────────────────────────────────
  { id: "1356", sku: "1356", name: "PET ROUND CONTAINER 1000ML", category: "PP Containers", image: "https://i.postimg.cc/cJzTGQYv/6cp-cup-cake-hinged-container.webp", packSize: 1000, boxRate: 5050, pcsRate: 6.05 },
  { id: "1357", sku: "1357", name: "PET ROUND CONTAINER 1200ML", category: "PP Containers", image: "https://i.postimg.cc/L6kP3z8x/PET-ROUND-CONTAINER-LID.jpg", packSize: 1000, boxRate: 5550, pcsRate: 6.55 },
  { id: "1241", sku: "1241", name: "PET ROUND CONTAINER LID 120DIA", category: "PP Containers", image: "https://i.postimg.cc/L6kP3z8x/PET-ROUND-CONTAINER-LID.jpg", packSize: 2000, boxRate: 2520, pcsRate: 2.26 },
  { id: "5411", sku: "5411", name: "PP ROUND CONTAINER 200ML", category: "PP Containers", image: "https://i.postimg.cc/L6kP3z8x/PET-ROUND-CONTAINER-LID.jpg", packSize: 2000, boxRate: 3200, pcsRate: 2.6 },
  { id: "5412", sku: "5412", name: "PP ROUND CONTAINER 300ML", category: "PP Containers", image: "https://i.postimg.cc/L6kP3z8x/PET-ROUND-CONTAINER-LID.jpg", packSize: 2000, boxRate: 3200, pcsRate: 2.6 },
  { id: "5414", sku: "5414", name: "PP ROUND CONTAINER 500ML", category: "PP Containers", image: "https://i.postimg.cc/L6kP3z8x/PET-ROUND-CONTAINER-LID.jpg", packSize: 2000, boxRate: 5320, pcsRate: 3.66 },
  { id: "5415", sku: "5415", name: "PP ROUND CONTAINER 750ML", category: "PP Containers", image: "https://i.postimg.cc/L6kP3z8x/PET-ROUND-CONTAINER-LID.jpg", packSize: 2000, boxRate: 6400, pcsRate: 4.2 },
  { id: "5416", sku: "5416", name: "PP ROUND CONTAINER 1000ML", category: "PP Containers", image: "https://i.postimg.cc/L6kP3z8x/PET-ROUND-CONTAINER-LID.jpg", packSize: 1000, boxRate: 4260, pcsRate: 5.26 },
  { id: "5417", sku: "5417", name: "PP ROUND CONTAINER 1200ML", category: "PP Containers", image: "https://i.postimg.cc/L6kP3z8x/PET-ROUND-CONTAINER-LID.jpg", packSize: 1000, boxRate: 4800, pcsRate: 5.8 },
  { id: "5402", sku: "5402", name: "PP CONTAINER FB 300ML BLACK / TRANSPARENT", category: "PP Containers", image: "https://i.postimg.cc/wM8thvKP/PP-CONTAINER-FB-BLACK.jpg", packSize: 2000, boxRate: 3840, pcsRate: 2.92 },
  { id: "5403", sku: "5403", name: "PP CONTAINER FB 400ML BLACK / TRANSPARENT", category: "PP Containers", image: "https://i.postimg.cc/wM8thvKP/PP-CONTAINER-FB-BLACK.jpg", packSize: 2000, boxRate: 4360, pcsRate: 3.18 },
  { id: "5404", sku: "5404", name: "PP CONTAINER FB 500ML BLACK / TRANSPARENT", category: "PP Containers", image: "https://i.postimg.cc/wM8thvKP/PP-CONTAINER-FB-BLACK.jpg", packSize: 2000, boxRate: 5460, pcsRate: 3.73 },
  { id: "5405", sku: "5405", name: "PP CONTAINER FB 650ML BLACK / TRANSPARENT", category: "PP Containers", image: "https://i.postimg.cc/wM8thvKP/PP-CONTAINER-FB-BLACK.jpg", packSize: 2000, boxRate: 6600, pcsRate: 4.3 },
  { id: "5451", sku: "5451", name: "PP ROUND CONTAINER LID 123DIA", category: "PP Containers", image: "https://i.postimg.cc/wM8thvKP/PP-CONTAINER-FB-BLACK.jpg", packSize: 2000, boxRate: 2800, pcsRate: 2.4 },
];
