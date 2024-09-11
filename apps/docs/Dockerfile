FROM node:20-alpine AS builder

# Create app directory
RUN mkdir -p /app && chown -R node:node /app
WORKDIR /app

# Install app dependencies
# RUN apk add --no-cache python3 make g++
COPY package*.json /app/
RUN npm ci --fund=false --audit=false

# Bundle app source
COPY . /app
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
RUN npx nx build docs --skip-nx-cache --verbose

# Removes the devDependencies
RUN npm prune --omit=dev

# Production image, copy all the files and run next
FROM node:20-alpine AS runner
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

RUN mkdir -p /app /app/.next && chown -R node:node /app
WORKDIR /app

COPY --from=builder --chown=node:node /app/apps/docs/public ./public
COPY --from=builder --chown=node:node /app/apps/docs/.next/standalone/apps/docs ./
COPY --from=builder --chown=node:node /app/apps/docs/.next/standalone/package.json ./
COPY --from=builder --chown=node:node /app/apps/docs/.next/static ./.next/static
COPY --from=builder --chown=node:node /app/apps/docs/.next/standalone/node_modules ./node_modules

USER node
EXPOSE 3000
CMD ["node", "server.js"]
