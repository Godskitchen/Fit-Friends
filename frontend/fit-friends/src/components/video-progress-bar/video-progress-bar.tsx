
type barProps = {
  currentTime: number;
  duration: number;
}

export default function VideoProgressBar({ currentTime, duration }: barProps): JSX.Element {
  const percentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <progress className="player__progress__bar" value={percentage} max="100" data-testid='progress-bar'></progress>
  );
}
