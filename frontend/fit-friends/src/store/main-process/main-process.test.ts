import { MainProcess } from 'src/types/state.type';
import { mainProcess, setFriendsQueryStateAction, setMyTrainingsFiltersStateAction, setTrainingCatalogFilterStateAction, setUsersCatalogFilterStateAction } from './main-process.reducer';
import { FriendsQueryState, MyTrainingsFitersState, TrainingsCatalogFiltersState, UsersCatalogFiltersState } from 'src/types/queries-filters.type';
import { Location, SkillLevel, Specialisation } from 'src/types/constants';

const initialState: MainProcess = {
  myTrainingsFilterState: {},
  usersCatalogFilterState: {},
  friendsQueryState: {},
  trainingsCatalogFilterState: {}
};

describe('Reducer main-process', () => {
  it('without additional parameters should return initial state', () => {
    expect(mainProcess.reducer(undefined, { type: 'UNKNOWN_ACTION' }))
      .toEqual(initialState);
  });

  describe('Change state known actions', () => {
    let testState: MainProcess;

    beforeEach(() => { testState = {...initialState};});

    it('should change "my trainings" filter state', () => {
      const mockState: MyTrainingsFitersState = {
        price: '100,200',
        caloriesToBurn: '1000,2000',
        rating: '4,5',
        page: '1',
        limit: '6',
      };
      expect(mainProcess.reducer(testState, setMyTrainingsFiltersStateAction(mockState)))
        .toEqual({...testState, myTrainingsFilterState: mockState });
    });

    it('should change "users catalog" filter state', () => {
      const mockState: UsersCatalogFiltersState = {
        location: Location.Pionerskaya,
        trainingType: Specialisation.Boxing,
        fitnessLevel: SkillLevel.Beginner,
        page: '1',
        limit: '6',
        role: 'User',
        isReady: true
      };
      expect(mainProcess.reducer(testState, setUsersCatalogFilterStateAction(mockState)))
        .toEqual({...testState, usersCatalogFilterState: mockState });
    });

    it('should change "friends" query state', () => {
      const mockState: FriendsQueryState = {
        page: '2',
        limit: '6'
      };
      expect(mainProcess.reducer(testState, setFriendsQueryStateAction(mockState)))
        .toEqual({...testState, friendsQueryState: mockState });
    });

    it('should change "trainings catalog" filter state', () => {
      const mockState: TrainingsCatalogFiltersState = {
        page: '1',
        limit: '6',
        price: '100,1000',
        caloriesToBurn: '1000,2000',
        trainingType: Specialisation.Yoga,
        rating: '1,5',
        discount: false
      };
      expect(mainProcess.reducer(testState, setTrainingCatalogFilterStateAction(mockState)))
        .toEqual({...testState, trainingsCatalogFilterState: mockState });
    });
  });
});
