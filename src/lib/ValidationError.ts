export interface ValidationError extends Error {
  errors: string[];
}
