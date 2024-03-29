import { Fragment, useEffect, useState, FocusEvent, ChangeEvent, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from 'src/hooks';
import { getDataUploadingStatus, getNetworkError, getTrainingInfo, getTrainingsDownloadingStatus } from 'src/store/app-data/app-data.selectors';
import LoadingScreen from '../../components/loading-components/loading-screen';
import NotFoundPage from 'src/pages/not-found-page/not-found.page';
import { getTrainingAmountAction, getTrainingDetailsAction, updateTrainingAction } from 'src/store/api-actions';
import Header from '../../components/header/header';
import { DurationHashTagValue, GenderHashTagValue, HeaderNavTab, Role, SpecialisationHashTagValue } from 'src/types/constants';
import { Helmet } from 'react-helmet-async';
import ReviewsSideBar from '../../components/reviews-side-bar/reviews-side-bar';
import { SubmitHandler, useForm } from 'react-hook-form';
import {UpdateTrainingInputs } from 'src/types/forms.type';
import { titleValidationHandler } from 'src/utils/validators/training/title';
import { descriptionValidationHandler } from 'src/utils/validators/training/description';
import TrainingVideoSection from '../../components/training-video-section/video-section';
import { priceStringValidationHandler } from 'src/utils/validators/training/price';
import { getMyProfileInfo, getTrainingAmount } from 'src/store/user-process/user-process.selectors';
import PurchaseModal from 'src/components/purchase-modal/purchase-modal';
import { AppRoute } from 'src/app-constants';
import ErrorScreen from 'src/components/error-screen/error-screen';


export default function TrainingPage(): JSX.Element {
  const { trainingId } = useParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [isEditMode, setEditMode] = useState(false);
  const [currentPrice, setCurrentPrice] = useState<string>('');
  const [currentDiscountPrice, setCurrentDiscountPrice] = useState<string>('');
  const [priceError, setPriceError] = useState<string>('');
  const [isDiscount, setDiscount] = useState<boolean>();

  const [isModalOpen, setModalOpen] = useState<boolean>(false);

  const [isLoadVideoMode, setLoadVideoMode] = useState<boolean>(false);

  const closeModalBtnRef = useRef<HTMLButtonElement | null>(null);
  const purchaseBtnRef = useRef<HTMLButtonElement | null>(null);

  const openModal = () => {
    setModalOpen(true);
    document.body.classList.add('scroll-lock');
    setTimeout(() => {closeModalBtnRef.current?.focus();}, 100);
  };

  const closeModal = () => {
    setModalOpen(false);
    document.body.classList.remove('scroll-lock');
    setTimeout(() => {purchaseBtnRef.current?.focus();}, 100);
  };

  const {
    register,
    formState: {errors, isValid, isSubmitting},
    getValues,
    setValue,
  } = useForm<UpdateTrainingInputs>(
    {
      mode: 'onChange',
      shouldFocusError: false,
      reValidateMode: 'onChange',
    }
  );

  useEffect(() => {
    if (trainingId) {
      dispatch(getTrainingDetailsAction(trainingId));
    }

  }, [trainingId, dispatch]);

  const training = useAppSelector(getTrainingInfo);
  const isTrainingLoading = useAppSelector(getTrainingsDownloadingStatus);
  const isDataUploading = useAppSelector(getDataUploadingStatus);
  const myProfile = useAppSelector(getMyProfileInfo);
  const trainingAmount = useAppSelector(getTrainingAmount);

  const isNetworkError = useAppSelector(getNetworkError);

  useEffect(() => {
    if (myProfile && training) {
      if (myProfile.role === Role.Trainer && !myProfile.trainerProfile) {
        navigate(AppRoute.QuestionnaireCoach, {replace: true});
      } else if (myProfile.role === Role.User && !myProfile.userProfile) {
        navigate(AppRoute.QuestionnaireUser, {replace: true});
      } else if (myProfile.role === Role.Trainer && myProfile.userId !== training.trainer.userId) {
        navigate(AppRoute.Forbidden, {replace: true});
      }
    }
  }, [myProfile, navigate, training]);

  useEffect(() => {
    if (training) {
      const price = training.price;
      const discountPrice = Number((training.price - (training.price * 0.1)).toFixed());
      setCurrentPrice(`${price} ₽`);
      setCurrentDiscountPrice(`${discountPrice} ₽`);
      setDiscount(training.isSpecialOffer);
      if (myProfile && myProfile.role === Role.User) {
        dispatch(getTrainingAmountAction(training.trainingId));
      }
    }

  }, [dispatch, myProfile, training]);


  if (training === undefined || isTrainingLoading || !myProfile) {
    return <LoadingScreen />;
  }

  if (training === null || !trainingId) {
    if (isNetworkError) {
      return <ErrorScreen />;
    }
    return <NotFoundPage />;
  }

  const {name, avatar} = training.trainer;

  const onPriceInputBlurHandle = ({target}: FocusEvent<HTMLInputElement, Element>) => {
    if (target.value.trim() && (target.value.trim().split(' ').length === 1 && target.value.trim() !== '₽')) {
      setCurrentPrice(`${target.value.trim()} ₽`);
    }
  };

  const onSubmitHandler: SubmitHandler<UpdateTrainingInputs> = (formData) => {
    const formPrice = +currentPrice.split(' ')[0];
    const sendData: Partial<UpdateTrainingInputs> = {
      title: formData.title !== training.title ? formData.title : undefined,
      description: formData.description !== training.description ? formData.description : undefined,
      isSpecialOffer: formData.isSpecialOffer !== training.isSpecialOffer ? formData.isSpecialOffer : undefined,
      price: formPrice !== training.price ? formPrice : undefined,
    };

    let isTrainingUpdated = false;

    for (const value of Object.values(sendData)) {
      if (value !== undefined) {
        isTrainingUpdated = true;
        break;
      }
    }

    if (isTrainingUpdated) {
      dispatch(updateTrainingAction(Object.assign(
        sendData, {trainingId: training.trainingId}
      )));
    }
  };

  const onPriceInputChangeHandler = ({target}: ChangeEvent<HTMLInputElement>) => {
    setDiscount(false);
    setCurrentPrice(target.value);
    const validationResult = priceStringValidationHandler(target.value);
    if (validationResult === true) {
      setPriceError('');
    } else {
      setPriceError(validationResult);
    }
  };

  const onDiscountBtnCLickHandle = () => {
    const [priceVal] = currentPrice.split(' ');
    const newDiscountPrice = `${Number((+priceVal - (+priceVal * 0.1)).toFixed())} ₽`;
    setCurrentDiscountPrice(newDiscountPrice);
    setDiscount(!isDiscount);
    setValue('isSpecialOffer', !isDiscount);
  };

  return (
    <Fragment>
      <Helmet>
        <title>Карточка тренировки — FitFriends</title>
      </Helmet>
      <div className="wrapper">
        <Header activeTab={HeaderNavTab.Home}/>
        <main>
          <section className="inner-page">
            <div className="container">
              <div className="inner-page__wrapper">
                <h1 className="visually-hidden">Карточка тренировки</h1>
                <ReviewsSideBar
                  trainingId={training.trainingId}
                  myRole={myProfile.role}
                  trainingAmount={trainingAmount}
                />
                <div className={`training-card ${isEditMode ? 'training-card--edit' : ''}`}>
                  <div className="training-info">
                    <h2 className="visually-hidden">Информация о тренировке</h2>
                    <div className="training-info__header">
                      <div className="training-info__coach">
                        <div className="training-info__photo">
                          <picture>
                            <img src={avatar} width="64" height="64" alt="Изображение тренера" />
                          </picture>
                        </div>
                        <div className="training-info__coach-info">
                          <span className="training-info__label">Тренер</span>
                          <span className="training-info__name">{name}</span>
                        </div>
                      </div>
                      {myProfile.role === Role.Trainer && isEditMode && (
                        <button
                          className="btn-flat btn-flat--light btn-flat--underlined training-info__edit training-info__edit--save"
                          type="button"
                          onClick={() => {
                            setEditMode(false);
                            onSubmitHandler(getValues());
                            setLoadVideoMode(false);
                          }}
                          disabled={!isEditMode || !isValid || isSubmitting || priceError !== '' || isDataUploading}
                        >
                          <svg width="12" height="12" aria-hidden="true">
                            <use xlinkHref="#icon-edit"></use>
                          </svg>
                          <span>Сохранить</span>
                        </button>
                      )}
                      {myProfile.role === Role.Trainer && !isEditMode && (
                        <button
                          className="btn-flat btn-flat--light training-info__edit training-info__edit--edit"
                          type="button"
                          onClick={() => {setEditMode(true);}}
                        >
                          <svg width="12" height="12" aria-hidden="true">
                            <use xlinkHref="#icon-edit"></use>
                          </svg>
                          <span>Редактировать</span>
                        </button>
                      )}
                    </div>
                    <div className="training-info__main-content">
                      <form>
                        <div className="training-info__form-wrapper">
                          <div className="training-info__info-wrapper">
                            <div className={`training-info__input training-info__input--training ${errors.title ? 'is-invalid' : ''}`}>
                              <label>
                                <span className="training-info__label">Название тренировки</span>
                                <input
                                  type="text"
                                  disabled={!isEditMode}
                                  {...register('title', {
                                    value: training.title,
                                    required: 'Поле обязательно для заполнения',
                                    validate: titleValidationHandler,
                                  })}
                                />
                              </label>
                              <div className="training-info__error">{errors.title?.message}</div>
                            </div>
                            <div className="training-info__textarea" style={{position: 'relative'}}>
                              <label>
                                <span className="training-info__label">Описание тренировки</span>
                                <textarea
                                  style={errors.description ? {border: '1px solid #ff3e49'} : {}}
                                  disabled={!isEditMode}
                                  {...register('description', {
                                    value: training.description,
                                    required: 'Поле обязательно для заполнения',
                                    validate: descriptionValidationHandler,
                                  })}
                                >
                                </textarea>
                              </label>
                              {errors.description && <div className="training-info__error" style={{opacity: '1'}}>{errors.description?.message}</div>}
                            </div>
                          </div>
                          <div className="training-info__rating-wrapper">
                            <div className="training-info__input training-info__input--rating">
                              <label>
                                <span className="training-info__label">Рейтинг</span>
                                <span className="training-info__rating-icon">
                                  <svg width="18" height="18" aria-hidden="true">
                                    <use xlinkHref="#icon-star"></use>
                                  </svg>
                                </span>
                                <input type="number" name="rating" value={training.rating.toFixed()} readOnly />
                              </label>
                            </div>
                            <ul className="training-info__list">
                              <li className="training-info__item">
                                <div className="hashtag hashtag--white">
                                  <span>{SpecialisationHashTagValue[training.specialisation]}</span>
                                </div>
                              </li>
                              <li className="training-info__item">
                                <div className="hashtag hashtag--white">
                                  <span>{GenderHashTagValue[training.gender]}</span>
                                </div>
                              </li>
                              <li className="training-info__item">
                                <div className="hashtag hashtag--white">
                                  <span>#{training.caloriesToBurn}ккал</span>
                                </div>
                              </li>
                              <li className="training-info__item">
                                <div className="hashtag hashtag--white">
                                  <span>{DurationHashTagValue[training.trainingDuration]}</span>
                                </div>
                              </li>
                            </ul>
                          </div>
                          <div className="training-info__price-wrapper">
                            <div className={`training-info__input training-info__input--price ${priceError ? 'is-invalid' : ''}`}>
                              <label>
                                <span className="training-info__label">Стоимость</span>
                                <input
                                  type="text"
                                  disabled={!isEditMode}
                                  value={isDiscount ? currentDiscountPrice : currentPrice}
                                  onChange={onPriceInputChangeHandler}
                                  onBlur={onPriceInputBlurHandle}
                                />
                              </label>
                              <div className="training-info__error" style={{bottom: 'auto'}}>{priceError}</div>
                            </div>
                            <button
                              className="btn-flat btn-flat--light btn-flat--underlined training-info__discount"
                              type="button"
                              onClick={onDiscountBtnCLickHandle}
                              disabled={priceError !== ''}
                            >
                              <svg width="14" height="14" aria-hidden="true">
                                <use xlinkHref="#icon-discount"></use>
                              </svg>
                              <span>{`${!isDiscount ? 'Сделать' : 'Отменить'} скидку 10%`}</span>
                            </button>
                            {
                              myProfile.role === Role.User &&
                              <button
                                className="btn training-info__buy"
                                data-testid="buy-btn"
                                type="button"
                                ref={purchaseBtnRef}
                                onClick={() => openModal()}
                                disabled={trainingAmount > 0}
                              >
                                Купить
                              </button>
                            }
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                  <TrainingVideoSection
                    videoLink={training.video}
                    poster={training.backgroundImage}
                    isLoadVideoMode={isLoadVideoMode}
                    setLoadVideoMode={setLoadVideoMode}
                    trainingId={training.trainingId}
                    trainingAmount={trainingAmount}
                    myRole={myProfile.role}
                  />
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
      <PurchaseModal
        training={training}
        closeModal={closeModal}
        isModalOpen={isModalOpen}
        closeModalBtnRef={closeModalBtnRef}
      />
    </Fragment>
  );
}
