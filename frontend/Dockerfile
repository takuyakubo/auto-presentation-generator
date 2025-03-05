FROM node:18-alpine AS base

# ビルドステージ
FROM base AS builder
WORKDIR /app

# 依存関係ファイルをコピー
COPY package.json package-lock.json* ./
RUN npm ci

# ソースコードをコピー
COPY . .

# ビルド実行
RUN npm run build

# 本番環境ステージ
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

# アプリケーションをコピー
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/.next/server ./.next/server
COPY --from=builder /app/.next/standalone ./

# アプリケーションを起動
CMD ["node", "server.js"]
