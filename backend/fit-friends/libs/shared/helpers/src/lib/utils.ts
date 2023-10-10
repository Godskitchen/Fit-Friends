import { DbConfig } from '@libs/shared/app-types';

export function getPostgresConnectionString({
  user,
  password,
  host,
  port,
  name,
}: DbConfig): string {
  return `postgresql://${user}:${password}@${host}:${port}/${name}?schema=public`;
}
