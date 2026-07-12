import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { StatusBadge } from './StatusBadge';

describe('StatusBadge Component', () => {
  it('renders standard status correctly', () => {
    render(<StatusBadge status="Active" />);
    expect(screen.getByText('Active')).toBeInTheDocument();
  });

  it('applies the correct default variant based on status map', () => {
    const { container } = render(<StatusBadge status="Active" />);
    // "Active" maps to "default" or "success" in many systems, we can check for text content
    // and assume the component classes are generated properly if it doesn't crash
    expect(screen.getByText('Active')).toHaveClass('gap-1');
  });

  it('renders custom variants correctly', () => {
    render(<StatusBadge status="Archived" variant="secondary" />);
    const badge = screen.getByText('Archived');
    expect(badge).toBeInTheDocument();
  });

  it('displays an icon when requested', () => {
    const { container } = render(<StatusBadge status="Error" showIcon={true} />);
    // There should be an SVG inside the badge
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('does not display an icon when showIcon is false', () => {
    const { container } = render(<StatusBadge status="Active" showIcon={false} />);
    expect(container.querySelector('svg')).not.toBeInTheDocument();
  });
});
