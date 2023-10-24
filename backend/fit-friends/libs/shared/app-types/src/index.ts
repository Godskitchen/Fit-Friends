export * from './lib/interfaces/configs.interface';
export * from './lib/interfaces/user.interface';
export * from './lib/interfaces/user-profile.interface';
export * from './lib/interfaces/trainer-profile.interface';
export * from './lib/interfaces/refresh-token-data.interface';
export * from './lib/interfaces/request-with-user-info.interface';
export * from './lib/interfaces/request-with-token-payload.interface';
export * from './lib/interfaces/training.interface';
export * from './lib/interfaces/order.interface';

export * from './lib/token-payload.type';
export * from './lib/update-user-data.type';

export {
  Gender,
  Role,
  Location,
  FitnessLevel,
  TrainingType,
  TrainingDuration,
  OrderType,
  PaymentType,
} from '@prisma/client';
