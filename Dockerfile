FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache \
    chromium \
    ca-certificates

COPY package*.json ./
COPY backend/package*.json ./backend/

RUN npm ci && cd backend && npm ci

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev:backend"]
