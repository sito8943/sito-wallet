import { UseQueryResult } from "@tanstack/react-query";

// @sito/dashboard-app
import { BaseEntityDto, BaseFilterDto, QueryParam, QueryResult } from "@sito/dashboard-app";

// lib
import { FilterTransactionTypeResumeDto } from "lib";

export type UseFetchPropsType<TRow, TFilterDto = BaseFilterDto> = {
  filters?: TFilterDto;
  query?: QueryParam<TRow>;
};

export type UseFetchByIdPropsType = {
  id: number;
};

export interface ApiQueryResult<TResponseDto extends BaseEntityDto>
  extends Omit<UseQueryResult<QueryResult<TResponseDto>>, "setTotal"> {
  setTotal: (total: number) => void;
}

export type UseTransactionTypeResumePropsType = FilterTransactionTypeResumeDto;
