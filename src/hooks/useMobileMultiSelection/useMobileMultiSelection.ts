import { useCallback, useMemo, useState } from "react";

// @sito/dashboard-app
import { ActionType, BaseEntityDto } from "@sito/dashboard-app";

// types
import {
  UseMobileMultiSelectionPropsType,
  UseMobileMultiSelectionReturnType,
} from "./types";

// utils
import { getSharedMultiActions } from "./utils";

export function useMobileMultiSelection<TRow extends BaseEntityDto>(
  props: UseMobileMultiSelectionPropsType<TRow>,
): UseMobileMultiSelectionReturnType<TRow> {
  const { items, getActions } = props;

  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const selectedIdsSet = useMemo(() => new Set(selectedIds), [selectedIds]);

  const selectedRows = useMemo(
    () => items.filter((item) => selectedIdsSet.has(item.id)),
    [items, selectedIdsSet],
  );
  const selectedCount = selectedRows.length;
  const selectionMode = selectedCount > 0;

  const clearSelection = useCallback(() => {
    setSelectedIds([]);
  }, []);

  const onToggleRowSelection = useCallback((id: number) => {
    setSelectedIds((previous) => {
      if (previous.includes(id)) {
        return previous.filter((itemId) => itemId !== id);
      }
      return [...previous, id];
    });
  }, []);

  const onLongPressRow = useCallback((id: number) => {
    setSelectedIds((previous) => {
      if (previous.includes(id)) return previous;
      return [...previous, id];
    });
  }, []);

  const multiActions = useMemo(
    () => getSharedMultiActions(selectedRows, getActions),
    [getActions, selectedRows],
  );

  const onMultiActionClick = useCallback(
    (action: ActionType<TRow>) => {
      if (!selectedRows.length) return;

      if (action.onMultipleClick) {
        action.onMultipleClick(selectedRows);
      } else {
        selectedRows.forEach((row) => action.onClick(row));
      }

      clearSelection();
    },
    [clearSelection, selectedRows],
  );

  const isSelected = useCallback(
    (id: number) => selectedIdsSet.has(id),
    [selectedIdsSet],
  );

  return {
    selectionMode,
    selectedCount,
    selectedRows,
    multiActions,
    onToggleRowSelection,
    onLongPressRow,
    onMultiActionClick,
    clearSelection,
    isSelected,
  };
}
