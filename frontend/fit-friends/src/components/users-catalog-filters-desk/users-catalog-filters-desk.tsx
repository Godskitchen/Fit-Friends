import { Location, SpecialisationFieldValue } from 'src/types/constants';
import UsersCatalogCheckBoxFilter from '../checkbox-filter/users-catalog-checkbox-filter';
import SkillButtons from '../radio-buttons/skill-buttons';
import { FormEvent, useEffect, useRef, useState } from 'react';
import { useAppDispatch } from 'src/hooks';
import { useNavigate } from 'react-router-dom';
import { getUsersListAction } from 'src/store/api-actions';
import { setUsersCatalogFilterStateAction } from 'src/store/main-process/main-process.reducer';
import { AppRoute } from 'src/app-constants';
import SortFilter from '../sort-filter/sort-filter';
import { UsersCatalogFiltersState } from 'src/types/forms.type';
import { queryParamCheckBoxBuilder } from 'src/utils/helpers';

const defaultLocationsState: Record<string, boolean> = {
  Pionerskaya: false,
  Petrogradskaya: false,
  Udelnaya: false,
  Zvezdnaya: false,
  Sportivnaya: false,
};

const defaultSpecialisationState: Record<string, boolean> = {
  Yoga: false,
  Running: false,
  Power: false,
  Aerobics: false,
  Crossfit: false,
  Boxing: false,
  Pilates: false,
  Stretching: false,
};

const CARD_LIMIT_PER_PAGE = 6;
const INITIAL_PAGE_NUMBER = 1;

export default function UsersCatalogFiltersDesk(): JSX.Element {

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const formRef = useRef<HTMLFormElement | null>(null);

  const [locationsState, setLocationsState] = useState(defaultLocationsState);
  const [specialisationState, setSpecialisationState] = useState(defaultSpecialisationState);
  const [skillState, setSkillState] = useState('');
  const [sortState, setSortState] = useState('');

  const onFormSubmitHandle = (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    const locations = queryParamCheckBoxBuilder(locationsState);
    const specialisations = queryParamCheckBoxBuilder(specialisationState);

    const query: UsersCatalogFiltersState = {
      limit: `${CARD_LIMIT_PER_PAGE}`,
      page: `${INITIAL_PAGE_NUMBER}`,
      location: (locations !== '') ? locations : undefined,
      trainingType: (specialisations !== '') ? specialisations : undefined,
      fitnessLevel: (skillState !== '') ? skillState : undefined,
      sort: (sortState !== '') ? sortState : undefined,
    };

    dispatch(getUsersListAction(query))
      .then(() => {dispatch(setUsersCatalogFilterStateAction(query));});
  };

  const onBtnBackClickHandle = () => {
    navigate(AppRoute.Main);
  };

  useEffect(() => {
    const initialQuery = {
      limit: `${CARD_LIMIT_PER_PAGE}`,
      page: `${INITIAL_PAGE_NUMBER}`
    };

    dispatch(getUsersListAction(initialQuery))
      .then(() => {dispatch(setUsersCatalogFilterStateAction(initialQuery));});
  }, [dispatch]);

  return (
    <div className="user-catalog-form">
      <h2 className="visually-hidden">Каталог пользователя</h2>
      <div className="user-catalog-form__wrapper">
        <button
          className="btn-flat btn-flat--underlined user-catalog-form__btnback"
          type="button"
          onClick={onBtnBackClickHandle}
        >
          <svg width="14" height="10" aria-hidden="true">
            <use xlinkHref="#arrow-left"></use>
          </svg>
          <span>Назад</span>
        </button>
        <h3 className="user-catalog-form__title">Фильтры</h3>
        <form ref={formRef} className="user-catalog-form__form" onSubmit={onFormSubmitHandle}>
          <UsersCatalogCheckBoxFilter
            title='Локация, станция метро'
            filterName='location'
            checkBoxList={Location}
            timeoutRef={timeoutRef}
            formRef={formRef}
            setterCheckboxValues={setLocationsState}
            currentCheckBoxesGroupState={locationsState}
          />
          <UsersCatalogCheckBoxFilter
            title='Специализация'
            filterName='spezialization'
            checkBoxList={SpecialisationFieldValue}
            timeoutRef={timeoutRef}
            formRef={formRef}
            setterCheckboxValues={setSpecialisationState}
            currentCheckBoxesGroupState={specialisationState}
          />
          <SkillButtons
            timeoutRef={timeoutRef}
            formRef={formRef}
            currentSkillValue={skillState}
            setterSkillValue={setSkillState}
          />
          <SortFilter
            timeoutRef={timeoutRef}
            formRef={formRef}
            currentSortValue={sortState}
            setterSortValue={setSortState}
          />
        </form>
      </div>
    </div>
  );
}
