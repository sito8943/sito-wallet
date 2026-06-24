export interface MutationErrorConfig {
  /** Translation key shown on a 409 (unique constraint) response. */
  uniqueKey?: string;
  /**
   * Handling for a 400 (bad request) response: surfaces the backend message,
   * falling back to this translation key when no message is provided.
   */
  badRequest?: {
    fallbackKey: string;
  };
}

export type MutationErrorHandler = (
  error: unknown,
  config?: MutationErrorConfig,
) => void;
