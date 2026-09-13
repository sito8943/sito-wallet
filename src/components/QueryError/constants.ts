// A failed `fetch` surfaces as a generic TypeError whose message differs per
// engine, so the offline case can only be recognised by the message itself.
export const NETWORK_ERROR_FRAGMENTS = [
  "failed to fetch",
  "load failed",
  "networkerror",
  "network request failed",
  "connection",
];

// A route/section is code-split, so navigating to one while the chunk is
// missing throws from the dynamic import. Each engine words it differently.
export const CHUNK_LOAD_ERROR_FRAGMENTS = [
  "dynamically imported module",
  "importing a module script failed",
  "failed to load module script",
  "chunkloaderror",
];

export const OFFLINE_ERROR_KEY = "_accessibility:errors.offline";
export const CHUNK_LOAD_ERROR_KEY = "_accessibility:errors.chunkLoad";
