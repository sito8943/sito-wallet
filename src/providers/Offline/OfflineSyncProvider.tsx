import { useCallback, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";

// @sito/dashboard-app
import { useAuth, useNotification } from "@sito/dashboard-app";

// hooks
import {
  probeServerReachability,
  setServerReachable,
  useOnlineStatus,
  useOnlineStatusSnapshot,
} from "hooks";

// types
import { BasicProviderPropTypes } from "../types";

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
  const queryClient = useQueryClient();
  const isOnline = useOnlineStatus();
  const { isBrowserOnline } = useOnlineStatusSnapshot();
  const { account, isInGuestMode } = useAuth();
  const { showErrorNotification, showSuccessNotification } = useNotification();

  const syncInProgressRef = useRef(false);
  const lastAttemptKeyRef = useRef("");
  const shouldNotifySocketDisconnectRef = useRef(false);
  const socketDisconnectedNotifiedRef = useRef(false);
  const socketHealthCheckInProgressRef = useRef(false);

  const isServerUnavailableError = useCallback((status: number) => {
    return status >= 500;
  }, []);

  const notifyServerUnavailable = useCallback(async () => {
    if (socketDisconnectedNotifiedRef.current) return;
    if (socketHealthCheckInProgressRef.current) return;

    socketHealthCheckInProgressRef.current = true;

    try {
      const isServerReachable = await probeServerReachability();
      if (isServerReachable) {
        setServerReachable(true);
        return;
      }

      socketDisconnectedNotifiedRef.current = true;
      setServerReachable(false);
    } finally {
      socketHealthCheckInProgressRef.current = false;
    }
  }, []);

  const handleSocketEvent = useCallback(
    async (event: SyncSocketEvent): Promise<void> => {
      if (event.event === "SYNC_SESSION_FINISHED") {
        await queryClient.invalidateQueries();
        return;
      }

      if (event.event === "SYNC_SESSION_ERROR") {
        showErrorNotification({
          message: event.message || t("_pages:sync.errors.generic"),
        });
      }
    },
    [queryClient, showErrorNotification, t],
  );

  useEffect(() => {
    if (!isBrowserOnline || !account?.id || isInGuestMode()) {
      shouldNotifySocketDisconnectRef.current = false;
      socketDisconnectedNotifiedRef.current = false;
      setServerReachable(true);
      syncSocketService.disconnect();
      return;
    }

    shouldNotifySocketDisconnectRef.current = true;

    syncSocketService.connect({
      onConnect: () => {
        socketDisconnectedNotifiedRef.current = false;
        setServerReachable(true);
      },
      onDisconnect: () => {
        if (!shouldNotifySocketDisconnectRef.current) return;
        notifyServerUnavailable().catch(() => undefined);
      },
      onStompError: () => {
        if (!shouldNotifySocketDisconnectRef.current) return;
        notifyServerUnavailable().catch(() => undefined);
      },
      onEvent: (event) => {
        handleSocketEvent(event).catch(() => undefined);
      },
    });

    return () => {
      shouldNotifySocketDisconnectRef.current = false;
      setServerReachable(true);
      syncSocketService.disconnect();
    };
  }, [
    account?.id,
    handleSocketEvent,
    isBrowserOnline,
    isInGuestMode,
    notifyServerUnavailable,
  ]);

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
      const hasPendingOperations =
        await offlineSyncService.hasPendingOperations();
      if (!hasPendingOperations || isCancelled) return;

      syncInProgressRef.current = true;
      try {
        const result = await offlineSyncService.syncPendingOperations();
        if (isCancelled) return;

        setServerReachable(true);

        if (result.syncedOperations > 0) {
          await queryClient.invalidateQueries();
        }

        if (result.failedOperations > 0 || result.state === "partial") {
          showErrorNotification({
            message: t("_pages:sync.messages.partial"),
          });
          return;
        }

        if (result.state === "synced" && result.syncedOperations > 0) {
          showSuccessNotification({
            message: t("_pages:sync.messages.success"),
          });
        }
      } catch (error) {
        if (isCancelled) return;

        const parsedError = toSyncHttpError(error);
        if (isServerUnavailableError(parsedError.status)) {
          setServerReachable(false);
          return;
        }

        if (parsedError.status === 409) {
          showErrorNotification({
            message: t("_pages:sync.errors.deviceConflict"),
          });
          return;
        }

        if (parsedError.status === 401) {
          showErrorNotification({
            message: t("_pages:sync.errors.unauthorized"),
          });
          return;
        }

        showErrorNotification({
          message: t("_pages:sync.errors.generic"),
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
    isServerUnavailableError,
    queryClient,
    showErrorNotification,
    showSuccessNotification,
    t,
  ]);

  return <>{children}</>;
};
