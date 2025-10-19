# SBOEdu Next.js 애플리케이션 Dockerfile

# 최적화된 프로덕션 이미지를 위한 멀티스테이지 빌드
# 베이스 스테이지 - Node.js 20이 포함된 Alpine Linux
FROM node:24-alpine AS base

# libc6-compat가 필요한 이유는 다음 링크를 참조하세요:
# https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine
RUN apk add --no-cache libc6-compat

# 필요한 경우에만 소스 코드 재빌드
FROM base AS builder

WORKDIR /app

ARG BETTER_AUTH_SECRET
ENV BETTER_AUTH_SECRET=$BETTER_AUTH_SECRET

ARG RESEND_API_KEY
ENV RESEND_API_KEY=$RESEND_API_KEY

ARG NEXT_PUBLIC_BASE_URL
ENV NEXT_PUBLIC_BASE_URL=$NEXT_PUBLIC_BASE_URL

# pnpm 직접 설치 (corepack 대신 안정성을 위해)
RUN npm install -g pnpm@latest

# 소스 코드 복사
COPY . .

# 소스코드가 잘 옮겨 졌는지 로그 출력
# 선호하는 패키지 매니저에 따라 의존성 설치
RUN pnpm i --frozen-lockfile

# Prisma Client 생성
RUN npx prisma generate

# Next.js는 일반적인 사용량에 대한 완전 익명 원격 측정 데이터를 수집합니다.
# 자세한 내용: https://nextjs.org/telemetry
ENV NEXT_TELEMETRY_DISABLED=1

# Node.js 메모리 제한 늘리기 (빌드 시 메모리 부족 방지)
ENV NODE_OPTIONS="--max-old-space-size=4096"

# 애플리케이션 빌드
RUN pnpm build

# 프로덕션 이미지, 모든 파일을 복사하고 Next.js 실행
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# nextjs 사용자 생성
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# 빌드된 애플리케이션 복사
COPY --from=builder --chown=nextjs:nodejs /app/generated ./generated
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# 애플리케이션 시작
CMD ["node", "server.js"]