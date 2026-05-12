import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { password } = await request.json();
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    return NextResponse.json(
      { ok: false, message: "ADMIN_PASSWORD is not configured." },
      { status: 500 },
    );
  }

  if (password !== adminPassword) {
    return NextResponse.json({ ok: false, message: "パスワードが違います。" }, { status: 401 });
  }

  return NextResponse.json({ ok: true });
}
