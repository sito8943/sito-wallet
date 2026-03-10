export type AppPreloadTask = {
  key: string;
  enabled: boolean;
  run: () => Promise<void>;
};

export type UseAppPreloadOptions = {
  extraTasks?: AppPreloadTask[];
};

export type UseAppPreloadResult = {
  loading: boolean;
  completedTaskKeys: string[];
  failedTaskKeys: string[];
};
