import { Injectable } from '@nestjs/common';
import { TrainingEntity } from '../entities/training.entity';
import { DatabaseService } from '../prisma/database.service';
import {
  Training,
  UserTrainingQuery,
  UpdateTrainingData,
  GeneralTrainingQuery,
  SpecialTrainingQuery,
} from '@libs/shared/app-types';
import { calculateTrainingWeight } from '@libs/shared/helpers';

@Injectable()
export class TrainingRepository {
  private prismaConnector;

  constructor(private readonly dbService: DatabaseService) {
    this.prismaConnector = dbService.prismaPostgresConnector;
  }

  public async create(entity: TrainingEntity): Promise<Training> {
    const { trainer, ...restData } = entity.toObject();

    return this.prismaConnector.training.create({
      data: {
        ...restData,
        trainer: {
          connect: { userId: trainer.userId },
        },
      },
      include: {
        trainer: { include: { trainerProfile: true } },
      },
    });
  }

  public async update(
    data: UpdateTrainingData,
    trainingId: number,
  ): Promise<Training> {
    return this.prismaConnector.training.update({
      where: { trainingId },
      data: { ...data },
      include: {
        trainer: { include: { trainerProfile: true } },
      },
    });
  }

  public async findById(trainingId: number): Promise<Training | null> {
    return this.prismaConnector.training.findUnique({
      where: { trainingId },
      include: {
        trainer: { include: { trainerProfile: true } },
      },
    });
  }

  public async findByTrainerId(
    trainerId: number,
    {
      limit,
      page,
      price,
      caloriesToBurn,
      trainingDuration,
      rating,
      sortDirection,
    }: UserTrainingQuery,
  ) {
    const priceFilter = price ? { gte: price[0], lte: price[1] } : undefined;
    const caloriesFilter = caloriesToBurn
      ? { gte: caloriesToBurn[0], lte: caloriesToBurn[1] }
      : undefined;

    const durationFilter = trainingDuration
      ? trainingDuration.map((value) => ({ trainingDuration: value }))
      : [];

    const ratingFilter = rating
      ? { gte: rating[0], lte: rating[1] }
      : undefined;

    const totalTrainingsCount = await this.prismaConnector.training.count({
      where: {
        AND: [
          { trainerId },
          { price: priceFilter },
          { caloriesToBurn: caloriesFilter },
          { OR: durationFilter },
          { rating: ratingFilter },
        ],
      },
    });

    const trainingList = await this.prismaConnector.training.findMany({
      where: {
        AND: [
          { trainerId },
          { price: priceFilter },
          { caloriesToBurn: caloriesFilter },
          { OR: durationFilter },
          { rating: ratingFilter },
        ],
      },
      take: limit,
      skip: page ? limit * (page - 1) : undefined,
      include: {
        trainer: { include: { trainerProfile: true } },
      },
      orderBy: { createdAt: sortDirection },
    });

    return { totalTrainingsCount, trainingList };
  }

  public async findAll({
    trainerId,
    limit,
    page,
    trainingType,
    trainingDuration,
    sort,
    sortDirection,
    rating,
    price,
    caloriesToBurn,
    discount,
  }: GeneralTrainingQuery) {
    const priceFilter = price ? { gte: price[0], lte: price[1] } : undefined;
    const caloriesFilter = caloriesToBurn
      ? { gte: caloriesToBurn[0], lte: caloriesToBurn[1] }
      : undefined;

    const durationFilter = trainingDuration
      ? trainingDuration.map((value) => ({ trainingDuration: value }))
      : [];

    const typeFilter = trainingType
      ? trainingType.map((value) => ({ trainingType: value }))
      : [];

    const ratingFilter = rating
      ? { gte: rating[0], lte: rating[1] }
      : undefined;

    const totalTrainingsCount = await this.prismaConnector.training.count({
      where: {
        AND: [
          { trainerId: trainerId },
          { price: priceFilter },
          { caloriesToBurn: caloriesFilter },
          { OR: durationFilter },
          { OR: typeFilter },
          { rating: ratingFilter },
          { isSpecialOffer: discount },
        ],
      },
    });

    const trainingList = await this.prismaConnector.training.findMany({
      where: {
        AND: [
          { trainerId: trainerId },
          { price: priceFilter },
          { caloriesToBurn: caloriesFilter },
          { OR: durationFilter },
          { OR: typeFilter },
          { rating: ratingFilter },
          { isSpecialOffer: discount },
        ],
      },
      take: limit,
      skip: page ? limit * (page - 1) : undefined,
      include: {
        trainer: { include: { trainerProfile: true } },
      },
      orderBy: sort ? { [sort]: sortDirection } : { createdAt: sortDirection },
    });

    return { totalTrainingsCount, trainingList };
  }

  public async updateTrainingRating(
    trainingId: number,
    rating: number,
  ): Promise<void> {
    await this.prismaConnector.training.update({
      where: { trainingId },
      data: { rating: parseFloat(rating.toFixed(1)) },
    });
  }

  public async findSpecialTrainings({
    fitnessLevel,
    trainingDuration,
    trainingType,
    limit,
  }: SpecialTrainingQuery) {
    const trainings = await this.prismaConnector.training.findMany({
      where: {
        OR: [
          { fitnessLevel },
          { trainingDuration },
          { trainingType: { in: trainingType } },
        ],
      },
    });

    trainings.sort(
      (trainingOne, trainingTwo) =>
        calculateTrainingWeight(trainingTwo, {
          fitnessLevel,
          trainingDuration,
          trainingType,
        }) -
        calculateTrainingWeight(trainingOne, {
          fitnessLevel,
          trainingDuration,
          trainingType,
        }),
    );

    return trainings.length > limit ? trainings.slice(0, limit) : trainings;
  }
}
