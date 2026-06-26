import type { Metadata } from "next";
import { CheckCircle, XCircle, AlertCircle } from "lucide-react";

export const metadata: Metadata = { title: "Returns & Refunds" };

export default function ReturnsPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-3xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-3">Returns & Refunds</h1>
        <p className="text-muted-foreground">We want you to be completely happy with your purchase.</p>
      </div>

      {/* Return window */}
      <div className="rounded-2xl border bg-card p-7 mb-6">
        <h2 className="text-xl font-bold mb-4">Return Window</h2>
        <p className="text-muted-foreground text-sm leading-relaxed">
          You may return most items within <strong>7 days</strong> of delivery. Items must be in their
          original condition — unused, undamaged, and in original packaging with all accessories,
          manuals, and warranty cards included.
        </p>
      </div>

      {/* Eligible / Not eligible */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div className="rounded-2xl border bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800 p-6">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle className="w-5 h-5 text-emerald-600" />
            <h3 className="font-semibold text-emerald-700 dark:text-emerald-400">Eligible for Return</h3>
          </div>
          <ul className="text-sm text-muted-foreground space-y-2">
            {[
              "Unopened, sealed products",
              "Defective or damaged on arrival",
              "Wrong item delivered",
              "Item not as described",
            ].map((i) => <li key={i} className="flex items-start gap-2"><span className="text-emerald-500 mt-0.5">✓</span>{i}</li>)}
          </ul>
        </div>

        <div className="rounded-2xl border bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800 p-6">
          <div className="flex items-center gap-2 mb-4">
            <XCircle className="w-5 h-5 text-red-500" />
            <h3 className="font-semibold text-red-600 dark:text-red-400">Not Eligible</h3>
          </div>
          <ul className="text-sm text-muted-foreground space-y-2">
            {[
              "Opened software or digital codes",
              "Products damaged by misuse",
              "Items returned after 7 days",
              "Missing accessories or packaging",
            ].map((i) => <li key={i} className="flex items-start gap-2"><span className="text-red-400 mt-0.5">✗</span>{i}</li>)}
          </ul>
        </div>
      </div>

      {/* How to return */}
      <div className="rounded-2xl border bg-card p-7 mb-6">
        <h2 className="text-xl font-bold mb-5">How to Return</h2>
        <ol className="space-y-4">
          {[
            { step: "1", title: "Contact Support", desc: "Email support@techgadget.pk or call +92 300 1234567 with your order number and reason for return." },
            { step: "2", title: "Get Approval", desc: "Our team will review your request within 24 hours and send you a Return Merchandise Authorization (RMA) number." },
            { step: "3", title: "Ship the Item", desc: "Pack the item securely and ship it to our warehouse address. Include the RMA number on the package." },
            { step: "4", title: "Receive Refund", desc: "Once we inspect the returned item, your refund will be processed within 3–5 business days to your original payment method." },
          ].map((item) => (
            <li key={item.step} className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold flex-shrink-0">
                {item.step}
              </div>
              <div>
                <p className="font-semibold text-sm">{item.title}</p>
                <p className="text-sm text-muted-foreground mt-0.5">{item.desc}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>

      {/* Refund timeline */}
      <div className="rounded-2xl border bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800 p-5 flex gap-3">
        <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div className="text-sm">
          <p className="font-semibold text-amber-700 dark:text-amber-400 mb-1">Refund Timeline</p>
          <p className="text-muted-foreground">
            COD orders are refunded via bank transfer within 5–7 business days.
            Card payments are refunded to the original card within 3–5 business days, subject to your bank&apos;s processing time.
          </p>
        </div>
      </div>
    </div>
  );
}
