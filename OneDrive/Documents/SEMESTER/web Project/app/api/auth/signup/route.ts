import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(req: NextRequest) {
  try {
    const { email, password, firstName, lastName } = await req.json();

    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json({ error: "All fields are required." }, { status: 400 });
    }

    const admin = createAdminClient();
    const fullName = `${firstName} ${lastName}`.trim();

    const { data, error } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: fullName },
    });

    if (error) {
      if (error.message === "{}") {
        return NextResponse.json(
          { error: "Sign up failed: database trigger error. Please run the SQL fix in Supabase dashboard and try again." },
          { status: 500 }
        );
      }
      const isExists =
        error.message.toLowerCase().includes("already") ||
        error.message.toLowerCase().includes("exists");
      return NextResponse.json(
        { error: isExists ? "An account with this email already exists. Please sign in." : error.message },
        { status: 400 }
      );
    }

    if (!data?.user) {
      return NextResponse.json({ error: "Failed to create account. Please try again." }, { status: 500 });
    }

    // Explicitly upsert profile — belt-and-suspenders in case trigger didn't fire
    await admin.from("profiles").upsert(
      { id: data.user.id, email: data.user.email ?? email, full_name: fullName },
      { onConflict: "id" }
    );

    return NextResponse.json({ success: "Account created! You can now sign in." });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unexpected server error." },
      { status: 500 }
    );
  }
}
