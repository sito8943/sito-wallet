import { config } from "../../../config";

const isAnError = (status: number) => status < 200 || status > 299;

export enum Methods {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  PATCH = "PATCH",
  DELETE = "DELETE",
}

/**
 * @description Make a request to the API
 * @param url - URL to make the request
 * @param method - Request method
 * @param body - Request body
 * @param h - Request headers
 * @returns Request response
 */
export async function makeRequest<TBody = undefined, TResponse = unknown>(
  url: string,
  method: Methods = Methods.GET,
  body?: TBody,
  customHeaders?: HeadersInit
): Promise<{
  data: TResponse | null;
  status: number;
  error: { status: number; message: string } | null;
}> {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...customHeaders,
  };
  const options: RequestInit = {
    method,
    headers,
    ...(body ? { body: JSON.stringify(body) } : {}),
  };

  try {
    const response = await fetch(`${config.apiUrl}${url}`, options);
    const isJson = response.headers
      .get("content-type")
      ?.includes("application/json");

    const responseBody = isJson ? await response.json() : null;
    let error = null;
    if (!response.ok || isAnError(response.status)) {
      const text = await response.text();

      if (text)
        error = {
          status: response.status,
          message: text,
        };
    }

    return {
      data: response.ok && response.status !== 204 ? responseBody : null,
      status: response.status,
      error,
    };
  } catch (err) {
    return {
      data: null,
      status: 500,
      error: {
        status: 500,
        message: (err as Error).message || "Unknown error occurred",
      },
    };
  }
}

export function buildQueryUrl<TFilter>(
  endpoint: string,
  params?: TFilter
): string {
  console.log(params);
  if (params) {
    const queryString = Object.entries(params)
      .filter(([, value]) => value !== undefined && value !== null)
      .map(
        ([key, value]) =>
          `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`
      )
      .join("&");
    console.log(queryString);
    return queryString ? `${endpoint}?${queryString}` : endpoint;
  }
  return endpoint;
}
