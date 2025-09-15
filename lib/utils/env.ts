const env = {
  appUrl: process.env.NEXT_PUBLIC_APP_URL!,
  databaseUrl: process.env.DATABASE_URL!,
  bucketUrl: process.env.NEXT_PUBLIC_BUCKET_URL!,
} as const;

export default env;
