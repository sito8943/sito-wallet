import type { ImgHTMLAttributes, ReactNode } from "react";

export type ImagePropsType = Omit<
  ImgHTMLAttributes<HTMLImageElement>,
  "src"
> & {
  endpoint: string;
  fallback?: ReactNode;
  token?: string;
  baseUrl?: string;
  /** Called when the authenticated fetch fails (not on abort). */
  onLoadError?: () => void;
};
