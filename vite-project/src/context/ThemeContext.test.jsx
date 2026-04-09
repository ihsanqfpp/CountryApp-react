import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider, useTheme } from './ThemeContext';

const TestComponent = () => {
  const { darkMode, toggleTheme } = useTheme();
  return (
    <div>
      <span data-testid="theme-status">{darkMode ? 'Dark' : 'Light'}</span>
      <button onClick={toggleTheme}>Toggle Theme</button>
    </div>
  );
};

describe('ThemeContext', () => {
  it('provides default light theme', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(screen.getByTestId('theme-status')).toHaveTextContent('Light');
  });

  it('toggles theme when toggleTheme is called', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    const button = screen.getByText('Toggle Theme');
    const status = screen.getByTestId('theme-status');

    expect(status).toHaveTextContent('Light');
    
    // Toggle once -> Dark
    fireEvent.click(button);
    expect(status).toHaveTextContent('Dark');

    // Toggle twice -> Light
    fireEvent.click(button);
    expect(status).toHaveTextContent('Light');
  });
});
