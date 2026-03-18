import { useEffect, useMemo, useState } from "react";

// @sito/dashboard-app
import { useAuth } from "@sito/dashboard-app";

// lib
import { preloadOfflineBootstrapData } from "lib";

// providers
import { useFeatureFlags, useManager, useOfflineManager } from "providers";

// hooks
import { useOnlineStatus } from "../useOnlineStatus";

// types
import type {
  AppPreloadTask,
  UseAppPreloadOptions,
  UseAppPreloadResult,
} from "./types";

const EMPTY_PRELOAD_TASKS: AppPreloadTask[] = [];
const EMPTY_TASK_KEYS: string[] = [];

export function useAppPreload(
  options: UseAppPreloadOptions = {},
): UseAppPreloadResult {
  const { account, isInGuestMode } = useAuth();
  const manager = useManager();
  const offlineManager = useOfflineManager();

  const { refreshFeatures } = useFeatureFlags();
  const isOnline = useOnlineStatus();
  const isGuestMode = isInGuestMode();

  const extraTasks = options.extraTasks ?? EMPTY_PRELOAD_TASKS;

  const offlineBootstrapTask = useMemo<AppPreloadTask>(
    () => ({
      key: "offline-bootstrap",
      enabled: Boolean(account?.id) && !isGuestMode && isOnline,
      run: async () => preloadOfflineBootstrapData(manager, offlineManager),
    }),
    [account?.id, isGuestMode, isOnline, manager, offlineManager],
  );

  const tasksToRefreshFeatures = useMemo<AppPreloadTask>(
    () => ({
      key: "refresh-features",
      enabled: Boolean(account?.id) && !isGuestMode,
      run: async () => refreshFeatures(),
    }),
    [account?.id, isGuestMode, refreshFeatures],
  );

  const requiredTasks = useMemo(
    () =>
      [...extraTasks, offlineBootstrapTask, tasksToRefreshFeatures].filter(
        (task) => task.enabled,
      ),
    [extraTasks, offlineBootstrapTask, tasksToRefreshFeatures],
  );

  const requiredTasksSignature = useMemo(
    () =>
      [
        account?.id ?? "anonymous",
        account?.token ?? "no-token",
        isGuestMode ? "guest" : "authenticated",
        isOnline ? "online" : "offline",
        ...requiredTasks.map((task) => task.key),
      ].join("|"),
    [account?.id, account?.token, isGuestMode, isOnline, requiredTasks],
  );

  const [hasSettledOnce, setHasSettledOnce] = useState(false);
  const [lastSettledSignature, setLastSettledSignature] = useState("");
  const [completedTaskKeys, setCompletedTaskKeys] = useState<string[]>([]);
  const [failedTaskKeys, setFailedTaskKeys] = useState<string[]>([]);

  useEffect(() => {
    let isMounted = true;

    if (requiredTasks.length === 0) return;
    if (lastSettledSignature === requiredTasksSignature) return;

    const runSignature = requiredTasksSignature;
    Promise.allSettled(requiredTasks.map((task) => task.run())).then(
      (results) => {
        if (!isMounted) return;

        const completed = requiredTasks
          .filter((_, index) => results[index]?.status === "fulfilled")
          .map((task) => task.key);

        const failed = requiredTasks
          .filter((_, index) => results[index]?.status === "rejected")
          .map((task) => task.key);

        setHasSettledOnce(true);
        setCompletedTaskKeys(completed);
        setFailedTaskKeys(failed);
        setLastSettledSignature(runSignature);
      },
    );

    return () => {
      isMounted = false;
    };
  }, [lastSettledSignature, requiredTasks, requiredTasksSignature]);

  const loading =
    !hasSettledOnce &&
    requiredTasks.length > 0 &&
    lastSettledSignature !== requiredTasksSignature;
  const visibleCompletedTaskKeys =
    requiredTasks.length > 0 ? completedTaskKeys : EMPTY_TASK_KEYS;
  const visibleFailedTaskKeys =
    requiredTasks.length > 0 ? failedTaskKeys : EMPTY_TASK_KEYS;

  return {
    loading,
    completedTaskKeys: visibleCompletedTaskKeys,
    failedTaskKeys: visibleFailedTaskKeys,
  };
}
