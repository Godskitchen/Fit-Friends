/* eslint-disable no-console */
import { Fragment } from 'react';
import { Helmet } from 'react-helmet-async';
import { SubmitHandler, useForm } from 'react-hook-form';
import SkillUserButtons from 'src/components/skill-buttons/skill-user-buttons';
import SpecialisationUserList from 'src/components/specialisation-list.tsx/specialisation-user-list';
import trainingDurationButtons from 'src/components/training-duration-buttons/training-duration-buttons';
import { SkillLevel, Specialisation, TrainingDuration } from 'src/types/constants';
import { QuestionnaireUserInputs } from 'src/types/forms.type';
import { caloriesIntakeValidationHandler, caloriesToBurnValidationHandler } from 'src/utils/validators/calories';

export default function QuestionnaireUserPage (): JSX.Element {

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

  const onInputFocusHandler = (inputName: keyof QuestionnaireUserInputs) => clearErrors(inputName);
  const onSubmitHandler: SubmitHandler<QuestionnaireUserInputs> = (formData) => console.log(formData);

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
                          {SpecialisationUserList({
                            types: Object.values(Specialisation),
                            register,
                            control,
                            trigger,
                          })}
                          {errors.specialisations && <span style={{color: '#e4001b'}}>{errors.specialisations.message}</span>}
                        </div>
                        <div className="questionnaire-user__block">
                          {trainingDurationButtons({
                            durations: Object.values(TrainingDuration),
                            register
                          })}
                        </div>
                        <div className="questionnaire-user__block">
                          {SkillUserButtons({
                            skills: Object.values(SkillLevel),
                            register,
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
                                    {...register('caloriesToBurn', {
                                      required: 'Поле обязательно для заполнения',
                                      validate: caloriesToBurnValidationHandler,
                                    })}
                                    onFocus={() => onInputFocusHandler('caloriesToBurn')}
                                  />
                                  <span className="custom-input__text">ккал</span>
                                </span>
                              </label>
                            </div>
                          </div>
                          {errors.caloriesToBurn && <span style={{color: '#e4001b'}}>{errors.caloriesToBurn.message}</span>}
                          <div className="questionnaire-user__calories-waste">
                            <span className="questionnaire-user__legend">Сколько калорий тратить в день</span>
                            <div className="custom-input custom-input--with-text-right questionnaire-user__input">
                              <label>
                                <span className="custom-input__wrapper">
                                  <input
                                    type="number"
                                    {...register('dailyCaloriesIntake', {
                                      required: 'Поле обязательно для заполнения',
                                      validate: caloriesIntakeValidationHandler,
                                    })}
                                    onFocus={() => onInputFocusHandler('dailyCaloriesIntake')}
                                  />
                                  <span className="custom-input__text">ккал</span>
                                </span>
                              </label>
                            </div>
                          </div>
                          {errors.dailyCaloriesIntake && <span style={{color: '#e4001b'}}>{errors.dailyCaloriesIntake.message}</span>}
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
