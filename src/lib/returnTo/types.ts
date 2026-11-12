/** What is kept in sessionStorage while the user signs in. */
export interface StoredReturnTo {
  /** In-app path with search and hash, e.g. "/oauth/consent?request=abc". */
  path: string;
  /** Epoch ms when it was stored. */
  savedAt: number;
}
