import { NextResponse } from "next/server";
import { sampleExercises } from "@/data/exercises";
import { getSupabaseClient } from "@/lib/supabase";

export async function GET() {
  const supabase = getSupabaseClient();

  if (!supabase) {
    return NextResponse.json({ source: "seed", exercises: sampleExercises });
  }

  const { data, error } = await supabase
    .from("exercises")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ source: "seed", exercises: sampleExercises, warning: error.message });
  }

  return NextResponse.json({ source: "supabase", exercises: data ?? [] });
}

export async function POST(request: Request) {
  const supabase = getSupabaseClient(true);

  if (!supabase) {
    return NextResponse.json(
      { ok: false, message: "Supabase service role key is required for writes." },
      { status: 501 },
    );
  }

  const body = await request.json();
  const { data, error } = await supabase.from("exercises").insert(body).select("*").single();

  if (error) {
    return NextResponse.json({ ok: false, message: error.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true, exercise: data });
}
