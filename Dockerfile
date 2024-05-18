# Set-up build image
FROM node:22-alpine
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

# Compile separately
RUN pnpm next experimental-compile

# Generate and run
CMD pnpm next experimental-generate ; pnpm start
