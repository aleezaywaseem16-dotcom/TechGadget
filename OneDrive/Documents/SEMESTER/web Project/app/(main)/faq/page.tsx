import type { Metadata } from "next";

export const metadata: Metadata = { title: "FAQ" };

const FAQS = [
  {
    q: "Are all products genuine and warranty-backed?",
    a: "Yes. Every product sold on TechGadget is sourced directly from authorized distributors and comes with the manufacturer's official warranty. We do not sell grey-market or refurbished items unless clearly labeled.",
  },
  {
    q: "How long does delivery take?",
    a: "Standard delivery takes 2–5 business days to major cities (Karachi, Lahore, Islamabad, Peshawar, Faisalabad). Remote areas may take 5–7 business days. You will receive an SMS when your order is dispatched.",
  },
  {
    q: "What is the Cash on Delivery limit?",
    a: "Cash on Delivery is available on all orders up to Rs. 150,000. For orders above this amount, advance payment via bank transfer or card is required.",
  },
  {
    q: "Can I return a product?",
    a: "Yes. We offer a 7-day return window for unopened, undamaged products in original packaging. Opened products may be returned only if they are defective. See our Returns & Refunds policy for full details.",
  },
  {
    q: "How do I track my order?",
    a: "Log in to your account and go to My Orders. Each order shows its current status (Pending, Processing, Shipped, Delivered). You will also receive SMS/email updates at each stage.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept Cash on Delivery (COD) for most orders, and card payments via Stripe (Visa, Mastercard, Amex). More local payment options are coming soon.",
  },
  {
    q: "Can I cancel my order after placing it?",
    a: "Orders can be cancelled within 2 hours of placement if they have not yet been dispatched. Contact our support team immediately at support@techgadget.pk or call +92 300 1234567.",
  },
  {
    q: "Do you ship outside Pakistan?",
    a: "Currently we only deliver within Pakistan. International shipping is on our roadmap.",
  },
  {
    q: "How do I claim warranty on a product?",
    a: "Contact us at support@techgadget.pk with your order number and a description of the issue. We will coordinate with the brand's authorized service center on your behalf.",
  },
  {
    q: "Is my payment information secure?",
    a: "Yes. Card payments are processed entirely by Stripe, a PCI DSS Level 1 certified payment processor. TechGadget never stores your card details.",
  },
];

export default function FAQPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-3xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-3">Frequently Asked Questions</h1>
        <p className="text-muted-foreground">Everything you need to know about shopping at TechGadget.</p>
      </div>

      <div className="space-y-4">
        {FAQS.map((faq, i) => (
          <details key={i} className="group rounded-2xl border bg-card p-6 cursor-pointer">
            <summary className="flex items-center justify-between font-semibold text-sm list-none">
              {faq.q}
              <span className="ml-4 text-muted-foreground group-open:rotate-180 transition-transform text-lg leading-none flex-shrink-0">↓</span>
            </summary>
            <p className="mt-4 text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
          </details>
        ))}
      </div>

      <div className="mt-12 rounded-2xl border bg-primary/5 border-primary/20 p-6 text-center">
        <p className="font-semibold mb-1">Still have questions?</p>
        <p className="text-sm text-muted-foreground mb-4">Our support team is available Mon–Sat, 9am–8pm.</p>
        <a
          href="/contact"
          className="inline-flex h-10 items-center px-6 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          Contact Us
        </a>
      </div>
    </div>
  );
}
