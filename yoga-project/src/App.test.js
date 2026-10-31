import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the yoga trainer application home page', () => {
  render(<App />);
  expect(
    screen.getByRole('heading', { name: /teach with presence\. grow with purpose\./i })
  ).toBeInTheDocument();
});
