# Set-up build image
FROM node:20-alpine AS builder
ENV NODE_ENV=production

WORKDIR /app

# Copy package.json, lockfile, .npmrc
COPY ["pnpm-lock.yaml", "package.json", ".npmrc", "./"]

# Install build tools
RUN apk add --no-cache alpine-sdk python3 && \
    npm install -g pnpm && \
    NODE_ENV=development pnpm install

# Copy all files to working directory
COPY . .

# Build Next app and remove dev packages
RUN pnpm build && \
    pnpm prune --prod

# Set-up running image
FROM node:20-alpine
ENV NODE_ENV=production
WORKDIR /app

# Copy all files (including source :/)
COPY --from=builder /app .

# Run
CMD ["npm", "start"]
