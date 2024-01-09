import { render, screen } from '@testing-library/react';
import { SkillFieldValue, SkillLevel } from 'src/types/constants';
import SkillButtons from './skill-buttons';

describe('Component: SkillButtons', () => {
  it('should render correctly', () => {

    render(
      <SkillButtons
        register={jest.fn()}
        skills={Object.values(SkillLevel)}
        fieldPaths={{skillLevel: 'skillLevel'}}
      />
    );

    expect(screen.getByText('Ваш уровень')).toBeInTheDocument();
    expect(screen.getByText(SkillFieldValue.Amateur)).toBeInTheDocument();
    expect(screen.getByText(SkillFieldValue.Beginner)).toBeInTheDocument();
    expect(screen.getByText(SkillFieldValue.Pro)).toBeInTheDocument();
  });
});
