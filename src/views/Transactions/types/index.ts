import type { FieldValues } from "react-hook-form";

// @sito/dashboard
import type {
  ActionType,
  BaseEntityDto,
  UseActionDialog,
  FormDialogPropsType,
  OpenFormDialogParamsType,
  TriggerFormDialogPropsType,
  SortOrder,
  Option,
  SoftDeleteScope,
} from "@sito/dashboard-app";

// types
import type {
  CommonAccountDto,
  CommonProductDto,
  CommonPurchaseProviderDto,
  CommonTransactionCategoryDto,
  TransactionDto,
  TransactionType,
} from "lib";

export enum TransactionAutoFilterMode {
  All = "all",
  Auto = "auto",
  Manual = "manual",
}

export interface TransactionCardPropsType extends TransactionDto {
  actions: ActionType<TransactionDto>[];
  onClick: (id: number) => void;
  selectionMode?: boolean;
  selected?: boolean;
  onSelect?: (id: number) => void;
  onLongPress?: (id: number) => void;
  swipeDeleteOpen?: boolean;
  onSwipeDelete?: () => void;
}

export interface TransactionFormType
  extends
    Omit<
      TransactionDto,
      | "currency"
      | "deletedAt"
      | "createdAt"
      | "updatedAt"
      | "user"
      | "category"
      | "categories"
      | "purchaseProvider"
      | "products"
    >,
    FieldValues {
  categories: CommonTransactionCategoryDto[];
  purchaseProvider: CommonPurchaseProviderDto | null;
  products: TransactionProductFormItem[];
}

export type UseReceiptScanPropsType = {
  /** Called with the form values read from the receipt. */
  onDraft: (values: ReceiptFormValues) => void;
};

/** Form fields a scanned receipt can fill. */
export type ReceiptFormValues = Partial<
  Pick<TransactionFormType, "amount" | "date" | "purchaseProvider" | "products">
>;

/** Number inputs hand back strings, so quantity/price accept both. */
export type TransactionProductFormItem = {
  product: CommonProductDto | null;
  quantity: number | string;
  unitPrice: number | string;
};

export type TransactionFormPropsType =
  FormDialogPropsType<TransactionFormType> & {
    lockCategory?: boolean;
    lockAccount?: boolean;
    account?: CommonAccountDto | null;
  };

export interface TriggerTransactionPropsType extends TransactionFormPropsType {
  openDialog: (
    params?: number | OpenFormDialogParamsType<TransactionFormType>,
  ) => void;
}

export type AddTransactionDialogPropsType = TriggerTransactionPropsType;

export type EditTransactionDialogPropsType = TriggerTransactionPropsType;

export type UseAddTransactionActionDialog<TDto extends BaseEntityDto> =
  UseActionDialog<TDto, TransactionFormType> & {
    lockCategory?: boolean;
    lockAccount?: boolean;
  };

export type UseAddTransactionDialogActionPropsType = {
  account: CommonAccountDto | null;
  categories?: CommonTransactionCategoryDto[];
};

export interface AssignTransactionAccountFormType extends FieldValues {
  account: CommonAccountDto | null;
  transactionIds: number[];
}

export type AssignTransactionAccountDialogPropsType =
  TriggerFormDialogPropsType<AssignTransactionAccountFormType>;

export interface AssignTransactionCategoryFormType extends FieldValues {
  categories: CommonTransactionCategoryDto[];
  transactionIds: number[];
}

export type AssignTransactionCategoryDialogPropsType =
  TriggerFormDialogPropsType<AssignTransactionCategoryFormType>;

export interface TransactionsMobileFiltersFormType extends FieldValues {
  auto: TransactionAutoFilterMode;
  category: Option[];
  type: string;
  description: string;
  amount: string;
  dateStart: string;
  dateEnd: string;
  softDeleteScope: SoftDeleteScope;
  deletedAtStart: string;
  deletedAtEnd: string;
  sortingBy: string;
  sortingOrder: SortOrder;
}

export type TransactionTableRowType = TransactionDto & {
  type?: TransactionType;
};

export interface TransactionsMobileFiltersDialogPropsType extends TriggerFormDialogPropsType<TransactionsMobileFiltersFormType> {
  autoFilterOptions: Option[];
  categories: CommonTransactionCategoryDto[];
  hideDeletedEntities?: boolean;
  handleClear: () => void;
}

export enum TransactionActions {
  AssignAccount = "assignAccount",
  AssignCategory = "assignCategory",
}
