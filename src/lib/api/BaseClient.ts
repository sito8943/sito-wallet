// manager
import { APIClient } from "./APIClient.ts";

// types
import { Tables } from "./types.ts";

// lib
import {
  BaseCommonEntityDto,
  BaseEntityDto,
  DeleteDto,
  QueryResult,
} from "lib";

export default class BaseClient<
  TDto extends BaseEntityDto,
  TCommonDto extends BaseCommonEntityDto,
  TAddDto,
  TUpdateDto extends DeleteDto,
  TFilter,
> {
  table: Tables;
  api: APIClient = new APIClient();

  /**
   *
   * @param table
   */
  constructor(table: Tables) {
    this.table = table;
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
      "POST",
      "",
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
   * @returns - Query result
   */
  async get(query: TFilter): Promise<QueryResult<TDto>> {
    return await this.api.get<TDto, TFilter>(`${this.table}`, query);
  }

  /**
   *
   * @param query - Where conditions (key-value)
   * @returns  - Query result
   */
  async commonGet(query: TFilter): Promise<QueryResult<TCommonDto>> {
    return await this.api.get<TCommonDto, TFilter>(
      `${this.table}/common`,
      query
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
