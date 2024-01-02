import { useState, MouseEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppRoute } from 'src/app-constants';
import { useAppDispatch } from 'src/hooks';
import { createTrainingRequestStatusAction, updateTrainingRequestStatusAction } from 'src/store/api-actions';
import { Role, Specialisation, SpecialisationHashTagValue } from 'src/types/constants';
import { TrainingRequest, TrainingRequestStatus } from 'src/types/training-request.type';
import { UserInfo } from 'src/types/user.type';

type FriendCardProps = {
  card: UserInfo;
  myReadyStatus: boolean;
  myRole: Role;
}

export default function FriendCard({
  card: {
    userId,
    avatar,
    name,
    role,
    location,
    userProfile,
    trainerProfile,
    trainingRequestsAsRecepient,
    trainingRequestsAsSender
  },
  myReadyStatus,
  myRole
}: FriendCardProps): JSX.Element {

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  let userReadyStatus;

  if ((userProfile && userProfile.readyForWorkout) || (trainerProfile && trainerProfile.individualTraining)) {
    userReadyStatus = true;
  } else {
    userReadyStatus = false;
  }

  const myRequestToUser: TrainingRequest | undefined = trainingRequestsAsRecepient[0];
  const requestToMeFromUser: TrainingRequest | undefined = trainingRequestsAsSender[0];

  let specialisations: Specialisation[] = [];

  if (userProfile) {
    specialisations = userProfile.specialisations;
  } else if (trainerProfile) {
    specialisations = trainerProfile.specialisations;
  }

  const [requestToMeStatus, setRequestToMeStatus] = useState<TrainingRequestStatus | undefined>(requestToMeFromUser ? requestToMeFromUser.status : undefined);
  const [myRequestStatus, setMyRequestStatus] = useState<TrainingRequestStatus | undefined>(myRequestToUser ? myRequestToUser.status : undefined);

  const onAcceptBtnClick = () => {
    dispatch(updateTrainingRequestStatusAction({
      id: requestToMeFromUser.id,
      status: TrainingRequestStatus.Accepted
    })).then(() => {setRequestToMeStatus(TrainingRequestStatus.Accepted);});
  };

  const onDeclineBtnClick = () => {
    dispatch(updateTrainingRequestStatusAction({
      id: requestToMeFromUser.id,
      status: TrainingRequestStatus.Declined
    })).then(() => {setRequestToMeStatus(TrainingRequestStatus.Declined);});
  };

  const onSendRequestBtnClick = (evt: MouseEvent<HTMLButtonElement>) => {
    evt.stopPropagation();
    dispatch(createTrainingRequestStatusAction(userId))
      .then(() => {setMyRequestStatus(TrainingRequestStatus.Pending);});
  };

  return (
    <li className="friends-list__item" data-testid="friend-card">
      <div className="thumbnail-friend">
        <div className={`thumbnail-friend__info thumbnail-friend__info--theme-${role === Role.User ? 'light' : 'dark'}`} onClick={() => navigate(`${AppRoute.UsersCatalog}/${userId}`)}>
          <div className="thumbnail-friend__image-status">
            <div className="thumbnail-friend__image">
              <picture>
                <img src={avatar} width="78" height="78" alt="" />
              </picture>
            </div>
          </div>
          <div className="thumbnail-friend__header">
            <h2 className="thumbnail-friend__name">{name}</h2>
            <div className="thumbnail-friend__location">
              <svg width="14" height="16" aria-hidden="true">
                <use xlinkHref="#icon-location"></use>
              </svg>
              <address className="thumbnail-friend__location-address">{location}</address>
            </div>
          </div>
          <ul className="thumbnail-friend__training-types-list">
            {
              specialisations.map((spec) => (
                <li key={spec} onClick={(evt:MouseEvent<HTMLLIElement>) => evt.stopPropagation()}>
                  <div className="hashtag thumbnail-friend__hashtag">
                    <span>{SpecialisationHashTagValue[spec]}</span>
                  </div>
                </li>
              ))
            }
          </ul>
          <div className="thumbnail-friend__activity-bar">
            <div
              className={`thumbnail-friend__ready-status thumbnail-friend__ready-status--${userReadyStatus ? 'is-ready' : 'is-not-ready'}`}
              onClick={(evt:MouseEvent<HTMLDivElement>) => evt.stopPropagation()}
            >
              <span>{userReadyStatus ? 'Готов к тренировке' : 'Не готов к тренировке'}</span>
            </div>
            {
              role === Role.User && myRole === Role.User &&
              <button
                className="thumbnail-friend__invite-button"
                type="button"
                disabled={!userReadyStatus || (myRequestStatus === TrainingRequestStatus.Pending)}
                onClick={onSendRequestBtnClick}
              >
                <svg width="43" height="46" aria-hidden="true" focusable="false">
                  <use xlinkHref="#icon-invite"></use>
                </svg>
                <span className="visually-hidden">Пригласить друга на совместную тренировку</span>
              </button>
            }
          </div>
        </div>
        {
          myReadyStatus
          && requestToMeStatus === TrainingRequestStatus.Pending
          &&
          <div className="thumbnail-friend__request-status thumbnail-friend__request-status--role-user">
            <p className="thumbnail-friend__request-text">{`Запрос на ${myRole === Role.User ? 'совместную' : 'персональную'} тренировку`}</p>
            <div className="thumbnail-friend__button-wrapper">
              <button
                className="btn btn--medium btn--dark-bg thumbnail-friend__button"
                type="button"
                onClick={onAcceptBtnClick}
              >
                  Принять
              </button>
              <button
                className="btn btn--medium btn--outlined btn--dark-bg thumbnail-friend__button"
                type="button"
                onClick={onDeclineBtnClick}
              >Отклонить
              </button>
            </div>
          </div>
        }
        {
          myRequestStatus
          && myRequestStatus !== TrainingRequestStatus.Pending
          && requestToMeStatus !== TrainingRequestStatus.Pending
          &&
          <div className={`thumbnail-friend__request-status thumbnail-friend__request-status--role-${role === Role.User ? 'user' : 'coach'}`}>
            <p className="thumbnail-friend__request-text">
              {`Запрос на ${role === Role.User ? 'совместную' : 'персональную'} тренировку ${myRequestToUser.status === TrainingRequestStatus.Accepted ? 'принят' : 'отклонен'}`}
            </p>
          </div>
        }
      </div>
    </li>
  );
}
