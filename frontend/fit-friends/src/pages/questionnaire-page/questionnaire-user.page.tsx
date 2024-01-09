import { Fragment, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { SubmitHandler, useForm, useWatch } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { AppRoute } from 'src/app-constants';
import ErrorScreen from 'src/components/error-screen/error-screen';
import LoadingScreen from 'src/components/loading-components/loading-screen';
import SkillButtons from 'src/components/skill-buttons/skill-buttons';
import RegSpecialisationList from 'src/components/specialisation-list.tsx/reg-specialisation-list';
import trainingDurationButtons from 'src/components/training-duration-buttons/training-duration-buttons';
import { useAppDispatch, useAppSelector } from 'src/hooks';
import { createUserProfileAction } from 'src/store/api-actions';
import { getMyProfileInfo } from 'src/store/user-process/user-process.selectors';
import { SkillLevel, Specialisation, TrainingDuration } from 'src/types/constants';
import { QuestionnaireUserInputs } from 'src/types/forms.type';
import { caloriesIntakeValidationHandler, caloriesToBurnValidationHandler } from 'src/utils/validators/user/calories';


const questionnaireUserFieldPaths = {
  specialisations: 'specialisations',
  skillLevel: 'skillLevel',
  trainingDuration: 'trainingDuration',
  caloriesToBurn: 'caloriesToBurn',
  dailyCaloriesIntake: 'dailyCaloriesIntake'
} as const;


export default function QuestionnaireUserPage (): JSX.Element {

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const myProfile = useAppSelector(getMyProfileInfo);

  useEffect(() => {
    if (myProfile) {
      if (myProfile.userProfile) {
        navigate(AppRoute.Main, {replace: true});
      } else if (myProfile.trainerProfile) {
        navigate(AppRoute.Forbidden, {replace: true});
      }
    }
  }, [myProfile, navigate]);

  const {
    register,
    handleSubmit,
    formState,
    formState: {errors},
    control,
    trigger,
    clearErrors,
  } = useForm<QuestionnaireUserInputs>(
    {
      mode: 'onBlur',
      shouldFocusError: false,
      reValidateMode: 'onBlur',
      defaultValues: {
        specialisations: [],
        skillLevel: SkillLevel.Amateur,
        trainingDuration: TrainingDuration.FiftyToEightyMinutes
      }
    }
  );

  const selectedSpecs = useWatch<QuestionnaireUserInputs, 'specialisations'>({control, name: 'specialisations'});

  if (myProfile === undefined) {
    return <LoadingScreen/>;
  }

  if (myProfile === null) {
    return <ErrorScreen />;
  }

  const onInputFocusHandler = (inputName: keyof QuestionnaireUserInputs) => clearErrors(inputName);
  const onSubmitHandler: SubmitHandler<QuestionnaireUserInputs> = (formData) => {
    dispatch(createUserProfileAction(Object.assign(formData, {userId: myProfile.userId})));
  };

  return (
    <Fragment>
      <Helmet>
        <title>Опросник — Fit Friends</title>
      </Helmet>
      <div className="wrapper">
        <main>
          <div className="background-logo">
            <svg className="background-logo__logo" width="750" height="284" aria-hidden="true">
              <use xlinkHref="#logo-big"></use>
            </svg>
            <svg className="background-logo__icon" width="343" height="343" aria-hidden="true">
              <use xlinkHref="#icon-logotype"></use>
            </svg>
          </div>
          <div className="popup-form popup-form--questionnaire-user">
            <div className="popup-form__wrapper">
              <div className="popup-form__content">
                <div className="popup-form__form">
                  <form method="post" onSubmit={handleSubmit(onSubmitHandler)}>
                    <div className="questionnaire-user">
                      <h1 className="visually-hidden">Опросник</h1>
                      <div className="questionnaire-user__wrapper">
                        <div className="questionnaire-user__block">
                          {
                            RegSpecialisationList({
                              types: Object.values(Specialisation),
                              register,
                              trigger,
                              fieldPaths: questionnaireUserFieldPaths,
                              selectedSpecs
                            })
                          }
                          {errors.specialisations && <span style={{color: '#e4001b'}}>{errors.specialisations.message}</span>}
                        </div>
                        <div className="questionnaire-user__block">
                          {trainingDurationButtons({
                            durations: Object.values(TrainingDuration),
                            register
                          })}
                        </div>
                        <div className="questionnaire-user__block">
                          {SkillButtons({
                            skills: Object.values(SkillLevel),
                            register,
                            fieldPaths: questionnaireUserFieldPaths
                          })}
                        </div>
                        <div className="questionnaire-user__block">
                          <div className="questionnaire-user__calories-lose">
                            <span className="questionnaire-user__legend">Сколько калорий хотите сбросить</span>
                            <div className={`custom-input custom-input--with-text-right questionnaire-user__input ${errors.caloriesToBurn ? 'custom-input--error' : ''}`}>
                              <label>
                                <span className="custom-input__wrapper">
                                  <input
                                    type="number"
                                    data-testid="calories-to-burn"
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
                          </div>
                          <div className="questionnaire-user__calories-waste">
                            <span className="questionnaire-user__legend">Сколько калорий тратить в день</span>
                            <div className={`custom-input custom-input--with-text-right questionnaire-user__input ${errors.dailyCaloriesIntake ? 'custom-input--error' : ''}`}>
                              <label>
                                <span className="custom-input__wrapper">
                                  <input
                                    type="number"
                                    data-testid="calories-intake"
                                    {...register('dailyCaloriesIntake', {
                                      required: 'Поле обязательно для заполнения',
                                      validate: caloriesIntakeValidationHandler,
                                    })}
                                    onFocus={() => onInputFocusHandler('dailyCaloriesIntake')}
                                  />
                                  <span className="custom-input__text">ккал</span>
                                </span>
                                <span className="custom-input__error">{errors.dailyCaloriesIntake?.message}</span>
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                      <button
                        className="btn questionnaire-user__button"
                        type="submit"
                        disabled={!formState.isValid}
                      >
                        Продолжить
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </Fragment>
  );
}
