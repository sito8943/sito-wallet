import type {
  TransactionType,
  TransactionTypeResumeDto,
  TransactionTypeResumeTime,
} from "lib";

export type CalculatorLineKindType = "monthly" | "oneOff";

export type CalculatorLineType = {
  id: string;
  name: string;
  type: TransactionType;
  /** Kept as typed so the input can hold partial values ("12."); always ≥ 0 */
  amount: number | string;
  /** One-off lines only: 0 = this month, 1 = next month, … */
  month: number;
};

export type CalculatorStateType = {
  /** null = use the account's current balance */
  startBalance: number | string | null;
  months: number;
  monthly: CalculatorLineType[];
  oneOff: CalculatorLineType[];
};

export type CalculatorPrefillType = Omit<
  CalculatorStateType,
  "startBalance"
> & {
  startBalance: number;
};

export type CalculatorMonthResultType = {
  index: number;
  /** First day of the projected month */
  date: Date;
  income: number;
  expense: number;
  balance: number;
};

export type CalculatorMonthOptionType = { id: number; value: string };

export type GetCalculatorPrefillParamsType = {
  time: TransactionTypeResumeTime;
  primaryType: TransactionType;
  primary?: TransactionTypeResumeDto;
  opposite?: TransactionTypeResumeDto;
  balance?: number;
  incomeName: string;
  expenseName: string;
};

export type CalculatorLinePatchType = Partial<Omit<CalculatorLineType, "id">>;

export type UseTypeResumeCalculatorPropsType = {
  cardId: number;
  prefill: CalculatorPrefillType;
};

export type TypeResumeCalculatorDialogPropsType =
  UseTypeResumeCalculatorPropsType & {
    open: boolean;
    closeDialog: () => void;
    hasAccount: boolean;
    currencyName?: string;
    currencySymbol?: string;
  };

export type CalculatorLineRowPropsType = {
  kind: CalculatorLineKindType;
  line: CalculatorLineType;
  monthOptions: CalculatorMonthOptionType[];
  onChange: (patch: CalculatorLinePatchType) => void;
  onRemove: () => void;
};

export type CalculatorLinesSectionPropsType = Omit<
  CalculatorLineRowPropsType,
  "line" | "onChange" | "onRemove"
> & {
  lines: CalculatorLineType[];
  onAdd: () => void;
  onChange: (id: string, patch: CalculatorLinePatchType) => void;
  onRemove: (id: string) => void;
};
