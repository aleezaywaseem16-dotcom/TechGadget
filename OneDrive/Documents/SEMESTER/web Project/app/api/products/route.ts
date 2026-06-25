import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  const ids = req.nextUrl.searchParams.get("ids");
  if (!ids) return NextResponse.json({ products: [] });

  const idList = ids.split(",").filter(Boolean).slice(0, 50); // max 50
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("products")
    .select(`
      id, name, slug, price, compare_at_price, stock_quantity,
      rating_avg, rating_count,
      brand:brands(name),
      images:product_images(url, alt, position)
    `)
    .in("id", idList)
    .eq("status", "active");

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const products = (data ?? []).map((p) => {
    const images = (p.images as { url: string; alt: string | null; position: number }[] ?? []).sort((a, b) => a.position - b.position);
    return {
      id: p.id,
      name: p.name,
      slug: p.slug,
      price: p.price,
      compare_at_price: p.compare_at_price,
      stock_quantity: p.stock_quantity,
      rating_avg: p.rating_avg,
      rating_count: p.rating_count,
      brand: (p.brand as unknown as { name: string } | null)?.name ?? null,
      image: images[0]?.url ?? "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=400&fit=crop",
    };
  });

  return NextResponse.json({ products });
}
