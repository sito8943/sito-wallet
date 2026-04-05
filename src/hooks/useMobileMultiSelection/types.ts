import { ActionType, BaseEntityDto } from "@sito/dashboard-app";

export interface UseMobileMultiSelectionPropsType<
  TRow extends BaseEntityDto,
> {
  items: TRow[];
  getActions: (record: TRow) => ActionType<TRow>[];
}

export interface UseMobileMultiSelectionReturnType<
  TRow extends BaseEntityDto,
> {
  selectionMode: boolean;
  selectedCount: number;
  selectedRows: TRow[];
  multiActions: ActionType<TRow>[];
  onToggleRowSelection: (id: number) => void;
  onLongPressRow: (id: number) => void;
  onMultiActionClick: (action: ActionType<TRow>) => void;
  clearSelection: () => void;
  isSelected: (id: number) => boolean;
}
