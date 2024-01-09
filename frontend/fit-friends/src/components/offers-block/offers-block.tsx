import { useEffect } from 'react';
import OfferList from './offer-list';
import { useAppDispatch, useAppSelector } from 'src/hooks';
import { getSpecialOffersList } from 'src/store/app-data/app-data.selectors';
import LoadingBlock from '../loading-components/loading-block';
import { getSpecialOffersListAction } from 'src/store/api-actions';
import { TrainingsCatalogFiltersState } from 'src/types/queries-filters.type';


const initialQuery: TrainingsCatalogFiltersState = {
  limit: '3',
  discount: true,
};

export default function OffersBlock(): JSX.Element {

  const dispatch = useAppDispatch();
  const offerList = useAppSelector(getSpecialOffersList);

  useEffect(() => {
    dispatch(getSpecialOffersListAction(initialQuery));
  }, [dispatch]);

  if (!offerList) {
    return <LoadingBlock />;
  }

  return (
    <section className="special-offers">
      <div className="container">
        <div className="special-offers__wrapper">
          <h2 className="visually-hidden">Специальные предложения</h2>
          <OfferList offers={offerList} />
          <div className="thumbnail-spec-gym">
            <div className="thumbnail-spec-gym__image">
              <picture>
                <source type="image/webp" srcSet="/img/content/thumbnails/nearest-gym-01.webp, /img/content/thumbnails/nearest-gym-01@2x.webp 2x" />
                <img src="/img/content/thumbnails/nearest-gym-01.jpg" srcSet="/img/content/thumbnails/nearest-gym-01@2x.jpg 2x" width="330" height="190" alt="" />
              </picture>
            </div>
            <div className="thumbnail-spec-gym__header">
              <h3 className="thumbnail-spec-gym__title">Скоро здесь появится что - то полезное</h3>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
