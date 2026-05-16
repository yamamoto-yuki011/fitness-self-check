import { NextResponse } from "next/server";

type ContactPayload = {
  company?: string;
  name?: string;
  email?: string;
  phone?: string;
  selectedItems?: string[];
  message?: string;
};

const toEmail = process.env.CONTACT_TO_EMAIL ?? "info@smartsupport.co.jp";
const fromEmail = process.env.CONTACT_FROM_EMAIL ?? "3分体力セルフチェック <onboarding@resend.dev>";

export async function POST(request: Request) {
  const resendApiKey = process.env.RESEND_API_KEY;

  if (!resendApiKey) {
    return NextResponse.json(
      { error: "メール送信設定が未完了です。RESEND_API_KEY を設定してください。" },
      { status: 500 },
    );
  }

  const payload = (await request.json()) as ContactPayload;
  const name = payload.name?.trim();
  const email = payload.email?.trim();

  if (!name || !email) {
    return NextResponse.json({ error: "ご担当者名とメールアドレスを入力してください。" }, { status: 400 });
  }

  const subject = "【軽労化ナビ】導入相談・お問い合わせ";
  const text = [
    "軽労化ナビ 導入相談・お問い合わせ",
    "",
    `会社名: ${payload.company || "未入力"}`,
    `ご担当者名: ${name}`,
    `メールアドレス: ${email}`,
    `電話番号: ${payload.phone || "未入力"}`,
    `相談したい内容: ${payload.selectedItems?.length ? payload.selectedItems.join("、") : "未選択"}`,
    "",
    "ご相談内容:",
    payload.message || "未入力",
    "",
    "送信元: 3分体力セルフチェック",
  ].join("\n");

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: fromEmail,
      to: [toEmail],
      reply_to: email,
      subject,
      text,
    }),
  });

  if (!response.ok) {
    return NextResponse.json(
      { error: "メール送信に失敗しました。時間をおいて再度お試しください。" },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
