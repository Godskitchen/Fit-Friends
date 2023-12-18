/* eslint-disable no-nested-ternary */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { FormEvent, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppRoute } from 'src/app-constants';
import { useAppDispatch } from 'src/hooks';
import { PRICE, RATING } from 'src/utils/validators/training/constants';
import { CALORIES_TO_BURN } from 'src/utils/validators/user/constants';
import InputRangeFilter from '../range-filters/input-range-filter';
import RangeFilter from '../range-filters/range-filter';
import TrainingFormCheckBoxFilter from '../checkbox-filter/training-form-checkbox-filter';
import { PriceSortFieldBtnValue, SpecialisationFieldValue } from 'src/types/constants';
import SortFilter from '../sort-filter/sort-filter';
import { queryParamCheckBoxBuilder, queryParamsRangeBuilder } from 'src/utils/helpers';
import { TrainingsCatalogFiltersState } from 'src/types/forms.type';
import { getTrainingListAction } from 'src/store/api-actions';
import { setTrainingCatalogFilterStateAction } from 'src/store/main-process/main-process.reducer';

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

export default function TrainingsCatalogFiltersDesk(): JSX.Element {

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const formRef = useRef<HTMLFormElement | null>(null);

  const [maxPrice, setMaxPrice] = useState(PRICE.MAX);
  const [minPrice, setMinPrice] = useState(PRICE.MIN);

  const [maxFieldPrice, setMaxFieldPrice] = useState('');
  const [minFieldPrice, setMinFieldPrice] = useState('');

  const [maxCalories, setMaxCalories] = useState(CALORIES_TO_BURN.MAX);
  const [minCalories, setMinCalories] = useState(CALORIES_TO_BURN.MIN);

  const [maxFieldCalories, setMaxFieldCalories] = useState('');
  const [minFieldCalories, setMinFieldCalories] = useState('');

  const [maxRating, setMaxRating] = useState(RATING.MAX);
  const [minRating, setMinRating] = useState(RATING.MIN);

  const [specialisationState, setSpecialisationState] = useState(defaultSpecialisationState);
  const [sortState, setSortState] = useState('');

  const onBtnBackClickHandle = () => {
    navigate(AppRoute.Main);
  };

  const onFormSubmitHandle = (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    const price = queryParamsRangeBuilder(minFieldPrice, maxFieldPrice, PRICE.MAX, PRICE.MIN);
    const calories = queryParamsRangeBuilder(minFieldCalories, maxFieldCalories, CALORIES_TO_BURN.MAX, CALORIES_TO_BURN.MIN);
    const rating = queryParamsRangeBuilder(`${minRating}`, `${maxRating}`, RATING.MAX, RATING.MIN);
    const specialisations = queryParamCheckBoxBuilder(specialisationState);

    const query: TrainingsCatalogFiltersState = {
      limit: `${CARD_LIMIT_PER_PAGE}`,
      page: `${INITIAL_PAGE_NUMBER}`,
      price: (price !== '') ? price : undefined,
      caloriesToBurn: (calories !== '') ? calories : undefined,
      rating: (rating !== '') ? rating : undefined,
      trainingType: (specialisations !== '') ? specialisations : undefined,
      sort: (sortState !== '') ? 'price' : undefined,
      sortDirection: (sortState === 'Expensive') ? 'desc' : (sortState !== '') ? 'asc' : undefined,
    };

    dispatch(getTrainingListAction(query))
      .then((result) => {
        if (getTrainingListAction.fulfilled.match(result)) {
          dispatch(setTrainingCatalogFilterStateAction(query));
        }
      });
  };

  useEffect(() => {
    const initialQuery = {
      limit: `${CARD_LIMIT_PER_PAGE}`,
      page: `${INITIAL_PAGE_NUMBER}`
    };

    dispatch(getTrainingListAction(initialQuery))
      .then((result) => {
        if (getTrainingListAction.fulfilled.match(result)) {
          dispatch(setTrainingCatalogFilterStateAction(initialQuery));
        }
      });
  }, [dispatch]);

  return (
    <div className="gym-catalog-form">
      <h2 className="visually-hidden">Мои тренировки Фильтр</h2>
      <div className="gym-catalog-form__wrapper">
        <button
          className="btn-flat btn-flat--underlined gym-catalog-form__btnback"
          type="button"
          onClick={onBtnBackClickHandle}
        >
          <svg width="14" height="10" aria-hidden="true">
            <use xlinkHref="#arrow-left"></use>
          </svg>
          <span>Назад</span>
        </button>
        <h3 className="gym-catalog-form__title">Фильтры</h3>
        <form ref={formRef} className="gym-catalog-form__form" onSubmit={onFormSubmitHandle}>
          <InputRangeFilter
            timeoutRef={timeoutRef}
            formRef={formRef}
            setterMaxFieldValue={setMaxFieldPrice}
            setterMaxRangeValue={setMaxPrice}
            setterMinFieldValue={setMinFieldPrice}
            setterMinRangeValue={setMinPrice}
            currMinValue={minPrice}
            currMinFieldValue={minFieldPrice}
            currMaxValue={maxPrice}
            currMaxFieldValue={maxFieldPrice}
            maxPossibleValue={PRICE.MAX}
            minPossibleValue={PRICE.MIN}
            title='Цена, ₽'
            filterName='price'
            className='gym-catalog'
          />
          <InputRangeFilter
            timeoutRef={timeoutRef}
            formRef={formRef}
            setterMaxFieldValue={setMaxFieldCalories}
            setterMaxRangeValue={setMaxCalories}
            setterMinFieldValue={setMinFieldCalories}
            setterMinRangeValue={setMinCalories}
            currMinValue={minCalories}
            currMinFieldValue={minFieldCalories}
            currMaxValue={maxCalories}
            currMaxFieldValue={maxFieldCalories}
            maxPossibleValue={CALORIES_TO_BURN.MAX}
            minPossibleValue={CALORIES_TO_BURN.MIN}
            title='Калории'
            filterName='calories'
            className='gym-catalog'
          />
          <RangeFilter
            timeoutRef={timeoutRef}
            formRef={formRef}
            currMaxValue={maxRating}
            currMinValue={minRating}
            maxPossibleValue={RATING.MAX}
            minPossibleValue={RATING.MIN}
            setterMaxRangeValue={setMaxRating}
            setterMinRangeValue={setMinRating}
            title='Рейтинг'
            filterName='raiting'
            className='gym-catalog'
          />
          <TrainingFormCheckBoxFilter
            title='Тип'
            filterName='type'
            formRef={formRef}
            timeoutRef={timeoutRef}
            setterCheckboxValues={setSpecialisationState}
            currentCheckBoxesGroupState={specialisationState}
            checkBoxBtnValues={SpecialisationFieldValue}
            className='gym-catalog'
          />
          <SortFilter
            timeoutRef={timeoutRef}
            formRef={formRef}
            currentSortValue={sortState}
            setterSortValue={setSortState}
            className='gym-catalog'
            filterValues={PriceSortFieldBtnValue}
          />
        </form>
      </div>
    </div>
  );
}

