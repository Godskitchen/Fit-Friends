import { TrainingCardType } from 'src/types/training.type';
import TrainingCard from '../training-card/training-card';

type TrainingListProps = {
  trainingCards: TrainingCardType[];
  listClassName: string;
  itemClassName: string;
}
export default function TrainingsList({trainingCards, listClassName, itemClassName}: TrainingListProps): JSX.Element {
  let cardId = 0;
  return (
    <ul className={listClassName}>
      {
        trainingCards.map((card) => (
          <TrainingCard
            card={card}
            key={cardId++}
            className={itemClassName}
          />
        ))
      }
    </ul>
  );
}
