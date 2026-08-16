# ---- Base ----
# نکته: نسخه‌های نصب‌شده jsdom@30 ،isomorphic-dompurify@3.22 و sanitize-html@2.17
# رسماً به Node >=22 نیاز دارند (در لاگ لیارا خطاهای EBADENGINE را ببینید).
FROM node:22-slim AS base
RUN apt-get update -y && apt-get install -y openssl
WORKDIR /app

# ---- Dependencies ----
FROM base AS deps
# دلیل اصلی خطای قبلی روی لیارا: فایل .npmrc به این استیج کپی نمی‌شد.
# lock file پروژه با legacy-peer-deps=true (داخل .npmrc) تولید شده،
# پس npm ci هم باید با همان حالت اجرا شود؛ وگرنه خطای
# "package.json and package-lock.json are in sync" رخ می‌دهد.
COPY package.json package-lock.json .npmrc ./
COPY prisma ./prisma
RUN npm ci --legacy-peer-deps --no-audit --no-fund

# ---- Build ----
FROM base AS builder
ENV NEXT_TELEMETRY_DISABLED=1
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
RUN npm run build

# ---- Runtime ----
FROM base AS runner
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
# برای standalone حتماً روی 0.0.0.0 گوش بده تا از بیرون کانتینر در دسترس باشد
ENV HOSTNAME="0.0.0.0"
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]
