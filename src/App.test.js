import { render, screen } from '@testing-library/react';
import App from './App';

// Mock @vercel/analytics to avoid ESM resolution issues in Jest
jest.mock('@vercel/analytics/react', () => ({
  Analytics: () => null,
}));

test('renders app without crashing', () => {
  const { container } = render(<App />);
  expect(container).toBeInTheDocument();
});
