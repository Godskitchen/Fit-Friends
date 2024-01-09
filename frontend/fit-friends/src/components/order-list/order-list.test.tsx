import { render, screen } from '@testing-library/react';
import OrderList from './order-list';
import { MemoryRouter } from 'react-router-dom';
import { createOrderMocks } from 'src/mock-constants';

describe('Component: OrderList', () => {
  it('should render correctly', () => {

    render(
      <MemoryRouter>
        <OrderList cards={createOrderMocks(6)}/>
      </MemoryRouter>
    );

    expect(screen.getAllByTestId('order-card')).toHaveLength(6);
  });
});
