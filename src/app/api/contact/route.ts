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
const isDevelopment = process.env.NODE_ENV === "development";

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "unknown error";
}

async function readResendResponse(response: Response) {
  const text = await response.text();

  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text) as unknown;
  } catch {
    return text;
  }
}

function getResendErrorMessage(body: unknown) {
  if (body && typeof body === "object") {
    const record = body as Record<string, unknown>;
    if (typeof record.message === "string") return record.message;
    if (typeof record.error === "string") return record.error;
  }

  if (typeof body === "string") return body;

  return "Resend API request failed";
}

export async function POST(request: Request) {
  try {
    const resendApiKey = process.env.RESEND_API_KEY;

    if (!resendApiKey) {
      throw new Error("メール送信設定が未完了です。RESEND_API_KEY を設定してください。");
    }

    const payload = (await request.json()) as ContactPayload;
    const name = payload.name?.trim();
    const email = payload.email?.trim();

    if (!name || !email) {
      return NextResponse.json({ success: false, error: "ご担当者名とメールアドレスを入力してください。" }, { status: 400 });
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

    const resendResponse = await readResendResponse(response);

    if (!response.ok) {
      const error = new Error(getResendErrorMessage(resendResponse));
      console.error("Resend Error:", error);
      console.error("Resend Status:", response.status);
      console.error("Resend Response:", resendResponse);

      return NextResponse.json(
        {
          success: false,
          error: isDevelopment ? error.message : "メール送信に失敗しました。時間をおいて再度お試しください。",
        },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true, ok: true });
  } catch (error) {
    console.error("Resend Error:", error);

    return NextResponse.json(
      {
        success: false,
        error: isDevelopment ? getErrorMessage(error) : "メール送信に失敗しました。時間をおいて再度お試しください。",
      },
      { status: 500 },
    );
  }
}
