import type { Control, UseFormSetValue } from "react-hook-form";

import type { TransactionFormType } from "../../types";

export type TransactionProductsFieldPropsType = {
  control: Control<TransactionFormType>;
  setValue?: UseFormSetValue<TransactionFormType>;
  isLoading?: boolean;
};
