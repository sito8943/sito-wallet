import { useCallback } from "react";

import { Dialog } from "@sito/dashboard-app";

import type { PrefabSuggestionsDialogPropsType } from "./types";

import "./styles.css";

export function PrefabSuggestionsDialog(
  props: PrefabSuggestionsDialogPropsType,
) {
  const { open, title, onClose, onComplete, children } = props;

  const handleComplete = useCallback(() => {
    onClose();
    onComplete?.();
  }, [onClose, onComplete]);

  return (
    <Dialog open={open} title={title} handleClose={onClose}>
      <div className="p-4">{children(handleComplete)}</div>
    </Dialog>
  );
}
