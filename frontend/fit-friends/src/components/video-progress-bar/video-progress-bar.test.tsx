import { render, screen } from '@testing-library/react';
import VideoProgressBar from './video-progress-bar';

describe('Component VideoProgressBar', () => {
  it('should render correctly', () => {

    const mockProps = {
      duration: 50,
      currentTime: 10
    };

    render( <VideoProgressBar {...mockProps} />);

    expect(screen.getByTestId<HTMLProgressElement>('progress-bar')).toBeInTheDocument();
    expect(screen.getByTestId<HTMLProgressElement>('progress-bar').value).toEqual((mockProps.currentTime / mockProps.duration) * 100);
  });
});
