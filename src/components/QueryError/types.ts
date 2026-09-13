export type QueryErrorPropsType = {
  error?: unknown;
  className?: string;
  onRetry?: () => void;
  resetErrorBoundary?: (...args: unknown[]) => void;
};
