import type { SavingsInterestFieldsPropsType } from "../SavingsInterestFields/types";

export type SavingsInterestDialogPropsType = SavingsInterestFieldsPropsType & {
  open: boolean;
  onClose: () => void;
};
