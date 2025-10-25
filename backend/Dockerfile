FROM node:20-alpine

WORKDIR /usr/src/app

COPY package.json package-lock.json* ./
RUN corepack enable && corepack prepare pnpm@latest --activate && pnpm install --prod --silent || true

COPY . .

EXPOSE 5000

ENV NODE_ENV=production
CMD ["node", "server.js"]
