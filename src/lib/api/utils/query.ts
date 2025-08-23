// types
import { QueryParam } from "../types";

// entities
import { BaseFilterDto } from "../../entities";

/**
 * Builds a query string from pagination and filter params
 * @param query - Pagination and sorting info
 * @param filters - Filters to apply
 * @returns - Encoded query string
 */
export const parseQueries = <TDto, TFilter extends BaseFilterDto>(
  endpoint: string,
  query?: QueryParam<TDto>,
  filters?: TFilter
) => {
  const queryParts: string[] = [];

  // Build pagination and sorting params
  if (query) {
    const { sortingBy, sortingOrder, currentPage, pageSize } = query;
    queryParts.push(
      `sort=${String(sortingBy)}`,
      `order=${sortingOrder}`,
      `page=${currentPage}`,
      `pageSize=${pageSize}`
    );
  }

  // Build filters
  if (filters) {
    const filterParts = Object.entries(filters)
      .filter(
        ([, value]) => value !== null && value !== undefined && value !== ""
      )
      .flatMap(([key, value]) => {
        // Multiple values (array)
        if (Array.isArray(value)) {
          return value.map((v) => `${key}==${encodeURIComponent(v?.id ?? v)}`);
        }

        // Range filters (start/end)
        if (
          typeof value === "object" &&
          value !== null &&
          "start" in value &&
          "end" in value
        ) {
          const range: string[] = [];
          if (value.start != null && value.start !== "")
            range.push(`${key}>=${encodeURIComponent(value.start)}`);
          if (value.end != null && value.end !== "")
            range.push(`${key}<=${encodeURIComponent(value.end)}`);
          return range;
        }

        // Object with `id` fallback
        if (typeof value === "object" && value !== null) {
          return `${key}==${encodeURIComponent(value.id ?? "")}`;
        }

        // Primitive
        return `${key}==${encodeURIComponent(value)}`;
      });

    if (filterParts.length > 0) {
      queryParts.push(`filters=${filterParts.join(",")}`);
    }
  }

  return queryParts.length ? `${endpoint}?${queryParts.join("&")}` : endpoint;
};
