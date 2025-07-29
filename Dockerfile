FROM mcr.microsoft.com/playwright:v1.42.0-jammy
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile
COPY . .
ENV PORT=3001
ENV NODE_ENV=test
CMD ["yarn","test:e2e:ci"]
