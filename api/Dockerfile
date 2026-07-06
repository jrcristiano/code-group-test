# ---- Stage 1: Base ----
FROM node:22-alpine AS base
ENV npm_config_update_notifier=false
RUN apk add --no-cache openssl
WORKDIR /app

# ---- Stage 2: Deps (all dependencies for build) ----
FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci

# ---- Stage 3: Builder ----
FROM deps AS builder

# Dummy DATABASE_URL for prisma generate — real URL set at runtime
ARG DATABASE_URL=postgresql://dummy:dummy@localhost:5432/dummy
ENV DATABASE_URL=$DATABASE_URL

COPY tsconfig.json nest-cli.json prisma.config.ts ./
COPY prisma ./prisma
RUN npx prisma generate
COPY src ./src
RUN npm run build

# ---- Stage 4: Development runner ----
FROM deps AS development
ENV NODE_ENV=development
ARG DATABASE_URL=postgresql://dummy:dummy@localhost:5432/dummy
ENV DATABASE_URL=$DATABASE_URL
COPY tsconfig.json nest-cli.json prisma.config.ts ./
COPY prisma ./prisma
RUN npx prisma generate
COPY src ./src
EXPOSE 3001
CMD ["npm", "run", "start:dev"]

# ---- Stage 5: Runner (production) ----
FROM base AS runner
ENV NODE_ENV=production

RUN addgroup -S appgroup && adduser -S appuser -G appgroup

COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma.config.ts ./
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

USER appuser

EXPOSE 3000
CMD ["node", "dist/src/main"]
