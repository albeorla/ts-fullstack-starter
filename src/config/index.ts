import dotenvFlow from "dotenv-flow";

dotenvFlow.config({ silent: true });

import { env } from "~/env";

export const app = {
  nodeEnv: env.NODE_ENV,
  port: Number(process.env.PORT ?? 3000),
};

export const auth = {
  secret: env.AUTH_SECRET,
  discord: {
    id: env.AUTH_DISCORD_ID,
    secret: env.AUTH_DISCORD_SECRET,
  },
  enableTestAuth: process.env.ENABLE_TEST_AUTH === "true",
};

export const database = {
  url: env.DATABASE_URL,
};

export const ci = {
  isCI: process.env.CI === "true",
};

export const test = {
  verboseLogs: process.env.VERBOSE_TEST_LOGS === "true",
  logLevel: (process.env.LOG_LEVEL ?? "INFO").toUpperCase(),
};

export const config = { app, auth, database, ci, test };
export default config;
export type AppConfig = typeof config;
