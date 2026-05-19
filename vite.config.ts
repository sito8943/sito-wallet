import { existsSync, lstatSync } from "node:fs";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import mkcert from "vite-plugin-mkcert";
import { VitePWA } from "vite-plugin-pwa";

const projectRoot = path.resolve(__dirname);
const linkedDashboardAppRoot = path.resolve(
  projectRoot,
  "../../lib/-sito-dashboard-app",
);
const linkedDashboardRoot = path.resolve(
  linkedDashboardAppRoot,
  "node_modules/@sito/dashboard",
);
const appDashboardAppRoot = path.resolve(
  projectRoot,
  "node_modules/@sito/dashboard-app",
);
const linkedDashboardEntry = path.resolve(linkedDashboardRoot, "dist/index.js");
const linkedDashboardAppEntry = path.resolve(
  linkedDashboardAppRoot,
  "dist/dashboard-app.js",
);
const appReactRoot = path.resolve(projectRoot, "node_modules/react");
const appReactDomRoot = path.resolve(projectRoot, "node_modules/react-dom");

function pathExists(targetPath: string): boolean {
  return existsSync(targetPath);
}

function isSymlink(targetPath: string): boolean {
  try {
    return lstatSync(targetPath).isSymbolicLink();
  } catch {
    return false;
  }
}

function isWithinPath(targetPath: string, parentPath: string): boolean {
  const relativePath = path.relative(parentPath, targetPath);
  return (
    relativePath === "" ||
    (!relativePath.startsWith("..") && !path.isAbsolute(relativePath))
  );
}

function shouldBlockFsRequest(
  requestPath: string,
  externalAllowedRoots: string[] = [],
): boolean {
  const normalizedRequestPath = requestPath
    .split(path.sep)
    .join("/")
    .toLowerCase();

  const isSensitiveFile =
    /(^|\/)\.env($|[./])/.test(normalizedRequestPath) ||
    normalizedRequestPath.endsWith(".pem") ||
    normalizedRequestPath.endsWith(".crt") ||
    normalizedRequestPath.endsWith(".key");

  const isGitPath = normalizedRequestPath.includes("/.git/");

  if (isSensitiveFile || isGitPath) return true;

  const relativeToRoot = path.relative(projectRoot, requestPath);
  const isOutsideProject =
    relativeToRoot.startsWith("..") || path.isAbsolute(relativeToRoot);

  if (!isOutsideProject) return false;

  const isAllowedExternalPath = externalAllowedRoots.some((allowedRoot) =>
    isWithinPath(requestPath, allowedRoot),
  );

  return !isAllowedExternalPath;
}

function rawFsDenyGuard(externalAllowedRoots: string[] = []) {
  return {
    name: "raw-fs-deny-guard",
    configureServer(server: {
      middlewares: {
        use: (
          fn: (
            req: { url?: string | undefined },
            res: {
              statusCode: number;
              setHeader: (name: string, value: string) => void;
              end: (body?: string) => void;
            },
            next: () => void,
          ) => void,
        ) => void;
      };
    }) {
      server.middlewares.use((req, res, next) => {
        const reqUrl = req.url;
        if (!reqUrl) return next();

        const [pathname, rawSearch = ""] = reqUrl.split("?");
        const searchParams = new URLSearchParams(rawSearch);
        const hasRaw = searchParams.has("raw");
        const hasInline = searchParams.has("inline");
        const hasImport = searchParams.has("import");
        const hasUrl = searchParams.has("url");

        const decodedPathname = decodeURIComponent(pathname);
        const normalizedPathname = decodedPathname.replace(/\\/g, "/");
        const pathnameSegments = normalizedPathname.split("/");
        const hasBackslashInPath =
          decodedPathname.includes("\\") || /%5c/i.test(pathname);
        const hasPathTraversal =
          pathnameSegments.includes("..") ||
          normalizedPathname.includes("/../");
        const hasCurrentDirSegment =
          pathnameSegments.includes(".") || normalizedPathname.includes("/./");
        const isSvgRequest = normalizedPathname.toLowerCase().endsWith(".svg");
        const touchesFs = normalizedPathname.startsWith("/@fs/");
        const isPotentialBypassQuery =
          hasRaw || hasInline || hasImport || hasUrl;
        const shouldInspectRequest =
          isPotentialBypassQuery ||
          hasPathTraversal ||
          hasCurrentDirSegment ||
          hasBackslashInPath ||
          isSvgRequest ||
          touchesFs;
        if (!shouldInspectRequest) return next();

        const fsPath = touchesFs
          ? (() => {
              const rawFsPath = normalizedPathname.slice("/@fs/".length);
              if (/^[a-z]:\//i.test(rawFsPath)) return rawFsPath;
              return `/${rawFsPath.replace(/^\/+/, "")}`;
            })()
          : path.resolve(projectRoot, `.${normalizedPathname}`);
        const resolvedFsPath = path.resolve(fsPath);

        if (
          !hasPathTraversal &&
          !hasBackslashInPath &&
          !shouldBlockFsRequest(resolvedFsPath, externalAllowedRoots)
        ) {
          return next();
        }

        res.statusCode = 403;
        res.setHeader("Content-Type", "text/plain; charset=utf-8");
        res.end("Forbidden");
      });
    },
  };
}

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
  const useLinkedDashboardApp =
    command === "serve" &&
    mode === "development" &&
    isSymlink(appDashboardAppRoot) &&
    pathExists(linkedDashboardAppEntry) &&
    pathExists(linkedDashboardEntry);
  const externalAllowedRoots = useLinkedDashboardApp
    ? [linkedDashboardAppRoot, linkedDashboardRoot]
    : [];
  const fsAllowRoots = [projectRoot, ...externalAllowedRoots];
  const linkedPackageAliases = useLinkedDashboardApp
    ? [
        {
          find: /^@sito\/dashboard-app$/,
          replacement: linkedDashboardAppEntry,
        },
        {
          find: /^@sito\/dashboard$/,
          replacement: linkedDashboardEntry,
        },
      ]
    : [];

  return {
    plugins: [
      react(),
      tailwindcss(),
      mkcert(),
      rawFsDenyGuard(externalAllowedRoots),
      VitePWA({
        registerType: "prompt",
        injectRegister: "auto",
        includeAssets: [
          "favicon.svg",
          "apple-touch-icon.png",
          "pwa-192x192.png",
          "pwa-512x512.png",
        ],
        manifest: {
          name: "Sito Wallet",
          short_name: "Wallet",
          description:
            "Manage accounts, transactions, subscriptions, and balances from a single wallet app.",
          start_url: "/",
          scope: "/",
          display: "standalone",
          background_color: "#f2f2f2",
          theme_color: "#041e42",
          lang: "es",
          icons: [
            {
              src: "pwa-192x192.png",
              sizes: "192x192",
              type: "image/png",
            },
            {
              src: "pwa-512x512.png",
              sizes: "512x512",
              type: "image/png",
            },
          ],
        },
        workbox: {
          navigateFallback: "index.html",
          cleanupOutdatedCaches: true,
          clientsClaim: true,
          skipWaiting: false,
          globPatterns: ["**/*.{js,css,html,ico,png,svg,webp,woff2}"],
        },
      }),
    ],
    server: {
      https: {},
      fs: {
        strict: true,
        allow: fsAllowRoots,
        deny: [".env", ".env.*", "*.pem", "*.crt", "*.key", ".git/**"],
      },
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: (id) => {
            if (!id.includes("node_modules")) return;
            if (
              id.includes("/react/") ||
              id.includes("/react-dom/") ||
              id.includes("/react-router-dom/")
            ) {
              return "vendor-react";
            }
            if (
              id.includes("/i18next/") ||
              id.includes("/react-i18next/") ||
              id.includes("/i18next-browser-languagedetector/")
            ) {
              return "vendor-i18n";
            }
            if (id.includes("/@tanstack/react-query/")) return "vendor-query";
            if (
              id.includes("/@sito/dashboard-app/") ||
              id.includes("/@sito/dashboard/")
            ) {
              return "vendor-sito";
            }
            if (id.includes("/@fortawesome/")) return "vendor-icons";
            if (id.includes("/react-tooltip/")) return "vendor-tooltip";
            return;
          },
        },
      },
    },
    resolve: {
      dedupe: ["react", "react-dom"],
      alias: [
        ...linkedPackageAliases,
        { find: /^react$/, replacement: appReactRoot },
        { find: /^react\/(.*)$/, replacement: `${appReactRoot}/$1` },
        { find: /^react-dom$/, replacement: appReactDomRoot },
        { find: /^react-dom\/(.*)$/, replacement: `${appReactDomRoot}/$1` },
        {
          find: "assets",
          replacement: path.resolve(__dirname, "./src/assets"),
        },
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
  };
});
