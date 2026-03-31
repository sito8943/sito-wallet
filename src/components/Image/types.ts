import type { ImgHTMLAttributes, ReactNode } from "react";

export type ImagePropsType = Omit<ImgHTMLAttributes<HTMLImageElement>, "src"> & {
  endpoint: string;
  fallback?: ReactNode;
  token?: string;
  baseUrl?: string;
};
