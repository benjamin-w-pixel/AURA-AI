# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm install
RUN npx prisma generate

COPY . .

RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Add production dependencies only to keep image small
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/index.ts ./
COPY --from=builder /app/tsconfig.json ./

EXPOSE 5000

# Railway will use the 'start' script from package.json which points to dist/index.js
CMD ["npm", "start"]
