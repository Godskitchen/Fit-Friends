/* eslint-disable no-nested-ternary */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-console */
import { useAppDispatch, useAppSelector } from 'src/hooks';
import { getUserInfo } from 'src/store/user-process/user-process.selectors';
import LoadingScreen from '../loading-components/loading-screen';
import { useState, MouseEvent, useRef, ChangeEvent} from 'react';
import { Specialisation, Location, Gender, SkillLevel, Role } from 'src/types/constants';
import { SubmitHandler, useForm, useWatch } from 'react-hook-form';
import { ProfileInfoInputs } from 'src/types/forms.type';
import ProfileSpecialisationList from '../specialisation-list.tsx/profile-specialisation-list';
import DropDownList from '../dropdown-list/dropdown-list';
import { avatarValidationHandler } from 'src/utils/validators/user/avatar';
import { nameValidationHandler } from 'src/utils/validators/user/name';
import { aboutInfoValidationHandler } from 'src/utils/validators/user/about-info';
import { updateProfileAction } from 'src/store/api-actions';
import { compareArrays } from 'src/utils/helpers';


const GenderValueType = {
  Male: 'Мужской',
  Female: 'Женский',
  NoMatter: 'Неважно'
};

const GenderConvert = {
  'Мужской': 'Male',
  'Женский': 'Female',
  'Неважно': 'NoMatter',
};

const SkillValueType = {
  Beginner: 'Новичок',
  Amateur: 'Любитель',
  Pro: 'Профессионал'
};

const SkillConvert = {
  'Новичок': 'Beginner',
  'Любитель': 'Amateur',
  'Профессионал': 'Pro'
};


export default function UserInfoDesk(): JSX.Element {
  const dispatch = useAppDispatch();
  const userInfo = useAppSelector(getUserInfo);
  const [isEditMode, setEditMode] = useState(false);

  const locationBlockRef = useRef<HTMLDivElement | null>(null);
  const genderBlockRef = useRef<HTMLDivElement | null>(null);
  const skillBlockRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const {
    register,
    control,
    formState: { errors, isValid, isSubmitting },
    setValue,
    getValues,
    trigger,
    setError,
  } = useForm<ProfileInfoInputs>(
    {
      mode: 'onChange',
      shouldFocusError: false,
      reValidateMode: 'onChange',
      defaultValues: (userInfo && userInfo.trainerProfile) ? {
        name: userInfo.name,
        aboutInfo: userInfo.aboutInfo,
        individualTraining: userInfo.trainerProfile.individualTraining,
        specialisations: userInfo.trainerProfile.specialisations,
        location: userInfo.location,
        gender: userInfo.gender,
        skillLevel: userInfo.trainerProfile.skillLevel,
        shouldDeleteAvatar: false,
      } : {}
    }
  );

  const [isAvatarUploaded, setAvatarUploaded] = useState(true);
  const [picture, setPicture] = useState(userInfo?.avatar);

  const onClickLocationItemHandler = (evt: MouseEvent<HTMLUListElement>) => {
    const location = (evt.target as HTMLLIElement).textContent as Location;
    setValue('location', location, {shouldValidate: true});
    locationBlockRef.current?.classList.remove('is-open');
  };

  const onClickGenderItemHandler = (evt: MouseEvent<HTMLUListElement>) => {
    const gender = (evt.target as HTMLLIElement).textContent as keyof typeof GenderConvert;
    setValue('gender', GenderConvert[gender] as Gender, {shouldValidate: true});
    genderBlockRef.current?.classList.remove('is-open');
  };

  const onClickSkillItemHandler = (evt: MouseEvent<HTMLUListElement>) => {
    const skillLevel = (evt.target as HTMLLIElement).textContent as keyof typeof SkillConvert;
    setValue('skillLevel', SkillConvert[skillLevel] as SkillLevel, {shouldValidate: true});
    skillBlockRef.current?.classList.remove('is-open');
  };


  const avatarChangeHandler = ({target}: ChangeEvent<HTMLInputElement>) => {
    avatarValidationHandler(target.files)
      .then((res) => {
        if (res === true && target.files) {
          setAvatarUploaded(true);
          setPicture(URL.createObjectURL(target.files[0]));
          setValue('shouldDeleteAvatar', false);
        } else {
          if (typeof res === 'string') {
            setError('avatar', {message: res});
          }
          setAvatarUploaded(false);
          setValue('shouldDeleteAvatar', false);
          setPicture('');
        }
      });
  };
  const onOpenLocationListBtnClickHandler = () => locationBlockRef.current?.classList.toggle('is-open');
  const onOpenGenderListBtnClickHandler = () => genderBlockRef.current?.classList.toggle('is-open');
  const onOpenSkillListBtnClickHandler = () => skillBlockRef.current?.classList.toggle('is-open');

  const selectedSpecs = useWatch<ProfileInfoInputs, 'specialisations'>({control, name: 'specialisations'});

  const {ref: avatarRef, name, disabled, onChange, onBlur} = register('avatar', {
    required: false,
    onChange: avatarChangeHandler,
    onBlur: () => {trigger('avatar');},
    disabled: !isEditMode,
  });

  if (!userInfo || !userInfo.trainerProfile) {
    return <LoadingScreen />;
  }

  if (userInfo === null) {
    return <p>Error</p>;
  }

  const onSubmitHandler: SubmitHandler<ProfileInfoInputs> = (formData) => {
    const sendData: Partial<ProfileInfoInputs> = {
      name: formData.name !== userInfo.name ? formData.name : undefined,
      aboutInfo: formData.aboutInfo !== userInfo.aboutInfo ? formData.aboutInfo : undefined,
      individualTraining: formData.individualTraining !== userInfo.trainerProfile?.individualTraining ? formData.individualTraining : undefined,
      location: formData.location !== userInfo.location ? formData.location : undefined,
      gender: formData.gender !== userInfo.gender ? formData.gender : undefined,
      skillLevel: formData.skillLevel !== userInfo.trainerProfile?.skillLevel ? formData.skillLevel : undefined,
      specialisations: !compareArrays(formData.specialisations, userInfo.trainerProfile?.specialisations) ? formData.specialisations : undefined,
      avatar: formData.shouldDeleteAvatar ? null : formData.avatar?.length !== 0 ? formData.avatar : undefined,
    };

    let isProfileUpdated = false;

    for (const value of Object.values(sendData)) {
      if (value !== undefined) {
        isProfileUpdated = true;
        break;
      }
    }

    if (isProfileUpdated) {
      dispatch(updateProfileAction(Object.assign(
        sendData, {userId: userInfo.userId, role: userInfo.role}
      )));
    }
  };

  return (
    <section className="user-info-edit">
      <div className="user-info-edit__header">
        <div className="input-load-avatar">
          <label>
            <input
              className="visually-hidden"
              type="file"
              name={name}
              accept="image/png, image/jpeg"
              disabled={disabled}
              onChange={onChange}
              onBlur={onBlur}
              ref={(element) => {
                avatarRef(element);
                fileInputRef.current = element;
              }}
            />
            {
              picture && isAvatarUploaded
                ? (
                  <span className="input-load-avatar__avatar" style={{overflow: 'auto'}}>
                    <img
                      src={picture}
                      srcSet={picture}
                      style={{height: '98px'}}
                      width="98" height="98" alt="user avatar"
                    />
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
        {
          isEditMode && (
            <div className="user-info-edit__controls">
              <button
                className="user-info-edit__control-btn"
                type="button"
                aria-label="обновить"
                onClick={() => {
                  if (fileInputRef.current) {
                    fileInputRef.current.click();
                  }
                }}
              >
                <svg width="16" height="16" aria-hidden="true">
                  <use xlinkHref="#icon-change"></use>
                </svg>
              </button>
              <button
                className="user-info-edit__control-btn"
                type="button"
                aria-label="удалить"
                onClick={() => {
                  setAvatarUploaded(false);
                  setValue('shouldDeleteAvatar', true);
                }}
              >
                <svg width="14" height="16" aria-hidden="true">
                  <use xlinkHref="#icon-trash"></use>
                </svg>
              </button>
            </div>
          )
        }
      </div>
      {errors.avatar && <span style={{fontSize: '0.9em', color: '#e4001b', display: 'block'}}>{errors.avatar.message}</span>}
      <form className="user-info-edit__form">
        {
          isEditMode
            ? (
              <button
                className="btn-flat btn-flat--underlined user-info-edit__save-button"
                type="button"
                aria-label="Сохранить"
                onClick={() => {
                  setEditMode(false);
                  onSubmitHandler(getValues());
                }}
                disabled={!isEditMode || !isValid || isSubmitting || !!errors.avatar}
              >
                <svg width="12" height="12" aria-hidden="true">
                  <use xlinkHref="#icon-edit"></use>
                </svg>
                <span>Сохранить</span>
              </button>
            )
            : (
              <button
                className="btn-flat btn-flat--underlined user-info__edit-button"
                type="button"
                aria-label="Редактировать"
                onClick={() => {setEditMode(true);}}
              >
                <svg width="12" height="12" aria-hidden="true">
                  <use xlinkHref="#icon-edit"></use>
                </svg>
                <span>Редактировать</span>
              </button>
            )
        }
        <div className="user-info-edit__section">
          <h2 className="user-info-edit__title">Обо мне</h2>
          <div className={`custom-input ${!isEditMode ? 'custom-input--readonly' : ''} user-info-edit__input ${errors.name ? 'custom-input--error' : ''}`}>
            <label>
              <span className="custom-input__label">Имя</span>
              <span className="custom-input__wrapper">
                <input
                  type="text"
                  disabled={!isEditMode}
                  {...register('name', {required: 'Поле обязательно для заполнения', validate: nameValidationHandler})}
                />
              </span>
              {errors.name && <span className="custom-input__error">{errors.name.message}</span>}
            </label>
          </div>
          <div className={`custom-textarea ${!isEditMode ? 'custom-input--readonly' : ''} user-info-edit__textarea`}>
            <label>
              <span className="custom-textarea__label">Описание</span>
              <textarea
                style={errors.aboutInfo ? {border: '1px solid #e4001b', backgroundColor: 'transparent'} : {}}
                placeholder="Добавьте сюда свое описание"
                disabled={!isEditMode}
                {...register('aboutInfo', {required: true, validate: aboutInfoValidationHandler})}
              >
              </textarea>
            </label>
          </div>
          {errors.aboutInfo && <span style={{color: '#e4001b'}}>{errors.aboutInfo.message}</span>}
        </div>
        <div className="user-info-edit__section user-info-edit__section--status">
          <h2 className="user-info-edit__title user-info-edit__title--status">Статус</h2>
          <div className="custom-toggle custom-toggle--switch user-info-edit__toggle">
            <label>
              <input
                type="checkbox"
                disabled={!isEditMode}
                {...register('individualTraining', {required: false})}
              />
              <span className="custom-toggle__icon">
                <svg width="9" height="6" aria-hidden="true">
                  <use xlinkHref="#arrow-check"></use>
                </svg>
              </span>
              <span className="custom-toggle__label">Готов тренировать</span>
            </label>
          </div>
        </div>
        <div className="user-info-edit__section">
          <h2 className="user-info-edit__title user-info-edit__title--specialization">Специализация</h2>
          <div className="specialization-checkbox user-info-edit__specialization">
            {
              ProfileSpecialisationList({
                types: Object.values(Specialisation),
                trigger,
                register,
                selectedSpecs,
                isEditMode
              })
            }
          </div>
          {errors.specialisations && <span style={{color: '#e4001b'}}>{errors.specialisations.message}</span>}
        </div>
        <div ref={locationBlockRef} className={`custom-select ${!isEditMode ? 'custom-select--readonly' : ''} user-info-edit__select`}>
          <span className="custom-select__label">Локация</span>
          <input className='visually-hidden location' {...register('location')} />
          <div className="custom-select__placeholder">{getValues('location')}</div>
          <button
            className="custom-select__button"
            type="button"
            aria-label="Выберите одну из опций"
            disabled={!isEditMode}
            onClick={onOpenLocationListBtnClickHandler}
          >
            <span className="custom-select__text"></span>
            <span className="custom-select__icon">
              <svg width="15" height="6" aria-hidden="true">
                <use xlinkHref="#arrow-down"></use>
              </svg>
            </span>
          </button>
          {DropDownList({items: Object.values(Location), clickItemHandler: onClickLocationItemHandler})}
        </div>
        <div ref={genderBlockRef} className={`custom-select ${!isEditMode ? 'custom-select--readonly' : ''} user-info-edit__select`}>
          <span className="custom-select__label">Пол</span>
          <input className='visually-hidden gender' {...register('gender')} />
          <div className="custom-select__placeholder">{GenderValueType[getValues('gender')]}</div>
          <button
            className="custom-select__button"
            type="button"
            aria-label="Выберите одну из опций"
            disabled={!isEditMode}
            onClick={onOpenGenderListBtnClickHandler}
          >
            <span className="custom-select__text"></span>
            <span className="custom-select__icon">
              <svg width="15" height="6" aria-hidden="true">
                <use xlinkHref="#arrow-down"></use>
              </svg>
            </span>
          </button>
          {DropDownList({items: Object.values(GenderValueType), clickItemHandler: onClickGenderItemHandler})}
        </div>
        <div ref={skillBlockRef} className={`custom-select ${!isEditMode ? 'custom-select--readonly' : ''} user-info-edit__select`}>
          <span className="custom-select__label">Уровень</span>
          <input className='visually-hidden gender' {...register('skillLevel')} />
          <div className="custom-select__placeholder">{SkillValueType[getValues('skillLevel')]}</div>
          <button
            className="custom-select__button"
            type="button"
            aria-label="Выберите одну из опций"
            disabled={!isEditMode}
            onClick={onOpenSkillListBtnClickHandler}
          >
            <span className="custom-select__text"></span>
            <span className="custom-select__icon">
              <svg width="15" height="6" aria-hidden="true">
                <use xlinkHref="#arrow-down"></use>
              </svg>
            </span>
          </button>
          {DropDownList({items: Object.values(SkillValueType), clickItemHandler: onClickSkillItemHandler})}
        </div>
      </form>
    </section>
  );
}
