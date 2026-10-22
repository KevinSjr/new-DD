FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:22-alpine
LABEL org.opencontainers.image.source=https://github.com/KevinSjr/new-DD
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
RUN npm ci --omit=dev
COPY --from=build /app/dist ./dist
COPY server ./server
COPY scripts ./scripts
COPY db ./db
USER node
EXPOSE 3001
CMD ["node", "server/index.mjs"]