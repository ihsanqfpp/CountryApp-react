import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import Loader from './Loader';

describe('Loader Component', () => {
  it('renders without crashing', () => {
    const { container } = render(<Loader />);
    const loaderElement = container.querySelector('.loading-skeleton');
    expect(loaderElement).toBeInTheDocument();
  });
});
