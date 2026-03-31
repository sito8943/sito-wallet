import type { AccountDto } from "lib";

export interface UseAdjustBalanceActionProps {
  onClick: (record: AccountDto) => void;
  hidden?: boolean;
}
