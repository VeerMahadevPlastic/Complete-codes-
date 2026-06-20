import { useState } from "react";
import { useCart } from "@/context/cart-context";
import { getTierPrice } from "@/data/products";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  Trash2, ChevronRight, ChevronLeft, Package2,
  CheckCircle2, MessageCircle, Smartphone, Copy, AlertCircle, Tag, Zap
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

type Step = "summary" | "details" | "dispatch";

const STEPS: { key: Step; label: string }[] = [
  { key: "summary", label: "Order Summary" },
  { key: "details", label: "Business Details" },
  { key: "dispatch", label: "Dispatch" },
];

const UPI_ID = "veermahadev@upi";
const UPI_NAME = "Veer Mahadev Plastic";
const WHATSAPP_NUMBER = "919876543210";
const GST_REGEX = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;

interface FormState {
  name: string; company: string; phone: string;
  email: string; address: string; gstin: string; message: string;
}

function fmt(n: number) { return n.toLocaleString("en-IN"); }
function fmtRs(n: number) { return `₹${fmt(n)}`; }

export function CartDrawer({ open, onClose }: CartDrawerProps) {
  const { items, removeItem, updateBoxes, clearCart, count, grandTotal } = useCart();
  const { toast } = useToast();
  const [step, setStep] = useState<Step>("summary");
  const [form, setForm] = useState<FormState>({ name: "", company: "", phone: "", email: "", address: "", gstin: "", message: "" });
  const [errors, setErrors] = useState<Partial<FormState>>({});
  const [submitting, setSubmitting] = useState(false);
  const [upiCopied, setUpiCopied] = useState(false);

  function handleField(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormState]) setErrors(prev => ({ ...prev, [name]: undefined }));
  }

  function validate() {
    const errs: Partial<FormState> = {};
    if (!form.name.trim()) errs.name = "Full name is required";
    if (!form.phone.trim() || form.phone.replace(/\D/g, "").length < 10) errs.phone = "Valid phone required";
    if (!form.address.trim()) errs.address = "Delivery address required";
    if (form.gstin && !GST_REGEX.test(form.gstin.toUpperCase())) errs.gstin = "Invalid GSTIN (e.g. 22AAAAA0000A1Z5)";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleProceed() {
    if (!validate()) { toast({ title: "Please fix the errors below", variant: "destructive" }); return; }
    setSubmitting(true);
    setTimeout(() => { setStep("dispatch"); setSubmitting(false); }, 900);
  }

  function buildWhatsAppMessage() {
    const lines = items.map(item => {
      const { pricePerBox, label, totalPcs } = getTierPrice(item.product, item.boxes);
      const lineTotal = pricePerBox * item.boxes;
      return (
        `  %E2%80%A2 ${encodeURIComponent(item.product.name)} (${item.product.sku})%0A` +
        `    ${item.boxes} box%C3%97${fmt(item.product.packSize)} pcs = ${fmt(totalPcs)} pcs @ ${fmtRs(pricePerBox)}/box (${label}) = ${fmtRs(lineTotal)}`
      );
    }).join("%0A%0A");

    const gstin = form.gstin ? `%0AGSTIN: ${form.gstin.toUpperCase()}` : "";
    const note = form.message ? `%0ANotes: ${encodeURIComponent(form.message)}` : "";
    const gt = `%0A%0A*Grand Total: ${fmtRs(grandTotal)}*`;

    return (
      `Hello Veer Mahadev Plastic,%0A%0AI would like to place a bulk order:%0A%0A` +
      lines + gt +
      `%0A%0A*Buyer Details:*%0AName: ${encodeURIComponent(form.name)}` +
      (form.company ? `%0ACompany: ${encodeURIComponent(form.company)}` : "") +
      `%0APhone: ${form.phone}` +
      (form.email ? `%0AEmail: ${encodeURIComponent(form.email)}` : "") +
      `%0ADelivery: ${encodeURIComponent(form.address)}` +
      gstin + note +
      `%0A%0APlease confirm invoice and dispatch timeline.`
    );
  }

  function handleWhatsApp() {
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${buildWhatsAppMessage()}`, "_blank");
  }

  function handleUpiPay() {
    window.location.href = `upi://pay?pa=${UPI_ID}&pn=${encodeURIComponent(UPI_NAME)}&cu=INR&tn=${encodeURIComponent("Wholesale Order — Veer Mahadev Plastic")}`;
  }

  function copyUpiId() {
    navigator.clipboard.writeText(UPI_ID).then(() => {
      setUpiCopied(true); setTimeout(() => setUpiCopied(false), 2000);
    });
  }

  function handleClose() {
    if (step === "dispatch") {
      clearCart(); setStep("summary");
      setForm({ name: "", company: "", phone: "", email: "", address: "", gstin: "", message: "" });
      setErrors({});
    }
    onClose();
  }

  const stepIndex = STEPS.findIndex(s => s.key === step);

  return (
    <Sheet open={open} onOpenChange={handleClose}>
      <SheetContent side="right" className="w-full sm:max-w-[520px] flex flex-col p-0 gap-0" data-testid="cart-drawer">

        {/* Header */}
        <SheetHeader className="px-5 py-4 border-b bg-gray-900 text-white shrink-0">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-white text-base font-bold">
              {step === "summary" && `Enquiry Cart (${count} item${count !== 1 ? "s" : ""})`}
              {step === "details" && "Business Details"}
              {step === "dispatch" && "Confirm & Dispatch"}
            </SheetTitle>
            {step === "details" && (
              <button onClick={() => setStep("summary")} className="flex items-center gap-1 text-xs text-white/70 hover:text-white">
                <ChevronLeft className="h-3.5 w-3.5" /> Back
              </button>
            )}
          </div>
          {step !== "dispatch" && (
            <div className="flex items-center gap-2 mt-2">
              {STEPS.map((s, i) => (
                <div key={s.key} className="flex items-center gap-2">
                  <div className={`flex items-center justify-center h-5 w-5 rounded-full text-[10px] font-bold border transition-all ${i < stepIndex ? "bg-emerald-500 border-emerald-500 text-white" : i === stepIndex ? "bg-white border-white text-gray-900" : "bg-transparent border-white/30 text-white/40"}`}>
                    {i < stepIndex ? "✓" : i + 1}
                  </div>
                  <span className={`text-[10px] font-medium hidden sm:inline ${i === stepIndex ? "text-white" : "text-white/40"}`}>{s.label}</span>
                  {i < STEPS.length - 1 && <div className="h-px w-4 sm:w-8 bg-white/20" />}
                </div>
              ))}
            </div>
          )}
        </SheetHeader>

        {/* ── STEP 1: Order Summary ── */}
        {step === "summary" && (
          <>
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-52 text-center text-muted-foreground">
                  <Package2 className="h-12 w-12 mb-3 opacity-20" />
                  <p className="font-semibold">Your enquiry cart is empty</p>
                  <p className="text-sm mt-1 text-gray-400">Browse the catalog and add products</p>
                </div>
              ) : (
                items.map(({ product, boxes }) => {
                  const { pricePerBox, tier, label, totalPcs } = getTierPrice(product, boxes);
                  const lineTotal = pricePerBox * boxes;
                  return (
                    <div key={product.id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden" data-testid={`cart-item-${product.id}`}>
                      <div className="flex gap-3 p-3">
                        <div className="h-16 w-16 rounded-lg bg-gray-50 border flex items-center justify-center shrink-0 overflow-hidden">
                          <img src={product.image} alt={product.name} className="h-full w-full object-contain" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-gray-900 text-xs leading-snug line-clamp-2">{product.name}</p>
                          <p className="text-[10px] text-gray-400 mt-0.5 font-mono">{product.sku} · {fmt(product.packSize)} pcs/box</p>
                          {/* Tier indicator */}
                          <div className={`mt-1.5 inline-flex items-center gap-1 text-[9px] font-bold px-1.5 py-0.5 rounded-full ${tier === "factory" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`}>
                            {tier === "factory" ? <Zap className="h-2.5 w-2.5" /> : <Tag className="h-2.5 w-2.5" />}
                            {label}
                          </div>
                        </div>
                        <button onClick={() => removeItem(product.id)} className="text-gray-300 hover:text-red-500 transition-colors self-start p-1 hover:bg-red-50 rounded-lg shrink-0" data-testid={`button-remove-${product.id}`}>
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      {/* Qty + pricing row */}
                      <div className="flex items-center justify-between bg-gray-50 border-t border-gray-100 px-3 py-2">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-gray-500 shrink-0">Boxes:</span>
                          <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-white">
                            <button onClick={() => updateBoxes(product.id, boxes - 1)} className="px-2 py-1 text-gray-500 hover:bg-gray-100 text-sm font-bold" data-testid={`button-dec-${product.id}`}>−</button>
                            <input type="number" min={1} value={boxes} onChange={e => updateBoxes(product.id, parseInt(e.target.value) || 1)}
                              className="w-10 text-center text-xs font-bold border-x border-gray-200 outline-none py-1" data-testid={`input-boxes-${product.id}`} />
                            <button onClick={() => updateBoxes(product.id, boxes + 1)} className="px-2 py-1 text-gray-500 hover:bg-gray-100 text-sm font-bold" data-testid={`button-inc-${product.id}`}>+</button>
                          </div>
                          <span className="text-[10px] text-gray-400">{fmt(totalPcs)} pcs</span>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-bold text-gray-900">{fmtRs(lineTotal)}</p>
                          <p className="text-[9px] text-gray-400">{fmtRs(pricePerBox)}/box</p>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {items.length > 0 && (
              <div className="px-4 py-4 border-t bg-gray-50 shrink-0 space-y-3">
                {/* Grand total */}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-gray-700">Grand Total</span>
                  <span className="text-xl font-extrabold text-gray-900">{fmtRs(grandTotal)}</span>
                </div>
                <div className="text-[10px] text-gray-400 -mt-1 text-right">{count} product{count !== 1 ? "s" : ""} · tier pricing auto-applied</div>
                <div className="bg-amber-50 border border-amber-100 rounded-lg px-3 py-2">
                  <p className="text-xs text-amber-800 font-medium">Price confirmed after your details are submitted. GST invoice available.</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={clearCart} className="text-xs text-red-400 hover:text-red-600 font-medium hover:underline shrink-0">Clear all</button>
                  <Button className="flex-1 h-10 bg-gray-900 hover:bg-gray-800 text-white font-bold rounded-lg text-sm" onClick={() => setStep("details")} data-testid="button-proceed-details">
                    Business Details <ChevronRight className="ml-1.5 h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}

        {/* ── STEP 2: Business Details ── */}
        {step === "details" && (
          <>
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
              {/* Mini order recap */}
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-3">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Order ({count} items) · {fmtRs(grandTotal)}</p>
                <div className="space-y-1">
                  {items.map(({ product, boxes }) => {
                    const { pricePerBox, tier } = getTierPrice(product, boxes);
                    return (
                      <div key={product.id} className="flex justify-between items-center text-[10px]">
                        <span className="text-gray-700 truncate mr-2">{product.name}</span>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <span className={`font-bold px-1.5 py-px rounded-full ${tier === "factory" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`}>
                            {boxes}×{fmtRs(pricePerBox)}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2 space-y-1">
                  <label className="text-xs font-bold text-gray-700">Full Name <span className="text-red-500">*</span></label>
                  <Input name="name" value={form.name} onChange={handleField} placeholder="Your name" className={`h-10 text-sm ${errors.name ? "border-red-400" : "border-gray-200 focus-visible:ring-amber-300"}`} data-testid="input-name" />
                  {errors.name && <p className="text-xs text-red-500 flex items-center gap-1"><AlertCircle className="h-3 w-3" />{errors.name}</p>}
                </div>

                <div className="col-span-2 space-y-1">
                  <label className="text-xs font-bold text-gray-700">Company / Business Name</label>
                  <Input name="company" value={form.company} onChange={handleField} placeholder="Sharma Enterprises" className="h-10 text-sm border-gray-200 focus-visible:ring-amber-300" data-testid="input-company" />
                </div>

                <div className="col-span-1 space-y-1">
                  <label className="text-xs font-bold text-gray-700">Phone <span className="text-red-500">*</span></label>
                  <Input name="phone" value={form.phone} onChange={handleField} placeholder="+91 98765 43210" className={`h-10 text-sm ${errors.phone ? "border-red-400" : "border-gray-200 focus-visible:ring-amber-300"}`} data-testid="input-phone" />
                  {errors.phone && <p className="text-xs text-red-500 flex items-center gap-1"><AlertCircle className="h-3 w-3" />{errors.phone}</p>}
                </div>

                <div className="col-span-1 space-y-1">
                  <label className="text-xs font-bold text-gray-700">Email</label>
                  <Input name="email" value={form.email} onChange={handleField} placeholder="your@email.com" className="h-10 text-sm border-gray-200 focus-visible:ring-amber-300" data-testid="input-email" />
                </div>

                <div className="col-span-2 space-y-1">
                  <label className="text-xs font-bold text-gray-700">Delivery Address <span className="text-red-500">*</span></label>
                  <Textarea name="address" value={form.address} onChange={handleField} placeholder="Full address with city, state & PIN" rows={2} className={`text-sm resize-none ${errors.address ? "border-red-400" : "border-gray-200 focus-visible:ring-amber-300"}`} data-testid="input-address" />
                  {errors.address && <p className="text-xs text-red-500 flex items-center gap-1"><AlertCircle className="h-3 w-3" />{errors.address}</p>}
                </div>

                <div className="col-span-2 space-y-1">
                  <label className="text-xs font-bold text-gray-700">
                    GSTIN <span className="ml-1 text-[10px] font-normal text-gray-400">(optional — for GST invoice)</span>
                  </label>
                  <Input name="gstin" value={form.gstin}
                    onChange={e => { e.target.value = e.target.value.toUpperCase(); handleField(e); }}
                    placeholder="22AAAAA0000A1Z5" maxLength={15}
                    className={`h-10 text-sm font-mono tracking-widest ${errors.gstin ? "border-red-400" : "border-gray-200 focus-visible:ring-amber-300"}`}
                    data-testid="input-gstin" />
                  {errors.gstin ? (
                    <p className="text-xs text-red-500 flex items-center gap-1"><AlertCircle className="h-3 w-3" />{errors.gstin}</p>
                  ) : form.gstin && GST_REGEX.test(form.gstin) ? (
                    <p className="text-xs text-emerald-600 flex items-center gap-1"><CheckCircle2 className="h-3 w-3" />Valid GSTIN</p>
                  ) : null}
                </div>

                <div className="col-span-2 space-y-1">
                  <label className="text-xs font-bold text-gray-700">Special Instructions</label>
                  <Textarea name="message" value={form.message} onChange={handleField} placeholder="Specific sizes, urgency, packaging notes..." rows={2} className="text-sm resize-none border-gray-200 focus-visible:ring-amber-300" data-testid="input-message" />
                </div>
              </div>
            </div>

            <div className="px-5 py-4 border-t bg-gray-50 shrink-0 space-y-2">
              <div className="flex justify-between text-sm font-bold text-gray-900 mb-2">
                <span>Total</span><span className="text-amber-700">{fmtRs(grandTotal)}</span>
              </div>
              <Button className="w-full h-10 bg-gray-900 hover:bg-gray-800 text-white font-bold rounded-lg" onClick={handleProceed} disabled={submitting} data-testid="button-confirm">
                {submitting ? "Processing..." : <>Confirm & Proceed <ChevronRight className="ml-1.5 h-4 w-4" /></>}
              </Button>
              <p className="text-[10px] text-center text-gray-400">Your details are used only to process your wholesale enquiry.</p>
            </div>
          </>
        )}

        {/* ── STEP 3: Dispatch ── */}
        {step === "dispatch" && (
          <div className="flex-1 overflow-y-auto px-5 py-6 space-y-5">
            {/* Confirmed header */}
            <div className="flex flex-col items-center text-center gap-3 pb-4 border-b">
              <div className="h-16 w-16 rounded-full bg-emerald-100 flex items-center justify-center">
                <CheckCircle2 className="h-9 w-9 text-emerald-600" />
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-gray-900">Order Confirmed!</h3>
                <p className="text-sm text-gray-500 mt-1">Hi <strong>{form.name}</strong> — choose how to dispatch to our team.</p>
              </div>
            </div>

            {/* Order recap with pricing */}
            <div className="bg-gray-50 rounded-xl border border-gray-100 p-3 space-y-1">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Order Summary</p>
              {items.map(({ product, boxes }) => {
                const { pricePerBox, label, totalPcs } = getTierPrice(product, boxes);
                const lineTotal = pricePerBox * boxes;
                return (
                  <div key={product.id} className="text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-700 truncate mr-2 font-medium">{product.name}</span>
                      <span className="text-gray-900 font-bold shrink-0">{fmtRs(lineTotal)}</span>
                    </div>
                    <p className="text-gray-400 text-[10px]">{boxes} box × {fmt(product.packSize)} pcs = {fmt(totalPcs)} pcs · {label}</p>
                  </div>
                );
              })}
              <div className="flex justify-between border-t border-gray-200 mt-2 pt-2">
                <span className="text-sm font-bold text-gray-900">Grand Total</span>
                <span className="text-sm font-extrabold text-amber-700">{fmtRs(grandTotal)}</span>
              </div>
              {form.gstin && (
                <p className="text-[10px] text-gray-500 text-right font-mono">{form.gstin}</p>
              )}
            </div>

            {/* Dispatch options */}
            <div className="space-y-3">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Send Order To</p>

              <button onClick={handleWhatsApp}
                className="w-full flex items-center gap-4 p-4 rounded-xl border-2 border-[#25D366] bg-[#25D366]/5 hover:bg-[#25D366]/10 transition-colors text-left"
                data-testid="button-whatsapp-dispatch">
                <div className="h-11 w-11 rounded-xl bg-[#25D366] flex items-center justify-center shrink-0">
                  <MessageCircle className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-gray-900 text-sm">Send via WhatsApp</p>
                  <p className="text-xs text-gray-500 mt-0.5">Pre-filled order with all items, quantities, tier prices &amp; total. Fastest response.</p>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400 shrink-0" />
              </button>

              <button onClick={handleUpiPay}
                className="w-full flex items-center gap-4 p-4 rounded-xl border-2 border-indigo-200 bg-indigo-50/60 hover:bg-indigo-50 transition-colors text-left"
                data-testid="button-upi-pay">
                <div className="h-11 w-11 rounded-xl bg-indigo-600 flex items-center justify-center shrink-0">
                  <Smartphone className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-gray-900 text-sm">Pay via UPI App</p>
                  <p className="text-xs text-gray-500 mt-0.5">Opens PhonePe / GPay / Paytm to pay advance. Invoice sent after payment.</p>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400 shrink-0" />
              </button>

              <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 flex items-center gap-3">
                <div className="flex-1">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">UPI ID (manual)</p>
                  <p className="text-sm font-mono font-bold text-gray-900 mt-0.5">{UPI_ID}</p>
                </div>
                <button onClick={copyUpiId}
                  className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all ${upiCopied ? "bg-emerald-100 border-emerald-300 text-emerald-700" : "bg-white border-gray-200 text-gray-600 hover:border-gray-300"}`}
                  data-testid="button-copy-upi">
                  <Copy className="h-3.5 w-3.5" />
                  {upiCopied ? "Copied!" : "Copy"}
                </button>
              </div>
            </div>

            <Separator />

            <Button variant="outline" className="w-full h-10 text-sm font-semibold border-gray-200 text-gray-600 rounded-lg" onClick={handleClose} data-testid="button-close-dispatch">
              Close &amp; Browse More Products
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
