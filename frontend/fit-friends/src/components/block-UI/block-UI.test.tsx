import { render, screen } from '@testing-library/react';
import BlockUI from './block-UI';

describe('Component blockUI', () => {
  it('should render correctly', () => {

    render(<BlockUI />);

    expect(screen.getByTestId('block-ui-container')).toBeInTheDocument();
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });
});
