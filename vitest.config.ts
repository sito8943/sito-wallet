import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react-swc";
import path from "path";

const projectRoot = path.resolve(__dirname);
const appDashboardRoot = path.resolve(projectRoot, "node_modules/@sito/dashboard");
const appDashboardAppRoot = path.resolve(
  projectRoot,
  "node_modules/@sito/dashboard-app",
);
const appDashboardEntry = path.resolve(appDashboardRoot, "dist/index.js");
const appDashboardAppEntry = path.resolve(
  appDashboardAppRoot,
  "dist/dashboard-app.js",
);

export default defineConfig({
  plugins: [react() as ReturnType<typeof react>],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    css: false,
    env: {
      VITE_API_URL: "http://localhost:3000",
      VITE_THIS_URL: "http://localhost:5173",
      VITE_LANGUAGE: "en",
      VITE_BASIC_KEY: "test-key",
      VITE_ACCEPT_COOKIE: "accept-cookie",
      VITE_DECLINE_COOKIE: "decline-cookie",
      VITE_REMEMBER: "remember",
      VITE_USER: "user",
      VITE_VALIDATION_COOKIE: "validation",
      VITE_RECOVERING_COOKIE: "recovering",
      VITE_CRYPTO: "crypto-key",
      VITE_SUPABASE_CO: "https://test.supabase.co",
      VITE_SUPABASE_ANON: "test-anon-key",
      VITE_CACHE: "test-cache",
      VITE_ONBOARDING: "test-onboarding",
      VITE_GUEST_MODE: "test-guest-mode",
      VITE_RECENT_SEARCHES: "test-recent-searches",
      VITE_FEATURE_FLAGS_STORAGE_KEY: "test-feature-flags",
      VITE_FEATURE_BALANCE_GREATER_THAN_ZERO_DEFAULT: "false",
      VITE_FEATURE_CURRENCIES_ENABLED_DEFAULT: "true",
      VITE_FEATURE_ACCOUNTS_ENABLED_DEFAULT: "true",
      VITE_FEATURE_TRANSACTIONS_ENABLED_DEFAULT: "true",
      VITE_FEATURE_SUBSCRIPTIONS_ENABLED_DEFAULT: "true",
    },
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
    exclude: ["e2e/**", "node_modules/**"],
  },
  resolve: {
    alias: [
      { find: /^@sito\/dashboard-app$/, replacement: appDashboardAppEntry },
      { find: /^@sito\/dashboard$/, replacement: appDashboardEntry },
      { find: "assets", replacement: path.resolve(__dirname, "./src/assets") },
      {
        find: "components",
        replacement: path.resolve(__dirname, "./src/components"),
      },
      { find: "lib", replacement: path.resolve(__dirname, "./src/lib") },
      { find: "hooks", replacement: path.resolve(__dirname, "./src/hooks") },
      {
        find: "layouts",
        replacement: path.resolve(__dirname, "./src/layouts"),
      },
      { find: "views", replacement: path.resolve(__dirname, "./src/views") },
      {
        find: "providers",
        replacement: path.resolve(__dirname, "./src/providers"),
      },
      { find: "db", replacement: path.resolve(__dirname, "./src/db") },
      { find: "lang", replacement: path.resolve(__dirname, "./src/lang") },
    ],
  },
});
