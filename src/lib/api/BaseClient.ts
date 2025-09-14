// manager
import { APIClient } from "./APIClient.ts";

// types
import { QueryParam, Tables } from "./types.ts";

// lib
import {
  BaseCommonEntityDto,
  BaseEntityDto,
  BaseFilterDto,
  buildQueryUrl,
  DeleteDto,
  ImportDto,
  Methods,
  QueryResult,
} from "lib";
import { parseQueries } from "./utils/query.ts";

export default class BaseClient<
  TDto extends BaseEntityDto,
  TCommonDto extends BaseCommonEntityDto,
  TAddDto,
  TUpdateDto extends DeleteDto,
  TFilter extends BaseFilterDto
> {
  table: Tables;
  secured: boolean;
  api: APIClient;
  /**
   *
   * @param table
   * @param secured to see if the api client requires jwt protection
   */
  constructor(table: Tables, secured: boolean = true) {
    this.table = table;
    this.secured = secured;
    this.api = new APIClient(secured);
  }

  /**
   *
   * @param value
   * @returns inserted item
   */
  async insert(value: TAddDto): Promise<TDto> {
    return await this.api.post<TDto, TAddDto>(`${this.table}`, value);
  }

  /**
   *
   * @param data - values to insert
   * @returns - Query result
   */
  async insertMany(data: TAddDto[]): Promise<TDto> {
    return await this.api.doQuery<TDto, TAddDto[]>(
      `${this.table}/batch`,
      Methods.POST,
      data
    );
  }

  /**
   *
   * @param value
   * @returns updated item
   */
  async update(value: TUpdateDto): Promise<TDto> {
    return await this.api.patch<TDto, TUpdateDto>(
      `${this.table}/${value.id}`,
      value
    );
  }

  /**
   *
   * @param query - Where conditions (key-value)
   * @param filters - Filters to apply
   * @returns - Query result
   */
  async get(
    query?: QueryParam<TDto>,
    filters?: TFilter
  ): Promise<QueryResult<TDto>> {
    return await this.api.get<TDto, TFilter>(`${this.table}`, query, filters);
  }

  /**
   *
   * @param filters - Filters to apply
   * @returns - List of elementes
   */
  async export(filters?: TFilter): Promise<TDto[]> {
    const builtUrl = parseQueries<TDto, TFilter>(
      `${this.table}/export`,
      undefined,
      filters
    );

    return await this.api.doQuery<TDto[]>(builtUrl, Methods.GET, undefined);
  }

  /**
   *
   * @param data - Import data
   * @returns - List of elementes
   */
  async import(data: ImportDto): Promise<number> {
    return await this.api.doQuery<number>(
      `${this.table}/import`,
      Methods.POST,
      data
    );
  }

  /**
   *
   * @param query - Where conditions (key-value)
   * @returns  - Query result
   */
  async commonGet(query: TFilter): Promise<TCommonDto[]> {
    return await this.api.doQuery<TCommonDto[], TFilter>(
      buildQueryUrl<TFilter>(`${this.table}/common`, query),
      Methods.GET
    );
  }

  /**
   *
   * @param id
   * @returns - Query result
   */
  async getById(id: number): Promise<TDto> {
    return await this.api.doQuery<TDto>(`${this.table}/${id}`);
  }

  async softDelete(ids: number[]): Promise<number> {
    return await this.api.delete(`${this.table}`, ids);
  }

  async restore(ids: number[]): Promise<number> {
    return await this.api.patch(`${this.table}/restore`, ids);
  }
}
