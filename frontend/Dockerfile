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

# 適切なユーザー権限を設定
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

# ビルド済みファイルをコピー
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# アプリケーションを起動
CMD ["node", "server.js"]
