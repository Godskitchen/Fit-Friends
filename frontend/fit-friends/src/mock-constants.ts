import { Gender, Location, Role, SkillLevel, Specialisation } from './types/constants';
import { UserInfo } from './types/user.type';

export const MockUser: UserInfo = {
  userId: 1,
  name: '',
  email: '',
  gender: Gender.Male,
  aboutInfo: '',
  role: Role.User,
  birthday: '',
  avatar: '',
  backgroundImage: '',
  createdAt: '',
  location: Location.Petrogradskaya,
  trainingRequestsAsSender: [],
  trainingRequestsAsRecepient: []
};

export const MockTrainer: UserInfo = {
  userId: 1,
  name: '',
  email: '',
  gender: Gender.Male,
  aboutInfo: '',
  role: Role.Trainer,
  birthday: '',
  avatar: '',
  backgroundImage: '',
  createdAt: '',
  location: Location.Petrogradskaya,
  trainingRequestsAsSender: [],
  trainingRequestsAsRecepient: [],
  trainerProfile: {
    skillLevel: SkillLevel.Beginner,
    specialisations: [Specialisation.Boxing],
    certificates: 'certificate.pdf',
    description: '',
    individualTraining: true,
  }
};


export const MOCK_AVATAR = [0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A];
