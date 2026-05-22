import type { ReactNode } from "react";
import { useCallback } from "react";

import { Dialog } from "@sito/dashboard-app";

import "./styles.css";

export type PrefabSuggestionsDialogPropsType = {
  open: boolean;
  title: string;
  onClose: () => void;
  onComplete?: () => void;
  children: (handleComplete: () => void) => ReactNode;
};

export function PrefabSuggestionsDialog(
  props: PrefabSuggestionsDialogPropsType,
) {
  const { open, title, onClose, onComplete, children } = props;

  const handleComplete = useCallback(() => {
    onClose();
    onComplete?.();
  }, [onClose, onComplete]);

  return (
    <Dialog
      open={open}
      title={title}
      handleClose={onClose}
      mobileFullScreen
    >
      <div className="p-4">{children(handleComplete)}</div>
    </Dialog>
  );
}
