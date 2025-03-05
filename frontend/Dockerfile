FROM node:18-alpine

WORKDIR /app

# 依存関係をインストール
COPY package.json package-lock.json* ./
RUN npm ci

# アプリケーションファイルをコピー
COPY . .

# Vite関連のファイルを削除
RUN rm -f vite.config.ts tsconfig.node.json

# アプリケーションをビルド
RUN npm run build

# 本番環境用サーバーを起動
CMD ["npm", "start"]
