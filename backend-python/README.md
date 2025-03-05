# テキストからプレゼンテーション自動生成 - Pythonバックエンド

このディレクトリは、テキストからプレゼンテーションを自動生成するWebアプリケーションのPythonバックエンドを含んでいます。

## 使用技術

- Python 3.11+
- FastAPI
- OpenAI API
- python-pptx

## セットアップ方法

### 必要条件

- Python 3.11以上
- pip
- OpenAI APIキー

### 環境変数の設定

`.env.example`ファイルをコピーして`.env`ファイルを作成し、必要な環境変数を設定します。

```bash
cp .env.example .env
```

`.env`ファイルを編集して、OpenAI APIキーなどの必要な情報を入力してください。

### 依存パッケージのインストール

```bash
pip install -r requirements.txt
```

### アプリケーションの起動

```bash
uvicorn main:app --reload
```

アプリケーションは http://localhost:3001 で動作します。

## APIエンドポイント

| エンドポイント | メソッド | 説明 |
|--------------|---------|------|
| `/api/health` | GET | サーバーの稼働状況を確認 |
| `/api/presentations/generate` | POST | テキストからプレゼンテーションを生成 |
| `/api/presentations/{id}` | GET | 生成されたプレゼンテーションの詳細を取得 |
| `/api/presentations/{id}/download` | GET | PowerPointファイルをダウンロード |

## API仕様書

FastAPIが自動生成するSwagger UIを使用してAPIドキュメントを参照できます。
サーバー起動後に http://localhost:3001/docs にアクセスしてください。

## Dockerでの実行

```bash
# イメージのビルド
docker build -t presentation-generator-backend .

# コンテナの実行
docker run -p 3001:3001 --env-file .env presentation-generator-backend
```

## フロントエンドとの連携

このバックエンドサービスは、Next.jsで実装されたフロントエンドと連携して動作します。
フロントエンドのセットアップについては、プロジェクトのルートディレクトリにあるREADMEを参照してください。
