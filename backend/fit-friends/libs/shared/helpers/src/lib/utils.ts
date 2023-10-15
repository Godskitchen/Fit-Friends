import { DbConfig } from '@libs/shared/app-types';
import { ClassConstructor, plainToInstance } from 'class-transformer';

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
  });
}
