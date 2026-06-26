import type { Metadata } from "next";
import { Truck, Clock, MapPin, Package } from "lucide-react";

export const metadata: Metadata = { title: "Shipping Information" };

const CITIES = [
  { city: "Islamabad / Rawalpindi", time: "1–2 business days" },
  { city: "Lahore",                  time: "2–3 business days" },
  { city: "Karachi",                 time: "2–3 business days" },
  { city: "Faisalabad",              time: "2–3 business days" },
  { city: "Peshawar",                time: "3–4 business days" },
  { city: "Multan",                  time: "3–4 business days" },
  { city: "Quetta",                  time: "4–5 business days" },
  { city: "Hyderabad",               time: "3–4 business days" },
  { city: "Other major cities",      time: "3–5 business days" },
  { city: "Remote / rural areas",    time: "5–7 business days" },
];

export default function ShippingPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-3xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-3">Shipping Information</h1>
        <p className="text-muted-foreground">Fast, reliable delivery across Pakistan.</p>
      </div>

      {/* Key info cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
        {[
          { icon: Truck,   title: "Free Shipping",   desc: "On all orders over Rs. 5,000" },
          { icon: Clock,   title: "Processing Time", desc: "Orders dispatched within 24 hours (Mon–Sat)" },
          { icon: Package, title: "Flat Rate Fee",   desc: "Rs. 499 for orders under Rs. 5,000" },
          { icon: MapPin,  title: "Coverage",        desc: "All cities and towns across Pakistan" },
        ].map((item) => (
          <div key={item.title} className="rounded-2xl border bg-card p-5 flex gap-4">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
              <item.icon className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="font-semibold text-sm">{item.title}</p>
              <p className="text-sm text-muted-foreground mt-0.5">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Delivery times */}
      <div className="rounded-2xl border bg-card overflow-hidden mb-8">
        <div className="px-6 py-4 border-b bg-muted/40">
          <h2 className="font-bold">Estimated Delivery Times</h2>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left px-6 py-3 font-medium text-muted-foreground">City / Region</th>
              <th className="text-left px-6 py-3 font-medium text-muted-foreground">Estimated Time</th>
            </tr>
          </thead>
          <tbody>
            {CITIES.map((row, i) => (
              <tr key={row.city} className={`border-b last:border-0 ${i % 2 === 0 ? "" : "bg-muted/20"}`}>
                <td className="px-6 py-3 font-medium">{row.city}</td>
                <td className="px-6 py-3 text-muted-foreground">{row.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Notes */}
      <div className="rounded-2xl border bg-card p-6 space-y-3 text-sm text-muted-foreground">
        <h2 className="font-bold text-foreground mb-3">Important Notes</h2>
        <p>• Delivery times are estimates and may vary during peak seasons (Eid, sales events).</p>
        <p>• Orders placed before 2pm on business days are typically dispatched the same day.</p>
        <p>• You will receive an SMS with tracking information once your order is dispatched.</p>
        <p>• Our courier partner will call before attempting delivery.</p>
        <p>• If delivery fails twice, the order will be returned and a refund issued within 5 days.</p>
      </div>
    </div>
  );
}
