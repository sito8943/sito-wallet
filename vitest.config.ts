import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react-swc";
import path from "path";

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
    },
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
    exclude: ["e2e/**", "node_modules/**"],
  },
  resolve: {
    alias: {
      assets: path.resolve(__dirname, "./src/assets"),
      components: path.resolve(__dirname, "./src/components"),
      lib: path.resolve(__dirname, "./src/lib"),
      hooks: path.resolve(__dirname, "./src/hooks"),
      layouts: path.resolve(__dirname, "./src/layouts"),
      views: path.resolve(__dirname, "./src/views"),
      providers: path.resolve(__dirname, "./src/providers"),
      db: path.resolve(__dirname, "./src/db"),
      lang: path.resolve(__dirname, "./src/lang"),
    },
  },
});
