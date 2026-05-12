export type Gender = "male" | "female";

export type Rank = "A" | "B" | "C" | "D" | "E";

export type Category =
  | "筋力"
  | "柔軟性"
  | "バランス"
  | "体幹"
  | "腰痛予防"
  | "肩こり"
  | "ストレス発散"
  | "初心者向け";

export type Difficulty = "かんたん" | "ふつう" | "しっかり";

export type AgeGroup = "20代" | "30代" | "40代" | "50代" | "60代以上";

export type JobType =
  | "デスクワーク"
  | "建設"
  | "製造"
  | "運送"
  | "医療介護"
  | "接客"
  | "その他";

export type BodyIssue =
  | "腰痛"
  | "肩こり"
  | "疲れやすい"
  | "運動不足"
  | "身体が硬い"
  | "バランス不安"
  | "ダイエット"
  | "ストレス"
  | "特になし";

export type CheckInput = {
  gender: Gender;
  gripKg: number;
  forwardBendScore: number;
  oneLegSeconds: number;
};

export type CheckResult = {
  gripScore: number;
  flexibilityScore: number;
  balanceScore: number;
  total: number;
  rank: Rank;
  comment: string;
};

export type ExtraAnswers = {
  ageGroup?: AgeGroup;
  jobType?: JobType;
  bodyIssues: BodyIssue[];
};

export type Exercise = {
  id: string;
  title: string;
  description: string;
  category: Category;
  difficulty: Difficulty;
  target_scores: string[];
  body_issues: BodyIssue[];
  job_types: JobType[];
  age_groups: AgeGroup[];
  video_url: string | null;
  thumbnail_url: string | null;
  caution: string | null;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
};
