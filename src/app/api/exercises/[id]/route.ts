import { NextResponse } from "next/server";
import { getSupabaseClient } from "@/lib/supabase";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const supabase = getSupabaseClient(true);

  if (!supabase) {
    return NextResponse.json(
      { ok: false, message: "Supabase service role key is required for writes." },
      { status: 501 },
    );
  }

  const { id } = await params;
  const body = await request.json();
  const { data, error } = await supabase
    .from("exercises")
    .update({ ...body, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ ok: false, message: error.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true, exercise: data });
}
