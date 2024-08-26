import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
  server: {
    NODE_ENV: z.enum(["development", "test", "production"]),

    FTP_SERVER_USERNAME: z.string(),
    FTP_SERVER_PASSWORD: z.string(),
    FTP_SERVER_HOST: z.string(),

    DATABASE_URL: z.string().url(),

    FACTION_URL: z.string().url(),
    SINGLE_FACTION_URL: z.string().url(),
    CHAMPIONS_URL: z.string().url(),
    SINGLE_CHAMPION_URL: z.string().url(),
    SINGLE_STORY_URL: z.string().url(),
  },

  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {
    NEXT_PUBLIC_FILE_PATH: z.string().url(),
    NEXT_PUBLIC_VERCEL_URL: z.string(),
    NEXT_PUBLIC_POSTHOG_KEY: z.string(),
    NEXT_PUBLIC_POSTHOG_HOST: z.string(),
  },

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    DATABASE_URL: process.env.DATABASE_URL,
    FTP_SERVER_USERNAME: process.env.FTP_SERVER_USERNAME,
    FTP_SERVER_PASSWORD: process.env.FTP_SERVER_PASSWORD,
    FTP_SERVER_HOST: process.env.FTP_SERVER_HOST,

    FACTION_URL: process.env.FACTION_URL,
    SINGLE_FACTION_URL: process.env.SINGLE_FACTION_URL,
    CHAMPIONS_URL: process.env.CHAMPIONS_URL,
    SINGLE_CHAMPION_URL: process.env.SINGLE_CHAMPION_URL,
    SINGLE_STORY_URL: process.env.SINGLE_STORY_URL,

    NEXT_PUBLIC_FILE_PATH: process.env.NEXT_PUBLIC_FILE_PATH,
    NEXT_PUBLIC_VERCEL_URL: process.env.NEXT_PUBLIC_VERCEL_URL,
    NEXT_PUBLIC_POSTHOG_KEY: process.env.NEXT_PUBLIC_POSTHOG_KEY,
    NEXT_PUBLIC_POSTHOG_HOST: process.env.NEXT_PUBLIC_POSTHOG_HOST,
  },
  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
   * This is especially useful for Docker builds.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
});
