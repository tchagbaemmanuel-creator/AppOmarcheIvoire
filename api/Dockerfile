FROM oven/bun:1

WORKDIR /api

COPY package.json bun.lock* ./
RUN bun install --frozen-lockfile

COPY . .
RUN bunx prisma generate

EXPOSE 3000

# Migrations puis démarrage (production)
CMD ["sh", "-c", "bunx prisma migrate deploy && bun run start"]
