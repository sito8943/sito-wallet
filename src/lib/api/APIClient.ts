// services
import { makeRequest, Methods } from "./utils/services";

// types
import {
  BaseEntityDto,
  BaseFilterDto,
  fromLocal,
  QueryParam,
  QueryResult,
  SessionDto,
} from "lib";

// config
import { config } from "../../config";
import { parseQueries } from "./utils";

/**
 * @class APIClient
 * @description it has all base methods
 */
export class APIClient {
  secured: boolean;
  tokenAdquirer!: () => HeadersInit | undefined;

  /**
   *
   * @param secured if the api client requires token
   * @param tokenAdquirer custom token adquirer
   */
  constructor(secured = true, tokenAdquirer = null) {
    this.secured = secured;
    if (!tokenAdquirer) this.tokenAdquirer = this.defaultTokenAdquierer;
  }

  defaultTokenAdquierer() {
    const auth = fromLocal(config.user, "object") as unknown as SessionDto;
    if (auth?.token)
      return { Authorization: `Bearer ${auth.token}` } as HeadersInit;

    return undefined;
  }

  async doQuery<TResponse, TBody = unknown>(
    endpoint: string,
    method = Methods.GET,
    body?: TBody,
    header?: HeadersInit
  ) {
    const securedHeader = this.secured ? this.defaultTokenAdquierer() : {};
    const { data: result, status } = await makeRequest(endpoint, method, body, {
      ...securedHeader,
      ...(header ?? {}),
    });

    if (status !== 200 && status !== 204) throw new Error(String(status));

    return result as TResponse;
  }

  /**
   * @description Get all objects
   * @param endpoint - backed endpoint
   * @param query - query parameters
   * @returns Result list
   */
  async get<TDto extends BaseEntityDto, TFilter extends BaseFilterDto>(
    endpoint: string,
    query?: QueryParam<TDto>,
    filters?: TFilter
  ) {
    const builtUrl = parseQueries<TDto, TFilter>(endpoint, query, filters);

    const securedHeader = this.secured
      ? this.defaultTokenAdquierer()
      : undefined;
    const { data: result, error } = await makeRequest(
      builtUrl,
      Methods.GET,
      null,
      securedHeader
    );
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
    const securedHeader = this.secured
      ? this.defaultTokenAdquierer()
      : undefined;
    const { error, data: result } = await makeRequest<TUpdateDto, TDto>(
      endpoint,
      Methods.PATCH,
      data,
      securedHeader
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
    const securedHeader = this.secured
      ? this.defaultTokenAdquierer()
      : undefined;
    const { error, data: result } = await makeRequest<number[], number>(
      endpoint,
      Methods.DELETE,
      data,
      securedHeader
    );

    if (error || !result) throw new Error(error?.message);

    return result;
  }

  /**
   *
   * @param endpoint - backend endpoint
   * @param  data - value to insert
   * @returns inserted item
   */
  async post<TDto, TAddDto>(endpoint: string, data: TAddDto): Promise<TDto> {
    const securedHeader = this.secured
      ? this.defaultTokenAdquierer()
      : undefined;
    const { error, data: result } = await makeRequest<TAddDto, TDto>(
      endpoint,
      Methods.POST,
      data,
      securedHeader
    );

    if (error || !result)
      throw new Error(error?.message ?? String(error?.status));

    return result;
  }
}
