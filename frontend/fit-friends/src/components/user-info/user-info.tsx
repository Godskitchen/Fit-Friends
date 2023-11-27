/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useAppDispatch, useAppSelector } from 'src/hooks';
import { getUserInfo } from 'src/store/user-process/user-process.selectors';
import LoadingScreen from '../loading-screen/loading-screen';
import { useEffect, useState, MouseEvent, useRef} from 'react';
import { Specialisation, Location, Gender, SkillLevel } from 'src/types/constants';
import { SubmitHandler, useForm, useWatch } from 'react-hook-form';
import { CoachInfoInputs } from 'src/types/forms.type';
import SpecialisationList from '../specialisation-reg-list.tsx/specialisation-list';
import DropDownList from '../location-list/location-list';


const GenderValueType = {
  Male: 'Мужской',
  Female: 'Женский',
  NoMatter: 'Неважно'
};

const GenderConvert = {
  'Мужской': 'Male',
  'Женский': 'Female',
  'Неважно': 'NoMatter',
};

const SkillValueType = {
  Beginner: 'Новичок',
  Amateur: 'Любитель',
  Pro: 'Профессионал'
};

const SkillConvert = {
  'Новичок': 'Beginner',
  'Любитель': 'Amateur',
  'Профессионал': 'Pro'
};

export default function UserInfo(): JSX.Element {
  const dispatch = useAppDispatch();
  const userInfo = useAppSelector(getUserInfo);
  const [isEditMode, setEditMode] = useState(false);

  const locationBlockRef = useRef<HTMLDivElement>(null);
  const genderBlockRef = useRef<HTMLDivElement>(null);
  const skillBlockRef = useRef<HTMLDivElement>(null);

  const {
    register,
    control,
    formState: { errors },
    clearErrors,
    formState,
    setValue,
    getValues,
    trigger,
    setError,
    watch
  } = useForm<CoachInfoInputs>(
    {
      mode: 'onChange',
      shouldFocusError: false,
      reValidateMode: 'onChange',
      defaultValues: (userInfo && userInfo.trainerProfile) ? {
        name: userInfo.name,
        aboutInfo: userInfo.aboutInfo,
        individualTraining: userInfo.trainerProfile.individualTraining,
        specialisations: userInfo.trainerProfile.specialisations,
        location: userInfo.location,
        gender: userInfo.gender,
        skillLevel: userInfo.trainerProfile.skillLevel
      } : {}
    }
  );

  const onClickLocationItemHandler = (evt: MouseEvent<HTMLUListElement>) => {
    const location = (evt.target as HTMLLIElement).textContent as Location;
    if (location) {
      setValue('location', location, {shouldValidate: true});
    }
    locationBlockRef.current?.classList.remove('is-open');
  };

  const onClickGenderItemHandler = (evt: MouseEvent<HTMLUListElement>) => {
    const gender = (evt.target as HTMLLIElement).textContent as keyof typeof GenderConvert;
    if (gender) {
      setValue('gender', GenderConvert[gender] as Gender, {shouldValidate: true});
    }
    genderBlockRef.current?.classList.remove('is-open');
  };

  const onClickSkillItemHandler = (evt: MouseEvent<HTMLUListElement>) => {
    const skillLevel = (evt.target as HTMLLIElement).textContent as keyof typeof SkillConvert;
    if (skillLevel) {
      setValue('skillLevel', SkillConvert[skillLevel] as SkillLevel, {shouldValidate: true});
    }
    skillBlockRef.current?.classList.remove('is-open');
  };

  const onOpenLocationListBtnClickHandler = () => locationBlockRef.current?.classList.toggle('is-open');
  const onOpenGenderListBtnClickHandler = () => genderBlockRef.current?.classList.toggle('is-open');
  const onOpenSkillListBtnClickHandler = () => skillBlockRef.current?.classList.toggle('is-open');

  const selectedSpecs = useWatch<CoachInfoInputs, 'specialisations'>({control, name: 'specialisations'});

  const onSubmitHandler: SubmitHandler<CoachInfoInputs> = (formData) => {
    console.log('formData', formData);
  };

  useEffect(() => {
    const subscription = watch((data) => {
      console.log(data);
    });

    return () => { subscription.unsubscribe(); };
  }, [watch]);

  if (!userInfo || !userInfo.trainerProfile) {
    return <LoadingScreen />;
  }

  return (
    <section className="user-info-edit">
      <div className="user-info-edit__header">
        <div className="input-load-avatar">
          <label>
            <input className="visually-hidden" type="file" name="avatar" accept="image/png, image/jpeg" disabled={!isEditMode}/>
            {
              userInfo.avatar
                ? (
                  <span className="input-load-avatar__avatar" style={{overflow: 'auto'}}>
                    <img
                      src={userInfo.avatar}
                      srcSet={userInfo.avatar}
                      style={{height: '98px'}}
                      width="98" height="98" alt="user avatar"
                    />
                  </span>
                )
                : (
                  <span className="input-load-avatar__btn">
                    <svg width="20" height="20" aria-hidden="true">
                      <use xlinkHref="#icon-import"></use>
                    </svg>
                  </span>
                )
            }
          </label>
        </div>
        {
          isEditMode && (
            <div className="user-info-edit__controls">
              <button className="user-info-edit__control-btn" aria-label="обновить">
                <svg width="16" height="16" aria-hidden="true">
                  <use xlinkHref="#icon-change"></use>
                </svg>
              </button>
              <button className="user-info-edit__control-btn" aria-label="удалить">
                <svg width="14" height="16" aria-hidden="true">
                  <use xlinkHref="#icon-trash"></use>
                </svg>
              </button>
            </div>
          )
        }
      </div>
      <form className="user-info-edit__form">
        {
          isEditMode
            ? (
              <button
                className="btn-flat btn-flat--underlined user-info-edit__save-button"
                type="submit"
                aria-label="Сохранить"
                onClick={ () => {
                  setEditMode(false);
                  onSubmitHandler(getValues());
                }}
                disabled={!isEditMode || !formState.isValid}
              >
                <svg width="12" height="12" aria-hidden="true">
                  <use xlinkHref="#icon-edit"></use>
                </svg>
                <span>Сохранить</span>
              </button>
            )
            : (
              <button
                className="btn-flat btn-flat--underlined user-info__edit-button"
                type="button"
                aria-label="Редактировать"
                onClick={(evt) => {evt.preventDefault(); setEditMode(true); trigger();}}
              >
                <svg width="12" height="12" aria-hidden="true">
                  <use xlinkHref="#icon-edit"></use>
                </svg>
                <span>Редактировать</span>
              </button>
            )
        }
        <div className="user-info-edit__section">
          <h2 className="user-info-edit__title">Обо мне</h2>
          <div className={`custom-input ${!isEditMode ? 'custom-input--readonly' : ''} user-info-edit__input`}>
            <label>
              <span className="custom-input__label">Имя</span>
              <span className="custom-input__wrapper">
                <input
                  type="text"
                  disabled={!isEditMode}
                  {...register('name', {required: true, minLength: 1, maxLength: 15})}
                />
              </span>
            </label>
          </div>
          <div className={`custom-textarea ${!isEditMode ? 'custom-input--readonly' : ''} user-info-edit__textarea`}>
            <label>
              <span className="custom-textarea__label">Описание</span>
              <textarea
                placeholder="Добавьте сюда свое описание"
                disabled={!isEditMode}
                {...register('aboutInfo', {required: false, minLength: 10, maxLength: 20})}
              >
              </textarea>
            </label>
          </div>
        </div>
        <div className="user-info-edit__section user-info-edit__section--status">
          <h2 className="user-info-edit__title user-info-edit__title--status">Статус</h2>
          <div className="custom-toggle custom-toggle--switch user-info-edit__toggle">
            <label>
              <input
                type="checkbox"
                disabled={!isEditMode}
                {...register('individualTraining', {required: false})}
              />
              <span className="custom-toggle__icon">
                <svg width="9" height="6" aria-hidden="true">
                  <use xlinkHref="#arrow-check"></use>
                </svg>
              </span>
              <span className="custom-toggle__label">Готов тренировать</span>
            </label>
          </div>
        </div>
        <SpecialisationList
          trigger={trigger}
          register={register}
          isEditMode={isEditMode}
          types={Object.values(Specialisation)}
          selectedSpecs={selectedSpecs}
        />
        <div ref={locationBlockRef} className={`custom-select ${!isEditMode ? 'custom-select--readonly' : ''} user-info-edit__select`}>
          <span className="custom-select__label">Локация</span>
          <input className='visually-hidden location' {...register('location')} />
          <div className="custom-select__placeholder">{getValues('location')}</div>
          <button
            className="custom-select__button"
            type="button"
            aria-label="Выберите одну из опций"
            disabled={!isEditMode}
            onClick={onOpenLocationListBtnClickHandler}
          >
            <span className="custom-select__text"></span>
            <span className="custom-select__icon">
              <svg width="15" height="6" aria-hidden="true">
                <use xlinkHref="#arrow-down"></use>
              </svg>
            </span>
          </button>
          {DropDownList({items: Object.values(Location), clickItemHandler: onClickLocationItemHandler})}
        </div>
        <div ref={genderBlockRef} className={`custom-select ${!isEditMode ? 'custom-select--readonly' : ''} user-info-edit__select`}>
          <span className="custom-select__label">Пол</span>
          <input className='visually-hidden gender' {...register('gender')} />
          <div className="custom-select__placeholder">{GenderValueType[getValues('gender')]}</div>
          <button
            className="custom-select__button"
            type="button"
            aria-label="Выберите одну из опций"
            disabled={!isEditMode}
            onClick={onOpenGenderListBtnClickHandler}
          >
            <span className="custom-select__text"></span>
            <span className="custom-select__icon">
              <svg width="15" height="6" aria-hidden="true">
                <use xlinkHref="#arrow-down"></use>
              </svg>
            </span>
          </button>
          {DropDownList({items: Object.values(GenderValueType), clickItemHandler: onClickGenderItemHandler})}
        </div>
        <div ref={skillBlockRef} className={`custom-select ${!isEditMode ? 'custom-select--readonly' : ''} user-info-edit__select`}>
          <span className="custom-select__label">Уровень</span>
          <input className='visually-hidden gender' {...register('skillLevel')} />
          <div className="custom-select__placeholder">{SkillValueType[getValues('skillLevel')]}</div>
          <button
            className="custom-select__button"
            type="button"
            aria-label="Выберите одну из опций"
            disabled={!isEditMode}
            onClick={onOpenSkillListBtnClickHandler}
          >
            <span className="custom-select__text"></span>
            <span className="custom-select__icon">
              <svg width="15" height="6" aria-hidden="true">
                <use xlinkHref="#arrow-down"></use>
              </svg>
            </span>
          </button>
          {DropDownList({items: Object.values(SkillValueType), clickItemHandler: onClickSkillItemHandler})}
        </div>
      </form>
    </section>
  );
}
