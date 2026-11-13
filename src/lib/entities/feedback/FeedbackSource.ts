/**
 * How a feedback entry was sent: the app itself (WEB), an agent using a
 * personal API key (KEY) or an app connected over OAuth, e.g. ChatGPT (APP).
 */
export type FeedbackSource = "WEB" | "KEY" | "APP";
