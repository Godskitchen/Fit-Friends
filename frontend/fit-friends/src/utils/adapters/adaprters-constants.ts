import { Location } from 'src/types/constants';

export enum RoleToServer {
  Sportsman = 'User',
  Coach = 'Trainer'
}

export enum RoleToClient {
  User = 'Sportsman',
  Trainer = 'Coach'
}


export const LocationToServer: Record<Location, string> = {
  'Пионерская': 'Pionerskaya',
  'Петроградская': 'Petrogradskaya',
  'Удельная': 'Udelnaya',
  'Звездная': 'Zvezdnaya',
  'Спортивная': 'Sportivnaya'
} as const;

export const LocationToClient: Record<string, Location> = {
  Pionerskaya: Location.Pionerskaya,
  Petrogradskaya: Location.Petrogradskaya,
  Udelnaya: Location.Udelnaya,
  Zvezdnaya: Location.Zvezdnaya,
  Sportivnaya: Location.Sportivnaya
} as const;
