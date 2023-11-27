/* eslint-disable no-console */
import { ChangeEvent, Fragment, MouseEvent, useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Gender, Location, Role } from 'src/types/constants';
import { emailValidationHandler } from 'src/utils/validators/email';
import { nameValidationHandler } from 'src/utils/validators/name';
import { passwordValidationHandler } from 'src/utils/validators/password';
import dayjs from 'dayjs';
import DropDownList from 'src/components/location-list/location-list';
import { avatarValidationHandler } from 'src/utils/validators/avatar';
import { RegisterInputs } from 'src/types/forms.type';
import GenderButtons from 'src/components/gender-buttons/gender-buttons';
import RoleButtons from 'src/components/role-buttons/role-buttons';
import { registerAction } from 'src/store/api-actions';
import { useAppDispatch, useAppSelector } from 'src/hooks';
import { getFormErrors } from 'src/store/user-process/user-process.selectors';
import { HttpStatusCode } from 'src/services/server-api';
import { clearFormErrorsAction } from 'src/store/user-process/user-process.reducer';


const BIRTH_DAY_FORMAT = 'YYYY-MM-DD';

export default function RegistrationPage(): JSX.Element {
  const dispatch = useAppDispatch();
  const formErrors = useAppSelector(getFormErrors);
  const conflictError = formErrors[HttpStatusCode.CONFLICT];

  const [isAvatarUploaded, setAvatarUploaded] = useState(false);
  const [picture, setPicture] = useState('');

  const locationBlockRef = useRef<HTMLDivElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    clearErrors,
    formState,
    setValue,
    getValues,
    trigger,
    setError,
  } = useForm<RegisterInputs>(
    {
      mode: 'onBlur',
      shouldFocusError: false,
      reValidateMode: 'onBlur',
      defaultValues: {gender: Gender.Male, role: Role.Sportsman, agreement: true}
    }
  );

  const onSubmitHandler: SubmitHandler<RegisterInputs> = (formData) => {
    console.log(formData);
    dispatch(registerAction(formData));
  };
  const onInputFocusHandler = (inputName: keyof RegisterInputs) => {
    dispatch(clearFormErrorsAction());
    clearErrors(inputName);
  };
  const maxBirthDay = dayjs().format(BIRTH_DAY_FORMAT);
  const onClickLocationItemHandler = (evt: MouseEvent<HTMLUListElement>) => {
    const location = (evt.target as HTMLLIElement).textContent as Location;
    if (location) {
      setValue('location', location, {shouldValidate: true});
    }
    locationBlockRef.current?.classList.remove('is-open');
  };

  const onOpenLocationListBtnClickHandler = () => locationBlockRef.current?.classList.toggle('is-open');
  const onOpenLocationListBtnBlurHandler = () => {
    locationBlockRef.current?.classList.remove('is-open');
    setTimeout(() => {trigger('location');}, 100);
  };
  const onOpenLocationListBtnFocusHandler = () => clearErrors('location');
  const avatarChangeHandler = (evt: ChangeEvent<HTMLInputElement>) => {
    avatarValidationHandler(evt.target.files)
      .then((res) => {
        if (res === true && evt.target.files) {
          setAvatarUploaded(true);
          setPicture(URL.createObjectURL(evt.target.files[0]));
        } else {
          if (typeof res === 'string') {
            setError('avatar', {message: res});
          }
          setAvatarUploaded(false);
          setPicture('');
        }
      });
  };

  useEffect(() => {
    if (conflictError) {
      setError('email', {message: conflictError});
    }
  }, [conflictError, setError]);

  return (
    <Fragment>
      <Helmet>
        <title>Регистрация — Fit Friends</title>
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
          <div className="popup-form popup-form--sign-up">
            <div className="popup-form__wrapper">
              <div className="popup-form__content">
                <div className="popup-form__title-wrapper">
                  <h1 className="popup-form__title">Регистрация</h1>
                </div>
                <div className="popup-form__form">
                  <form method="post" onSubmit={handleSubmit(onSubmitHandler)}>
                    <div className="sign-up">
                      <div className="sign-up__load-photo">
                        <div className="input-load-avatar">
                          <label>
                            <input
                              className="visually-hidden"
                              type="file"
                              accept="image/png, image/jpeg"
                              {...register('avatar',
                                {
                                  required: true,
                                  onChange: avatarChangeHandler
                                }
                              )}
                            />
                            {
                              isAvatarUploaded && picture
                                ? (
                                  <span className="input-load-avatar__avatar" style={{overflow: 'auto'}}>
                                    <img src={picture} srcSet={picture} style={{height: '98px'}} width="98" height="98" alt="user avatar"/>
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
                        <div className="sign-up__description">
                          <h2 className="sign-up__legend">Загрузите фото профиля</h2>
                          <span className="sign-up__text">JPG, PNG, оптимальный размер 100&times;100&nbsp;px</span>
                          {errors.avatar && <span style={{fontSize: '0.9em', color: '#e4001b'}}>{errors.avatar.message}</span>}
                        </div>
                      </div>
                      <div className="sign-up__data">
                        <div className={`custom-input ${errors.name ? 'custom-input--error' : ''}`}>
                          <label>
                            <span className="custom-input__label">Имя</span>
                            <span className="custom-input__wrapper">
                              <input type="text"
                                {...register('name', {required: 'Поле обязательно для заполнения', validate: nameValidationHandler })}
                                onFocus={() => onInputFocusHandler('name')}
                              />
                            </span>
                            {errors.name && <span className="custom-input__error">{errors.name.message}</span>}
                          </label>
                        </div>
                        <div className={`custom-input ${errors.email ? 'custom-input--error' : ''}`}>
                          <label>
                            <span className="custom-input__label">E-mail</span>
                            <span className="custom-input__wrapper">
                              <input type="text"
                                {...register('email', {required: 'Поле обязательно для заполнения', validate: emailValidationHandler })}
                                onFocus={() => onInputFocusHandler('email')}
                              />
                            </span>
                            {errors.email && <span className="custom-input__error">{errors.email.message}</span>}
                          </label>
                        </div>
                        <div className={`custom-input ${errors.birthday ? 'custom-input--error' : ''}`}>
                          <label>
                            <span className="custom-input__label">Дата рождения</span>
                            <span className="custom-input__wrapper">
                              <input type="date"
                                {...register('birthday', {required: 'Поле обязательно для заполнения'})} max={maxBirthDay}
                                onFocus={() => onInputFocusHandler('birthday')}
                              />
                            </span>
                            {errors.birthday && <span className="custom-input__error">{errors.birthday.message}</span>}
                          </label>
                        </div>
                        <div
                          className={`custom-select ${!getValues('location') ? 'custom-select--not-selected' : ''} ${errors.location ? 'is-invalid' : ''}`}
                          ref={locationBlockRef}
                        >
                          <span className="custom-select__label">Ваша локация</span>
                          <input className='visually-hidden location' {...register('location', {required: 'Поле обязательно для заполнения'})} />
                          {getValues('location') ? <div className="custom-select__placeholder">{getValues('location')}</div> : ''}
                          <button
                            className="custom-select__button"
                            type="button" aria-label="Выберите одну из опций"
                            onClick={onOpenLocationListBtnClickHandler}
                            onBlur={onOpenLocationListBtnBlurHandler}
                            onFocus={onOpenLocationListBtnFocusHandler}
                          >
                            <span className="custom-select__text"></span>
                            <span className="custom-select__icon">
                              <svg width="15" height="6" aria-hidden="true">
                                <use xlinkHref="#arrow-down"></use>
                              </svg>
                            </span>
                          </button>
                          {DropDownList({items: Object.values(Location), clickItemHandler: onClickLocationItemHandler})}
                          {errors.location && <span className="custom-select__error">{errors.location.message}</span>}
                        </div>
                        <div className={`custom-input ${errors.password ? 'custom-input--error' : ''}`}>
                          <label>
                            <span className="custom-input__label">Пароль</span>
                            <span className="custom-input__wrapper">
                              <input type="password" autoComplete="off"
                                {...register('password',
                                  {
                                    required: 'Поле обязательно для заполнения',
                                    validate: passwordValidationHandler
                                  }
                                )}
                                onFocus={() => onInputFocusHandler('password')}
                              />
                            </span>
                            {errors.password && <span className="custom-input__error">{errors.password.message}</span>}
                          </label>
                        </div>
                        {GenderButtons({genders: Object.values(Gender), register})}
                      </div>
                      {RoleButtons({roles: Object.values(Role), register})}
                      <div className="sign-up__checkbox">
                        <label>
                          <input type="checkbox" {...register('agreement', {required: true})} />
                          <span className="sign-up__checkbox-icon">
                            <svg width="9" height="6" aria-hidden="true">
                              <use xlinkHref="#arrow-check"></use>
                            </svg>
                          </span>
                          <span className="sign-up__checkbox-label">
                            Я соглашаюсь с <span>политикой конфиденциальности</span> компании
                          </span>
                        </label>
                      </div>
                      <button
                        disabled={!formState.isValid || !isAvatarUploaded || formState.isSubmitting}
                        className="btn sign-up__button"
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


