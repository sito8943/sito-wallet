export type QueryErrorPropsType = {
  error?: unknown;
  /** Copy shown when the failure isn't a connection/chunk problem. */
  message?: string;
  /** Inline variant for sidebars and cards: no icon, small text. */
  compact?: boolean;
  className?: string;
  onRetry?: () => void;
  resetErrorBoundary?: (...args: unknown[]) => void;
};
