import { MailerConfig } from '@libs/shared/app-types';
import { registerAs } from '@nestjs/config';
import Joi from 'joi';
import { CRON_PATTERN } from './constants';

export default registerAs('mailer', (): MailerConfig => {
  if (
    !process.env.MAIL_SMTP_HOST ||
    !process.env.MAIL_SMTP_PORT ||
    !process.env.MAIL_USERNAME ||
    !process.env.MAIL_PASSWORD ||
    !process.env.MAIL_FROM ||
    !process.env.BROADCAST_INTERVAL
  ) {
    throw new Error(
      "[Mailer Config]: Some Environments didn't configure. Please check .env file.",
    );
  }

  const config: MailerConfig = {
    host: process.env.MAIL_SMTP_HOST,
    port: process.env.MAIL_SMTP_PORT,
    user: process.env.MAIL_USERNAME,
    password: process.env.MAIL_PASSWORD,
    from: process.env.MAIL_FROM,
    broadcastInterval: process.env.BROADCAST_INTERVAL,
  };

  const validationSchema = Joi.object<MailerConfig>({
    host: Joi.string().valid().hostname().required(),
    port: Joi.number().port().required(),
    user: Joi.string().required(),
    password: Joi.string().required(),
    from: Joi.string().required(),
    broadcastInterval: Joi.string().regex(CRON_PATTERN),
  });

  const { error } = validationSchema.validate(config, { abortEarly: true });

  if (error) {
    throw new Error(
      `[Mailer Config]: Environments validation failed. Please check .env file.
       Error message: ${error.message}`,
    );
  }

  return config;
});
