# テキストからプレゼンテーション自動生成ツール

このリポジトリは、テキストコンテンツからプレゼンテーション資料を自動生成するWebアプリケーションのソースコードを管理しています。

![プレゼン自動生成デモ](https://via.placeholder.com/800x450?text=プレゼン自動生成デモ)

## 概要

テキストを入力するだけで、美しく構造化されたプレゼンテーションスライドを自動生成します。AIがコンテンツを分析して最適な構造とデザインを提案し、アイデアを素早くビジュアル化することで、プレゼンテーション作成の時間を大幅に短縮します。

## 主な機能

- 📝 テキスト入力からスライド構造の自動生成
- 🎨 複数のデザインテーマから選択可能
- 🖼️ 関連画像の自動挿入（オプション）
- 📊 スライド数の調整
- 💾 PowerPoint形式でのエクスポート
- 👀 生成プレゼンテーションのプレビュー
- 📱 レスポンシブデザイン対応

## 使い方

1. テキストボックスにプレゼンテーションにしたいテキストを入力
2. デザインテーマを選択（モダン、ビジネス、クリエイティブ、ミニマル）
3. 必要に応じてスライド数や画像の有無を設定
4. 「プレゼンテーションを生成」ボタンをクリック
5. 生成されたプレゼンテーションをプレビュー
6. PowerPoint形式でダウンロード

## 技術スタック

### フロントエンド
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Axios

### バックエンド（Python版）
- Python 3.11+
- FastAPI
- OpenAI API
- python-pptx

## プロジェクト構成

```
auto-presentation-generator/
├── frontend/                # フロントエンドのソースコード（Next.js）
│   ├── src/                 # ソースコード
│   │   ├── app/             # Appルーター構造
│   │   ├── components/      # 共通コンポーネント
│   │   └── ...
│   ├── public/              # 静的ファイル
│   └── ...
├── backend-python/          # Pythonバックエンドのソースコード
│   ├── app/                 # アプリケーションコード
│   │   ├── schemas/         # データモデル定義
│   │   ├── services/        # ビジネスロジック 
│   │   └── ...
│   ├── tests/               # テストコード
│   └── main.py              # アプリケーションのエントリーポイント
├── backend/                 # Node.jsバックエンドのソースコード（代替）
└── docs/                    # プロジェクトドキュメント
```

## セットアップ方法

### 前提条件

- Node.js (v16以上)
- Python 3.11以上
- npm または yarn
- pip
- OpenAI APIキー

### インストール手順

#### Pythonバックエンド

```bash
# バックエンドディレクトリに移動
cd backend-python

# 環境変数の設定
cp .env.example .env
# .envファイルを編集してOpenAI APIキーを設定

# 依存関係のインストール
pip install -r requirements.txt

# 開発サーバーの起動
uvicorn main:app --reload
```

#### フロントエンド

```bash
# フロントエンドディレクトリに移動
cd frontend

# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev
```

アプリケーションは以下のURLでアクセスできます：
- フロントエンド: http://localhost:3000
- バックエンドAPI: http://localhost:3001

### Docker Composeを使用する場合

プロジェクトのルートディレクトリで以下のコマンドを実行します：

```bash
# バックエンドの.envファイルを作成
cp backend-python/.env.example backend-python/.env
# .envファイルを編集してOpenAI APIキーを設定

# Dockerコンテナのビルドと起動
docker-compose up --build
```

## テスト実行方法

### Pythonバックエンドのテスト

```bash
cd backend-python
pytest
```

## 開発中の機能

- リアルタイムコラボレーション機能
- テンプレートライブラリの拡充
- PDF形式での出力対応
- AIによる画像生成機能の強化
- 多言語対応

## ブランチ情報

- `main`: 安定版（Node.jsバックエンド）
- `python-backend`: Pythonバックエンド実装版

## ライセンス

このプロジェクトはプライベートリポジトリです。権利は所有者に帰属します。
