FROM mcr.microsoft.com/playwright:v1.54.1-jammy AS base

WORKDIR /app

# Install system dependencies early for better caching
RUN apt-get update -qq && \
    apt-get install -y -qq --no-install-recommends \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/* \
    && apt-get clean

# Copy only dependency files for better layer caching
COPY package.json yarn.lock ./

# Install dependencies with cache mount for yarn
RUN --mount=type=cache,target=/root/.cache/yarn \
    yarn install --frozen-lockfile --prefer-offline

# Copy prisma schema and generate client
COPY prisma ./prisma
RUN yarn prisma generate

# Copy application code as late as possible
COPY . .

# Entrypoint script is already copied with COPY . .
RUN chmod +x /app/scripts/entrypoint.sh

# Set default environment
ENV NODE_ENV=test
ENV PORT=3001

# Expose ports
EXPOSE 3000 3001

# Use entrypoint for flexible startup
ENTRYPOINT ["/app/scripts/entrypoint.sh"]
