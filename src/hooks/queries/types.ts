import { UseQueryResult } from "@tanstack/react-query";
import { BaseEntityDto, QueryResult } from "lib";

export type UseFetchPropsType<TFilterDto> = {
  filters?: TFilterDto;
};

export type UseFetchByIdPropsType = {
  id: number;
};

export interface ApiQueryResult<TResponseDto extends BaseEntityDto>
  extends Omit<UseQueryResult<QueryResult<TResponseDto>>, "setTotal"> {
  setTotal: (total: number) => void;
}
