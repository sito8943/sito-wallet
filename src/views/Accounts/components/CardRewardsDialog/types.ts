import type { CardRewardsFieldsPropsType } from "../CardRewardsFields/types";

export type CardRewardsDialogPropsType = CardRewardsFieldsPropsType & {
  open: boolean;
  onClose: () => void;
};
