import type { Metadata } from "next";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-3xl">
      <h1 className="text-4xl font-bold mb-2">Privacy Policy</h1>
      <p className="text-muted-foreground mb-10">Last updated: January 2025</p>

      <div className="space-y-8 text-sm text-muted-foreground leading-relaxed">
        <section>
          <h2 className="text-lg font-bold text-foreground mb-3">1. Information We Collect</h2>
          <p>When you create an account or place an order, we collect:</p>
          <ul className="mt-2 space-y-1 list-disc list-inside">
            <li>Name, email address, and phone number</li>
            <li>Delivery address</li>
            <li>Order history and preferences</li>
            <li>Payment information (processed securely by Stripe — we never store card numbers)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-foreground mb-3">2. How We Use Your Information</h2>
          <p>We use your information to:</p>
          <ul className="mt-2 space-y-1 list-disc list-inside">
            <li>Process and deliver your orders</li>
            <li>Send order confirmations and delivery updates via SMS/email</li>
            <li>Provide customer support</li>
            <li>Send promotional offers (you may opt out at any time)</li>
            <li>Improve our website and services</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-foreground mb-3">3. Data Sharing</h2>
          <p>
            We do not sell your personal data. We share information only with:
          </p>
          <ul className="mt-2 space-y-1 list-disc list-inside">
            <li>Courier partners (name, address, phone — for delivery only)</li>
            <li>Stripe (payment processing)</li>
            <li>Supabase (secure data storage)</li>
          </ul>
          <p className="mt-2">All partners are contractually obligated to protect your data.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-foreground mb-3">4. Data Security</h2>
          <p>
            Your data is stored on Supabase servers with industry-standard encryption. Passwords are hashed and
            never stored in plain text. We use HTTPS for all data transmission.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-foreground mb-3">5. Your Rights</h2>
          <p>You have the right to:</p>
          <ul className="mt-2 space-y-1 list-disc list-inside">
            <li>Access the personal data we hold about you</li>
            <li>Request correction of inaccurate data</li>
            <li>Request deletion of your account and data</li>
            <li>Opt out of marketing communications</li>
          </ul>
          <p className="mt-2">To exercise these rights, email us at privacy@techgadget.pk.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-foreground mb-3">6. Cookies</h2>
          <p>
            We use essential cookies to keep you logged in and remember your cart. We do not use third-party
            tracking cookies or advertising pixels.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-foreground mb-3">7. Contact</h2>
          <p>
            For any privacy-related concerns, contact us at <strong className="text-foreground">privacy@techgadget.pk</strong> or
            write to: TechGadget, Plot 42, Sector I-9, Islamabad, Pakistan.
          </p>
        </section>
      </div>
    </div>
  );
}
