import plate1 from "@assets/WhatsApp_Image_2026-02-19_at_2.53.32_PM_(1)_1781943190531.jpeg";
import plate2 from "@assets/buffer_plate_1781943190521.png";
import plate3 from "@assets/Gemini_Generated_Image_3i3drn3i3drn3i3d_1781943190524.png";
import plate4 from "@assets/Gemini_Generated_Image_6ygecv6ygecv6yge_1781943190526.png";
import plate5 from "@assets/Gemini_Generated_Image_cvbhz5cvbhz5cvbh_1781943190527.png";
import plate6 from "@assets/Gemini_Generated_Image_pc6kcjpc6kcjpc6k_1781943190527.png";

import cup1 from "@assets/Gemini_Generated_Image_1n8gj01n8gj01n8g_1781943190523.png";
import cup2 from "@assets/Gemini_Generated_Image_se5wdese5wdese5w_1781943190528.png";

import spoon1 from "@assets/Gemini_Generated_Image_4w8ebz4w8ebz4w8e_1781943190525.png";
import spoon2 from "@assets/Gemini_Generated_Image_urbcp8urbcp8urbc_1781943190531.png";

import bowl1 from "@assets/Gemini_Generated_Image_u6kq9du6kq9du6kq_1781943190529.png";
import container1 from "@assets/Gemini_Generated_Image_uoqce6uoqce6uoqc_1781943190530.png";

import foil1 from "@assets/61RfoU-3QHL._SL1080__1781943190518.jpg";
import butterPaper from "@assets/butter_paper_sheet_1781943190522.png";
import silverFoil from "@assets/foil_paper_sheet_1781943190523.png";

export const categories = [
  "All",
  "Disposable Plates",
  "Cups & Glasses",
  "Cutlery",
  "Bowls & Containers",
  "Packaging & Foils"
];

export interface Product {
  id: number;
  category: string;
  name: string;
  packSize: string;
  image: string;
}

export const products: Product[] = [
  { id: 1, category: "Disposable Plates", name: "Buffer Plate 13\"", packSize: "100 PCS PACK", image: plate1 },
  { id: 2, category: "Disposable Plates", name: "Buffer Plate (Round)", packSize: "25 PCS PACK", image: plate2 },
  { id: 3, category: "Disposable Plates", name: "3-Section Round Plate", packSize: "25 PCS PACK", image: plate3 },
  { id: 4, category: "Disposable Plates", name: "4-Section Round Plate", packSize: "25 PCS PACK", image: plate4 },
  { id: 5, category: "Disposable Plates", name: "Square Plate", packSize: "25 PCS PACK", image: plate5 },
  { id: 6, category: "Disposable Plates", name: "Round Plate (Bulk Pack)", packSize: "25 PCS PACK", image: plate6 },
  { id: 7, category: "Cups & Glasses", name: "Paper Cup with Sleeve", packSize: "50 PCS PACK", image: cup1 },
  { id: 8, category: "Cups & Glasses", name: "Lassi Cup (200ml)", packSize: "50 PCS PACK", image: cup2 },
  { id: 9, category: "Cutlery", name: "Disposable Spoon", packSize: "100 PCS PACK", image: spoon1 },
  { id: 10, category: "Cutlery", name: "Clear Spoon/Fork Set", packSize: "100 PCS PACK", image: spoon2 },
  { id: 11, category: "Bowls & Containers", name: "Small Round Bowl", packSize: "25 PCS PACK", image: bowl1 },
  { id: 12, category: "Bowls & Containers", name: "Clear Food Container", packSize: "100 PCS PACK", image: container1 },
  { id: 13, category: "Packaging & Foils", name: "Aluminium Foil Roll (Wrap On Silver 72m)", packSize: "1 ROLL", image: foil1 },
  { id: 14, category: "Packaging & Foils", name: "Butter Paper Sheets — Food Grade", packSize: "1 PACK", image: butterPaper },
  { id: 15, category: "Packaging & Foils", name: "Silver Foil Paper Sheets", packSize: "1 PACK", image: silverFoil },
];
