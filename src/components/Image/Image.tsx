import {
  ImgHTMLAttributes,
  ReactNode,
  useEffect,
  useMemo,
  useState,
} from "react";

// @sito/dashboard-app
import { useAuth } from "@sito/dashboard-app";

// config
import { config } from "../../config";

type ImagePropsType = Omit<ImgHTMLAttributes<HTMLImageElement>, "src"> & {
  endpoint: string;
  fallback?: ReactNode;
  token?: string;
  baseUrl?: string;
};

const resolveUrl = (endpoint: string, baseUrl: string) => {
  if (/^https?:\/\//i.test(endpoint)) return endpoint;
  return `${baseUrl}${endpoint}`;
};

export const Image = (props: ImagePropsType) => {
  const { endpoint, fallback = null, token, baseUrl, ...rest } = props;
  const { account } = useAuth();

  const [src, setSrc] = useState<string | null>(null);

  const parsedUrl = useMemo(
    () => resolveUrl(endpoint, baseUrl ?? config.apiUrl),
    [baseUrl, endpoint]
  );

  const parsedToken = token ?? account?.token ?? "";

  useEffect(() => {
    let currentUrl: string | null = null;
    let disposed = false;
    const controller = new AbortController();

    const clearSource = () => {
      if (disposed) return;
      setSrc((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return null;
      });
    };

    if (!parsedToken || !endpoint.length) {
      clearSource();
      return;
    }

    clearSource();

    (async () => {
      try {
        const response = await fetch(parsedUrl, {
          headers: {
            Authorization: `Bearer ${parsedToken}`,
          },
          signal: controller.signal,
        });

        if (!response.ok) throw new Error(String(response.status));

        const blob = await response.blob();
        currentUrl = URL.createObjectURL(blob);

        if (disposed) return;

        setSrc((prev) => {
          if (prev) URL.revokeObjectURL(prev);
          return currentUrl;
        });
      } catch {
        clearSource();
      }
    })();

    return () => {
      disposed = true;
      controller.abort();
      if (currentUrl) URL.revokeObjectURL(currentUrl);
    };
  }, [endpoint, parsedToken, parsedUrl]);

  if (!src) return <>{fallback}</>;

  return <img src={src} {...rest} />;
};
