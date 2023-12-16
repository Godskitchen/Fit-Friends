/* eslint-disable no-console */
import './info-block.css';

import { Fragment, useRef, useState, MouseEvent } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch } from 'src/hooks';
import { addUserToFriendsAction, removeUserFromFriendsAction } from 'src/store/api-actions';
import { Role, SkillHashTagValue, SpecialisationHashTagValue } from 'src/types/constants';
import { UserInfo, UserProfileInfo } from 'src/types/user.type';
import UserMapLocationModal from '../user-map-location-modal/user-map-location-modal';

type InfoBlockProps = {
  user: UserInfo;
  myRole: Role;
  myId: number;
}

export default function UserInfoBlock({user: {userId, name, aboutInfo, location, userProfile, backgroundImage, isFriend}, myId, myRole} : InfoBlockProps) {
  const dispatch = useAppDispatch();
  const {specialisations, skillLevel, readyForWorkout } = userProfile as UserProfileInfo;
  const [friendStatus, setFriendStatus] = useState(isFriend);

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

  return (
    <Fragment>
      <div className="inner-page__content">
        <section className="user-card">
          <h1 className="visually-hidden">Карточка пользователя</h1>
          <div className="user-card__wrapper">
            <div className="user-card__content">
              <div className="user-card__head">
                <h2 className="user-card__title">{name}</h2>
              </div>
              <div className="user-card__label">
                <Link to='#' onClick={handleLocationClickBtn} ref={locationBtnRef}>
                  <svg className="user-card-coach__icon-location" width="12" height="14" aria-hidden="true">
                    <use xlinkHref="#icon-location"></use>
                  </svg>
                  <span>{location}</span>
                </Link>
              </div>
              <div className={`user-card__status ${!readyForWorkout ? 'user-card__status--not-ready' : ''}`}>
                <span>{`${readyForWorkout ? 'Готов к тренировке' : 'Не готов к тренировке'}`}</span>
              </div>
              <div className="user-card__text">
                <p>{aboutInfo}</p>
              </div>
              <ul className="user-card__hashtag-list">
                {
                  specialisations.map((spec) => (
                    <li key={spec} className="user-card__hashtag-item">
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
                    className="btn btn--outlined user-card__btn"
                    type="button"
                    onClick={handleRemoveFriendBtnClick}
                  >
                  Удалить из друзей
                  </button>
                )
              }
              {
                myRole === Role.User && myId !== userId && !friendStatus && (
                  <button
                    className="btn user-card__btn"
                    type="button"
                    onClick={handleAddFriendBtnClick}
                  >
                    Добавить в друзья
                  </button>
                )
              }
            </div>
            <div className="user-card__gallary">
              <ul className="user-card__gallary-list">
                <li className="user-card__gallary-item">
                  <img src={backgroundImage} width="334" height="573" alt="photo1" />
                </li>
                <li className="user-card__gallary-item">
                  <img src={backgroundImage} width="334" height="573" alt="photo2" />
                </li>
              </ul>
            </div>
          </div>
        </section>
      </div>

      <UserMapLocationModal
        userName={name}
        userLocation={location}
        isModalOpen={isModalOpen}
        closeModal={closeModal}
        closeModalBtnRef={closeModalBtnRef}
      />
    </Fragment>
  );
}
