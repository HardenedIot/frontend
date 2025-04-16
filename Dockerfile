FROM node:latest AS builder
WORKDIR /app

COPY ./src/package.json ./src/package-lock.json ./
RUN npm install --legacy-peer-deps

COPY ./src .
RUN npm run build

FROM node:slim AS runner
WORKDIR /app

COPY ./src/package.json ./src/package-lock.json ./
RUN npm install --only=production --legacy-peer-deps

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

RUN addgroup --system apprunner && adduser --system --ingroup apprunner apprunner
RUN chown -R apprunner:apprunner /app/.next /app/public /app/package.json /app/package-lock.json

USER apprunner

EXPOSE 3000
CMD ["npm", "start"]