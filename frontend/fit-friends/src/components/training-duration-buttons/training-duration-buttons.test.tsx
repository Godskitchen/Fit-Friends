import { render, screen } from '@testing-library/react';
import { DurationFieldValue, TrainingDuration } from 'src/types/constants';
import TrainingDurationButtons from './training-duration-buttons';

describe('Component: TrainingDurationButtons', () => {
  it('should render correctly', () => {

    render(
      <TrainingDurationButtons
        register={jest.fn()}
        durations={Object.values(TrainingDuration)}
      />
    );

    expect(screen.getByText('Сколько времени вы готовы уделять на тренировку в день')).toBeInTheDocument();
    expect(screen.getByText(DurationFieldValue.EightyToOneHundredMinutes)).toBeInTheDocument();
    expect(screen.getByText(DurationFieldValue.FiftyToEightyMinutes)).toBeInTheDocument();
    expect(screen.getByText(DurationFieldValue.TenToThirtyMinutes)).toBeInTheDocument();
    expect(screen.getByText(DurationFieldValue.ThirtyToFiftyMinutes)).toBeInTheDocument();
  });
});
