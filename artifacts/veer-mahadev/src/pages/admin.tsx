import { useState, useMemo, useEffect, useRef } from "react";
import { useAdmin } from "@/context/admin-context";
import { useCatalog } from "@/context/catalog-context";
import { categories, getTierPrice } from "@/data/products";
import type { Product } from "@/data/products";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  ShieldCheck, Search, RotateCcw, Save, X, Package2,
  Tag, Zap, AlertTriangle, ChevronDown, ChevronUp,
  Edit3, RefreshCw, BarChart3, Factory, Loader2, Globe
} from "lucide-react";
import { Link } from "wouter";

function fmt(n: number) { return n.toLocaleString("en-IN"); }

interface RowState {
  name: string;
  packSize: string;
  boxRate: string;
  pcsRate: string;
  image: string;
  dirty: boolean;
  saving: boolean;
}

function initRow(p: Product): RowState {
  return {
    name: p.name,
    packSize: String(p.packSize),
    boxRate: String(p.boxRate),
    pcsRate: String(p.pcsRate),
    image: p.image,
    dirty: false,
    saving: false,
  };
}

export default function Admin() {
  const { isAdmin, logout } = useAdmin();
  const { products, loading: catalogLoading, updateProduct, resetProduct, resetAll, isModified, modifiedCount } = useCatalog();
  const { toast } = useToast();

  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [rowStates, setRowStates] = useState<Record<string, RowState>>({});
  const [resettingAll, setResettingAll] = useState(false);
  const initializedRef = useRef(false);

  useEffect(() => {
    if (!catalogLoading && !initializedRef.current) {
      initializedRef.current = true;
      setRowStates(Object.fromEntries(products.map(p => [p.id, initRow(p)])));
    }
  }, [catalogLoading, products]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return products.filter(p => {
      const matchCat = activeCategory === "All" || p.category === activeCategory;
      const matchQ = !q || p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q);
      return matchCat && matchQ;
    });
  }, [products, search, activeCategory]);

  function setField(id: string, field: keyof RowState, value: string) {
    setRowStates(prev => ({ ...prev, [id]: { ...prev[id], [field]: value, dirty: true } }));
  }

  async function handleSave(p: Product) {
    const row = rowStates[p.id];
    if (!row) return;
    const packSize = parseFloat(row.packSize);
    const boxRate = parseFloat(row.boxRate);
    const pcsRate = parseFloat(row.pcsRate);
    if (!row.name.trim()) { toast({ title: "Name cannot be empty", variant: "destructive" }); return; }
    if (isNaN(packSize) || packSize < 1) { toast({ title: "Pack size must be a positive number", variant: "destructive" }); return; }
    if (isNaN(boxRate) || boxRate < 0) { toast({ title: "Box rate must be a positive number", variant: "destructive" }); return; }
    if (isNaN(pcsRate) || pcsRate < 0) { toast({ title: "PCS rate must be a positive number", variant: "destructive" }); return; }

    setRowStates(prev => ({ ...prev, [p.id]: { ...prev[p.id], saving: true } }));
    try {
      await updateProduct(p.id, {
        name: row.name.trim(),
        packSize,
        boxRate,
        pcsRate,
        image: row.image.trim() || p.image,
      });
      setRowStates(prev => ({ ...prev, [p.id]: { ...prev[p.id], dirty: false, saving: false } }));
      toast({ title: "✓ Saved & live", description: `${row.name.trim()} updated for all visitors instantly.` });
    } catch {
      setRowStates(prev => ({ ...prev, [p.id]: { ...prev[p.id], saving: false } }));
      toast({ title: "Save failed", description: "Could not reach server. Check your connection.", variant: "destructive" });
    }
  }

  async function handleReset(p: Product) {
    setRowStates(prev => ({ ...prev, [p.id]: { ...prev[p.id], saving: true } }));
    try {
      await resetProduct(p.id);
      setRowStates(prev => ({ ...prev, [p.id]: initRow({ ...p, ...(prev[p.id] ? {} : {}) }) }));
      const fresh = products.find(q => q.id === p.id) ?? p;
      setRowStates(prev => ({ ...prev, [p.id]: initRow(fresh) }));
      toast({ title: "Reset", description: `${p.name} restored to default values.` });
    } catch {
      setRowStates(prev => ({ ...prev, [p.id]: { ...prev[p.id], saving: false } }));
      toast({ title: "Reset failed", variant: "destructive" });
    }
  }

  async function handleResetAll() {
    setResettingAll(true);
    try {
      await resetAll();
      initializedRef.current = false;
      setRowStates(Object.fromEntries(products.map(p => [p.id, initRow(p)])));
      toast({ title: "All products reset to defaults" });
    } catch {
      toast({ title: "Reset all failed", variant: "destructive" });
    } finally {
      setResettingAll(false);
    }
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl border border-red-100 shadow-lg p-10 text-center max-w-sm">
          <div className="h-16 w-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShieldCheck className="h-8 w-8 text-red-500" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Admin Access Required</h2>
          <p className="text-sm text-gray-500 mb-6">Please log in with your admin credentials to access this panel.</p>
          <Link href="/" className="inline-flex items-center gap-2 bg-gray-900 text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-gray-800">
            ← Go to Website
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gray-900 text-white sticky top-0 z-40 shadow-xl">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-amber-500 flex items-center justify-center shrink-0">
              <ShieldCheck className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="font-extrabold text-sm leading-tight">Admin Dashboard</p>
              <p className="text-white/50 text-[10px]">Veer Mahadev Plastic — Product Manager</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {modifiedCount > 0 && (
              <span className="flex items-center gap-1.5 text-[10px] bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold px-2.5 py-1 rounded-full">
                <Globe className="h-3 w-3" /> {modifiedCount} live on site
              </span>
            )}
            <Link href="/" className="text-xs text-white/60 hover:text-white font-medium">← Website</Link>
            <button onClick={logout} className="text-xs text-white/50 hover:text-white font-medium">Logout</button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 space-y-5">

        {/* Stats bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { icon: Package2, label: "Total Products", value: products.length, color: "text-blue-600 bg-blue-50" },
            { icon: BarChart3, label: "Categories", value: categories.length - 1, color: "text-purple-600 bg-purple-50" },
            { icon: Globe, label: "Live Overrides", value: modifiedCount, color: modifiedCount > 0 ? "text-emerald-700 bg-emerald-50" : "text-gray-500 bg-gray-50" },
            { icon: Zap, label: "Showing", value: catalogLoading ? "…" : filtered.length, color: "text-amber-700 bg-amber-50" },
          ].map(({ icon: Icon, label, value, color }) => (
            <div key={label} className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3 shadow-sm">
              <div className={`h-9 w-9 rounded-lg flex items-center justify-center shrink-0 ${color}`}>
                <Icon className="h-4.5 w-4.5" />
              </div>
              <div>
                <p className="text-xl font-extrabold text-gray-900 leading-none">{value}</p>
                <p className="text-[10px] text-gray-400 mt-0.5">{label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Info banner */}
        <div className="flex items-start gap-3 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3">
          <Globe className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-bold text-emerald-800">Changes are saved to the database and reflect live for all visitors instantly.</p>
            <p className="text-xs text-emerald-700 mt-0.5">No cache — every visitor sees updated prices in real time across all devices.</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 space-y-3">
          <div className="flex gap-3 flex-wrap">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search name or SKU..." className="pl-9 h-9 text-sm border-gray-200" />
            </div>
            {modifiedCount > 0 && (
              <button onClick={handleResetAll} disabled={resettingAll}
                className="flex items-center gap-1.5 text-xs font-semibold text-red-600 hover:text-red-700 border border-red-200 hover:border-red-300 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-all disabled:opacity-50">
                {resettingAll ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RefreshCw className="h-3.5 w-3.5" />}
                Reset All to Defaults
              </button>
            )}
          </div>
          <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
            {categories.map(cat => (
              <button key={cat} onClick={() => setActiveCategory(cat)}
                className={`whitespace-nowrap text-xs font-semibold px-3 py-1.5 rounded-full border transition-all shrink-0 ${activeCategory === cat ? "bg-gray-900 text-white border-gray-900" : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"}`}>
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Product table / loading */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
            <p className="text-sm font-bold text-gray-900">
              {catalogLoading ? "Loading products…" : `${filtered.length} products`}
            </p>
            <p className="text-xs text-gray-400">Click a row to expand and edit</p>
          </div>

          {catalogLoading ? (
            <div className="flex flex-col items-center py-20 text-gray-400">
              <Loader2 className="h-8 w-8 animate-spin mb-3" />
              <p className="text-sm font-medium">Loading catalog from database…</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filtered.map(p => {
                const row = rowStates[p.id] ?? initRow(p);
                const modified = isModified(p.id);
                const expanded = expandedId === p.id;
                const { pricePerBox: factoryRate } = getTierPrice(p, 5);

                return (
                  <div key={p.id} className={`transition-colors ${modified ? "bg-amber-50/40" : "bg-white"} ${expanded ? "border-l-4 border-l-amber-500" : ""}`}>
                    {/* Collapsed row */}
                    <button
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50/80 text-left transition-colors"
                      onClick={() => setExpandedId(expanded ? null : p.id)}
                    >
                      <div className="h-10 w-10 rounded-lg bg-gray-100 border border-gray-200 overflow-hidden shrink-0 flex items-center justify-center">
                        <img src={row.image || p.image} alt={p.name} className="h-full w-full object-contain" loading="lazy" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-sm font-bold text-gray-900 truncate">{row.name}</p>
                          {modified && (
                            <span className="shrink-0 text-[9px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 px-1.5 py-0.5 rounded-full">LIVE</span>
                          )}
                          {row.dirty && (
                            <span className="shrink-0 text-[9px] font-bold bg-blue-100 text-blue-800 border border-blue-200 px-1.5 py-0.5 rounded-full">UNSAVED</span>
                          )}
                        </div>
                        <p className="text-[10px] text-gray-400 font-mono">{p.sku} · {p.packSize} pcs/box</p>
                      </div>
                      <div className="hidden sm:flex items-center gap-4 text-xs shrink-0">
                        <div className="text-right">
                          <p className="text-[10px] text-gray-400">Box Rate</p>
                          <p className="font-bold text-amber-700">₹{fmt(p.boxRate)}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] text-gray-400">Factory (5+)</p>
                          <p className="font-bold text-emerald-700">₹{fmt(factoryRate)}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] text-gray-400">Retail/pc</p>
                          <p className="font-bold text-gray-700">₹{p.pcsRate}</p>
                        </div>
                      </div>
                      <div className="ml-2 text-gray-400 shrink-0">
                        {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </div>
                    </button>

                    {/* Expanded edit form */}
                    {expanded && (
                      <div className="px-4 pb-5 pt-2 bg-white border-t border-gray-100">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                          <div className="lg:col-span-2 space-y-1">
                            <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">Product Name</label>
                            <Input value={row.name} onChange={e => setField(p.id, "name", e.target.value)}
                              className="h-9 text-sm font-semibold border-gray-200 focus-visible:ring-amber-300" />
                          </div>
                          <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-600 uppercase tracking-wider flex items-center gap-1.5">
                              <Package2 className="h-3 w-3" /> Pack Size (pcs/box)
                            </label>
                            <Input type="number" min={1} value={row.packSize} onChange={e => setField(p.id, "packSize", e.target.value)}
                              className="h-9 text-sm border-gray-200 focus-visible:ring-amber-300" />
                          </div>
                          <div className="space-y-1">
                            <label className="text-xs font-bold text-amber-700 uppercase tracking-wider flex items-center gap-1.5">
                              <Tag className="h-3 w-3" /> Box Rate ₹ (1+ box)
                            </label>
                            <Input type="number" min={0} step={0.01} value={row.boxRate} onChange={e => setField(p.id, "boxRate", e.target.value)}
                              className="h-9 text-sm border-amber-200 focus-visible:ring-amber-300 bg-amber-50/30" />
                            <p className="text-[10px] text-amber-600">Factory auto-calc: ₹{Math.round(parseFloat(row.boxRate || "0") * 0.92).toLocaleString("en-IN")}/box</p>
                          </div>
                          <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-600 uppercase tracking-wider flex items-center gap-1.5">
                              <Zap className="h-3 w-3" /> Retail ₹/pc
                            </label>
                            <Input type="number" min={0} step={0.01} value={row.pcsRate} onChange={e => setField(p.id, "pcsRate", e.target.value)}
                              className="h-9 text-sm border-gray-200 focus-visible:ring-amber-300" />
                          </div>
                          <div className="lg:col-span-3 space-y-1">
                            <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">Image URL</label>
                            <div className="flex gap-2 items-start">
                              <div className="h-9 w-9 rounded-lg bg-gray-100 border flex items-center justify-center shrink-0 overflow-hidden">
                                <img src={row.image || p.image} alt="preview" className="h-full w-full object-contain" />
                              </div>
                              <Input value={row.image} onChange={e => setField(p.id, "image", e.target.value)}
                                placeholder="https://i.postimg.cc/..."
                                className="flex-1 h-9 text-xs font-mono border-gray-200 focus-visible:ring-amber-300" />
                            </div>
                          </div>
                          <div className="lg:col-span-3 bg-gray-50 rounded-xl border border-gray-100 p-3 text-xs">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Live Price Preview</p>
                            <div className="flex gap-6 flex-wrap">
                              <div><span className="text-gray-500">Retail/pc: </span><span className="font-bold">₹{parseFloat(row.pcsRate || "0").toFixed(2)}</span></div>
                              <div><span className="text-amber-600">Box Rate: </span><span className="font-bold text-amber-900">₹{fmt(parseFloat(row.boxRate || "0"))}/box</span></div>
                              <div><span className="text-emerald-600">Factory (5+): </span><span className="font-bold text-emerald-900">₹{Math.round(parseFloat(row.boxRate || "0") * 0.92).toLocaleString("en-IN")}/box</span></div>
                              <div><span className="text-gray-400">Pack: </span><span className="font-bold">{parseInt(row.packSize || "0")} pcs</span></div>
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-2 mt-4 pt-3 border-t border-gray-100">
                          <Button onClick={() => handleSave(p)} disabled={row.saving || (!row.dirty && !modified)}
                            className="bg-amber-500 hover:bg-amber-600 text-white h-9 px-5 text-xs font-bold gap-1.5 disabled:opacity-40">
                            {row.saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
                            {row.saving ? "Saving…" : "Save & Go Live"}
                          </Button>
                          {modified && (
                            <button onClick={() => handleReset(p)} disabled={row.saving}
                              className="flex items-center gap-1.5 text-xs font-semibold text-red-600 hover:text-red-700 border border-red-200 hover:bg-red-50 px-4 py-2 rounded-lg transition-all disabled:opacity-50">
                              <RotateCcw className="h-3.5 w-3.5" /> Reset to Default
                            </button>
                          )}
                          <button onClick={() => setExpandedId(null)}
                            className="ml-auto flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 px-3 py-2 rounded-lg hover:bg-gray-100">
                            <X className="h-3.5 w-3.5" /> Close
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}

              {filtered.length === 0 && !catalogLoading && (
                <div className="flex flex-col items-center py-16 text-center text-gray-400">
                  <Search className="h-10 w-10 mb-3 opacity-20" />
                  <p className="font-semibold">No products match your search</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs text-gray-500 flex-wrap">
          <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded bg-emerald-100 border border-emerald-200" /> Live (in database, all users see this)</span>
          <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded bg-blue-100 border border-blue-200" /> Unsaved (not yet applied)</span>
          <span className="flex items-center gap-1.5"><Factory className="h-3 w-3 text-emerald-600" /> Factory rate = Box Rate × 0.92</span>
        </div>
      </div>
    </div>
  );
}
