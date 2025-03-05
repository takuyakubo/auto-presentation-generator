# API ドキュメント

## 概要

この API は、テキストからプレゼンテーション資料を自動生成するためのエンドポイントを提供します。

## ベース URL

```
http://localhost:3001/api
```

## エンドポイント

### テキストからプレゼンテーションを生成

```
POST /presentations/generate
```

#### リクエストボディ

```json
{
  "text": "プレゼンテーションのコンテンツとなるテキスト",
  "options": {
    "theme": "modern",
    "slideCount": 10,
    "includeImages": true
  }
}
```

#### レスポンス

```json
{
  "id": "pres_123456",
  "slides": [
    {
      "title": "スライドタイトル",
      "content": ["コンテンツ項目1", "コンテンツ項目2"],
      "imageUrl": "https://example.com/image.jpg"
    }
  ],
  "downloadUrl": "/api/presentations/pres_123456/download"
}
```

### プレゼンテーションのダウンロード

```
GET /presentations/:id/download
```

#### パスパラメータ

- `id`: 生成されたプレゼンテーションの ID

#### レスポンス

PowerPoint ファイル (.pptx) のダウンロード
