import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createAdminClient } from "@/lib/supabase/admin";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-02-24.acacia",
});

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) return NextResponse.json({ error: "No signature" }, { status: 400 });

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const supabase = createAdminClient();

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const orderId = session.metadata?.orderId;

    if (orderId) {
      await supabase
        .from("orders")
        .update({
          payment_status: "paid",
          status: "processing",
          payment_intent_id: session.payment_intent as string,
        })
        .eq("id", orderId);

      // Record payment
      await supabase.from("payments").insert({
        order_id: orderId,
        provider: "stripe",
        provider_payment_id: session.payment_intent as string,
        amount: (session.amount_total ?? 0) / 100,
        currency: session.currency ?? "usd",
        status: "paid",
        raw_response: session as unknown as Record<string, unknown>,
      });
    }
  }

  if (event.type === "checkout.session.expired") {
    const session = event.data.object as Stripe.Checkout.Session;
    const orderId = session.metadata?.orderId;
    if (orderId) {
      await supabase
        .from("orders")
        .update({ status: "cancelled", payment_status: "failed" })
        .eq("id", orderId);
    }
  }

  return NextResponse.json({ received: true });
}
