import { MyTraining } from 'src/types/training.type';
import TrainingCard from '../training-card/training-card';

type TrainingListProps = {
  trainingCards: MyTraining[];
}
export default function MyTrainingsList({trainingCards}: TrainingListProps): JSX.Element {
  return (
    <ul className="my-trainings__list">
      {trainingCards.map((card) => <TrainingCard card={card} key={card.trainingId}/>)}
    </ul>
  );
}
