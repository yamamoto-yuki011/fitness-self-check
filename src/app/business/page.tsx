import Image from "next/image";
import Link from "next/link";
import {
  Activity,
  ArrowRight,
  BarChart3,
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  ClipboardCheck,
  FileText,
  HeartPulse,
  ShieldCheck,
  TrendingUp,
  UsersRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const painPoints = [
  "高齢化により、転倒や腰痛リスクが高まっている",
  "従業員の体力差を把握できていない",
  "作業負荷が高い工程を客観的に説明できない",
  "健康経営の取り組みが形骸化している",
  "労災予防の具体策に悩んでいる",
];

const capabilities = [
  {
    icon: <BarChart3 size={22} />,
    title: "作業負荷の見える化",
    text: "動作、姿勢、腰部負荷を整理し、負担の大きい作業を把握します。",
  },
  {
    icon: <Activity size={22} />,
    title: "体力の見える化",
    text: "握力、柔軟性、バランスなどを測定し、従業員ごとの傾向を確認します。",
  },
  {
    icon: <TrendingUp size={22} />,
    title: "改善アクション",
    text: "運動提案、トレーナー指導、継続測定まで改善につながる実行策を支援します。",
  },
];

const flow = [
  "体力チェック",
  "個人の気づき",
  "企業全体の体力傾向を把握",
  "作業リスクも可視化",
  "労災予防・健康経営・職場改善へ",
];

const benefits = [
  "腰痛・転倒などの労災予防",
  "従業員の健康意識向上",
  "作業負荷の高い工程の把握",
  "体力に応じた配置・指導の参考",
  "健康経営施策として活用",
  "定期測定による改善サイクル",
];

const steps = [
  "お問い合わせ",
  "ヒアリング",
  "軽労化セミナー開催",
  "体力測定・作業負荷の確認",
  "結果レポート",
  "契約",
  "軽労化ナビ導入",
];

export default function BusinessPage() {
  return (
    <main className="min-h-screen bg-white text-slate-950">
      <section className="relative overflow-hidden border-b border-slate-100">
        <div className="absolute inset-0">
          <Image
            src="/brand/business-hero.png"
            alt="体力測定と作業リスク分析を行う企業向け支援イメージ"
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/92 to-white/35" />
        </div>

        <div className="relative mx-auto grid min-h-[640px] max-w-6xl items-center px-4 py-8 sm:px-6 lg:min-h-[700px] lg:px-8">
          <div className="max-w-2xl space-y-6">
            <Button asChild variant="ghost" className="w-fit bg-white/80 backdrop-blur">
              <Link href="/">体力チェックへ戻る</Link>
            </Button>

            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm font-black text-emerald-700 ring-1 ring-emerald-100">
                <Building2 size={18} />
                軽労化ナビ
              </div>
              <p className="text-sm font-black uppercase tracking-[0.16em] text-sky-700">Corporate Wellness & Safety</p>
              <h1 className="text-4xl font-black leading-tight text-slate-950 sm:text-5xl">
                企業の体力と作業リスクを、
                <span className="block text-sky-700">見える化する。</span>
              </h1>
              <p className="text-2xl font-black leading-snug text-slate-900">
                「体力低下」と「作業負荷」を見える化し、労災リスクを予防する。
              </p>
              <p className="max-w-xl text-base font-semibold leading-8 text-slate-700">
                体力測定・作業負荷分析・運動指導を組み合わせ、
                従業員が長く安全に働ける職場づくりを支援します。
              </p>
              <p className="max-w-xl text-sm leading-7 text-slate-600">
                3分体力チェックの次は、企業全体の体力・作業リスクを可視化しませんか？
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" className="h-14 rounded-full bg-sky-700 px-7 text-base hover:bg-sky-800">
                <a href="https://smartsupport.co.jp/contact" target="_blank" rel="noreferrer">
                  導入相談する
                  <ArrowRight size={18} />
                </a>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-14 rounded-full border-sky-200 bg-white/90 px-7 text-base text-sky-800">
                <a href="https://smartsupport.co.jp" target="_blank" rel="noreferrer">
                  詳細ページ確認
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Section eyebrow="Pain Points" title="こんな課題はありませんか？">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          {painPoints.map((item) => (
            <Card key={item} className="border-slate-200 shadow-sm">
              <CardContent className="space-y-3 p-4">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-rose-50 text-rose-600">
                  <ShieldCheck size={20} />
                </span>
                <p className="text-sm font-bold leading-7 text-slate-800">{item}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>

      <Section eyebrow="What It Does" title="軽労化ナビでできること">
        <div className="grid gap-4 lg:grid-cols-3">
          {capabilities.map((item) => (
            <Card key={item.title} className="border-slate-200 shadow-md">
              <CardContent className="space-y-4 p-5">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-sky-50 text-sky-700">
                  {item.icon}
                </span>
                <h3 className="text-xl font-black">{item.title}</h3>
                <p className="text-sm font-semibold leading-7 text-slate-600">{item.text}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>

      <Section eyebrow="Journey" title="簡易チェックから、企業全体の健康経営へ。">
        <Card className="border-emerald-100 bg-emerald-50/60 shadow-sm">
          <CardContent className="grid gap-3 p-4 md:grid-cols-5">
            {flow.map((item, index) => (
              <div key={item} className="relative rounded-2xl bg-white p-4 text-center shadow-sm">
                <p className="mb-2 text-xs font-black uppercase tracking-[0.16em] text-emerald-600">Step {index + 1}</p>
                <p className="text-sm font-black leading-6 text-slate-900">{item}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </Section>

      <Section eyebrow="Benefits" title="導入メリット">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map((item) => (
            <Card key={item} className="border-slate-200 shadow-sm">
              <CardContent className="flex gap-3 p-4">
                <CheckCircle2 className="mt-0.5 shrink-0 text-emerald-600" size={20} />
                <p className="text-sm font-bold leading-7 text-slate-800">{item}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>

      <Section eyebrow="軽労化トレーナー" title="測定して終わりではなく、現場で活用できる形まで支援します。">
        <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <Card className="border-slate-200 shadow-md">
            <CardContent className="space-y-4 p-5">
              <div className="flex items-center gap-3">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-slate-900 text-white">
                  <UsersRound size={22} />
                </span>
                <div>
                  <p className="text-sm font-black text-sky-700">軽労化トレーナー</p>
                  <h3 className="text-xl font-black">導入から活用まで伴走</h3>
                </div>
              </div>
              <p className="text-sm font-semibold leading-8 text-slate-700">
                軽労化トレーナーが定期的に職場へ出向き、体力測定を実施し、
                企業ごとの課題に合わせた導入支援を行います。軽労化ナビのデータを、
                実際の健康行動や職場改善につなげるところまで支援し、エンゲージメントの向上に寄与します。
              </p>
            </CardContent>
          </Card>
          <div className="grid gap-3">
            <SupportMiniCard icon={<ClipboardCheck size={18} />} title="定期的に体力測定の実施" />
            <SupportMiniCard icon={<BriefcaseBusiness size={18} />} title="個別に合わせた運動指導" />
            <SupportMiniCard icon={<HeartPulse size={18} />} title="前向きな行動変容を支援" />
          </div>
        </div>
      </Section>

      <Section eyebrow="Process" title="導入の流れ">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {steps.map((item, index) => (
            <Card key={item} className="border-slate-200 shadow-sm">
              <CardContent className="flex items-center gap-4 p-4">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-sky-700 text-lg font-black text-white">
                  {index + 1}
                </span>
                <p className="text-base font-black text-slate-900">{item}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>

      <section className="px-4 pb-12 pt-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl overflow-hidden rounded-3xl bg-slate-950 p-6 text-white shadow-xl sm:p-8">
          <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-center">
            <div className="space-y-3">
              <p className="text-sm font-black uppercase tracking-[0.16em] text-emerald-300">Contact</p>
              <h2 className="text-3xl font-black leading-tight">まずは、従業員の体力を見える化しませんか？</h2>
              <p className="text-sm font-semibold leading-7 text-slate-200">
                体験会・デモ測定の相談も可能です。
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
              <Button asChild size="lg" className="h-14 rounded-full bg-emerald-500 px-7 text-base text-slate-950 hover:bg-emerald-400">
                <a href="https://smartsupport.co.jp/contact" target="_blank" rel="noreferrer">
                  導入相談する
                </a>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-14 rounded-full border-white/30 bg-transparent px-7 text-base text-white hover:bg-white/10">
                <a href="https://smartsupport.co.jp" target="_blank" rel="noreferrer">
                  <FileText size={18} />
                  詳細ページ確認
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function Section({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-5">
        <div className="space-y-2">
          <p className="text-sm font-black uppercase tracking-[0.16em] text-emerald-700">{eyebrow}</p>
          <h2 className="text-2xl font-black leading-tight text-slate-950 sm:text-3xl">{title}</h2>
        </div>
        {children}
      </div>
    </section>
  );
}

function SupportMiniCard({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <Card className="border-slate-200 shadow-sm">
      <CardContent className="flex items-center gap-3 p-4">
        <span className="grid h-10 w-10 place-items-center rounded-2xl bg-emerald-50 text-emerald-700">{icon}</span>
        <p className="text-sm font-black text-slate-900">{title}</p>
      </CardContent>
    </Card>
  );
}
