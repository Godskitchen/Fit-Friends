import {MouseEvent} from 'react';

type DropDownListProps = {
  items: string[];
  clickItemHandler: (evt: MouseEvent<HTMLUListElement>) => void;
  valuePrefix?: string;
};


export default function DropDownList({items, clickItemHandler, valuePrefix}: DropDownListProps): JSX.Element {
  return (
    <ul className="custom-select__list" onClick={clickItemHandler} role="listbox">
      {items.map((item) => (<li key={item} className='custom-select__item'>{`${valuePrefix ? valuePrefix : ''}${item}`}</li>))}
    </ul>
  );
}

