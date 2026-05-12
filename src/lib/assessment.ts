import type { CheckInput, CheckResult, Gender, Rank } from "@/lib/types";

export function scoreGrip(gender: Gender, gripKg: number) {
  if (gender === "male") {
    if (gripKg >= 50) return 5;
    if (gripKg >= 45) return 4;
    if (gripKg >= 40) return 3;
    if (gripKg >= 35) return 2;
    return 1;
  }

  if (gripKg >= 32) return 5;
  if (gripKg >= 28) return 4;
  if (gripKg >= 24) return 3;
  if (gripKg >= 20) return 2;
  return 1;
}

export function scoreBalance(seconds: number) {
  if (seconds >= 30) return 5;
  if (seconds >= 20) return 4;
  if (seconds >= 10) return 3;
  if (seconds >= 5) return 2;
  return 1;
}

export function rankTotal(total: number): Rank {
  if (total >= 13) return "A";
  if (total >= 10) return "B";
  if (total >= 7) return "C";
  if (total >= 4) return "D";
  return "E";
}

export function rankComment(rank: Rank) {
  const comments: Record<Rank, string> = {
    A: "すばらしい状態です。今の習慣を続けながら、少しずつ強度を上げるとさらに伸ばせます。",
    B: "良い土台があります。低かった項目を少し補うだけで、全体の安定感が上がりそうです。",
    C: "標準的なスタート地点です。無理なく続けられる運動を選ぶと、体の変化を感じやすくなります。",
    D: "伸びしろが大きい状態です。短時間のかんたんな運動から始めて、まずは習慣化を目指しましょう。",
    E: "今はやさしい運動からで十分です。痛みがある場合は無理せず、体調に合わせて進めてください。",
  };

  return comments[rank];
}

export function calculateResult(input: CheckInput): CheckResult {
  const gripScore = scoreGrip(input.gender, input.gripKg);
  const flexibilityScore = Math.min(5, Math.max(1, input.forwardBendScore));
  const balanceScore = scoreBalance(Math.min(30, Math.max(0, input.oneLegSeconds)));
  const total = gripScore + flexibilityScore + balanceScore;
  const rank = rankTotal(total);

  return {
    gripScore,
    flexibilityScore,
    balanceScore,
    total,
    rank,
    comment: rankComment(rank),
  };
}

export const rankStyles: Record<Rank, { text: string; bg: string; ring: string }> = {
  A: { text: "text-emerald-700", bg: "bg-emerald-100", ring: "ring-emerald-200" },
  B: { text: "text-sky-700", bg: "bg-sky-100", ring: "ring-sky-200" },
  C: { text: "text-blue-700", bg: "bg-blue-100", ring: "ring-blue-200" },
  D: { text: "text-amber-700", bg: "bg-amber-100", ring: "ring-amber-200" },
  E: { text: "text-rose-700", bg: "bg-rose-100", ring: "ring-rose-200" },
};
