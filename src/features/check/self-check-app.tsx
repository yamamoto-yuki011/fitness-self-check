"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Clock,
  Dumbbell,
  ExternalLink,
  FileText,
  HeartPulse,
  Lightbulb,
  Medal,
  RotateCcw,
  ShieldCheck,
  Target,
  X,
} from "lucide-react";
import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CtaBlock } from "@/components/cta";
import { sampleExercises } from "@/data/exercises";
import { calculateResult, rankStyles } from "@/lib/assessment";
import { recommendExercises } from "@/lib/recommendations";
import type { AgeGroup, BodyIssue, CheckInput, CheckResult, Exercise, ExtraAnswers, JobType } from "@/lib/types";
import { cn } from "@/lib/utils";

type Step = "top" | "input" | "result" | "extra" | "recommend";

const forwardBendOptions = [
  { score: 5, label: "胸や顔が脚に近づく" },
  { score: 4, label: "手の平が床につく" },
  { score: 3, label: "指先が床につく" },
  { score: 2, label: "指先が床につかない" },
  { score: 1, label: "手が膝付近" },
];

const ageGroups: AgeGroup[] = ["20代", "30代", "40代", "50代", "60代以上"];
const jobTypes: JobType[] = ["デスクワーク", "建設", "製造", "運送", "医療介護", "接客", "その他"];
const bodyIssues: BodyIssue[] = [
  "腰痛",
  "肩こり",
  "疲れやすい",
  "運動不足",
  "身体が硬い",
  "バランス不安",
  "ダイエット",
  "ストレス",
  "特になし",
];

const initialInput: CheckInput = {
  gender: "male",
  gripKg: 40,
  forwardBendScore: 3,
  oneLegSeconds: 10,
};

const initialExtra: ExtraAnswers = {
  bodyIssues: [],
};

type MeasurementGuide = {
  title: string;
  url: string;
  imageUrl: string;
};

const measurementGuides = {
  grip: {
    title: "握力の測定方法",
    url: "/measurement-guides/grip.pdf",
    imageUrl: "/measurement-guides/images/grip.png",
  },
  forwardBend: {
    title: "立位体前屈の測定方法",
    url: "/measurement-guides/forward-bend.pdf",
    imageUrl: "/measurement-guides/images/forward-bend.png",
  },
  balance: {
    title: "閉眼片足立ちの測定方法",
    url: "/measurement-guides/one-leg-stand.pdf",
    imageUrl: "/measurement-guides/images/one-leg-stand.png",
  },
} satisfies Record<string, MeasurementGuide>;

const rankFeedback = {
  A: {
    score: "13〜15点",
    label: "体力バランスは良好です。",
    tendency: "筋力・柔軟性・バランス能力の土台が安定しており、健康的な状態です。",
    advice: "今後は維持が大切です。定期的に身体を動かし、運動習慣を続けましょう。",
    exercises: ["軽い筋トレ", "ジョギング・ウォーキング", "キックボクシング", "ストレッチの習慣化"],
    accent: "from-emerald-600 to-green-500",
    soft: "bg-emerald-50 border-emerald-100 text-emerald-800",
  },
  B: {
    score: "10〜12点",
    label: "平均的な体力レベルです。",
    tendency: "全体的には良好ですが、筋力・柔軟性・バランスのどこかに伸ばせる余地があります。",
    advice: "運動習慣をつけることでさらに良い状態を目指せます。無理なく続けられる運動から始めましょう。",
    exercises: ["ウォーキング", "スクワット", "ストレッチ", "軽い体幹トレーニング"],
    accent: "from-amber-500 to-orange-400",
    soft: "bg-amber-50 border-amber-100 text-amber-800",
  },
  C: {
    score: "7〜9点",
    label: "体力低下の傾向が見られます。",
    tendency: "疲れやすさや不調が出やすい状態かもしれません。体調にも影響が出やすい段階です。",
    advice: "まずは毎日少し動く習慣を作ることが大切です。こまめに身体を動かしましょう。",
    exercises: ["毎日のストレッチ", "片足立ち練習", "体幹トレーニング", "軽いウォーキング"],
    accent: "from-orange-500 to-red-400",
    soft: "bg-orange-50 border-orange-100 text-orange-800",
  },
  D: {
    score: "4〜6点",
    label: "筋力・柔軟性・バランス能力の低下が見られます。",
    tendency: "身体機能の回復が必要な状態です。疲れやすく、転倒などのリスクも高まりやすいです。",
    advice: "無理をせず、安全な範囲で身体を動かすことが大切です。少しずつ、できることから取り組みましょう。",
    exercises: ["椅子スクワット", "椅子体操", "軽いストレッチ", "呼吸を意識した体操"],
    accent: "from-purple-600 to-violet-500",
    soft: "bg-violet-50 border-violet-100 text-violet-800",
  },
  E: {
    score: "3点以下",
    label: "体力低下リスクが高い状態です。",
    tendency: "全体的に体力が低下しており、日常生活でも疲れやすく、体調を崩しやすい状態です。",
    advice: "まずは身体を動かすことに慣れるところから始めましょう。周りのサポートも活用しながら安心して取り組みましょう。",
    exercises: ["座ったまま体操", "軽い深呼吸", "短時間の歩行", "関節をほぐすストレッチ"],
    accent: "from-rose-600 to-red-500",
    soft: "bg-rose-50 border-rose-100 text-rose-800",
  },
} as const;

export function SelfCheckApp() {
  const [step, setStep] = useState<Step>("top");
  const [input, setInput] = useState<CheckInput>(initialInput);
  const [extra, setExtra] = useState<ExtraAnswers>(initialExtra);
  const [exercises, setExercises] = useState<Exercise[]>(sampleExercises);
  const [recommendationSeed, setRecommendationSeed] = useState(0);

  useEffect(() => {
    fetch("/api/exercises")
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data.exercises) && data.exercises.length > 0) {
          setExercises(data.exercises);
        }
      })
      .catch(() => setExercises(sampleExercises));
  }, []);

  const result = useMemo(() => calculateResult(input), [input]);
  const recommended = useMemo(
    () => recommendExercises(exercises, result, extra, recommendationSeed),
    [exercises, result, extra, recommendationSeed],
  );

  function showResult() {
    setStep("result");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function showRecommend() {
    setRecommendationSeed((value) => value + 1);
    setStep("recommend");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-white via-blue-50/60 to-emerald-50/50">
      <div className="mx-auto flex min-h-screen w-full max-w-2xl flex-col px-4 py-5 sm:px-6 sm:py-8">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-bold text-blue-700">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-blue-600 text-white">
              <HeartPulse size={20} />
            </span>
            3分体力セルフチェック
          </div>
          {step !== "top" && (
            <Button variant="ghost" size="sm" onClick={() => setStep("top")}>
              最初から
            </Button>
          )}
        </div>

        {step === "top" && <TopScreen onStart={() => setStep("input")} />}
        {step === "input" && (
          <InputScreen input={input} onChange={setInput} onBack={() => setStep("top")} onSubmit={showResult} />
        )}
        {step === "result" && (
          <ResultScreen result={result} onBack={() => setStep("input")} onNext={() => setStep("extra")} />
        )}
        {step === "extra" && (
          <ExtraScreen extra={extra} onChange={setExtra} onBack={() => setStep("result")} onSubmit={showRecommend} />
        )}
        {step === "recommend" && (
          <RecommendScreen
            result={result}
            exercises={recommended}
            onBack={() => setStep("extra")}
            onRetry={showRecommend}
          />
        )}
      </div>
    </main>
  );
}

function TopScreen({ onStart }: { onStart: () => void }) {
  return (
    <section className="flex flex-1 flex-col gap-6 pb-8">
      <div className="relative isolate flex min-h-[620px] flex-1 overflow-hidden rounded-lg bg-[#37aed3] px-6 py-8 text-white shadow-xl sm:min-h-[680px] sm:px-10">
        <div className="absolute -left-12 -top-12 h-36 w-36 rounded-full bg-white/95" />
        <div className="absolute left-12 -top-10 h-28 w-28 rounded-full bg-white/95" />
        <div className="absolute right-[-34px] top-[-34px] h-28 w-28 rounded-full bg-amber-200/80" />

        <div className="relative z-10 flex w-full flex-col items-center justify-center gap-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/18 px-4 py-2 text-sm font-black shadow-sm ring-1 ring-white/25 backdrop-blur">
            <HeartPulse size={18} />
            QRからすぐ診断
          </div>

          <div className="space-y-5">
            <div className="mx-auto grid h-20 w-20 place-items-center rounded-2xl bg-white text-[#37aed3] shadow-lg">
              <HeartPulse size={42} />
            </div>
            <div className="space-y-2">
              <p className="text-sm font-black uppercase tracking-[0.18em] text-white/85">Fitness Self Check</p>
              <h1 className="text-5xl font-black leading-tight sm:text-6xl">
                3分体力
                <span className="block">セルフチェック</span>
              </h1>
            </div>
            <p className="text-2xl font-black leading-relaxed">今の体力を見える化。</p>
            <p className="mx-auto max-w-md text-base font-bold leading-8 text-white/90">
              握力・立位体前屈・閉眼片足立ちの3項目で、筋力・柔軟性・バランスを確認します。
            </p>
          </div>

          <Button
            size="lg"
            className="h-16 w-full max-w-sm rounded-full bg-white text-lg font-black text-[#1687aa] shadow-lg hover:bg-blue-50"
            onClick={onStart}
          >
            START
            <ArrowRight size={22} />
          </Button>

          <div className="grid w-full max-w-sm grid-cols-3 gap-2">
            <TopMetricPill label="筋力" icon={<Dumbbell size={18} />} />
            <TopMetricPill label="柔軟性" icon={<ActivityIcon />} />
            <TopMetricPill label="バランス" icon={<BalanceIcon />} />
          </div>
        </div>
      </div>
    </section>
  );
}

function TopMetricPill({ label, icon }: { label: string; icon: React.ReactNode }) {
  return (
    <div className="relative flex min-h-24 flex-col items-center justify-center gap-1.5 px-1 py-3 text-[#1687aa]">
      <span className="absolute left-1/2 top-1 h-12 w-12 -translate-x-1/2 rounded-full bg-white shadow-md" />
      <span className="absolute left-2 top-8 h-12 w-12 rounded-full bg-white shadow-md" />
      <span className="absolute right-2 top-8 h-12 w-12 rounded-full bg-white shadow-md" />
      <span className="absolute bottom-3 left-1 right-1 h-12 rounded-full bg-white shadow-md" />
      <span className="relative z-10 grid h-8 w-8 place-items-center rounded-full bg-sky-50/90">{icon}</span>
      <span className="relative z-10 text-sm font-black">{label}</span>
    </div>
  );
}

function ActivityIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none">
      <path d="M4 13h3l2-7 4 12 2-6h5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function BalanceIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none">
      <path d="M12 4v16M7 9l5-5 5 5M6 20h12M8 14h8" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function InputScreen({
  input,
  onChange,
  onBack,
  onSubmit,
}: {
  input: CheckInput;
  onChange: (input: CheckInput) => void;
  onBack: () => void;
  onSubmit: () => void;
}) {
  const canSubmit = input.gripKg > 0 && input.oneLegSeconds >= 0;
  const [activeGuide, setActiveGuide] = useState<MeasurementGuide | null>(null);
  const [timerSeconds, setTimerSeconds] = useState(30);
  const [timerRunning, setTimerRunning] = useState(false);

  useEffect(() => {
    if (!timerRunning) return;

    const intervalId = window.setInterval(() => {
      setTimerSeconds((seconds) => {
        if (seconds <= 1) {
          window.clearInterval(intervalId);
          setTimerRunning(false);
          onChange({ ...input, oneLegSeconds: 30 });
          return 0;
        }

        return seconds - 1;
      });
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [input, onChange, timerRunning]);

  function startTimer() {
    if (timerSeconds === 0) {
      setTimerSeconds(30);
    }
    setTimerRunning(true);
  }

  function stopTimer() {
    setTimerRunning(false);
    onChange({ ...input, oneLegSeconds: 30 - timerSeconds });
  }

  function resetTimer() {
    setTimerRunning(false);
    setTimerSeconds(30);
  }

  return (
    <section className="space-y-4 pb-8">
      <ScreenHeading title="測定入力" text="わかる範囲で入力してください。閉眼片足立ちは最大30秒です。" />
      <Card>
        <CardContent className="space-y-6 p-5">
          <div className="space-y-3">
            <Label>性別</Label>
            <div className="grid grid-cols-2 gap-2">
              <SegmentButton selected={input.gender === "male"} onClick={() => onChange({ ...input, gender: "male" })}>
                男性
              </SegmentButton>
              <SegmentButton
                selected={input.gender === "female"}
                onClick={() => onChange({ ...input, gender: "female" })}
              >
                女性
              </SegmentButton>
            </div>
          </div>

          <div className="space-y-2">
            <FieldLabelWithGuide
              htmlFor="grip"
              label="握力 kg"
              onOpen={() => setActiveGuide(measurementGuides.grip)}
            />
            <Input
              id="grip"
              inputMode="decimal"
              type="number"
              min={0}
              step={0.1}
              value={input.gripKg}
              onChange={(event) => onChange({ ...input, gripKg: Number(event.target.value) })}
            />
          </div>

          <div className="space-y-3">
            <FieldLabelWithGuide
              label="立位体前屈"
              onOpen={() => setActiveGuide(measurementGuides.forwardBend)}
            />
            <div className="grid gap-2">
              {forwardBendOptions.map((option) => (
                <button
                  key={option.score}
                  type="button"
                  onClick={() => onChange({ ...input, forwardBendScore: option.score })}
                  className={cn(
                    "flex min-h-12 items-center justify-between rounded-lg border px-4 py-3 text-left transition",
                    input.forwardBendScore === option.score
                      ? "border-emerald-500 bg-emerald-50 text-emerald-900"
                      : "border-slate-200 bg-white text-slate-700",
                  )}
                >
                  <span className="text-sm font-semibold">{option.label}</span>
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-white text-sm font-bold text-blue-700">
                    {option.score}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <FieldLabelWithGuide
              htmlFor="balance"
              label="閉眼片足立ち 秒"
              onOpen={() => setActiveGuide(measurementGuides.balance)}
            />
            <Input
              id="balance"
              inputMode="numeric"
              type="number"
              min={0}
              max={30}
              value={input.oneLegSeconds}
              onChange={(event) =>
                onChange({ ...input, oneLegSeconds: Math.min(30, Number(event.target.value)) })
              }
            />
            <BalanceTimer
              secondsLeft={timerSeconds}
              running={timerRunning}
              onStart={startTimer}
              onStop={stopTimer}
              onReset={resetTimer}
            />
          </div>
        </CardContent>
      </Card>
      <div className="grid grid-cols-[auto_1fr] gap-2">
        <Button variant="outline" size="lg" onClick={onBack}>
          <ArrowLeft size={18} />
        </Button>
        <Button size="lg" onClick={onSubmit} disabled={!canSubmit}>
          結果を見る
          <ArrowRight size={18} />
        </Button>
      </div>
      <MeasurementGuideModal guide={activeGuide} onClose={() => setActiveGuide(null)} />
    </section>
  );
}

function ResultScreen({ result, onBack, onNext }: { result: CheckResult; onBack: () => void; onNext: () => void }) {
  const style = rankStyles[result.rank];
  const feedback = rankFeedback[result.rank];
  const chartData = [
    { subject: "筋力", score: result.gripScore },
    { subject: "柔軟性", score: result.flexibilityScore },
    { subject: "バランス", score: result.balanceScore },
  ];

  return (
    <section className="space-y-4 pb-8">
      <div className="relative isolate overflow-hidden rounded-lg bg-[#37aed3] p-4 text-white shadow-xl sm:p-6">
        <div className="absolute -left-24 -top-24 h-36 w-36 rounded-full bg-white/75" />
        <div className="absolute left-20 -top-24 h-28 w-28 rounded-full bg-white/65" />
        <div className="absolute right-[-32px] top-[-32px] h-24 w-24 rounded-full bg-amber-200/75" />

        <div className="relative z-10 space-y-5">
          <div className="flex items-start justify-between gap-4 rounded-lg bg-sky-600/18 p-4 backdrop-blur-sm">
            <div className="space-y-1">
              <p className="text-sm font-black uppercase tracking-[0.16em] text-white/80">Feedback</p>
              <h1 className="text-3xl font-black leading-tight">測定結果</h1>
              <p className="text-sm font-bold text-white/90">“今”の自身の体力を確認</p>
            </div>
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white text-[#1687aa] shadow-lg">
              <Medal size={28} />
            </span>
          </div>

          <div className="rounded-lg bg-white p-4 text-slate-950 shadow-lg">
            <div className="flex items-center gap-4">
              <div
                className={cn(
                  "grid h-24 w-24 shrink-0 place-items-center rounded-full text-5xl font-black ring-8",
                  style.bg,
                  style.text,
                  style.ring,
                )}
              >
                {result.rank}
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-500">{feedback.score}</p>
                <p className="text-4xl font-black text-slate-950">
                  {result.total}
                  <span className="text-base text-slate-500"> / 15点</span>
                </p>
                <p className="mt-1 text-sm font-bold text-slate-800">{feedback.label}</p>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-white p-4 text-slate-950 shadow-lg">
            <FiveLevelScore result={result} />
          </div>

          <div className="h-72 w-full rounded-lg bg-white p-2 shadow-lg">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={chartData}>
                <PolarGrid stroke="#cbd5e1" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: "#0f172a", fontSize: 13, fontWeight: 700 }} />
                <PolarRadiusAxis angle={90} domain={[0, 5]} tick={false} axisLine={false} />
                <Radar dataKey="score" stroke="#2563eb" fill="#10b981" fillOpacity={0.35} strokeWidth={3} />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <MeasurementPointStrip />

          <div className="grid gap-3">
            <FeedbackBox
              icon={<Target size={18} />}
              title="体力の傾向"
              text={feedback.tendency}
              className={feedback.soft}
            />
            <FeedbackBox
              icon={<Lightbulb size={18} />}
              title="日常のアドバイス"
              text={feedback.advice}
              className={feedback.soft}
            />
          </div>
        </div>
      </div>
      <Button size="lg" className="w-full" onClick={onNext}>
        もっと自分向けの運動を見る
        <ArrowRight size={18} />
      </Button>
      <Button variant="outline" className="w-full" onClick={onBack}>
        入力を修正する
      </Button>
      <CtaBlock rank={result.rank} showFitnessBanner={false} />
    </section>
  );
}

function ExtraScreen({
  extra,
  onChange,
  onBack,
  onSubmit,
}: {
  extra: ExtraAnswers;
  onChange: (extra: ExtraAnswers) => void;
  onBack: () => void;
  onSubmit: () => void;
}) {
  function toggleIssue(issue: BodyIssue) {
    if (issue === "特になし") {
      onChange({ ...extra, bodyIssues: extra.bodyIssues.includes(issue) ? [] : ["特になし"] });
      return;
    }

    const next = extra.bodyIssues.includes(issue)
      ? extra.bodyIssues.filter((item) => item !== issue)
      : [...extra.bodyIssues.filter((item) => item !== "特になし"), issue];
    onChange({ ...extra, bodyIssues: next });
  }

  return (
    <section className="space-y-4 pb-8">
      <ScreenHeading title="追加質問" text="任意入力です。選ぶほどおすすめ運動が自分向けになります。" />
      <Card>
        <CardContent className="space-y-6 p-5">
          <ChoiceGroup
            label="年代"
            values={ageGroups}
            selected={extra.ageGroup}
            onSelect={(value) => onChange({ ...extra, ageGroup: value as AgeGroup })}
          />
          <ChoiceGroup
            label="職業"
            values={jobTypes}
            selected={extra.jobType}
            onSelect={(value) => onChange({ ...extra, jobType: value as JobType })}
          />
          <div className="space-y-3">
            <Label>身体の悩み</Label>
            <div className="flex flex-wrap gap-2">
              {bodyIssues.map((issue) => (
                <button
                  type="button"
                  key={issue}
                  onClick={() => toggleIssue(issue)}
                  className={cn(
                    "rounded-full border px-4 py-2 text-sm font-semibold transition",
                    extra.bodyIssues.includes(issue)
                      ? "border-emerald-500 bg-emerald-50 text-emerald-800"
                      : "border-slate-200 bg-white text-slate-700",
                  )}
                >
                  {issue}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="grid grid-cols-[auto_1fr] gap-2">
        <Button variant="outline" size="lg" onClick={onBack}>
          <ArrowLeft size={18} />
        </Button>
        <Button size="lg" onClick={onSubmit}>
          おすすめを見る
          <ArrowRight size={18} />
        </Button>
      </div>
    </section>
  );
}

function RecommendScreen({
  result,
  exercises,
  onBack,
  onRetry,
}: {
  result: CheckResult;
  exercises: Exercise[];
  onBack: () => void;
  onRetry: () => void;
}) {
  return (
    <section className="space-y-4 pb-8">
      <div className="relative isolate overflow-hidden rounded-lg bg-[#37aed3] p-4 text-white shadow-xl sm:p-6">
        <div className="absolute -left-24 -top-24 h-36 w-36 rounded-full bg-white/75" />
        <div className="absolute left-20 -top-24 h-28 w-28 rounded-full bg-white/65" />
        <div className="absolute right-[-32px] top-[-32px] h-24 w-24 rounded-full bg-amber-200/75" />

        <div className="relative z-10 space-y-4">
          <div className="flex items-start justify-between gap-4 rounded-lg bg-sky-600/18 p-4 backdrop-blur-sm">
            <div className="space-y-1">
              <p className="text-sm font-black uppercase tracking-[0.16em] text-white/80">Exercise</p>
              <h1 className="text-3xl font-black leading-tight">おすすめ運動</h1>
              <p className="text-sm font-bold text-white/90">今の体力に合う3つを提案</p>
            </div>
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white text-[#1687aa] shadow-lg">
              <Dumbbell size={28} />
            </span>
          </div>

          <div className="rounded-lg bg-white p-4 text-slate-950 shadow-lg">
            <p className="text-sm leading-7 text-slate-700">
              総合ランク{result.rank}と低かった項目、追加質問の内容から、今取り組みやすい運動を選びました。
            </p>
            <div className="mt-3 grid grid-cols-3 gap-2">
              <ScorePill label="筋力" score={result.gripScore} />
              <ScorePill label="柔軟性" score={result.flexibilityScore} />
              <ScorePill label="バランス" score={result.balanceScore} />
            </div>
          </div>

          <div className="grid gap-3">
            {exercises.map((exercise, index) => (
              <Card key={`${exercise.id}-${index}`} className="overflow-hidden border-white/80 bg-white shadow-lg">
                <CardHeader>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex gap-3">
                      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#37aed3] text-lg font-black text-white shadow-md">
                        {index + 1}
                      </span>
                      <div className="space-y-2">
                        <div className="flex flex-wrap gap-2">
                          <Badge>{exercise.category}</Badge>
                          <Badge className="border-emerald-100 bg-emerald-50 text-emerald-700">
                            {exercise.difficulty}
                          </Badge>
                        </div>
                        <CardTitle>{exercise.title}</CardTitle>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm leading-7 text-slate-700">{exercise.description}</p>
                  <div className="rounded-lg bg-blue-50 p-3 text-xs leading-6 text-blue-800">
                    <span className="font-black">選ばれた理由: </span>
                    {recommendationReason(exercise, result)}
                  </div>
                  {exercise.caution && (
                    <p className="rounded-lg bg-amber-50 p-3 text-xs leading-6 text-amber-800">
                      {exercise.caution}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
      <Button variant="outline" className="w-full" onClick={onRetry}>
        <RotateCcw size={18} />
        別の3件を見る
      </Button>
      <Button variant="ghost" className="w-full" onClick={onBack}>
        追加質問を修正する
      </Button>
      <CtaBlock rank={result.rank} />
    </section>
  );
}

function recommendationReason(exercise: Exercise, result: CheckResult) {
  if (result.gripScore <= 2 && exercise.target_scores.includes("筋力")) {
    return "筋力の点数を補いやすい運動です。";
  }
  if (result.flexibilityScore <= 2 && exercise.target_scores.includes("柔軟性")) {
    return "柔軟性を高める目的に合っています。";
  }
  if (result.balanceScore <= 2 && exercise.target_scores.includes("バランス")) {
    return "バランス感覚の練習に向いています。";
  }
  if (exercise.category === "初心者向け") {
    return "負担が少なく、今日から始めやすい運動です。";
  }

  return "現在の結果と相性がよく、無理なく体力づくりにつなげやすい運動です。";
}

function FeedbackBox({
  icon,
  title,
  text,
  className,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
  className: string;
}) {
  return (
    <div className={cn("rounded-lg border p-4", className)}>
      <div className="mb-2 flex items-center gap-2">
        {icon}
        <p className="text-sm font-black">{title}</p>
      </div>
      <p className="text-sm leading-7 text-slate-700">{text}</p>
    </div>
  );
}

function MeasurementPointStrip() {
  return (
    <div className="rounded-lg border border-blue-100 bg-blue-50/70 p-4">
      <div className="mb-3 flex items-center gap-2 text-blue-900">
        <ShieldCheck size={18} />
        <p className="text-sm font-black">体力チェック項目のポイント</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <MiniPoint title="握力" text="全身の筋力の目安になり、日常動作や転倒予防にも関係します。" />
        <MiniPoint title="立位体前屈" text="柔軟性の目安です。腰痛予防や姿勢改善にもつながります。" />
        <MiniPoint title="閉眼片足立ち" text="バランス能力の目安です。転倒予防や運動能力の向上に役立ちます。" />
      </div>
    </div>
  );
}

function MiniPoint({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-lg bg-white p-3">
      <p className="mb-1 text-sm font-black text-blue-800">{title}</p>
      <p className="text-xs leading-6 text-slate-600">{text}</p>
    </div>
  );
}

function ScreenHeading({ title, text }: { title: string; text: string }) {
  return (
    <div className="space-y-2">
      <h1 className="text-2xl font-black text-slate-950">{title}</h1>
      <p className="text-sm leading-6 text-slate-600">{text}</p>
    </div>
  );
}

function SegmentButton({
  selected,
  onClick,
  children,
}: {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex h-12 items-center justify-center gap-2 rounded-lg border text-sm font-bold transition",
        selected ? "border-blue-600 bg-blue-50 text-blue-700" : "border-slate-200 bg-white text-slate-700",
      )}
    >
      {selected && <Check size={16} />}
      {children}
    </button>
  );
}

function ScorePill({ label, score }: { label: string; score: number }) {
  return (
    <div className="rounded-lg bg-slate-50 p-3 text-center">
      <p className="text-xs font-bold text-slate-500">{label}</p>
      <p className="text-2xl font-black text-blue-700">{score}</p>
    </div>
  );
}

function FiveLevelScore({ result }: { result: CheckResult }) {
  const items = [
    { label: "筋力", score: result.gripScore },
    { label: "柔軟性", score: result.flexibilityScore },
    { label: "バランス", score: result.balanceScore },
  ];

  return (
    <div className="rounded-lg border border-blue-100 bg-blue-50/70 p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="text-sm font-black text-blue-950">5段階評価</p>
        <p className="text-xs font-bold text-blue-700">各項目 1〜5点</p>
      </div>
      <div className="grid gap-3">
        {items.map((item) => (
          <div key={item.label} className="rounded-lg bg-white p-3">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-sm font-black text-slate-900">{item.label}</p>
              <p className="text-sm font-black text-blue-700">{item.score}/5</p>
            </div>
            <div className="grid grid-cols-5 gap-1.5">
              {[1, 2, 3, 4, 5].map((level) => (
                <div
                  key={level}
                  className={cn(
                    "h-3 rounded-full",
                    level <= item.score ? "bg-blue-600" : "bg-slate-200",
                  )}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ChoiceGroup({
  label,
  values,
  selected,
  onSelect,
}: {
  label: string;
  values: readonly string[];
  selected?: string;
  onSelect: (value: string) => void;
}) {
  return (
    <div className="space-y-3">
      <Label>{label}</Label>
      <div className="flex flex-wrap gap-2">
        {values.map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => onSelect(value)}
            className={cn(
              "rounded-full border px-4 py-2 text-sm font-semibold transition",
              selected === value ? "border-blue-600 bg-blue-50 text-blue-700" : "border-slate-200 bg-white text-slate-700",
            )}
          >
            {value}
          </button>
        ))}
      </div>
    </div>
  );
}

function BalanceTimer({
  secondsLeft,
  running,
  onStart,
  onStop,
  onReset,
}: {
  secondsLeft: number;
  running: boolean;
  onStart: () => void;
  onStop: () => void;
  onReset: () => void;
}) {
  const measured = 30 - secondsLeft;

  return (
    <div className="rounded-lg border border-blue-100 bg-blue-50/70 p-3">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-white text-blue-700">
            <Clock size={18} />
          </span>
          <div>
            <p className="text-sm font-bold text-slate-900">30秒タイマー</p>
            <p className="text-xs text-slate-600">
              {running ? "止まったら停止を押してください" : "開始すると残り時間を表示します"}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-black text-blue-700">{secondsLeft}</p>
          <p className="text-xs font-semibold text-slate-500">秒</p>
        </div>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2">
        <Button type="button" size="sm" onClick={onStart} disabled={running}>
          開始
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={onStop} disabled={!running}>
          停止
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={onReset}>
          リセット
        </Button>
      </div>
      {!running && measured > 0 && secondsLeft > 0 && (
        <p className="mt-2 text-xs font-semibold text-emerald-700">入力値に {measured} 秒を反映しました。</p>
      )}
      {secondsLeft === 0 && (
        <p className="mt-2 text-xs font-semibold text-emerald-700">30秒達成です。入力値に30秒を反映しました。</p>
      )}
    </div>
  );
}

function FieldLabelWithGuide({
  label,
  htmlFor,
  onOpen,
}: {
  label: string;
  htmlFor?: string;
  onOpen: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <Label htmlFor={htmlFor}>{label}</Label>
      <button
        type="button"
        onClick={onOpen}
        className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 text-xs font-bold text-blue-700 transition hover:bg-blue-100"
      >
        <FileText size={14} />
        測定方法
      </button>
    </div>
  );
}

function MeasurementGuideModal({
  guide,
  onClose,
}: {
  guide: MeasurementGuide | null;
  onClose: () => void;
}) {
  if (!guide) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/35 px-3 pb-3 pt-12 sm:items-center sm:p-6">
      <div className="flex max-h-[82vh] w-full max-w-3xl flex-col overflow-hidden rounded-lg bg-white shadow-2xl ring-1 ring-slate-900/10">
        <div className="flex items-center justify-between gap-3 border-b border-slate-200 p-3">
          <div className="min-w-0">
            <p className="truncate text-sm font-black text-slate-950">{guide.title}</p>
            <p className="text-xs text-slate-500">確認後、閉じると入力に戻れます。</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="閉じる"
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-slate-100 text-slate-700 transition hover:bg-slate-200"
          >
            <X size={20} />
          </button>
        </div>
        <div className="max-h-[62vh] overflow-auto bg-slate-100 p-2 sm:max-h-[70vh]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={guide.imageUrl}
            alt={guide.title}
            className="mx-auto h-auto w-full max-w-3xl rounded bg-white shadow-sm"
          />
        </div>
        <div className="flex items-center justify-between gap-2 border-t border-slate-200 p-3">
          <a
            href={guide.url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-10 items-center gap-2 rounded-lg px-3 text-sm font-bold text-blue-700 hover:bg-blue-50"
          >
            別タブで開く
            <ExternalLink size={16} />
          </a>
          <Button size="sm" onClick={onClose}>
            入力に戻る
          </Button>
        </div>
      </div>
    </div>
  );
}
