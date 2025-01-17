/*
|--------------------------------------------------------------------------
| Environment variables service
|--------------------------------------------------------------------------
|
| The `Env.create` method creates an instance of the Env service. The
| service validates the environment variables and also cast values
| to JavaScript data types.
|
*/

import { Env } from '@adonisjs/core/env'

export default await Env.create(new URL('../', import.meta.url), {
  NODE_ENV: Env.schema.enum(['development', 'production', 'test'] as const),
  PORT: Env.schema.number(),
  APP_KEY: Env.schema.string(),
  HOST: Env.schema.string({ format: 'host' }),
  LOG_LEVEL: Env.schema.string(),

  CLIENT_URL: Env.schema.string(),
  ADMIN_URL: Env.schema.string(),

  /*
  |----------------------------------------------------------
  | Variables for configuring database connection
  |----------------------------------------------------------
  */
  DB_HOST: Env.schema.string({ format: 'host' }),
  DB_PORT: Env.schema.number(),
  DB_USER: Env.schema.string(),
  DB_PASSWORD: Env.schema.string.optional(),
  DB_DATABASE: Env.schema.string(),

  /*
  |----------------------------------------------------------
  | Variables for configuring the mail package
  |----------------------------------------------------------
  */
  SMTP_HOST: Env.schema.string(),
  SMTP_PORT: Env.schema.string(),
  SMTP_USERNAME: Env.schema.string(),
  SMTP_PASSWORD: Env.schema.string(),
  SMTP_FROM_EMAIL: Env.schema.string(),

  /*
  |----------------------------------------------------------
  | Variables for payment methods
  |----------------------------------------------------------
  */
  STRIPE_KEY: Env.schema.string(),
  STRIPE_SECRET: Env.schema.string(),
  PAYPAL_ID: Env.schema.string(),
  PAYPAL_SECRET: Env.schema.string(),
  PAYPAL_URL: Env.schema.string(),

  /*
  |----------------------------------------------------------
  | Variables for emails
  |----------------------------------------------------------
  */
  COMPANY_EMAIL: Env.schema.string(),
  COMPANY_NAME: Env.schema.string(),

  /*
  |----------------------------------------------------------
  | Variables for configuring the drive package
  |----------------------------------------------------------
  */
  DRIVE_DISK: Env.schema.enum(['s3'] as const),
  AWS_ACCESS_KEY_ID: Env.schema.string(),
  AWS_SECRET_ACCESS_KEY: Env.schema.string(),
  AWS_REGION: Env.schema.string(),
  S3_BUCKET: Env.schema.string(),

  FLASH_API_ACCESS_KEY: Env.schema.string(),

  QUEUE_REDIS_HOST: Env.schema.string(),
  QUEUE_REDIS_PORT: Env.schema.number(),
  QUEUE_REDIS_PASSWORD: Env.schema.string(),

  APP_MODE: Env.schema.string(),

  SEMRUSH_API_KEY: Env.schema.string(),
  MOZ_API_KEY: Env.schema.string(),
  AHREFS_API_TOKEN: Env.schema.string(),
})
