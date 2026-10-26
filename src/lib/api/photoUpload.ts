import { Methods } from "@sito/dashboard-app";

import { parseErrorMessage } from "lib";

import type {
  PhotoUploadRequestConfig,
  PhotoUploadRequestOptions,
} from "./types";

const isRequestOptions = (
  value: PhotoUploadRequestConfig | undefined,
): value is PhotoUploadRequestOptions =>
  Boolean(
    value &&
    typeof value === "object" &&
    !Array.isArray(value) &&
    !(value instanceof Headers) &&
    ("headers" in value || "credentials" in value),
  );

/**
 * PATCHes a photo as multipart/form-data. APIClient only sends JSON, so the
 * upload goes through fetch with the client's own auth config.
 */
export async function uploadEntityPhoto<TResult>(
  url: string,
  file: File,
  tokenConfig: PhotoUploadRequestConfig | undefined,
): Promise<TResult> {
  const formData = new FormData();
  formData.append("file", file);
  const requestConfig: PhotoUploadRequestOptions = isRequestOptions(tokenConfig)
    ? tokenConfig
    : { headers: tokenConfig };

  const response = await fetch(url, {
    method: Methods.PATCH,
    headers: requestConfig.headers,
    credentials: requestConfig.credentials,
    body: formData,
  });

  const payloadText = await response.text();
  let payload: unknown = null;
  let isText = false;

  try {
    payload = payloadText ? JSON.parse(payloadText) : null;
  } catch {
    isText = true;
    payload = payloadText;
  }

  if (!response.ok) {
    throw {
      status: response.status,
      message: parseErrorMessage(payload, response.statusText),
    };
  }

  if (isText) {
    return { photo: payload as string } as TResult;
  }

  if (!payload || typeof payload !== "object") {
    throw {
      status: response.status,
      message: "Unknown error",
    };
  }

  return payload as TResult;
}
