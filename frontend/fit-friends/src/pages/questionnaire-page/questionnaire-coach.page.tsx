/* eslint-disable no-console */
import { Fragment, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { SubmitHandler, useForm } from 'react-hook-form';
import SkillCoachButtons from 'src/components/skill-buttons/skill-coach-buttons';
import SpecialisationCoachList from 'src/components/specialisation-list.tsx/specialisation-coach-list';
import { SkillLevel, Specialisation } from 'src/types/constants';
import { QuestionnaireCoachInputs } from 'src/types/forms.type';
import { certificateValidationHandler } from 'src/utils/validators/certificate';
import { descriptionValidationHandler } from 'src/utils/validators/description';


export default function QuestionnaireCoachPage (): JSX.Element {

  const [isCertificateUploaded, setCertificateUploaded] = useState(false);

  const {
    register,
    handleSubmit,
    formState,
    formState: {errors},
    control,
    trigger,
    watch,
    clearErrors,
  } = useForm<QuestionnaireCoachInputs>(
    {
      mode: 'onBlur',
      shouldFocusError: false,
      reValidateMode: 'onBlur',
      defaultValues: {
        specialisations: [],
        skillLevel: SkillLevel.Amateur,
        individualTraining: false
      }
    }
  );

  const uploadedCertificate = watch('certificates');
  const onInputFocusHandler = (inputName: keyof QuestionnaireCoachInputs) => clearErrors(inputName);
  const onSubmitHandler: SubmitHandler<QuestionnaireCoachInputs> = (formData) => console.log(formData);

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
          <div className="popup-form popup-form--questionnaire-coach">
            <div className="popup-form__wrapper">
              <div className="popup-form__content">
                <div className="popup-form__form">
                  <form method="post" onSubmit={handleSubmit(onSubmitHandler)}>
                    <div className="questionnaire-coach">
                      <h1 className="visually-hidden">Опросник</h1>
                      <div className="questionnaire-coach__wrapper">
                        <div className="questionnaire-coach__block">
                          {SpecialisationCoachList({
                            types: Object.values(Specialisation),
                            register,
                            control,
                            trigger
                          })}
                          {errors.specialisations && <span style={{color: '#e4001b'}}>{errors.specialisations.message}</span>}
                        </div>
                        <div className="questionnaire-coach__block">
                          {SkillCoachButtons({
                            skills: Object.values(SkillLevel),
                            register
                          })}
                        </div>
                        <div className="questionnaire-coach__block">
                          <span className="questionnaire-coach__legend">Ваши дипломы и сертификаты</span>
                          <div className="drag-and-drop questionnaire-coach__drag-and-drop">
                            <label>
                              <span className="drag-and-drop__label" style={{border: `${errors.certificates && errors.certificates.message ? '1px solid #e4001b' : ''}`}} tabIndex={0}>
                                {!isCertificateUploaded ? 'Загрузите сюда файл формата PDF' : uploadedCertificate[0].name}
                                <svg width="20" height="20" aria-hidden="true">
                                  <use xlinkHref="#icon-import"></use>
                                </svg>
                              </span>
                              <input
                                type="file"
                                tabIndex={-1}
                                accept=".pdf"
                                {...register('certificates',
                                  {
                                    validate: (files) => certificateValidationHandler(files, setCertificateUploaded),
                                    onChange: () => {trigger('certificates');},
                                  }
                                )}
                              />
                            </label>
                          </div>
                          {errors.certificates && errors.certificates.message && <span style={{color: '#e4001b'}}>{errors.certificates.message}</span>}
                        </div>
                        <div className="questionnaire-coach__block">
                          <span className="questionnaire-coach__legend">Расскажите о своём опыте, который мы сможем проверить</span>
                          <div className="custom-textarea questionnaire-coach__textarea">
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
                            </label>
                          </div>
                          {errors.description && <span style={{color: '#e4001b'}}>{errors.description.message}</span>}
                          <div className="questionnaire-coach__checkbox">
                            <label>
                              <input type="checkbox" {...register('individualTraining')} />
                              <span className="questionnaire-coach__checkbox-icon">
                                <svg width="9" height="6" aria-hidden="true">
                                  <use xlinkHref="#arrow-check"></use>
                                </svg>
                              </span>
                              <span className="questionnaire-coach__checkbox-label">
                                Хочу дополнительно индивидуально тренировать
                              </span>
                            </label>
                          </div>
                        </div>
                      </div>
                      <button
                        disabled={!formState.isValid}
                        className="btn questionnaire-coach__button"
                        type="submit"
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

