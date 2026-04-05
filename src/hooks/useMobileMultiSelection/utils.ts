import { ActionType, BaseEntityDto } from "@sito/dashboard-app";

export function getSharedMultiActions<TRow extends BaseEntityDto>(
  selectedRows: TRow[],
  getActions: (record: TRow) => ActionType<TRow>[],
): ActionType<TRow>[] {
  if (!selectedRows.length) return [];

  return selectedRows.reduce<ActionType<TRow>[]>(
    (currentActions, row, index) => {
      const rowActions = getActions(row).filter(
        (action) => action.multiple && !action.hidden,
      );

      if (index === 0) return rowActions;

      const currentActionsMap = new Map(
        currentActions.map((action) => [action.id, action]),
      );

      return rowActions.reduce<ActionType<TRow>[]>(
        (sharedActions, action) => {
          const currentAction = currentActionsMap.get(action.id);
          if (!currentAction) return sharedActions;

          sharedActions.push({
            ...currentAction,
            ...action,
            disabled: !!(action.disabled || currentAction.disabled),
          });
          return sharedActions;
        },
        [],
      );
    },
    [],
  );
}
