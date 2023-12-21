import { LocationCoords } from './user.type';

export enum Gender {
  Male = 'Male',
  Female = 'Female',
  NoMatter = 'NoMatter'
}

export enum Role {
  Trainer = 'Coach',
  User = 'Sportsman'
}

export enum Location {
  Pionerskaya = 'Пионерская',
  Petrogradskaya = 'Петроградская',
  Udelnaya = 'Удельная',
  Zvezdnaya = 'Звездная',
  Sportivnaya = 'Спортивная'
}

export enum Specialisation {
  Yoga = 'Yoga',
  Running = 'Running',
  Power = 'Power',
  Aerobics = 'Aerobics',
  Crossfit = 'Crossfit',
  Boxing = 'Boxing',
  Pilates = 'Pilates',
  Stretching = 'Stretching'
}

export enum SkillLevel {
  Beginner = 'Beginner',
  Amateur = 'Amateur',
  Pro = 'Pro'
}

export enum TrainingDuration {
  TenToThirtyMinutes = 'TenToThirtyMinutes',
  ThirtyToFiftyMinutes = 'ThirtyToFiftyMinutes',
  FiftyToEightyMinutes = 'FiftyToEightyMinutes',
  EightyToOneHundredMinutes = 'EightyToOneHundredMinutes'
}

export enum DurationFieldValue {
  TenToThirtyMinutes = '10-30 мин',
  ThirtyToFiftyMinutes = '30-50 мин',
  FiftyToEightyMinutes = '50-80 мин',
  EightyToOneHundredMinutes = '80-100 мин'
}

export enum HeaderNavTab {
  Home = 'Home',
  Profile = 'Profile',
  Friends = 'Friends',
}

export enum GenderFieldValue {
  Male = 'Мужской',
  Female = 'Женский',
  NoMatter = 'Неважно'
}

export const GenderFieldToValueConvert: Record<GenderFieldValue, Gender> = {
  [GenderFieldValue.Male]: Gender.Male,
  [GenderFieldValue.Female]: Gender.Female,
  [GenderFieldValue.NoMatter]: Gender.NoMatter,
};

export const TrainingGenderFieldValue = {
  Male: 'Мужчинам',
  Female: 'Женщинам',
  NoMatter: 'Всем'
};

export enum SpecialisationFieldValue {
  Yoga = 'Йога',
  Running = 'Бег',
  Power = 'Силовые',
  Aerobics = 'Аэробика',
  Crossfit = 'Кроссфит',
  Boxing = 'Бокс',
  Pilates = 'Пилатес',
  Stretching = 'Стрейчинг'
}

export enum SkillFieldValue {
  Beginner = 'Новичок',
  Amateur = 'Любитель',
  Pro = 'Профессионал'
}

export const UserSortFieldBtnValue: Record<string, string> = {
  Trainer: 'Тренеры',
  User: 'Пользователи'
};

export const PriceSortFieldBtnValue: Record<string, string> = {
  Cheap: 'Дешевле',
  Expensive: 'Дороже',
  Free: 'Бесплатные'
};

export enum PaymentMethodValue {
  Visa = 'visa',
  Mir = 'mir',
  UMoney = 'iomoney'
}

export const SkillFieldToValueConvert: Record<SkillFieldValue, SkillLevel> = {
  'Новичок': SkillLevel.Beginner,
  'Любитель': SkillLevel.Amateur,
  'Профессионал': SkillLevel.Pro,
};

export const DurationFieldToValueConvert: Record<DurationFieldValue, TrainingDuration> = {
  '10-30 мин': TrainingDuration.TenToThirtyMinutes,
  '30-50 мин': TrainingDuration.ThirtyToFiftyMinutes,
  '50-80 мин': TrainingDuration.FiftyToEightyMinutes,
  '80-100 мин': TrainingDuration.EightyToOneHundredMinutes
};

export const SpecialisationFieldToValueConvert: Record<SpecialisationFieldValue, Specialisation> = {
  'Йога': Specialisation.Yoga,
  'Бег': Specialisation.Running,
  'Силовые': Specialisation.Power,
  'Аэробика': Specialisation.Aerobics,
  'Кроссфит': Specialisation.Crossfit,
  'Бокс': Specialisation.Boxing,
  'Пилатес': Specialisation.Pilates,
  'Стрейчинг': Specialisation.Stretching
};

export const SpecialisationHashTagValue: Record<Specialisation, string> = {
  Yoga: '#йога',
  Running: '#бег',
  Power: '#силовые',
  Aerobics: '#аэробика',
  Crossfit: '#кроссфит',
  Boxing: '#бокс',
  Pilates: '#пилатес',
  Stretching: '#стрейчинг'
};

export const SkillHashTagValue: Record<SkillLevel, string> = {
  Beginner: '#новичок',
  Amateur: '#любитель',
  Pro: '#профессионал',
};

export const GenderHashTagValue: Record<Gender, string> = {
  Male: '#для_мужчин',
  Female: '#для_женщин',
  NoMatter: '#для_всех'
};

export const DurationHashTagValue: Record<TrainingDuration, string> = {
  TenToThirtyMinutes: '#10_30минут',
  ThirtyToFiftyMinutes: '#30_50минут',
  FiftyToEightyMinutes: '#50_80минут',
  EightyToOneHundredMinutes: '#80_100минут',
};

export const UserCoordsLocation: Record<Location, LocationCoords> = {
  [Location.Zvezdnaya]: {latitude: 59.833421, longitude: 30.349537},
  [Location.Pionerskaya]: {latitude: 60.002450, longitude: 30.296702},
  [Location.Petrogradskaya]: {latitude: 59.966374, longitude: 30.311432},
  [Location.Udelnaya]: {latitude:60.016681, longitude:30.315617},
  [Location.Sportivnaya]: { latitude: 59.952161, longitude: 30.291463 }
};
