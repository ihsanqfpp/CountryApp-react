import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ThemeToggle from './ThemeToggle';
import { ThemeProvider } from '../context/ThemeContext';
import * as ThemeContextModule from '../context/ThemeContext';

// Mock useTheme to verify we can control its return values
vi.mock('../context/ThemeContext', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useTheme: vi.fn(),
  };
});

describe('ThemeToggle Component', () => {
  it('renders Light Mode and Sun icon when darkMode is true', () => {
    ThemeContextModule.useTheme.mockReturnValue({
      darkMode: true,
      toggleTheme: vi.fn(),
    });

    render(<ThemeToggle />);
    expect(screen.getByText(/Light Mode/i)).toBeInTheDocument();
  });

  it('renders Dark Mode and Moon icon when darkMode is false', () => {
    ThemeContextModule.useTheme.mockReturnValue({
      darkMode: false,
      toggleTheme: vi.fn(),
    });

    render(<ThemeToggle />);
    expect(screen.getByText(/Dark Mode/i)).toBeInTheDocument();
  });

  it('calls toggleTheme on click', () => {
    const mockToggleTheme = vi.fn();
    ThemeContextModule.useTheme.mockReturnValue({
      darkMode: false,
      toggleTheme: mockToggleTheme,
    });

    render(<ThemeToggle />);
    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(mockToggleTheme).toHaveBeenCalledTimes(1);
  });
});
