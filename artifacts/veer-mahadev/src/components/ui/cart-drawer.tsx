import { useState } from "react";
import { useCart } from "@/context/cart-context";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Trash2, ChevronRight, ChevronLeft, Package, Send, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

type Step = "cart" | "details" | "confirm";

export function CartDrawer({ open, onClose }: CartDrawerProps) {
  const { items, removeItem, updateQty, clearCart, count } = useCart();
  const { toast } = useToast();
  const [step, setStep] = useState<Step>("cart");
  const [form, setForm] = useState({ name: "", phone: "", email: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

  function handleField(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSubmit() {
    if (!form.name || !form.phone) {
      toast({ title: "Please fill Name and Phone to proceed.", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      setStep("confirm");
      setSubmitting(false);
    }, 1200);
  }

  function handleWhatsApp() {
    const productList = items.map((i) => `${i.name} (${i.qty}x ${i.packSize})`).join("%0A");
    const msg = `Hello Veer Mahadev Plastic,%0AI would like to enquire about the following products:%0A%0A${productList}%0A%0AName: ${form.name}%0APhone: ${form.phone}`;
    window.open(`https://wa.me/919876543210?text=${msg}`, "_blank");
  }

  function handleClose() {
    if (step === "confirm") {
      clearCart();
      setStep("cart");
      setForm({ name: "", phone: "", email: "", message: "" });
    }
    onClose();
  }

  return (
    <Sheet open={open} onOpenChange={handleClose}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-[480px] flex flex-col p-0 gap-0"
        data-testid="cart-drawer"
      >
        {/* Header */}
        <SheetHeader className="px-6 py-5 border-b bg-gray-900 text-white">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-white text-lg font-bold tracking-tight">
              {step === "cart" && `Enquiry Cart (${count})`}
              {step === "details" && "Your Details"}
              {step === "confirm" && "Enquiry Sent"}
            </SheetTitle>
            {step !== "cart" && step !== "confirm" && (
              <Button
                variant="ghost"
                size="sm"
                className="text-white/70 hover:text-white hover:bg-white/10 -mr-2"
                onClick={() => setStep("cart")}
              >
                <ChevronLeft className="h-4 w-4 mr-1" /> Back
              </Button>
            )}
          </div>
          {step !== "confirm" && (
            <div className="flex items-center gap-2 mt-3">
              {(["cart", "details"] as Step[]).map((s, i) => (
                <div key={s} className="flex items-center gap-2">
                  <div className={`h-2 w-2 rounded-full ${step === s || (step === "details" && i === 0) ? "bg-emerald-400" : "bg-white/30"}`} />
                  {i < 1 && <div className="h-px w-8 bg-white/20" />}
                </div>
              ))}
              <span className="text-white/60 text-xs ml-1">
                Step {step === "cart" ? "1" : "2"} of 2
              </span>
            </div>
          )}
        </SheetHeader>

        {/* STEP 1: Cart Summary */}
        {step === "cart" && (
          <>
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-48 text-center text-muted-foreground">
                  <Package className="h-10 w-10 mb-3 opacity-30" />
                  <p className="font-medium">Your enquiry cart is empty</p>
                  <p className="text-sm mt-1">Add products to send a bulk enquiry</p>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.id} className="flex gap-3 p-3 bg-gray-50 rounded-lg border" data-testid={`cart-item-${item.id}`}>
                    <img src={item.image} alt={item.name} className="w-16 h-16 object-contain rounded-md bg-white border shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm leading-tight line-clamp-2">{item.name}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{item.packSize}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <label className="text-xs text-muted-foreground shrink-0">Qty (cartons):</label>
                        <Input
                          type="number"
                          min={1}
                          value={item.qty}
                          onChange={(e) => updateQty(item.id, parseInt(e.target.value) || 1)}
                          className="h-7 w-16 text-sm px-2"
                          data-testid={`input-qty-${item.id}`}
                        />
                      </div>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-red-400 hover:text-red-600 shrink-0 self-start mt-0.5 p-1 rounded hover:bg-red-50 transition-colors"
                      data-testid={`button-remove-${item.id}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
            {items.length > 0 && (
              <div className="px-6 py-5 border-t bg-white">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-muted-foreground">{count} product{count !== 1 ? "s" : ""} selected</span>
                  <button onClick={clearCart} className="text-xs text-red-500 hover:underline">Clear all</button>
                </div>
                <Button
                  className="w-full bg-gray-900 hover:bg-gray-800 text-white h-11 font-semibold"
                  onClick={() => setStep("details")}
                  data-testid="button-proceed-details"
                >
                  Proceed to Details <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            )}
          </>
        )}

        {/* STEP 2: Details */}
        {step === "details" && (
          <>
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 mb-2">
                <p className="text-xs text-emerald-800 font-medium">
                  Enquiring about {count} product{count !== 1 ? "s" : ""}. Our sales team will contact you with wholesale pricing.
                </p>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-700">Full Name / Company <span className="text-red-500">*</span></label>
                <Input
                  name="name"
                  value={form.name}
                  onChange={handleField}
                  placeholder="e.g. Ramesh Enterprises"
                  className="h-11 border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                  data-testid="input-drawer-name"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-700">Phone Number <span className="text-red-500">*</span></label>
                <Input
                  name="phone"
                  value={form.phone}
                  onChange={handleField}
                  placeholder="+91 98765 43210"
                  className="h-11 border-gray-300 focus:border-emerald-500"
                  data-testid="input-drawer-phone"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-700">Email Address</label>
                <Input
                  name="email"
                  value={form.email}
                  onChange={handleField}
                  placeholder="your@email.com"
                  className="h-11 border-gray-300 focus:border-emerald-500"
                  data-testid="input-drawer-email"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-700">Additional Notes</label>
                <Textarea
                  name="message"
                  value={form.message}
                  onChange={handleField}
                  placeholder="Delivery location, required sizes, urgency, etc."
                  className="resize-none border-gray-300 focus:border-emerald-500"
                  rows={3}
                  data-testid="input-drawer-message"
                />
              </div>
              <Separator />
              <div className="space-y-2">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Products in enquiry</p>
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-gray-700 truncate mr-2">{item.name}</span>
                    <Badge variant="outline" className="shrink-0 text-xs">{item.qty} × {item.packSize}</Badge>
                  </div>
                ))}
              </div>
            </div>
            <div className="px-6 py-5 border-t bg-white space-y-3">
              <Button
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white h-11 font-semibold"
                onClick={handleSubmit}
                disabled={submitting}
                data-testid="button-submit-enquiry"
              >
                {submitting ? "Sending..." : <><Send className="mr-2 h-4 w-4" /> Send Bulk Enquiry</>}
              </Button>
              <Button
                variant="outline"
                className="w-full h-11 border-[#25D366] text-[#25D366] hover:bg-[#25D366]/10 font-semibold"
                onClick={handleWhatsApp}
                data-testid="button-whatsapp-enquiry"
              >
                Send via WhatsApp
              </Button>
            </div>
          </>
        )}

        {/* STEP 3: Confirmation */}
        {step === "confirm" && (
          <div className="flex-1 flex flex-col items-center justify-center px-8 text-center gap-4">
            <div className="h-20 w-20 rounded-full bg-emerald-100 flex items-center justify-center">
              <CheckCircle2 className="h-10 w-10 text-emerald-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">Enquiry Sent!</h3>
            <p className="text-muted-foreground leading-relaxed">
              Thank you, <strong>{form.name}</strong>. Our sales team will reach you on <strong>{form.phone}</strong> with wholesale pricing shortly.
            </p>
            <div className="w-full mt-2 space-y-3">
              <Button
                className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white h-11 font-semibold"
                onClick={handleWhatsApp}
                data-testid="button-confirm-whatsapp"
              >
                Also Message on WhatsApp
              </Button>
              <Button variant="outline" className="w-full h-11" onClick={handleClose} data-testid="button-confirm-close">
                Close & Browse More
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
