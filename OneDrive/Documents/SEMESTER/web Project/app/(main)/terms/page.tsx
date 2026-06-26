import type { Metadata } from "next";

export const metadata: Metadata = { title: "Terms of Service" };

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-3xl">
      <h1 className="text-4xl font-bold mb-2">Terms of Service</h1>
      <p className="text-muted-foreground mb-10">Last updated: January 2025</p>

      <div className="space-y-8 text-sm text-muted-foreground leading-relaxed">
        <section>
          <h2 className="text-lg font-bold text-foreground mb-3">1. Acceptance of Terms</h2>
          <p>
            By accessing or using TechGadget (&quot;the Store&quot;), you agree to be bound by these Terms of Service.
            If you do not agree, please do not use our services.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-foreground mb-3">2. Products & Pricing</h2>
          <p>
            All prices are listed in Pakistani Rupees (PKR) and include applicable taxes. We reserve the right
            to change prices at any time without notice. In the event of a pricing error, we will contact you
            before processing your order.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-foreground mb-3">3. Orders & Payment</h2>
          <ul className="space-y-1 list-disc list-inside">
            <li>Orders are confirmed only after successful payment or COD acceptance.</li>
            <li>We reserve the right to cancel orders due to stock unavailability or payment failure.</li>
            <li>For Cash on Delivery orders, payment must be made in full upon delivery.</li>
            <li>Card payments are processed securely by Stripe.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-foreground mb-3">4. Delivery</h2>
          <p>
            Delivery times are estimates and not guaranteed. TechGadget is not responsible for delays caused
            by courier partners, natural events, or circumstances beyond our control.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-foreground mb-3">5. Returns & Warranty</h2>
          <p>
            Returns are subject to our Returns & Refunds Policy. Warranty claims are handled through the
            manufacturer&apos;s authorized service centers. TechGadget facilitates but does not directly provide
            manufacturer warranties.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-foreground mb-3">6. Account Responsibility</h2>
          <p>
            You are responsible for maintaining the confidentiality of your account credentials. You agree
            not to share your account with others or use it for fraudulent purposes. TechGadget reserves the
            right to suspend accounts that violate these terms.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-foreground mb-3">7. Intellectual Property</h2>
          <p>
            All content on this website — including logos, images, and text — is the property of TechGadget
            or its licensors. You may not reproduce or redistribute any content without written permission.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-foreground mb-3">8. Limitation of Liability</h2>
          <p>
            TechGadget&apos;s liability is limited to the value of the order in question. We are not liable for
            indirect, incidental, or consequential damages arising from the use of our products or services.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-foreground mb-3">9. Governing Law</h2>
          <p>
            These terms are governed by the laws of Pakistan. Any disputes shall be resolved in the courts
            of Islamabad, Pakistan.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-foreground mb-3">10. Contact</h2>
          <p>
            Questions about these terms? Email us at <strong className="text-foreground">legal@techgadget.pk</strong>
          </p>
        </section>
      </div>
    </div>
  );
}
