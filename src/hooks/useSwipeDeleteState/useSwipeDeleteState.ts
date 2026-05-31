import { useCallback, useState } from "react";

import type { UseSwipeDeleteStateReturnType } from "./types";

export function useSwipeDeleteState(
  onDialogClose: () => void,
): UseSwipeDeleteStateReturnType {
  const [swipedId, setSwipedId] = useState<number | null>(null);

  const openSwipe = useCallback((id: number) => {
    setSwipedId(id);
  }, []);

  const resetSwipe = useCallback(() => {
    setSwipedId(null);
  }, []);

  const handleDialogClose = useCallback(() => {
    resetSwipe();
    onDialogClose();
  }, [onDialogClose, resetSwipe]);

  return {
    swipedId,
    openSwipe,
    resetSwipe,
    handleDialogClose,
  };
}
