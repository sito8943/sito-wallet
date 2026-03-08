import { SYNC_CLIENT_APP_VERSION } from "./constants";
import { syncClient, SyncClient } from "./SyncClient";
import { syncMetadataStore, SyncMetadataStore } from "./SyncMetadataStore";
import { syncQueueStore, SyncQueueStore } from "./SyncQueueStore";
import {
  OfflineSyncRunResult,
  PreparedSyncOperation,
  SYNC_ENTITY_ORDER,
  SyncBulkErrorItem,
  SyncHttpError,
  SyncPayload,
  SyncQueueOperation,
} from "./types";

const isObjectPayload = (
  value: SyncPayload
): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const toSyncHttpError = (error: unknown): SyncHttpError => {
  if (typeof error === "object" && error !== null) {
    const maybeError = error as { status?: number; message?: string };
    if (typeof maybeError.status === "number") {
      return {
        status: maybeError.status,
        message: maybeError.message ?? String(maybeError.status),
      };
    }
  }

  if (error instanceof Error) {
    return {
      status: 500,
      message: error.message,
    };
  }

  return {
    status: 500,
    message: "Unknown error",
  };
};

const mergePayload = (
  base: SyncPayload,
  patch: SyncPayload
): Record<string, unknown> | SyncPayload => {
  if (isObjectPayload(base) && isObjectPayload(patch)) {
    return {
      ...base,
      ...patch,
    };
  }

  return patch;
};

type PreparedOperationsResult = {
  preparedOperations: PreparedSyncOperation[];
  discardedOperationIds: string[];
};

const prepareOperations = (
  operations: SyncQueueOperation[]
): PreparedOperationsResult => {
  const sorted = [...operations].sort((left, right) => {
    if (left.createdAt < right.createdAt) return -1;
    if (left.createdAt > right.createdAt) return 1;
    return left.clientOperationId.localeCompare(right.clientOperationId);
  });

  const preparedOperations: PreparedSyncOperation[] = [];
  const createByLocalKey = new Map<string, PreparedSyncOperation>();
  const canceledCreateKeys = new Set<string>();
  const discardedOperationIds: string[] = [];

  for (const operation of sorted) {
    const hasLocalEntityId = typeof operation.localEntityId === "number";
    const localKey = hasLocalEntityId
      ? `${operation.entity}:${operation.localEntityId}`
      : null;

    const preparedItem = {
      clientOperationId: operation.clientOperationId,
      entity: operation.entity,
      operation: operation.operation,
      clientUpdatedAt: operation.clientUpdatedAt,
      payload: operation.payload,
      sourceOperationIds: [operation.clientOperationId],
    } satisfies PreparedSyncOperation;

    if (!localKey) {
      preparedOperations.push(preparedItem);
      continue;
    }

    const existingCreate = createByLocalKey.get(localKey);

    if (!existingCreate) {
      if (canceledCreateKeys.has(localKey) && operation.operation !== "CREATE") {
        discardedOperationIds.push(operation.clientOperationId);
        continue;
      }

      if (operation.operation === "CREATE") {
        canceledCreateKeys.delete(localKey);
        createByLocalKey.set(localKey, preparedItem);
      }

      preparedOperations.push(preparedItem);
      continue;
    }

    existingCreate.sourceOperationIds.push(operation.clientOperationId);
    existingCreate.clientUpdatedAt = operation.clientUpdatedAt;

    if (operation.operation === "UPDATE") {
      existingCreate.payload = mergePayload(
        existingCreate.payload,
        operation.payload
      );
      continue;
    }

    if (operation.operation === "DELETE") {
      const existingIndex = preparedOperations.indexOf(existingCreate);
      if (existingIndex >= 0) {
        preparedOperations.splice(existingIndex, 1);
      }

      discardedOperationIds.push(...existingCreate.sourceOperationIds);
      createByLocalKey.delete(localKey);
      canceledCreateKeys.add(localKey);
      continue;
    }
  }

  return {
    preparedOperations,
    discardedOperationIds: [...new Set(discardedOperationIds)],
  };
};

const buildResult = (
  state: OfflineSyncRunResult["state"],
  totalOperations: number,
  syncedOperations: number,
  failedOperations: number,
  errors: SyncBulkErrorItem[]
): OfflineSyncRunResult => ({
  state,
  totalOperations,
  syncedOperations,
  failedOperations,
  errors,
});

export class OfflineSyncService {
  constructor(
    private readonly queueStore: SyncQueueStore = syncQueueStore,
    private readonly metadataStore: SyncMetadataStore = syncMetadataStore,
    private readonly apiClient: SyncClient = syncClient
  ) {}

  async hasPendingOperations(): Promise<boolean> {
    return (await this.queueStore.countOperations()) > 0;
  }

  async syncPendingOperations(): Promise<OfflineSyncRunResult> {
    const queuedOperations = await this.queueStore.listOperations();

    if (!queuedOperations.length) return buildResult("idle", 0, 0, 0, []);

    const { preparedOperations, discardedOperationIds } =
      prepareOperations(queuedOperations);

    if (discardedOperationIds.length) {
      await this.queueStore.removeOperationsByClientIds(discardedOperationIds);
    }

    if (!preparedOperations.length) return buildResult("idle", 0, 0, 0, []);

    const status = await this.apiClient.status();
    const now = new Date().toISOString();
    const metadata = this.metadataStore.getMetadata();
    const deviceId = this.metadataStore.ensureDeviceId(status.deviceId);

    if (metadata.activeSessionId) {
      await this.apiClient
        .cancelSession({
          sessionId: metadata.activeSessionId,
          reason: "Client recovery: stale session",
        })
        .catch(() => undefined);
      this.metadataStore.setActiveSessionId(null);
    }

    const startedSession = await this.apiClient.startSession({
      deviceId,
      clientTime: now,
      lastKnownSyncAt: metadata.lastSyncAt || status.lastSyncAt,
      appVersion: SYNC_CLIENT_APP_VERSION,
    });

    this.metadataStore.setActiveSessionId(startedSession.sessionId);

    let syncedOperations = 0;
    let failedOperations = 0;
    const errors: SyncBulkErrorItem[] = [];

    try {
      for (const entity of SYNC_ENTITY_ORDER) {
        const entityOperations = preparedOperations.filter(
          (item) => item.entity === entity
        );
        if (!entityOperations.length) continue;

        const response = await this.apiClient.sendBulk(entity, {
          sessionId: startedSession.sessionId,
          entity,
          items: entityOperations.map((item) => ({
            clientOperationId: item.clientOperationId,
            operation: item.operation,
            clientUpdatedAt: item.clientUpdatedAt,
            payload: item.payload,
          })),
        });

        const failedByClientOperationId = new Set(
          response.errors.map((item) => item.clientOperationId)
        );

        const successfulSourceIds = entityOperations
          .filter(
            (operation) =>
              !failedByClientOperationId.has(operation.clientOperationId)
          )
          .flatMap((operation) => operation.sourceOperationIds);

        if (successfulSourceIds.length) {
          await this.queueStore.removeOperationsByClientIds(successfulSourceIds);
        }

        syncedOperations += response.applied + response.skipped;
        failedOperations += response.failed;
        errors.push(...response.errors);
      }

      try {
        const finishResponse = await this.apiClient.finishSession({
          sessionId: startedSession.sessionId,
        });

        this.metadataStore.setMetadata({
          activeSessionId: null,
          lastSyncAt:
            finishResponse.lastSyncAt ||
            startedSession.profileLastSyncAt ||
            status.lastSyncAt,
          deviceId: startedSession.profileDeviceId || deviceId,
        });
      } catch (finishError) {
        const parsedFinishError = toSyncHttpError(finishError);

        if (failedOperations > 0 && parsedFinishError.status === 400) {
          this.metadataStore.setActiveSessionId(null);

          return buildResult(
            "partial",
            preparedOperations.length,
            syncedOperations,
            failedOperations,
            errors
          );
        }

        throw finishError;
      }
    } catch (error) {
      await this.apiClient
        .cancelSession({
          sessionId: startedSession.sessionId,
          reason: "Client sync aborted",
        })
        .catch(() => undefined);
      this.metadataStore.setActiveSessionId(null);
      throw error;
    }

    if (failedOperations > 0) {
      return buildResult(
        "partial",
        preparedOperations.length,
        syncedOperations,
        failedOperations,
        errors
      );
    }

    return buildResult(
      "synced",
      preparedOperations.length,
      syncedOperations,
      failedOperations,
      errors
    );
  }
}

export const offlineSyncService = new OfflineSyncService();
export { toSyncHttpError };

