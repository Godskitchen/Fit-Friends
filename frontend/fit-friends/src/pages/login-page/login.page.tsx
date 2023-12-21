import { Fragment, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useForm, SubmitHandler } from 'react-hook-form';
import BlockUI from 'src/components/block-UI/block-UI';
import { useAppDispatch, useAppSelector } from 'src/hooks';
import { HttpStatusCode } from 'src/services/server-api';
import { loginAction } from 'src/store/api-actions';
import { getDataUploadingStatus } from 'src/store/app-data/app-data.selectors';
import { clearFormErrorsAction } from 'src/store/user-process/user-process.reducer';
import { getFormErrors } from 'src/store/user-process/user-process.selectors';
import { LoginInputs } from 'src/types/forms.type';
import { emailValidationHandler } from 'src/utils/validators/user/email';
import { passwordValidationHandler } from 'src/utils/validators/user/password';


export default function LoginPage(): JSX.Element {

  const dispatch = useAppDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
    clearErrors,
    formState,
    setError
  } = useForm<LoginInputs>({mode: 'onBlur', shouldFocusError: false, reValidateMode: 'onBlur'});

  const onSubmitHandler: SubmitHandler<LoginInputs> = (formData) => {
    dispatch(loginAction(formData));
  };

  const onInputFocusHandler = (inputName: keyof LoginInputs) => {
    dispatch(clearFormErrorsAction());
    clearErrors(inputName);
  };

  const formErrors = useAppSelector(getFormErrors);
  const loginError = formErrors[HttpStatusCode.UNAUTHORIZED];
  const isDataUploading = useAppSelector(getDataUploadingStatus);

  useEffect(() => {
    if (loginError) {
      setError('email', {message: loginError});
      setError('password', {message: loginError});
    }
  }, [loginError, setError]);

  return (
    <Fragment>
      <Helmet>
        <title>Войти — Fit Friends</title>
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
          <div className="popup-form popup-form--sign-in">
            <div className="popup-form__wrapper">
              <div className="popup-form__content">
                {isDataUploading && <BlockUI />}
                <div className="popup-form__title-wrapper">
                  <h1 className="popup-form__title">Вход</h1>
                </div>
                <div className="popup-form__form">
                  <form onSubmit={handleSubmit(onSubmitHandler)} method="post">
                    <div className="sign-in">
                      <div className={`custom-input sign-in__input ${errors.email ? 'custom-input--error' : ''}`}>
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
                      <div className={`custom-input sign-in__input ${errors.password ? 'custom-input--error' : ''}`}>
                        <label>
                          <span className="custom-input__label">Пароль</span>
                          <span className="custom-input__wrapper">
                            <input type="password"
                              {...register('password', {required: 'Поле обязательно для заполнения', validate: passwordValidationHandler })}
                              onFocus={() => onInputFocusHandler('password')}
                            />
                          </span>
                          {errors.password && <span className="custom-input__error">{errors.password.message}</span>}
                        </label>
                      </div>
                      <button disabled={!formState.isValid} className="btn sign-in__button" type="submit">Продолжить</button>
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
