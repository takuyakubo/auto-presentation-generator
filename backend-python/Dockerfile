FROM python:3.11-slim

# 必要なシステムパッケージのインストール
RUN apt-get update && apt-get install -y \
    build-essential \
    curl \
    && rm -rf /var/lib/apt/lists/*

# 作業ディレクトリの設定
WORKDIR /app

# 依存関係のインストール
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# アプリケーションコードのコピー
COPY . .

# ポートを公開
EXPOSE 3001

# アプリケーションの実行
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "3001"]
