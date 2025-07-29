// services
import { buildQueryUrl, makeRequest } from "./utils/services";

// types
import { QueryResult } from "lib";

/**
 * @class APIClient
 * @description it has all base methods
 */
export class APIClient {
  async doQuery<TResponse, TBody = unknown>(
    endpoint: string,
    method = "GET",
    query?: string,
    body?: TBody
  ) {
    const builtUrl = buildQueryUrl(endpoint, query);
    const { data: result, status } = await makeRequest(builtUrl, method, body);

    if (status !== 200) throw new Error(String(status));

    return result as TResponse;
  }

  /**
   * @description Get all objects
   * @param endpoint - backed endpoint
   * @param query - query parameters
   * @returns Result list
   */
  async get<TDto, TFilter>(endpoint: string, query?: TFilter) {
    const builtUrl = buildQueryUrl<TFilter>(endpoint, query);
    const { data: result, error } = await makeRequest(builtUrl, "GET", null);
    if (error) throw new Error(`${error.status} ${error.message}`);

    return result as QueryResult<TDto>;
  }

  /**
   * @description Get entity by id
   * @param endpoint - backed endpoint
   * @param data - data to update
   * @returns updated entity
   */
  async patch<TDto, TUpdateDto>(
    endpoint: string,
    data: TUpdateDto
  ): Promise<TDto> {
    const { error, data: result } = await makeRequest<TUpdateDto, TDto>(
      endpoint,
      "PATCH",
      data
    );

    if (error || !result) throw new Error(error?.message);

    return result;
  }

  /**
   * @param endpoint - backend endpoint
   * @param  data - value to insert
   * @returns delete result
   */
  async delete(endpoint: string, data: number[]) {
    const { error, data: result } = await makeRequest<number[], number>(
      endpoint,
      "DELETE",
      data
    );

    if (error) throw new Error(error.message);

    return result;
  }

  /**
   *
   * @param endpoint - backend endpoint
   * @param  data - value to insert
   * @returns inserted item
   */
  async post<TDto, TAddDto>(endpoint: string, data: TAddDto): Promise<TDto> {
    const { error, data: result } = await makeRequest<TAddDto, TDto>(
      endpoint,
      "POST",
      data
    );

    if (error || !result) throw new Error(error?.message);

    return result;
  }
}
