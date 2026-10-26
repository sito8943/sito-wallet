import type { Control } from "react-hook-form";

import type { TransactionFormType } from "../../types";

export type TransactionProductsFieldPropsType = {
  control: Control<TransactionFormType>;
  isLoading?: boolean;
};
