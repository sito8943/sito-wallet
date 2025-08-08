import { ReactNode } from "react";

// lib
import {
  BaseEntityDto,
  Manager,
  NotificationType,
  SessionDto,
  Tables,
} from "lib";

export type BasicProviderPropTypes = {
  children: ReactNode;
};

export type ManagerProviderContextType = {
  client: Manager;
};

export type AuthProviderContextType = {
  account: SessionDto;
  logUser: (data: SessionDto) => void;
  logoutUser: () => void;
  logUserFromLocal: () => Promise<void>;
  isInGuestMode: () => boolean;
  setGuestMode: (value: boolean) => void;
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
  showErrorNotification: (options: Partial<NotificationType>) => void;
  showNotification: (options: NotificationType) => void;
  showSuccessNotification: (options: Partial<NotificationType>) => void;
  showStackNotifications: (notifications: NotificationType[]) => void;
};
