import { Fragment, useRef, MouseEvent, useState, ChangeEvent, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { SubmitHandler, useForm } from 'react-hook-form';
import TrainingGenderButtons from 'src/components/radio-buttons/training-gender-buttons';
import Header from 'src/components/header/header';
import DropDownList from 'src/components/dropdown-list/dropdown-list';
import { DurationFieldToValueConvert,
  DurationFieldValue,
  Gender,
  HeaderNavTab,
  Role,
  SkillFieldToValueConvert,
  SkillFieldValue,
  SpecialisationFieldToValueConvert,
  SpecialisationFieldValue } from 'src/types/constants';
import { CreateTrainingInputs } from 'src/types/forms.type';
import { caloriesToBurnValidationHandler } from 'src/utils/validators/training/calories';
import { descriptionValidationHandler } from 'src/utils/validators/training/description';
import { priceValidationHandler } from 'src/utils/validators/training/price';
import { titleValidationHandler } from 'src/utils/validators/training/title';
import { trainingVideoValidationHandler } from 'src/utils/validators/training/training-video';
import BlockUI from 'src/components/block-UI/block-UI';
import { useAppDispatch, useAppSelector } from 'src/hooks';
import { createTrainingAction } from 'src/store/api-actions';
import { getDataUploadingStatus } from 'src/store/app-data/app-data.selectors';
import { useNavigate } from 'react-router-dom';
import { getMyProfileInfo } from 'src/store/user-process/user-process.selectors';
import LoadingScreen from 'src/components/loading-components/loading-screen';
import { AppRoute } from 'src/app-constants';
import ErrorScreen from 'src/components/error-screen/error-screen';


export default function CreateTrainingPage(): JSX.Element {

  const myProfile = useAppSelector(getMyProfileInfo);
  const navigate = useNavigate();


  useEffect(() => {
    if (myProfile) {
      if (myProfile.role === Role.Trainer && !myProfile.trainerProfile) {
        navigate(AppRoute.QuestionnaireCoach, {replace: true});
      } else if (myProfile.role === Role.User && !myProfile.userProfile) {
        navigate(AppRoute.QuestionnaireUser, {replace: true});
      } else if (myProfile.role === Role.User) {
        navigate(AppRoute.Forbidden, {replace: true});
      }
    }
  }, [myProfile, navigate]);

  const dispatch = useAppDispatch();
  const specialisationBlockRef = useRef<HTMLDivElement>(null);
  const durationBlockRef = useRef<HTMLDivElement>(null);
  const skillLevelBlockRef = useRef<HTMLDivElement>(null);

  const [isVideoUploaded, setVideoUploaded] = useState(false);
  const [isVideoUploading, setVideoUploading] = useState(false);

  const isDataUploading = useAppSelector(getDataUploadingStatus);

  const trainingVideoChangeHandler = (evt: ChangeEvent<HTMLInputElement>) => {
    setVideoUploading(true);
    trainingVideoValidationHandler(evt.target.files)
      .then((res) => {
        if (res === true && evt.target.files) {
          setVideoUploaded(true);
          trigger('trainingVideo');
        } else {
          if (typeof res === 'string') {
            setError('trainingVideo', {message: res});
          }
          setVideoUploaded(false);
        }
      })
      .finally(() => {setVideoUploading(false);});
  };

  const {
    register,
    handleSubmit,
    formState,
    formState: {errors},
    trigger,
    setError,
    clearErrors,
    getValues,
    setValue,
  } = useForm<CreateTrainingInputs>(
    {
      mode: 'onBlur',
      shouldFocusError: false,
      reValidateMode: 'onBlur',
      defaultValues: { gender: Gender.NoMatter }
    }
  );

  const onOpenSpecialisationListBtnClickHandler = () => specialisationBlockRef.current?.classList.toggle('is-open');
  const onOpenDurationListBtnClickHandler = () => durationBlockRef.current?.classList.toggle('is-open');
  const onOpenSkillLevelListBtnClickHandler = () => skillLevelBlockRef.current?.classList.toggle('is-open');

  const onOpenSpecialisationListBtnBlurHandler = () => {
    specialisationBlockRef.current?.classList.remove('is-open');
    setTimeout(() => {trigger('specialisation');}, 100);
  };

  const onOpenDurationListBtnBlurHandler = () => {
    durationBlockRef.current?.classList.remove('is-open');
    setTimeout(() => {trigger('trainingDuration');}, 100);
  };

  const onOpenSkillLevelListBtnBlurHandler = () => {
    skillLevelBlockRef.current?.classList.remove('is-open');
    setTimeout(() => {trigger('skillLevel');}, 100);
  };


  const onOpenSpecialisationListBtnFocusHandler = () => clearErrors('specialisation');
  const onOpenDurationListBtnFocusHandler = () => clearErrors('trainingDuration');
  const onOpenSkillLevelListBtnFocusHandler = () => clearErrors('skillLevel');

  const onClickSpecialisationItemHandler = (evt: MouseEvent<HTMLUListElement>) => {
    const specialisation = (evt.target as HTMLLIElement).textContent as keyof typeof SpecialisationFieldToValueConvert;
    setValue('specialisation', SpecialisationFieldToValueConvert[specialisation], {shouldValidate: true});
    specialisationBlockRef.current?.classList.remove('is-open');
  };

  const onClickDurationItemHandler = (evt: MouseEvent<HTMLUListElement>) => {
    const duration = (evt.target as HTMLLIElement).textContent as keyof typeof DurationFieldToValueConvert;
    setValue('trainingDuration', DurationFieldToValueConvert[duration] , {shouldValidate: true});
    durationBlockRef.current?.classList.remove('is-open');
  };

  const onClickSkillLevelItemHandler = (evt: MouseEvent<HTMLUListElement>) => {
    const skillLevel = (evt.target as HTMLLIElement).textContent as keyof typeof SkillFieldToValueConvert;
    setValue('skillLevel', SkillFieldToValueConvert[skillLevel] , {shouldValidate: true});
    skillLevelBlockRef.current?.classList.remove('is-open');
  };

  const onSubmitHandler: SubmitHandler<CreateTrainingInputs> = (formData) => {
    dispatch(createTrainingAction(formData));
  };

  const onInputFocusHandler = (inputName: keyof CreateTrainingInputs) => {
    clearErrors(inputName);
  };

  if (myProfile === null) {
    return <ErrorScreen />;
  }

  if (myProfile === undefined || myProfile.userProfile === undefined) {
    return <LoadingScreen />;
  }

  return (
    <Fragment>
      <Helmet>
        <title>Создать тренировку — FitFriends</title>
      </Helmet>
      <div className="wrapper">
        <Header activeTab={HeaderNavTab.Home} />
        <main>
          <div className="popup-form popup-form--create-training">
            <div className="popup-form__wrapper">
              <div className="popup-form__content">
                <div className="popup-form__title-wrapper">
                  <h1 className="popup-form__title">Создание тренировки</h1>
                </div>
                <div className="popup-form__form">
                  <form method="post" onSubmit={handleSubmit(onSubmitHandler)}>
                    <div className="create-training">
                      <div className="create-training__wrapper">
                        <div className="create-training__block">
                          <h2 className="create-training__legend">Название тренировки</h2>
                          <div className={`custom-input create-training__input ${errors.title ? 'custom-input--error' : ''}`}>
                            <label>
                              <span className="custom-input__wrapper">
                                <input type="text"
                                  {...register('title', {required: 'Поле обязательно для заполнения', validate: titleValidationHandler})}
                                  onFocus={() => onInputFocusHandler('title')}
                                />
                              </span>
                              <span className="custom-input__error">{errors.title?.message}</span>
                            </label>
                          </div>
                        </div>
                        <div className="create-training__block">
                          <h2 className="create-training__legend">Характеристики тренировки</h2>
                          <div className="create-training__info">
                            <div
                              className={`custom-select ${!getValues('specialisation') ? 'custom-select--not-selected' : ''} ${errors.specialisation ? 'is-invalid' : ''}`}
                              ref={specialisationBlockRef}
                            >
                              <span className="custom-select__label">Выберите тип тренировки</span>
                              {getValues('specialisation') && <div className="custom-select__placeholder" style={{bottom: '0px', top: '42px'}}>{SpecialisationFieldValue[getValues('specialisation')]}</div>}
                              <input className="visually-hidden specialisation" {...register('specialisation', {required: 'Поле обязательно для заполнения'})} />
                              <button
                                className="custom-select__button"
                                type="button" aria-label="Выберите одну из опций"
                                onClick={onOpenSpecialisationListBtnClickHandler}
                                onBlur={onOpenSpecialisationListBtnBlurHandler}
                                onFocus={onOpenSpecialisationListBtnFocusHandler}
                              >
                                <span className="custom-select__text"></span>
                                <span className="custom-select__icon">
                                  <svg width="15" height="6" aria-hidden="true">
                                    <use xlinkHref="#arrow-down"></use>
                                  </svg>
                                </span>
                              </button>
                              <span className="custom-select__error" style={{bottom: '0px', top: '85px'}}>{errors.specialisation?.message}</span>
                              {DropDownList({items: Object.values(SpecialisationFieldValue), clickItemHandler: onClickSpecialisationItemHandler})}
                            </div>
                            <div className={`custom-input custom-input--with-text-right ${errors.caloriesToBurn ? 'custom-input--error' : ''}`}>
                              <label>
                                <span className="custom-input__label">Сколько калорий потратим</span>
                                <span className="custom-input__wrapper">
                                  <input
                                    type="number"
                                    {...register('caloriesToBurn', {
                                      required: 'Поле обязательно для заполнения',
                                      validate: caloriesToBurnValidationHandler,
                                    })}
                                    onFocus={() => onInputFocusHandler('caloriesToBurn')}
                                  />
                                  <span className="custom-input__text">ккал</span>
                                </span>
                                <span className="custom-input__error">{errors.caloriesToBurn?.message}</span>
                              </label>
                            </div>
                            <div
                              className={`custom-select ${!getValues('trainingDuration') ? 'custom-select--not-selected' : ''} ${errors.trainingDuration ? 'is-invalid' : ''}`}
                              ref={durationBlockRef}
                            >
                              <span className="custom-select__label">Сколько времени потратим</span>
                              {getValues('trainingDuration') && <div className="custom-select__placeholder" style={{bottom: '0px', top: '42px'}}>{DurationFieldValue[getValues('trainingDuration')]}</div>}
                              <input className="visually-hidden training-duration" {...register('trainingDuration', {required: 'Поле обязательно для заполнения'})} />
                              <button
                                className="custom-select__button"
                                type="button" aria-label="Выберите одну из опций"
                                onClick={onOpenDurationListBtnClickHandler}
                                onBlur={onOpenDurationListBtnBlurHandler}
                                onFocus={onOpenDurationListBtnFocusHandler}
                              >
                                <span className="custom-select__text"></span>
                                <span className="custom-select__icon">
                                  <svg width="15" height="6" aria-hidden="true">
                                    <use xlinkHref="#arrow-down"></use>
                                  </svg>
                                </span>
                              </button>
                              <span className="custom-select__error" style={{bottom: '0px', top: '85px'}}>{errors.trainingDuration?.message}</span>
                              {DropDownList({items: Object.values(DurationFieldValue), clickItemHandler: onClickDurationItemHandler})}
                            </div>
                            <div className={`custom-input custom-input--with-text-right ${errors.price ? 'custom-input--error' : ''}`}>
                              <label>
                                <span className="custom-input__label">Стоимость тренировки</span>
                                <span className="custom-input__wrapper">
                                  <input
                                    type="number"
                                    {...register('price', {
                                      required: 'Поле обязательно для заполнения',
                                      validate: priceValidationHandler,
                                    })}
                                    onFocus={() => onInputFocusHandler('price')}
                                  />
                                  <span className="custom-input__text">₽</span>
                                </span>
                                <span className="custom-input__error">{errors.price?.message}</span>
                              </label>
                            </div>
                            <div
                              className={`custom-select ${!getValues('skillLevel') ? 'custom-select--not-selected' : ''} ${errors.skillLevel ? 'is-invalid' : ''}`}
                              ref={skillLevelBlockRef}
                            >
                              <span className="custom-select__label">Выберите уровень тренировки</span>
                              {getValues('skillLevel') && <div className="custom-select__placeholder" style={{bottom: '0px', top: '42px'}}>{SkillFieldValue[getValues('skillLevel')]}</div>}
                              <input className="visually-hidden training-duration" {...register('skillLevel', {required: 'Поле обязательно для заполнения'})} />
                              <button
                                className="custom-select__button"
                                type="button" aria-label="Выберите одну из опций"
                                onClick={onOpenSkillLevelListBtnClickHandler}
                                onBlur={onOpenSkillLevelListBtnBlurHandler}
                                onFocus={onOpenSkillLevelListBtnFocusHandler}
                              >
                                <span className="custom-select__text"></span>
                                <span className="custom-select__icon">
                                  <svg width="15" height="6" aria-hidden="true">
                                    <use xlinkHref="#arrow-down"></use>
                                  </svg>
                                </span>
                              </button>
                              <span className="custom-select__error" style={{bottom: '0px', top: '85px'}}>{errors.skillLevel?.message}</span>
                              {DropDownList({items: Object.values(SkillFieldValue), clickItemHandler: onClickSkillLevelItemHandler})}
                            </div>
                            <TrainingGenderButtons register={register} />
                          </div>
                        </div>
                        <div className="create-training__block">
                          <h2 className="create-training__legend">Описание тренировки</h2>
                          <div className={`custom-textarea create-training__textarea ${errors.description ? 'custom-textarea--error' : ''}`}>
                            <label>
                              <textarea
                                style={errors.description ? {border: '1px solid #e4001b', backgroundColor: 'transparent'} : {}}
                                placeholder=" "
                                {...register('description', {
                                  required: 'Поле обязательно для заполнения',
                                  validate: descriptionValidationHandler
                                })}
                                onFocus={() => onInputFocusHandler('description')}
                              >
                              </textarea>
                              <span className='custom-textarea__error'>{errors.description?.message}</span>
                            </label>
                          </div>
                        </div>
                        <div className="create-training__block" style={{position: 'relative'}}>
                          {isVideoUploading && <BlockUI />}
                          <h2 className="create-training__legend">Загрузите видео-тренировку</h2>
                          <div className="drag-and-drop create-training__drag-and-drop">
                            <label>
                              <span className="drag-and-drop__label" style={{border: `${errors.trainingVideo ? '1px solid #e4001b' : ''}`}} tabIndex={0}>
                                {!isVideoUploaded || !getValues('trainingVideo').length ? 'Загрузите сюда файлы формата MOV или MP4' : getValues('trainingVideo')[0].name}
                                <svg width="20" height="20" aria-hidden="true">
                                  <use xlinkHref="#icon-import-video"></use>
                                </svg>
                              </span>
                              <input
                                type="file"
                                tabIndex={-1}
                                accept=".mov, .mp4"
                                {...register('trainingVideo',
                                  {
                                    required: true,
                                    onChange: trainingVideoChangeHandler,
                                  }
                                )}
                              />
                            </label>
                          </div>
                          {errors?.trainingVideo?.message && <span style={{color: '#e4001b'}}>{errors.trainingVideo.message}</span>}
                        </div>
                      </div>
                      <button
                        disabled={
                          !formState.isValid
                          || formState.isSubmitting
                          || isVideoUploading
                          || !isVideoUploaded
                        }
                        className="btn create-training__button"
                        type="submit"
                      >
                        Опубликовать
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </main>

        {isDataUploading ? <BlockUI /> : ''}
      </div>
    </Fragment>
  );
}
