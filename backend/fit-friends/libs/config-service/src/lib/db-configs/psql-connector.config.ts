import Joi from 'joi';

import { registerAs } from '@nestjs/config';
import { DbConfig } from '@libs/shared/app-types';

export default registerAs('postgres-db', (): DbConfig => {
  if (
    !process.env.POSTGRES_DB_HOST ||
    !process.env.POSTGRES_DB_PORT ||
    !process.env.POSTGRES_DB_NAME ||
    !process.env.POSTGRES_ROOT_USERNAME ||
    !process.env.POSTGRES_ROOT_PASSWORD
  ) {
    throw new Error(
      "[PostgresDB Config]: Some Environments didn't configure. Please check .env file.",
    );
  }

  const config: DbConfig = {
    host: process.env.POSTGRES_DB_HOST,
    port: process.env.POSTGRES_DB_PORT,
    name: process.env.POSTGRES_DB_NAME,
    user: process.env.POSTGRES_ROOT_USERNAME,
    password: process.env.POSTGRES_ROOT_PASSWORD,
  };

  const validationSchema = Joi.object<DbConfig>({
    host: Joi.string().hostname().required(),
    port: Joi.number().port().required(),
    name: Joi.string().required(),
    user: Joi.string().required(),
    password: Joi.string().required(),
  });

  const { error } = validationSchema.validate(config, { abortEarly: true });

  if (error) {
    throw new Error(
      `[PostgresDB Config]: Environments validation failed. Please check .env file.
      Error message: ${error.message}`,
    );
  }

  return config;
});
