"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Building2,
  CalendarCheck,
  CheckCircle2,
  ClipboardList,
  Mail,
  PhoneCall,
  UsersRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const consultationItems = [
  "体力測定イベントの相談",
  "軽労化ナビ導入相談",
  "軽労化セミナーの相談",
  "資料請求",
  "デモ測定の相談",
];

export default function ContactPage() {
  const [company, setCompany] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [message, setMessage] = useState("");

  function toggleItem(item: string) {
    setSelectedItems((current) =>
      current.includes(item) ? current.filter((value) => value !== item) : [...current, item],
    );
  }

  function sendMail() {
    const subject = "【軽労化ナビ】導入相談・お問い合わせ";
    const body = [
      "軽労化ナビ 導入相談・お問い合わせ",
      "",
      `会社名: ${company}`,
      `ご担当者名: ${name}`,
      `メールアドレス: ${email}`,
      `電話番号: ${phone}`,
      `相談したい内容: ${selectedItems.length > 0 ? selectedItems.join("、") : "未選択"}`,
      "",
      "ご相談内容:",
      message || "未入力",
      "",
      "送信元: 3分体力セルフチェック",
    ].join("\n");

    window.location.href = `mailto:info@smartsupport.co.jp?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-white via-sky-50/50 to-emerald-50/40 px-4 py-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <Button asChild variant="ghost" className="bg-white/70">
          <Link href="/business">企業向けページへ戻る</Link>
        </Button>

        <section className="grid gap-6 lg:grid-cols-[1fr_0.9fr] lg:items-start">
          <div className="space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full bg-sky-50 px-4 py-2 text-sm font-black text-sky-700 ring-1 ring-sky-100">
              <Mail size={18} />
              Contact
            </div>
            <div className="space-y-3">
              <h1 className="text-4xl font-black leading-tight text-slate-950">
                導入相談・資料請求
                <span className="block text-sky-700">お問い合わせ</span>
              </h1>
              <p className="max-w-2xl text-base font-semibold leading-8 text-slate-700">
                体力測定イベント、軽労化セミナー、軽労化ナビ導入についてご相談ください。
                現場の課題や実施規模に合わせて、進め方をご提案します。
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <InfoCard icon={<CalendarCheck size={20} />} title="体験会・デモ測定" text="まずは小規模な実施から相談できます。" />
              <InfoCard icon={<UsersRound size={20} />} title="職場課題に合わせた提案" text="年齢構成、職種、作業負荷に合わせて設計します。" />
              <InfoCard icon={<ClipboardList size={20} />} title="資料請求" text="社内検討用の資料送付にも対応できます。" />
              <InfoCard icon={<Building2 size={20} />} title="法人向け導入相談" text="健康経営・労災予防の施策として活用できます。" />
            </div>
          </div>

          <Card className="border-sky-100 bg-white shadow-lg">
            <CardContent className="space-y-5 p-5">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.14em] text-sky-700">Request</p>
                <h2 className="mt-1 text-2xl font-black text-slate-950">相談内容を送る</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  入力内容をメール本文にまとめ、`info@smartsupport.co.jp` 宛のメール作成画面を開きます。
                </p>
              </div>

              <form className="space-y-4" onSubmit={(event) => event.preventDefault()}>
                <div className="grid gap-3 sm:grid-cols-2">
                  <Field label="会社名" placeholder="株式会社〇〇" value={company} onChange={setCompany} />
                  <Field label="ご担当者名" placeholder="山田 太郎" value={name} onChange={setName} />
                </div>
                <Field label="メールアドレス" placeholder="example@company.co.jp" type="email" value={email} onChange={setEmail} />
                <Field label="電話番号" placeholder="011-000-0000" value={phone} onChange={setPhone} />

                <div className="space-y-2">
                  <Label>相談したい内容</Label>
                  <div className="grid gap-2">
                    {consultationItems.map((item) => (
                      <label
                        key={item}
                        className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-700"
                      >
                        <input
                          type="checkbox"
                          checked={selectedItems.includes(item)}
                          onChange={() => toggleItem(item)}
                          className="h-4 w-4 accent-sky-600"
                        />
                        {item}
                      </label>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">ご相談内容</Label>
                  <textarea
                    id="message"
                    value={message}
                    onChange={(event) => setMessage(event.target.value)}
                    placeholder="例：製造現場で腰痛対策の体力測定イベントを検討しています。"
                    className="min-h-32 w-full rounded-lg border border-slate-200 bg-white p-3 text-sm leading-6 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                  />
                </div>

                <Button
                  type="button"
                  size="lg"
                  onClick={sendMail}
                  className="h-14 w-full rounded-full bg-sky-700 text-base hover:bg-sky-800"
                >
                  メールを作成する
                  <ArrowRight size={18} />
                </Button>
              </form>
            </CardContent>
          </Card>
        </section>

        <Card className="border-emerald-100 bg-emerald-50/70">
          <CardContent className="grid gap-3 p-5 sm:grid-cols-3">
            <MiniPoint icon={<CheckCircle2 size={18} />} text="体験会・デモ測定の相談可能" />
            <MiniPoint icon={<PhoneCall size={18} />} text="導入前のヒアリングから対応" />
            <a
              href="tel:011-206-1462"
              className="flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-sm font-bold text-emerald-800 transition hover:bg-emerald-50"
            >
              <PhoneCall size={18} />
              電話 011-206-1462
            </a>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

function Field({
  label,
  placeholder,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Input type={type} placeholder={placeholder} value={value} onChange={(event) => onChange(event.target.value)} />
    </div>
  );
}

function InfoCard({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <Card className="border-slate-200 bg-white/90 shadow-sm">
      <CardContent className="space-y-3 p-4">
        <span className="grid h-10 w-10 place-items-center rounded-2xl bg-sky-50 text-sky-700">{icon}</span>
        <div>
          <p className="text-sm font-black text-slate-950">{title}</p>
          <p className="mt-1 text-xs font-semibold leading-5 text-slate-600">{text}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function MiniPoint({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-sm font-bold text-emerald-800">
      {icon}
      {text}
    </div>
  );
}
