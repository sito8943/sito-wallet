import { useCallback } from "react";
import { useTranslation } from "react-i18next";

// @sito/dashboard-app
import { useNotification } from "@sito/dashboard-app";

// constants
import { COPY_ERROR_KEY, COPY_SUCCESS_KEY } from "./constants";

// types
import type { CopyToClipboardFn } from "./types";

/** Copies text to the clipboard and shows a success/error notification. */
export function useCopyToClipboard(): CopyToClipboardFn {
  const { t } = useTranslation();
  const { showErrorNotification, showSuccessNotification } = useNotification();

  return useCallback(
    async (text: string) => {
      try {
        await navigator.clipboard.writeText(text);
        showSuccessNotification({ message: t(COPY_SUCCESS_KEY) });
        return true;
      } catch {
        showErrorNotification({ message: t(COPY_ERROR_KEY) });
        return false;
      }
    },
    [showErrorNotification, showSuccessNotification, t],
  );
}
