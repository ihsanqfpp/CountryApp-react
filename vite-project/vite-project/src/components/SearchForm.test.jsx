import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SearchForm from './SearchForm';

// framer-motion is auto-mocked via /__mocks__/framer-motion.jsx

// ── Tests ─────────────────────────────────────────────────────────────────────
describe('SearchForm', () => {
  it('renders the input and button', () => {
    render(<SearchForm onSearch={vi.fn()} loading={false} />);
    expect(screen.getByPlaceholderText(/search for a country/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /explore/i })).toBeInTheDocument();
  });

  it('calls onSearch with the typed value on form submit', async () => {
    const onSearch = vi.fn();
    render(<SearchForm onSearch={onSearch} loading={false} />);

    const input = screen.getByPlaceholderText(/search for a country/i);
    await userEvent.type(input, 'Japan');
    await userEvent.click(screen.getByRole('button', { name: /explore/i }));

    expect(onSearch).toHaveBeenCalledWith('Japan');
    expect(onSearch).toHaveBeenCalledTimes(1);
  });

  it('submits when the Enter key is pressed inside the input', async () => {
    const onSearch = vi.fn();
    render(<SearchForm onSearch={onSearch} loading={false} />);

    const input = screen.getByPlaceholderText(/search for a country/i);
    await userEvent.type(input, 'Brazil{enter}');

    expect(onSearch).toHaveBeenCalledWith('Brazil');
  });

  it('disables the button when loading is true', () => {
    render(<SearchForm onSearch={vi.fn()} loading={true} />);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('disables the button when input is empty (trim check)', () => {
    render(<SearchForm onSearch={vi.fn()} loading={false} />);
    const button = screen.getByRole('button', { name: /explore/i });
    // Input is empty by default — button should be disabled
    expect(button).toBeDisabled();
  });

  it('enables the button once user types a non-empty value', async () => {
    render(<SearchForm onSearch={vi.fn()} loading={false} />);
    const input = screen.getByPlaceholderText(/search for a country/i);
    const button = screen.getByRole('button', { name: /explore/i });

    expect(button).toBeDisabled();
    await userEvent.type(input, 'India');
    expect(button).not.toBeDisabled();
  });

  it('shows "Searching..." text while loading', () => {
    render(<SearchForm onSearch={vi.fn()} loading={true} />);
    expect(screen.getByText(/searching/i)).toBeInTheDocument();
  });
});
