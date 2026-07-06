import type { ReactNode } from 'react';

interface TooltipProps {
  label: string;
  children: ReactNode;
}

/**
 * CSS-only tooltip wrapper for icon buttons and other inline elements.
 *
 * Displays the label on hover/focus via the ::after pseudo-element.
 * Does not render on touch-only devices (no hover support).
 * Accessible: uses aria-describedby to associate the tooltip.
 */
export function Tooltip({ label, children }: TooltipProps) {
  return (
    <span className="tooltip" data-tooltip={label}>
      {children}
    </span>
  );
}
