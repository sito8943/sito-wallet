import { SupabaseClient } from "@supabase/supabase-js";

// types from external lib
import {
  BaseEntityDto,
  BaseFilterDto,
  fromLocal,
  QueryParam,
  QueryResult,
} from "@sito/dashboard-app";

// shared supabase singleton
import { supabase } from "./supabaseClient";

type Order = "asc" | "desc";

export class SupabaseAPIClient {
  baseUrl: string;
  userKey: string;
  secured: boolean;
  supabase: SupabaseClient;

  constructor(baseUrl: string, userKey = "user", secured = true) {
    this.baseUrl = baseUrl;
    this.userKey = userKey;
    this.secured = secured;
    this.supabase = supabase;
  }

  // Kept for compatibility, not used in Supabase
  defaultTokenAcquirer(): HeadersInit | undefined {
    const token = fromLocal(this.userKey) as string;
    if (token && token.length)
      return { Authorization: `Bearer ${token}` } as HeadersInit;
    return undefined;
  }

  private applyFilters<TFilter extends BaseFilterDto>(
    table: string,
    query: ReturnType<SupabaseClient["from"]>,
    filters?: TFilter
  ) {
    let q = query;
    if (!filters) return q;

    const anyFilters = filters as unknown as Record<string, unknown>;

    // Common filters
    if (anyFilters.userId !== undefined)
      q = q.eq("userId", anyFilters.userId as number);
    if (anyFilters.deleted !== undefined)
      q = q.eq("deleted", anyFilters.deleted as boolean);

    // Specific known filters
    if ((anyFilters as any).accountId !== undefined)
      q = q.eq("accountId", (anyFilters as any).accountId as number);
    if ((anyFilters as any).currencyId !== undefined)
      q = q.eq("currencyId", (anyFilters as any).currencyId as number);
    if ((anyFilters as any).type !== undefined)
      q = q.eq("type", (anyFilters as any).type as number);
    if ((anyFilters as any).account && Array.isArray((anyFilters as any).account))
      q = q.in("accountId", ((anyFilters as any).account as number[]) ?? []);
    if ((anyFilters as any).category && Array.isArray((anyFilters as any).category))
      q = q.in("categoryId", ((anyFilters as any).category as number[]) ?? []);
    if ((anyFilters as any).date) {
      const date = (anyFilters as any).date as { start?: string; end?: string };
      if (date.start) q = q.gte("date", date.start);
      if (date.end) q = q.lte("date", date.end);
    }

    return q;
  }

  private applyQuery<TDto extends BaseEntityDto>(
    q: ReturnType<SupabaseClient["from"]>,
    query?: QueryParam<TDto>
  ) {
    let curr = q;
    const sortingBy = (query?.sortingBy as string) || "updatedAt";
    const sortingOrder = (query?.sortingOrder as Order) || "desc";
    curr = curr.order(sortingBy, { ascending: sortingOrder === "asc" });

    if (query?.currentPage !== undefined && query?.pageSize !== undefined) {
      const from = (query.currentPage - 1) * query.pageSize;
      const to = from + query.pageSize - 1;
      curr = curr.range(from, to);
    }

    return curr;
  }

  // Generic SELECT with pagination and filters
  async get<TDto extends BaseEntityDto, TFilter extends BaseFilterDto>(
    endpoint: string,
    query?: QueryParam<TDto>,
    filters?: TFilter
  ) {
    const table = endpoint.replace(/^\//, "");
    let q = this.supabase.from(table).select("*", { count: "exact" });
    q = this.applyFilters(table, q, filters);
    q = this.applyQuery(q, query);
    const { data, error, count } = await q;
    if (error) throw new Error(error.message);

    return { items: (data ?? []) as TDto[], total: count ?? (data?.length ?? 0) } as QueryResult<TDto>;
  }

  // Compatibility method used for custom endpoints in existing clients
  async doQuery<TResponse, TBody = unknown>(
    endpoint: string,
    _method?: unknown,
    body?: TBody,
    _header?: HeadersInit
  ) {
    // Handle patterns
    const clean = endpoint.replace(this.baseUrl, "").replace(/^\//, "");

    // /:table/:id
    const idMatch = clean.match(/^(.*)\/(\d+)$/);
    if (idMatch) {
      const table = idMatch[1];
      const id = Number(idMatch[2]);
      const { data, error } = await this.supabase.from(table).select("*").eq("id", id).single();
      if (error) throw new Error(error.message);
      return data as TResponse;
    }

    // /:table/common
    if (/\/common$/.test(clean)) {
      const table = clean.replace(/\/common$/, "");
      const { data, error } = await this.supabase
        .from(table)
        .select("id, updatedAt")
        .order("updatedAt", { ascending: false });
      if (error) throw new Error(error.message);
      return (data ?? []) as TResponse;
    }

    // /:table/export
    if (/\/export$/.test(clean)) {
      const table = clean.replace(/\/export$/, "");
      const { data, error } = await this.supabase.from(table).select("*");
      if (error) throw new Error(error.message);
      return (data ?? []) as TResponse;
    }

    // transactions/type-resume?type=&userId=&account=&category=&date.start=&date.end=
    if (/^transactions\/type-resume/.test(clean)) {
      const url = new URL(`http://local/${clean}`);
      const p = url.searchParams;

      const num = (v: string | null) => (v == null ? undefined : Number(v));
      const getAllNumbers = (key: string) => (p.getAll(key) ?? []).map((x) => Number(x)).filter((x) => !isNaN(x));

      const type = num(p.get("type"));
      const userId = num(p.get("userId"));
      const account = [
        ...getAllNumbers("account"),
        ...getAllNumbers("accounts"),
      ];
      const category = [
        ...getAllNumbers("category"),
        ...getAllNumbers("categories"),
      ];
      // date.start/date.end or date[start]/date[end]
      const dateStart = p.get("date.start") || p.get("date[start]") || p.get("date%5Bstart%5D");
      const dateEnd = p.get("date.end") || p.get("date[end]") || p.get("date%5Bend%5D");

      // Build supabase query
      let q = this.supabase.from("transactions").select("amount, accountId");
      if (typeof userId !== "undefined") q = q.eq("userId", userId);
      if (typeof type !== "undefined") q = q.eq("type", type);
      if (account.length) q = q.in("accountId", account);
      if (category.length) q = q.in("categoryId", category);
      if (dateStart) q = q.gte("date", dateStart);
      if (dateEnd) q = q.lte("date", dateEnd);

      const { data, error } = await q;
      if (error) throw new Error(error.message);
      const total = (data ?? []).reduce((acc: number, it: any) => acc + (Number(it?.amount) || 0), 0);

      // Choose an account to provide currency info (first provided or from data)
      let accountId: number | null = account[0] ?? null;
      if (!accountId && data && data[0]?.accountId) accountId = Number(data[0].accountId);

      let accountData: any = null;
      if (accountId) {
        const { data: accRow } = await this.supabase
          .from("accounts")
          .select("id, name, currency:currencyId(id, name, symbol)")
          .eq("id", accountId)
          .single();
        accountData = accRow ?? null;
        if (accountData && accountData.currencyId) {
          accountData.currency = accountData.currencyId;
          delete accountData.currencyId;
        }
      }

      return {
        startDate: dateStart ?? "",
        endDate: dateEnd ?? "",
        total,
        type: type ?? 0,
        account: accountData,
      } as unknown as TResponse;
    }

    throw new Error(`Unsupported endpoint for supabase adapter: ${clean}`);
  }

  // Update/patch endpoint-compatible method
  async patch<TDto, TUpdateDto>(endpoint: string, data: TUpdateDto): Promise<TDto> {
    const clean = endpoint.replace(/^\//, "");

    // restore: /:table/restore with ids[]
    if (/\/restore$/.test(clean)) {
      const table = clean.replace(/\/restore$/, "");
      const ids = (data as unknown as number[]) ?? [];
      const { error } = await this.supabase.from(table).update({ deleted: false }).in("id", ids);
      if (error) throw new Error(error.message);
      return (ids?.length ?? 0) as unknown as TDto;
    }

    // account sync: /accounts/:id/sync (no-op)
    const syncMatch = clean.match(/^([^/]+)\/(\d+)\/sync$/);
    if (syncMatch) {
      return 1 as unknown as TDto;
    }

    // dashboard titles/config
    if (/^user-dashboard-config\/update-card-title$/.test(clean)) {
      const { id, title } = (data as unknown as { id: number; title: string }) ?? {};
      const { error } = await this.supabase.from("user-dashboard-config").update({ title }).eq("id", id);
      if (error) throw new Error(error.message);
      return 1 as unknown as TDto;
    }
    if (/^user-dashboard-config\/update-card-config$/.test(clean)) {
      const { id, config } = (data as unknown as { id: number; config: string }) ?? {};
      const { error } = await this.supabase.from("user-dashboard-config").update({ config }).eq("id", id);
      if (error) throw new Error(error.message);
      return 1 as unknown as TDto;
    }

    // generic: /:table/:id
    const idMatch = clean.match(/^(.*)\/(\d+)$/);
    if (idMatch) {
      const table = idMatch[1];
      const id = Number(idMatch[2]);
      const { data: result, error } = await this.supabase.from(table).update(data as Record<string, unknown>).eq("id", id).select("*").single();
      if (error) throw new Error(error.message);
      return result as TDto;
    }

    throw new Error(`Unsupported patch endpoint: ${clean}`);
  }

  // Insert
  async post<TDto, TAddDto>(endpoint: string, data: TAddDto): Promise<TDto> {
    const table = endpoint.replace(/^\//, "");
    const { data: result, error } = await this.supabase
      .from(table)
      .insert(data as unknown as Record<string, unknown>)
      .select("*")
      .single();
    if (error) throw new Error(error.message);
    return result as TDto;
  }

  // Delete (soft delete by convention)
  async delete(endpoint: string, data: number[]) {
    const table = endpoint.replace(/^\//, "");
    const ids = data ?? [];
    const { error } = await this.supabase.from(table).update({ deleted: true }).in("id", ids);
    if (error) throw new Error(error.message);
    return ids.length;
  }
}
