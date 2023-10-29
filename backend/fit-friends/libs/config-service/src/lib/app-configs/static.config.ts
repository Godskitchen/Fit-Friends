import Joi from 'joi';

import { registerAs } from '@nestjs/config';
import { StaticConfig } from '@libs/shared/app-types';

export default registerAs('static', (): StaticConfig => {
  if (!process.env.UPLOAD_ROOT_DIRECTORY || !process.env.SERVE_ROOT) {
    throw new Error(
      "[Static Config]: Some Environments didn't configure. Please check app.env file.",
    );
  }

  const config: StaticConfig = {
    uploadDirectory: process.env.UPLOAD_ROOT_DIRECTORY,
    serveRoot: process.env.SERVE_ROOT,
  };

  const validationSchema = Joi.object<StaticConfig>({
    uploadDirectory: Joi.string().required(),
    serveRoot: Joi.string().required(),
  });

  const { error } = validationSchema.validate(config, { abortEarly: true });

  if (error) {
    throw new Error(
      `[Static Config]: Environments validation failed. Please check app.env file.
      Error message: ${error.message}`,
    );
  }

  return config;
});
