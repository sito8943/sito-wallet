import type { AccountDto } from "lib";

export interface UseAdjustBalanceActionProps {
  onClick: (record: AccountDto) => void;
  hidden?: boolean;
}

export interface UseTransferActionProps {
  onClick: (record: AccountDto) => void;
  canTransfer: (record: AccountDto) => boolean;
  hidden?: boolean;
}
