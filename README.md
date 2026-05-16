# 3分体力セルフチェック

紙の評価表のQRコードからアクセスし、ブラウザ上で体力チェック結果とおすすめ運動を表示するMVPです。

## 実装内容

- Next.js App Router + TypeScript
- Tailwind CSS
- shadcn/ui 方式のローカルUIコンポーネント
- Recharts のレーダーチャート
- Supabase `exercises` テーブル連携
- Supabase未設定でもseedデータで診断可能
- `/admin` 簡易パスワード認証つき運動管理
- `/business` 企業向けCTAの仮ページ
- `/contact` フォーム送信API

## ローカル起動

```bash
cp .env.example .env.local
```

`.env.local` の `ADMIN_PASSWORD` を設定します。Supabaseなしで試す場合、Supabase項目は空のままで動きます。

```bash
npm install
npm run dev
```

ブラウザで開きます。

- 診断: http://localhost:3000
- 管理画面: http://localhost:3000/admin

## Supabaseテーブル作成

Supabase SQL Editorで以下を順に実行します。

1. `supabase/schema.sql`
2. `supabase/seed.sql`

`schema.sql` は `exercises` テーブル、index、RLS policyを作成します。

## Vercel環境変数

```bash
ADMIN_PASSWORD=管理画面用パスワード
NEXT_PUBLIC_SUPABASE_URL=Supabase Project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=Supabase anon public key
SUPABASE_SERVICE_ROLE_KEY=Supabase service_role key
RESEND_API_KEY=ResendのAPIキー
CONTACT_TO_EMAIL=info@smartsupport.co.jp
CONTACT_FROM_EMAIL=送信元メールアドレス
```

`SUPABASE_SERVICE_ROLE_KEY` は管理APIの追加・編集・公開ON/OFFで使います。クライアントへ公開されないサーバー側環境変数として設定してください。

Contactフォームは Resend API を使って `CONTACT_TO_EMAIL` 宛に送信します。`CONTACT_FROM_EMAIL` はResendで認証済みのドメインメールを設定してください。

## 補足

初期版では診断結果、追加質問、個人情報は保存しません。運動データのみSupabaseで管理する想定です。
