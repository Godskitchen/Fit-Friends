import {MouseEvent} from 'react';

type DropDownListProps = {
  items: string[];
  clickItemHandler: (evt: MouseEvent<HTMLUListElement>) => void;
};


export default function DropDownList({items, clickItemHandler}: DropDownListProps): JSX.Element {
  return (
    <ul className="custom-select__list" onClick={clickItemHandler} role="listbox">
      {items.map((item) => (<li key={item} className='custom-select__item'>{item}</li>))}
    </ul>
  );
}

