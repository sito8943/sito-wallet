export type QueryErrorPropsType = {
  error?: Error | null;
  className?: string;
  onRetry?: () => void;
};
