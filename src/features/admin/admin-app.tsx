"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Eye, EyeOff, Pencil, Plus, Save } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { categories, difficulties, sampleExercises } from "@/data/exercises";
import type { Category, Difficulty, Exercise } from "@/lib/types";

const emptyExercise: Exercise = {
  id: "",
  title: "",
  description: "",
  category: "初心者向け",
  difficulty: "かんたん",
  target_scores: [],
  body_issues: [],
  job_types: [],
  age_groups: [],
  video_url: null,
  thumbnail_url: null,
  caution: null,
  is_active: true,
};

export function AdminApp() {
  const [authenticated, setAuthenticated] = useState(
    () => typeof window !== "undefined" && window.localStorage.getItem("admin-ok") === "true",
  );
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [source, setSource] = useState<"seed" | "supabase" | "local">("seed");
  const [exercises, setExercises] = useState<Exercise[]>(sampleExercises);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("");
  const [editing, setEditing] = useState<Exercise | null>(null);

  useEffect(() => {
    if (!authenticated) return;

    fetch("/api/exercises")
      .then((response) => response.json())
      .then((data) => {
        setSource(data.source ?? "seed");
        setExercises(Array.isArray(data.exercises) ? data.exercises : sampleExercises);
      })
      .catch(() => {
        setSource("seed");
        setExercises(sampleExercises);
      });
  }, [authenticated]);

  const filtered = useMemo(
    () =>
      exercises.filter((exercise) => {
        const categoryOk = !categoryFilter || exercise.category === categoryFilter;
        const difficultyOk = !difficultyFilter || exercise.difficulty === difficultyFilter;
        return categoryOk && difficultyOk;
      }),
    [exercises, categoryFilter, difficultyFilter],
  );

  async function login(event: FormEvent) {
    event.preventDefault();
    setMessage("");
    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (!response.ok) {
      const data = await response.json().catch(() => null);
      setMessage(data?.message ?? "ログインできませんでした。");
      return;
    }

    window.localStorage.setItem("admin-ok", "true");
    setAuthenticated(true);
  }

  async function saveExercise(exercise: Exercise) {
    const normalized = {
      ...exercise,
      id: exercise.id || crypto.randomUUID(),
      target_scores: [exercise.category],
      updated_at: new Date().toISOString(),
    };

    if (source === "supabase") {
      const isNew = !exercise.id;
      const response = await fetch(isNew ? "/api/exercises" : `/api/exercises/${exercise.id}`, {
        method: isNew ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(normalized),
      });
      const data = await response.json();
      if (!response.ok) {
        setMessage(data.message ?? "保存に失敗しました。");
        return;
      }
      setExercises((current) =>
        isNew
          ? [data.exercise, ...current]
          : current.map((item) => (item.id === data.exercise.id ? data.exercise : item)),
      );
    } else {
      setSource("local");
      setExercises((current) => {
        const exists = current.some((item) => item.id === normalized.id);
        return exists
          ? current.map((item) => (item.id === normalized.id ? normalized : item))
          : [normalized, ...current];
      });
    }

    setEditing(null);
    setMessage("保存しました。");
  }

  async function toggleActive(exercise: Exercise) {
    if (source === "supabase") {
      const response = await fetch(`/api/exercises/${exercise.id}/toggle`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: !exercise.is_active }),
      });
      const data = await response.json();
      if (!response.ok) {
        setMessage(data.message ?? "更新に失敗しました。");
        return;
      }
      setExercises((current) => current.map((item) => (item.id === exercise.id ? data.exercise : item)));
    } else {
      setSource("local");
      setExercises((current) =>
        current.map((item) => (item.id === exercise.id ? { ...item, is_active: !item.is_active } : item)),
      );
    }
  }

  if (!authenticated) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-white to-blue-50 px-4 py-8">
        <form onSubmit={login} className="mx-auto max-w-sm space-y-4">
          <Button asChild variant="ghost">
            <Link href="/">
              <ArrowLeft size={18} />
              戻る
            </Link>
          </Button>
          <Card>
            <CardHeader>
              <CardTitle>管理画面ログイン</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">パスワード</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />
              </div>
              {message && <p className="text-sm text-rose-600">{message}</p>}
              <Button className="w-full">ログイン</Button>
            </CardContent>
          </Card>
        </form>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6">
      <div className="mx-auto max-w-5xl space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-black text-slate-950">運動管理</h1>
            <p className="text-sm text-slate-600">
              データ元: {source === "supabase" ? "Supabase" : source === "local" ? "ローカル編集" : "seed"}
            </p>
          </div>
          <div className="flex gap-2">
            <Button asChild variant="outline">
              <Link href="/">診断へ</Link>
            </Button>
            <Button onClick={() => setEditing(emptyExercise)}>
              <Plus size={18} />
              新規追加
            </Button>
          </div>
        </div>

        {message && <p className="rounded-lg bg-blue-50 p-3 text-sm font-semibold text-blue-700">{message}</p>}

        <Card>
          <CardContent className="grid gap-3 p-4 sm:grid-cols-2">
            <SelectFilter
              label="カテゴリ検索"
              value={categoryFilter}
              options={categories}
              onChange={setCategoryFilter}
            />
            <SelectFilter
              label="難易度検索"
              value={difficultyFilter}
              options={difficulties}
              onChange={setDifficultyFilter}
            />
          </CardContent>
        </Card>

        {editing && (
          <ExerciseForm
            exercise={editing}
            onCancel={() => setEditing(null)}
            onSave={saveExercise}
          />
        )}

        <div className="grid gap-3">
          {filtered.map((exercise) => (
            <Card key={exercise.id}>
              <CardContent className="space-y-4 p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="space-y-2">
                    <div className="flex flex-wrap gap-2">
                      <Badge>{exercise.category}</Badge>
                      <Badge className="border-emerald-100 bg-emerald-50 text-emerald-700">
                        {exercise.difficulty}
                      </Badge>
                      {!exercise.is_active && (
                        <Badge className="border-slate-200 bg-slate-100 text-slate-600">非公開</Badge>
                      )}
                    </div>
                    <h2 className="text-lg font-bold text-slate-950">{exercise.title}</h2>
                    <p className="text-sm leading-6 text-slate-600">{exercise.description}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => setEditing(exercise)}>
                      <Pencil size={16} />
                      編集
                    </Button>
                    <Button variant={exercise.is_active ? "outline" : "secondary"} size="sm" onClick={() => toggleActive(exercise)}>
                      {exercise.is_active ? <EyeOff size={16} /> : <Eye size={16} />}
                      {exercise.is_active ? "OFF" : "ON"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </main>
  );
}

function SelectFilter({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: readonly string[];
  onChange: (value: string) => void;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-12 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      >
        <option value="">すべて</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

function ExerciseForm({
  exercise,
  onCancel,
  onSave,
}: {
  exercise: Exercise;
  onCancel: () => void;
  onSave: (exercise: Exercise) => void;
}) {
  const [draft, setDraft] = useState(exercise);

  return (
    <Card className="border-blue-200">
      <CardHeader>
        <CardTitle>{exercise.id ? "運動を編集" : "新規追加"}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>タイトル</Label>
            <Input value={draft.title} onChange={(event) => setDraft({ ...draft, title: event.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>カテゴリ</Label>
            <select
              value={draft.category}
              onChange={(event) => setDraft({ ...draft, category: event.target.value as Category })}
              className="h-12 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label>難易度</Label>
            <select
              value={draft.difficulty}
              onChange={(event) => setDraft({ ...draft, difficulty: event.target.value as Difficulty })}
              className="h-12 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold"
            >
              {difficulties.map((difficulty) => (
                <option key={difficulty} value={difficulty}>
                  {difficulty}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label>注意事項</Label>
            <Input
              value={draft.caution ?? ""}
              onChange={(event) => setDraft({ ...draft, caution: event.target.value || null })}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label>説明</Label>
          <textarea
            value={draft.description}
            onChange={(event) => setDraft({ ...draft, description: event.target.value })}
            className="min-h-28 w-full rounded-lg border border-slate-200 bg-white p-3 text-sm leading-6 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Button onClick={() => onSave(draft)} disabled={!draft.title || !draft.description}>
            <Save size={18} />
            保存
          </Button>
          <Button variant="outline" onClick={onCancel}>
            キャンセル
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
