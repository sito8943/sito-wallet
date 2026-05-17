import type { QueryParam } from "@sito/dashboard-app";

import type { FilterUserDto, UserDto } from "lib";

export const UsersQueryKeys = {
  all: () => ({
    queryKey: ["users"],
  }),
  list: (filters: FilterUserDto) => ({
    queryKey: [...UsersQueryKeys.all().queryKey, "list", filters],
  }),
  infiniteList: (
    query: Omit<QueryParam<UserDto>, "currentPage">,
    filters: FilterUserDto,
  ) => ({
    queryKey: [
      ...UsersQueryKeys.all().queryKey,
      "infinite-list",
      query,
      filters,
    ],
  }),
  common: () => ({
    queryKey: [...UsersQueryKeys.all().queryKey, "common"],
  }),
};
