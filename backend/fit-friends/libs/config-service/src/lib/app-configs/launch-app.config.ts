import Joi from 'joi';

import { registerAs } from '@nestjs/config';
import { AppConfig } from '@libs/shared/app-types';

export default registerAs('application', (): AppConfig => {
  if (!process.env.NODE_ENV || !process.env.APP_PORT || !process.env.APP_HOST) {
    throw new Error(
      "[Launch Application Config]: Some Environments didn't configure. Please check .env file.",
    );
  }

  const config: AppConfig = {
    environment: process.env.NODE_ENV,
    host: process.env.APP_HOST,
    port: process.env.APP_PORT,
  };

  const validationSchema = Joi.object<AppConfig>({
    host: Joi.string().hostname().required(),
    environment: Joi.string()
      .valid('development', 'production', 'stage')
      .required(),
    port: Joi.number().port().required(),
  });

  const { error } = validationSchema.validate(config, { abortEarly: true });

  if (error) {
    throw new Error(
      `[Launch Application Config]: Environments validation failed. Please check .env file.
      Error message: ${error.message}`,
    );
  }

  return config;
});
