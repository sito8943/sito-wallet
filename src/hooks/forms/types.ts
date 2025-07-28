export type UseConfirmationPropsType<TInDto, TError extends Error> = {
  mutationFn: (data: TInDto[]) => Promise<TInDto>;
  onError?: (error: TError) => void;
  onSuccess?: (data: TInDto) => void | Promise<void>;
  onSuccessMessage?: string;
};
