const products = [
  { itemCode: "VMP-7041", name: "3CP meal tray with lid", packingSize: 400, pieceRateInr: 12.5 },
  { itemCode: "VMP-BUF-09", name: "Buffer plate premium", packingSize: 250, pieceRateInr: 8.75 },
];
const productGrid = document.getElementById("product-grid");
if (productGrid) productGrid.innerHTML = products.map((p) => `<article class="card"><strong>${p.itemCode}</strong><h2>${p.name}</h2><p>Pack ${p.packingSize} · ₹${p.pieceRateInr}/pc</p></article>`).join("");
const priceList = document.getElementById("price-list");
if (priceList) priceList.innerHTML = products.map((p) => `<tr><td>${p.itemCode}</td><td>${p.name}</td><td>${p.packingSize}</td><td>₹${p.pieceRateInr}</td></tr>`).join("");
console.info("VMP Core: Workspace matched with premium live production specifications.");
