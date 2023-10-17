import { registerAs } from '@nestjs/config';
import Joi from 'joi';

export interface JWTConfig {
  accessTokenSecret: string;
  accessTokenExpiresIn: string;
  refreshTokenSecret: string;
  refreshTokenExpiresIn: string;
}

export default registerAs('jwt', (): JWTConfig => {
  if (
    !process.env.JW_AT_SECRET ||
    !process.env.JW_AT_EXPIRES_IN ||
    !process.env.JW_RT_SECRET ||
    !process.env.JW_RT_EXPIRES_IN
  ) {
    throw new Error(
      "[JWT Config]: Some Environments didn't configure. Please check .env file.",
    );
  }

  const config: JWTConfig = {
    accessTokenSecret: process.env.JW_AT_SECRET,
    accessTokenExpiresIn: process.env.JW_AT_EXPIRES_IN,
    refreshTokenSecret: process.env.JW_RT_SECRET,
    refreshTokenExpiresIn: process.env.JW_RT_EXPIRES_IN,
  };

  const validationSchema = Joi.object<JWTConfig>({
    accessTokenSecret: Joi.string().required(),
    accessTokenExpiresIn: Joi.string().required(),
    refreshTokenSecret: Joi.string().required(),
    refreshTokenExpiresIn: Joi.string().required(),
  });

  const { error } = validationSchema.validate(config, { abortEarly: true });

  if (error) {
    throw new Error(
      `[JWT Config]: Environments validation failed. Please check .env file.
      Error message: ${error.message}`,
    );
  }

  return config;
});
