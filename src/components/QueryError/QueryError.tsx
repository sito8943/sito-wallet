import { useTranslation } from "react-i18next";

// @sito/dashboard-app
import { Error } from "@sito/dashboard-app";

// hooks
import { useOnlineStatus } from "hooks";

// types
import type { QueryErrorPropsType } from "./types";

// utils
import { getErrorMessageKey, toError } from "./utils";

/**
 * Error panel for failed queries and for the route error boundaries. Replaces
 * the raw engine-specific message ("Failed to fetch", "Failed to fetch
 * dynamically imported module: ...") with copy that says what actually went
 * wrong, so a dropped connection reads as one.
 */
export const QueryError = (props: QueryErrorPropsType) => {
  const { error, resetErrorBoundary, ...rest } = props;
  const { t } = useTranslation();
  const isOnline = useOnlineStatus();

  const normalizedError = toError(error);
  const messageKey = getErrorMessageKey(normalizedError, isOnline);

  return (
    <Error
      {...rest}
      error={normalizedError}
      message={messageKey ? t(messageKey) : undefined}
      resetErrorBoundary={
        resetErrorBoundary ? () => resetErrorBoundary() : undefined
      }
    />
  );
};
