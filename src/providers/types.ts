import { ReactNode } from "react";

// lib
import { BaseEntityDto, Manager, NotificationType, Tables } from "lib";

export type BasicProviderPropTypes = {
  children: ReactNode;
};

export type ManagerProviderContextType = {
  client: Manager;
};

export type LocalCacheProviderContextType = {
  data?: FileDataType;
  updateCache: <T = BaseEntityDto>(key: Tables, data: T[]) => void;
  loadCache: <T = BaseEntityDto>(key: Tables) => T[] | null;
};

export type FileCacheProviderContextType = {
  updateFile: (data: FileDataType) => Promise<void>;
  readFile: () => Promise<FileDataType | undefined>;
};

export type FileDataType = {
  [key in Tables]: BaseEntityDto[];
};

export type NotificationContextType = {
  notification: NotificationType[];
  removeNotification: (index?: number) => void;
  showErrorNotification: (options: NotificationType) => void;
  showNotification: (options: NotificationType) => void;
  showSuccessNotification: (options: NotificationType) => void;
  showStackNotifications: (notifications: NotificationType[]) => void;
};
