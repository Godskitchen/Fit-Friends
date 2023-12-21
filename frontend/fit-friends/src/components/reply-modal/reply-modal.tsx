/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-console */
import { MutableRefObject, useCallback, useEffect, useRef } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useAppDispatch, useAppSelector } from 'src/hooks';
import { createReplyAction, getReplyListAction } from 'src/store/api-actions';
import { getDataUploadingStatus } from 'src/store/app-data/app-data.selectors';
import { CreateReplyInputs } from 'src/types/forms.type';
import { handleKeyDown } from 'src/utils/helpers';
import { replyTextValidationHandler } from 'src/utils/validators/reply/reply-text';
import BlockUI from '../block-UI/block-UI';
import { getFormErrors } from 'src/store/user-process/user-process.selectors';
import { HttpStatusCode } from 'src/services/server-api';
import { clearFormErrorsAction } from 'src/store/user-process/user-process.reducer';

type ReplyModalProps = {
  isModalOpen: boolean;
  closeModal: () => void;
  closeModalBtnRef: MutableRefObject<HTMLButtonElement | null>;
  trainingId: number;
}

const PossibleRating = [1, 2, 3, 4, 5];

export default function ReplyModal({isModalOpen, closeModal, trainingId, closeModalBtnRef}: ReplyModalProps): JSX.Element {
  const modalRef = useRef<HTMLDivElement | null>(null);
  const dispatch = useAppDispatch();
  const keyDownModalHandler = useCallback(
    ((evt: globalThis.KeyboardEvent) => handleKeyDown(evt, modalRef, closeModal)), [closeModal]
  );

  const isDataUploading = useAppSelector(getDataUploadingStatus);
  const formErrors = useAppSelector(getFormErrors);
  const conflictError = formErrors[HttpStatusCode.CONFLICT];

  const {
    register,
    handleSubmit,
    formState: {errors, isValid, isSubmitting},
    clearErrors,
    reset,
    setError
  } = useForm<CreateReplyInputs>(
    {
      mode: 'onBlur',
      shouldFocusError: false,
      reValidateMode: 'onBlur',
      defaultValues: {
        text:'',
        rating: undefined,
        trainingId: trainingId
      }
    }
  );

  const onInputFocusHandler = (inputName: keyof CreateReplyInputs) => {
    dispatch(clearFormErrorsAction());
    clearErrors(inputName);
  };

  const onSubmitHandler: SubmitHandler<CreateReplyInputs> = (formData) => {
    dispatch(createReplyAction(formData))
      .then((result) => {
        if (createReplyAction.fulfilled.match(result)) {
          reset();
          closeModal();
        }
      });
  };

  useEffect(() => {
    if (conflictError) {
      setError('text', {message: conflictError});
    }
  }, [conflictError, setError]);

  useEffect(() => {
    if (isModalOpen) {
      document.addEventListener('keydown', keyDownModalHandler);
    }
    return () => {
      document.removeEventListener('keydown', keyDownModalHandler);
    };
  }, [closeModal, isModalOpen, keyDownModalHandler]);

  return (
    <div ref={modalRef} className={`modal modal--feedback ${isModalOpen ? 'is-active' : ''}`}>
      <div className="modal__wrapper">
        <section className="popup" style={{background: 'none'}}>
          <div className="popup__wrapper" style={{position: 'relative'}}>
            {isDataUploading && <BlockUI />}
            <div className="popup-head">
              <h2 className="popup-head__header">Оставить отзыв</h2>
              <button
                className="btn-icon btn-icon--outlined btn-icon--big"
                type="button"
                aria-label="close"
                ref={closeModalBtnRef}
                onClick={() => closeModal()}
              >
                <svg width="20" height="20" aria-hidden="true">
                  <use xlinkHref="#icon-cross"></use>
                </svg>
              </button>
            </div>
            <div className="popup__content popup__content--feedback">
              <h3 className="popup__feedback-title">Оцените тренировку</h3>
              <form method="post" onSubmit={handleSubmit(onSubmitHandler)}>
                <ul className="popup__rate-list">
                  {
                    PossibleRating.map((value) => (
                      <li className="popup__rate-item" key={value}>
                        <div className="popup__rate-item-wrap">
                          <label>
                            <input
                              type="radio"
                              {...register('rating', {
                                required: true,
                              })}
                              aria-label={`оценка ${value}.`}
                              value={value}
                            />
                            <span className="popup__rate-number">{value}</span>
                          </label>
                        </div>
                      </li>
                    ))
                  }
                </ul>
                <div className="popup__feedback">
                  <h3 className="popup__feedback-title popup__feedback-title--text">Поделитесь своими впечатлениями о тренировке</h3>
                  <div className="popup__feedback-textarea">
                    <div className={`custom-textarea ${errors.text ? 'custom-textarea--error' : ''}`}>
                      <label>
                        <textarea
                          style={errors.text ? {border: '1px solid #e4001b', backgroundColor: 'transparent'} : {}}
                          placeholder=" "
                          {...register('text', {
                            required: 'Поле обязательно для заполнения',
                            validate: replyTextValidationHandler
                          })}
                          onFocus={() => onInputFocusHandler('text')}
                        >
                        </textarea>
                        <span className='custom-textarea__error'>{errors.text?.message}</span>
                      </label>
                    </div>
                  </div>
                </div>
                <div className="popup__button">
                  <button
                    className="btn"
                    type="submit"
                    disabled={!isValid || isSubmitting}
                  >
                    Продолжить
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
