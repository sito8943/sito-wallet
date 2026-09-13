import { useTranslation } from "react-i18next";

// @sito/dashboard-app
import { Error } from "@sito/dashboard-app";

// hooks
import { useOnlineStatus } from "hooks";

// types
import type { QueryErrorPropsType } from "./types";

// utils
import { isNetworkError } from "./utils";

/**
 * Error panel for failed queries. Replaces the raw engine-specific network
 * failure message ("Failed to fetch", "Load failed", ...) with the translated
 * offline copy so a dropped connection reads as one.
 */
export const QueryError = (props: QueryErrorPropsType) => {
  const { error, ...rest } = props;
  const { t } = useTranslation();
  const isOnline = useOnlineStatus();

  const message =
    !isOnline || isNetworkError(error)
      ? t("_accessibility:errors.offline")
      : undefined;

  return <Error {...rest} error={error} message={message} />;
};
