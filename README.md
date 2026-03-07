# AI Learning Platform

ゲーミフィケーションを取り入れたAI駆動型学習プラットフォームです。

## 技術スタック

- **バックエンド:** Laravel 12 / PHP 8.2+
- **フロントエンド:** React 18 / TypeScript / Inertia.js v2
- **スタイリング:** Tailwind CSS 3
- **データベース:** MySQL 8.4 (開発時はSQLiteも可)
- **キャッシュ:** Redis
- **インフラ:** Docker (Laravel Sail)

## 主な機能

- **コース学習:** カテゴリ → コース → レッスンの階層的な学習構造
- **クイズ:** レッスン内のクイズによる理解度チェック
- **ゲーミフィケーション:** XP、レベル、バッジ、ストリーク、リーダーボード
- **スキルツリー:** スキルの習得状況を可視化
- **管理画面:** コース・レッスンの作成・編集・並び替え、画像アップロード
- **ユーザー管理:** 認証、プロフィール編集

## セットアップ

```bash
# 依存関係のインストールからビルドまで一括実行
composer setup
```

上記コマンドは以下を順に実行します:

1. `composer install`
2. `.env` ファイルの作成
3. アプリケーションキーの生成
4. データベースのマイグレーション
5. `npm install`
6. `npm run build`

## 開発

```bash
# 開発サーバー起動（Webサーバー、キュー、ログ、Viteを同時起動）
composer dev
```

## テスト

```bash
composer test
```

## Docker での実行

```bash
./vendor/bin/sail up -d
```

| サービス | ポート |
|---------|--------|
| Web     | 80     |
| Vite    | 5173   |
| MySQL   | 3306   |
| Redis   | 6379   |

## ディレクトリ構成（主要部分）

```
app/
├── Http/Controllers/
│   ├── Admin/          # 管理画面（コース・レッスン管理）
│   ├── DashboardController.php
│   ├── CategoryController.php
│   ├── CourseController.php
│   ├── LessonController.php
│   ├── SkillTreeController.php
│   └── LeaderboardController.php
├── Models/             # Eloquentモデル（13種）
└── Http/Middleware/
    └── AdminMiddleware.php

resources/js/
├── Pages/
│   ├── Admin/          # 管理画面
│   ├── Categories/     # カテゴリ一覧・詳細
│   ├── Courses/        # コース詳細
│   ├── Lessons/        # レッスン閲覧
│   ├── SkillTree/      # スキルツリー
│   ├── Leaderboard/    # リーダーボード
│   ├── Dashboard.tsx   # ユーザーダッシュボード
│   └── Welcome.tsx     # ランディングページ
├── Components/         # 共通UIコンポーネント
└── Layouts/            # レイアウト
```

## ライセンス

MIT
