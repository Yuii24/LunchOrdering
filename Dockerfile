# ---- Development Stage ----
FROM node:20-alpine AS development

WORKDIR /app

# 複製 package.json + lock，先安裝依賴（加快 rebuild）
COPY package*.json ./
RUN npm install

# 複製全部原始碼
COPY . .

# ---- Production Stage ----
FROM node:20-alpine AS production

WORKDIR /app

# 只複製必要的檔案到最終映像（不含 source code、git 等）
COPY --from=development /app/package*.json ./
COPY --from=development /app/node_modules ./node_modules
COPY --from=development /app/app.js ./app.js
COPY --from=development /app/config ./config
COPY --from=development /app/controllers ./controllers
COPY --from=development /app/helpers ./helpers
COPY --from=development /app/middlewares ./middlewares
COPY --from=development /app/models ./models
COPY --from=development /app/routes ./routes
COPY --from=development /app/views ./views
COPY --from=development /app/migrations ./migrations
COPY --from=development /app/seeders ./seeders

# 複製 entrypoint 並給執行權限
# COPY --from=development /app/entrypoint.sh ./entrypoint.sh
COPY entrypoint.sh ./entrypoint.sh
RUN chmod +x ./entrypoint.sh

EXPOSE 3000

# 用 entrypoint 啟動
ENTRYPOINT ["./entrypoint.sh"]