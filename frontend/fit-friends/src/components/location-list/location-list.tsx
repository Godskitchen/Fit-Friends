import { Location } from 'src/types/constants';
import {MouseEvent} from 'react';

type LocationListProps = {
  locations: Location[];
  clickItemHandler: (evt: MouseEvent<HTMLUListElement>) => void;
};


export default function LocationList({locations, clickItemHandler}: LocationListProps): JSX.Element {
  return (
    <ul className="custom-select__list" onClick={clickItemHandler} role="listbox">
      {locations.map((location) => (<li key={location} className='custom-select__item'>{location}</li>))}
    </ul>
  );
}

