import type {
  Control,
  FieldArrayWithId,
  UseFieldArrayAppend,
  UseFieldArrayRemove,
  UseFormSetValue,
} from "react-hook-form";

import type { TransactionFormType } from "../../types";

export type TransactionProductsDialogPropsType = {
  open: boolean;
  onClose: () => void;
  control: Control<TransactionFormType>;
  setValue?: UseFormSetValue<TransactionFormType>;
  isLoading?: boolean;
  fields: FieldArrayWithId<TransactionFormType, "products">[];
  append: UseFieldArrayAppend<TransactionFormType, "products">;
  remove: UseFieldArrayRemove;
};
