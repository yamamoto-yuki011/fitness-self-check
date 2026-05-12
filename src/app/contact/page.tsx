import Link from "next/link";
import { Mail, PhoneCall } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-2xl space-y-6">
        <Button asChild variant="ghost">
          <Link href="/business">企業向けページへ戻る</Link>
        </Button>
        <section className="space-y-3">
          <p className="text-sm font-black uppercase tracking-[0.16em] text-sky-700">Contact</p>
          <h1 className="text-3xl font-black text-slate-950">お問い合わせ窓口は準備中です</h1>
          <p className="text-sm font-semibold leading-7 text-slate-600">
            導入相談・資料請求の導線として用意した仮ページです。フォーム実装時にこのページへ接続できます。
          </p>
        </section>
        <div className="grid gap-3">
          <Card>
            <CardContent className="flex items-center gap-3 p-4">
              <Mail className="text-sky-700" />
              <p className="text-sm font-bold text-slate-800">導入相談フォームをここに接続予定</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-3 p-4">
              <PhoneCall className="text-emerald-700" />
              <p className="text-sm font-bold text-slate-800">体験会・デモ測定相談にも対応予定</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
