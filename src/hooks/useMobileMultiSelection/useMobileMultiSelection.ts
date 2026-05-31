import { useCallback, useMemo, useState } from "react";

// @sito/dashboard-app
import type { ActionType, BaseEntityDto } from "@sito/dashboard-app";

// types
import type {
  UseMobileMultiSelectionPropsType,
  UseMobileMultiSelectionReturnType,
} from "./types";

// utils
import { getSharedMultiActions } from "./utils";

export function useMobileMultiSelection<TRow extends BaseEntityDto>(
  props: UseMobileMultiSelectionPropsType<TRow>,
): UseMobileMultiSelectionReturnType<TRow> {
  const { items, getActions, onInteraction } = props;

  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const selectedIdsSet = useMemo(() => new Set(selectedIds), [selectedIds]);

  const selectedRows = useMemo(
    () => items.filter((item) => selectedIdsSet.has(item.id)),
    [items, selectedIdsSet],
  );
  const selectedCount = selectedRows.length;
  const selectionMode = selectedCount > 0;

  const clearSelection = useCallback(() => {
    onInteraction?.();
    setSelectedIds([]);
  }, [onInteraction]);

  const onToggleRowSelection = useCallback(
    (id: number) => {
      onInteraction?.();
      setSelectedIds((previous) => {
        if (previous.includes(id)) {
          return previous.filter((itemId) => itemId !== id);
        }
        return [...previous, id];
      });
    },
    [onInteraction],
  );

  const onLongPressRow = useCallback(
    (id: number) => {
      onInteraction?.();
      setSelectedIds((previous) => {
        if (previous.includes(id)) return previous;
        return [...previous, id];
      });
    },
    [onInteraction],
  );

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
