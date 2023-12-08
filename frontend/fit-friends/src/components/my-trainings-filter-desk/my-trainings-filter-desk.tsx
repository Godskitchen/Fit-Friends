/* eslint-disable no-console */
import {FormEvent, useEffect, useRef, useState} from 'react';
import './range-slider.css';
import InputRangeFilter from '../range-filters/input-range-filter';
import { CALORIES_TO_BURN, PRICE, RATING } from 'src/utils/validators/training/constants';
import RangeFilter from '../range-filters/range-filter';
import CheckBoxFilter from '../checkbox-filter/checkbox-filter';
import { queryParamDurationBuilder, queryParamsRangeBuilder } from 'src/utils/helpers';
import { useAppDispatch } from 'src/hooks';
import { getMyTrainingsAction } from 'src/store/api-actions';
import { MyTrainingsFitersState } from 'src/types/forms.type';
import { setFiltersStateAction } from 'src/store/user-process/user-process.reducer';
import { useNavigate } from 'react-router-dom';
import { AppRoute } from 'src/app-constants';

const defaultDurationsState: Record<string, boolean> = {
  TenToThirtyMinutes: false,
  ThirtyToFiftyMinutes: false,
  FiftyToEightyMinutes: false,
  EightyToOneHundredMinutes: false
};

const durationBtnValue: Record<string, string> = {
  TenToThirtyMinutes: '10 мин - 30 мин',
  ThirtyToFiftyMinutes: '30 мин - 50 мин',
  FiftyToEightyMinutes: '50 мин - 80 мин',
  EightyToOneHundredMinutes: '80 мин - 100 мин',
};

const CARD_LIMIT_PER_PAGE = 6;
const INITIAL_PAGE_NUMBER = 1;

export default function MyTrainingsFilterDesk(): JSX.Element {

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

  const [durationsState, setDurationsState] = useState(defaultDurationsState);

  const onFormSubmitHandle = (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    const price = queryParamsRangeBuilder(minFieldPrice, maxFieldPrice, PRICE.MAX, PRICE.MIN);
    const calories = queryParamsRangeBuilder(minFieldCalories, maxFieldCalories, CALORIES_TO_BURN.MAX, CALORIES_TO_BURN.MIN);
    const rating = queryParamsRangeBuilder(`${minRating}`, `${maxRating}`, RATING.MAX, RATING.MIN);
    const durations = queryParamDurationBuilder(durationsState);

    const query: MyTrainingsFitersState = {
      limit: `${CARD_LIMIT_PER_PAGE}`,
      page: `${INITIAL_PAGE_NUMBER}`,
      price: (price !== '') ? price : undefined,
      caloriesToBurn: (calories !== '') ? calories : undefined,
      rating: (rating !== '') ? rating : undefined,
      trainingDuration: (durations !== '') ? durations : undefined,
    };

    dispatch(getMyTrainingsAction(query))
      .then(() => {dispatch(setFiltersStateAction(query));});
  };

  const onBtnBackClickHandle = () => {
    navigate(AppRoute.CoachAccount);
  };

  useEffect(() => {
    const initialQuery = {
      limit: `${CARD_LIMIT_PER_PAGE}`,
      page: `${INITIAL_PAGE_NUMBER}`
    };

    dispatch(getMyTrainingsAction(initialQuery))
      .then(() => {dispatch(setFiltersStateAction(initialQuery));});
  }, [dispatch]);

  return (
    <div className="my-training-form__wrapper">
      <button className="btn-flat btn-flat--underlined my-training-form__btnback" type="button" onClick={onBtnBackClickHandle}>
        <svg width="14" height="10" aria-hidden="true">
          <use xlinkHref="#arrow-left"></use>
        </svg>
        <span>Назад</span>
      </button>
      <h3 className="my-training-form__title">фильтры</h3>
      <form ref={formRef} className="my-training-form__form" onSubmit={onFormSubmitHandle}>
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
        />
        <CheckBoxFilter
          title='Длительность'
          filterName='duration'
          formRef={formRef}
          timeoutRef={timeoutRef}
          setterCheckboxValues={setDurationsState}
          currentCheckBoxesGroupState={durationsState}
          checkBoxBtnValues={durationBtnValue}
        />
      </form>
    </div>
  );
}
