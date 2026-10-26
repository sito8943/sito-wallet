import { useCallback } from "react";
import { useTranslation } from "react-i18next";

import { isHttpError, useNotification } from "@sito/dashboard-app";

import type { MutationErrorConfig, MutationErrorHandler } from "./types";
import { getBackendErrorCodeKey } from "./utils";

/**
 * Builds a reusable mutation `onError` handler that maps known HTTP errors to
 * user-friendly notifications instead of leaking raw backend/SQL messages.
 *
 * - 409 -> `config.uniqueKey` (unique constraint violations)
 * - 400 -> backend message (translated when it is a known code such as
 *   `photo.tooLarge`), falling back to `config.badRequest.fallbackKey`
 * - anything else -> generic 500 message
 */
export function useMutationErrorHandler(): MutationErrorHandler {
  const { t, i18n } = useTranslation();
  const { showErrorNotification } = useNotification();

  return useCallback(
    (error: unknown, config: MutationErrorConfig = {}) => {
      if (isHttpError(error)) {
        if (error.status === 409 && config.uniqueKey) {
          showErrorNotification({ message: t(config.uniqueKey) });
          return;
        }

        if (error.status === 400 && config.badRequest) {
          const codeKey = getBackendErrorCodeKey(error.message);
          showErrorNotification({
            message:
              codeKey && i18n.exists(codeKey)
                ? t(codeKey)
                : String(error.message ?? t(config.badRequest.fallbackKey)),
          });
          return;
        }
      }

      showErrorNotification({ message: t("_accessibility:errors.500") });
    },
    [showErrorNotification, t, i18n],
  );
}
