# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm install
RUN npx prisma generate

COPY . .

RUN npm run build || true # In case there's a build script, though index.ts is usually run via ts-node or compiled

# Production stage
FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist || true
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/index.ts ./
COPY --from=builder /app/tsconfig.json ./

EXPOSE 5000

CMD ["npx", "ts-node", "index.ts"]
