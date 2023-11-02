import { DbConfig } from '@libs/shared/app-types';
import { genSalt, hash } from 'bcrypt';
import { ClassConstructor, plainToInstance } from 'class-transformer';

export type DateTimeUnit = 's' | 'm' | 'h' | 'd' | 'M' | 'y';
export type TimeAndUnit = { value: number; unit: DateTimeUnit };

const SALT_ROUNDS = 10;

export function getPostgresConnectionString({
  user,
  password,
  host,
  port,
  name,
}: DbConfig): string {
  return `postgresql://${user}:${password}@${host}:${port}/${name}?schema=public`;
}

export function fillRDO<T, V>(
  someRDO: ClassConstructor<T>,
  plainObject: V,
  groups?: string[],
) {
  return plainToInstance(someRDO, plainObject, {
    excludeExtraneousValues: true,
    groups,
    exposeUnsetFields: false,
  });
}

export function parseTokenTime(time: string): TimeAndUnit {
  const regex = /^(\d+)([smhdMy])/;
  const match = regex.exec(time);

  if (!match) {
    throw new Error(`[parseTokenTime] Incorrect time string format: ${time}`);
  }

  const [, valueRaw, unitRaw] = match;
  const value = parseInt(valueRaw, 10);
  const unit = unitRaw as DateTimeUnit;

  if (isNaN(value)) {
    throw new Error(`[parseTokenTime] Can't parse value count. Result is NaN.`);
  }

  return { value, unit };
}

export async function hashPassword(password: string): Promise<string> {
  const salt = await genSalt(SALT_ROUNDS);
  return hash(password, salt);
}
