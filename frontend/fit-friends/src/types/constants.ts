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

export const DurationFieldValue = {
  TenToThirtyMinutes: '10-30 мин',
  ThirtyToFiftyMinutes: '30-50 мин',
  FiftyToEightyMinutes: '50-80 мин',
  EightyToOneHundredMinutes: '80-100 мин'
};

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

export const SpecialisationFieldValue = {
  Yoga: 'Йога',
  Running: 'Бег',
  Power: 'Силовые',
  Aerobics: 'Аэробика',
  Crossfit: 'Кроссфит',
  Boxing: 'Бокс',
  Pilates: 'Пилатес',
  Stretching: 'Стрейчинг'
};

export enum SkillFieldValue {
  Beginner = 'Новичок',
  Amateur = 'Любитель',
  Pro = 'Профессионал'
}

export const SkillFieldToValueConvert: Record<SkillFieldValue, SkillLevel> = {
  [SkillFieldValue.Beginner]: SkillLevel.Beginner,
  [SkillFieldValue.Amateur]: SkillLevel.Amateur,
  [SkillFieldValue.Pro]: SkillLevel.Pro,
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
