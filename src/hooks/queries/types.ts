import { UseQueryResult } from "@tanstack/react-query";
import {
  BaseEntityDto,
  FilterTransactionDto,
  QueryParam,
  QueryResult,
} from "lib";

export type UseFetchPropsType<TRow, TFilterDto> = {
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

export type UseTransactionTypeResumePropsType = FilterTransactionDto;
