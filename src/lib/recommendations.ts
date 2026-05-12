import type { CheckResult, Exercise, ExtraAnswers } from "@/lib/types";

const issueCategoryMap: Record<string, string[]> = {
  腰痛: ["腰痛予防", "体幹", "柔軟性"],
  肩こり: ["肩こり", "柔軟性"],
  疲れやすい: ["初心者向け", "ストレス発散", "体幹"],
  運動不足: ["初心者向け", "筋力", "バランス"],
  身体が硬い: ["柔軟性"],
  バランス不安: ["バランス", "体幹"],
  ダイエット: ["筋力", "体幹"],
  ストレス: ["ストレス発散", "柔軟性"],
};

function shuffle<T>(items: T[]) {
  return [...items].sort(() => Math.random() - 0.5);
}

export function recommendExercises(
  exercises: Exercise[],
  result: CheckResult,
  answers: ExtraAnswers,
  refreshSeed = 0,
) {
  const active = exercises.filter((exercise) => exercise.is_active);
  const priorityCategories = new Set<string>();

  if (result.gripScore <= 2) priorityCategories.add("筋力");
  if (result.flexibilityScore <= 2) priorityCategories.add("柔軟性");
  if (result.balanceScore <= 2) priorityCategories.add("バランス");
  if (result.total <= 9) priorityCategories.add("初心者向け");

  for (const issue of answers.bodyIssues) {
    for (const category of issueCategoryMap[issue] ?? []) {
      priorityCategories.add(category);
    }
  }

  const scored = active
    .map((exercise) => {
      let score = 0;

      if (priorityCategories.has(exercise.category)) score += 5;
      if (answers.bodyIssues.some((issue) => exercise.body_issues.includes(issue))) score += 4;
      if (answers.jobType && exercise.job_types.includes(answers.jobType)) score += 2;
      if (answers.ageGroup && exercise.age_groups.includes(answers.ageGroup)) score += 1;
      if (result.gripScore <= 2 && exercise.target_scores.includes("筋力")) score += 3;
      if (result.flexibilityScore <= 2 && exercise.target_scores.includes("柔軟性")) score += 3;
      if (result.balanceScore <= 2 && exercise.target_scores.includes("バランス")) score += 3;
      if (exercise.category === "初心者向け") score += 1;

      return { exercise, score };
    })
    .filter((item) => item.score > 0);

  const relevant = scored.length >= 3 ? scored : active.map((exercise) => ({ exercise, score: 1 }));
  const topScore = Math.max(...relevant.map((item) => item.score));
  const pool = relevant
    .filter((item) => item.score >= Math.max(1, topScore - 4))
    .map((item) => item.exercise);

  const offset = pool.length > 0 ? refreshSeed % pool.length : 0;
  const rotated = [...pool.slice(offset), ...pool.slice(0, offset)];

  return shuffle(rotated).slice(0, 3);
}
