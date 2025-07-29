import { config } from "../../../config";

const isAnError = (status: number) => status < 200 || status > 299;

/**
 * @description Make a request to the API
 * @param url - URL to make the request
 * @param method - Request method
 * @param body - Request body
 * @param h - Request headers
 * @returns Request response
 */
export async function makeRequest<TBody, TResponse>(
  url: string,
  method = "GET",
  body: TBody,
  h = null
) {
  try {
    const headers = {
      "Content-Type": "application/json",
      ...(h ?? {}),
    };
    const options: RequestInit = {
      method,
      headers,
    };
    if (body) options.body = JSON.stringify(body);

    const request = await fetch(`${config.apiUrl}${url}`, options);

    if (request.ok) {
      const data: TResponse = await request.json();

      return {
        data,
        status: request.status,
        error: isAnError(request.status)
          ? { status: request.status, message: request.statusText }
          : null,
      };
    } else
      return {
        data: null,
        status: request.status,
        error: { message: request.statusText },
      };
  } catch (err) {
    return {
      data: null,
      status: 500,
      error: { status: 500, message: (err as Error).message },
    };
  }
}

export function buildQueryUrl<TFilter>(
  endpoint: string,
  params?: TFilter
): string {
  if (params) {
    const queryString = Object.entries(params)
      .filter(([, value]) => value !== undefined && value !== null)
      .map(
        ([key, value]) =>
          `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`
      )
      .join("&");

    return queryString ? `${endpoint}?${queryString}` : endpoint;
  }
  return endpoint;
}
