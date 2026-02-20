import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import mkcert from "vite-plugin-mkcert";

const projectRoot = path.resolve(__dirname);

function shouldBlockFsRequest(requestPath: string): boolean {
  const normalizedRequestPath = requestPath.split(path.sep).join("/").toLowerCase();

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

  return isOutsideProject;
}

function rawFsDenyGuard() {
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
        const isPotentialBypassQuery = hasRaw || hasInline || hasImport || hasUrl;
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
          !shouldBlockFsRequest(resolvedFsPath)
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
export default defineConfig({
  plugins: [react(), tailwindcss(), mkcert(), rawFsDenyGuard()],
  server: {
    fs: {
      strict: true,
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
