export type OnlineStatusSnapshot = {
  isBrowserOnline: boolean;
  isServerReachable: boolean;
  isOnline: boolean;
};

export type OnlineStatusListener = () => void;
