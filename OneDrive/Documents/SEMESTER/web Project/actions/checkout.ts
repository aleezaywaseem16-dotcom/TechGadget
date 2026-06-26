"use server";

import { createClient } from "@/lib/supabase/server";
import { generateOrderNumber } from "@/lib/utils";

interface CheckoutItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface ShippingAddress {
  fullName: string;
  email: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

interface OrderData {
  items: CheckoutItem[];
  shippingAddress: ShippingAddress;
  shipping: number;
  tax: number;
  total: number;
}

async function insertOrder(data: OrderData, provider: string, status: string, paymentStatus: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const orderNumber = generateOrderNumber();
  const subtotal = data.items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const { data: order, error } = await supabase
    .from("orders")
    .insert({
      user_id: user?.id ?? null,
      order_number: orderNumber,
      status,
      subtotal,
      shipping_fee: data.shipping,
      tax: data.tax,
      total: data.total,
      currency: "pkr",
      shipping_address: {
        full_name: data.shippingAddress.fullName,
        phone: data.shippingAddress.phone,
        line1: data.shippingAddress.line1,
        line2: data.shippingAddress.line2 ?? null,
        city: data.shippingAddress.city,
        state: data.shippingAddress.state,
        postal_code: data.shippingAddress.postalCode,
        country: data.shippingAddress.country,
      },
      payment_status: paymentStatus,
      payment_provider: provider,
    })
    .select()
    .single();

  if (error || !order) return null;

  await supabase.from("order_items").insert(
    data.items.map((item) => ({
      order_id: order.id,
      product_id: item.productId,
      product_name: item.name,
      unit_price: item.price,
      quantity: item.quantity,
      subtotal: item.price * item.quantity,
    }))
  );

  return { orderId: order.id, orderNumber };
}

// ── Cash on Delivery ────────────────────────────────────────────────────────
export async function placeCODOrder(data: OrderData) {
  const result = await insertOrder(data, "cod", "pending", "pending");
  if (!result) return { error: "Failed to place order. Please try again." };
  return { orderNumber: result.orderNumber };
}

// ── Demo Pay (instant, no gateway) ─────────────────────────────────────────
export async function placeDemoOrder(data: OrderData) {
  const result = await insertOrder(data, "demo", "processing", "paid");
  if (!result) return { error: "Failed to place demo order." };
  return { orderNumber: result.orderNumber };
}

// ── Stripe (real card payment) ──────────────────────────────────────────────
export async function createStripeSession(data: OrderData) {
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeKey) return { error: "Stripe is not configured. Use Cash on Delivery or Demo Pay." };

  const { default: Stripe } = await import("stripe");
  const stripe = new Stripe(stripeKey, { apiVersion: "2025-02-24.acacia" });

  const result = await insertOrder(data, "stripe", "pending", "pending");
  if (!result) return { error: "Failed to create order." };

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  // Stripe does not support PKR — convert to USD for the payment session only
  const PKR_TO_USD = 280;
  const toUsdCents = (pkr: number) => Math.max(50, Math.round((pkr / PKR_TO_USD) * 100));

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: data.shippingAddress.email,
      line_items: [
        ...data.items.map((item) => ({
          price_data: {
            currency: "usd",
            unit_amount: toUsdCents(item.price),
            product_data: { name: item.name, images: item.image ? [item.image] : [] },
          },
          quantity: item.quantity,
        })),
        ...(data.shipping > 0 ? [{
          price_data: {
            currency: "usd",
            unit_amount: toUsdCents(data.shipping),
            product_data: { name: "Delivery Fee" },
          },
          quantity: 1,
        }] : []),
        {
          price_data: {
            currency: "usd",
            unit_amount: toUsdCents(data.tax),
            product_data: { name: "GST (17%)" },
          },
          quantity: 1,
        },
      ],
      metadata: { orderId: result.orderId, orderNumber: result.orderNumber },
      success_url: `${baseUrl}/checkout/success?order=${result.orderNumber}`,
      cancel_url: `${baseUrl}/checkout`,
    });

    const supabase = await createClient();
    await supabase.from("orders").update({ payment_intent_id: session.id }).eq("id", result.orderId);

    return { url: session.url, orderNumber: result.orderNumber };
  } catch {
    return { error: "Stripe error. Please use Cash on Delivery instead." };
  }
}
