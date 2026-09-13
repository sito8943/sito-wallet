// A failed `fetch` surfaces as a generic TypeError whose message differs per
// engine, so the offline case can only be recognised by the message itself.
export const NETWORK_ERROR_FRAGMENTS = [
  "failed to fetch",
  "load failed",
  "networkerror",
  "network request failed",
  "connection",
];
