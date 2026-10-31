import { fireEvent, render, screen } from '@testing-library/react';
import TrainerSelection from './trainer';

test('selects an applicant after the interview and meeting link are provided', () => {
  const profile = {
    name: 'Asha Patel',
    email: 'asha@example.com',
    phone: '555-0100',
    qualification: 'Yoga instructor',
    resume: 'asha-resume.pdf',
  };
  const onSelectTrainer = jest.fn();

  render(
    <TrainerSelection
      profile={profile}
      selectedTrainer={null}
      onSelectTrainer={onSelectTrainer}
      onBack={jest.fn()}
    />
  );

  fireEvent.click(screen.getByLabelText(/zoom interview successfully cleared/i));
  fireEvent.change(screen.getByLabelText(/student session meeting link/i), {
    target: { value: 'https://zoom.us/j/123456789' },
  });
  fireEvent.click(screen.getByRole('button', { name: /select as trainer/i }));

  expect(onSelectTrainer).toHaveBeenCalledWith({
    ...profile,
    studentMeetingUrl: 'https://zoom.us/j/123456789',
    completedClassDates: [],
  });
});

test('records and displays completed class dates with their weekdays', () => {
  const profile = {
    name: 'Asha Patel',
    email: 'asha@example.com',
    phone: '555-0100',
    qualification: 'Yoga instructor',
    resume: 'asha-resume.pdf',
  };
  const today = new Date();
  const classDate = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, '0'),
    String(today.getDate()).padStart(2, '0'),
  ].join('-');
  const selectedTrainer = {
    ...profile,
    studentMeetingUrl: 'https://zoom.us/j/123456789',
    completedClassDates: [],
  };
  const onSelectTrainer = jest.fn();

  const { rerender } = render(
    <TrainerSelection
      profile={profile}
      selectedTrainer={selectedTrainer}
      onSelectTrainer={onSelectTrainer}
      onBack={jest.fn()}
    />
  );

  fireEvent.change(screen.getByLabelText(/class date/i), {
    target: { value: classDate },
  });
  fireEvent.click(
    screen.getByRole('button', { name: /add completed class date/i })
  );

  expect(onSelectTrainer).toHaveBeenCalledWith({
    ...selectedTrainer,
    completedClassDates: [classDate],
  });

  const [year, month, day] = classDate.split('-').map(Number);
  const expectedLabel = new Date(year, month - 1, day).toLocaleDateString(
    'en-US',
    { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
  );
  rerender(
    <TrainerSelection
      profile={profile}
      selectedTrainer={{
        ...selectedTrainer,
        completedClassDates: [classDate],
      }}
      onSelectTrainer={onSelectTrainer}
      onBack={jest.fn()}
    />
  );

  expect(
    screen.getByRole('heading', { name: 'Completed classes (1)' })
  ).toBeInTheDocument();
  expect(screen.getByText(expectedLabel)).toBeInTheDocument();
});
