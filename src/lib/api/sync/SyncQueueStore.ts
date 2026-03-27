import {
  SYNC_DB_NAME,
  SYNC_DB_STORE_OPERATIONS,
  SYNC_DB_VERSION,
} from "./constants";
import {
  EnqueueSyncOperationInput,
  SyncQueueOperation,
  SyncOperationType,
  SyncPayload,
} from "./types";

const createClientOperationId = (): string => {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function")
    return crypto.randomUUID();

  return `op-${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

const nowIsoString = (): string => new Date().toISOString();

const sortOperations = (
  left: SyncQueueOperation,
  right: SyncQueueOperation,
): number => {
  if (left.createdAt < right.createdAt) return -1;
  if (left.createdAt > right.createdAt) return 1;
  return left.clientOperationId.localeCompare(right.clientOperationId);
};

const hasIndexedDb = (): boolean =>
  typeof indexedDB !== "undefined" && indexedDB !== null;

const isObjectStorePayload = (value: unknown): value is SyncQueueOperation[] =>
  Array.isArray(value);

export class SyncQueueStore {
  private memoryOperations: SyncQueueOperation[] = [];

  private openDb(): Promise<IDBDatabase> {
    if (!hasIndexedDb()) throw new Error("IndexedDB is not available");

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(SYNC_DB_NAME, SYNC_DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(SYNC_DB_STORE_OPERATIONS)) {
          db.createObjectStore(SYNC_DB_STORE_OPERATIONS, {
            keyPath: "clientOperationId",
          });
        }
      };

      request.onsuccess = (event) => {
        resolve((event.target as IDBOpenDBRequest).result);
      };

      request.onerror = () => {
        reject(
          request.error ?? new Error("Could not open sync queue database"),
        );
      };
    });
  }

  private async listMemoryOperations(): Promise<SyncQueueOperation[]> {
    return [...this.memoryOperations].sort(sortOperations);
  }

  async enqueue(input: EnqueueSyncOperationInput): Promise<SyncQueueOperation> {
    const operation: SyncQueueOperation = {
      clientOperationId: createClientOperationId(),
      clientUpdatedAt: nowIsoString(),
      createdAt: nowIsoString(),
      ...input,
    };

    if (!hasIndexedDb()) {
      this.memoryOperations.push(operation);
      this.memoryOperations.sort(sortOperations);
      return operation;
    }

    const db = await this.openDb();

    return new Promise((resolve, reject) => {
      const tx = db.transaction(SYNC_DB_STORE_OPERATIONS, "readwrite");
      const store = tx.objectStore(SYNC_DB_STORE_OPERATIONS);

      store.put(operation);

      tx.oncomplete = () => {
        db.close();
        resolve(operation);
      };

      tx.onerror = () => {
        db.close();
        reject(tx.error ?? new Error("Could not enqueue sync operation"));
      };
    });
  }

  async listOperations(): Promise<SyncQueueOperation[]> {
    if (!hasIndexedDb()) return this.listMemoryOperations();

    const db = await this.openDb();

    return new Promise((resolve, reject) => {
      const tx = db.transaction(SYNC_DB_STORE_OPERATIONS, "readonly");
      const store = tx.objectStore(SYNC_DB_STORE_OPERATIONS);
      const request = store.getAll();

      request.onsuccess = () => {
        db.close();
        const value = request.result;
        if (!isObjectStorePayload(value)) {
          resolve([]);
          return;
        }
        resolve(value.sort(sortOperations));
      };

      request.onerror = () => {
        db.close();
        reject(request.error ?? new Error("Could not read sync operations"));
      };
    });
  }

  async removeOperationsByClientIds(ids: string[]): Promise<void> {
    if (!ids.length) return;

    if (!hasIndexedDb()) {
      const toRemove = new Set(ids);
      this.memoryOperations = this.memoryOperations.filter(
        (item) => !toRemove.has(item.clientOperationId),
      );
      return;
    }

    const db = await this.openDb();

    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(SYNC_DB_STORE_OPERATIONS, "readwrite");
      const store = tx.objectStore(SYNC_DB_STORE_OPERATIONS);

      ids.forEach((id) => {
        store.delete(id);
      });

      tx.oncomplete = () => {
        db.close();
        resolve();
      };

      tx.onerror = () => {
        db.close();
        reject(tx.error ?? new Error("Could not remove sync operations"));
      };
    });
  }

  async countOperations(): Promise<number> {
    if (!hasIndexedDb()) return this.memoryOperations.length;

    const db = await this.openDb();

    return new Promise((resolve, reject) => {
      const tx = db.transaction(SYNC_DB_STORE_OPERATIONS, "readonly");
      const store = tx.objectStore(SYNC_DB_STORE_OPERATIONS);
      const request = store.count();

      request.onsuccess = () => {
        db.close();
        resolve(request.result);
      };

      request.onerror = () => {
        db.close();
        reject(request.error ?? new Error("Could not count sync operations"));
      };
    });
  }

  async clear(): Promise<void> {
    if (!hasIndexedDb()) {
      this.memoryOperations = [];
      return;
    }

    const db = await this.openDb();

    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(SYNC_DB_STORE_OPERATIONS, "readwrite");
      const store = tx.objectStore(SYNC_DB_STORE_OPERATIONS);
      store.clear();

      tx.oncomplete = () => {
        db.close();
        resolve();
      };

      tx.onerror = () => {
        db.close();
        reject(tx.error ?? new Error("Could not clear sync operations"));
      };
    });
  }
}

export const syncQueueStore = new SyncQueueStore();

export const queueSyncOperation = async (
  entity: EnqueueSyncOperationInput["entity"],
  operation: SyncOperationType,
  payload: SyncPayload,
  localEntityId?: number,
): Promise<void> => {
  try {
    await syncQueueStore.enqueue({
      entity,
      operation,
      payload,
      localEntityId,
    });
  } catch (error) {
    console.error("Failed to queue sync operation", error);
  }
};
