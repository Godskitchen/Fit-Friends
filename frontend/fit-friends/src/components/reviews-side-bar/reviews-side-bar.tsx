import { useNavigate } from 'react-router-dom';
import { AppRoute } from 'src/app-constants';
import { Fragment, useEffect, useRef, useState } from 'react';
import { useThrottle } from 'src/hooks/useThrottle';
import { Role } from 'src/types/constants';
import { useAppDispatch, useAppSelector } from 'src/hooks';
import { addRepliesToListAction, getReplyListAction } from 'src/store/api-actions';
import { getRepliesDownLoadingStatus, getReplyList, getTotalRepliesCount } from 'src/store/app-data/app-data.selectors';
import LoadingBlock from '../loading-components/loading-block';
import ReplyCard from '../reply-card/reply-card';
import ReplyModal from '../reply-modal/reply-modal';
import { ReplyQueryState } from 'src/types/queries-filters.type';
import ErrorScreen from '../error-components/error-screen';

const SCROLL_STEP = 200;
const SCROLL_POSITION_THRESHOLD = 300;
const THROTTLE_DELAY = 200;

const INITIAL_PAGE_NUMBER = 1;
const REPLIES_LIMIT_PER_PAGE = 6;

type ReviewsSideBarProps = {
  trainingId: number;
  myRole: Role;
  trainingAmount: number;
}
export default function ReviewsSideBar({trainingId, myRole, trainingAmount}: ReviewsSideBarProps): JSX.Element {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [isModalOpen, setModalOpen] = useState(false);

  const openModal = () => {
    setModalOpen(true);
    document.body.classList.add('scroll-lock');
    setTimeout(() => {closeModalBtnRef.current?.focus();}, 100);
  };

  const closeModal = () => {
    setModalOpen(false);
    document.body.classList.remove('scroll-lock');
    setTimeout(() => {replyBtnRef.current?.focus();}, 100);
  };

  const onBtnBackClickHandle = () => {
    navigate(`${myRole === Role.Trainer ? `${AppRoute.CoachAccount}${AppRoute.MyTrainings}` : `${AppRoute.TrainingsCatalog}`}`);
  };

  const replyBtnRef = useRef<HTMLButtonElement | null>(null);
  const closeModalBtnRef = useRef<HTMLButtonElement | null>(null);

  const reviewListRef = useRef<HTMLUListElement | null>(null);
  const [canLoadMore, setCanLoadMore] = useState(false);
  const [queryState, setQueryState] = useState<ReplyQueryState & {trainingId: number}>();

  const replyList = useAppSelector(getReplyList);
  const totalRepliesCount = useAppSelector(getTotalRepliesCount);
  const isLoading = useAppSelector(getRepliesDownLoadingStatus);

  const handleWheelScroll = useThrottle((evt) => {
    if (!reviewListRef.current) {
      return;
    }

    const cardList = reviewListRef.current;
    let newPosition = evt.currentTarget.scrollTop;

    if (evt.deltaY > 0) {
      evt.currentTarget.scrollTop += SCROLL_STEP;
      newPosition += SCROLL_STEP;
      const windowHeight = window.innerHeight;
      const contentHeight = cardList.scrollHeight;
      const canLoad = contentHeight - (newPosition + windowHeight) < SCROLL_POSITION_THRESHOLD;
      setCanLoadMore(canLoad);

    } else if (evt.deltaY < 0) {
      evt.currentTarget.scrollTop -= SCROLL_STEP;
      newPosition -= SCROLL_STEP;
    }
  }, THROTTLE_DELAY);

  useEffect(() => {
    const initialQuery = {
      trainingId,
      page: `${INITIAL_PAGE_NUMBER}`,
      limit: `${REPLIES_LIMIT_PER_PAGE}`
    };
    dispatch(getReplyListAction(initialQuery))
      .then((result) => {
        if (getReplyListAction.fulfilled.match(result)) {
          setQueryState(initialQuery);
        }
      });
  }, [dispatch, trainingId]);

  useEffect(() => {
    if (canLoadMore
      && replyList
      && totalRepliesCount - replyList.length > 0
      && !isLoading
      && queryState) {

      const newQueryState: ReplyQueryState & {trainingId: number} = {
        ...queryState,
        page: queryState.page ? `${+queryState.page + 1}` : queryState.page
      };
      dispatch(addRepliesToListAction(newQueryState))
        .then((result) => {
          if (addRepliesToListAction.fulfilled.match(result)) {
            setQueryState(newQueryState);
          }
        });
      setCanLoadMore(false);
    }
  }, [dispatch, isLoading, canLoadMore, queryState, replyList, totalRepliesCount]);

  if (replyList === undefined) {
    return <LoadingBlock />;
  }

  if (replyList === null) {
    return <ErrorScreen />;
  }

  let idCounter = 1;

  return (
    <Fragment>
      <aside className="reviews-side-bar">
        <button
          className="btn-flat btn-flat--underlined reviews-side-bar__back"
          type="button"
          onClick={onBtnBackClickHandle}
        >
          <svg width="14" height="10" aria-hidden="true">
            <use xlinkHref="#arrow-left"></use>
          </svg>
          <span>Назад</span>
        </button>
        <h2 className="reviews-side-bar__title">Отзывы</h2>
        <ul
          ref={reviewListRef}
          style={{scrollBehavior: 'smooth'}}
          className="reviews-side-bar__list"
          onMouseEnter={() => {document.body.classList.add('scroll-lock');}}
          onMouseLeave={() => {document.body.classList.remove('scroll-lock');}}
          onWheel={handleWheelScroll}
        >
          {replyList.map((reply) => (<ReplyCard card={reply} key={idCounter++}/>))}
        </ul>
        {
          myRole === Role.User &&
          <button
            className="btn btn--medium reviews-side-bar__button"
            type="button"
            disabled={trainingAmount === -1}
            onClick={() => openModal()}
            ref={replyBtnRef}
          >
            Оставить отзыв
          </button>
        }
      </aside>
      <ReplyModal
        trainingId={trainingId}
        isModalOpen={isModalOpen}
        closeModal={closeModal}
        closeModalBtnRef={closeModalBtnRef}
      />
    </Fragment>
  );
}
