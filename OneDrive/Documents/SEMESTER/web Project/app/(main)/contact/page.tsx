import type { Metadata } from "next";
import { Mail, Phone, MapPin, Clock } from "lucide-react";

export const metadata: Metadata = { title: "Contact Us" };

const CONTACT_INFO = [
  {
    icon: Phone,
    title: "Phone",
    lines: ["+92 300 1234567", "+92 21 3456789"],
  },
  {
    icon: Mail,
    title: "Email",
    lines: ["support@techgadget.pk", "sales@techgadget.pk"],
  },
  {
    icon: MapPin,
    title: "Address",
    lines: ["Plot 42, Sector I-9", "Industrial Area, Islamabad", "Pakistan"],
  },
  {
    icon: Clock,
    title: "Support Hours",
    lines: ["Mon – Sat: 9am – 8pm", "Sunday: 11am – 5pm"],
  },
];

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-3">Get in Touch</h1>
        <p className="text-muted-foreground text-lg max-w-xl mx-auto">
          Have a question or need help with your order? Our team is here to help.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-14">
        {CONTACT_INFO.map((item) => (
          <div key={item.title} className="rounded-2xl border bg-card p-6 flex gap-4">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
              <item.icon className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="font-semibold mb-1">{item.title}</p>
              {item.lines.map((line) => (
                <p key={line} className="text-sm text-muted-foreground">{line}</p>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border bg-card p-8">
        <h2 className="text-xl font-bold mb-6">Send Us a Message</h2>
        <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Full Name</label>
              <input
                type="text"
                required
                placeholder="Ahmed Ali"
                className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Email</label>
              <input
                type="email"
                required
                placeholder="ahmed@example.com"
                className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Subject</label>
            <input
              type="text"
              required
              placeholder="Order inquiry, product question…"
              className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Message</label>
            <textarea
              required
              rows={5}
              placeholder="Tell us how we can help…"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
            />
          </div>
          <button
            type="submit"
            className="h-11 px-8 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors"
          >
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
}
