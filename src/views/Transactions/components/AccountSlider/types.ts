// @sito/dashboard-app
import type { ActionType } from "@sito/dashboard-app";

// lib
import type { AccountDto } from "lib";

export interface AccountSliderPropsType {
  className?: string;
  accounts: AccountDto[];
  selectedAccount?: AccountDto | null;
  onAccountChange: (accountId: number) => void;
  getActions: (account: AccountDto) => ActionType<AccountDto>[];
  onOpenFilters?: () => void;
}

export interface UseAccountSliderParams {
  count: number;
  activeIndex: number;
  onIndexChange: (index: number) => void;
}
