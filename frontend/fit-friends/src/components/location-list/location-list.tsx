import { Location } from 'src/types/constants';
import {MouseEvent} from 'react';

type LocationListProps = {
  locations: Location[];
  clickItemHandler: (evt: MouseEvent<HTMLUListElement>) => void;
};

export default function LocationList({locations, clickItemHandler}: LocationListProps): JSX.Element {
  return (
    <ul className="custom-select__list" onClick={clickItemHandler} role="listbox">
      {locations.map((item) => (<li key={item} className='custom-select__item'>{`ст. м. ${item}`}</li>))}
    </ul>
  );
}

