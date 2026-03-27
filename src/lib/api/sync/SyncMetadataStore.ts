import { SYNC_METADATA_STORAGE_KEY } from "./constants";
import { SyncMetadata } from "./types";

const defaultMetadata: SyncMetadata = {
  deviceId: null,
  lastSyncAt: null,
  activeSessionId: null,
};

const memoryMetadata: SyncMetadata = {
  ...defaultMetadata,
};

const canUseLocalStorage = (): boolean =>
  typeof window !== "undefined" && typeof window.localStorage !== "undefined";

const createUuid = (): string => {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function")
    return crypto.randomUUID();

  const random = Math.random().toString(16).slice(2);
  return `sync-device-${Date.now()}-${random}`;
};

const parseMetadata = (value: string | null): SyncMetadata => {
  if (!value) return { ...defaultMetadata };

  try {
    const parsed = JSON.parse(value) as Partial<SyncMetadata>;
    return {
      deviceId:
        typeof parsed.deviceId === "string"
          ? parsed.deviceId
          : defaultMetadata.deviceId,
      lastSyncAt:
        typeof parsed.lastSyncAt === "string" || parsed.lastSyncAt === null
          ? parsed.lastSyncAt
          : defaultMetadata.lastSyncAt,
      activeSessionId:
        typeof parsed.activeSessionId === "string" ||
        parsed.activeSessionId === null
          ? parsed.activeSessionId
          : defaultMetadata.activeSessionId,
    };
  } catch {
    return { ...defaultMetadata };
  }
};

export class SyncMetadataStore {
  getMetadata(): SyncMetadata {
    if (!canUseLocalStorage()) return { ...memoryMetadata };

    return parseMetadata(localStorage.getItem(SYNC_METADATA_STORAGE_KEY));
  }

  setMetadata(partial: Partial<SyncMetadata>): SyncMetadata {
    const nextValue = {
      ...this.getMetadata(),
      ...partial,
    };

    if (!canUseLocalStorage()) {
      memoryMetadata.deviceId = nextValue.deviceId;
      memoryMetadata.lastSyncAt = nextValue.lastSyncAt;
      memoryMetadata.activeSessionId = nextValue.activeSessionId;
      return nextValue;
    }

    localStorage.setItem(SYNC_METADATA_STORAGE_KEY, JSON.stringify(nextValue));
    return nextValue;
  }

  setActiveSessionId(sessionId: string | null): SyncMetadata {
    return this.setMetadata({ activeSessionId: sessionId });
  }

  setLastSyncAt(lastSyncAt: string | null): SyncMetadata {
    return this.setMetadata({ lastSyncAt });
  }

  ensureDeviceId(serverDeviceId?: string | null): string {
    const current = this.getMetadata();

    if (current.deviceId) return current.deviceId;

    const nextDeviceId =
      (typeof serverDeviceId === "string" && serverDeviceId.length
        ? serverDeviceId
        : null) ?? createUuid();

    this.setMetadata({ deviceId: nextDeviceId });
    return nextDeviceId;
  }
}

export const syncMetadataStore = new SyncMetadataStore();
