import { Gender, Location, Role, SkillLevel, Specialisation, TrainingDuration } from './types/constants';
import { Message } from './types/message.type';
import { OrderCardType } from './types/order.type';
import { Reply } from './types/reply.type';
import { Training, TrainingCardType } from './types/training.type';
import { TrainerProfileInfo, UserInfo, UserProfileInfo } from './types/user.type';

export const MockUser: UserInfo = {
  userId: 1,
  name: 'mockUser',
  email: 'mock_user@test.local',
  gender: Gender.Male,
  aboutInfo: 'mock about info',
  role: Role.User,
  birthday: new Date().toISOString(),
  avatar: 'http://localhost:4000/static/users/avatar/avatar.png',
  backgroundImage: 'http://localhost:4000/static/users/backs/user-2.png',
  createdAt: new Date().toISOString(),
  location: Location.Petrogradskaya,
  trainingRequestsAsSender: [],
  trainingRequestsAsRecepient: []
};

export const MockTrainer: UserInfo = {
  userId: 1,
  name: 'mockTrainer',
  email: 'mock_trainer@test.local',
  gender: Gender.Male,
  aboutInfo: 'mock about info',
  role: Role.Trainer,
  birthday: new Date().toISOString(),
  avatar: 'http://localhost:4000/static/users/avatar/avatar.png',
  backgroundImage: 'http://localhost:4000/static/users/backs/user-1.png',
  createdAt: new Date().toISOString(),
  location: Location.Petrogradskaya,
  trainingRequestsAsSender: [],
  trainingRequestsAsRecepient: [],
};

export const MockUserProfile: UserProfileInfo = {
  skillLevel: SkillLevel.Beginner,
  specialisations: [Specialisation.Boxing],
  trainingDuration: TrainingDuration.TenToThirtyMinutes,
  caloriesToBurn: 1500,
  dailyCaloriesIntake: 2000,
  readyForWorkout: true
};

export const MockTrainerProfile: TrainerProfileInfo = {
  skillLevel: SkillLevel.Beginner,
  specialisations: [Specialisation.Boxing],
  certificates: 'certificate.pdf',
  description: '',
  individualTraining: true,
};


export const createUserMocks = (count: number) => {
  const mockUserList: UserInfo[] = [];
  for (let i = 1; i <= count; i++) {
    const newUser: UserInfo = {
      userId: i + 1,
      name: 'mock',
      email: `mockmail${i + 1}@mail.local`,
      gender: Gender.NoMatter,
      aboutInfo: 'mockinfo',
      role: Role.User,
      birthday: new Date().toISOString(),
      avatar: 'http://localhost:4000/static/users/avatar/avatar.png',
      backgroundImage: 'http://localhost:4000/static/users/backs/user-1.png',
      createdAt: new Date().toISOString(),
      location: Location.Petrogradskaya,
      trainingRequestsAsSender: [],
      trainingRequestsAsRecepient: [],
      userProfile: {...MockUserProfile}
    };
    mockUserList.push(newUser);
  }

  return mockUserList;
};


export const createOrderMocks = (count: number) => {
  const mockOrderList: OrderCardType[] = [];
  for (let i = 1; i <= count; i++) {
    const newOrder: OrderCardType = {
      training: {
        trainingId: i,
        title: `training${i}`,
        backgroundImage: 'http://localhost:4000/static/trainings/backs/training5.jpg',
        skillLevel: SkillLevel.Amateur,
        trainingDuration: TrainingDuration.FiftyToEightyMinutes,
        specialisation: Specialisation.Yoga,
        price: 100,
        caloriesToBurn: 1500,
        description: 'training description',
        gender: Gender.Male,
        rating: 0,
        isSpecialOffer: false
      },
      sum: i * 100,
      trainingCount: i
    };
    mockOrderList.push(newOrder);
  }

  return mockOrderList;
};

export const createTrainingMocks = (count: number) => {
  const mockTrainingList: TrainingCardType[] = [];
  for (let i = 1; i <= count; i++) {
    const newTraining: TrainingCardType = {
      trainingId: i,
      title: `training${i}`,
      backgroundImage: 'http://localhost:4000/static/trainings/backs/training5.jpg',
      skillLevel: SkillLevel.Amateur,
      trainingDuration: TrainingDuration.FiftyToEightyMinutes,
      specialisation: Specialisation.Yoga,
      price: 100,
      caloriesToBurn: 1500,
      description: 'training description',
      gender: Gender.Male,
      rating: 0,
      isSpecialOffer: false
    };
    mockTrainingList.push(newTraining);
  }

  return mockTrainingList;
};

export const createReplyMocks = (count: number) => {
  const mockReplyList: Reply[] = [];
  for (let i = 1; i <= count; i++) {
    const newReply: Reply = {
      replyId: i,
      text: 'mock reply text',
      rating: 3,
      author: {...MockUser, userProfile: MockUserProfile}
    };
    mockReplyList.push(newReply);
  }

  return mockReplyList;
};

export const createNotificiationMocks = (count: number) => {
  const notificationList: Message[] = [];
  for (let i = 1; i <= count; i++) {
    const newNotification: Message = {
      id: `mockid-${i}`,
      text: 'mock text',
      createdAt: new Date().toISOString()
    };
    notificationList.push(newNotification);
  }

  return notificationList;
};

export const MockTraining: Training = {
  trainingId: 100,
  title: 'MockTraining',
  backgroundImage: 'http://localhost:4000/static/trainings/backs/training5.jpg',
  skillLevel: SkillLevel.Amateur,
  trainingDuration: TrainingDuration.FiftyToEightyMinutes,
  specialisation: Specialisation.Aerobics,
  price: 100,
  caloriesToBurn: 1200,
  description: 'Training mock description',
  gender: Gender.NoMatter,
  rating: 4,
  isSpecialOffer: false,
  video: 'http://localhost:4000/static/trainings/video/video.mov',
  trainer: {
    userId: 9,
    name: 'mockTrainer',
    email: 'mockmail@local.com',
    gender: Gender.Male,
    role: Role.Trainer,
    avatar: 'http://localhost:4000/static/users/avatar/avatar.png',
    aboutInfo: 'info about mock user',
    location: Location.Sportivnaya,
    backgroundImage: 'http://localhost:4000/static/trainings/backs/training5.jpg',
    trainingRequestsAsRecepient: [],
    trainingRequestsAsSender: [],
    birthday: new Date().toISOString(),
    createdAt: new Date().toISOString()
  }
};


export const MOCK_AVATAR = [0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A];
export const MOCK_VIDEO = [
  0x00, 0x00, 0x00, 0x18, 0x66, 0x74, 0x79, 0x70,
  0x69, 0x73, 0x6F, 0x6D, 0x00, 0x00, 0x00, 0x01,
  0x6D, 0x70, 0x34, 0x31, 0x00, 0x00, 0x00, 0x00,
];

export const MOCK_PDF = [
  0x25, 0x50, 0x44, 0x46, 0x2D, 0x31, 0x2E, 0x34,
];
