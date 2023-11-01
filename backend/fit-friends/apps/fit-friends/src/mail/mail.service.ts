import { SubscriberRepository } from '@libs/database-service';
import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { NEW_TRAINING_SUBJECT } from './constants';
import { createTrainerBlock } from '@libs/shared/helpers';

type LetterInfo = {
  email: string;
  trainerBlocks: string;
};

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly subscriberRepository: SubscriberRepository,
  ) {}

  public async addSubscription(email: string, trainerId: number) {
    await this.subscriberRepository.createOrSubscribe(email, trainerId);
  }

  public async removeSubscription(email: string, trainerId: number) {
    await this.subscriberRepository.removeOrUnsubscribe(email, trainerId);
  }

  @Cron(process.env.BROADCAST_INTERVAL as string)
  async sendNewTrainings() {
    const subscribers = await this.subscriberRepository.findAll();
    if (subscribers.length === 0) {
      return;
    }

    const infoForSubs = subscribers
      .map((subscriber) => {
        return {
          ...subscriber,
          subscribedTo: subscriber.subscribedTo.filter(
            (trainer) => trainer.trainings.length !== 0,
          ),
        };
      })
      .filter((subscriber) => subscriber.subscribedTo.length !== 0)
      .map(({ email, subscribedTo }) => {
        return {
          email,
          trainerBlocks: subscribedTo
            .map((trainer) => createTrainerBlock(trainer, trainer.trainings))
            .join(''),
        };
      });

    await Promise.all(
      infoForSubs.map(async (info) => {
        await this.sendNewTrainingsMailing(info);
      }),
    );
  }

  public async sendNewTrainingsMailing({ email, trainerBlocks }: LetterInfo) {
    await this.mailerService
      .sendMail({
        to: `${email}`,
        subject: `${NEW_TRAINING_SUBJECT}`,
        template: './new-trainings-template',
        context: {
          trainer_blocks: `${trainerBlocks}`,
        },
      })
      .then(() => {
        console.log(`The email has sent succesfully to ${email}`);
      })
      .catch((err) => {
        throw new Error(
          `The email wasn't sent.
          Error message: ${err.message}`,
        );
      });
  }
}
