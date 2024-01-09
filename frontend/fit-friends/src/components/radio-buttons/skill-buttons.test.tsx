import { render, screen } from '@testing-library/react';
import SkillButtons from './skill-buttons';
import { SkillFieldValue, SkillLevel } from 'src/types/constants';
import userEvent from '@testing-library/user-event';

const setterSkillValue = jest.fn();

const mockFormRef = { current: null as HTMLFormElement | null };
const mockTimeoutRef = { current: null as NodeJS.Timeout | null };
describe('Component: SkillButtons', () => {
  it('should render correctly', () => {

    render(
      <SkillButtons
        setterSkillValue={setterSkillValue}
        currentSkillValue={SkillLevel.Pro}
        timeoutRef={mockTimeoutRef}
        formRef={mockFormRef}
      />
    );

    expect(screen.getByText('Ваш уровень')).toBeInTheDocument();
    expect(screen.getByText(SkillFieldValue.Amateur)).toBeInTheDocument();
    expect(screen.getByText(SkillFieldValue.Pro)).toBeInTheDocument();
    expect(screen.getByText(SkillFieldValue.Beginner)).toBeInTheDocument();

    expect(screen.getByTestId(SkillLevel.Pro)).toBeChecked();
  });

  it('should call setterSkillValue if user clicks on not checked skill button', async () => {
    const user = userEvent.setup();
    render(
      <SkillButtons
        setterSkillValue={setterSkillValue}
        currentSkillValue={SkillLevel.Pro}
        timeoutRef={mockTimeoutRef}
        formRef={mockFormRef}
      />
    );

    const beginnerBtn = await screen.findByTestId(SkillLevel.Beginner);
    expect(beginnerBtn).not.toBeChecked();
    await user.click(beginnerBtn);
    expect(setterSkillValue).toBeCalledWith(SkillLevel.Beginner);
  });
});
