import { useMemo } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";

import type { QueryParam} from "@sito/dashboard-app";
import { useAuth } from "@sito/dashboard-app";

import { useManager } from "providers";

import type {
  FilterUserDto,
  UserDto} from "lib";
import {
  applyHideDeletedEntitiesPreference,
  defaultUsersListFilters,
  normalizeListFilters,
} from "lib";

import { useHideDeletedEntitiesPreference } from "./useProfile";
import type { UseFetchPropsType } from "./types";
import { UsersQueryKeys } from "./queryKeys/usersQueryKeys";

export function useInfiniteUsersList(
  props: UseFetchPropsType<UserDto, FilterUserDto>,
) {
  const {
    filters = defaultUsersListFilters,
    query = {} as Omit<QueryParam<UserDto>, "currentPage">,
  } = props;

  const manager = useManager();
  const usersClient = "Users" in manager ? manager.Users : null;
  const { account } = useAuth();
  const hideDeletedEntities = useHideDeletedEntitiesPreference();

  const parsedFilters = useMemo(
    () =>
      applyHideDeletedEntitiesPreference(
        normalizeListFilters(filters),
        hideDeletedEntities,
      ) as FilterUserDto,
    [filters, hideDeletedEntities],
  );

  const parsedQueries = useMemo(
    () => ({
      sortingBy: query.sortingBy as keyof UserDto,
      sortingOrder: query.sortingOrder,
      pageSize: query.pageSize ?? 20,
    }),
    [query.pageSize, query.sortingBy, query.sortingOrder],
  );

  return useInfiniteQuery({
    ...UsersQueryKeys.infiniteList(parsedQueries, parsedFilters),
    enabled: !!account?.id && !!usersClient,
    initialPageParam: 0,
    queryFn: async ({ pageParam }) => {
      if (!usersClient) {
        throw new Error("users.featureDisabled");
      }

      const currentPage = typeof pageParam === "number" ? pageParam : 0;
      const requestQuery = {
        ...parsedQueries,
        currentPage,
      };

      return await usersClient.get(requestQuery, parsedFilters);
    },
    getNextPageParam: (lastPage) => {
      const nextPage = lastPage.currentPage + 1;
      if (nextPage >= lastPage.totalPages) return undefined;
      return nextPage;
    },
  });
}
