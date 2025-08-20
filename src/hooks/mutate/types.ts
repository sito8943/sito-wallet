import { Tables } from "lib";

export type UseBaseActionMutate<TInDto, TError extends Error> = {
  mutationFn: () => Promise<TInDto>;
  onError?: (error: TError) => void;
  onSuccess?: (data: TInDto) => void | Promise<void>;
  onSuccessMessage?: string;
};

export interface UseExportActionMutatePropsType<TInDto, TError extends Error>
  extends UseBaseActionMutate<TInDto, TError> {
  entity: Tables;
}
