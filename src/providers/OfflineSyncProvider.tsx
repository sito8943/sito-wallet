import { useCallback, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";

// @sito/dashboard-app
import { queryClient, useAuth, useNotification } from "@sito/dashboard-app";

// hooks
import { useOnlineStatus } from "hooks";

// types
import { BasicProviderPropTypes } from "./types";

// lib
import {
  offlineSyncService,
  syncSocketService,
  SyncSocketEvent,
  toSyncHttpError,
} from "lib";

export const OfflineSyncProvider = (props: BasicProviderPropTypes) => {
  const { children } = props;

  const { t } = useTranslation();
  const isOnline = useOnlineStatus();
  const { account, isInGuestMode } = useAuth();
  const { showErrorNotification, showSuccessNotification } = useNotification();

  const syncInProgressRef = useRef(false);
  const lastAttemptKeyRef = useRef("");

  const handleSocketEvent = useCallback(
    async (event: SyncSocketEvent): Promise<void> => {
      if (event.event === "SYNC_SESSION_FINISHED") {
        await queryClient.invalidateQueries();
        return;
      }

      if (event.event === "SYNC_SESSION_ERROR") {
        showErrorNotification({
          message: event.message || t("_pages:sync.errors.generic", {
            defaultValue: "Could not synchronize offline changes.",
          }),
        });
      }
    },
    [showErrorNotification, t]
  );

  useEffect(() => {
    if (!isOnline || !account?.id || isInGuestMode()) {
      syncSocketService.disconnect();
      return;
    }

    syncSocketService.connect({
      onEvent: (event) => {
        handleSocketEvent(event).catch(() => undefined);
      },
    });

    return () => {
      syncSocketService.disconnect();
    };
  }, [account?.id, handleSocketEvent, isInGuestMode, isOnline]);

  useEffect(() => {
    if (!isOnline) {
      lastAttemptKeyRef.current = "";
      return;
    }

    if (!account?.id || isInGuestMode()) return;

    const currentAttemptKey = `${account.id}-${isOnline ? "online" : "offline"}`;
    if (lastAttemptKeyRef.current === currentAttemptKey) return;
    lastAttemptKeyRef.current = currentAttemptKey;

    if (syncInProgressRef.current) return;

    let isCancelled = false;

    const runSync = async () => {
      const hasPendingOperations = await offlineSyncService.hasPendingOperations();
      if (!hasPendingOperations || isCancelled) return;

      syncInProgressRef.current = true;
      try {
        const result = await offlineSyncService.syncPendingOperations();
        if (isCancelled) return;

        if (result.syncedOperations > 0) {
          await queryClient.invalidateQueries();
        }

        if (result.failedOperations > 0 || result.state === "partial") {
          showErrorNotification({
            message: t("_pages:sync.messages.partial", {
              defaultValue:
                "Some offline changes could not be synchronized. They will be retried automatically.",
            }),
          });
          return;
        }

        if (result.state === "synced" && result.syncedOperations > 0) {
          showSuccessNotification({
            message: t("_pages:sync.messages.success", {
              defaultValue: "Offline changes synchronized successfully.",
            }),
          });
        }
      } catch (error) {
        if (isCancelled) return;

        const parsedError = toSyncHttpError(error);
        if (parsedError.status === 409) {
          showErrorNotification({
            message: t("_pages:sync.errors.deviceConflict", {
              defaultValue:
                "Synchronization blocked due to device conflict. Please verify this account on your current device.",
            }),
          });
          return;
        }

        if (parsedError.status === 401) {
          showErrorNotification({
            message: t("_pages:sync.errors.unauthorized", {
              defaultValue:
                "Session expired. Sign in again to synchronize offline changes.",
            }),
          });
          return;
        }

        showErrorNotification({
          message: t("_pages:sync.errors.generic", {
            defaultValue: "Could not synchronize offline changes.",
          }),
        });
      } finally {
        syncInProgressRef.current = false;
      }
    };

    runSync();

    return () => {
      isCancelled = true;
    };
  }, [
    account?.id,
    isInGuestMode,
    isOnline,
    showErrorNotification,
    showSuccessNotification,
    t,
  ]);

  return <>{children}</>;
};
