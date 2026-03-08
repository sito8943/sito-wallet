import type { OnlineStatusListener, OnlineStatusSnapshot } from "./types";

const listeners = new Set<OnlineStatusListener>();

const initialBrowserOnline =
  typeof navigator === "undefined" ? true : navigator.onLine;

const serverSnapshot: OnlineStatusSnapshot = {
  isBrowserOnline: true,
  isServerReachable: true,
  isOnline: true,
};

let snapshot: OnlineStatusSnapshot = {
  isBrowserOnline: initialBrowserOnline,
  isServerReachable: true,
  isOnline: initialBrowserOnline,
};

const emitChange = () => {
  listeners.forEach((listener) => listener());
};

export const getSnapshot = (): OnlineStatusSnapshot => snapshot;

export const getServerSnapshot = (): OnlineStatusSnapshot => serverSnapshot;

export const addSnapshotListener = (listener: OnlineStatusListener): void => {
  listeners.add(listener);
};

export const removeSnapshotListener = (
  listener: OnlineStatusListener,
): void => {
  listeners.delete(listener);
};

export const hasSnapshotListeners = (): boolean => listeners.size > 0;

const updateSnapshot = (nextValues: Partial<OnlineStatusSnapshot>) => {
  const nextBrowserOnline =
    nextValues.isBrowserOnline ?? snapshot.isBrowserOnline;
  const nextServerReachable =
    nextValues.isServerReachable ?? snapshot.isServerReachable;
  const nextOnline = nextBrowserOnline && nextServerReachable;

  console.log(
    "Updating online status snapshot:",
    { nextBrowserOnline, nextServerReachable, nextOnline },
    { current: snapshot },
  );
  if (
    snapshot.isBrowserOnline === nextBrowserOnline &&
    snapshot.isServerReachable === nextServerReachable &&
    snapshot.isOnline === nextOnline
  ) {
    return;
  }

  snapshot = {
    isBrowserOnline: nextBrowserOnline,
    isServerReachable: nextServerReachable,
    isOnline: nextOnline,
  };

  emitChange();
};

export const setBrowserOnline = (value: boolean) => {
  updateSnapshot({ isBrowserOnline: value });
};

export const setServerReachable = (value: boolean) => {
  updateSnapshot({ isServerReachable: value });
};
