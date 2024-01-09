import { render, screen } from '@testing-library/react';
import { Role } from 'src/types/constants';
import RoleButtons from './role-buttons';

describe('Component: RoleButtons', () => {
  it('should render correctly', () => {

    render(
      <RoleButtons
        register={jest.fn()}
        roles={Object.values(Role)}
      />
    );

    expect(screen.getByText('Выберите роль')).toBeInTheDocument();
    expect(screen.getByText('Я хочу тренировать')).toBeInTheDocument();
    expect(screen.getByText('Я хочу тренироваться')).toBeInTheDocument();
  });
});
