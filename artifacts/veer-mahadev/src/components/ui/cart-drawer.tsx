import { useState } from "react";
import { useCart } from "@/context/cart-context";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Trash2, ChevronRight, ChevronLeft, Package,
  CheckCircle2, MessageCircle, Smartphone, Copy, AlertCircle
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
  name: string;
  company: string;
  phone: string;
  email: string;
  address: string;
  gstin: string;
  message: string;
}

export function CartDrawer({ open, onClose }: CartDrawerProps) {
  const { items, removeItem, updateQty, clearCart, count } = useCart();
  const { toast } = useToast();
  const [step, setStep] = useState<Step>("summary");
  const [form, setForm] = useState<FormState>({
    name: "", company: "", phone: "", email: "", address: "", gstin: "", message: "",
  });
  const [errors, setErrors] = useState<Partial<FormState>>({});
  const [submitting, setSubmitting] = useState(false);
  const [upiCopied, setUpiCopied] = useState(false);

  function handleField(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormState]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  }

  function validate(): boolean {
    const errs: Partial<FormState> = {};
    if (!form.name.trim()) errs.name = "Full name is required";
    if (!form.phone.trim() || form.phone.replace(/\D/g, "").length < 10) errs.phone = "Valid phone number required";
    if (!form.address.trim()) errs.address = "Delivery address is required";
    if (form.gstin && !GST_REGEX.test(form.gstin.toUpperCase())) {
      errs.gstin = "Invalid GSTIN format (e.g. 22AAAAA0000A1Z5)";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleProceed() {
    if (!validate()) {
      toast({ title: "Please fix the errors below", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      setStep("dispatch");
      setSubmitting(false);
    }, 900);
  }

  function buildWhatsAppMessage() {
    const lines = items.map(i => `  • ${i.name} — ${i.qty}x ${i.packSize}`).join("%0A");
    const gstin = form.gstin ? `%0AGSTIN: ${form.gstin.toUpperCase()}` : "";
    const note = form.message ? `%0A%0ANotes: ${encodeURIComponent(form.message)}` : "";
    return (
      `Hello Veer Mahadev Plastic,%0A%0AI would like to place a *bulk order* for the following products:%0A%0A` +
      lines +
      `%0A%0A*Buyer Details:*%0AName: ${encodeURIComponent(form.name)}` +
      (form.company ? `%0ACompany: ${encodeURIComponent(form.company)}` : "") +
      `%0APhone: ${form.phone}` +
      (form.email ? `%0AEmail: ${encodeURIComponent(form.email)}` : "") +
      `%0ADelivery Address: ${encodeURIComponent(form.address)}` +
      gstin + note +
      `%0A%0APlease send the invoice and confirm dispatch timeline.`
    );
  }

  function handleWhatsApp() {
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${buildWhatsAppMessage()}`, "_blank");
  }

  function buildUpiLink() {
    const amount = "";
    return `upi://pay?pa=${UPI_ID}&pn=${encodeURIComponent(UPI_NAME)}&am=${amount}&cu=INR&tn=${encodeURIComponent("Wholesale Order — Veer Mahadev Plastic")}`;
  }

  function handleUpiPay() {
    window.location.href = buildUpiLink();
  }

  function copyUpiId() {
    navigator.clipboard.writeText(UPI_ID).then(() => {
      setUpiCopied(true);
      setTimeout(() => setUpiCopied(false), 2000);
    });
  }

  function handleClose() {
    if (step === "dispatch") {
      clearCart();
      setStep("summary");
      setForm({ name: "", company: "", phone: "", email: "", address: "", gstin: "", message: "" });
      setErrors({});
    }
    onClose();
  }

  const stepIndex = STEPS.findIndex(s => s.key === step);

  return (
    <Sheet open={open} onOpenChange={handleClose}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-[500px] flex flex-col p-0 gap-0"
        data-testid="cart-drawer"
      >
        {/* ── Header ── */}
        <SheetHeader className="px-6 py-4 border-b bg-gray-900 text-white shrink-0">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-white text-base font-bold">
              {step === "summary" && `Enquiry Cart (${count} item${count !== 1 ? "s" : ""})`}
              {step === "details" && "Business Details"}
              {step === "dispatch" && "Confirm & Dispatch"}
            </SheetTitle>
            {step === "details" && (
              <button
                onClick={() => setStep("summary")}
                className="flex items-center gap-1 text-xs text-white/70 hover:text-white transition-colors"
              >
                <ChevronLeft className="h-3.5 w-3.5" /> Back
              </button>
            )}
          </div>

          {/* Step indicator */}
          {step !== "dispatch" && (
            <div className="flex items-center gap-2 mt-3">
              {STEPS.map((s, i) => (
                <div key={s.key} className="flex items-center gap-2">
                  <div className={`flex items-center justify-center h-5 w-5 rounded-full text-[10px] font-bold border transition-all ${
                    i < stepIndex ? "bg-emerald-500 border-emerald-500 text-white"
                    : i === stepIndex ? "bg-white border-white text-gray-900"
                    : "bg-transparent border-white/30 text-white/40"
                  }`}>
                    {i < stepIndex ? "✓" : i + 1}
                  </div>
                  <span className={`text-[10px] font-medium hidden sm:inline ${i === stepIndex ? "text-white" : "text-white/40"}`}>
                    {s.label}
                  </span>
                  {i < STEPS.length - 1 && <div className="h-px w-4 sm:w-8 bg-white/20" />}
                </div>
              ))}
            </div>
          )}
        </SheetHeader>

        {/* ── STEP 1: Order Summary ── */}
        {step === "summary" && (
          <>
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-52 text-center text-muted-foreground">
                  <Package className="h-12 w-12 mb-3 opacity-20" />
                  <p className="font-semibold">Your enquiry cart is empty</p>
                  <p className="text-sm mt-1 text-gray-400">Browse our catalog and add products to enquire</p>
                </div>
              ) : (
                items.map(item => (
                  <div key={item.id} className="flex gap-3 p-3 bg-white rounded-xl border border-gray-100 shadow-sm" data-testid={`cart-item-${item.id}`}>
                    <div className="h-16 w-16 rounded-lg bg-gray-50 border flex items-center justify-center shrink-0 overflow-hidden">
                      <img src={item.image} alt={item.name} className="h-full w-full object-contain" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-gray-900 text-sm leading-tight line-clamp-2">{item.name}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{item.packSize}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <label className="text-xs text-gray-500 shrink-0">Cartons:</label>
                        <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                          <button
                            onClick={() => updateQty(item.id, item.qty - 1)}
                            className="px-2 py-1 text-gray-500 hover:bg-gray-100 text-sm font-bold"
                            data-testid={`button-dec-${item.id}`}
                          >−</button>
                          <input
                            type="number" min={1} value={item.qty}
                            onChange={e => updateQty(item.id, parseInt(e.target.value) || 1)}
                            className="w-10 text-center text-sm font-semibold border-x border-gray-200 outline-none py-1"
                            data-testid={`input-qty-${item.id}`}
                          />
                          <button
                            onClick={() => updateQty(item.id, item.qty + 1)}
                            className="px-2 py-1 text-gray-500 hover:bg-gray-100 text-sm font-bold"
                            data-testid={`button-inc-${item.id}`}
                          >+</button>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-gray-300 hover:text-red-500 transition-colors self-start p-1 rounded-lg hover:bg-red-50 shrink-0"
                      data-testid={`button-remove-${item.id}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {items.length > 0 && (
              <div className="px-5 py-4 border-t bg-gray-50 shrink-0 space-y-3">
                <div className="flex justify-between text-sm text-gray-500">
                  <span>{count} product{count !== 1 ? "s" : ""} selected</span>
                  <button onClick={clearCart} className="text-red-400 hover:text-red-600 text-xs font-medium hover:underline">
                    Clear all
                  </button>
                </div>
                <div className="bg-amber-50 border border-amber-100 rounded-lg px-3 py-2">
                  <p className="text-xs text-amber-800 font-medium">Wholesale pricing sent after details are submitted.</p>
                </div>
                <Button
                  className="w-full h-11 bg-gray-900 hover:bg-gray-800 text-white font-bold rounded-lg"
                  onClick={() => setStep("details")}
                  data-testid="button-proceed-details"
                >
                  Continue to Business Details <ChevronRight className="ml-1.5 h-4 w-4" />
                </Button>
              </div>
            )}
          </>
        )}

        {/* ── STEP 2: Business Details ── */}
        {step === "details" && (
          <>
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">

              {/* Order mini-summary */}
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-3">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Your Order ({count} items)</p>
                <div className="space-y-1">
                  {items.map(item => (
                    <div key={item.id} className="flex justify-between text-xs">
                      <span className="text-gray-700 truncate mr-2">{item.name}</span>
                      <Badge variant="outline" className="shrink-0 text-[10px] font-semibold">{item.qty}×{item.packSize}</Badge>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Form fields */}
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2 space-y-1">
                  <label className="text-xs font-bold text-gray-700">Full Name <span className="text-red-500">*</span></label>
                  <Input name="name" value={form.name} onChange={handleField}
                    placeholder="Your name" className={`h-10 text-sm ${errors.name ? "border-red-400 focus-visible:ring-red-300" : "border-gray-200 focus-visible:ring-emerald-300"}`}
                    data-testid="input-name" />
                  {errors.name && <p className="text-xs text-red-500 flex items-center gap-1"><AlertCircle className="h-3 w-3" />{errors.name}</p>}
                </div>

                <div className="col-span-2 space-y-1">
                  <label className="text-xs font-bold text-gray-700">Company / Business Name</label>
                  <Input name="company" value={form.company} onChange={handleField}
                    placeholder="e.g. Sharma Enterprises" className="h-10 text-sm border-gray-200 focus-visible:ring-emerald-300"
                    data-testid="input-company" />
                </div>

                <div className="col-span-1 space-y-1">
                  <label className="text-xs font-bold text-gray-700">Phone <span className="text-red-500">*</span></label>
                  <Input name="phone" value={form.phone} onChange={handleField}
                    placeholder="+91 98765 43210" className={`h-10 text-sm ${errors.phone ? "border-red-400 focus-visible:ring-red-300" : "border-gray-200 focus-visible:ring-emerald-300"}`}
                    data-testid="input-phone" />
                  {errors.phone && <p className="text-xs text-red-500 flex items-center gap-1"><AlertCircle className="h-3 w-3" />{errors.phone}</p>}
                </div>

                <div className="col-span-1 space-y-1">
                  <label className="text-xs font-bold text-gray-700">Email</label>
                  <Input name="email" value={form.email} onChange={handleField}
                    placeholder="your@email.com" className="h-10 text-sm border-gray-200 focus-visible:ring-emerald-300"
                    data-testid="input-email" />
                </div>

                <div className="col-span-2 space-y-1">
                  <label className="text-xs font-bold text-gray-700">Delivery Address <span className="text-red-500">*</span></label>
                  <Textarea name="address" value={form.address} onChange={handleField}
                    placeholder="Full delivery address with city, state & PIN code"
                    rows={2} className={`text-sm resize-none ${errors.address ? "border-red-400 focus-visible:ring-red-300" : "border-gray-200 focus-visible:ring-emerald-300"}`}
                    data-testid="input-address" />
                  {errors.address && <p className="text-xs text-red-500 flex items-center gap-1"><AlertCircle className="h-3 w-3" />{errors.address}</p>}
                </div>

                {/* GST field */}
                <div className="col-span-2 space-y-1">
                  <label className="text-xs font-bold text-gray-700">
                    GSTIN
                    <span className="ml-1.5 text-[10px] font-normal text-gray-400">(optional — for GST invoice)</span>
                  </label>
                  <Input name="gstin" value={form.gstin} onChange={e => { e.target.value = e.target.value.toUpperCase(); handleField(e); }}
                    placeholder="e.g. 22AAAAA0000A1Z5" maxLength={15}
                    className={`h-10 text-sm font-mono tracking-widest ${errors.gstin ? "border-red-400 focus-visible:ring-red-300" : "border-gray-200 focus-visible:ring-emerald-300"}`}
                    data-testid="input-gstin" />
                  {errors.gstin ? (
                    <p className="text-xs text-red-500 flex items-center gap-1"><AlertCircle className="h-3 w-3" />{errors.gstin}</p>
                  ) : form.gstin && GST_REGEX.test(form.gstin) ? (
                    <p className="text-xs text-emerald-600 flex items-center gap-1"><CheckCircle2 className="h-3 w-3" />Valid GSTIN</p>
                  ) : null}
                </div>

                <div className="col-span-2 space-y-1">
                  <label className="text-xs font-bold text-gray-700">Special Instructions</label>
                  <Textarea name="message" value={form.message} onChange={handleField}
                    placeholder="Specific sizes, urgency, special packing requirements..."
                    rows={2} className="text-sm resize-none border-gray-200 focus-visible:ring-emerald-300"
                    data-testid="input-message" />
                </div>
              </div>
            </div>

            <div className="px-5 py-4 border-t bg-gray-50 shrink-0 space-y-2">
              <Button
                className="w-full h-11 bg-gray-900 hover:bg-gray-800 text-white font-bold rounded-lg"
                onClick={handleProceed}
                disabled={submitting}
                data-testid="button-confirm"
              >
                {submitting ? "Processing..." : <>Confirm Order Details <ChevronRight className="ml-1.5 h-4 w-4" /></>}
              </Button>
              <p className="text-[10px] text-center text-gray-400">
                Your details are used only to process your wholesale enquiry.
              </p>
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
                <p className="text-sm text-gray-500 mt-1">
                  Hi <strong>{form.name}</strong>, choose how to dispatch your order to our team.
                </p>
              </div>
            </div>

            {/* Order recap */}
            <div className="bg-gray-50 rounded-xl border border-gray-100 p-3 space-y-1">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Order Summary</p>
              {items.map(item => (
                <div key={item.id} className="flex justify-between text-xs">
                  <span className="text-gray-700 truncate mr-2">{item.name}</span>
                  <span className="text-gray-500 shrink-0">{item.qty}× {item.packSize}</span>
                </div>
              ))}
              {form.gstin && (
                <div className="flex justify-between text-xs border-t border-gray-100 mt-2 pt-2">
                  <span className="text-gray-500 font-medium">GSTIN</span>
                  <span className="font-mono text-xs text-gray-700">{form.gstin}</span>
                </div>
              )}
              <div className="flex justify-between text-xs border-t border-gray-100 mt-2 pt-2">
                <span className="text-gray-500 font-medium">Delivery to</span>
                <span className="text-gray-700 text-right max-w-[55%] leading-tight">{form.address}</span>
              </div>
            </div>

            {/* Dispatch options */}
            <div className="space-y-3">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Choose Dispatch Method</p>

              {/* WhatsApp */}
              <button
                onClick={handleWhatsApp}
                className="w-full flex items-center gap-4 p-4 rounded-xl border-2 border-[#25D366] bg-[#25D366]/5 hover:bg-[#25D366]/10 transition-colors text-left"
                data-testid="button-whatsapp-dispatch"
              >
                <div className="h-11 w-11 rounded-xl bg-[#25D366] flex items-center justify-center shrink-0">
                  <MessageCircle className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-gray-900 text-sm">Send via WhatsApp</p>
                  <p className="text-xs text-gray-500 mt-0.5">Opens a pre-filled message with your full order. Fastest response — within 30 min.</p>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400 shrink-0" />
              </button>

              {/* UPI Payment */}
              <button
                onClick={handleUpiPay}
                className="w-full flex items-center gap-4 p-4 rounded-xl border-2 border-indigo-200 bg-indigo-50/60 hover:bg-indigo-50 transition-colors text-left"
                data-testid="button-upi-pay"
              >
                <div className="h-11 w-11 rounded-xl bg-indigo-600 flex items-center justify-center shrink-0">
                  <Smartphone className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-gray-900 text-sm">Pay via UPI App</p>
                  <p className="text-xs text-gray-500 mt-0.5">Opens your UPI app (PhonePe / GPay / Paytm) to pay the advance. Invoice sent after payment.</p>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400 shrink-0" />
              </button>

              {/* Manual UPI copy */}
              <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 flex items-center gap-3">
                <div className="flex-1">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">UPI ID (manual)</p>
                  <p className="text-sm font-mono font-bold text-gray-900 mt-0.5">{UPI_ID}</p>
                </div>
                <button
                  onClick={copyUpiId}
                  className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all ${upiCopied ? "bg-emerald-100 border-emerald-300 text-emerald-700" : "bg-white border-gray-200 text-gray-600 hover:border-gray-300"}`}
                  data-testid="button-copy-upi"
                >
                  <Copy className="h-3.5 w-3.5" />
                  {upiCopied ? "Copied!" : "Copy"}
                </button>
              </div>
            </div>

            <Separator />

            <Button
              variant="outline"
              className="w-full h-10 text-sm font-semibold border-gray-200 text-gray-600 hover:bg-gray-50 rounded-lg"
              onClick={handleClose}
              data-testid="button-close-dispatch"
            >
              Close &amp; Browse More Products
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
