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

RUN npm run prisma:generate
RUN npm run build


FROM node:20-alpine AS runner

# Create app directory
RUN mkdir -p /app && chown -R node:node /app
WORKDIR /app
ENV NODE_ENV production

COPY --from=builder /app/package*.json /app/
COPY --from=builder /app/dist /app
COPY --from=builder /app/src/lib/db/schema.prisma /app/lib/db/schema.prisma
RUN sed -i 's/src\/lib\/db\/schema.prisma/lib\/db\/schema.prisma/' /app/package.json
RUN npm ci --fund=false --audit=false --omit=dev

EXPOSE 4000 4001
CMD ["npm", "run", "start:production"]
