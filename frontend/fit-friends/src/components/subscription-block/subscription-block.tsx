import { useEffect, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from 'src/hooks';
import { checkUserSubscriptionAction, subscribeToCoachAction, unsubscribeToCoachAction } from 'src/store/api-actions';
import { getSubscriptionStatus } from 'src/store/app-data/app-data.selectors';

type SubscriptionBlockProps = {
  trainerId: number;
}

export default function SubscriptionBlock({trainerId}: SubscriptionBlockProps): JSX.Element {

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const dispatch = useAppDispatch();
  const [isSubscribed, setSubscribed] = useState<boolean>(false);

  useEffect(() => {
    dispatch(checkUserSubscriptionAction(trainerId));
  }, [dispatch, trainerId]);

  const subscribedStatus = useAppSelector(getSubscriptionStatus);

  useEffect(() => {
    if (subscribedStatus !== undefined) {
      setSubscribed(subscribedStatus);
    }
  }, [subscribedStatus]);

  const handleCheckboxChange = () => {
    setSubscribed(!isSubscribed);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      if (isSubscribed) {
        dispatch(unsubscribeToCoachAction(trainerId));
      } else {
        dispatch(subscribeToCoachAction(trainerId));
      }
    }, 1000);
  };


  return (
    <div className="user-card-coach__training-check">
      <div className="custom-toggle custom-toggle--checkbox">
        <label>
          <input
            type="checkbox"
            value="user-subscription"
            checked={isSubscribed}
            onChange={handleCheckboxChange}
          />
          <span className="custom-toggle__icon">
            <svg width="9" height="6" aria-hidden="true">
              <use xlinkHref="#arrow-check"></use>
            </svg>
          </span>
          <span className="custom-toggle__label">Получать уведомление на почту о новой тренировке</span>
        </label>
      </div>
    </div>
  );
}
