export interface UseSwipeDeleteStateReturnType {
  swipedId: number | null;
  openSwipe: (id: number) => void;
  resetSwipe: () => void;
  handleDialogClose: () => void;
}
