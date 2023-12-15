/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useRef, useState, MouseEvent, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch } from 'src/hooks';
import { addUserToFriendsAction, createTrainingRequestStatusAction, removeUserFromFriendsAction } from 'src/store/api-actions';
import { Role, SkillHashTagValue, SpecialisationHashTagValue } from 'src/types/constants';
import { TrainerProfileInfo, UserInfo } from 'src/types/user.type';
import TrainingBlock from '../training-block/training-block';
import UserMapLocation from '../user-map-location/user-map-location';
import { TrainingRequest, TrainingRequestStatus } from 'src/types/training-request.type';
import SubscriptionBlock from '../subscription-block/subscription-block';

type InfoBlockProps = {
  user: UserInfo;
  myRole: Role;
}

export default function CoachInfoBlock({
  user: {
    userId,
    name,
    aboutInfo,
    backgroundImage,
    location,
    trainerProfile,
    isFriend,
    trainingRequestsAsRecepient
  }, myRole} : InfoBlockProps) {

  const dispatch = useAppDispatch();
  const {specialisations, skillLevel, individualTraining } = trainerProfile as TrainerProfileInfo;
  const myRequestToUser: TrainingRequest | undefined = trainingRequestsAsRecepient[0];
  const [friendStatus, setFriendStatus] = useState(isFriend);
  const [isPendingRequestExists, setPendingRequestExists] = useState<boolean>(myRequestToUser && myRequestToUser.status === TrainingRequestStatus.Pending);

  const [isModalOpen, setModalOpen] = useState(false);
  const locationBtnRef = useRef<HTMLAnchorElement | null>(null);
  const closeModalBtnRef = useRef<HTMLButtonElement | null>(null);

  const openModal = () => {
    setModalOpen(true);
    document.body.classList.add('scroll-lock');
    setTimeout(() => {closeModalBtnRef.current?.focus();}, 100);
  };

  const closeModal = () => {
    setModalOpen(false);
    document.body.classList.remove('scroll-lock');
    setTimeout(() => {locationBtnRef.current?.focus();}, 100);
  };

  const handleAddFriendBtnClick = () => {
    dispatch(addUserToFriendsAction(userId))
      .then(() => setFriendStatus(true));
  };

  const handleRemoveFriendBtnClick = () => {
    dispatch(removeUserFromFriendsAction(userId))
      .then(() => setFriendStatus(false));
  };

  const handleLocationClickBtn = (evt: MouseEvent<HTMLAnchorElement>) => {
    evt.preventDefault();
    openModal();
  };

  const onSendRequestBtnClick = () => {
    dispatch(createTrainingRequestStatusAction(userId))
      .then(() => setPendingRequestExists(true));
  };

  return (
    <Fragment>
      <div className="inner-page__content">
        <section className="user-card-coach">
          <h1 className="visually-hidden">Карточка пользователя роль тренер</h1>
          <div className="user-card-coach__wrapper">
            <div className="user-card-coach__card">
              <div className="user-card-coach__content">
                <div className="user-card-coach__head">
                  <h2 className="user-card-coach__title">{name}</h2>
                </div>
                <div className="user-card-coach__label">
                  <Link to='#' onClick={handleLocationClickBtn} ref={locationBtnRef}>
                    <svg className="user-card-coach__icon-location" width="12" height="14" aria-hidden="true">
                      <use xlinkHref="#icon-location"></use>
                    </svg>
                    <span>{location}</span>
                  </Link>
                </div>
                <div className="user-card-coach__status-container">
                  <div className="user-card-coach__status user-card-coach__status--tag">
                    <svg className="user-card-coach__icon-cup" width="12" height="13" aria-hidden="true">
                      <use xlinkHref="#icon-cup"></use>
                    </svg>
                    <span>Тренер</span>
                  </div>
                  <div className={individualTraining
                    ? 'user-card-coach__status user-card-coach__status--check'
                    : 'user-card-coach-2__status user-card-coach-2__status--check'}
                  >
                    <span>{`${individualTraining ? 'Готов тренировать' : 'Не готов тренировать'}`}</span>
                  </div>
                </div>
                <div className="user-card-coach__text">
                  <p>{aboutInfo}</p>
                </div>
                <button className="btn-flat user-card-coach__sertificate" type="button">
                  <svg width="12" height="13" aria-hidden="true">
                    <use xlinkHref="#icon-teacher"></use>
                  </svg>
                  <span>Посмотреть сертификаты</span>
                </button>
                <ul className="user-card-coach__hashtag-list">
                  {
                    specialisations.map((spec) => (
                      <li key={spec} className="user-card-coach__hashtag-item">
                        <div className="hashtag"><span>{SpecialisationHashTagValue[spec]}</span></div>
                      </li>
                    ))
                  }
                  <li className="user-card__hashtag-item">
                    <div className="hashtag"><span>{SkillHashTagValue[skillLevel]}</span></div>
                  </li>
                </ul>
                {
                  friendStatus && (
                    <button
                      className="btn btn--outlined user-card-coach__btn"
                      type="button"
                      onClick={handleRemoveFriendBtnClick}
                    >
                  Удалить из друзей
                    </button>
                  )
                }
                {
                  myRole === Role.User && !friendStatus && (
                    <button
                      className="btn user-card-coach__btn"
                      type="button"
                      onClick={handleAddFriendBtnClick}
                    >
                    Добавить в друзья
                    </button>
                  )
                }
              </div>
              <div className="user-card-coach__gallary">
                <ul className="user-card-coach__gallary-list">
                  <li className="user-card-coach__gallary-item">
                    <img src={backgroundImage} width="334" height="573" alt="photo1" />
                  </li>
                  <li className="user-card-coach__gallary-item">
                    <img src={backgroundImage} width="334" height="573" alt="photo2" />
                  </li>
                </ul>
              </div>
            </div>
            {
              myRole === Role.User && (
                <div className="user-card-coach__training">
                  <TrainingBlock />
                  <form className="user-card-coach__training-form">
                    {
                      friendStatus && individualTraining &&
                      <button
                        className="btn user-card-coach__btn-training"
                        type="button" disabled={isPendingRequestExists}
                        onClick={onSendRequestBtnClick}
                      >
                        {isPendingRequestExists ? 'Заявка на тренировку отправлена' : 'Хочу персональную тренировку'}
                      </button>
                    }
                    <SubscriptionBlock trainerId={userId}/>
                  </form>
                </div>
              )
            }
          </div>
        </section>
      </div>

      <UserMapLocation
        userName={name}
        userLocation={location}
        isModalOpen={isModalOpen}
        closeModal={closeModal}
        closeModalBtnRef={closeModalBtnRef}
      />
    </Fragment>

  );
}
