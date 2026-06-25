import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(req: NextRequest) {
  try {
    const { email, password, firstName, lastName } = await req.json();

    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json({ error: "All fields are required." }, { status: 400 });
    }

    const admin = createAdminClient();

    const { data, error } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: `${firstName} ${lastName}`.trim() },
    });

    if (error) {
      const msg =
        error.message.includes("already been registered") ||
        error.message.includes("already exists")
          ? "An account with this email already exists. Please sign in instead."
          : error.message;
      return NextResponse.json({ error: msg }, { status: 400 });
    }

    if (!data?.user) {
      return NextResponse.json({ error: "Failed to create account. Please try again." }, { status: 500 });
    }

    return NextResponse.json({ success: "Account created! You can now sign in." });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unexpected server error." },
      { status: 500 }
    );
  }
}
