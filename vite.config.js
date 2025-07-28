import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";
import path from "path";

const manifestForPlugIn = {
  registerType: "prompt",
  includeAssets: ["favicon.ico", "robots.txt", "maskable-icon.png"],
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
  manifest: {
    name: "Sito Wallet",
    short_name: "Sito Wallet",
    description: "Aplicación de gestión de cuentas de ahorro de Sito",
    icons: [
      {
        src: "favicon.ico",
        sizes: "16x16",
        type: "image/x-icon",
      },
      {
        src: "/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
        purpose: "apple touch icon",
      },
      {
        src: "/maskable_icon.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any maskable",
      },
    ],
    theme_color: "#222333",
    background_color: "#1b1b1b",
    display: "standalone",
    start_url: ".",
    orientation: "portrait",
  },
  devOptions: {
    enabled: true,
  },
};

export default defineConfig({
  plugins: [react(), VitePWA(manifestForPlugIn), tailwindcss()],
});
