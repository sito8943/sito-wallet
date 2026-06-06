import type { DebtDto } from "lib";

export interface UseDebtActionProps {
  onClick: (record: DebtDto) => void;
  hidden?: boolean;
}
