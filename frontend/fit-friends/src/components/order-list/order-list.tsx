import { OrderCardType } from 'src/types/order.type';
import OrderCard from '../order-card/order-card';

type OrderListProps = {
  cards: OrderCardType[];
}
export default function OrderList({cards}: OrderListProps): JSX.Element {
  let idCounter = 0;
  return (
    <ul className="my-orders__list">
      {
        cards.map((card) => (
          <OrderCard
            key={idCounter++}
            training={card.training}
            sum={card.sum}
            trainingCount={card.trainingCount}
          />
        ))
      }
    </ul>
  );
}
