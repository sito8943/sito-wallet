import { BaseClient, Methods, parseQueries } from "@sito/dashboard-app";

// enum
import { Tables } from "./types";

// types
import {
  CommonTransactionDto,
  TransactionDto,
  UpdateTransactionDto,
  FilterTransactionDto,
  AddTransactionDto,
  TransactionTypeResumeDto,
  FilterTransactionTypeResumeDto,
  TransactionTypeGroupedDto,
  FilterTransactionGroupedByTypeDto,
  TransactionWeeklySpentDto,
  FilterWeeklyTransactionDto,
  ImportPreviewTransactionDto,
  ImportDto,
  parseJSONFile,
  AssignTransactionAccountDto,
  AssignTransactionCategoryDto,
} from "lib";

// utils
import { config } from "../../config";

type UnknownRangeValue = {
  start?: unknown;
  end?: unknown;
};

const TRASH_FILTER_KEYS = new Set(["softdeletescope", "status", "deletedat"]);

export default class TransactionClient extends BaseClient<
  Tables,
  TransactionDto,
  CommonTransactionDto,
  AddTransactionDto,
  UpdateTransactionDto,
  FilterTransactionDto,
  ImportPreviewTransactionDto
> {
  private sanitizeFiltersExpression(filters?: string): string | undefined {
    if (typeof filters !== "string") return undefined;

    const sanitized = filters
      .split(",")
      .map((segment) => segment.trim())
      .filter(Boolean)
      .filter((segment) => {
        const parsed = segment.match(
          /^([A-Za-z0-9_.-]+)\s*(==|=|!=|>=|<=|>|<)/,
        );
        if (!parsed) return true;

        return !TRASH_FILTER_KEYS.has(parsed[1].toLowerCase());
      });

    return sanitized.length ? sanitized.join(",") : undefined;
  }

  private parseRangeBoundary(value: unknown): string | undefined {
    if (value instanceof Date) {
      return Number.isNaN(value.getTime()) ? undefined : value.toISOString();
    }

    if (typeof value === "number") {
      return Number.isFinite(value) ? String(value) : undefined;
    }

    if (typeof value !== "string") return undefined;

    const normalized = value.trim();
    return normalized.length ? normalized : undefined;
  }

  private parseDeletedAtRange(
    value: FilterTransactionGroupedByTypeDto["deletedAt"],
  ): { start?: string; end?: string } | undefined {
    if (!value || typeof value !== "object" || Array.isArray(value)) {
      return undefined;
    }

    const parsedValue = value as UnknownRangeValue;
    const start = this.parseRangeBoundary(parsedValue.start);
    const end = this.parseRangeBoundary(parsedValue.end);

    if (start === undefined && end === undefined) return undefined;

    return {
      ...(start !== undefined ? { start } : {}),
      ...(end !== undefined ? { end } : {}),
    };
  }

  private buildGroupedByTypeFilters(
    filters?: string,
    date?: FilterTransactionGroupedByTypeDto["date"],
    deletedAt?: FilterTransactionGroupedByTypeDto["deletedAt"],
  ): string | undefined {
    const values: string[] = [];

    const sanitizedFilters = this.sanitizeFiltersExpression(filters);
    if (sanitizedFilters) {
      values.push(sanitizedFilters);
    }

    if (date?.start) {
      values.push(`date>=${date.start}`);
    }

    if (date?.end) {
      values.push(`date<=${date.end}`);
    }

    const deletedAtRange = this.parseDeletedAtRange(deletedAt);
    if (deletedAtRange?.start) {
      values.push(`deletedAt>=${deletedAtRange.start}`);
    }

    if (deletedAtRange?.end) {
      values.push(`deletedAt<=${deletedAtRange.end}`);
    }

    return values.length ? values.join(",") : undefined;
  }

  /**
   */
  constructor() {
    super(Tables.Transactions, config.apiUrl, config.auth.user, true, {
      rememberKey: config.auth.remember,
      refreshTokenKey: config.auth.refreshTokenKey,
      accessTokenExpiresAtKey: config.auth.accessTokenExpiresAtKey,
    });
  }

  async getTypeResume(
    filters: FilterTransactionTypeResumeDto,
  ): Promise<TransactionTypeResumeDto> {
    const builtUrl = parseQueries<
      TransactionTypeResumeDto,
      FilterTransactionDto
    >(`${Tables.Transactions}/type-resume`, undefined, filters);

    return await this.api.doQuery<TransactionTypeResumeDto>(
      builtUrl,
      Methods.GET,
      undefined,
      {
        ...this.api.defaultTokenAcquirer(),
      },
    );
  }

  async getGroupedByType(
    filters: FilterTransactionGroupedByTypeDto,
  ): Promise<TransactionTypeGroupedDto> {
    const builtUrl = parseQueries<
      TransactionTypeGroupedDto,
      FilterTransactionGroupedByTypeDto
    >(`${Tables.Transactions}/grouped-by-type`, undefined, {
      accountId: filters.accountId,
      userId: filters.userId,
      filters: this.buildGroupedByTypeFilters(
        filters.filters,
        filters.date,
        filters.deletedAt,
      ),
    });
    return await this.api.doQuery<TransactionTypeGroupedDto>(
      builtUrl,
      Methods.GET,
      undefined,
      {
        ...this.api.defaultTokenAcquirer(),
      },
    );
  }

  async weekly(
    filters: FilterWeeklyTransactionDto,
  ): Promise<TransactionWeeklySpentDto> {
    const builtUrl = parseQueries<
      TransactionWeeklySpentDto,
      FilterTransactionDto
    >(`${Tables.Transactions}/weekly`, undefined, filters);

    return await this.api.doQuery<TransactionWeeklySpentDto>(
      builtUrl,
      Methods.GET,
      undefined,
      {
        ...this.api.defaultTokenAcquirer(),
      },
    );
  }

  async processImport(
    file: File,
    override?: boolean,
  ): Promise<ImportPreviewTransactionDto[]> {
    const items = await parseJSONFile<TransactionDto>(file);
    return await this.api.doQuery<ImportPreviewTransactionDto[]>(
      `${this.table}/import/process${override ? `?override=true` : ""}`,
      Methods.POST,
      items,
      {
        ...this.api.defaultTokenAcquirer(),
      },
    );
  }

  async import(data: ImportDto<ImportPreviewTransactionDto>): Promise<number> {
    return await this.api.post(`${this.table}/import`, data);
  }

  async assignAccount(data: AssignTransactionAccountDto): Promise<number> {
    return await this.api.patch(`${this.table}/assign-account`, data);
  }

  async assignCategory(data: AssignTransactionCategoryDto): Promise<number> {
    return await this.api.patch(`${this.table}/assign-category`, data);
  }
}
