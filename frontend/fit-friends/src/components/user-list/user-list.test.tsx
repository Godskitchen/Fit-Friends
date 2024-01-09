import { render, screen } from '@testing-library/react';
import UserList from './user-list';
import { createUserMocks } from 'src/mock-constants';
import { MemoryRouter } from 'react-router-dom';

describe('Component: UserList', () => {
  it('should render correctly', () => {

    render(
      <MemoryRouter>
        <UserList userCards={createUserMocks(6)}/>
      </MemoryRouter>
    );

    expect(screen.getAllByTestId('user-card')).toHaveLength(6);
  });
});
