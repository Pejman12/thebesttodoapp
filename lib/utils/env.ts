const env = {
  appUrl: process.env.APP_URL,
  databaseUrl: process.env.DATABASE_URL_ADMIN!,
} as const;

export default env;
