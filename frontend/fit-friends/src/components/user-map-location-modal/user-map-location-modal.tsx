import { MutableRefObject, useCallback, useEffect, useRef } from 'react';
import { useMap } from 'src/hooks/useMap';
import { Location, UserCoordsLocation } from 'src/types/constants';

import 'leaflet/dist/leaflet.css';
import { DivIcon, Marker } from 'leaflet';
import { handleKeyDown } from 'src/utils/helpers';

type UserMapLocationProps = {
  isModalOpen: boolean;
  userName: string;
  userLocation: Location;
  closeModalBtnRef: MutableRefObject<HTMLButtonElement | null>;
  closeModal: () => void;
}

const ZOOM = 16;

export default function UserMapLocationModal({isModalOpen, closeModal, userName, userLocation, closeModalBtnRef }: UserMapLocationProps): JSX.Element {
  const modalRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<HTMLDivElement | null>(null);
  const map = useMap(mapRef, UserCoordsLocation[userLocation]);

  const keyDownModalHandler = useCallback(
    ((evt: globalThis.KeyboardEvent) => handleKeyDown(evt, modalRef, closeModal)), [closeModal]
  );

  useEffect(() => {
    let marker: Marker;
    if (map) {
      const { latitude: lat, longitude: lng } = UserCoordsLocation[userLocation];
      map.setView({ lat, lng }, ZOOM);

      const svgIcon = new DivIcon({
        html: `
          <svg class="popup__pin-icon" width="40" height="49" aria-hidden="true">
            <use xlink:href="#icon-pin-user"></use>
          </svg>
        `,
        className: 'popup__pin popup__pin--user',
        iconSize: [40, 49],
        iconAnchor: [20, 49]
      });

      marker = new Marker({lat, lng}).setIcon(svgIcon).addTo(map);
    }

    return () => {
      if (map) {
        map.removeLayer(marker);
      }
    };
  }, [map, userLocation]);


  useEffect(() => {
    if (isModalOpen) {
      document.addEventListener('keydown', keyDownModalHandler);
    }
    return () => {
      document.removeEventListener('keydown', keyDownModalHandler);
    };
  }, [closeModal, isModalOpen, keyDownModalHandler]);

  return (
    <div
      ref={modalRef}
      className={`modal modal--success modal--no-scale modal--fit-content ${isModalOpen ? 'is-active' : ''}`}
      data-testid="location-modal"
    >
      <div className="modal__wrapper">
        <div className="popup-form popup-form--map">
          <section className="popup" style={{background: 'none'}}>
            <div className="popup__wrapper popup__wrapper--map">
              <div className="popup-head popup-head--address">
                <h2 className="popup-head__header">{userName}</h2>
                <p className="popup-head__address">
                  <svg className="popup-head__icon-location" width="12" height="14" aria-hidden="true">
                    <use xlinkHref="#icon-location"></use>
                  </svg>
                  <span>{`м. ${userLocation}`}</span>
                </p>
                <button
                  className="btn-icon btn-icon--outlined btn-icon--big"
                  type="button"
                  aria-label="close"
                  onClick={() => closeModal()}
                  ref={closeModalBtnRef}
                >
                  <svg width="20" height="20" aria-hidden="true">
                    <use xlinkHref="#icon-cross"></use>
                  </svg>
                </button>
              </div>
              <div className="popup__content-map">
                <div
                  className="popup__map"
                  ref={mapRef}
                  style={{width: '1160px', height: '623px'}}
                  data-testid="map"
                >
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
