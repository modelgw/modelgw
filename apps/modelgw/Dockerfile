FROM node:20-alpine AS builder

# Create app directory
RUN mkdir -p /app && chown -R node:node /app
WORKDIR /app

# Install app dependencies
# RUN apk add --no-cache python3 make g++
COPY package*.json /app/
RUN npm ci --fund=false --audit=false
RUN npm cache clean --force

# Bundle app source
COPY . /app
ENV NODE_ENV=production
RUN npx nx prisma-generate modelgw --verbose && \
    npx nx build modelgw --configuration production --skip-nx-cache --verbose

FROM node:20-alpine AS runner

# Create app directory
RUN mkdir -p /app && chown -R node:node /app
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/dist/apps/modelgw/package*.json /app/
RUN npm ci --fund=false --audit=false --omit=dev
COPY --from=builder /app/dist/apps/modelgw /app
COPY --from=builder /app/apps/modelgw/src/lib/db/schema.prisma /app/prisma/schema.prisma
COPY --from=builder /app/apps/modelgw/src/lib/db/migrations /app/prisma/migrations
RUN ./node_modules/.bin/prisma generate

EXPOSE 4000 4001
ENV PORT=4000
CMD ["/bin/sh", "-c", "./node_modules/.bin/prisma migrate deploy && node main.js"]
