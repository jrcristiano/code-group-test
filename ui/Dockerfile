# ---- Stage 1: Dependencies ----
FROM node:22-alpine AS deps
ENV npm_config_update_notifier=false
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci && npm install --no-save lightningcss-linux-x64-musl@1.32.0

# ---- Stage 2: Development server with hot reload ----
FROM deps AS development
WORKDIR /app
COPY . .
EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

# ---- Stage 3: Static production build ----
FROM deps AS builder
WORKDIR /app
ARG VITE_API_URL=/api
ENV VITE_API_URL=$VITE_API_URL
COPY . .
RUN npm run build

# ---- Stage 4: Nginx runtime ----
FROM nginx:1.27-alpine AS production
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
