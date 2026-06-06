import type { AddDebtDto } from "./AddDebtDto";

export interface UpdateDebtDto extends Partial<AddDebtDto> {
  id: number;
}
