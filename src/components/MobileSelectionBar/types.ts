import { ActionType, BaseEntityDto } from "@sito/dashboard-app";

export interface MobileSelectionBarPropsType<TRow extends BaseEntityDto> {
  count: number;
  multiActions: ActionType<TRow>[];
  onActionClick: (action: ActionType<TRow>) => void;
  onCancel: () => void;
  className?: string;
}
