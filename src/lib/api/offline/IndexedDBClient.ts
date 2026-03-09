// types
import {
  BaseEntityDto,
  BaseCommonEntityDto,
  DeleteDto,
  BaseFilterDto,
  QueryParam,
  QueryResult,
} from "@sito/dashboard-app";

// lib
import { ImportDto, ImportPreviewDto } from "lib";

export const matchesFilterValue = (
  key: string,
  itemValue: unknown,
  filterValue: unknown,
): boolean => {
  if (filterValue === undefined) return true;

  if (key === "deletedAt" && typeof filterValue === "boolean") {
    const isDeleted = itemValue !== null && itemValue !== undefined;
    return filterValue ? isDeleted : !isDeleted;
  }

  return itemValue === filterValue;
};

export class IndexedDBClient<
  Tables extends string,
  TDto extends BaseEntityDto,
  TCommonDto extends BaseCommonEntityDto,
  TAddDto,
  TUpdateDto extends DeleteDto,
  TFilter extends BaseFilterDto,
  TImportPreviewDto extends ImportPreviewDto,
> {
  table: Tables;
  dbName: string;
  version: number;
  private db: IDBDatabase | null = null;

  constructor(table: Tables, dbName: string, version: number = 1) {
    this.table = table;
    this.dbName = dbName;
    this.version = version;
  }

  close(): void {
    if (!this.db) return;

    this.db.close();
    this.db = null;
  }

  private open(): Promise<IDBDatabase> {
    if (this.db) return Promise.resolve(this.db);

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(this.table)) {
          db.createObjectStore(this.table, {
            keyPath: "id",
            autoIncrement: true,
          });
        }
      };

      request.onsuccess = (event) => {
        this.db = (event.target as IDBOpenDBRequest).result;
        this.db.onversionchange = () => {
          this.close();
        };
        resolve(this.db);
      };

      request.onerror = (event) => {
        reject((event.target as IDBOpenDBRequest).error);
      };
    });
  }

  private async transaction(mode: IDBTransactionMode): Promise<IDBObjectStore> {
    const db = await this.open();
    return db.transaction(this.table, mode).objectStore(this.table);
  }

  private request<T>(req: IDBRequest<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }

  async insert(value: TAddDto): Promise<TDto> {
    const store = await this.transaction("readwrite");
    const id = await this.request(store.add(value as object));
    return { ...(value as object), id } as TDto;
  }

  async insertMany(data: TAddDto[]): Promise<TDto> {
    const store = await this.transaction("readwrite");
    let lastId: IDBValidKey = 0;
    for (const item of data) {
      lastId = await this.request(store.add(item as object));
    }
    return { ...(data[data.length - 1] as object), id: lastId } as TDto;
  }

  async update(_: number, value: TUpdateDto): Promise<TDto> {
    const store = await this.transaction("readwrite");
    await this.request(store.put(value as object));
    return value as unknown as TDto;
  }

  async get(
    query?: QueryParam<TDto>,
    filters?: TFilter,
  ): Promise<QueryResult<TDto>> {
    const store = await this.transaction("readonly");
    const all: TDto[] = await this.request(store.getAll());
    const filtered = this.applyFilter(all, filters as Record<string, unknown>);

    const sortBy = (query?.sortingBy ?? "id") as keyof TDto;
    const order = (query?.sortingOrder?.toLowerCase() ?? "asc") as
      | "asc"
      | "desc";
    filtered.sort((a, b) => {
      const av = a[sortBy];
      const bv = b[sortBy];
      if (av < bv) return order === "asc" ? -1 : 1;
      if (av > bv) return order === "asc" ? 1 : -1;
      return 0;
    });

    const pageSize = query?.pageSize ?? 10;
    const currentPage = query?.currentPage ?? 0;
    const totalElements = filtered.length;
    const totalPages = Math.ceil(totalElements / pageSize);
    const items = filtered.slice(
      currentPage * pageSize,
      currentPage * pageSize + pageSize,
    );

    return {
      sort: sortBy,
      order,
      currentPage,
      pageSize,
      totalElements,
      totalPages,
      items,
    };
  }

  async export(filters?: TFilter): Promise<TDto[]> {
    const store = await this.transaction("readonly");
    const all: TDto[] = await this.request(store.getAll());
    return this.applyFilter(all, filters as Record<string, unknown>);
  }

  async import(data: ImportDto<TImportPreviewDto>): Promise<number> {
    const store = await this.transaction("readwrite");
    let count = 0;
    for (const item of data.items) {
      if (data.override) {
        await this.request(store.put(item as object));
      } else {
        await this.request(store.add(item as object));
      }
      count++;
    }
    return count;
  }

  async commonGet(query: TFilter): Promise<TCommonDto[]> {
    const store = await this.transaction("readonly");
    const all: TCommonDto[] = await this.request(store.getAll());
    return this.applyFilter(all, query as Record<string, unknown>);
  }

  async getById(id: number): Promise<TDto> {
    const store = await this.transaction("readonly");
    const result = await this.request(store.get(id));
    if (!result) throw new Error(`Record ${id} not found in ${this.table}`);
    return result as TDto;
  }

  async softDelete(ids: number[]): Promise<number> {
    const store = await this.transaction("readwrite");
    let count = 0;
    for (const id of ids) {
      const record = await this.request(store.get(id));
      if (record) {
        await this.request(store.put({ ...record, deletedAt: new Date() }));
        count++;
      }
    }
    return count;
  }

  async restore(ids: number[]): Promise<number> {
    const store = await this.transaction("readwrite");
    let count = 0;
    for (const id of ids) {
      const record = await this.request(store.get(id));
      if (record) {
        await this.request(store.put({ ...record, deletedAt: null }));
        count++;
      }
    }
    return count;
  }

  private applyFilter<T>(items: T[], filters?: Record<string, unknown>): T[] {
    if (!filters) return items;
    return items.filter((item) =>
      Object.keys(filters).every((key) =>
        matchesFilterValue(
          key,
          (item as Record<string, unknown>)[key],
          filters[key],
        ),
      ),
    );
  }
}
