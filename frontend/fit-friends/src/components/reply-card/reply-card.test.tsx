import { render, screen } from '@testing-library/react';
import { createReplyMocks } from 'src/mock-constants';
import ReplyCard from './reply-card';

const [mockCard] = createReplyMocks(1);

describe('Component: ReplyCard', () => {
  it('should render correctly', () => {

    render(<ReplyCard card={mockCard} />);

    expect(screen.getByAltText('Изображение пользователя')).toBeInTheDocument();
    expect(screen.getByText(mockCard.author.name)).toBeInTheDocument();
    expect(screen.getByText(mockCard.text)).toBeInTheDocument();
    expect(screen.getByText(mockCard.rating)).toBeInTheDocument();
  });
});
