import { useState, useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { products } from "@/data/products";
import { useToast } from "@/hooks/use-toast";
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  phone: z.string().min(10, { message: "Please enter a valid phone number." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  productInterest: z.string().min(1, { message: "Please select a product." }),
  quantity: z.string().min(1, { message: "Please specify required quantity." }),
  message: z.string().optional(),
});

export default function Contact() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      productInterest: "",
      quantity: "",
      message: "",
    },
  });

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const product = searchParams.get("product");
    if (product) {
      form.setValue("productInterest", product);
    }
  }, [form]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      console.log("Form submitted:", values);
      toast({
        title: "Enquiry Sent Successfully",
        description: "Our sales team will contact you shortly with wholesale pricing.",
      });
      form.reset();
      setIsSubmitting(false);
    }, 1000);
  }

  return (
    <div className="flex flex-col min-h-screen bg-muted/10 pb-20">
      <div className="bg-primary text-primary-foreground py-16">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4" data-testid="text-contact-title">Contact Sales</h1>
          <p className="text-primary-foreground/80 max-w-2xl mx-auto text-lg">Request quotes, discuss bulk requirements, or get answers to your queries.</p>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 -mt-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-1 space-y-6">
            <Card className="shadow-md border-0">
              <CardContent className="p-6 space-y-6">
                <div>
                  <h3 className="text-xl font-bold mb-4">Contact Information</h3>
                  <div className="space-y-4 text-muted-foreground">
                    <div className="flex items-start">
                      <MapPin className="h-5 w-5 mr-3 text-primary shrink-0 mt-0.5" />
                      <span>123 Wholesale Market, Industrial Area<br />Delhi, India 110001</span>
                    </div>
                    <div className="flex items-center">
                      <Phone className="h-5 w-5 mr-3 text-primary shrink-0" />
                      <span>+91 98765 43210</span>
                    </div>
                    <div className="flex items-center">
                      <Mail className="h-5 w-5 mr-3 text-primary shrink-0" />
                      <span>sales@veermahadev.com</span>
                    </div>
                    <div className="flex items-start">
                      <Clock className="h-5 w-5 mr-3 text-primary shrink-0 mt-0.5" />
                      <span>Mon - Sat: 9:00 AM - 7:00 PM<br />Sunday: Closed</span>
                    </div>
                  </div>
                </div>
                
                <div className="pt-6 border-t">
                  <h3 className="font-bold mb-3">Fast Response via WhatsApp</h3>
                  <a 
                    href="https://wa.me/919876543210?text=Hello%2C%20I%20am%20interested%20in%20your%20wholesale%20products" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex w-full items-center justify-center rounded-md bg-[#25D366] px-4 py-2 text-sm font-medium text-white shadow transition-colors hover:bg-[#20bd5a]"
                  >
                    Chat on WhatsApp
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <Card className="shadow-md border-0">
              <CardContent className="p-6 md:p-8">
                <h2 className="text-2xl font-bold mb-6">Send Bulk Enquiry</h2>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name / Company Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter your name" {...field} data-testid="input-name" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone Number</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter phone number" {...field} data-testid="input-phone" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="Enter email address" {...field} data-testid="input-email" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="productInterest"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Product Interest</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                              <FormControl>
                                <SelectTrigger data-testid="select-product">
                                  <SelectValue placeholder="Select a product" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {products.map((p) => (
                                  <SelectItem key={p.id} value={p.name}>
                                    {p.name}
                                  </SelectItem>
                                ))}
                                <SelectItem value="Multiple Products">Multiple Products / Full Catalog</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="quantity"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Estimated Quantity Required</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g. 5000 pcs, 50 cartons" {...field} data-testid="input-quantity" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Additional Requirements / Message</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Tell us about your requirements, specific sizes, delivery location, etc." 
                              className="min-h-[120px] resize-y" 
                              {...field} 
                              data-testid="input-message"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button type="submit" size="lg" className="w-full sm:w-auto" disabled={isSubmitting} data-testid="button-submit">
                      {isSubmitting ? "Sending Enquiry..." : (
                        <>
                          <Send className="mr-2 h-4 w-4" /> Send Enquiry
                        </>
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>

        </div>
      </div>
    </div>
  );
}
