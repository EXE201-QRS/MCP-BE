import { config } from 'dotenv'
import fs from 'fs'
import path from 'path'
import { z } from 'zod'

config({
  path: '.env'
})

if (!fs.existsSync(path.resolve('.env'))) {
  console.error('Not found .env file')
  process.exit(1)
}

const configSchema = z.object({
  //Application
  APP_NAME: z.string().default('My App'),
  APP_URL: z.string(),
  APP_PORT: z.coerce.number(),
  API_PREFIX: z.string(),
  APP_CORS_ORIGIN: z.string(),
  //Database
  DATABASE_URL: z.string(),
  SESSION_TOKEN_SECRET: z.string(),
  SESSION_TOKEN_EXPIRES_IN: z.string(),
  ADMIN_PASSWORD: z.string(),
  SECRET_API_KEY: z.string(),
  OTP_EXPIRES_IN: z.string(),
  RESEND_API_KEY: z.string(),
  //AWS S3
  S3_REGION: z.string(),
  S3_ACCESS_KEY: z.string(),
  S3_SECRET_KEY: z.string(),
  S3_BUCKET_NAME: z.string(),
  //PayOS
  PAYOS_API_KEY: z.string(),
  PAYOS_CLIENT_ID: z.string(),
  PAYOS_CHECKSUM_KEY: z.string(),
  //Google OAuth
  GOOGLE_CLIENT_ID: z.string(),
  GOOGLE_CLIENT_SECRET: z.string(),
  GOOGLE_REDIRECT_URI: z.string(),
  //FE
  FE_URL: z.string(),
  GOOGLE_CLIENT_REDIRECT_URI: z.string()
})

const configServer = configSchema.safeParse(process.env)

if (!configServer.success) {
  console.error('Invalid environment variables')
  console.error(configServer.error.format())
  process.exit(1)
}

const envConfig = configServer.data

export default envConfig
