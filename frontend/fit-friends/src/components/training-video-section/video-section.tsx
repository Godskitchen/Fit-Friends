import './video-player.css';
import { ChangeEvent, Fragment, useRef, useState } from 'react';
import VideoProgressBar from '../video-progress-bar/video-progress-bar';
import { formatVideoDurationTime } from 'src/utils/helpers';
import { trainingVideoValidationHandler } from 'src/utils/validators/training/training-video';
import { SubmitHandler, useForm } from 'react-hook-form';
import BlockUI from '../block-UI/block-UI';
import { useAppDispatch, useAppSelector } from 'src/hooks';
import { getDataUploadingStatus } from 'src/store/app-data/app-data.selectors';
import { updateTrainingAction, updateTrainingAmountAction } from 'src/store/api-actions';
import LoadingBlock from '../loading-components/loading-block';
import { Role } from 'src/types/constants';

type TrainingVideoProps = {
  videoLink: string;
  poster: string;
  isLoadVideoMode: boolean;
  setLoadVideoMode: React.Dispatch<React.SetStateAction<boolean>>;
  trainingId: number;
  trainingAmount: number;
  myRole: Role;
}

export default function TrainingVideoSection({
  videoLink,
  poster,
  isLoadVideoMode,
  setLoadVideoMode,
  trainingId,
  trainingAmount,
  myRole}: TrainingVideoProps): JSX.Element {

  const dispatch = useAppDispatch();

  const videoSectionRef = useRef<HTMLDivElement | null>(null);
  const videoPlayerRef = useRef<HTMLVideoElement | null>(null);
  const playBtnRef = useRef<HTMLButtonElement | null>(null);
  const controlsBlockRef = useRef<HTMLDivElement | null>(null);
  const formRef = useRef<HTMLFormElement | null>(null);

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoadedError, setLoadedError] = useState(false);
  const [canVideoPlay, setCanVideoPlay] = useState(myRole === Role.Trainer);

  const [isVideoUploaded, setVideoUploaded] = useState(false);
  const [isVideoUploading, setVideoUploading] = useState(false);

  const isUIBlocking = useAppSelector(getDataUploadingStatus);

  const {
    register,
    handleSubmit,
    formState,
    formState: {errors},
    trigger,
    setError,
    getValues,
  } = useForm<{video: FileList}>(
    {
      mode: 'onBlur',
      shouldFocusError: false,
      reValidateMode: 'onBlur',
    }
  );

  const resetPlayer = () => {
    playBtnRef.current?.classList.remove('visually-hidden');
    videoSectionRef.current?.classList.remove('training-video--stop');
    if (myRole === Role.User) {
      setCanVideoPlay(false);
    }
    if (videoPlayerRef.current) {
      videoPlayerRef.current.currentTime = 0;
      videoPlayerRef.current.pause();
    }
  };

  const handlePlayBtnClick = () => {
    if (videoPlayerRef.current?.paused) {
      videoPlayerRef.current?.play();
      playBtnRef.current?.classList.add('visually-hidden');
    }
  };

  const handleVideoPlayerClick = () => {
    if (videoPlayerRef.current?.played) {
      videoPlayerRef.current?.pause();
      playBtnRef.current?.classList.remove('visually-hidden');
    }
  };

  const handleFullScrBtnClick = () => {
    if ((canVideoPlay && myRole === Role.User) || myRole === Role.Trainer) {
      videoPlayerRef.current?.requestFullscreen();
    }
  };

  const handleVideoTimeUpdate = () => {
    setCurrentTime(Number(videoPlayerRef.current?.currentTime.toFixed(0)));
  };

  const handleVideoError = () => {
    setLoadedError(true);
    playBtnRef.current?.classList.add('visually-hidden');
    controlsBlockRef.current?.classList.add('visually-hidden');
  };

  const handleLoadMetaData = () => {
    playBtnRef.current?.classList.remove('visually-hidden');
    controlsBlockRef.current?.classList.remove('visually-hidden');
    setLoadedError(false);
    setDuration(Number(videoPlayerRef.current?.duration.toFixed(0)));
  };

  const handleVideoEnded = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    }
    resetPlayer();
  };

  const handleDeleteBtnClick = () => {
    setLoadVideoMode(true);
    if (videoPlayerRef.current?.play) {
      videoPlayerRef.current?.pause();
      videoPlayerRef.current.currentTime = 0;
    }
  };

  const trainingVideoChangeHandler = ({target}: ChangeEvent<HTMLInputElement>) => {
    setVideoUploading(true);
    trainingVideoValidationHandler(target.files)
      .then((res) => {
        if (res === true && target.files) {
          setVideoUploaded(true);
          trigger('video');
        } else {
          if (typeof res === 'string') {
            setError('video', {message: res});
          }
          setVideoUploaded(false);
        }
      })
      .finally(() => {setVideoUploading(false);});
  };

  const onSubmitHandler: SubmitHandler<{video: FileList}> = (formData) => {
    dispatch(updateTrainingAction(Object.assign(formData, {trainingId})))
      .then((result) => {
        if (updateTrainingAction.fulfilled.match(result)) {
          setLoadVideoMode(false);
        }
      });
  };

  const handleBeginTrainingBtnClick = () => {
    dispatch(updateTrainingAmountAction({
      trainingId,
      remainingAmount: trainingAmount - 1,
    }))
      .then((result) => {
        if (updateTrainingAmountAction.fulfilled.match(result)) {
          videoSectionRef.current?.classList.add('training-video--stop');
          setCanVideoPlay(true);
        }
      });
  };

  const handleEndTrainingBtnClick = () => {
    resetPlayer();
  };

  const durationValue = formatVideoDurationTime(duration);
  const timePassed = formatVideoDurationTime(currentTime);

  return (
    <div ref={videoSectionRef} className={`training-video ${isLoadVideoMode ? 'training-video--load' : ''}`}>
      <h2 className="training-video__title">Видео</h2>
      <div className="training-video__video">
        {
          isLoadedError
            ? <p>Видео тренировки на данный момент недоступно</p>
            : (
              <video className="training-video__player"
                ref={videoPlayerRef}
                src={videoLink}
                data-testid="video-player"
                poster={poster}
                preload='metadata'
                onTimeUpdate={handleVideoTimeUpdate}
                onLoadedMetadata={handleLoadMetaData}
                onError={handleVideoError}
                onEnded={handleVideoEnded}
                onClick={handleVideoPlayerClick}
                muted
              />
            )
        }
        <button
          ref={playBtnRef}
          className="training-video__play-button btn-reset"
          style={{ top: 0, bottom: 0, right: 0, left: 0, margin: 'auto' }}
          onClick={handlePlayBtnClick}
          disabled={isLoadedError || !canVideoPlay}
          data-testid="playback-btn"
        >
          <svg width="18" height="30" aria-hidden="true">
            <use xlinkHref="#icon-arrow"></use>
          </svg>
        </button>

        <div ref={controlsBlockRef} className="player__controls">
          <div className="player__controls-row">
            <div className="player__time-value">{`${timePassed} / ${durationValue}`}</div>
            <button onClick={handleFullScrBtnClick} type="button" className="player__full-screen">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M19 7V1M19 1H13M19 1L11.5 8.5M1 13V19M1 19H7M1 19L8.5 11.5" stroke="white" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="visually-hidden">Full screen</span>
            </button>
          </div>
          <VideoProgressBar currentTime={currentTime} duration={duration} />
        </div>
      </div>
      <div className="training-video__drop-files" style={{position: 'relative'}}>
        {isVideoUploading && <LoadingBlock />}
        {isUIBlocking && <BlockUI />}
        <form method="post" onSubmit={handleSubmit(onSubmitHandler)} ref={formRef}>
          <div className="training-video__form-wrapper">
            <div className="drag-and-drop">
              <label>
                <span className="drag-and-drop__label" style={{border: `${errors.video ? '1px solid #e4001b' : ''}`}} tabIndex={0}>
                  {!isVideoUploaded || !getValues('video').length ? 'Загрузите сюда файлы формата MOV или MP4' : getValues('video')[0].name}
                  <svg width="20" height="20" aria-hidden="true">
                    <use xlinkHref="#icon-import-video"></use>
                  </svg>
                </span>
                <input
                  type="file"
                  tabIndex={-1} accept=".mov, .mp4"
                  {...register('video',
                    {
                      required: true,
                      onChange: trainingVideoChangeHandler,
                    }
                  )}
                />
              </label>
            </div>
            {errors?.video?.message && <span style={{color: '#e4001b'}}>{errors.video?.message}</span>}
          </div>
        </form>
      </div>
      <div className="training-video__buttons-wrapper">
        {myRole === Role.User && (
          <Fragment>
            <button
              className="btn training-video__button training-video__button--start"
              type="button"
              disabled={trainingAmount <= 0 || isLoadedError}
              onClick={handleBeginTrainingBtnClick}
            >
              Приступить
            </button>
            <button
              className="btn training-video__button training-video__button--stop"
              type="button"
              onClick={handleEndTrainingBtnClick}
            >
              Закончить
            </button>
          </Fragment>
        )}
        {myRole === Role.Trainer && (
          <div className="training-video__edit-buttons">
            <button
              className="btn"
              type="button"
              disabled={
                !formState.isValid
              || formState.isSubmitting
              || isVideoUploading
              || !isVideoUploaded
              }
              onClick={() => {formRef.current?.requestSubmit();}}
            >
              Сохранить
            </button>
            <button
              className="btn btn--outlined"
              type="button"
              onClick={handleDeleteBtnClick}
            >
              Удалить
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
