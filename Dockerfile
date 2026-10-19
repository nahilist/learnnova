# syntax=docker/dockerfile:1

# -------------------------------------------------------------------
# Stage 1: Base Alpine Environment
# -------------------------------------------------------------------
FROM node:20-alpine AS base
WORKDIR /app
RUN apk add --no-cache libc6-compat
ENV NEXT_TELEMETRY_DISABLED=1

# -------------------------------------------------------------------
# Stage 2: Dependencies Installation
# -------------------------------------------------------------------
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json .npmrc* ./
RUN npm ci --legacy-peer-deps

# -------------------------------------------------------------------
# Stage 3: Source Builder
# -------------------------------------------------------------------
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NODE_ENV=production
RUN npm run build

# -------------------------------------------------------------------
# Stage 4: Production Lean Runtime
# -------------------------------------------------------------------
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
ENV NEXT_TELEMETRY_DISABLED=1

# Security: Create non-root system user & group
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy public assets & prerendered standalone build
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

# Built-in Container Health Check
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://127.0.0.1:3000/ || exit 1

CMD ["node", "server.js"]
